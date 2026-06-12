'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { sendPasswordResetOtp, verifyPasswordResetOtp, resetPasswordAction } from '@/lib/email/otp'
import { validatePassword } from '@/lib/validations/password'

type Step = 'email' | 'otp' | 'password'

export default function EmployerForgotPasswordPage() {
  const router = useRouter()
  const [step,        setStep]        = useState<Step>('email')
  const [email,       setEmail]       = useState('')
  const [otp,         setOtp]         = useState('')
  const [password,    setPassword]    = useState('')
  const [confirm,     setConfirm]     = useState('')
  const [showPass,    setShowPass]    = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading,     setLoading]     = useState(false)
  const [resent,      setResent]      = useState(false)
  const [error,       setError]       = useState('')

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      await sendPasswordResetOtp(email, 'employer')
      setStep('otp')
    } catch (err: any) { setError(err.message) }
    finally { setLoading(false) }
  }

  async function handleOtp(e: React.FormEvent) {
    e.preventDefault()
    if (otp.length < 6) { setError('Enter the 6-digit code.'); return }
    setError(''); setLoading(true)
    try {
      await verifyPasswordResetOtp(email, otp, 'employer')
      setStep('password')
    } catch (err: any) { setError(err.message) }
    finally { setLoading(false) }
  }

  async function handlePassword(e: React.FormEvent) {
    e.preventDefault()
    const pwdErr = validatePassword(password)
    if (pwdErr) { setError(pwdErr); return }
    if (password !== confirm) { setError('Passwords do not match.'); return }
    setError(''); setLoading(true)
    try {
      await resetPasswordAction(email, password, 'employer')
      router.push('/employer/login?reset=1')
    } catch (err: any) { setError(err.message) }
    finally { setLoading(false) }
  }

  async function handleResend() {
    setError('')
    try {
      await sendPasswordResetOtp(email, 'employer')
      setResent(true); setTimeout(() => setResent(false), 5000)
    } catch (err: any) { setError(err.message) }
  }

  return (
    <div className="ap">
      <AuthHeader />
      <main className="ap-main">
        <div style={{ width: '100%', maxWidth: '440px' }}>
          <div className="ap-right" style={{ padding: '2rem' }}>

            {/* ── Step 1: Email ─────────────────────────────────────── */}
            {step === 'email' && (
              <>
                <StepIcon type="email" />
                <h1 style={{ fontFamily:'var(--font-ui)', fontSize:'1.3rem', fontWeight:800, color:'#032655', letterSpacing:'-0.025em', margin:'0 0 6px' }}>
                  Forgot your password?
                </h1>
                <p style={{ fontFamily:'var(--font-ui)', fontSize:'0.82rem', color:'#5A7A9F', margin:'0 0 1.5rem', lineHeight:1.6 }}>
                  Enter your registered company email. We'll send a 6-digit code to verify it's you.
                </p>

                {error && <ErrorBox msg={error} />}

                <form onSubmit={handleEmail} style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
                  <Field label="Company Email">
                    <input
                      className="auth-input" type="email" value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@company.com" required autoComplete="email"
                    />
                  </Field>
                  <SubmitBtn loading={loading} label="Send Reset Code" />
                  <BackToLogin href="/employer/login" />
                </form>
              </>
            )}

            {/* ── Step 2: OTP ───────────────────────────────────────── */}
            {step === 'otp' && (
              <>
                <StepIcon type="otp" />
                <h1 style={{ fontFamily:'var(--font-ui)', fontSize:'1.25rem', fontWeight:800, color:'#032655', letterSpacing:'-0.025em', margin:'0 0 6px' }}>
                  Check your email
                </h1>
                <p style={{ fontFamily:'var(--font-ui)', fontSize:'0.82rem', color:'#5A7A9F', margin:'0 0 1.5rem', lineHeight:1.6 }}>
                  We sent a 6-digit reset code to <strong style={{ color:'#032655' }}>{email}</strong>
                </p>

                {error  && <ErrorBox msg={error} />}
                {resent && <SuccessBox msg="Code resent successfully" />}

                <form onSubmit={handleOtp} style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
                  <div>
                    <p style={{ fontFamily:'var(--font-ui)', fontSize:'0.65rem', fontWeight:700, color:'#5A7A9F', letterSpacing:'0.1em', textTransform:'uppercase', textAlign:'center', marginBottom:'10px' }}>
                      Reset Code
                    </p>
                    <OtpInput value={otp} onChange={setOtp} />
                  </div>
                  <SubmitBtn loading={loading} label="Verify Code" />
                  <div style={{ textAlign:'center' }}>
                    <p style={{ fontFamily:'var(--font-ui)', fontSize:'0.75rem', color:'#96AFCA', margin:'0 0 5px' }}>Didn't receive it?</p>
                    <button type="button" onClick={handleResend} style={{ fontFamily:'var(--font-ui)', fontSize:'0.75rem', fontWeight:700, color:'#032655', background:'none', border:'none', cursor:'pointer' }}>
                      Resend code
                    </button>
                  </div>
                  <button type="button" onClick={() => { setStep('email'); setOtp(''); setError('') }} style={{ fontFamily:'var(--font-ui)', fontSize:'0.72rem', color:'#96AFCA', background:'none', border:'none', cursor:'pointer', textAlign:'center' }}>
                    ← Change email
                  </button>
                </form>
              </>
            )}

            {/* ── Step 3: New password ──────────────────────────────── */}
            {step === 'password' && (
              <>
                <StepIcon type="lock" />
                <h1 style={{ fontFamily:'var(--font-ui)', fontSize:'1.25rem', fontWeight:800, color:'#032655', letterSpacing:'-0.025em', margin:'0 0 6px' }}>
                  Set new password
                </h1>
                <p style={{ fontFamily:'var(--font-ui)', fontSize:'0.82rem', color:'#5A7A9F', margin:'0 0 1.5rem', lineHeight:1.6 }}>
                  Choose a strong password for your employer account.
                </p>

                {error && <ErrorBox msg={error} />}

                <form onSubmit={handlePassword} style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
                  <Field label="New Password">
                    <div style={{ position:'relative' }}>
                      <input
                        className="auth-input" type={showPass ? 'text' : 'password'}
                        value={password} onChange={e => setPassword(e.target.value)}
                        placeholder="Min. 8 characters" required autoComplete="new-password"
                        style={{ paddingRight:'56px' }}
                      />
                      <button type="button" onClick={() => setShowPass(v => !v)} style={{ position:'absolute', right:'12px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', fontFamily:'var(--font-ui)', fontSize:'0.72rem', fontWeight:700, color:'#5A7A9F', cursor:'pointer', padding:0 }}>
                        {showPass ? 'Hide' : 'Show'}
                      </button>
                    </div>
                  </Field>
                  <Field label="Confirm Password">
                    <div style={{ position:'relative' }}>
                      <input
                        className="auth-input" type={showConfirm ? 'text' : 'password'}
                        value={confirm} onChange={e => setConfirm(e.target.value)}
                        placeholder="Re-enter password" required autoComplete="new-password"
                        style={{ paddingRight:'56px' }}
                      />
                      <button type="button" onClick={() => setShowConfirm(v => !v)} style={{ position:'absolute', right:'12px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', fontFamily:'var(--font-ui)', fontSize:'0.72rem', fontWeight:700, color:'#5A7A9F', cursor:'pointer', padding:0 }}>
                        {showConfirm ? 'Hide' : 'Show'}
                      </button>
                    </div>
                  </Field>
                  <SubmitBtn loading={loading} label="Update Password" />
                </form>
              </>
            )}
          </div>
        </div>
      </main>
      <AuthStyles />
    </div>
  )
}

