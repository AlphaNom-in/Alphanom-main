'use client'

import { useState } from 'react'

const STEPS = [
  {
    num: '01',
    title: 'Employer Posts a Job',
    desc: 'Verified companies create detailed job briefs — role, compensation, and expectations. Goes live to the recruiter network instantly.',
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
      </svg>
    ),
    tags: ['Verified Companies', 'Instant Go-Live'],
    color: '#0FB9B1',
  },
  {
    num: '02',
    title: 'Recruiters Submit Candidates',
    desc: 'Specialist recruiters from across India browse live jobs and submit qualified, pre-screened candidates with full profiles.',
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
    tags: ['Pre-screened', 'Full Profiles'],
    color: '#C8A96E',
  },
  {
    num: '03',
    title: 'Track in Real-time',
    desc: 'Both parties track every submission, shortlist, and interview stage on a shared live dashboard — zero black holes.',
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    tags: ['Live Dashboard', 'Zero Delays'],
    color: '#5A7A9F',
  },
  {
    num: '04',
    title: 'Hire & Reward',
    desc: 'When the employer makes an offer, the recruiter earns their placement fee — transparent, fast, and no middlemen.',
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    tags: ['Transparent Fees', 'Fast Payouts'],
    color: '#0FB9B1',
  },
]

export default function HowItWorks() {
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <section className="hiw-section" style={{ padding: '6rem 0', background: '#F4F8FC', position: 'relative', overflow: 'hidden' }}>

      {/* Background texture */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle, rgba(3,38,85,0.04) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }} />
      <div style={{
        position: 'absolute', top: '-200px', right: '-200px', width: '600px', height: '600px',
        borderRadius: '50%', pointerEvents: 'none',
        background: 'radial-gradient(circle, rgba(15,185,177,0.08) 0%, transparent 65%)',
      }} />

      <div className="hiw-inner" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2.5rem', position: 'relative', zIndex: 2 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '14px' }}>
            <div style={{ width: '24px', height: '2px', background: '#0FB9B1', borderRadius: '2px' }} />
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.63rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#0FB9B1' }}>
              How It Works
            </span>
            <div style={{ width: '24px', height: '2px', background: '#0FB9B1', borderRadius: '2px' }} />
          </div>
          <h2 style={{ fontFamily: 'var(--font-ui)', fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 800, color: '#032655', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '1rem' }}>
            Four Steps to the Perfect Hire
          </h2>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.95rem', color: '#5A7A9F', lineHeight: 1.7, maxWidth: '520px', margin: '0 auto' }}>
            A clean, transparent workflow that gets top candidates in front of the right employers — faster than any traditional method.
          </p>
        </div>

        {/* Steps grid */}
        <div className="hiw-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', position: 'relative' }}>

          {/* Connector line behind cards — hidden on mobile */}
          <div className="hiw-connector" style={{
            position: 'absolute', top: '52px', left: 'calc(12.5% + 24px)', right: 'calc(12.5% + 24px)',
            height: '2px', zIndex: 0,
            background: 'linear-gradient(90deg, #0FB9B1 0%, #D0DBE8 33%, #D0DBE8 66%, #0FB9B1 100%)',
          }} />

          {STEPS.map((step, i) => (
            <div
              key={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                background: '#FFFFFF',
                border: `1px solid ${hovered === i ? step.color : '#DCE8F4'}`,
                borderRadius: '20px',
                padding: '1.75rem 1.5rem',
                position: 'relative', zIndex: 1,
                cursor: 'default',
                boxShadow: hovered === i
                  ? `0 20px 50px rgba(3,38,85,0.12), 0 0 0 3px ${step.color}18`
                  : '0 4px 20px rgba(3,38,85,0.05)',
                transform: hovered === i ? 'translateY(-4px)' : 'translateY(0)',
                transition: 'all 0.25s ease',
              }}
            >
              {/* Step number badge */}
              <div style={{
                position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)',
                background: hovered === i ? step.color : '#032655',
                color: '#fff',
                fontFamily: 'var(--font-ui)', fontSize: '0.58rem', fontWeight: 800, letterSpacing: '0.1em',
                padding: '4px 12px', borderRadius: '100px',
                transition: 'background 0.25s ease',
                whiteSpace: 'nowrap',
              }}>
                STEP {step.num}
              </div>

              {/* Icon */}
              <div style={{
                width: '52px', height: '52px', borderRadius: '14px',
                background: hovered === i ? `${step.color}18` : '#EEF5FF',
                border: `1px solid ${hovered === i ? step.color : '#DCE8F4'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: hovered === i ? step.color : '#032655',
                marginBottom: '1.25rem',
                transition: 'all 0.25s ease',
              }}>
                {step.icon}
              </div>

              {/* Title */}
              <h3 style={{
                fontFamily: 'var(--font-ui)', fontSize: '0.92rem', fontWeight: 700,
                color: '#032655', lineHeight: 1.3, marginBottom: '0.6rem', letterSpacing: '-0.01em',
              }}>
                {step.title}
              </h3>

              {/* Desc */}
              <p style={{
                fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: '#5A7A9F',
                lineHeight: 1.65, marginBottom: '1.25rem',
              }}>
                {step.desc}
              </p>

              {/* Tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {step.tags.map(tag => (
                  <span key={tag} style={{
                    fontFamily: 'var(--font-ui)', fontSize: '0.58rem', fontWeight: 700,
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                    color: step.color, background: `${step.color}12`,
                    border: `1px solid ${step.color}30`,
                    padding: '3px 8px', borderRadius: '4px',
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA strip */}
        <div className="hiw-strip" style={{
          marginTop: '3.5rem',
          background: '#032655',
          borderRadius: '20px',
          padding: '2rem 2.5rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: '1.25rem', flexWrap: 'wrap',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', right: '-80px', top: '-80px', width: '250px', height: '250px',
            borderRadius: '50%', background: 'radial-gradient(circle, rgba(15,185,177,0.15) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#0FB9B1', marginBottom: '6px' }}>
              Average time to first candidate
            </p>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '1.4rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
              Under 48 hours — guaranteed.
            </p>
          </div>
          <div className="hiw-strip-btns" style={{ display: 'flex', gap: '12px', flexShrink: 0, position: 'relative', zIndex: 1 }}>
            <a href="/employer/signup" style={{
              fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 700,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              background: '#0FB9B1', color: '#fff', border: 'none',
              padding: '0.75rem 1.6rem', borderRadius: '10px',
              textDecoration: 'none', cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: '7px',
            }}>
              Post a Job
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <a href="/recruiter/signup" style={{
              fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 700,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              background: 'transparent', color: '#fff',
              border: '1px solid rgba(255,255,255,0.2)',
              padding: '0.75rem 1.6rem', borderRadius: '10px',
              textDecoration: 'none', cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center',
            }}>
              Join as Recruiter
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .hiw-grid { grid-template-columns: 1fr 1fr !important; gap: 1rem !important; }
          .hiw-connector { display: none !important; }
        }
        @media (max-width: 560px) {
          .hiw-grid { grid-template-columns: 1fr !important; }
          .hiw-strip { flex-direction: column !important; align-items: flex-start !important; padding: 1.5rem !important; }
          .hiw-strip-btns { width: 100% !important; display: flex !important; }
          .hiw-strip-btns a { flex: 1 !important; justify-content: center !important; }
        }
        @media (max-width: 480px) {
          .hiw-section { padding: 4rem 0 !important; }
          .hiw-inner { padding: 0 1.25rem !important; }
        }
      `}</style>
    </section>
  )
}