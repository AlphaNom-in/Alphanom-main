import { createClient } from '@/lib/supabase/client'

const FREE_DOMAINS = new Set([
  'gmail.com', 'googlemail.com', 'yahoo.com', 'yahoo.co.in', 'yahoo.co.uk',
  'hotmail.com', 'hotmail.co.in', 'outlook.com', 'live.com', 'msn.com',
  'aol.com', 'icloud.com', 'me.com', 'mac.com', 'protonmail.com', 'pm.me',
  'tutanota.com', 'tutanota.de', 'zoho.com', 'yandex.com', 'yandex.ru',
  'mail.com', 'gmx.com', 'gmx.de', 'rediffmail.com', 'sify.com',
  'inbox.com', 'fastmail.com', 'hushmail.com',
])

export function validateCompanyEmail(email: string): string | null {
  const domain = email.split('@')[1]?.toLowerCase()
  if (!domain) return 'Invalid email address.'
  if (FREE_DOMAINS.has(domain)) {
    return 'Please use your company email. Gmail, Yahoo, and other personal providers are not accepted for employer accounts.'
  }
  return null
}

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
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { role: 'employer' } },
  })
  if (error) throw error
  if (!data.user) throw new Error('Signup failed')

  const profileData = { company_name, username, email, contact_primary }

  if (data.session) {
    // Email confirmation is OFF — user is already authenticated, create profile now
    const { error: profileError } = await supabase.from('employers').insert({
      user_id: data.user.id,
      ...profileData,
    })
    if (profileError) throw profileError
    return 'success'
  }

  // Email confirmation is ON — store data in localStorage for after OTP verification
  localStorage.setItem('__employer_signup__', JSON.stringify(profileData))
  return 'confirm_email'
}

export async function verifyEmployerSignupOtp(email: string, token: string) {
  const supabase = createClient()
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'signup',
  })
  if (error) throw error
  if (!data.user) throw new Error('Verification failed')

  // Create employer profile from stored signup data
  const raw = localStorage.getItem('__employer_signup__')
  if (raw) {
    const params = JSON.parse(raw) as {
      company_name: string
      username: string
      email: string
      contact_primary: string
    }
    const { data: existing } = await supabase
      .from('employers').select('id').eq('user_id', data.user.id).single()
    if (!existing) {
      const { error: profileError } = await supabase.from('employers').insert({
        user_id: data.user.id,
        ...params,
      })
      if (profileError) throw profileError
    }
    localStorage.removeItem('__employer_signup__')
  }
}

export async function resendEmployerOtp(email: string) {
  const supabase = createClient()
  const { error } = await supabase.auth.resend({ type: 'signup', email })
  if (error) throw error
}

export async function loginEmployer(email: string, password: string) {
  const supabase = createClient()
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data.user
}
