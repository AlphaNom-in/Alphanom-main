import { createClient } from '@/lib/supabase/client'

export async function signUpRecruiter({
  full_name,
  email,
  password,
  contact_primary,
}: {
  full_name: string
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
          role: 'recruiter',
        },
      },
    })

  if (error) throw error

  const user = data.user

  if (!user) {
    throw new Error('User creation failed')
  }

  const { error: profileError } =
    await supabase
      .from('recruiters')
      .insert({
        user_id: user.id,
        full_name,
        email,
        contact_primary,
      })

  if (profileError) throw profileError

  return user
}

export async function loginRecruiter(
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