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

  // When a candidate is hired, close the job automatically
  if (status === 'hired') {
    await admin
      .from('job_posts')
      .update({ status: 'closed' })
      .eq('id', jobId)
  }

  revalidatePath(`/employer/dashboard/jobs/${jobId}/applicants`)
  revalidatePath(`/employer/dashboard/jobs/${jobId}`)
  revalidatePath('/employer/dashboard/jobs')
  revalidatePath('/employer/dashboard')
  revalidatePath('/recruiter/dashboard/all-jobs')
  revalidatePath('/recruiter/dashboard/my-jobs')
}
