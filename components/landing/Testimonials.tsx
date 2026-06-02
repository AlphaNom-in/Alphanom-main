'use client'

import { useState } from 'react'

const SIDE_STORIES = [
  {
    type: 'Recruiter',
    name: 'Amit Sharma',
    role: 'Tech Recruiter · Bangalore',
    text: 'Closed 4 engineering roles within 45 days and earned over ₹1.2L through AlphaNom.',
    stat: '₹1.2L', statLabel: 'Earned',
    accentColor: '#0FB9B1', accentBg: 'rgba(15,185,177,0.1)', accentBorder: 'rgba(15,185,177,0.25)',
    tagColor: '#0A9E97', tagBg: '#D8F0EB',
  },
  {
    type: 'Employer',
    name: 'Priya Nair',
    role: 'Hiring Manager · Mumbai',
    text: 'Found highly relevant candidates from specialist recruiters instead of sorting hundreds of resumes.',
    stat: '3', statLabel: 'Hires Made',
    accentColor: '#F5A623', accentBg: 'rgba(245,166,35,0.1)', accentBorder: 'rgba(245,166,35,0.25)',
    tagColor: '#7A5C00', tagBg: '#FDF3DC',
  },
  {
    type: 'Recruiter',
    name: 'Rahul Verma',
    role: 'Agency Partner · Delhi',
    text: 'The transparency and recruiter-first workflow helped us scale placements significantly faster.',
    stat: '27', statLabel: 'Placements',
    accentColor: '#0FB9B1', accentBg: 'rgba(15,185,177,0.1)', accentBorder: 'rgba(15,185,177,0.25)',
    tagColor: '#0A9E97', tagBg: '#D8F0EB',
  },
  {
    type: 'Employer',
    name: 'Ankit Mehta',
    role: 'Founder · Pune',
    text: 'AlphaNom reduced our hiring cycle significantly and improved overall candidate quality.',
    stat: '14', statLabel: 'Days to Hire',
    accentColor: '#5A7A9F', accentBg: 'rgba(90,122,159,0.1)', accentBorder: 'rgba(90,122,159,0.25)',
    tagColor: '#1C2E4A', tagBg: '#EEF3F8',
  },
]

const METRICS = [
  { num: '92', label: 'Applications' },
  { num: '18', label: 'Shortlisted'  },
  { num: '1',  label: 'Perfect Hire' },
]

