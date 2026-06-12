'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath }    from 'next/cache'
import { redirect }          from 'next/navigation'

export async function confirmConsent(token: string) {
  const admin = createAdminClient()

  const { data: sub } = await admin
    .from('candidate_submissions')
    .select('id, candidate_name, job_post_id, recruiter_id, consent_status, consent_token_expires_at')
    .eq('consent_token', token)
    .single()

  if (!sub || sub.consent_status !== 'pending_consent') redirect(`/consent/${token}?result=already`)
  if (new Date(sub.consent_token_expires_at) < new Date()) redirect(`/consent/${token}?result=expired`)

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

  revalidatePath('/employer/dashboard')
  revalidatePath('/recruiter/dashboard/submissions')
  redirect(`/consent/${token}?result=confirmed`)
}

export async function withdrawConsent(token: string) {
  const admin = createAdminClient()

  const { data: sub } = await admin
    .from('candidate_submissions')
    .select('id, candidate_name, recruiter_id, consent_status')
    .eq('consent_token', token)
    .single()

  if (!sub || sub.consent_status !== 'pending_consent') redirect(`/consent/${token}?result=already`)

  await admin
    .from('candidate_submissions')
    .update({ consent_status: 'withdrawn' })
    .eq('consent_token', token)

  // Notify recruiter
  const { data: rec } = await admin
    .from('recruiters').select('user_id').eq('id', sub.recruiter_id).single()

  if (rec?.user_id) {
    await admin.from('notifications').insert({
      user_id: rec.user_id,
      type:    'candidate_withdrawn',
      title:   `${sub.candidate_name} withdrew their submission`,
      body:    `${sub.candidate_name} declined this submission. Your credibility score has been noted.`,
      link:    `/recruiter/dashboard/submissions`,
    })
  }

  revalidatePath('/recruiter/dashboard/submissions')
  redirect(`/consent/${token}?result=withdrawn`)
}
