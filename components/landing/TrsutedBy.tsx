'use client'

import { useEffect, useRef, useState } from 'react'

const COMPANIES = [
  { name: 'Razorpay',  initial: 'R', color: '#3395FF', sector: 'Fintech'    },
  { name: 'PhonePe',   initial: 'P', color: '#5F259F', sector: 'Payments'   },
  { name: 'Swiggy',    initial: 'S', color: '#FC8019', sector: 'FoodTech'   },
  { name: 'Zepto',     initial: 'Z', color: '#9B51E0', sector: 'Q-commerce' },
  { name: 'Paytm',     initial: 'P', color: '#00BAF2', sector: 'Fintech'    },
  { name: 'Meesho',    initial: 'M', color: '#570DF8', sector: 'E-commerce' },
  { name: 'CRED',      initial: 'C', color: '#1C1C1C', sector: 'Fintech'    },
  { name: 'Groww',     initial: 'G', color: '#00D09C', sector: 'Wealthtech' },
  { name: 'Slice',     initial: 'S', color: '#FF4F5E', sector: 'BNPL'       },
  { name: 'Ola',       initial: 'O', color: '#EF4444', sector: 'Mobility'   },
  { name: 'Nykaa',     initial: 'N', color: '#FC2779', sector: 'Beauty'     },
  { name: 'Zerodha',   initial: 'Z', color: '#387ED1', sector: 'Fintech'    },
]

const STATS = [
  { value: '200+',  label: 'Companies Hiring',  icon: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18h16.5a1.5 1.5 0 011.5 1.5v11.25a1.5 1.5 0 01-1.5 1.5H3.75a1.5 1.5 0 01-1.5-1.5V4.5a1.5 1.5 0 011.5-1.5z"/>
    </svg>
  )},
  { value: '1,500+', label: 'Active Recruiters', icon: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>
    </svg>
  )},
  { value: '8,000+', label: 'Roles Closed',      icon: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
    </svg>
  )},
  { value: '95%',   label: 'Success Rate',       icon: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"/>
    </svg>
  )},
]

