'use server'

import { createClient }      from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath }    from 'next/cache'

export async function unlockProfile(submissionId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: employer } = await supabase
    .from('employers').select('id').eq('user_id', user.id).single()
  if (!employer) throw new Error('Employer not found')

  const admin = createAdminClient()

  // Verify submission belongs to a job owned by this employer
  const { data: sub } = await admin
    .from('candidate_submissions')
    .select('id, job_post_id, profile_unlocked')
    .eq('id', submissionId)
    .single()
  if (!sub) throw new Error('Submission not found')
  if (sub.profile_unlocked) return // already unlocked — no-op

  const { data: job } = await admin
    .from('job_posts').select('employer_id').eq('id', sub.job_post_id).single()
  if (!job || job.employer_id !== employer.id) throw new Error('Unauthorized')

  await admin
    .from('candidate_submissions')
    .update({ profile_unlocked: true, profile_unlocked_at: new Date().toISOString() })
    .eq('id', submissionId)

  revalidatePath(`/employer/dashboard/jobs/${sub.job_post_id}/applicants`)
  revalidatePath('/employer/dashboard/candidates')
}