export default function SuccessStories() {
  return (
    <section className="ss-section" style={{
      padding: '6rem 0',
      background: 'linear-gradient(180deg, #FFFFFF 0%, #F4F8FF 100%)',
      position: 'relative', overflow: 'hidden',
    }}>

      {/* Background */}
      <div style={{ position: 'absolute', top: '-180px', left: '-160px', width: '520px', height: '520px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(15,185,177,0.07) 0%, transparent 65%)', pointerEvents: 'none' }}/>
      <div style={{ position: 'absolute', bottom: '-120px', right: '-120px', width: '420px', height: '420px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(3,38,85,0.05) 0%, transparent 65%)', pointerEvents: 'none' }}/>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'radial-gradient(circle, rgba(3,38,85,0.04) 1px, transparent 1px)', backgroundSize: '30px 30px', maskImage: 'radial-gradient(ellipse 60% 60% at 50% 50%, black 10%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse 60% 60% at 50% 50%, black 10%, transparent 100%)' }}/>

      <div className="ss-inner" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2.5rem', position: 'relative', zIndex: 2 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
            <div style={{ width: '24px', height: '2px', background: '#0FB9B1', borderRadius: '2px' }}/>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.63rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#0FB9B1' }}>
              Success Stories
            </span>
            <div style={{ width: '24px', height: '2px', background: '#0FB9B1', borderRadius: '2px' }}/>
          </div>
          <h2 style={{ fontFamily: 'var(--font-ui)', fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em', color: '#032655', margin: 0 }}>
            Real Outcomes,<br/>
            Real <span style={{ color: '#0FB9B1' }}>People.</span>
          </h2>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.9375rem', lineHeight: 1.75, color: '#5A7A9F', maxWidth: '520px', margin: '1rem auto 0' }}>
            Employers hire faster. Recruiters earn more. Here's what the AlphaNom community has to say.
          </p>
        </div>

        {/* Main grid */}
        <div className="ss-grid" style={{ display: 'grid', gridTemplateColumns: '1.25fr 0.75fr', gap: '1.25rem', alignItems: 'stretch' }}>

          {/* LEFT: Featured */}
          <div style={{
            background: '#032655', borderRadius: '24px', overflow: 'hidden',
            boxShadow: '0 24px 60px rgba(3,38,85,0.18)',
            display: 'flex', flexDirection: 'column',
            position: 'relative',
          }}>
            {/* Top gradient stripe */}
            <div style={{ height: '3px', background: 'linear-gradient(90deg, #0FB9B1 0%, #5A7A9F 100%)' }}/>

            {/* Glow inside */}
            <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(15,185,177,0.15) 0%, transparent 70%)', pointerEvents: 'none' }}/>
            <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '250px', height: '250px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)', pointerEvents: 'none' }}/>

            <div style={{ padding: '2.5rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem', position: 'relative', zIndex: 1 }}>

              {/* Top row: icon + badge */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(15,185,177,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="22" height="22" fill="none" stroke="#0FB9B1" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/>
                    <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/>
                  </svg>
                </div>
                <span style={{
                  fontFamily: 'var(--font-ui)', fontSize: '0.56rem', fontWeight: 700,
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  color: '#0FB9B1', background: 'rgba(15,185,177,0.12)',
                  border: '1px solid rgba(15,185,177,0.3)', borderRadius: '6px', padding: '4px 12px',
                }}>
                  Employer · Series B · Mumbai
                </span>
              </div>

              {/* Headline + quote */}
              <div>
                <h3 style={{ fontFamily: 'var(--font-ui)', fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.025em', color: '#fff', margin: '0 0 1.25rem' }}>
                  VP Engineering Hired<br/>In Just{' '}
                  <span style={{ color: '#0FB9B1' }}>14 Days.</span>
                </h3>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.9375rem', lineHeight: 1.8, color: 'rgba(255,255,255,0.68)', margin: 0 }}>
                  "AlphaNom connected us with highly specialised recruiters who understood our requirements
                  from day one. The quality of profiles was significantly better than any traditional sourcing channel we'd used before."
                </p>
              </div>

              {/* Author */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '50%', flexShrink: 0, background: 'linear-gradient(135deg, #0FB9B1 0%, #032655 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 800, color: '#fff', border: '2px solid rgba(255,255,255,0.15)' }}>
                  SK
                </div>
                <div>
                  <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.88rem', fontWeight: 700, color: '#fff', margin: 0, lineHeight: 1.3 }}>Siddharth Kapoor</p>
                  <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', color: 'rgba(255,255,255,0.45)', margin: 0 }}>CTO · Fintech Startup, Mumbai</p>
                </div>
              </div>

              {/* Divider */}
              <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)' }}/>

              {/* Metrics */}
              <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap' }}>
                {METRICS.map(({ num, label }) => (
                  <div key={label}>
                    <p style={{ fontFamily: 'var(--font-ui)', fontSize: 'clamp(1.6rem, 2.5vw, 2.1rem)', fontWeight: 800, color: '#0FB9B1', lineHeight: 1, letterSpacing: '-0.03em', margin: '0 0 4px' }}>
                      {num}
                    </p>
                    <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', margin: 0 }}>
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: 4 story cards */}
          <div className="ss-right" style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            {SIDE_STORIES.map((item, i) => (
              <StoryCard key={i} item={item} />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .ss-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          .ss-right { display: grid !important; grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .ss-right { grid-template-columns: 1fr !important; }
          .ss-section { padding: 4rem 0 !important; }
          .ss-inner { padding: 0 1.25rem !important; }
        }
      `}</style>
    </section>
  )
}

function StoryCard({ item }: { item: typeof SIDE_STORIES[0] }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#fff',
        border: `1px solid ${hovered ? item.accentColor + '60' : '#DCE8F4'}`,
        borderRadius: '16px', padding: '1.1rem 1.25rem 1.1rem 1.4rem',
        boxShadow: hovered ? `0 12px 32px rgba(3,38,85,0.1), 0 0 0 3px ${item.accentColor}15` : '0 4px 14px rgba(3,38,85,0.05)',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'all 0.2s ease',
        cursor: 'default', position: 'relative', overflow: 'hidden',
        display: 'flex', flexDirection: 'column', gap: '0.65rem', flex: 1,
      }}
    >
      {/* Left accent bar */}
      <div style={{
        position: 'absolute', left: 0, top: '16px', bottom: '16px', width: '3px',
        borderRadius: '0 3px 3px 0', background: item.accentColor,
        opacity: hovered ? 1 : 0.4, transition: 'opacity 0.2s ease',
      }}/>

      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{
          fontFamily: 'var(--font-ui)', fontSize: '0.55rem', fontWeight: 700,
          letterSpacing: '0.12em', textTransform: 'uppercase',
          color: item.tagColor, background: item.tagBg,
          borderRadius: '4px', padding: '3px 8px',
          border: `1px solid ${item.accentColor}40`,
        }}>
          {item.type}
        </span>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '1.15rem', fontWeight: 800, color: '#032655', lineHeight: 1, letterSpacing: '-0.02em', margin: 0 }}>
            {item.stat}
          </p>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.54rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#96AFCA', margin: '2px 0 0' }}>
            {item.statLabel}
          </p>
        </div>
      </div>

      {/* Quote */}
      <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.8rem', lineHeight: 1.7, color: '#3D5A7A', margin: 0 }}>
        {item.text}
      </p>

      {/* Person */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{
          width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
          background: item.accentColor,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-ui)', fontSize: '0.52rem', fontWeight: 800, color: '#fff',
        }}>
          {item.name.split(' ').map((n: string) => n[0]).join('')}
        </div>
        <div>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', fontWeight: 700, color: '#032655', margin: 0, lineHeight: 1.3 }}>{item.name}</p>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.62rem', color: '#96AFCA', margin: 0 }}>{item.role}</p>
        </div>
      </div>
    </div>
  )
}