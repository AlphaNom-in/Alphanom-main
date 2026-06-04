'use server'

import { createAdminClient } from '@/lib/supabase/admin'

export async function submitCareerInterest(formData: FormData) {
  const admin = createAdminClient()

  const full_name       = formData.get('full_name') as string
  const email           = formData.get('email') as string
  const role_interest   = formData.get('role_interest') as string
  const message         = formData.get('message') as string
  const exp_raw         = formData.get('experience_years') as string
  const linkedin_url    = (formData.get('linkedin_url') as string) || null
  const experience_years = exp_raw ? Number(exp_raw) : null

  if (!full_name?.trim() || !email?.trim() || !role_interest || !message?.trim()) {
    throw new Error('Please fill in all required fields.')
  }

  let resume_url: string | null = null
  const resumeFile = formData.get('resume') as File
  if (resumeFile && resumeFile.size > 0) {
    const ext = resumeFile.name.split('.').pop()
    const path = `${Date.now()}-${full_name.replace(/\s+/g, '-').toLowerCase()}.${ext}`
    const { error: uploadErr } = await admin.storage
      .from('career-resumes')
      .upload(path, resumeFile, { upsert: false })
    if (!uploadErr) {
      const { data: { publicUrl } } = admin.storage.from('career-resumes').getPublicUrl(path)
      resume_url = publicUrl
    }
  }

  const { error } = await admin.from('career_interests').insert({
    full_name,
    email,
    role_interest,
    experience_years,
    linkedin_url,
    message,
    resume_url,
  })

  if (error) throw new Error('Submission failed. Please try again.')
  return true
}
