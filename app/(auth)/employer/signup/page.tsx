'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signUpEmployer, verifyEmployerSignupOtp, resendEmployerOtp, validateCompanyEmail } from '@/lib/auth/employer'
import { AlphaNomSpinner } from '@/components/auth/AlphaNomSpinner'
import { validatePassword } from '@/lib/validations/password'

const BENEFITS = [
  'Post jobs and reach 1,500+ specialist recruiters',
  'Receive shortlisted candidates within 48 hours',
  'Manage all applications from one dashboard',
  'No upfront cost — pay only on successful hire',
]

export default function EmployerSignupPage() {
  const router = useRouter()
  const [step, setStep] = useState<'form' | 'otp'>('form')

  const [companyName,    setCompanyName]    = useState('')
  const [username,       setUsername]       = useState('')
  const [email,          setEmail]          = useState('')
  const [password,       setPassword]       = useState('')
  const [contactPrimary, setContactPrimary] = useState('')
  const [showPass,       setShowPass]       = useState(false)
  const [otp,            setOtp]            = useState('')
  const [resent,         setResent]         = useState(false)
  const [loading,        setLoading]        = useState(false)
  const [error,          setError]          = useState('')
  const [emailError,     setEmailError]     = useState('')
  const [agreedToTerms,  setAgreedToTerms]  = useState(false)

  function handleEmailBlur() {
    if (!email) { setEmailError(''); return }
    const err = validateCompanyEmail(email)
    setEmailError(err ?? '')
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    const emailErr = validateCompanyEmail(email)
    if (emailErr) { setEmailError(emailErr); return }
    if (!/^\d{10}$/.test(contactPrimary)) {
      setError('Contact number must be exactly 10 digits.')
      return
    }
    if (!agreedToTerms) {
      setError('Please read and agree to the Terms & Conditions to continue.')
      return
    }
    const pwdErr = validatePassword(password)
    if (pwdErr) { setError(pwdErr); return }
    setError(''); setLoading(true)
    try {
      const result = await signUpEmployer({ company_name: companyName, username, email, password, contact_primary: contactPrimary })
      if (result === 'confirm_email') setStep('otp')
      else router.push('/employer/dashboard')
    } catch (err: any) { setError(err.message) }
    finally { setLoading(false) }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    if (otp.length < 6) { setError('Enter the 6-digit code.'); return }
    setError(''); setLoading(true)
    try {
      await verifyEmployerSignupOtp(email, otp)
      router.push('/employer/dashboard')
    } catch (err: any) { setError(err.message) }
    finally { setLoading(false) }
  }

  async function handleResend() {
    setError('')
    try { await resendEmployerOtp(email); setResent(true); setTimeout(() => setResent(false), 5000) }
    catch (err: any) { setError(err.message) }
  }

  return (
    <div className="ap">
      <AuthHeader rightSlot={<><span style={{ fontFamily:'var(--font-ui)', fontSize:'0.82rem', color:'#5A7A9F' }}>Already registered?</span><Link href="/employer/login" style={{ fontFamily:'var(--font-ui)', fontSize:'0.82rem', fontWeight:700, color:'#032655', textDecoration:'none', border:'1.5px solid #D0DBE8', borderRadius:'8px', padding:'6px 14px', marginLeft:'10px' }}>Sign in</Link></>} />

      <main className="ap-main">
        <div className="ap-two-col">

          {/* ── Left info card ─────────────────────────────────────────── */}
          <div className="ap-left">
            <div className="ap-illus" style={{ marginBottom:'1.25rem' }}>
              <SignupIllustration variant="employer" />
            </div>

            <div style={{ marginBottom:'0.75rem' }}>
              <span style={{ fontFamily:'var(--font-ui)', fontSize:'0.6rem', fontWeight:700, letterSpacing:'0.16em', textTransform:'uppercase', color:'#0FB9B1' }}>For Employers</span>
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
                <RoleTabs role="employer" mode="signup" />

                <div style={{ marginBottom:'1.25rem' }}>
                  <h1 style={{ fontFamily:'var(--font-ui)', fontSize:'1.3rem', fontWeight:800, color:'#032655', letterSpacing:'-0.025em', margin:'0 0 4px' }}>Create account</h1>
                  <p style={{ fontFamily:'var(--font-ui)', fontSize:'0.82rem', color:'#5A7A9F', margin:0 }}>Set up your employer profile to start hiring</p>
                </div>

                {error && <ErrorBox msg={error} />}

                <form onSubmit={handleSignup} style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
                  <Field label="Company Name">
                    <input className="auth-input" type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="e.g. Acme Corp" required/>
                  </Field>
                  <Field label="Username">
                    <input className="auth-input" type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Choose a unique username" required/>
                  </Field>
                  <Field label="Company Email">
                    <input
                      className="auth-input"
                      type="email"
                      value={email}
                      onChange={e => { setEmail(e.target.value); if (emailError) setEmailError('') }}
                      onBlur={handleEmailBlur}
                      placeholder="you@company.com"
                      required
                      autoComplete="email"
                      style={emailError ? { borderColor: '#DC2626', boxShadow: '0 0 0 3px rgba(220,38,38,0.1)' } : undefined}
                    />
                    {emailError ? (
                      <div style={{ display:'flex', alignItems:'center', gap:'5px', marginTop:'4px' }}>
                        <svg width="12" height="12" fill="none" stroke="#DC2626" strokeWidth={2} viewBox="0 0 24 24" style={{ flexShrink:0 }}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9.303 3.376c.866 1.5-.217 3.374-1.948 3.374H4.645c-1.73 0-2.813-1.874-1.948-3.374L10.052 3.378c.866-1.5 3.032-1.5 3.898 0l7.303 12.748zM12 15.75h.007v.008H12v-.008z"/>
                        </svg>
                        <p style={{ fontFamily:'var(--font-ui)', fontSize:'0.7rem', color:'#DC2626', margin:0, lineHeight:1.4 }}>{emailError}</p>
                      </div>
                    ) : (
                      <p style={{ fontFamily:'var(--font-ui)', fontSize:'0.65rem', color:'#96AFCA', margin:'4px 0 0' }}>
                        Use your company or Gmail address — Yahoo and other personal emails not accepted
                      </p>
                    )}
                  </Field>
                  <Field label="Password">
                    <div style={{ position:'relative' }}>
                      <input className="auth-input" type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 8 characters" required autoComplete="new-password" style={{ paddingRight:'56px' }}/>
                      <button type="button" onClick={() => setShowPass(v => !v)} style={{ position:'absolute', right:'12px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', fontFamily:'var(--font-ui)', fontSize:'0.72rem', fontWeight:700, color:'#5A7A9F', cursor:'pointer', padding:0 }}>{showPass ? 'Hide' : 'Show'}</button>
                    </div>
                    <p style={{ fontFamily:'var(--font-ui)', fontSize:'0.65rem', color:'#96AFCA', margin:'4px 0 0' }}>Letters, numbers and symbols only — no spaces</p>
                  </Field>
                  <Field label="Primary Contact Number">
                    <input className="auth-input" type="tel" inputMode="numeric" maxLength={10} value={contactPrimary} onChange={e => setContactPrimary(e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="10-digit mobile number" required/>
                  </Field>

                  {/* Terms agreement */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '12px 14px', background: agreedToTerms ? '#F0FBF9' : '#F8FAFC', border: `1px solid ${agreedToTerms ? 'rgba(15,185,177,0.3)' : '#E2EAF3'}`, borderRadius: '9px', transition: 'all 0.2s' }}>
                    <input
                      type="checkbox"
                      id="emp-terms"
                      checked={agreedToTerms}
                      onChange={e => setAgreedToTerms(e.target.checked)}
                      style={{ marginTop: '2px', accentColor: '#032655', width: '15px', height: '15px', flexShrink: 0, cursor: 'pointer' }}
                    />
                    <label htmlFor="emp-terms" style={{ fontFamily: 'var(--font-ui)', fontSize: '0.76rem', color: '#5A7A9F', lineHeight: 1.55, cursor: 'pointer' }}>
                      I have read and agree to the{' '}
                      <a href="/terms/employer" target="_blank" rel="noopener noreferrer" style={{ color: '#032655', fontWeight: 700, textDecoration: 'underline' }}>
                        AlphaNom Employer Terms & Conditions
                      </a>
                    </label>
                  </div>

                  <SubmitBtn loading={loading} label="Create Account" bg="#032655" />

                  <p style={{ fontFamily:'var(--font-ui)', fontSize:'0.8rem', color:'#5A7A9F', textAlign:'center', margin:0 }}>
                    Already have an account?{' '}
                    <Link href="/employer/login" style={{ color:'#032655', fontWeight:700, textDecoration:'none', borderBottom:'1.5px solid #D0DBE8' }}>Sign in</Link>
                  </p>
                </form>
              </>
            ) : (
              /* OTP step */
              <>
                <div style={{ textAlign:'center', marginBottom:'1.5rem' }}>
                  <div style={{ width:'44px', height:'44px', borderRadius:'12px', background:'#D8F0EB', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1rem' }}>
                    <svg width="20" height="20" fill="none" stroke="#0A9E97" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/></svg>
                  </div>
                  <h1 style={{ fontFamily:'var(--font-ui)', fontSize:'1.25rem', fontWeight:800, color:'#032655', letterSpacing:'-0.025em', margin:'0 0 6px' }}>Check your email</h1>
                  <p style={{ fontFamily:'var(--font-ui)', fontSize:'0.82rem', color:'#5A7A9F', margin:0, lineHeight:1.6 }}>
                    We sent a 6-digit code to <strong style={{ color:'#032655' }}>{email}</strong>
                  </p>
                </div>

                {error && <ErrorBox msg={error} />}
                {resent && <div style={{ background:'#D8F0EB', border:'1px solid #0FB9B1', borderRadius:'10px', padding:'0.6rem', marginBottom:'1rem', textAlign:'center' }}><p style={{ fontFamily:'var(--font-ui)', fontSize:'0.78rem', color:'#0A9E97', margin:0, fontWeight:600 }}>Code resent successfully</p></div>}

                <form onSubmit={handleVerify} style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
                  <div>
                    <p style={{ fontFamily:'var(--font-ui)', fontSize:'0.65rem', fontWeight:700, color:'#5A7A9F', letterSpacing:'0.1em', textTransform:'uppercase', textAlign:'center', marginBottom:'10px' }}>Verification Code</p>
                    <OtpInput value={otp} onChange={setOtp} />
                  </div>
                  <SubmitBtn loading={loading} label="Verify & Continue" bg="#032655" />
                  <div style={{ textAlign:'center' }}>
                    <p style={{ fontFamily:'var(--font-ui)', fontSize:'0.75rem', color:'#96AFCA', margin:'0 0 6px' }}>Didn&apos;t receive the code?</p>
                    <button type="button" onClick={handleResend} style={{ fontFamily:'var(--font-ui)', fontSize:'0.75rem', fontWeight:700, color:'#0FB9B1', background:'none', border:'none', cursor:'pointer' }}>Resend code</button>
                  </div>
                  <button type="button" onClick={() => { setStep('form'); setOtp(''); setError('') }} style={{ fontFamily:'var(--font-ui)', fontSize:'0.72rem', color:'#96AFCA', background:'none', border:'none', cursor:'pointer', textAlign:'center' }}>← Back to signup</button>
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

function AuthHeader({ rightSlot }: { rightSlot?: React.ReactNode }) {
  return (
    <header style={{ background:'#fff', borderBottom:'1px solid #EEF3F8', position:'sticky', top:0, zIndex:100 }}>
      <div style={{ height:'2.5px', background:'linear-gradient(90deg,#032655 0%,#0FB9B1 40%,#15C7C0 60%,#032655 100%)' }}/>
      <div style={{ maxWidth:'1100px', margin:'0 auto', padding:'0 2rem', height:'60px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <Link href="/" style={{ textDecoration:'none', display:'flex', alignItems:'center', gap:'6px' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo.png" alt="AlphaNom logo" width={40} height={40} style={{ display:'block', flexShrink:0 }} />
          <span style={{ fontFamily:'var(--font-ui)', fontWeight:800, fontSize:'1.25rem', color:'#032655', letterSpacing:'-0.02em', lineHeight:1 }}>AlphaNom</span>
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

function SignupIllustration({ variant }: { variant: 'employer' | 'recruiter' }) {
  return variant === 'employer' ? (
    <svg viewBox="0 0 260 140" fill="none" style={{ width:'100%', display:'block' }}>
      <circle cx="130" cy="70" r="60" fill="rgba(3,38,85,0.04)"/>
      {/* Laptop */}
      <rect x="70" y="45" width="120" height="75" rx="5" fill="#032655"/>
      <rect x="76" y="51" width="108" height="60" rx="3" fill="#0A2748"/>
      {/* Screen content - job listings */}
      <rect x="82" y="57" width="96" height="8" rx="2" fill="rgba(15,185,177,0.4)"/>
      <rect x="82" y="70" width="70" height="5" rx="1.5" fill="rgba(255,255,255,0.15)"/>
      <rect x="82" y="79" width="55" height="5" rx="1.5" fill="rgba(255,255,255,0.15)"/>
      <rect x="82" y="88" width="65" height="5" rx="1.5" fill="rgba(255,255,255,0.15)"/>
      <circle cx="163" cy="79" r="7" fill="rgba(15,185,177,0.3)"/>
      <path d="M159 79l3 3 5-5" stroke="#0FB9B1" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Laptop base */}
      <path d="M65 120h130l-5-3H70z" fill="#021E45"/>
      <rect x="110" y="117" width="40" height="3" rx="1.5" fill="#032655"/>
      {/* Floating badge */}
      <rect x="170" y="30" width="68" height="24" rx="12" fill="#0FB9B1"/>
      <text x="204" y="46" textAnchor="middle" fontFamily="system-ui" fontSize="8" fontWeight="700" fill="#fff">200+ Hiring</text>
      <line x1="170" y1="42" x2="152" y2="55" stroke="#0FB9B1" strokeWidth="1" strokeDasharray="3 2"/>
      {/* Floating badge 2 */}
      <rect x="24" y="55" width="56" height="24" rx="12" fill="#EEF5FF" stroke="#D0DBE8" strokeWidth="1"/>
      <text x="52" y="71" textAnchor="middle" fontFamily="system-ui" fontSize="8" fontWeight="600" fill="#032655">Free to post</text>
      <line x1="80" y1="67" x2="94" y2="67" stroke="#96AFCA" strokeWidth="1" strokeDasharray="3 2"/>
    </svg>
  ) : (
    <svg viewBox="0 0 260 140" fill="none" style={{ width:'100%', display:'block' }}>
      <circle cx="130" cy="70" r="60" fill="rgba(15,185,177,0.05)"/>
      {/* Profile card */}
      <rect x="60" y="30" width="140" height="90" rx="10" fill="#fff" stroke="#E2EAF3" strokeWidth="1.5"/>
      <rect x="60" y="30" width="140" height="6" rx="4" fill="#0FB9B1"/>
      {/* Avatar */}
      <circle cx="90" cy="65" r="18" fill="#D8F0EB"/>
      <circle cx="90" cy="60" r="7" fill="#0A9E97"/>
      <path d="M75 80c0-8 7-12 15-12s15 4 15 12" fill="#0A9E97"/>
      {/* Profile info */}
      <rect x="115" y="50" width="70" height="7" rx="3" fill="#032655" opacity="0.8"/>
      <rect x="115" y="62" width="50" height="5" rx="2" fill="#96AFCA"/>
      <rect x="115" y="72" width="40" height="5" rx="2" fill="#96AFCA"/>
      {/* Earnings pill */}
      <rect x="112" y="85" width="72" height="20" rx="10" fill="#D8F0EB" stroke="#0FB9B1" strokeWidth="1"/>
      <text x="148" y="99" textAnchor="middle" fontFamily="system-ui" fontSize="8.5" fontWeight="700" fill="#0A9E97">₹48k this month</text>
      {/* Stars */}
      {[0,1,2,3,4].map(i => <text key={i} x={68+i*13} y={115} fontSize="10" fill="#F5A623">★</text>)}
    </svg>
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
      <svg width="14" height="14" fill="none" stroke="#DC2626" strokeWidth={2} viewBox="0 0 24 24" style={{ flexShrink:0, marginTop:'1px' }}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/></svg>
      <p style={{ fontFamily:'var(--font-ui)', fontSize:'0.78rem', color:'#DC2626', margin:0, lineHeight:1.5 }}>{msg}</p>
    </div>
  )
}

function SubmitBtn({ loading, label, bg='#032655' }: { loading: boolean; label: string; bg?: string }) {
  return (
    <button type="submit" disabled={loading} style={{ width:'100%', padding:'0.825rem', background: loading ? '#96AFCA' : bg, color:'#fff', border:'none', borderRadius:'10px', fontFamily:'var(--font-ui)', fontSize:'0.82rem', fontWeight:700, letterSpacing:'0.04em', cursor: loading ? 'not-allowed' : 'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'7px', transition:'background 0.18s', marginTop:'0.25rem' }}>
      {loading ? <><AlphaNomSpinner />Please wait…</> : label}
    </button>
  )
}

function OtpInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const refs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null))
  const digits = (value + '      ').slice(0, 6).split('')
  function change(i: number, e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value.replace(/\D/g,'').slice(-1)
    const next = [...digits]; next[i] = v || ' '
    onChange(next.join('').trimEnd())
    if (v && i < 5) refs.current[i+1]?.focus()
  }
  function keyDown(i: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !digits[i]?.trim() && i > 0) {
      const next = [...digits]; next[i-1] = ' '
      onChange(next.join('').trimEnd())
      refs.current[i-1]?.focus()
    }
  }
  function paste(e: React.ClipboardEvent) {
    const text = e.clipboardData.getData('text').replace(/\D/g,'').slice(0,6)
    if (text) { e.preventDefault(); onChange(text); refs.current[Math.min(text.length,5)]?.focus() }
  }
  return (
    <div style={{ display:'flex', gap:'8px', justifyContent:'center' }}>
      {Array.from({length:6},(_,i) => (
        <input key={i} ref={el => { refs.current[i]=el }} type="text" inputMode="numeric" maxLength={1}
          value={digits[i]?.trim()||''} onChange={e => change(i,e)} onKeyDown={e => keyDown(i,e)} onPaste={paste}
          style={{ width:'42px', height:'50px', textAlign:'center', border:`1.5px solid ${digits[i]?.trim() ? '#0FB9B1' : '#D0DBE8'}`, borderRadius:'10px', fontFamily:'var(--font-ui)', fontSize:'1.4rem', fontWeight:800, color:'#032655', background:'#fff', outline:'none', boxShadow: digits[i]?.trim() ? '0 0 0 3px rgba(15,185,177,0.12)' : 'none', transition:'border-color 0.15s,box-shadow 0.15s' }}
        />
      ))}
    </div>
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
