import { NextResponse }      from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params
  const origin    = new URL(req.url).origin
  const base      = `${origin}/consent/${token}`

  const admin = createAdminClient()

  const { data: sub } = await admin
    .from('candidate_submissions')
    .select('id, candidate_name, job_post_id, recruiter_id, consent_status, consent_token_expires_at')
    .eq('consent_token', token)
    .single()

  if (!sub)                                                        return NextResponse.redirect(`${base}?result=not_found`)
  if (sub.consent_status === 'consented')                          return NextResponse.redirect(`${base}?result=confirmed`)
  if (sub.consent_status === 'withdrawn')                          return NextResponse.redirect(`${base}?result=withdrawn`)
  if (new Date(sub.consent_token_expires_at) < new Date())         return NextResponse.redirect(`${base}?result=expired`)

  // Confirm
  await admin
    .from('candidate_submissions')
    .update({ consent_status: 'consented' })
    .eq('consent_token', token)

  // Notify employer
  const { data: jobPost } = await admin
    .from('job_posts')
    .select('title, employer_id')
    .eq('id', sub.job_post_id)
    .single()

  if (jobPost?.employer_id) {
    const { data: employer } = await admin
      .from('employers').select('user_id').eq('id', jobPost.employer_id).single()

    if (employer?.user_id) {
      await admin.from('notifications').insert({
        user_id: employer.user_id,
        type:    'new_candidate',
        title:   `New candidate for "${jobPost.title}"`,
        body:    `${sub.candidate_name} confirmed their candidacy and is now visible in your applicants.`,
        link:    `/employer/dashboard/jobs/${sub.job_post_id}/applicants`,
      })
    }
  }

  // Notify recruiter
  const { data: rec } = await admin
    .from('recruiters').select('user_id').eq('id', sub.recruiter_id).single()

  if (rec?.user_id) {
    await admin.from('notifications').insert({
      user_id: rec.user_id,
      type:    'candidate_confirmed',
      title:   `${sub.candidate_name} confirmed their submission`,
      body:    `Their profile is now live with the employer.`,
      link:    `/recruiter/dashboard/submissions`,
    })
  }

  return NextResponse.redirect(`${base}?result=confirmed`)
}
