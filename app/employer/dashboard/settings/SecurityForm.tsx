'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { sendChangePasswordOtp, verifyChangePasswordOtp } from '@/lib/email/otp'
import { validatePassword } from '@/lib/validations/password'

const inp: React.CSSProperties = {
  width: '100%', padding: '10px 13px', borderRadius: '9px',
  border: '1.5px solid #D0DBE8', fontFamily: 'var(--font-ui)',
  fontSize: '0.875rem', color: '#032655', background: '#fff',
  outline: 'none', boxSizing: 'border-box',
}
const lbl: React.CSSProperties = {
  display: 'block', fontFamily: 'var(--font-ui)', fontSize: '0.7rem',
  fontWeight: 700, letterSpacing: '0.04em', color: '#3D5A7A', marginBottom: '6px',
}

export default function SecurityForm({ userEmail }: { userEmail: string }) {
  const router = useRouter()
  const supabase = createClient()

  // Step: 'form' = password entry, 'otp' = verification code
  const [step, setStep] = useState<'form' | 'otp'>('form')

  // Form step
  const [newPwd,     setNewPwd]     = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')
  const [pwdErr,     setPwdErr]     = useState('')
  const [pwdPending, setPwdPending] = useState(false)

  // OTP step
  const [otp,        setOtp]        = useState('')
  const [otpErr,     setOtpErr]     = useState('')
  const [otpPending, setOtpPending] = useState(false)
  const [pwdSaved,   setPwdSaved]   = useState(false)

  // Sign out all
  const [soaPending, setSoaPending] = useState(false)
  const [soaDone,    setSoaDone]    = useState(false)

  async function handleRequestOtp(e: React.FormEvent) {
    e.preventDefault()
    setPwdErr('')
    const pwdErr = validatePassword(newPwd)
    if (pwdErr) { setPwdErr(pwdErr); return }
    if (newPwd !== confirmPwd) { setPwdErr('Passwords do not match.'); return }
    setPwdPending(true)
    try {
      await sendChangePasswordOtp(userEmail)
      setStep('otp')
    } catch (err: any) {
      setPwdErr(err.message ?? 'Failed to send verification code.')
    } finally {
      setPwdPending(false)
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault()
    setOtpErr('')
    if (otp.trim().length !== 6) { setOtpErr('Please enter the 6-digit code.'); return }
    setOtpPending(true)
    try {
      await verifyChangePasswordOtp(userEmail, otp.trim(), newPwd)
      setNewPwd(''); setConfirmPwd(''); setOtp('')
      setStep('form')
      setPwdSaved(true)
      setTimeout(() => setPwdSaved(false), 4000)
    } catch (err: any) {
      setOtpErr(err.message ?? 'Verification failed.')
    } finally {
      setOtpPending(false)
    }
  }

  function handleBack() {
    setStep('form')
    setOtp(''); setOtpErr('')
  }

  async function handleSignOutAll() {
    setSoaPending(true)
    await supabase.auth.signOut({ scope: 'global' })
    setSoaPending(false)
    setSoaDone(true)
    setTimeout(() => router.push('/employer/login'), 1500)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

      {/* Change Password */}
      <div>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', fontWeight: 700, color: '#032655', margin: '0 0 14px' }}>Change Password</p>

        {step === 'form' ? (
          <form onSubmit={handleRequestOtp}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '400px' }}>
              <div>
                <label style={lbl}>Account Email</label>
                <input style={{ ...inp, background: '#F5F8FC', color: '#96AFCA' }} value={userEmail} disabled />
              </div>
              <div>
                <label style={lbl}>New Password</label>
                <input style={inp} type="password" placeholder="Minimum 8 characters" value={newPwd} onChange={e => setNewPwd(e.target.value)} autoComplete="new-password" />
              </div>
              <div>
                <label style={lbl}>Confirm New Password</label>
                <input style={inp} type="password" placeholder="Re-enter new password" value={confirmPwd} onChange={e => setConfirmPwd(e.target.value)} autoComplete="new-password" />
              </div>

              {pwdErr && (
                <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '8px 12px' }}>
                  <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: '#DC2626', margin: 0 }}>{pwdErr}</p>
                </div>
              )}
              {pwdSaved && (
                <div style={{ background: '#F0FBF9', border: '1px solid rgba(15,185,177,0.3)', borderRadius: '8px', padding: '8px 12px', display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <svg width="13" height="13" fill="none" stroke="#0A9E97" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                  <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: '#0A9E97', margin: 0 }}>Password updated successfully.</p>
                </div>
              )}

              <div>
                <button
                  type="submit" disabled={pwdPending}
                  style={{ padding: '10px 24px', borderRadius: '9px', border: 'none', background: pwdPending ? '#96AFCA' : '#032655', color: '#fff', fontFamily: 'var(--font-ui)', fontSize: '0.82rem', fontWeight: 700, cursor: pwdPending ? 'not-allowed' : 'pointer' }}
                >
                  {pwdPending ? 'Sending code…' : 'Send Verification Code'}
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div style={{ maxWidth: '400px' }}>
            {/* OTP step info box */}
            <div style={{ background: '#F0FBF9', border: '1px solid rgba(15,185,177,0.25)', borderRadius: '10px', padding: '12px 16px', marginBottom: '18px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <svg width="16" height="16" fill="none" stroke="#0A9E97" strokeWidth={2} viewBox="0 0 24 24" style={{ flexShrink: 0, marginTop: '1px' }}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
              <div>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', fontWeight: 700, color: '#032655', margin: '0 0 2px' }}>Verification code sent</p>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', color: '#5A7A9F', margin: 0, lineHeight: 1.5 }}>
                  We sent a 6-digit code to <strong>{userEmail}</strong>. Enter it below to confirm your password change. Valid for 10 minutes.
                </p>
              </div>
            </div>

            <form onSubmit={handleVerifyOtp}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={lbl}>Verification Code</label>
                  <input
                    style={{ ...inp, letterSpacing: '0.2em', fontSize: '1.1rem', fontWeight: 700, textAlign: 'center' }}
                    type="text" inputMode="numeric" maxLength={6} placeholder="000000"
                    value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                    autoFocus
                  />
                </div>

                {otpErr && (
                  <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '8px 12px' }}>
                    <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: '#DC2626', margin: 0 }}>{otpErr}</p>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <button
                    type="submit" disabled={otpPending}
                    style={{ padding: '10px 24px', borderRadius: '9px', border: 'none', background: otpPending ? '#96AFCA' : '#032655', color: '#fff', fontFamily: 'var(--font-ui)', fontSize: '0.82rem', fontWeight: 700, cursor: otpPending ? 'not-allowed' : 'pointer' }}
                  >
                    {otpPending ? 'Verifying…' : 'Verify & Update Password'}
                  </button>
                  <button
                    type="button" onClick={handleBack}
                    style={{ padding: '10px 16px', borderRadius: '9px', border: '1.5px solid #D0DBE8', background: '#fff', color: '#5A7A9F', fontFamily: 'var(--font-ui)', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Back
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: '#EEF3F8' }} />

      {/* Sign out all devices */}
      <div>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', fontWeight: 700, color: '#032655', margin: '0 0 6px' }}>Active Sessions</p>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: '#5A7A9F', margin: '0 0 14px', lineHeight: 1.6 }}>
          Sign out from all devices — including this one. You will be redirected to the login page.
        </p>
        {soaDone ? (
          <div style={{ background: '#F0FBF9', border: '1px solid rgba(15,185,177,0.3)', borderRadius: '8px', padding: '8px 12px', display: 'flex', gap: '6px', alignItems: 'center' }}>
            <svg width="13" height="13" fill="none" stroke="#0A9E97" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: '#0A9E97', margin: 0 }}>Signed out of all devices. Redirecting…</p>
          </div>
        ) : (
          <button
            onClick={handleSignOutAll} disabled={soaPending}
            style={{ padding: '10px 24px', borderRadius: '9px', border: '1.5px solid #FECACA', background: '#FFF5F5', color: '#C53030', fontFamily: 'var(--font-ui)', fontSize: '0.82rem', fontWeight: 700, cursor: soaPending ? 'not-allowed' : 'pointer', opacity: soaPending ? 0.6 : 1 }}
          >
            {soaPending ? 'Signing out…' : 'Sign Out All Devices'}
          </button>
        )}
      </div>
    </div>
  )
}
