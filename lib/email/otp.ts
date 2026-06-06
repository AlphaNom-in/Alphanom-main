'use server'

import crypto from 'crypto'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendBrevoEmail } from './brevo'
import { otpEmailHtml } from './templates'

export async function checkEmailRegistered(
  email: string,
  role: 'employer' | 'recruiter'
): Promise<boolean> {
  const admin = createAdminClient()
  const table = role === 'employer' ? 'employers' : 'recruiters'
  const { data } = await admin.from(table).select('id').eq('email', email).maybeSingle()
  return !!data
}

function generateOtp(): string {
  return String(Math.floor(100000 + Math.random() * 900000))
}

function hashOtp(otp: string): string {
  return crypto.createHash('sha256').update(otp).digest('hex')
}

export async function sendSignupOtp(
  email: string,
  name: string,
  role: 'employer' | 'recruiter'
): Promise<void> {
  const otp     = generateOtp()
  const hash    = hashOtp(otp)
  const purpose = `${role}_signup`
  const expires = new Date(Date.now() + 10 * 60 * 1000).toISOString()

  const admin = createAdminClient()

  // Remove any unexpired OTPs for this email+purpose
  await admin.from('email_otps').delete().eq('email', email).eq('purpose', purpose)

  const { error } = await admin.from('email_otps').insert({
    email,
    otp_hash: hash,
    purpose,
    expires_at: expires,
  })
  if (error) throw new Error('Failed to create verification code.')

  await sendBrevoEmail({
    to: email,
    toName: name,
    subject: 'Your AlphaNom verification code',
    html: otpEmailHtml(otp, name, role),
  })
}

export async function sendPasswordResetOtp(
  email: string,
  role: 'employer' | 'recruiter'
): Promise<void> {
  const admin   = createAdminClient()
  const table   = role === 'employer' ? 'employers' : 'recruiters'
  const nameCol = role === 'employer' ? 'company_name' : 'full_name'
  const purpose = `${role}_reset`

  // Confirm email is registered
  const { data: profile } = await admin.from(table).select(`id, ${nameCol}`).eq('email', email).maybeSingle()
  if (!profile) throw new Error('No account found with this email address.')

  const otp     = generateOtp()
  const hash    = hashOtp(otp)
  const expires = new Date(Date.now() + 10 * 60 * 1000).toISOString()
  const name    = (profile as any)[nameCol] ?? email

  await admin.from('email_otps').delete().eq('email', email).eq('purpose', purpose)
  const { error } = await admin.from('email_otps').insert({ email, otp_hash: hash, purpose, expires_at: expires })
  if (error) throw new Error('Failed to create reset code.')

  await sendBrevoEmail({
    to: email,
    toName: name,
    subject: 'Reset your AlphaNom password',
    html: otpEmailHtml(otp, name, role, 'reset'),
  })
}

export async function verifyPasswordResetOtp(
  email: string,
  otp: string,
  role: 'employer' | 'recruiter'
): Promise<void> {
  const hash    = hashOtp(otp)
  const purpose = `${role}_reset`
  const admin   = createAdminClient()

  const { data } = await admin
    .from('email_otps')
    .select('id, expires_at, used')
    .eq('email', email).eq('otp_hash', hash).eq('purpose', purpose).eq('used', false)
    .single()

  if (!data) throw new Error('Invalid code. Please check and try again.')
  if (new Date(data.expires_at) < new Date()) throw new Error('Code expired. Please request a new one.')

  await admin.from('email_otps').update({ used: true }).eq('id', data.id)
}

export async function resetPasswordAction(
  email: string,
  newPassword: string,
  role: 'employer' | 'recruiter'
): Promise<void> {
  const admin = createAdminClient()
  const table = role === 'employer' ? 'employers' : 'recruiters'

  const { data } = await admin.from(table).select('user_id').eq('email', email).single()
  if (!data) throw new Error('Account not found.')

  const { error } = await admin.auth.admin.updateUserById(data.user_id, { password: newPassword })
  if (error) throw error
}

export async function verifySignupOtp(
  email: string,
  otp: string,
  role: 'employer' | 'recruiter'
): Promise<void> {
  const hash    = hashOtp(otp)
  const purpose = `${role}_signup`
  const admin   = createAdminClient()

  const { data } = await admin
    .from('email_otps')
    .select('id, expires_at, used')
    .eq('email', email)
    .eq('otp_hash', hash)
    .eq('purpose', purpose)
    .eq('used', false)
    .single()

  if (!data) throw new Error('Invalid verification code. Please check and try again.')
  if (new Date(data.expires_at) < new Date()) throw new Error('This code has expired. Please request a new one.')

  await admin.from('email_otps').update({ used: true }).eq('id', data.id)
}
