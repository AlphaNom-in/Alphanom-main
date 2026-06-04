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
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { role: 'recruiter' } },
  })
  if (error) throw error
  if (!data.user) throw new Error('Signup failed')

  const profileData = { full_name, email, contact_primary }

  if (data.session) {
    // Email confirmation OFF — create recruiter row immediately
    const { error: profileError } = await supabase.from('recruiters').insert({
      user_id: data.user.id,
      ...profileData,
    })
    if (profileError) throw profileError
    return 'success'
  }

  // Email confirmation ON — store for OTP callback
  localStorage.setItem('__recruiter_signup__', JSON.stringify(profileData))
  return 'confirm_email'
}

export async function verifyRecruiterSignupOtp(email: string, token: string) {
  const supabase = createClient()
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'signup',
  })
  if (error) throw error
  if (!data.user) throw new Error('Verification failed')

  const raw = localStorage.getItem('__recruiter_signup__')
  if (raw) {
    const params = JSON.parse(raw) as {
      full_name: string
      email: string
      contact_primary: string
    }
    const { data: existing } = await supabase
      .from('recruiters').select('id').eq('user_id', data.user.id).single()
    if (!existing) {
      const { error: profileError } = await supabase.from('recruiters').insert({
        user_id: data.user.id,
        ...params,
      })
      if (profileError) throw profileError
    }
    localStorage.removeItem('__recruiter_signup__')
  }
}

export async function resendRecruiterOtp(email: string) {
  const supabase = createClient()
  const { error } = await supabase.auth.resend({ type: 'signup', email })
  if (error) throw error
}

export async function loginRecruiter(email: string, password: string) {
  const supabase = createClient()
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data.user
}
