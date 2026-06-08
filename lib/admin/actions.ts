'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath }    from 'next/cache'

export async function setJobStatus(jobId: string, status: 'active' | 'paused' | 'closed') {
  const admin = createAdminClient()
  const { error } = await admin.from('job_posts').update({ status }).eq('id', jobId)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/jobs')
}

export async function deleteJob(jobId: string) {
  const admin = createAdminClient()
  const { error } = await admin.from('job_posts').delete().eq('id', jobId)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/jobs')
}

export async function setRecruiterVerified(recruiterId: string, verified: boolean) {
  const admin = createAdminClient()
  const { error } = await admin.from('recruiters').update({ is_verified: verified }).eq('id', recruiterId)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/recruiters')
}

export async function setEmployerVerified(employerId: string, verified: boolean) {
  const admin = createAdminClient()
  const { error } = await admin.from('employers').update({ is_verified: verified }).eq('id', employerId)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/employers')
}