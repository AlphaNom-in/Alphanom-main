'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { loginRecruiter } from '@/lib/auth/recruiter'
import { checkRecruiterEmailExists } from '@/lib/auth/checkEmail'
import { AlphaNomSpinner } from '@/components/auth/AlphaNomSpinner'

function ResetBanner() {
  const searchParams = useSearchParams()
  if (searchParams.get('reset') !== '1') return null
  return (
    <div style={{ background:'#D8F0EB', border:'1px solid #0FB9B1', borderRadius:'10px', padding:'0.7rem 0.875rem', marginBottom:'0.75rem', display:'flex', alignItems:'center', gap:'8px' }}>
      <svg width="15" height="15" fill="none" stroke="#0A9E97" strokeWidth={2} viewBox="0 0 24 24" style={{ flexShrink:0 }}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      <p style={{ fontFamily:'var(--font-ui)', fontSize:'0.78rem', color:'#0A9E97', margin:0, fontWeight:600 }}>Password updated successfully. Sign in with your new password.</p>
    </div>
  )
}

const BENEFITS = [
  'Browse 200+ verified live job mandates',
  'Submit candidates with a single click',
  'Track all your placements in real-time',
  'Earn transparent commissions on every hire',
]

export default function RecruiterLoginPage() {
  const router = useRouter()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault()
    setError('')
    try {
      setLoading(true)
      await loginRecruiter(email, password)
      router.refresh()
      router.push('/recruiter/dashboard')
    } catch (err: any) {
      if (err.message?.toLowerCase().includes('invalid login credentials')) {
        const exists = await checkRecruiterEmailExists(email)
        if (!exists) {
          setError("No account found with this email. Please create one.")
        } else {
          setError('Incorrect password. Please try again.')
        }
      } else {
        setError(err.message)
      }
    } finally { setLoading(false) }
  }

  return (
    <div className="ap">
      <AuthHeader rightSlot={<><span style={{ fontFamily:'var(--font-ui)', fontSize:'0.82rem', color:'#5A7A9F' }}>New to AlphaNom?</span><Link href="/recruiter/signup" style={{ fontFamily:'var(--font-ui)', fontSize:'0.82rem', fontWeight:700, color:'#0FB9B1', textDecoration:'none', border:'1.5px solid #0FB9B1', borderRadius:'8px', padding:'6px 14px', marginLeft:'10px' }}>Join free</Link></>} />

      <main className="ap-main">
        <div className="ap-two-col">

          {/* ── Left info card ─────────────────────────────────────────── */}
          <div className="ap-left">
            <div style={{ marginBottom:'1.5rem' }}>
              <span style={{ fontFamily:'var(--font-ui)', fontSize:'0.6rem', fontWeight:700, letterSpacing:'0.16em', textTransform:'uppercase', color:'#0FB9B1' }}>For Recruiters</span>
              <h2 style={{ fontFamily:'var(--font-ui)', fontSize:'clamp(1.2rem,2vw,1.6rem)', fontWeight:800, color:'#032655', letterSpacing:'-0.025em', lineHeight:1.2, margin:'8px 0 0' }}>
                New to AlphaNom?
              </h2>
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:'12px', marginBottom:'2rem' }}>
              {BENEFITS.map((b, i) => (
                <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:'10px' }}>
                  <div style={{ width:'20px', height:'20px', borderRadius:'50%', background:'#D8F0EB', border:'1.5px solid rgba(15,185,177,0.4)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:'1px' }}>
                    <svg width="10" height="10" fill="none" stroke="#0A9E97" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>
                  </div>
                  <p style={{ fontFamily:'var(--font-ui)', fontSize:'0.82rem', color:'#3D5A7A', margin:0, lineHeight:1.55 }}>{b}</p>
                </div>
              ))}
            </div>

            <Link href="/recruiter/signup" style={{ display:'inline-flex', alignItems:'center', gap:'7px', fontFamily:'var(--font-ui)', fontSize:'0.78rem', fontWeight:700, color:'#0FB9B1', textDecoration:'none', border:'1.5px solid #0FB9B1', borderRadius:'9px', padding:'10px 18px' }}>
              Join as Recruiter
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
            </Link>

            <div className="ap-illus" style={{ marginTop:'auto', paddingTop:'2rem' }}>
              <RecruiterIllustration />
            </div>
          </div>

          {/* ── Right form card ────────────────────────────────────────── */}
          <div className="ap-right">
            <RoleTabs role="recruiter" mode="login" />

            <div style={{ marginBottom:'1.5rem' }}>
              <h1 style={{ fontFamily:'var(--font-ui)', fontSize:'1.3rem', fontWeight:800, color:'#032655', letterSpacing:'-0.025em', margin:'0 0 4px' }}>Sign in</h1>
              <p style={{ fontFamily:'var(--font-ui)', fontSize:'0.82rem', color:'#5A7A9F', margin:0 }}>Welcome back to your recruiter account</p>
            </div>

            <Suspense fallback={null}><ResetBanner /></Suspense>

            {error && <ErrorBox msg={error} />}

            <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
              <Field label="Email Address">
                <input className="auth-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@agency.com" required autoComplete="email"/>
              </Field>

              <Field label="Password">
                <div style={{ position:'relative' }}>
                  <input className="auth-input" type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" required autoComplete="current-password" style={{ paddingRight:'56px' }}/>
                  <button type="button" onClick={() => setShowPass(v => !v)} style={{ position:'absolute', right:'12px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', fontFamily:'var(--font-ui)', fontSize:'0.72rem', fontWeight:700, color:'#5A7A9F', cursor:'pointer', padding:0 }}>{showPass ? 'Hide' : 'Show'}</button>
                </div>
                <div style={{ textAlign:'right', marginTop:'4px' }}>
                  <Link href="/auth/recruiter/forgot-password" style={{ fontFamily:'var(--font-ui)', fontSize:'0.72rem', fontWeight:600, color:'#96AFCA', textDecoration:'none' }}>Forgot password?</Link>
                </div>
              </Field>

              <SubmitBtn loading={loading} label="Sign In" bg="#0FB9B1" />

              <p style={{ fontFamily:'var(--font-ui)', fontSize:'0.8rem', color:'#5A7A9F', textAlign:'center', margin:0 }}>
                Don&apos;t have an account?{' '}
                <Link href="/recruiter/signup" style={{ color:'#0FB9B1', fontWeight:700, textDecoration:'none', borderBottom:'1.5px solid rgba(15,185,177,0.3)' }}>Create one free</Link>
              </p>
            </form>
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

