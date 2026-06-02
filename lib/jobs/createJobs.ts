import { createClient } from '@/lib/supabase/client'

export async function createJob(jobData: any) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const { data: employer } = await supabase
    .from('employers')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!employer) {
    throw new Error('Employer not found')
  }

  const { error } = await supabase
    .from('job_posts')
    .insert({
      employer_id: employer.id,
      ...jobData,
    })

  if (error) {
    throw error
  }
}