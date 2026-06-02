import { createClient } from '@/lib/supabase/client'

export type EmployerProfile = {
  id: string
  user_id: string
  company_name: string
  username: string
  email: string
  contact_primary: string
  contact_secondary: string | null
  company_address: string | null
  industry: string | null
  logo_url: string | null
  is_verified: boolean
  created_at: string
}

export function isProfileComplete(profile: EmployerProfile | null): boolean {
  if (!profile) return false
  return !!(profile.company_address?.trim() && profile.industry?.trim())
}

export function profileCompletionSteps(profile: EmployerProfile | null) {
  return [
    { label: 'Industry',          done: !!profile?.industry,          required: true  },
    { label: 'Company Address',   done: !!profile?.company_address,   required: true  },
    { label: 'Secondary Contact', done: !!profile?.contact_secondary, required: false },
  ]
}

export function profileCompletionPercent(profile: EmployerProfile | null): number {
  const steps = profileCompletionSteps(profile)
  const done = steps.filter((s) => s.done).length
  return Math.round((done / steps.length) * 100)
}

export async function updateEmployerProfile(data: Partial<Pick<
  EmployerProfile,
  'company_name' | 'contact_primary' | 'contact_secondary' | 'company_address' | 'industry' | 'logo_url'
>>) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase
    .from('employers')
    .update(data)
    .eq('user_id', user.id)

  if (error) throw error
}

export async function uploadEmployerLogo(file: File): Promise<string> {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const ext = file.name.split('.').pop() ?? 'jpg'
  const path = `${user.id}/logo.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('employer-logos')
    .upload(path, file, { upsert: true })

  if (uploadError) throw uploadError

  const { data: { publicUrl } } = supabase.storage
    .from('employer-logos')
    .getPublicUrl(path)

  return publicUrl
}
