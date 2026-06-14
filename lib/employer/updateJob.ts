'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function updateJob(jobId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: employer } = await supabase
    .from('employers').select('id').eq('user_id', user.id).single()
  if (!employer) throw new Error('Employer not found')

  /* Verify ownership */
  const { data: job } = await supabase
    .from('job_posts').select('id').eq('id', jobId).eq('employer_id', employer.id).single()
  if (!job) throw new Error('Job not found')

  const raw = (k: string) => (formData.get(k) as string)?.trim() ?? ''
  const arr = (k: string): string[] => {
    const v = raw(k)
    if (!v) return []
    try { return JSON.parse(v) } catch { return [] }
  }

  const budgetMinLPA    = Number(raw('budget_min'))
  const budgetMaxLPA    = Number(raw('budget_max'))
  const limitRaw        = raw('application_limit')
  const applicationLimit = limitRaw && Number(limitRaw) > 0 ? Number(limitRaw) : null

  const admin = createAdminClient()
  const { error } = await admin
    .from('job_posts')
    .update({
      title:               raw('title'),
      department:          raw('department') || null,
      location:            raw('location')   || null,
      work_model:          raw('work_model') || null,
      notice_period:       raw('notice_period') || null,
      recruiter_note:      raw('recruiter_note') || null,
      budget_min:          budgetMinLPA > 0 ? Math.round(budgetMinLPA * 100000) : null,
      budget_max:          budgetMaxLPA > 0 ? Math.round(budgetMaxLPA * 100000) : null,
      mandatory_criteria:  arr('mandatory_criteria'),
      preferred_criteria:  arr('preferred_criteria'),
      preferred_companies: arr('preferred_companies'),
      application_limit:   applicationLimit,
    })
    .eq('id', jobId)

  if (error) throw error

  revalidatePath(`/employer/dashboard/jobs/${jobId}`)
  revalidatePath('/employer/dashboard/jobs')
  revalidatePath('/employer/dashboard')
}
