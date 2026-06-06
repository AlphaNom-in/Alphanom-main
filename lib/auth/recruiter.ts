import { createClient } from '@/lib/supabase/client'
import { sendSignupOtp, verifySignupOtp, checkEmailRegistered } from '@/lib/email/otp'

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
  // Check if email is already registered before sending OTP
  const exists = await checkEmailRegistered(email, 'recruiter')
  if (exists) throw new Error('An account with this email already exists. Please sign in instead.')

  // Store form data in localStorage — retrieved after OTP verification
  localStorage.setItem('__recruiter_signup__', JSON.stringify({
    full_name, email, password, contact_primary,
  }))

  // Send OTP via Resend
  await sendSignupOtp(email, full_name, 'recruiter')

  return 'confirm_email'
}

export async function verifyRecruiterSignupOtp(email: string, otp: string) {
  // Verify OTP against DB
  await verifySignupOtp(email, otp, 'recruiter')

  // OTP valid — now create the Supabase account
  const raw = localStorage.getItem('__recruiter_signup__')
  if (!raw) throw new Error('Signup session expired. Please start over.')

  const { full_name, password, contact_primary } = JSON.parse(raw) as {
    full_name: string
    email: string
    password: string
    contact_primary: string
  }

  const supabase = createClient()
  let userId: string

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { role: 'recruiter' } },
  })

  if (error) {
    // Orphaned auth user from a previous abandoned signup — sign in to recover
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

  // Create recruiter profile row
  const { error: profileError } = await supabase.from('recruiters').insert({
    user_id: userId,
    full_name,
    email,
    contact_primary,
  })
  if (profileError) throw profileError

  localStorage.removeItem('__recruiter_signup__')

  // Explicitly sign in so session exists regardless of Supabase email confirmation setting
  const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
  if (signInError) throw signInError
}

export async function resendRecruiterOtp(email: string) {
  const raw = localStorage.getItem('__recruiter_signup__')
  const name = raw ? (JSON.parse(raw) as { full_name: string }).full_name : email
  await sendSignupOtp(email, name, 'recruiter')
}

export async function loginRecruiter(email: string, password: string) {
  const supabase = createClient()
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data.user
}
