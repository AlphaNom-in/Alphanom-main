'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function submitCandidate(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  const { data: recruiter } = await supabase
    .from('recruiters')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!recruiter) throw new Error('Recruiter profile not found')

  const resumeFile = formData.get('resume') as File
  if (!resumeFile || resumeFile.size === 0)
    throw new Error('Resume is required')

  const admin = createAdminClient()

  const ext = resumeFile.name.split('.').pop()
  const filePath = `${recruiter.id}/${Date.now()}.${ext}`

  const { error: uploadError } = await admin.storage
    .from('candidate-resumes')
    .upload(filePath, resumeFile)

  if (uploadError) throw new Error(`Resume upload failed: ${uploadError.message}`)

  const {
    data: { publicUrl },
  } = admin.storage.from('candidate-resumes').getPublicUrl(filePath)

  const raw = (key: string) => formData.get(key) as string
  const optional = (key: string) => raw(key) || null
  const optionalNum = (key: string) => {
    const v = raw(key)
    return v ? Number(v) : null
  }

  const { error } = await supabase.from('candidate_submissions').insert({
    job_post_id: raw('job_post_id'),
    recruiter_id: recruiter.id,
    candidate_name: raw('candidate_name'),
    contact_primary: raw('contact_primary'),
    contact_secondary: optional('contact_secondary'),
    email: raw('email'),
    linkedin_url: optional('linkedin_url'),
    current_ctc: optionalNum('current_ctc'),
    current_location: optional('current_location'),
    total_experience: optionalNum('total_experience'),
    notice_period: optional('notice_period'),
    portfolio_url: optional('portfolio_url'),
    resume_url: publicUrl,
    recruiter_note: raw('recruiter_note'),
  })

  if (error) throw error

  return true
}
