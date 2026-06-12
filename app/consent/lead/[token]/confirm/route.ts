import { NextResponse }      from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params
  const origin    = new URL(req.url).origin
  const base      = `${origin}/consent/lead/${token}`

  const admin = createAdminClient()

  const { data: lead } = await admin
    .from('recruiter_leads')
    .select('id, applicant_name, email, phone, current_job_title, current_company, current_ctc, current_location, total_experience, notice_period, linkedin_url, resume_url, cover_note, recruiter_id, job_post_id, status, consent_token_expires_at, submission_id')
    .eq('consent_token', token)
    .single()

  if (!lead)                                                              return NextResponse.redirect(`${base}?result=not_found`)
  if (lead.status === 'consented')                                        return NextResponse.redirect(`${base}?result=confirmed`)
  if (lead.status === 'rejected')                                         return NextResponse.redirect(`${base}?result=withdrawn`)
  if (!lead.consent_token_expires_at)                                     return NextResponse.redirect(`${base}?result=not_found`)
  if (new Date(lead.consent_token_expires_at) < new Date())               return NextResponse.redirect(`${base}?result=expired`)

  // Create the candidate_submission from lead data
  // Use a default expected_ctc same as current for now (recruiter can update later)
  const { data: submission, error: subErr } = await admin
    .from('candidate_submissions')
    .insert({
      job_post_id:       lead.job_post_id,
      recruiter_id:      lead.recruiter_id,
      candidate_name:    lead.applicant_name,
      email:             lead.email,
      phone:             lead.phone,
      current_job_title: lead.current_job_title,
      current_company:   lead.current_company,
      current_ctc:       lead.current_ctc,
      current_location:  lead.current_location,
      total_experience:  lead.total_experience,
      notice_period:     lead.notice_period,
      linkedin_url:      lead.linkedin_url,
      resume_url:        lead.resume_url,
      recruiter_note:    lead.cover_note,
      consent_status:    'consented',
    })
    .select('id')
    .single()

  if (subErr) {
    console.error('[Lead consent confirm] submission insert error:', subErr)
    return NextResponse.redirect(`${base}?result=error`)
  }

  // Mark lead as consented and link submission
  await admin
    .from('recruiter_leads')
    .update({ status: 'consented', submission_id: submission.id })
    .eq('consent_token', token)

  // Notify employer
  const { data: jobPost } = await admin
    .from('job_posts')
    .select('title, employer_id')
    .eq('id', lead.job_post_id)
    .single()

  if (jobPost?.employer_id) {
    const { data: employer } = await admin
      .from('employers').select('user_id').eq('id', jobPost.employer_id).single()

    if (employer?.user_id) {
      await admin.from('notifications').insert({
        user_id: employer.user_id,
        type:    'new_candidate',
        title:   `New candidate for "${jobPost.title}"`,
        body:    `${lead.applicant_name} confirmed their candidacy and is now visible in your applicants.`,
        link:    `/employer/dashboard/jobs/${lead.job_post_id}/applicants`,
      })
    }
  }

  // Notify recruiter
  const { data: rec } = await admin
    .from('recruiters').select('user_id').eq('id', lead.recruiter_id).single()

  if (rec?.user_id) {
    await admin.from('notifications').insert({
      user_id: rec.user_id,
      type:    'candidate_confirmed',
      title:   `${lead.applicant_name} confirmed consent`,
      body:    `Their profile is now live with the employer.`,
      link:    `/recruiter/dashboard/leads`,
    })
  }

  return NextResponse.redirect(`${base}?result=confirmed`)
}
