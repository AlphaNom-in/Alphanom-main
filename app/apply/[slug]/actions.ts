'use server'

import { createAdminClient } from '@/lib/supabase/admin'

export type SubmitLeadState =
  | { ok: true }
  | { ok: false; error: string }

export async function submitLead(
  slugData: { recruiterId: string; jobPostId: string },
  formData: FormData
): Promise<SubmitLeadState> {
  const name         = (formData.get('name')              as string | null)?.trim()
  const email        = (formData.get('email')             as string | null)?.trim()
  const phone        = (formData.get('phone')             as string | null)?.trim()
  const jobTitle     = (formData.get('current_job_title') as string | null)?.trim()
  const company      = (formData.get('current_company')   as string | null)?.trim()
  const location     = (formData.get('current_location')  as string | null)?.trim()
  const expRaw       = formData.get('total_experience')   as string | null
  const ctcRaw       = formData.get('current_ctc')        as string | null
  const noticePeriod = (formData.get('notice_period')     as string | null)?.trim()
  const linkedin     = (formData.get('linkedin_url')      as string | null)?.trim()
  const portfolio    = (formData.get('portfolio_url')     as string | null)?.trim()
  const coverNote    = (formData.get('cover_note')        as string | null)?.trim()
  const resumeFile   = formData.get('resume') as File | null

  if (!name)  return { ok: false, error: 'Full name is required.' }
  if (!email) return { ok: false, error: 'Email is required.' }
  if (!phone || !/^[6-9]\d{9}$/.test(phone))
    return { ok: false, error: 'Enter a valid 10-digit Indian mobile number starting with 6, 7, 8 or 9.' }
  if (!jobTitle)  return { ok: false, error: 'Current job title is required.' }
  if (!company)   return { ok: false, error: 'Current company is required.' }
  if (!ctcRaw)    return { ok: false, error: 'Current CTC is required.' }
  if (!noticePeriod) return { ok: false, error: 'Notice period is required.' }

  const admin = createAdminClient()

  // Guard: no duplicate application from same email for same job
  const { data: existing } = await admin
    .from('recruiter_leads')
    .select('id')
    .eq('job_post_id', slugData.jobPostId)
    .eq('email', email)
    .maybeSingle()

  if (existing) return { ok: false, error: 'An application with this email already exists for this role.' }

  // Resume upload
  let resumeUrl: string | null = null
  if (resumeFile && resumeFile.size > 0) {
    const ext      = resumeFile.name.split('.').pop()
    const filePath = `leads/${slugData.recruiterId}/${Date.now()}.${ext}`
    const { error: uploadError } = await admin.storage
      .from('candidate-resumes')
      .upload(filePath, resumeFile)
    if (uploadError) return { ok: false, error: `Resume upload failed: ${uploadError.message}` }
    const { data: { publicUrl } } = admin.storage.from('candidate-resumes').getPublicUrl(filePath)
    resumeUrl = publicUrl
  }

  const { error } = await admin.from('recruiter_leads').insert({
    recruiter_id:      slugData.recruiterId,
    job_post_id:       slugData.jobPostId,
    applicant_name:    name,
    email,
    phone,
    current_job_title: jobTitle  || null,
    current_company:   company   || null,
    current_location:  location  || null,
    total_experience:  expRaw    ? parseFloat(expRaw)    : null,
    current_ctc:       ctcRaw    ? Math.round(parseFloat(ctcRaw) * 100000) : null,
    notice_period:     noticePeriod || null,
    linkedin_url:      linkedin  || null,
    portfolio_url:     portfolio || null,
    resume_url:        resumeUrl,
    cover_note:        coverNote || null,
    status:            'new',
  })

  if (error) {
    console.error('submitLead error:', error)
    return { ok: false, error: 'Something went wrong. Please try again.' }
  }

  return { ok: true }
}