/* ── Shared sub-components ─────────────────────────────────────────────────── */

function AuthHeader() {
  return (
    <header style={{ background:'#fff', borderBottom:'1px solid #EEF3F8', position:'sticky', top:0, zIndex:100 }}>
      <div style={{ height:'2.5px', background:'linear-gradient(90deg,#032655 0%,#0FB9B1 40%,#15C7C0 60%,#032655 100%)' }} />
      <div style={{ maxWidth:'1100px', margin:'0 auto', padding:'0 2rem', height:'60px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <Link href="/" style={{ textDecoration:'none', display:'flex', alignItems:'center' }}>
          <span aria-hidden style={{ width:'7px', height:'7px', borderRadius:'50%', background:'#0FB9B1', display:'inline-block', marginRight:'7px' }} />
          <span style={{ fontFamily:'var(--font-display)', fontStyle:'italic', fontWeight:400, fontSize:'1.55rem', color:'#032655', letterSpacing:'-0.02em', lineHeight:1 }}>Alpha</span>
          <span style={{ fontFamily:'var(--font-ui)', fontWeight:800, fontSize:'0.95rem', color:'#032655', letterSpacing:'0.05em', textTransform:'uppercase' as const, alignSelf:'flex-end', paddingBottom:'2px', marginLeft:'1px' }}>Nom</span>
        </Link>
        <Link href="/employer/login" style={{ fontFamily:'var(--font-ui)', fontSize:'0.82rem', fontWeight:700, color:'#032655', textDecoration:'none', border:'1.5px solid #D0DBE8', borderRadius:'8px', padding:'6px 14px' }}>
          Back to Sign In
        </Link>
      </div>
    </header>
  )
}

function StepIcon({ type }: { type: 'email' | 'otp' | 'lock' }) {
  const icons = {
    email: <svg width="22" height="22" fill="none" stroke="#0A9E97" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>,
    otp:   <svg width="22" height="22" fill="none" stroke="#0A9E97" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>,
    lock:  <svg width="22" height="22" fill="none" stroke="#0A9E97" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>,
  }
  return (
    <div style={{ width:'48px', height:'48px', borderRadius:'14px', background:'#D8F0EB', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'1rem' }}>
      {icons[type]}
    </div>
  )
}

function OtpInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const refs   = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null))
  const digits = (value + '      ').slice(0, 6).split('')

  function change(i: number, e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value.replace(/\D/g, '').slice(-1)
    const next = [...digits]; next[i] = v || ' '
    onChange(next.join('').trimEnd())
    if (v && i < 5) refs.current[i + 1]?.focus()
  }
  function keyDown(i: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !digits[i]?.trim() && i > 0) {
      const next = [...digits]; next[i - 1] = ' '
      onChange(next.join('').trimEnd())
      refs.current[i - 1]?.focus()
    }
  }
  function paste(e: React.ClipboardEvent) {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (text) { e.preventDefault(); onChange(text); refs.current[Math.min(text.length, 5)]?.focus() }
  }

  return (
    <div style={{ display:'flex', gap:'8px', justifyContent:'center' }}>
      {Array.from({ length: 6 }, (_, i) => (
        <input key={i} ref={el => { refs.current[i] = el }} type="text" inputMode="numeric" maxLength={1}
          value={digits[i]?.trim() || ''} onChange={e => change(i, e)} onKeyDown={e => keyDown(i, e)} onPaste={paste}
          style={{ width:'42px', height:'50px', textAlign:'center', border:`1.5px solid ${digits[i]?.trim() ? '#032655' : '#D0DBE8'}`, borderRadius:'10px', fontFamily:'var(--font-ui)', fontSize:'1.4rem', fontWeight:800, color:'#032655', background:'#fff', outline:'none', boxShadow: digits[i]?.trim() ? '0 0 0 3px rgba(3,38,85,0.08)' : 'none', transition:'border-color 0.15s,box-shadow 0.15s' }}
        />
      ))}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'5px' }}>
      <label style={{ fontFamily:'var(--font-ui)', fontSize:'0.72rem', fontWeight:700, color:'#032655', letterSpacing:'0.03em' }}>{label}</label>
      {children}
    </div>
  )
}

