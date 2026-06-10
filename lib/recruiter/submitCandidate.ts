'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function submitCandidate(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  const { data: recruiter } = await supabase
    .from('recruiters')
    .select('id, is_verified, years_of_experience, linkedin_url')
    .eq('user_id', user.id)
    .single()

  if (!recruiter) throw new Error('Recruiter profile not found')
  if (!recruiter.is_verified) throw new Error('Your account is pending verification. Please wait for admin approval before submitting candidates.')

  const profileIncomplete =
    (!recruiter.years_of_experience && recruiter.years_of_experience !== 0) ||
    !recruiter.linkedin_url
  if (profileIncomplete) throw new Error('Please complete your recruiter profile before submitting candidates.')

  const resumeFile = formData.get('resume') as File
  if (!resumeFile || resumeFile.size === 0)
    throw new Error('Resume is required')

  const admin = createAdminClient()

  const ext = resumeFile.name.split('.').pop()
  const filePath = `${recruiter.id}/${Date.now()}.${ext}`

  const { error: uploadError } = await admin.storage
    .from('candidate-resumes')
    .upload(filePath, resumeFile)

  if (uploadError) throw new Error(`Resume upload failed: ${uploadError.message}`)

  const {
    data: { publicUrl },
  } = admin.storage.from('candidate-resumes').getPublicUrl(filePath)

  const raw = (key: string) => formData.get(key) as string
  const optional = (key: string) => raw(key) || null
  const optionalNum = (key: string) => {
    const v = raw(key)
    return v ? Number(v) : null
  }

  const jobPostId = raw('job_post_id')
  // current_ctc is entered in LPA — store as rupees so employer view (÷100000) is correct
  const ctcLPA = optionalNum('current_ctc')

  const { error } = await supabase.from('candidate_submissions').insert({
    job_post_id: jobPostId,
    recruiter_id: recruiter.id,
    candidate_name: raw('candidate_name'),
    email: raw('email'),
    current_ctc: ctcLPA != null ? Math.round(ctcLPA * 100000) : null,
    current_location: optional('current_location'),
    total_experience: optionalNum('total_experience'),
    notice_period: optional('notice_period'),
    linkedin_url:  raw('linkedin_url'),
    portfolio_url: raw('portfolio_url'),
    resume_url: publicUrl,
    recruiter_note: raw('recruiter_note'),
  })

  if (error) throw error

  // Invalidate employer-side pages so the new submission appears immediately
  revalidatePath(`/employer/dashboard/jobs/${jobPostId}/applicants`)
  revalidatePath(`/employer/dashboard/jobs/${jobPostId}`)
  revalidatePath('/employer/dashboard/jobs')
  revalidatePath('/employer/dashboard')
  // Invalidate recruiter's own submission view
  revalidatePath('/recruiter/dashboard')

  // In-app notification → employer who owns this job (non-blocking)
  ;(async () => {
    const { data: jobPost } = await admin
      .from('job_posts')
      .select('title, employer_id')
      .eq('id', jobPostId)
      .single()

    if (!jobPost?.employer_id) return

    const { data: employer } = await admin
      .from('employers')
      .select('user_id')
      .eq('id', jobPost.employer_id)
      .single()

    if (!employer?.user_id) return

    const candidateName = raw('candidate_name')

    await admin.from('notifications').insert({
      user_id: employer.user_id,
      type:    'new_candidate',
      title:   `New candidate for "${jobPost.title}"`,
      body:    `${candidateName} was submitted for your opening. Review their profile and decide on the next steps.`,
      link:    `/employer/dashboard/jobs/${jobPostId}/applicants`,
    })
  })().catch(err => console.error('[Employer notification]', err))

  return true
}
