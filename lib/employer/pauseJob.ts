'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function toggleJobPause(jobId: string, currentStatus: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: employer } = await supabase
    .from('employers').select('id').eq('user_id', user.id).single()
  if (!employer) throw new Error('Employer not found')

  const { data: job } = await supabase
    .from('job_posts').select('id, status')
    .eq('id', jobId)
    .eq('employer_id', employer.id)
    .single()
  if (!job) throw new Error('Job not found')

  if (job.status === 'closed') throw new Error('Cannot pause a closed job')

  const newStatus = job.status === 'paused' ? 'active' : 'paused'

  const admin = createAdminClient()
  const { error } = await admin
    .from('job_posts')
    .update({ status: newStatus })
    .eq('id', jobId)
    .eq('employer_id', employer.id)

  if (error) throw error

  revalidatePath('/employer/dashboard/jobs')
  revalidatePath(`/employer/dashboard/jobs/${jobId}`)
  revalidatePath('/employer/dashboard')
  revalidatePath('/recruiter/dashboard/all-jobs')
  revalidatePath('/recruiter/dashboard/my-jobs')
}
