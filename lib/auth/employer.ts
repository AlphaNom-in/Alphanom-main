import { createClient } from '@/lib/supabase/client'
import { sendSignupOtp, verifySignupOtp, checkEmailRegistered } from '@/lib/email/otp'

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
  // Check if email is already registered before sending OTP
  const exists = await checkEmailRegistered(email, 'employer')
  if (exists) throw new Error('An account with this email already exists. Please sign in instead.')

  // Store form data in localStorage — retrieved after OTP verification
  localStorage.setItem('__employer_signup__', JSON.stringify({
    company_name, username, email, password, contact_primary,
  }))

  // Send OTP via Resend
  await sendSignupOtp(email, company_name, 'employer')

  return 'confirm_email'
}

export async function verifyEmployerSignupOtp(email: string, otp: string) {
  // Verify OTP against DB
  await verifySignupOtp(email, otp, 'employer')

  // OTP valid — now create the Supabase account
  const raw = localStorage.getItem('__employer_signup__')
  if (!raw) throw new Error('Signup session expired. Please start over.')

  const { company_name, username, password, contact_primary } = JSON.parse(raw) as {
    company_name: string
    username: string
    email: string
    password: string
    contact_primary: string
  }

  const supabase = createClient()
  let userId: string

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { role: 'employer' } },
  })

  if (error) {
    // Orphaned auth user from a previous abandoned signup — sign in to get the user id
    if (error.message.toLowerCase().includes('already registered')) {
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password })
      if (signInError) throw new Error('This email is already in use. Please sign in or use a different email.')
      userId = signInData.user.id
    } else {
      throw error
    }
  } else {
    if (!data.user) throw new Error('Account creation failed.')
    userId = data.user.id
  }

  // Create employer profile row
  const { error: profileError } = await supabase.from('employers').insert({
    user_id: userId,
    company_name,
    username,
    email,
    contact_primary,
  })
  if (profileError) throw profileError

  localStorage.removeItem('__employer_signup__')

  // Explicitly sign in so session exists regardless of Supabase email confirmation setting
  const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
  if (signInError) throw signInError
}

export async function resendEmployerOtp(email: string) {
  const raw = localStorage.getItem('__employer_signup__')
  const name = raw ? (JSON.parse(raw) as { company_name: string }).company_name : email
  await sendSignupOtp(email, name, 'employer')
}

export async function loginEmployer(email: string, password: string) {
  const supabase = createClient()
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data.user
}
