
'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

/* ─── Count-up hook ───────────────────────────────────────────────────────────*/
function useCountUp(target: number, duration = 2000, started = false) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!started) return
    let start: number | null = null
    const tick = (ts: number) => {
      if (!start) start = ts
      const p    = Math.min((ts - start) / duration, 1)
      const ease = 1 - Math.pow(1 - p, 4)
      setVal(Math.floor(ease * target))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [target, duration, started])
  return val
}

const STATS = [
  { num: 200,  suffix: '+', label: 'Companies Hiring'  },
  { num: 1500, suffix: '+', label: 'Active Recruiters' },
  { num: 8000, suffix: '+', label: 'Roles Closed'      },
  { num: 95,   suffix: '%', label: 'Success Rate'      },
]

const CANDIDATE_ROWS = [
  { name: 'Ananya Sharma', meta: '6 yrs · Razorpay', status: 'Shortlisted', statusColor: '#0A9E97', statusBg: '#D8F0EB', dot: '#0FB9B1' },
  { name: 'Rohan Mehta',   meta: '4 yrs · PhonePe',  status: 'In Review',   statusColor: '#7A5C00', statusBg: '#FDF3DC', dot: '#F5A623' },
  { name: 'Priya Nair',    meta: '8 yrs · Swiggy',   status: 'Shortlisted', statusColor: '#0A9E97', statusBg: '#D8F0EB', dot: '#0FB9B1' },
  { name: 'Karan Gupta',   meta: '5 yrs · Zepto',    status: 'In Pipeline', statusColor: '#1C2E4A', statusBg: '#EEF3F8', dot: '#96AFCA' },
]

