'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function closeJob(jobId: string) {
  const supabase = await createClient()

  // Auth + ownership check with regular client (respects RLS)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: employer } = await supabase
    .from('employers').select('id').eq('user_id', user.id).single()
  if (!employer) throw new Error('Employer not found')

  // Verify the job belongs to this employer
  const { data: job } = await supabase
    .from('job_posts').select('id')
    .eq('id', jobId)
    .eq('employer_id', employer.id)
    .single()
  if (!job) throw new Error('Job not found')

  // Use admin client to bypass RLS for the update
  const admin = createAdminClient()
  const { error } = await admin
    .from('job_posts')
    .update({ status: 'closed' })
    .eq('id', jobId)
    .eq('employer_id', employer.id)

  if (error) throw error

  revalidatePath('/employer/dashboard/jobs')
  revalidatePath(`/employer/dashboard/jobs/${jobId}`)
  revalidatePath('/employer/dashboard')
  revalidatePath('/recruiter/dashboard/all-jobs')
  revalidatePath('/recruiter/dashboard/my-jobs')
}