function ErrorBox({ msg }: { msg: string }) {
  return (
    <div style={{ background:'#FEF2F2', border:'1px solid #FECACA', borderRadius:'10px', padding:'0.65rem 0.875rem', marginBottom:'0.75rem', display:'flex', alignItems:'flex-start', gap:'8px' }}>
      <svg width="14" height="14" fill="none" stroke="#DC2626" strokeWidth={2} viewBox="0 0 24 24" style={{ flexShrink:0, marginTop:'1px' }}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.008v.008H12v-.008z" /></svg>
      <p style={{ fontFamily:'var(--font-ui)', fontSize:'0.78rem', color:'#DC2626', margin:0, lineHeight:1.5 }}>{msg}</p>
    </div>
  )
}

function SuccessBox({ msg }: { msg: string }) {
  return (
    <div style={{ background:'#D8F0EB', border:'1px solid #0FB9B1', borderRadius:'10px', padding:'0.6rem 0.875rem', marginBottom:'0.75rem', textAlign:'center' }}>
      <p style={{ fontFamily:'var(--font-ui)', fontSize:'0.78rem', color:'#0A9E97', margin:0, fontWeight:600 }}>{msg}</p>
    </div>
  )
}

function SubmitBtn({ loading, label }: { loading: boolean; label: string }) {
  return (
    <button type="submit" disabled={loading} style={{ width:'100%', padding:'0.825rem', background: loading ? '#96AFCA' : '#032655', color:'#fff', border:'none', borderRadius:'10px', fontFamily:'var(--font-ui)', fontSize:'0.82rem', fontWeight:700, letterSpacing:'0.04em', cursor: loading ? 'not-allowed' : 'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'7px', transition:'background 0.18s', marginTop:'0.25rem' }}>
      {loading ? <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} style={{ animation:'authSpin 0.8s linear infinite' }}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /></svg>Please wait…</> : label}
    </button>
  )
}

function BackToLogin({ href }: { href: string }) {
  return (
    <p style={{ fontFamily:'var(--font-ui)', fontSize:'0.8rem', color:'#5A7A9F', textAlign:'center', margin:0 }}>
      Remember it?{' '}
      <Link href={href} style={{ color:'#032655', fontWeight:700, textDecoration:'none', borderBottom:'1.5px solid #D0DBE8' }}>Sign in</Link>
    </p>
  )
}

function AuthStyles() {
  return (
    <style>{`
      .ap { min-height:100vh; background:#F5F8FC; display:flex; flex-direction:column; }
      .ap-main { flex:1; display:flex; align-items:center; justify-content:center; padding:2.5rem 1.5rem; }
      .ap-right { background:#fff; border:1px solid #E2EAF3; border-radius:18px; box-shadow:0 4px 20px rgba(3,38,85,0.06); }
      .auth-input { width:100%; padding:0.75rem 1rem; border:1.5px solid #D0DBE8; border-radius:9px; font-family:var(--font-ui); font-size:1rem; color:#032655; background:#fff; outline:none; transition:border-color 0.18s,box-shadow 0.18s; box-sizing:border-box; -webkit-appearance:none; }
      .auth-input:focus { border-color:#032655; box-shadow:0 0 0 3px rgba(3,38,85,0.08); }
      .auth-input::placeholder { color:#B0C4D8; }
      @keyframes authSpin { to { transform:rotate(360deg); } }
    `}</style>
  )
}
