'use server'

import { createClient }      from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath }    from 'next/cache'

export async function reopenJob(jobId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: employer } = await supabase
    .from('employers').select('id').eq('user_id', user.id).single()
  if (!employer) throw new Error('Employer not found')

  const admin = createAdminClient()
  const { error } = await admin
    .from('job_posts')
    .update({ status: 'active', auto_paused: false, application_limit: null })
    .eq('id', jobId)
    .eq('employer_id', employer.id)

  if (error) throw error

  revalidatePath(`/employer/dashboard/jobs/${jobId}`)
  revalidatePath('/employer/dashboard/jobs')
  revalidatePath('/employer/dashboard')
}
