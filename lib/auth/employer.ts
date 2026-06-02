import { createClient } from '@/lib/supabase/client'

export async function signUpEmployer({
  company_name,
  username,
  email,
  password,
  contact_primary,
}: {
  company_name: string
  username: string
  email: string
  password: string
  contact_primary: string
}) {
  const supabase = createClient()

  const { data, error } =
    await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: 'employer',
        },
      },
    })

if (error) {
  console.log('SIGNUP ERROR', error)
  throw error
}

  const user = data.user

  if (!user) {
    throw new Error('User creation failed')
  }

  const { error: profileError } =
    await supabase
      .from('employers')
      .insert({
        user_id: user.id,
        company_name,
        username,
        email,
        contact_primary,
      })

  if (profileError) throw profileError

  return user
}

export async function loginEmployer(
  email: string,
  password: string
) {
  const supabase = createClient()

  const { data, error } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    })

  if (error) throw error

  return data.user
}