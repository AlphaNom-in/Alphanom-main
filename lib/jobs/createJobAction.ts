'use server'

import { createClient }      from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath }    from 'next/cache'
import { notifyRecruitersNewJob } from '@/lib/email/notifications'

export async function createJobAction(jobData: {
  title: string
  department?: string
  location?: string
  work_model?: string
  budget_min?: number
  budget_max?: number
  notice_period?: string
  recruiter_note?: string
  mandatory_criteria?: string[]
  preferred_criteria?: string[]
  preferred_companies?: string[]
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: employer } = await supabase
    .from('employers').select('id').eq('user_id', user.id).single()
  if (!employer) throw new Error('Employer not found')

  const payload = {
    ...jobData,
    budget_min: jobData.budget_min ? Math.round(jobData.budget_min * 100000) : null,
    budget_max: jobData.budget_max ? Math.round(jobData.budget_max * 100000) : null,
  }

  const admin = createAdminClient()
  const { data: job, error } = await admin
    .from('job_posts')
    .insert({ employer_id: employer.id, ...payload })
    .select('id')
    .single()

  if (error) throw error

  revalidatePath('/employer/dashboard/jobs')
  revalidatePath('/employer/dashboard')
  revalidatePath('/recruiter/dashboard/all-jobs')

  // Send batch notification to all recruiters (non-blocking — errors are logged, not thrown)
  notifyRecruitersNewJob(job.id).catch(err =>
    console.error('[Job notification] Failed to send recruiter emails:', err)
  )
}
