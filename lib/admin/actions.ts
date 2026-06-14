'use server'

import { createAdminClient }            from '@/lib/supabase/admin'
import { revalidatePath }               from 'next/cache'
import { sendBrevoEmail }               from '@/lib/email/brevo'
import { recruiterApprovedEmailHtml, employerApprovedEmailHtml } from '@/lib/email/templates'

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

  // Fetch profile before updating so we have email + name for the approval email
  const { data: recruiter } = await admin
    .from('recruiters')
    .select('full_name, email')
    .eq('id', recruiterId)
    .single()

  const { error } = await admin.from('recruiters').update({ is_verified: verified }).eq('id', recruiterId)
  if (error) throw new Error(error.message)

  // Send approval email only when verifying (not when revoking)
  if (verified && recruiter?.email) {
    const base      = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://alphanom.in'
    const firstName = (recruiter.full_name ?? 'there').split(' ')[0]
    try {
      await sendBrevoEmail({
        to:       recruiter.email,
        toName:   recruiter.full_name ?? undefined,
        subject:  "You're approved — Start submitting candidates on AlphaNom",
        html:     recruiterApprovedEmailHtml({
          firstName,
          fullName:  recruiter.full_name ?? recruiter.email,
          loginUrl:  `${base}/recruiter/login`,
          jobsUrl:   `${base}/recruiter/dashboard/all-jobs`,
        }),
        fromName: 'AlphaNom Team',
      })
    } catch (err) {
      console.error('[setRecruiterVerified] approval email failed:', err)
    }
  }

  revalidatePath('/admin/recruiters')
  revalidatePath(`/admin/recruiters/${recruiterId}`)
}

export async function deleteRecruiter(recruiterId: string) {
  const admin = createAdminClient()

  // Snapshot the recruiter name before deletion so submissions remain identifiable
  const { data: recruiter } = await admin
    .from('recruiters')
    .select('full_name')
    .eq('id', recruiterId)
    .single()

  // Preserve submissions — mark as recruiter_deleted, nullify FK, store name snapshot
  await admin
    .from('candidate_submissions')
    .update({
      recruiter_deleted:       true,
      recruiter_name_snapshot: recruiter?.full_name ?? 'Deleted Recruiter',
      recruiter_id:            null,
    })
    .eq('recruiter_id', recruiterId)

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

  const { data: employer } = await admin
    .from('employers')
    .select('company_name, email, contact_primary')
    .eq('id', employerId)
    .single()

  const { error } = await admin.from('employers').update({ is_verified: verified }).eq('id', employerId)
  if (error) throw new Error(error.message)

  if (verified && employer?.email) {
    const base        = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://alphanom.in'
    const contactName = employer.contact_primary ?? 'there'
    try {
      await sendBrevoEmail({
        to:       employer.email,
        toName:   employer.company_name ?? undefined,
        subject:  `${employer.company_name ?? 'Your company'} is verified on AlphaNom — Start hiring`,
        html:     employerApprovedEmailHtml({
          companyName:  employer.company_name ?? 'Your Company',
          contactName,
          loginUrl:     `${base}/employer/login`,
          postJobUrl:   `${base}/employer/dashboard/jobs/post`,
        }),
        fromName: 'AlphaNom Team',
      })
    } catch (err) {
      console.error('[setEmployerVerified] approval email failed:', err)
    }
  }

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