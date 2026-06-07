'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function updateProfile(formData: FormData) {
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

  const admin = createAdminClient()

  // Handle CV upload if provided
  let cvUrl: string | undefined
  const cvFile = formData.get('cv') as File
  if (cvFile && cvFile.size > 0) {
    const ext = cvFile.name.split('.').pop()
    const filePath = `${recruiter.id}/cv-${Date.now()}.${ext}`

    const { error: uploadError } = await admin.storage
      .from('recruiter-cvs')
      .upload(filePath, cvFile, { upsert: true })

    if (uploadError) throw new Error(`CV upload failed: ${uploadError.message}`)

    const {
      data: { publicUrl },
    } = admin.storage.from('recruiter-cvs').getPublicUrl(filePath)

    cvUrl = publicUrl
  }

  // Parse specialization from comma-separated hidden input
  const specializationRaw = formData.get('specialization') as string
  const specialization = specializationRaw
    ? specializationRaw.split(',').map((s) => s.trim()).filter(Boolean)
    : undefined

  const updates: Record<string, unknown> = {}

  const contactSecondary = formData.get('contact_secondary') as string
  const yearsRaw = formData.get('years_of_experience') as string
  const fullName = formData.get('full_name') as string
  const contactPrimary = formData.get('contact_primary') as string
  const linkedinUrl = formData.get('linkedin_url') as string

  if (fullName) updates.full_name = fullName
  if (contactPrimary) updates.contact_primary = contactPrimary
  if (contactSecondary !== null) updates.contact_secondary = contactSecondary || null
  if (specialization) updates.specialization = specialization
  if (yearsRaw) updates.years_of_experience = Number(yearsRaw)
  if (cvUrl) updates.cv_url = cvUrl
  if (linkedinUrl !== null) updates.linkedin_url = linkedinUrl || null

  const { error } = await admin
    .from('recruiters')
    .update(updates)
    .eq('id', recruiter.id)

  if (error) throw error

  return true
}
