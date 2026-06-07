'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signUpRecruiter, verifyRecruiterSignupOtp, resendRecruiterOtp } from '@/lib/auth/recruiter'

const BENEFITS = [
  'Access live mandates from 200+ top companies',
  'Build your placement record and credibility',
  'Transparent fee structure with fast payouts',
  'Work on roles that match your specialization',
]

export default function RecruiterSignupPage() {
  const router = useRouter()
  const [step, setStep] = useState<'form' | 'otp'>('form')

  const [fullName,       setFullName]       = useState('')
  const [email,          setEmail]          = useState('')
  const [password,       setPassword]       = useState('')
  const [contactPrimary, setContactPrimary] = useState('')
  const [showPass,       setShowPass]       = useState(false)
  const [otp,            setOtp]            = useState('')
  const [resent,         setResent]         = useState(false)
  const [loading,        setLoading]        = useState(false)
  const [error,          setError]          = useState('')
  const [agreedToTerms,  setAgreedToTerms]  = useState(false)

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!/^\d{10}$/.test(contactPrimary)) {
      setError('Contact number must be exactly 10 digits.')
      return
    }
    if (!agreedToTerms) {
      setError('Please read and agree to the Terms & Conditions to continue.')
      return
    }
    try {
      setLoading(true)
      const result = await signUpRecruiter({ full_name: fullName, email, password, contact_primary: contactPrimary })
      if (result === 'confirm_email') setStep('otp')
      else router.push('/recruiter/dashboard/profile/complete')
    } catch (err: any) { setError(err.message) }
    finally { setLoading(false) }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    if (otp.length < 6) { setError('Enter the 6-digit code.'); return }
    setError(''); setLoading(true)
    try {
      await verifyRecruiterSignupOtp(email, otp)
      router.push('/recruiter/dashboard/profile/complete')
    } catch (err: any) { setError(err.message) }
    finally { setLoading(false) }
  }

  async function handleResend() {
    setError('')
    try { await resendRecruiterOtp(email); setResent(true); setTimeout(() => setResent(false), 5000) }
    catch (err: any) { setError(err.message) }
  }

  return (
    <div className="ap">
      <AuthHeader rightSlot={<><span style={{ fontFamily:'var(--font-ui)', fontSize:'0.82rem', color:'#5A7A9F' }}>Already registered?</span><Link href="/recruiter/login" style={{ fontFamily:'var(--font-ui)', fontSize:'0.82rem', fontWeight:700, color:'#0FB9B1', textDecoration:'none', border:'1.5px solid #0FB9B1', borderRadius:'8px', padding:'6px 14px', marginLeft:'10px' }}>Sign in</Link></>} />

      <main className="ap-main">
        <div className="ap-two-col">

          {/* ── Left info card ─────────────────────────────────────────── */}
          <div className="ap-left">
            <div className="ap-illus" style={{ marginBottom:'1.25rem' }}>
              <RecruiterSignupIllustration />
            </div>

            <div style={{ marginBottom:'0.75rem' }}>
              <span style={{ fontFamily:'var(--font-ui)', fontSize:'0.6rem', fontWeight:700, letterSpacing:'0.16em', textTransform:'uppercase', color:'#0FB9B1' }}>For Recruiters</span>
              <h2 style={{ fontFamily:'var(--font-ui)', fontSize:'1.1rem', fontWeight:800, color:'#032655', letterSpacing:'-0.02em', lineHeight:1.25, margin:'6px 0 0' }}>
                On joining AlphaNom, you can
              </h2>
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
              {BENEFITS.map((b, i) => (
                <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:'10px' }}>
                  <div style={{ width:'18px', height:'18px', borderRadius:'50%', background:'#D8F0EB', border:'1.5px solid rgba(15,185,177,0.4)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:'1px' }}>
                    <svg width="9" height="9" fill="none" stroke="#0A9E97" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>
                  </div>
                  <p style={{ fontFamily:'var(--font-ui)', fontSize:'0.8rem', color:'#3D5A7A', margin:0, lineHeight:1.5 }}>{b}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right form card ────────────────────────────────────────── */}
          <div className="ap-right">
            {step === 'form' ? (
              <>
                <RoleTabs role="recruiter" mode="signup" />

                <div style={{ marginBottom:'1.25rem' }}>
                  <h1 style={{ fontFamily:'var(--font-ui)', fontSize:'1.3rem', fontWeight:800, color:'#032655', letterSpacing:'-0.025em', margin:'0 0 4px' }}>Create account</h1>
                  <p style={{ fontFamily:'var(--font-ui)', fontSize:'0.82rem', color:'#5A7A9F', margin:0 }}>Join the network and start placing candidates</p>
                </div>

                {error && <ErrorBox msg={error} />}

                <form onSubmit={handleSignup} style={{ display:'flex', flexDirection:'column', gap:'0.875rem' }}>
                  <Field label="Full Name">
                    <input className="auth-input" type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Your full name" required autoComplete="name"/>
                  </Field>
                  <Field label="Email Address">
                    <input className="auth-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@agency.com" required autoComplete="email"/>
                  </Field>
                  <Field label="Password">
                    <div style={{ position:'relative' }}>
                      <input className="auth-input" type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Create a strong password" required autoComplete="new-password" style={{ paddingRight:'56px' }}/>
                      <button type="button" onClick={() => setShowPass(v => !v)} style={{ position:'absolute', right:'12px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', fontFamily:'var(--font-ui)', fontSize:'0.72rem', fontWeight:700, color:'#5A7A9F', cursor:'pointer', padding:0 }}>{showPass ? 'Hide' : 'Show'}</button>
                    </div>
                  </Field>
                  <Field label="Primary Contact Number">
                    <input className="auth-input" type="tel" inputMode="numeric" maxLength={10} value={contactPrimary} onChange={e => setContactPrimary(e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="10-digit mobile number" required/>
                  </Field>

                  {/* Terms agreement */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '12px 14px', background: agreedToTerms ? '#F0FBF9' : '#F8FAFC', border: `1px solid ${agreedToTerms ? 'rgba(15,185,177,0.3)' : '#E2EAF3'}`, borderRadius: '9px', transition: 'all 0.2s' }}>
                    <input
                      type="checkbox"
                      id="rec-terms"
                      checked={agreedToTerms}
                      onChange={e => setAgreedToTerms(e.target.checked)}
                      style={{ marginTop: '2px', accentColor: '#0FB9B1', width: '15px', height: '15px', flexShrink: 0, cursor: 'pointer' }}
                    />
                    <label htmlFor="rec-terms" style={{ fontFamily: 'var(--font-ui)', fontSize: '0.76rem', color: '#5A7A9F', lineHeight: 1.55, cursor: 'pointer' }}>
                      I have read and agree to the{' '}
                      <a href="/terms/recruiter" target="_blank" rel="noopener noreferrer" style={{ color: '#0FB9B1', fontWeight: 700, textDecoration: 'underline' }}>
                        AlphaNom Recruiter Terms & Conditions
                      </a>
                    </label>
                  </div>

                  <SubmitBtn loading={loading} label="Create Account & Verify Email" bg="#0FB9B1" />

                  <p style={{ fontFamily:'var(--font-ui)', fontSize:'0.8rem', color:'#5A7A9F', textAlign:'center', margin:0 }}>
                    Already have an account?{' '}
                    <Link href="/recruiter/login" style={{ color:'#0FB9B1', fontWeight:700, textDecoration:'none', borderBottom:'1.5px solid rgba(15,185,177,0.3)' }}>Sign in</Link>
                  </p>
                </form>
              </>
            ) : (
              /* ── OTP step ── */
              <>
                <div style={{ textAlign:'center', marginBottom:'1.5rem' }}>
                  <div style={{ width:'48px', height:'48px', borderRadius:'14px', background:'#D8F0EB', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1rem' }}>
                    <svg width="22" height="22" fill="none" stroke="#0A9E97" strokeWidth={1.8} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/>
                    </svg>
                  </div>
                  <h1 style={{ fontFamily:'var(--font-ui)', fontSize:'1.25rem', fontWeight:800, color:'#032655', letterSpacing:'-0.025em', margin:'0 0 6px' }}>Check your email</h1>
                  <p style={{ fontFamily:'var(--font-ui)', fontSize:'0.82rem', color:'#5A7A9F', margin:0, lineHeight:1.6 }}>
                    We sent a 6-digit verification code to<br/>
                    <strong style={{ color:'#032655' }}>{email}</strong>
                  </p>
                </div>

                {error && <ErrorBox msg={error} />}
                {resent && (
                  <div style={{ background:'#D8F0EB', border:'1px solid #0FB9B1', borderRadius:'10px', padding:'0.6rem', marginBottom:'1rem', textAlign:'center' }}>
                    <p style={{ fontFamily:'var(--font-ui)', fontSize:'0.78rem', color:'#0A9E97', margin:0, fontWeight:600 }}>Code resent successfully</p>
                  </div>
                )}

                <form onSubmit={handleVerify} style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
                  <div>
                    <p style={{ fontFamily:'var(--font-ui)', fontSize:'0.65rem', fontWeight:700, color:'#5A7A9F', letterSpacing:'0.1em', textTransform:'uppercase', textAlign:'center', marginBottom:'10px' }}>
                      Verification Code
                    </p>
                    <OtpInput value={otp} onChange={setOtp} />
                  </div>

                  <SubmitBtn loading={loading} label="Verify & Continue" bg="#0FB9B1" />

                  <div style={{ textAlign:'center' }}>
                    <p style={{ fontFamily:'var(--font-ui)', fontSize:'0.75rem', color:'#96AFCA', margin:'0 0 6px' }}>Didn&apos;t receive the code?</p>
                    <button type="button" onClick={handleResend} style={{ fontFamily:'var(--font-ui)', fontSize:'0.75rem', fontWeight:700, color:'#0FB9B1', background:'none', border:'none', cursor:'pointer' }}>
                      Resend code
                    </button>
                  </div>

                  <button type="button" onClick={() => { setStep('form'); setOtp(''); setError('') }} style={{ fontFamily:'var(--font-ui)', fontSize:'0.72rem', color:'#96AFCA', background:'none', border:'none', cursor:'pointer', textAlign:'center' }}>
                    ← Back to signup
                  </button>
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

function AuthHeader({ rightSlot }: { rightSlot?: React.ReactNode }) {
  return (
    <header style={{ background:'#fff', borderBottom:'1px solid #EEF3F8', position:'sticky', top:0, zIndex:100 }}>
      <div style={{ height:'2.5px', background:'linear-gradient(90deg,#032655 0%,#0FB9B1 40%,#15C7C0 60%,#032655 100%)' }}/>
      <div style={{ maxWidth:'1100px', margin:'0 auto', padding:'0 2rem', height:'60px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <Link href="/" style={{ textDecoration:'none', display:'flex', alignItems:'center' }}>
          <span aria-hidden style={{ width:'7px', height:'7px', borderRadius:'50%', background:'#0FB9B1', display:'inline-block', marginRight:'7px', flexShrink:0 }}/>
          <span style={{ fontFamily:'var(--font-display)', fontStyle:'italic', fontWeight:400, fontSize:'1.55rem', color:'#032655', letterSpacing:'-0.02em', lineHeight:1 }}>Alpha</span>
          <span style={{ fontFamily:'var(--font-ui)', fontWeight:800, fontSize:'0.95rem', color:'#032655', letterSpacing:'0.05em', textTransform:'uppercase' as const, alignSelf:'flex-end', paddingBottom:'2px', marginLeft:'1px' }}>Nom</span>
        </Link>
        {rightSlot && <div className="ap-hd-right" style={{ display:'flex', alignItems:'center' }}>{rightSlot}</div>}
      </div>
    </header>
  )
}

function RoleTabs({ role, mode }: { role: 'employer' | 'recruiter'; mode: 'login' | 'signup' }) {
  return (
    <div style={{ display:'flex', gap:'3px', background:'#F0F4F9', borderRadius:'10px', padding:'3px', marginBottom:'1.5rem' }}>
      {(['employer','recruiter'] as const).map(r => {
        const active = r === role
        const href = r==='employer' ? (mode==='login' ? '/employer/login' : '/employer/signup') : (mode==='login' ? '/recruiter/login' : '/recruiter/signup')
        return (
          <Link key={r} href={href} style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:'5px', padding:'9px 0', borderRadius:'7px', textDecoration:'none', fontFamily:'var(--font-ui)', fontSize:'0.78rem', fontWeight:700, background: active ? '#032655' : 'transparent', color: active ? '#fff' : '#96AFCA', transition:'all 0.15s ease' }}>
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              {r==='employer' ? <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18h16.5a1.5 1.5 0 011.5 1.5v11.25a1.5 1.5 0 01-1.5 1.5H3.75a1.5 1.5 0 01-1.5-1.5V4.5a1.5 1.5 0 011.5-1.5z"/> : <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>}
            </svg>
            {r==='employer' ? 'Employer' : 'Recruiter'}
          </Link>
        )
      })}
    </div>
  )
}

function OtpInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const refs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null))
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
          style={{ width:'42px', height:'50px', textAlign:'center', border:`1.5px solid ${digits[i]?.trim() ? '#0FB9B1' : '#D0DBE8'}`, borderRadius:'10px', fontFamily:'var(--font-ui)', fontSize:'1.4rem', fontWeight:800, color:'#032655', background:'#fff', outline:'none', boxShadow: digits[i]?.trim() ? '0 0 0 3px rgba(15,185,177,0.12)' : 'none', transition:'border-color 0.15s,box-shadow 0.15s' }}
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
    <div style={{ background:'#FEF2F2', border:'1px solid #FECACA', borderRadius:'10px', padding:'0.65rem 0.875rem', marginBottom:'0.5rem', display:'flex', alignItems:'flex-start', gap:'8px' }}>
      <svg width="14" height="14" fill="none" stroke="#DC2626" strokeWidth={2} viewBox="0 0 24 24" style={{ flexShrink:0, marginTop:'1px' }}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.008v.008H12v-.008z"/></svg>
      <p style={{ fontFamily:'var(--font-ui)', fontSize:'0.78rem', color:'#DC2626', margin:0, lineHeight:1.5 }}>{msg}</p>
    </div>
  )
}

function SubmitBtn({ loading, label, bg = '#032655' }: { loading: boolean; label: string; bg?: string }) {
  return (
    <button type="submit" disabled={loading} style={{ width:'100%', padding:'0.825rem', background: loading ? '#96AFCA' : bg, color:'#fff', border:'none', borderRadius:'10px', fontFamily:'var(--font-ui)', fontSize:'0.82rem', fontWeight:700, letterSpacing:'0.04em', cursor: loading ? 'not-allowed' : 'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'7px', transition:'background 0.18s', marginTop:'0.25rem' }}>
      {loading ? <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} style={{ animation:'authSpin 0.8s linear infinite' }}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>Please wait…</> : label}
    </button>
  )
}

function RecruiterSignupIllustration() {
  return (
    <svg viewBox="0 0 260 140" fill="none" style={{ width:'100%', display:'block' }}>
      <circle cx="130" cy="70" r="58" fill="rgba(15,185,177,0.05)"/>
      <rect x="55" y="95" width="22" height="35" rx="3" fill="#D8F0EB"/>
      <rect x="85" y="75" width="22" height="55" rx="3" fill="#96AFCA"/>
      <rect x="115" y="55" width="22" height="75" rx="3" fill="#0FB9B1"/>
      <rect x="145" y="40" width="22" height="90" rx="3" fill="#032655"/>
      <rect x="175" y="60" width="22" height="70" rx="3" fill="#0A9E97"/>
      <circle cx="156" cy="30" r="12" fill="#0FB9B1"/>
      <path d="M156 36v-12M150 30l6-6 6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="30" y="40" width="60" height="22" rx="11" fill="#032655"/>
      <text x="60" y="55" textAnchor="middle" fontFamily="system-ui" fontSize="9" fontWeight="700" fill="#0FB9B1">₹ Earn More</text>
      <line x1="48" y1="130" x2="205" y2="130" stroke="#D0DBE8" strokeWidth="1.5"/>
    </svg>
  )
}

function AuthStyles() {
  return (
    <style>{`
      .ap { min-height:100vh; background:#F5F8FC; display:flex; flex-direction:column; }
      .ap-main { flex:1; display:flex; align-items:center; justify-content:center; padding:2.5rem 1.5rem; }
      .ap-two-col { display:flex; gap:1.25rem; width:100%; max-width:920px; align-items:stretch; }
      .ap-left { flex:0 0 300px; background:linear-gradient(145deg,#fafcff 0%,#f0f7f6 100%); border:1px solid #E2EAF3; border-radius:18px; padding:1.75rem; box-shadow:0 4px 20px rgba(3,38,85,0.06); display:flex; flex-direction:column; }
      .ap-right { flex:1; min-width:0; background:#fff; border:1px solid #E2EAF3; border-radius:18px; padding:1.75rem; box-shadow:0 4px 20px rgba(3,38,85,0.06); }
      .auth-input { width:100%; padding:0.75rem 1rem; border:1.5px solid #D0DBE8; border-radius:9px; font-family:var(--font-ui); font-size:1rem; color:#032655; background:#fff; outline:none; transition:border-color 0.18s,box-shadow 0.18s; box-sizing:border-box; -webkit-appearance:none; }
      .auth-input:focus { border-color:#0FB9B1; box-shadow:0 0 0 3px rgba(15,185,177,0.1); }
      .auth-input::placeholder { color:#B0C4D8; }
      @keyframes authSpin { to { transform:rotate(360deg); } }
      @media (max-width:768px) {
        .ap-two-col { flex-direction:column; max-width:500px; }
        .ap-left { flex:none; }
        .ap-illus { display:none; }
      }
      @media (max-width:480px) {
        .ap-main { padding:1rem 0.875rem; align-items:flex-start; }
        .ap-left,.ap-right { padding:1.25rem; border-radius:14px; }
        .ap-hd-right span { display:none; }
        .ap-two-col { gap:0.875rem; }
      }
      @media (max-width:360px) {
        .ap-main { padding:0.75rem; }
        .ap-left,.ap-right { padding:1rem; border-radius:12px; }
      }
    `}</style>
  )
}
