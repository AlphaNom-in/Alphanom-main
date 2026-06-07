'use client'

import { useState } from 'react'
import Link from 'next/link'

const EMPLOYER_POINTS = [
  'Access 140+ specialist recruiters instantly',
  'First candidates arrive within 48 hours',
  'Pay only when you hire — zero upfront cost',
  'Real-time dashboard to track every submission',
]

const RECRUITER_POINTS = [
  'Browse verified, active job briefs from growing companies',
  'Submit candidates with one click',
  'Transparent fee structure, fast payouts',
  'Work on roles that match your domain',
]

export default function CTABanner() {
  const [hovered, setHovered] = useState<'employer' | 'recruiter' | null>(null)

  return (
    <section className="cta-section" style={{ padding: '6rem 0', background: '#F4F8FC', position: 'relative', overflow: 'hidden' }}>

      {/* Background */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'radial-gradient(circle, rgba(3,38,85,0.04) 1px, transparent 1px)', backgroundSize: '28px 28px' }}/>
      <div style={{ position: 'absolute', top: '-200px', right: '-200px', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(15,185,177,0.08) 0%, transparent 70%)', pointerEvents: 'none' }}/>

      <div className="cta-inner" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2.5rem', position: 'relative', zIndex: 2 }}>

        {/* Top label */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '1rem' }}>
            <div style={{ width: '24px', height: '2px', background: '#0FB9B1', borderRadius: '2px' }}/>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.63rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#0FB9B1' }}>
              Get Started Today
            </span>
            <div style={{ width: '24px', height: '2px', background: '#0FB9B1', borderRadius: '2px' }}/>
          </div>
          <h2 style={{ fontFamily: 'var(--font-ui)', fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 800, color: '#032655', letterSpacing: '-0.03em', lineHeight: 1.1, margin: '0 0 1rem' }}>
            Two Paths.<br/>
            <span style={{ color: '#0FB9B1' }}>One Platform.</span>
          </h2>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.9375rem', color: '#5A7A9F', lineHeight: 1.7, maxWidth: '480px', margin: '0 auto' }}>
            Whether you're hiring or placing candidates — AlphaNom is built to make your side of the table more productive.
          </p>
        </div>

        {/* Two path cards */}
        <div className="cta-path-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '2rem' }}>

          {/* Employer card */}
          <div
            onMouseEnter={() => setHovered('employer')}
            onMouseLeave={() => setHovered(null)}
            style={{
              background: hovered === 'employer' ? '#032655' : '#fff',
              border: `1px solid ${hovered === 'employer' ? '#032655' : '#DCE8F4'}`,
              borderRadius: '24px', padding: '2.5rem',
              boxShadow: hovered === 'employer' ? '0 24px 60px rgba(3,38,85,0.25)' : '0 4px 20px rgba(3,38,85,0.06)',
              transform: hovered === 'employer' ? 'translateY(-4px)' : 'translateY(0)',
              transition: 'all 0.3s ease', cursor: 'default',
              position: 'relative', overflow: 'hidden',
              display: 'flex', flexDirection: 'column', gap: '1.75rem',
            }}
          >
            <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '220px', height: '220px', borderRadius: '50%', background: hovered === 'employer' ? 'radial-gradient(circle, rgba(15,185,177,0.15) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(3,38,85,0.04) 0%, transparent 70%)', pointerEvents: 'none', transition: 'background 0.3s ease' }}/>

            {/* Icon + badge */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: hovered === 'employer' ? 'rgba(15,185,177,0.15)' : '#EEF5FF', border: `1px solid ${hovered === 'employer' ? 'rgba(15,185,177,0.3)' : '#DCE8F4'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: hovered === 'employer' ? '#0FB9B1' : '#032655', transition: 'all 0.3s ease' }}>
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18h16.5a1.5 1.5 0 011.5 1.5v11.25a1.5 1.5 0 01-1.5 1.5H3.75a1.5 1.5 0 01-1.5-1.5V4.5a1.5 1.5 0 011.5-1.5z"/>
                </svg>
              </div>
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: hovered === 'employer' ? '#0FB9B1' : '#5A7A9F', background: hovered === 'employer' ? 'rgba(15,185,177,0.12)' : '#EEF5FF', border: `1px solid ${hovered === 'employer' ? 'rgba(15,185,177,0.3)' : '#DCE8F4'}`, borderRadius: '6px', padding: '4px 10px', transition: 'all 0.3s ease' }}>
                For Employers
              </span>
            </div>

            {/* Headline */}
            <div>
              <h3 style={{ fontFamily: 'var(--font-ui)', fontSize: '1.4rem', fontWeight: 800, color: hovered === 'employer' ? '#fff' : '#032655', letterSpacing: '-0.025em', lineHeight: 1.2, margin: '0 0 0.75rem', transition: 'color 0.3s ease' }}>
                Hire Faster,<br/>Hire Smarter.
              </h3>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.85rem', color: hovered === 'employer' ? 'rgba(255,255,255,0.65)' : '#5A7A9F', lineHeight: 1.7, margin: 0, transition: 'color 0.3s ease' }}>
                Stop sifting through hundreds of resumes. Let specialist recruiters do the heavy lifting.
              </p>
            </div>

            {/* Points */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {EMPLOYER_POINTS.map((pt, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <div style={{ width: '18px', height: '18px', borderRadius: '50%', flexShrink: 0, background: hovered === 'employer' ? 'rgba(15,185,177,0.2)' : '#EEF5FF', border: `1px solid ${hovered === 'employer' ? 'rgba(15,185,177,0.4)' : '#DCE8F4'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '1px', transition: 'all 0.3s ease' }}>
                    <svg width="9" height="9" fill="none" stroke={hovered === 'employer' ? '#0FB9B1' : '#032655'} strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>
                  </div>
                  <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: hovered === 'employer' ? 'rgba(255,255,255,0.75)' : '#3D5A7A', margin: 0, lineHeight: 1.5, transition: 'color 0.3s ease' }}>{pt}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <Link
              href="/employer/signup"
              style={{
                fontFamily: 'var(--font-ui)', fontSize: '0.7rem', fontWeight: 700,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                background: hovered === 'employer' ? '#0FB9B1' : '#032655',
                color: '#fff', border: 'none',
                padding: '0.85rem 1.5rem', borderRadius: '10px',
                textDecoration: 'none', cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                transition: 'background 0.3s ease', alignSelf: 'flex-start',
              }}
            >
              Join as Employer
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
            </Link>
          </div>

          {/* Recruiter card */}
          <div
            onMouseEnter={() => setHovered('recruiter')}
            onMouseLeave={() => setHovered(null)}
            style={{
              background: hovered === 'recruiter' ? '#032655' : '#fff',
              border: `1px solid ${hovered === 'recruiter' ? '#032655' : '#DCE8F4'}`,
              borderRadius: '24px', padding: '2.5rem',
              boxShadow: hovered === 'recruiter' ? '0 24px 60px rgba(3,38,85,0.25)' : '0 4px 20px rgba(3,38,85,0.06)',
              transform: hovered === 'recruiter' ? 'translateY(-4px)' : 'translateY(0)',
              transition: 'all 0.3s ease', cursor: 'default',
              position: 'relative', overflow: 'hidden',
              display: 'flex', flexDirection: 'column', gap: '1.75rem',
            }}
          >
            <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '220px', height: '220px', borderRadius: '50%', background: hovered === 'recruiter' ? 'radial-gradient(circle, rgba(15,185,177,0.15) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(3,38,85,0.04) 0%, transparent 70%)', pointerEvents: 'none', transition: 'background 0.3s ease' }}/>

            {/* Icon + badge */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: hovered === 'recruiter' ? 'rgba(15,185,177,0.15)' : '#EEF5FF', border: `1px solid ${hovered === 'recruiter' ? 'rgba(15,185,177,0.3)' : '#DCE8F4'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: hovered === 'recruiter' ? '#0FB9B1' : '#032655', transition: 'all 0.3s ease' }}>
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>
                </svg>
              </div>
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: hovered === 'recruiter' ? '#0FB9B1' : '#5A7A9F', background: hovered === 'recruiter' ? 'rgba(15,185,177,0.12)' : '#EEF5FF', border: `1px solid ${hovered === 'recruiter' ? 'rgba(15,185,177,0.3)' : '#DCE8F4'}`, borderRadius: '6px', padding: '4px 10px', transition: 'all 0.3s ease' }}>
                For Recruiters
              </span>
            </div>

            {/* Headline */}
            <div>
              <h3 style={{ fontFamily: 'var(--font-ui)', fontSize: '1.4rem', fontWeight: 800, color: hovered === 'recruiter' ? '#fff' : '#032655', letterSpacing: '-0.025em', lineHeight: 1.2, margin: '0 0 0.75rem', transition: 'color 0.3s ease' }}>
                More Placements,<br/>More Earnings.
              </h3>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.85rem', color: hovered === 'recruiter' ? 'rgba(255,255,255,0.65)' : '#5A7A9F', lineHeight: 1.7, margin: 0, transition: 'color 0.3s ease' }}>
                Access verified jobs from top companies. Submit candidates and get paid — it's that simple.
              </p>
            </div>

            {/* Points */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {RECRUITER_POINTS.map((pt, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <div style={{ width: '18px', height: '18px', borderRadius: '50%', flexShrink: 0, background: hovered === 'recruiter' ? 'rgba(15,185,177,0.2)' : '#EEF5FF', border: `1px solid ${hovered === 'recruiter' ? 'rgba(15,185,177,0.4)' : '#DCE8F4'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '1px', transition: 'all 0.3s ease' }}>
                    <svg width="9" height="9" fill="none" stroke={hovered === 'recruiter' ? '#0FB9B1' : '#032655'} strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>
                  </div>
                  <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: hovered === 'recruiter' ? 'rgba(255,255,255,0.75)' : '#3D5A7A', margin: 0, lineHeight: 1.5, transition: 'color 0.3s ease' }}>{pt}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <Link
              href="/recruiter/signup"
              style={{
                fontFamily: 'var(--font-ui)', fontSize: '0.7rem', fontWeight: 700,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                background: hovered === 'recruiter' ? '#0FB9B1' : '#032655',
                color: '#fff', border: 'none',
                padding: '0.85rem 1.5rem', borderRadius: '10px',
                textDecoration: 'none', cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                transition: 'background 0.3s ease', alignSelf: 'flex-start',
              }}
            >
              Join as Recruiter
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
            </Link>
          </div>
        </div>

        {/* Bottom dark strip */}
        <div className="cta-stats-strip" style={{
          background: '#032655', borderRadius: '20px',
          padding: '2rem 2.5rem',
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1rem',
          position: 'relative', overflow: 'hidden',
          boxShadow: '0 20px 50px rgba(3,38,85,0.2)',
        }}>
          <div style={{ position: 'absolute', right: '-60px', top: '-60px', width: '220px', height: '220px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(15,185,177,0.12) 0%, transparent 70%)', pointerEvents: 'none' }}/>
          <div style={{ position: 'absolute', left: '-40px', bottom: '-40px', width: '180px', height: '180px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)', pointerEvents: 'none' }}/>

          {[
            { value: '22+',  label: 'Companies Onboarded', color: '#0FB9B1' },
            { value: '140+', label: 'Active Recruiters',   color: '#fff'    },
            { value: '85+',  label: 'Roles Filled',        color: '#0FB9B1' },
            { value: '48h',  label: 'Avg. First Match',    color: '#fff'    },
          ].map((s, i) => (
            <div key={i} style={{ position: 'relative', zIndex: 1, textAlign: 'center', borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.08)' : 'none', padding: '0 0.5rem' }}>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: 'clamp(1.5rem, 2.5vw, 2.25rem)', fontWeight: 800, color: s.color, margin: 0, lineHeight: 1, letterSpacing: '-0.03em' }}>
                {s.value}
              </p>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', margin: '5px 0 0' }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .cta-path-grid { grid-template-columns: 1fr !important; }
          .cta-path-grid a { align-self: stretch !important; justify-content: center !important; }
        }
        @media (max-width: 640px) {
          .cta-stats-strip { grid-template-columns: 1fr 1fr !important; padding: 1.5rem !important; gap: 0 !important; }
          .cta-stats-strip > div { border-left: none !important; padding: 0.75rem !important; }
          .cta-stats-strip > div:nth-child(2n) { border-left: 1px solid rgba(255,255,255,0.08) !important; }
          .cta-stats-strip > div:nth-child(n+3) { border-top: 1px solid rgba(255,255,255,0.08) !important; }
        }
        @media (max-width: 480px) {
          .cta-path-grid > div { padding: 1.75rem 1.5rem !important; }
          .cta-section { padding: 4rem 0 !important; }
          .cta-inner { padding: 0 1.25rem !important; }
        }
      `}</style>
    </section>
  )
}