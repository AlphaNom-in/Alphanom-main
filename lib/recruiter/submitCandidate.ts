'use server'

import { createClient }      from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath }    from 'next/cache'
import { sendBrevoEmail }    from '@/lib/email/brevo'
import { consentEmailHtml }  from '@/lib/email/templates'

export async function submitCandidate(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: recruiter } = await supabase
    .from('recruiters')
    .select('id, full_name, is_verified, years_of_experience, linkedin_url')
    .eq('user_id', user.id)
    .single()

  if (!recruiter) throw new Error('Recruiter profile not found')
  if (!recruiter.is_verified) throw new Error('Your account is pending verification. Please wait for admin approval before submitting candidates.')

  const profileIncomplete =
    (!recruiter.years_of_experience && recruiter.years_of_experience !== 0) ||
    !recruiter.linkedin_url
  if (profileIncomplete) throw new Error('Please complete your recruiter profile before submitting candidates.')

  const resumeFile = formData.get('resume') as File
  if (!resumeFile || resumeFile.size === 0) throw new Error('Resume is required')

  const admin    = createAdminClient()

  const raw       = (key: string) => formData.get(key) as string
  const optional  = (key: string) => raw(key) || null
  const optNum    = (key: string) => { const v = raw(key); return v ? Number(v) : null }

  const jobPostId = raw('job_post_id')

  // Reject submissions to paused or closed jobs
  const { data: jobCheck } = await admin
    .from('job_posts')
    .select('status, application_limit')
    .eq('id', jobPostId)
    .single()

  if (!jobCheck || jobCheck.status !== 'active') {
    throw new Error('This job is no longer accepting submissions.')
  }

  // Hard limit: 7 unique submissions per recruiter per job
  const { count } = await admin
    .from('candidate_submissions')
    .select('id', { count: 'exact', head: true })
    .eq('recruiter_id', recruiter.id)
    .eq('job_post_id', jobPostId)
  if ((count ?? 0) >= 7) throw new Error('You have used all 7 submission slots for this role. No further submissions are allowed.')

  const ext      = resumeFile.name.split('.').pop()
  const filePath = `${recruiter.id}/${Date.now()}.${ext}`

  const { error: uploadError } = await admin.storage
    .from('candidate-resumes')
    .upload(filePath, resumeFile)
  if (uploadError) throw new Error(`Resume upload failed: ${uploadError.message}`)

  const { data: { publicUrl } } = admin.storage.from('candidate-resumes').getPublicUrl(filePath)

  const ctcLPA         = optNum('current_ctc')
  const expectedCtcLPA = optNum('expected_ctc')

  // Generate consent token (48 h expiry)
  const consentToken  = crypto.randomUUID()
  const consentExpiry = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString()

  const { data: submission, error } = await supabase
    .from('candidate_submissions')
    .insert({
      job_post_id:       jobPostId,
      recruiter_id:      recruiter.id,
      candidate_name:    raw('candidate_name'),
      email:             raw('email'),
      phone:             raw('phone'),
      current_job_title: raw('current_job_title'),
      current_company:   raw('current_company'),
      current_ctc:       ctcLPA         != null ? Math.round(ctcLPA         * 100000) : null,
      expected_ctc:      expectedCtcLPA != null ? Math.round(expectedCtcLPA * 100000) : null,
      current_location:  optional('current_location'),
      total_experience:  optNum('total_experience'),
      notice_period:     raw('notice_period'),
      linkedin_url:      raw('linkedin_url'),
      portfolio_url:     raw('portfolio_url'),
      resume_url:               publicUrl,
      recruiter_note:           raw('fit_reason'),
      recruiter_name_snapshot:  recruiter.full_name ?? null,
      consent_status:              'pending_consent',
      consent_token:               consentToken,
      consent_token_expires_at:    consentExpiry,
    })
    .select('id')
    .single()

  if (error) throw error

  // Auto-pause job if application_limit is reached
  if (jobCheck.application_limit) {
    const { count: totalCount } = await admin
      .from('candidate_submissions')
      .select('id', { count: 'exact', head: true })
      .eq('job_post_id', jobPostId)

    if ((totalCount ?? 0) >= jobCheck.application_limit) {
      await admin
        .from('job_posts')
        .update({ status: 'paused', auto_paused: true })
        .eq('id', jobPostId)
      revalidatePath('/employer/dashboard/jobs')
    }
  }

  // Fetch job + company for the email
  const { data: jobPost } = await admin
    .from('job_posts')
    .select('title, employers(company_name)')
    .eq('id', jobPostId)
    .single()

  const jobTitle    = jobPost?.title ?? 'the position'
  const companyName = (jobPost?.employers as any)?.company_name ?? 'the company'
  const recruiterName   = recruiter.full_name ?? user.email?.split('@')[0] ?? 'Your Recruiter'
  const candidateName   = raw('candidate_name')
  const candidateEmail  = raw('email')
  const candidateFirst  = candidateName.split(' ')[0]

  const base       = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  const confirmUrl = `${base}/consent/${consentToken}/confirm`
  const withdrawUrl= `${base}/consent/${consentToken}?withdraw=1`

  // Send consent email — await so it actually sends; swallow errors so submission still succeeds
  try {
    await sendBrevoEmail({
      to:       candidateEmail,
      toName:   candidateName,
      subject:  `Action required: Confirm your application — ${jobTitle} at ${companyName}`,
      html:     consentEmailHtml({ candidateFirstName: candidateFirst, recruiterName, jobTitle, companyName, confirmUrl, withdrawUrl }),
      fromName: recruiterName,
    })
  } catch (err) {
    console.error('[Consent email send failed]', err)
  }

  revalidatePath('/recruiter/dashboard/submissions')
  revalidatePath('/recruiter/dashboard')

  return { submissionId: submission.id, candidateEmail }
}

