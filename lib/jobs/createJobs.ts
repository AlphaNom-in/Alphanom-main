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

  // Convert LPA inputs to rupees so display code (÷100000) works correctly
  const payload = {
    ...jobData,
    budget_min: jobData.budget_min ? Math.round(jobData.budget_min * 100000) : null,
    budget_max: jobData.budget_max ? Math.round(jobData.budget_max * 100000) : null,
  }

  const { error } = await supabase
    .from('job_posts')
    .insert({
      employer_id: employer.id,
      ...payload,
    })

  if (error) {
    throw error
  }
}