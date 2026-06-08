'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

const STATUS_LABEL: Record<string, string> = {
  in_pipeline:     'In Pipeline',
  in_review:       'In Review',
  shortlisted:     'Shortlisted',
  saved_for_later: 'Saved for Later',
  hired:           'Hired',
  rejected:        'Rejected',
}

export async function submitFeedback(
  submissionId: string,
  jobId: string,
  statusAtTime: string,
  feedbackText: string
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: employer } = await supabase
    .from('employers').select('id').eq('user_id', user.id).single()
  if (!employer) throw new Error('Employer not found')

  const admin = createAdminClient()

  const { error } = await admin.from('submission_feedback').insert({
    submission_id:  submissionId,
    employer_id:    employer.id,
    status_at_time: statusAtTime,
    feedback_text:  feedbackText,
  })

  if (error) throw new Error(error.message ?? 'Failed to save feedback')

  // Notify recruiter (non-blocking)
  ;(async () => {
    const [{ data: sub }, { data: jobPost }] = await Promise.all([
      admin.from('candidate_submissions').select('candidate_name, recruiter_id').eq('id', submissionId).single(),
      admin.from('job_posts').select('title').eq('id', jobId).single(),
    ])
    if (!sub?.recruiter_id) return

    const { data: recruiter } = await admin
      .from('recruiters').select('user_id').eq('id', sub.recruiter_id).single()
    if (!recruiter?.user_id) return

    const statusLabel = STATUS_LABEL[statusAtTime] ?? statusAtTime
    const preview = feedbackText.length > 100 ? feedbackText.slice(0, 100) + '…' : feedbackText

    await admin.from('notifications').insert({
      user_id: recruiter.user_id,
      type:    'employer_feedback',
      title:   `Employer left feedback for ${sub.candidate_name}`,
      body:    `Feedback on "${jobPost?.title}" (${statusLabel}): "${preview}"`,
      link:    `/recruiter/dashboard/submissions/${submissionId}`,
    })
  })().catch(err => console.error('[Feedback notification]', err))

  return true
}