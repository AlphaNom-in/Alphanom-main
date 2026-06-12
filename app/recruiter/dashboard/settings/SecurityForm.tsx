'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
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
  const router   = useRouter()
  const supabase = createClient()

  const [newPwd,     setNewPwd]     = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')
  const [pwdSaved,   setPwdSaved]   = useState(false)
  const [pwdErr,     setPwdErr]     = useState('')
  const [pwdPending, setPwdPending] = useState(false)

  const [soaPending, setSoaPending] = useState(false)
  const [soaDone,    setSoaDone]    = useState(false)

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    setPwdErr(''); setPwdSaved(false)
    const pwdErr = validatePassword(newPwd)
    if (pwdErr) { setPwdErr(pwdErr); return }
    if (newPwd !== confirmPwd) { setPwdErr('Passwords do not match.'); return }
    setPwdPending(true)
    const { error } = await supabase.auth.updateUser({ password: newPwd })
    setPwdPending(false)
    if (error) { setPwdErr(error.message); return }
    setPwdSaved(true)
    setNewPwd(''); setConfirmPwd('')
    setTimeout(() => setPwdSaved(false), 3000)
  }

  async function handleSignOutAll() {
    setSoaPending(true)
    await supabase.auth.signOut({ scope: 'global' })
    setSoaPending(false)
    setSoaDone(true)
    setTimeout(() => router.push('/recruiter/login'), 1500)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

      {/* Change Password */}
      <div>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', fontWeight: 700, color: '#032655', margin: '0 0 14px' }}>Change Password</p>
        <form onSubmit={handleChangePassword}>
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
                {pwdPending ? 'Updating…' : 'Update Password'}
              </button>
            </div>
          </div>
        </form>
      </div>

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