// Resend consent email for an expired / pending submission
export async function resendConsentEmail(submissionId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: recruiter } = await supabase
    .from('recruiters')
    .select('id, full_name')
    .eq('user_id', user.id)
    .single()
  if (!recruiter) throw new Error('Not found')

  const admin = createAdminClient()

  const { data: sub } = await admin
    .from('candidate_submissions')
    .select('id, candidate_name, email, consent_status, job_post_id, recruiter_id')
    .eq('id', submissionId)
    .eq('recruiter_id', recruiter.id)
    .single()

  if (!sub) throw new Error('Submission not found')
  if (sub.consent_status !== 'pending_consent') throw new Error('Cannot resend — submission is no longer pending.')

  const newToken  = crypto.randomUUID()
  const newExpiry = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString()

  await admin
    .from('candidate_submissions')
    .update({ consent_token: newToken, consent_token_expires_at: newExpiry })
    .eq('id', submissionId)

  const { data: jobPost } = await admin
    .from('job_posts')
    .select('title, employers(company_name)')
    .eq('id', sub.job_post_id)
    .single()

  const jobTitle    = jobPost?.title ?? 'the position'
  const companyName = (jobPost?.employers as any)?.company_name ?? 'the company'
  const recruiterName   = recruiter.full_name ?? user.email?.split('@')[0] ?? 'Your Recruiter'
  const base        = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

  await sendBrevoEmail({
    to:       sub.email,
    toName:   sub.candidate_name,
    subject:  `Reminder: Your application — ${jobTitle} at ${companyName}`,
    html:     consentEmailHtml({
      candidateFirstName: sub.candidate_name.split(' ')[0],
      recruiterName,
      jobTitle,
      companyName,
      confirmUrl:  `${base}/consent/${newToken}/confirm`,
      withdrawUrl: `${base}/consent/${newToken}?withdraw=1`,
    }),
    fromName: recruiterName,
  })

  revalidatePath('/recruiter/dashboard/submissions')
}
