import { createClient } from '@/lib/supabase/client'
import {
  sendSignupOtp,
  verifySignupOtp,
  checkEmailRegistered,
  checkContactRegistered,
  checkUsernameRegistered,
} from '@/lib/email/otp'

// TODO: remove gmail.com from this list before production
const FREE_DOMAINS = new Set([
  'googlemail.com', 'yahoo.com', 'yahoo.co.in', 'yahoo.co.uk',
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
    return 'Please use your company email. Yahoo and other personal providers are not accepted for employer accounts.'
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
  // Check all unique fields in parallel before sending OTP — fail fast with clear messages
  const [emailExists, contactExists, usernameExists] = await Promise.all([
    checkEmailRegistered(email, 'employer'),
    checkContactRegistered(contact_primary),
    checkUsernameRegistered(username),
  ])

  if (emailExists) throw new Error('An account with this email already exists. Please sign in instead.')
  if (contactExists) throw new Error('This phone number is already registered to another employer account. Please use a different number.')
  if (usernameExists) throw new Error('This username is already taken. Please choose a different one.')

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
  let isOrphanedUser = false

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { role: 'employer' } },
  })

  if (error) {
    if (error.message.toLowerCase().includes('already registered')) {
      // Auth user exists — could be an orphaned user from a previous failed signup attempt.
      // Sign in to determine who they are.
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password })

      if (signInError) {
        // Password mismatch — they used a different password during first signup attempt
        throw new Error(
          'An account for this email was partially created earlier. Please use the same password you entered during your first signup attempt, or contact support.'
        )
      }

      // Check whether an employer profile already exists (successful signup before)
      const alreadyEmployer = await checkEmailRegistered(email, 'employer')
      if (alreadyEmployer) {
        await supabase.auth.signOut()
        throw new Error('This email is already registered as an employer account. Please sign in instead.')
      }

      // Check whether a recruiter profile exists (wrong role)
      const alreadyRecruiter = await checkEmailRegistered(email, 'recruiter')
      if (alreadyRecruiter) {
        await supabase.auth.signOut()
        throw new Error('This email is already registered as a recruiter account and cannot be used for employer signup.')
      }

      // Genuine orphaned auth user — no profile for either role, safe to continue
      userId = signInData.user.id
      isOrphanedUser = true
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

  if (profileError) {
    // Sign out to avoid leaving the user in a broken signed-in-but-no-profile state
    await supabase.auth.signOut()

    // Translate DB constraint errors into user-friendly messages
    if (profileError.code === '23505') {
      const detail = (profileError.details ?? profileError.message).toLowerCase()
      if (detail.includes('contact_primary') || detail.includes('contact')) {
        throw new Error('This phone number is already registered. Please use a different contact number.')
      }
      if (detail.includes('username')) {
        throw new Error('This username is already taken. Please choose a different username.')
      }
      if (detail.includes('email')) {
        throw new Error('This email is already registered. Please sign in instead.')
      }
      throw new Error('An account with one of these details already exists. Please check your information and try again.')
    }

    throw new Error('Failed to create your profile. Please try again or contact support.')
  }

  localStorage.removeItem('__employer_signup__')

  if (isOrphanedUser) {
    // Already signed in via the signInWithPassword above — session is live, nothing more needed
    return
  }

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

  // Guard against recruiter accounts (or accounts with no role) trying to access employer flow
  const role = data.user?.user_metadata?.role
  if (role === 'recruiter') {
    await supabase.auth.signOut()
    throw new Error('This email is registered for a recruiter account. Please use the recruiter login instead.')
  }

  return data.user
}