export default function HeroSection() {
  const [mounted, setMounted] = useState(false)
  const [statsOn, setStatsOn] = useState(false)
  const statsRef              = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setStatsOn(true) },
      { threshold: 0.3 }
    )
    if (statsRef.current) observer.observe(statsRef.current)
    return () => observer.disconnect()
  }, [])

  const c0 = useCountUp(200,  1800, statsOn)
  const c1 = useCountUp(1500, 2000, statsOn)
  const c2 = useCountUp(8000, 2200, statsOn)
  const c3 = useCountUp(95,   1600, statsOn)
  const counts = [c0, c1, c2, c3]

  const anim = (delay = 0): React.CSSProperties => ({
    opacity:    mounted ? 1 : 0,
    transform:  mounted ? 'translateY(0)' : 'translateY(14px)',
    transition: `opacity 0.55s ease ${delay}s, transform 0.55s ease ${delay}s`,
  })

  return (
    <section style={{
      position:      'relative',
      background:    'linear-gradient(150deg, #FFFFFF 0%, #EEF5FF 55%, #E5F4F2 100%)',
      overflow:      'hidden',
      display:       'flex',
      flexDirection: 'column',
      minHeight:     '100vh',
    }}>

      {/* Background blobs */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: '-20%', left: '-15%',
        width: '650px', height: '650px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(3,38,85,0.05) 0%, transparent 65%)',
        pointerEvents: 'none',
      }}/>
      <div aria-hidden="true" style={{
        position: 'absolute', bottom: '-10%', right: '-12%',
        width: '550px', height: '550px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(15,185,177,0.09) 0%, transparent 65%)',
        pointerEvents: 'none',
      }}/>
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle, rgba(3,38,85,0.055) 1px, transparent 1px)',
        backgroundSize: '30px 30px',
        maskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 20%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 20%, transparent 100%)',
      }}/>

      {/* ── Main two-column grid ───────────────────────────────────────────── */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center',
        maxWidth: '1280px', margin: '0 auto',
        padding: '0 2.5rem', width: '100%',
        position: 'relative', zIndex: 2,
      }}>
        <div
          className="hero-grid"
          style={{
            display:             'grid',
            gridTemplateColumns: '1fr 1fr',
            gap:                 '4rem',
            alignItems:          'center',   /* ← vertically centres both columns */
            width:               '100%',
            paddingTop:          '5.5rem',
            paddingBottom:       '3.5rem',
          }}
        >

          {/* ── LEFT column ────────────────────────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* Eyebrow */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', ...anim(0) }}>
              <div style={{ width: '24px', height: '2px', background: '#0FB9B1', borderRadius: '2px', flexShrink: 0 }}/>
              <span style={{
                fontFamily: 'var(--font-ui)', fontSize: '0.63rem', fontWeight: 700,
                letterSpacing: '0.16em', textTransform: 'uppercase', color: '#0FB9B1',
              }}>
                India's Premium Recruitment Platform
              </span>
            </div>

            {/* ── Headline: Plus Jakarta Sans bold — NOT Fraunces ────────── */}
            <div style={anim(0.1)}>
              <h1 style={{
                fontFamily:    'var(--font-ui)',
                fontSize:      'clamp(2rem, 3.6vw, 3.1rem)',   /* reduced from 5.75rem */
                fontWeight:    800,
                lineHeight:    1.1,
                letterSpacing: '-0.03em',
                color:         '#032655',
                margin:        0,
              }}>
                Where great companies<br/>
                meet great{' '}
                <span style={{ color: '#0FB9B1' }}>recruiters.</span>
              </h1>
            </div>

            {/* Sub-copy */}
            <p style={{
              fontFamily: 'var(--font-ui)', fontSize: '0.9375rem', fontWeight: 400,
              lineHeight: 1.7, color: '#5A7A9F', maxWidth: '400px',
              ...anim(0.2),
            }}>
              AlphaNom connects quality employers directly with specialist
              recruitment agencies — faster hires, better fits, zero noise.
            </p>

            {/* ── Stacked identity buttons ────────────────────────────────── */}
            <div style={{
              display: 'flex', flexDirection: 'column', gap: '10px',
              maxWidth: '340px',
              ...anim(0.3),
            }}>
              <IdentityButton
                href="/employer/signup"
                label="I am an Employer"
                sublabel="Post jobs & manage hiring"
                bg="#032655" bgHover="#0A356A"
                icon={
                  <svg fill="none" stroke="currentColor" strokeWidth={2}
                    viewBox="0 0 24 24" style={{ width: '17px', height: '17px' }}>
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M2.25 21h19.5m-18-18h16.5a1.5 1.5 0 011.5 1.5v11.25a1.5 1.5 0 01-1.5 1.5H3.75a1.5 1.5 0 01-1.5-1.5V4.5a1.5 1.5 0 011.5-1.5z"/>
                  </svg>
                }
              />
              <IdentityButton
                href="/recruiter/signup"
                label="I am a Recruiter"
                sublabel="Submit candidates & earn"
                bg="#0FB9B1" bgHover="#0A9E97"
                icon={
                  <svg fill="none" stroke="currentColor" strokeWidth={2}
                    viewBox="0 0 24 24" style={{ width: '17px', height: '17px' }}>
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>
                  </svg>
                }
              />

              <p style={{
                fontFamily: 'var(--font-ui)', fontSize: '0.75rem',
                fontWeight: 400, color: '#96AFCA', textAlign: 'center',
              }}>
                Already have an account?{' '}
                <Link href="/employer/login" style={{
                  color: '#032655', fontWeight: 600, textDecoration: 'none',
                  borderBottom: '1px solid #D0DBE8',
                }}>
                  Log in
                </Link>
              </p>
            </div>

            {/* Social proof */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              ...anim(0.42),
            }}>
              <div style={{ display: 'flex' }}>
                {['#C8A96E','#0FB9B1','#032655','#5A7A9F'].map((c, i) => (
                  <div key={i} style={{
                    width: '26px', height: '26px', borderRadius: '50%',
                    background: c, border: '2px solid #fff',
                    marginLeft: i === 0 ? 0 : '-7px',
                    zIndex: 4 - i, position: 'relative',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-ui)', fontSize: '0.48rem',
                    fontWeight: 800, color: '#fff',
                  }}>
                    {['JD','AR','MK','SP'][i]}
                  </div>
                ))}
              </div>
              <div>
                <div style={{ display: 'flex', gap: '2px', marginBottom: '3px' }}>
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} style={{ width: '9px', height: '9px', color: '#F5A623' }} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  ))}
                </div>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', fontWeight: 500, color: '#5A7A9F' }}>
                  Trusted by <strong style={{ color: '#032655', fontWeight: 700 }}>1,500+</strong> recruiters across India
                </p>
              </div>
            </div>
          </div>

          {/* ── RIGHT column — dashboard card ──────────────────────────────── */}
          <div style={{ position: 'relative', ...anim(0.22) }}>

            {/* Floating pill — top right */}
            <div style={{
              position: 'absolute', top: '-14px', right: '4%', zIndex: 5,
              background: '#fff', border: '1px solid #D0DBE8',
              borderRadius: '100px', padding: '6px 13px',
              display: 'flex', alignItems: 'center', gap: '7px',
              boxShadow: '0 4px 18px rgba(3,38,85,0.09)',
              animation: 'floatY 5s ease-in-out 0.4s infinite',
            }}>
              <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#0FB9B1', flexShrink: 0 }}/>
              <div>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.68rem', fontWeight: 700, color: '#032655', lineHeight: 1.3 }}>
                  New Job Posted
                </p>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.58rem', color: '#96AFCA' }}>
                  CTO · Series B · Bangalore
                </p>
              </div>
            </div>

            {/* Main card */}
            <div style={{
              background: '#fff', border: '1px solid #D0DBE8',
              borderRadius: '16px',
              boxShadow: '0 20px 56px rgba(3,38,85,0.10), 0 4px 12px rgba(3,38,85,0.05)',
              overflow: 'hidden',
              margin: '0 4%',
            }}>
              {/* Gradient stripe */}
              <div style={{ height: '3px', background: 'linear-gradient(90deg, #032655 0%, #0FB9B1 50%, #15C7C0 100%)' }}/>

              {/* Card header */}
              <div style={{
                padding: '0.875rem 1.125rem',
                borderBottom: '1px solid #EEF3F8',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '7px',
                    background: '#DCE8F4', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg style={{ width: '15px', height: '15px', color: '#032655' }} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0"/>
                    </svg>
                  </div>
                  <div>
                    <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.8rem', fontWeight: 700, color: '#032655', lineHeight: 1.25 }}>
                      Senior Product Designer
                    </p>
                    <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', color: '#96AFCA', marginTop: '1px' }}>
                      Fintech · Mumbai · Hybrid
                    </p>
                  </div>
                </div>
                <span style={{
                  fontFamily: 'var(--font-ui)', fontSize: '0.56rem', fontWeight: 700,
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  color: '#0A9E97', background: '#D8F0EB',
                  border: '1px solid #0FB9B1', borderRadius: '4px', padding: '3px 7px',
                }}>
                  Active
                </span>
              </div>

              {/* Candidate rows */}
              <div style={{ padding: '0.25rem 0' }}>
                {CANDIDATE_ROWS.map((c, i) => (
                  <CandidateRow key={i} candidate={c} />
                ))}
              </div>

              {/* Card footer */}
              <div style={{
                padding: '0.75rem 1.125rem',
                borderTop: '1px solid #EEF3F8',
                background: '#FAFCFE',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div style={{ display: 'flex', gap: '1.25rem' }}>
                  {[['12','Submitted'],['4','Shortlisted'],['1','Hired']].map(([n, l]) => (
                    <div key={l}>
                      <p style={{ fontFamily: 'var(--font-ui)', fontSize: '1.1rem', fontWeight: 800, color: '#032655', lineHeight: 1, letterSpacing: '-0.02em' }}>
                        {n}
                      </p>
                      <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.58rem', fontWeight: 500, color: '#96AFCA', marginTop: '2px', letterSpacing: '0.04em' }}>
                        {l}
                      </p>
                    </div>
                  ))}
                </div>
                <button style={{
                  fontFamily: 'var(--font-ui)', fontSize: '0.68rem', fontWeight: 700,
                  color: '#0FB9B1', background: 'none', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '4px',
                }}>
                  View all
                  <svg style={{ width: '10px', height: '10px' }} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Floating earnings badge */}
            <div style={{
              position: 'absolute', bottom: '-18px', left: '-1%', zIndex: 5,
              background: '#032655', borderRadius: '11px',
              padding: '10px 14px',
              boxShadow: '0 8px 26px rgba(3,38,85,0.22)',
              display: 'flex', alignItems: 'center', gap: '9px',
              animation: 'floatY 4s ease-in-out infinite',
            }}>
              <div style={{
                width: '30px', height: '30px', borderRadius: '7px', flexShrink: 0,
                background: 'rgba(15,185,177,0.18)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg style={{ width: '14px', height: '14px', color: '#0FB9B1' }} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '1.05rem', fontWeight: 800, color: '#fff', lineHeight: 1, letterSpacing: '-0.02em' }}>
                  ₹48,000
                </p>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.6rem', fontWeight: 400, color: 'rgba(245,245,245,0.5)', marginTop: '2px' }}>
                  Earned this month
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats strip ───────────────────────────────────────────────────── */}
      <div ref={statsRef} style={{
        position: 'relative', zIndex: 2,
        borderTop: '1px solid #D0DBE8',
        background: 'rgba(255,255,255,0.8)',
        backdropFilter: 'blur(10px)',
      }}>
        <div
          className="stats-grid"
          style={{
            maxWidth: '1280px', margin: '0 auto', padding: '0 2.5rem',
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          }}
        >
          {STATS.map((s, i) => (
            <div key={s.label} style={{
              padding: '1.5rem 1.25rem',
              borderRight: i < 3 ? '1px solid #D0DBE8' : 'none',
              opacity:   statsOn ? 1 : 0,
              transform: statsOn ? 'translateY(0)' : 'translateY(10px)',
              transition: `opacity 0.5s ease ${i * 0.08}s, transform 0.5s ease ${i * 0.08}s`,
            }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '1px' }}>
                <span style={{
                  fontFamily: 'var(--font-ui)', fontWeight: 800,
                  fontSize: 'clamp(1.5rem, 2.4vw, 2.25rem)',
                  lineHeight: 1, letterSpacing: '-0.03em', color: '#032655',
                }}>
                  {counts[i].toLocaleString()}
                </span>
                <span style={{
                  fontFamily: 'var(--font-ui)', fontWeight: 700,
                  fontSize: 'clamp(1rem, 1.6vw, 1.4rem)',
                  color: '#0FB9B1', lineHeight: 1,
                }}>
                  {s.suffix}
                </span>
              </div>
              <p style={{
                fontFamily: 'var(--font-ui)', fontSize: '0.68rem', fontWeight: 600,
                letterSpacing: '0.07em', textTransform: 'uppercase',
                color: '#5A7A9F', marginTop: '5px',
              }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes floatY {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-6px); }
        }
        @media (max-width: 960px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
            padding-top: 6rem !important;
          }
        }
        @media (max-width: 600px) {
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </section>
  )
}

/* ─── Identity button ─────────────────────────────────────────────────────────*/
function IdentityButton({ href, label, sublabel, bg, bgHover, icon }: {
  href: string; label: string; sublabel: string
  bg: string; bgHover: string; icon: React.ReactNode
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <Link
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'space-between',
        padding:        '0.7rem 1rem',          /* compact — not oversized */
        background:     hovered ? bgHover : bg,
        borderRadius:   '8px',
        textDecoration: 'none',
        border:         `1.5px solid ${hovered ? bgHover : bg}`,
        boxShadow:      hovered ? '0 5px 20px rgba(3,38,85,0.16)' : '0 2px 6px rgba(3,38,85,0.08)',
        transform:      hovered ? 'translateY(-1px)' : 'translateY(0)',
        transition:     'background 0.18s ease, box-shadow 0.18s ease, transform 0.15s ease',
        cursor:         'pointer',
      }}
    >
      {/* Icon + labels */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '34px', height: '34px', borderRadius: '7px', flexShrink: 0,
          background: 'rgba(255,255,255,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff',
        }}>
          {icon}
        </div>
        <div>
          <p style={{
            fontFamily: 'var(--font-ui)', fontSize: '0.875rem', fontWeight: 700,
            color: '#fff', letterSpacing: '-0.01em', lineHeight: 1.25,
          }}>
            {label}
          </p>
          <p style={{
            fontFamily: 'var(--font-ui)', fontSize: '0.68rem', fontWeight: 400,
            color: 'rgba(255,255,255,0.6)', marginTop: '1px',
          }}>
            {sublabel}
          </p>
        </div>
      </div>
      {/* Arrow */}
      <svg
        style={{
          width: '14px', height: '14px', color: 'rgba(255,255,255,0.65)', flexShrink: 0,
          transform: hovered ? 'translateX(3px)' : 'translateX(0)',
          transition: 'transform 0.18s ease',
        }}
        fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
      </svg>
    </Link>
  )
}

/* ─── Candidate row ───────────────────────────────────────────────────────────*/
function CandidateRow({ candidate }: {
  candidate: { name: string; meta: string; status: string; statusColor: string; statusBg: string; dot: string }
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0.5rem 1.125rem',
        background: hovered ? '#F4F8FC' : 'transparent',
        transition: 'background 0.14s ease', cursor: 'pointer',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: candidate.dot, flexShrink: 0 }}/>
        <div>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.76rem', fontWeight: 700, color: '#032655', lineHeight: 1.25 }}>
            {candidate.name}
          </p>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.63rem', color: '#96AFCA', marginTop: '1px' }}>
            {candidate.meta}
          </p>
        </div>
      </div>
      <span style={{
        fontFamily: 'var(--font-ui)', fontSize: '0.56rem', fontWeight: 700,
        letterSpacing: '0.07em', textTransform: 'uppercase',
        color: candidate.statusColor, background: candidate.statusBg,
        borderRadius: '4px', padding: '2px 7px',
        border: `1px solid ${candidate.dot}`,
      }}>
        {candidate.status}
      </span>
    </div>
  )
}