function RecruiterIllustration() {
  return (
    <svg viewBox="0 0 280 180" fill="none" style={{ width:'100%', maxWidth:'260px', display:'block' }}>
      <circle cx="140" cy="95" r="75" fill="rgba(15,185,177,0.06)"/>
      {/* Central person */}
      <circle cx="140" cy="80" r="22" fill="#D8F0EB" stroke="#0FB9B1" strokeWidth="1.5"/>
      <circle cx="140" cy="73" r="8" fill="#0A9E97"/>
      <path d="M120 100c0-11 9-16 20-16s20 5 20 16" fill="#0A9E97"/>
      {/* Company nodes */}
      {[[55,55],[225,55],[42,120],[238,120],[140,155]].map(([cx,cy],i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r="14" fill={i<2 ? '#EEF5FF' : '#F0F7F6'} stroke={i<2 ? '#96AFCA' : '#0FB9B1'} strokeWidth="1.5"/>
          <rect x={cx-6} y={cy-5} width="12" height="9" rx="1.5" fill={i<2 ? '#5A7A9F' : '#0A9E97'} opacity="0.7"/>
          <rect x={cx-3} y={cy+4} width="6" height="2" rx="1" fill={i<2 ? '#5A7A9F' : '#0A9E97'} opacity="0.4"/>
        </g>
      ))}
      {/* Connection lines */}
      {[[55,55,118,78],[225,55,162,78],[42,120,118,95],[238,120,162,95],[140,141,140,155]].map(([x1,y1,x2,y2],i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={i<2 ? '#96AFCA' : '#0FB9B1'} strokeWidth="1.2" strokeDasharray="4 3"/>
      ))}
      {/* Earnings badge */}
      <rect x="96" y="158" width="88" height="18" rx="9" fill="#032655"/>
      <text x="140" y="171" textAnchor="middle" fontFamily="system-ui" fontSize="8.5" fontWeight="700" fill="#0FB9B1">₹48k avg/month · 95% success</text>
    </svg>
  )
}

function AuthStyles() {
  return (
    <style>{`
      .ap { min-height:100vh; background:#F5F8FC; display:flex; flex-direction:column; }
      .ap-main { flex:1; display:flex; align-items:center; justify-content:center; padding:2.5rem 1.5rem; }
      .ap-two-col { display:flex; gap:1.25rem; width:100%; max-width:920px; align-items:stretch; }
      .ap-left { flex:0 0 310px; background:linear-gradient(145deg,#fafcff 0%,#f0f7f6 100%); border:1px solid #E2EAF3; border-radius:18px; padding:1.75rem; box-shadow:0 4px 20px rgba(3,38,85,0.06); display:flex; flex-direction:column; }
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
