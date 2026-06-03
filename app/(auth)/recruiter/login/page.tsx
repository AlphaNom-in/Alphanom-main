'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { loginRecruiter } from '@/lib/auth/recruiter'
import RoleTabs from '@/components/auth/RoleTabs'

export default function RecruiterLoginPage() {
  const router = useRouter()

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const [showPass, setShowPass] = useState(false)
  const [focused,  setFocused]  = useState<string | null>(null)

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault()
    try {
      setLoading(true)
      setError('')
      await loginRecruiter(email, password)
      router.push('/recruiter/dashboard')
    } catch (err: any) {
      console.error(err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-root">

      {/* ── Left panel ─────────────────────────────────────────────────── */}
      <div className="auth-left">
        <div style={{ position:'absolute', top:'-100px', right:'-100px', width:'320px', height:'320px', borderRadius:'50%', background:'radial-gradient(circle, rgba(15,185,177,0.22) 0%, transparent 70%)', pointerEvents:'none' }}/>
        <div style={{ position:'absolute', bottom:'-80px', left:'-80px', width:'280px', height:'280px', borderRadius:'50%', background:'radial-gradient(circle, rgba(15,185,177,0.1) 0%, transparent 70%)', pointerEvents:'none' }}/>
        <div style={{ position:'absolute', inset:0, pointerEvents:'none', backgroundImage:'radial-gradient(circle, rgba(15,185,177,0.08) 1px, transparent 1px)', backgroundSize:'28px 28px' }}/>

        <div style={{ position:'relative', zIndex:2, display:'flex', flexDirection:'column', height:'100%' }}>

          {/* Brand */}
          <Link href="/" style={{ textDecoration:'none', display:'inline-flex', alignItems:'center', gap:'8px', marginBottom:'auto' }}>
            <div style={{ width:'32px', height:'32px', borderRadius:'8px', background:'linear-gradient(135deg,#0FB9B1 0%,#0A9E97 100%)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <span style={{ fontFamily:'var(--font-ui)', fontWeight:800, fontSize:'0.7rem', color:'#fff' }}>AN</span>
            </div>
            <span style={{ fontFamily:'var(--font-ui)', fontWeight:800, fontSize:'1rem', color:'#fff', letterSpacing:'-0.02em' }}>AlphaNom</span>
          </Link>

          {/* Copy */}
          <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', gap:'1.75rem' }}>
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'10px' }}>
                <div style={{ width:'18px', height:'2px', background:'#0FB9B1', borderRadius:'2px' }}/>
                <span style={{ fontFamily:'var(--font-ui)', fontSize:'0.58rem', fontWeight:700, letterSpacing:'0.2em', textTransform:'uppercase', color:'#0FB9B1' }}>Recruiter Portal</span>
              </div>
              <h2 style={{ fontFamily:'var(--font-ui)', fontSize:'clamp(1.75rem,2.5vw,2.5rem)', fontWeight:800, color:'#fff', letterSpacing:'-0.03em', lineHeight:1.1, margin:'0 0 0.875rem' }}>
                Welcome back.<br/>Your pipeline<br/>is waiting.
              </h2>
              <p style={{ fontFamily:'var(--font-ui)', fontSize:'0.875rem', color:'rgba(255,255,255,0.55)', lineHeight:1.7, margin:0, maxWidth:'300px' }}>
                Access active mandates, submit candidates, and track your placements — all in one place.
              </p>
            </div>

            {/* Stats */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.625rem' }}>
              {[
                { val:'200+',   lbl:'Active Mandates' },
                { val:'₹48k',   lbl:'Avg Monthly Earn' },
                { val:'8,000+', lbl:'Roles Closed' },
                { val:'95%',    lbl:'Success Rate' },
              ].map((s, i) => (
                <div key={i} style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'10px', padding:'0.75rem 0.875rem' }}>
                  <p style={{ fontFamily:'var(--font-ui)', fontSize:'1.2rem', fontWeight:800, color:'#0FB9B1', margin:0, letterSpacing:'-0.02em', lineHeight:1 }}>{s.val}</p>
                  <p style={{ fontFamily:'var(--font-ui)', fontSize:'0.58rem', fontWeight:600, color:'rgba(255,255,255,0.38)', margin:'3px 0 0', letterSpacing:'0.06em', textTransform:'uppercase' }}>{s.lbl}</p>
                </div>
              ))}
            </div>
          </div>

          <p style={{ fontFamily:'var(--font-ui)', fontSize:'0.68rem', color:'rgba(255,255,255,0.25)', marginTop:'2rem' }}>
            © 2025 AlphaNom · India's Premium Recruitment Platform
          </p>
        </div>
      </div>

      {/* ── Right panel ────────────────────────────────────────────────── */}
      <div className="auth-right">

        <div className="auth-mobile-logo">
          <Link href="/" style={{ textDecoration:'none', display:'inline-flex', alignItems:'center', gap:'8px' }}>
            <div style={{ width:'28px', height:'28px', borderRadius:'7px', background:'linear-gradient(135deg,#0FB9B1 0%,#0A9E97 100%)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <span style={{ fontFamily:'var(--font-ui)', fontWeight:800, fontSize:'0.62rem', color:'#fff' }}>AN</span>
            </div>
            <span style={{ fontFamily:'var(--font-ui)', fontWeight:800, fontSize:'0.95rem', color:'#032655', letterSpacing:'-0.02em' }}>AlphaNom</span>
          </Link>
        </div>

        <RoleTabs active="recruiter" mode="login" />

        <div className="auth-form-wrap">

          {/* Header */}
          <div style={{ marginBottom:'1.75rem' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'8px' }}>
              <div style={{ width:'26px', height:'26px', borderRadius:'7px', background:'#D8F0EB', border:'1px solid rgba(15,185,177,0.3)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <svg width="13" height="13" fill="none" stroke="#0A9E97" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>
                </svg>
              </div>
              <span style={{ fontFamily:'var(--font-ui)', fontSize:'0.58rem', fontWeight:700, letterSpacing:'0.18em', textTransform:'uppercase', color:'#0A9E97' }}>
                Recruiter Login
              </span>
            </div>
            <h1 style={{ fontFamily:'var(--font-ui)', fontSize:'clamp(1.4rem,2.5vw,1.9rem)', fontWeight:800, color:'#032655', letterSpacing:'-0.03em', lineHeight:1.1, margin:'0 0 5px' }}>
              Sign in to your account
            </h1>
            <p style={{ fontFamily:'var(--font-ui)', fontSize:'0.82rem', color:'#5A7A9F', margin:0, lineHeight:1.6 }}>
              Don&apos;t have an account?{' '}
              <Link href="/recruiter/signup" style={{ color:'#0FB9B1', fontWeight:700, textDecoration:'none', borderBottom:'1px solid rgba(15,185,177,0.3)' }}>
                Create one free
              </Link>
            </p>
          </div>

          {/* Error */}
          {error && (
            <div style={{ background:'#FEF2F2', border:'1px solid #FECACA', borderRadius:'10px', padding:'0.7rem 0.875rem', marginBottom:'1.25rem', display:'flex', alignItems:'flex-start', gap:'8px' }}>
              <svg width="15" height="15" fill="none" stroke="#DC2626" strokeWidth={2} viewBox="0 0 24 24" style={{ flexShrink:0, marginTop:'1px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
              </svg>
              <p style={{ fontFamily:'var(--font-ui)', fontSize:'0.78rem', color:'#DC2626', margin:0, lineHeight:1.5 }}>{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>

            <AuthField label="Email Address" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@agency.com" focused={focused === 'email'} onFocus={() => setFocused('email')} onBlur={() => setFocused(null)} required
              icon={<svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/></svg>}
            />

            <div style={{ display:'flex', flexDirection:'column', gap:'5px' }}>
              <AuthField label="Password" type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" focused={focused === 'password'} onFocus={() => setFocused('password')} onBlur={() => setFocused(null)} required
                icon={<svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/></svg>}
                suffix={
                  <button type="button" onClick={() => setShowPass(v => !v)} style={{ background:'none', border:'none', cursor:'pointer', color:'#96AFCA', padding:'0', display:'flex', alignItems:'center' }}>
                    {showPass
                      ? <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"/></svg>
                      : <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                    }
                  </button>
                }
              />
              <div style={{ display:'flex', justifyContent:'flex-end' }}>
                <Link href="/auth/recruiter/forgot-password" style={{ fontFamily:'var(--font-ui)', fontSize:'0.7rem', fontWeight:600, color:'#5A7A9F', textDecoration:'none' }}>
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width:'100%', padding:'0.875rem',
                background: loading ? '#0A9E97' : '#0FB9B1',
                color:'#fff', border:'none', borderRadius:'10px',
                fontFamily:'var(--font-ui)',
                fontSize:'0.72rem', fontWeight:700,
                letterSpacing:'0.12em', textTransform:'uppercase',
                cursor: loading ? 'not-allowed' : 'pointer',
                display:'flex', alignItems:'center', justifyContent:'center', gap:'8px',
                marginTop:'0.125rem',
              }}
            >
              {loading ? (
                <>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} style={{ animation:'authSpin 0.8s linear infinite' }}>
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                  </svg>
                  Signing In…
                </>
              ) : (
                <>
                  Sign In to Dashboard
                  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                  </svg>
                </>
              )}
            </button>

            {/* Divider */}
            <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
              <div style={{ flex:1, height:'1px', background:'#E8EDF5' }}/>
              <span style={{ fontFamily:'var(--font-ui)', fontSize:'0.65rem', color:'#96AFCA', fontWeight:500 }}>or</span>
              <div style={{ flex:1, height:'1px', background:'#E8EDF5' }}/>
            </div>

            <p style={{ fontFamily:'var(--font-ui)', fontSize:'0.75rem', color:'#96AFCA', textAlign:'center', margin:0 }}>
              New here?{' '}
              <Link href="/recruiter/signup" style={{ color:'#0FB9B1', fontWeight:700, textDecoration:'none' }}>Create a free account</Link>
            </p>
          </form>
        </div>
      </div>

      <style>{`
        .auth-root {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
        }
        .auth-left {
          background: #032655;
          padding: 2.75rem;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .auth-right {
          background: #F5F8FC;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem 2rem;
          min-height: 100vh;
        }
        .auth-form-wrap {
          width: 100%;
          max-width: 400px;
          background: #fff;
          border: 1px solid #D0DBE8;
          border-radius: 18px;
          padding: 2.25rem;
          box-shadow: 0 4px 32px rgba(3,38,85,0.08);
        }
        .auth-mobile-logo { display: none; margin-bottom: 1.5rem; }
        @keyframes authSpin { to { transform: rotate(360deg) } }

        @media (max-width: 900px) {
          .auth-root { grid-template-columns: 1fr; }
          .auth-left  { display: none; }
          .auth-right { padding: 2rem 1.25rem; justify-content: flex-start; padding-top: 2.5rem; }
          .auth-mobile-logo { display: flex; }
          .auth-form-wrap { max-width: 100%; }
        }
        @media (max-width: 480px) {
          .auth-right { padding: 1.5rem 1rem; }
          .auth-form-wrap { padding: 1.75rem 1.25rem; border-radius: 14px; }
        }
      `}</style>
    </div>
  )
}

function AuthField({ label, icon, suffix, focused, ...props }: {
  label: string
  icon: React.ReactNode
  suffix?: React.ReactNode
  focused: boolean
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'5px' }}>
      <label style={{ fontFamily:'var(--font-ui)', fontSize:'0.68rem', fontWeight:700, color:'#032655', letterSpacing:'0.04em' }}>
        {label}
      </label>
      <div style={{
        display:'flex', alignItems:'center', gap:'9px',
        border: `1.5px solid ${focused ? '#0FB9B1' : '#D0DBE8'}`,
        borderRadius:'9px', background:'#fff',
        padding:'0 12px',
        boxShadow: focused ? '0 0 0 3px rgba(15,185,177,0.1)' : 'none',
        transition:'border-color 0.18s ease, box-shadow 0.18s ease',
      }}>
        <span style={{ color: focused ? '#0FB9B1' : '#96AFCA', flexShrink:0, display:'flex', transition:'color 0.18s ease' }}>{icon}</span>
        <input
          {...props}
          style={{
            flex:1, padding:'0.72rem 0',
            border:'none', outline:'none',
            fontFamily:'var(--font-ui)',
            fontSize:'0.875rem', color:'#032655',
            background:'transparent',
          }}
        />
        {suffix && <span style={{ flexShrink:0, display:'flex' }}>{suffix}</span>}
      </div>
    </div>
  )
}
