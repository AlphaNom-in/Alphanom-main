import { createClient } from '@/lib/supabase/client'

export async function getEmployerProfile() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('employers')
    .select('*')
    .eq('user_id', user.id)
    .single()

  return data
}

/**
 * Gets the employer profile, and if it doesn't exist yet, attempts to
 * auto-create it from signup data stored in localStorage (covers users
 * who signed up before the profile-creation fix was applied).
 */
export async function ensureEmployerProfile() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // Fast path — profile already exists
  const { data: existing } = await supabase
    .from('employers')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (existing) return existing

  // Profile missing — try to recover from localStorage (old signup flow)
  const raw = typeof window !== 'undefined'
    ? localStorage.getItem('__employer_signup__')
    : null

  if (raw) {
    try {
      const params = JSON.parse(raw) as {
        company_name: string
        username: string
        email: string
        contact_primary: string
      }
      const { error } = await supabase.from('employers').insert({
        user_id: user.id,
        ...params,
      })
      if (!error) {
        localStorage.removeItem('__employer_signup__')
        const { data: created } = await supabase
          .from('employers')
          .select('*')
          .eq('user_id', user.id)
          .single()
        return created
      }
    } catch {
      // localStorage data corrupt or insert failed — fall through to null
    }
  }

  return null
}