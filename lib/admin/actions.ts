'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath }    from 'next/cache'

// ─── Job actions ──────────────────────────────────────────────────────────────

export async function setJobStatus(jobId: string, status: 'active' | 'paused' | 'closed') {
  const admin = createAdminClient()
  const { error } = await admin.from('job_posts').update({ status }).eq('id', jobId)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/jobs')
}

export async function deleteJob(jobId: string) {
  const admin = createAdminClient()
  await admin.from('candidate_submissions').delete().eq('job_post_id', jobId)
  const { error } = await admin.from('job_posts').delete().eq('id', jobId)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/jobs')
  revalidatePath('/admin/candidates')
  revalidatePath('/admin')
}

// ─── Recruiter actions ────────────────────────────────────────────────────────

export async function setRecruiterVerified(recruiterId: string, verified: boolean) {
  const admin = createAdminClient()
  const { error } = await admin.from('recruiters').update({ is_verified: verified }).eq('id', recruiterId)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/recruiters')
  revalidatePath(`/admin/recruiters/${recruiterId}`)
}

export async function deleteRecruiter(recruiterId: string) {
  const admin = createAdminClient()
  await admin.from('candidate_submissions').delete().eq('recruiter_id', recruiterId)
  const { error } = await admin.from('recruiters').delete().eq('id', recruiterId)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/recruiters')
  revalidatePath('/admin/candidates')
  revalidatePath('/admin')
}

export async function updateRecruiter(recruiterId: string, fd: FormData) {
  const admin = createAdminClient()
  const specRaw   = (fd.get('specialization') as string | null) ?? ''
  const specArray = specRaw.split(',').map(s => s.trim()).filter(Boolean)

  const patch: Record<string, unknown> = {}
  const fullName = (fd.get('full_name') as string | null)?.trim()
  const email    = (fd.get('email')     as string | null)?.trim()
  const contact  = (fd.get('contact_primary') as string | null)?.trim()
  const yoe      = (fd.get('years_of_experience') as string | null)?.trim()
  const roles    = (fd.get('total_roles_closed')  as string | null)?.trim()

  if (fullName)           patch.full_name           = fullName
  if (email)              patch.email               = email
  if (contact !== null)   patch.contact_primary     = contact
  if (specRaw !== null)   patch.specialization      = specArray
  if (yoe)                patch.years_of_experience = Number(yoe)
  if (roles)              patch.total_roles_closed  = Number(roles)

  const { error } = await admin.from('recruiters').update(patch).eq('id', recruiterId)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/recruiters')
  revalidatePath(`/admin/recruiters/${recruiterId}`)
  return { success: true }
}

// ─── Employer actions ─────────────────────────────────────────────────────────

export async function setEmployerVerified(employerId: string, verified: boolean) {
  const admin = createAdminClient()
  const { error } = await admin.from('employers').update({ is_verified: verified }).eq('id', employerId)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/employers')
  revalidatePath(`/admin/employers/${employerId}`)
}

export async function deleteEmployer(employerId: string) {
  const admin = createAdminClient()
  const { data: jobs } = await admin.from('job_posts').select('id').eq('employer_id', employerId)
  const jobIds = (jobs ?? []).map(j => j.id)
  if (jobIds.length) {
    await admin.from('candidate_submissions').delete().in('job_post_id', jobIds)
    await admin.from('job_posts').delete().eq('employer_id', employerId)
  }
  const { error } = await admin.from('employers').delete().eq('id', employerId)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/employers')
  revalidatePath('/admin/jobs')
  revalidatePath('/admin/candidates')
  revalidatePath('/admin')
}

export async function updateEmployer(employerId: string, fd: FormData) {
  const admin = createAdminClient()

  const patch: Record<string, unknown> = {}
  const companyName = (fd.get('company_name')    as string | null)?.trim()
  const email       = (fd.get('email')           as string | null)?.trim()
  const contact     = (fd.get('contact_primary') as string | null)?.trim()
  const industry    = (fd.get('industry')        as string | null)?.trim()
  const address     = (fd.get('company_address') as string | null)?.trim()

  if (companyName) patch.company_name    = companyName
  if (email)       patch.email           = email
  if (contact !== null) patch.contact_primary = contact
  if (industry !== null) patch.industry  = industry
  if (address !== null) patch.company_address = address

  const { error } = await admin.from('employers').update(patch).eq('id', employerId)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/employers')
  revalidatePath(`/admin/employers/${employerId}`)
  return { success: true }
}