export default function TrustedBy() {
  const row1Ref = useRef<HTMLDivElement>(null)
  const row2Ref = useRef<HTMLDivElement>(null)
  const [statsOn, setStatsOn] = useState(false)
  const statsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setStatsOn(true) },
      { threshold: 0.3 }
    )
    if (statsRef.current) observer.observe(statsRef.current)
    return () => observer.disconnect()
  }, [])

  const half1 = COMPANIES.slice(0, 6)
  const half2 = COMPANIES.slice(6)

  return (
    <section style={{
      background: '#032655',
      padding: '6rem 0',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Background elements */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle, rgba(15,185,177,0.07) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }}/>
      <div style={{
        position: 'absolute', top: '-200px', right: '-200px',
        width: '600px', height: '600px', borderRadius: '50%', pointerEvents: 'none',
        background: 'radial-gradient(circle, rgba(15,185,177,0.12) 0%, transparent 65%)',
      }}/>
      <div style={{
        position: 'absolute', bottom: '-150px', left: '-150px',
        width: '450px', height: '450px', borderRadius: '50%', pointerEvents: 'none',
        background: 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 65%)',
      }}/>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2.5rem', position: 'relative', zIndex: 2 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '1.25rem' }}>
            <div style={{ width: '32px', height: '1.5px', background: 'rgba(15,185,177,0.5)' }}/>
            <span style={{
              fontFamily: 'var(--font-ui)', fontSize: '0.62rem', fontWeight: 700,
              letterSpacing: '0.22em', textTransform: 'uppercase', color: '#0FB9B1',
            }}>
              Trusted By
            </span>
            <div style={{ width: '32px', height: '1.5px', background: 'rgba(15,185,177,0.5)' }}/>
          </div>
          <h2 style={{
            fontFamily: 'var(--font-ui)', fontSize: 'clamp(2rem, 3.5vw, 3rem)',
            fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.03em',
            lineHeight: 1.1, margin: '0 0 1rem',
          }}>
            Powering India's<br/>
            <span style={{ color: '#0FB9B1' }}>Fastest-Growing</span> Teams
          </h2>
          <p style={{
            fontFamily: 'var(--font-ui)', fontSize: '0.9375rem', color: 'rgba(255,255,255,0.6)',
            lineHeight: 1.7, maxWidth: '500px', margin: '0 auto',
          }}>
            From seed-stage startups to public-market leaders — the companies
            that move fast trust AlphaNom to find the talent that keeps them there.
          </p>
        </div>

        {/* Marquee Row 1 — left to right */}
        <div style={{ position: 'relative', marginBottom: '1rem', overflow: 'hidden' }}>
          {/* Edge fades */}
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '120px', zIndex: 2, background: 'linear-gradient(90deg, #032655 0%, transparent 100%)', pointerEvents: 'none' }}/>
          <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '120px', zIndex: 2, background: 'linear-gradient(270deg, #032655 0%, transparent 100%)', pointerEvents: 'none' }}/>
          <div ref={row1Ref} style={{ display: 'flex', gap: '1rem', width: 'max-content', animation: 'marquee-left 28s linear infinite' }}>
            {[...half1, ...half1, ...half1].map((c, i) => (
              <CompanyPill key={i} company={c} />
            ))}
          </div>
        </div>

        {/* Marquee Row 2 — right to left */}
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '120px', zIndex: 2, background: 'linear-gradient(90deg, #032655 0%, transparent 100%)', pointerEvents: 'none' }}/>
          <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '120px', zIndex: 2, background: 'linear-gradient(270deg, #032655 0%, transparent 100%)', pointerEvents: 'none' }}/>
          <div ref={row2Ref} style={{ display: 'flex', gap: '1rem', width: 'max-content', animation: 'marquee-right 32s linear infinite' }}>
            {[...half2, ...half2, ...half2].map((c, i) => (
              <CompanyPill key={i} company={c} />
            ))}
          </div>
        </div>

        {/* Stats grid */}
        <div
          ref={statsRef}
          style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1px', marginTop: '4rem',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '20px', overflow: 'hidden',
          }}
        >
          {STATS.map((s, i) => (
            <div
              key={i}
              style={{
                background: '#03306B',
                padding: '2rem 1.75rem',
                display: 'flex', flexDirection: 'column', gap: '0.75rem',
                opacity: statsOn ? 1 : 0,
                transform: statsOn ? 'translateY(0)' : 'translateY(12px)',
                transition: `opacity 0.5s ease ${i * 0.1}s, transform 0.5s ease ${i * 0.1}s`,
              }}
            >
              <div style={{
                width: '40px', height: '40px', borderRadius: '10px',
                background: 'rgba(15,185,177,0.12)',
                border: '1px solid rgba(15,185,177,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#0FB9B1',
              }}>
                {s.icon}
              </div>
              <div>
                <p style={{
                  fontFamily: 'var(--font-ui)', fontSize: 'clamp(1.6rem, 2.5vw, 2.25rem)',
                  fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.03em',
                  lineHeight: 1, margin: '0 0 5px',
                }}>
                  {s.value}
                </p>
                <p style={{
                  fontFamily: 'var(--font-ui)', fontSize: '0.68rem', fontWeight: 600,
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.45)', margin: 0,
                }}>
                  {s.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom trust badges */}
        <div style={{
          marginTop: '2.5rem',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '2rem', flexWrap: 'wrap',
        }}>
          {[
            { icon: '🔒', text: 'Verified employers only' },
            { icon: '⚡', text: 'First candidate in 48hrs' },
            { icon: '✓',  text: '95% placement success rate' },
          ].map((b, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              <span style={{ fontSize: '1rem' }}>{b.icon}</span>
              <span style={{
                fontFamily: 'var(--font-ui)', fontSize: '0.75rem', fontWeight: 500,
                color: 'rgba(255,255,255,0.5)',
              }}>
                {b.text}
              </span>
              {i < 2 && (
                <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', marginLeft: '1.5rem' }} />
              )}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee-left {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        @keyframes marquee-right {
          0%   { transform: translateX(-33.333%); }
          100% { transform: translateX(0); }
        }
        @media (max-width: 768px) {
          .trusted-stats { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </section>
  )
}

function CompanyPill({ company }: { company: { name: string; initial: string; color: string; sector: string } }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        background: hovered ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)',
        border: `1px solid ${hovered ? company.color + '60' : 'rgba(255,255,255,0.1)'}`,
        borderRadius: '100px', padding: '10px 18px 10px 10px',
        cursor: 'default', flexShrink: 0,
        transition: 'background 0.2s ease, border-color 0.2s ease',
        boxShadow: hovered ? `0 0 20px ${company.color}20` : 'none',
      }}
    >
      <div style={{
        width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
        background: `${company.color}25`,
        border: `1px solid ${company.color}50`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-ui)', fontSize: '0.68rem', fontWeight: 800, color: company.color,
      }}>
        {company.initial}
      </div>
      <div>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', fontWeight: 700, color: '#FFFFFF', margin: 0, lineHeight: 1.2 }}>
          {company.name}
        </p>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.6rem', fontWeight: 500, color: 'rgba(255,255,255,0.4)', margin: 0 }}>
          {company.sector}
        </p>
      </div>
    </div>
  )
}