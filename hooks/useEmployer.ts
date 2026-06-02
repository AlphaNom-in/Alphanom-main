import { createClient } from '@/lib/supabase/client'

export async function getEmployerProfile() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data } = await supabase
    .from('employers')
    .select('*')
    .eq('user_id', user.id)
    .single()

  return data
}