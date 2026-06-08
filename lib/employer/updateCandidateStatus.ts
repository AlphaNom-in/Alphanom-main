'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function updateCandidateStatus(
  submissionId: string,
  status: string,
  jobId: string
) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Verify this employer owns the job the submission belongs to
  const { data: employer } = await supabase
    .from('employers').select('id').eq('user_id', user.id).single()
  if (!employer) throw new Error('Employer not found')

  const { data: job } = await supabase
    .from('job_posts').select('id')
    .eq('id', jobId)
    .eq('employer_id', employer.id)
    .single()
  if (!job) throw new Error('Job not found')

  const admin = createAdminClient()

  // Update candidate status
  const { error } = await admin
    .from('candidate_submissions')
    .update({ status })
    .eq('id', submissionId)
    .eq('job_post_id', jobId)

  if (error) throw error

  revalidatePath(`/employer/dashboard/jobs/${jobId}/applicants`)
  revalidatePath(`/employer/dashboard/jobs/${jobId}`)
  revalidatePath('/employer/dashboard/jobs')
  revalidatePath('/employer/dashboard')
  revalidatePath('/recruiter/dashboard/all-jobs')
  revalidatePath('/recruiter/dashboard/my-jobs')

  // In-app notification → recruiter who submitted this candidate (non-blocking)
  ;(async () => {
    const [{ data: sub }, { data: jobPost }] = await Promise.all([
      admin.from('candidate_submissions').select('candidate_name, recruiter_id').eq('id', submissionId).single(),
      admin.from('job_posts').select('title').eq('id', jobId).single(),
    ])
    if (!sub?.recruiter_id) return

    const { data: recruiter } = await admin.from('recruiters').select('user_id').eq('id', sub.recruiter_id).single()
    if (!recruiter?.user_id) return

    const cand = sub.candidate_name
    const role = jobPost?.title ?? 'a role'

    type NotifContent = { title: string; body: string }
    const STATUS_NOTIF: Record<string, NotifContent> = {
      in_pipeline: {
        title: 'Candidate Back in Pipeline',
        body:  `${cand} for "${role}" has been moved back into the employer's pipeline.`,
      },
      in_review: {
        title: 'Candidate Under Review',
        body:  `${cand} for "${role}" is being actively reviewed by the employer.`,
      },
      shortlisted: {
        title: '⭐ Candidate Shortlisted!',
        body:  `${cand} for "${role}" has been shortlisted by the employer. Great submission!`,
      },
      hired: {
        title: '🎉 Candidate Hired — Congratulations!',
        body:  `${cand} got hired for "${role}". Amazing work on this placement!`,
      },
      rejected: {
        title: 'Candidate Not Selected',
        body:  `${cand} for "${role}" was not selected. Keep submitting strong candidates.`,
      },
      saved_for_later: {
        title: 'Candidate Saved for Later',
        body:  `${cand} for "${role}" was saved by the employer — they may revisit.`,
      },
    }

    const content = STATUS_NOTIF[status] ?? {
      title: `Candidate status updated`,
      body:  `${cand} for "${role}" was moved to ${status}.`,
    }

    await admin.from('notifications').insert({
      user_id: recruiter.user_id,
      type:    'status_update',
      title:   content.title,
      body:    content.body,
      link:    `/recruiter/dashboard/my-jobs/${jobId}`,
    })
  })().catch(err => console.error('[Status notification]', err))
}
