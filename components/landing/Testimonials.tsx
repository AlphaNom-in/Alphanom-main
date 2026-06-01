'use client'

import { useState } from 'react'

const SIDE_STORIES = [
  {
    type: 'Recruiter',
    name: 'Amit Sharma',
    role: 'Tech Recruiter · Bangalore',
    text: 'Closed 4 engineering roles within 45 days and earned over ₹1.2L through AlphaNom.',
    stat: '₹1.2L',
    statLabel: 'Earned',
    dot: '#0FB9B1',
    dotBg: '#D8F0EB',
    dotColor: '#0A9E97',
  },
  {
    type: 'Employer',
    name: 'Priya Nair',
    role: 'Hiring Manager · Mumbai',
    text: 'Found highly relevant candidates from specialist recruiters instead of sorting hundreds of resumes.',
    stat: '3',
    statLabel: 'Hires Made',
    dot: '#F5A623',
    dotBg: '#FDF3DC',
    dotColor: '#7A5C00',
  },
  {
    type: 'Recruiter',
    name: 'Rahul Verma',
    role: 'Agency Partner · Delhi',
    text: 'The transparency and recruiter-first workflow helped us scale placements significantly faster.',
    stat: '27',
    statLabel: 'Placements',
    dot: '#0FB9B1',
    dotBg: '#D8F0EB',
    dotColor: '#0A9E97',
  },
  {
    type: 'Employer',
    name: 'Ankit Mehta',
    role: 'Founder · Pune',
    text: 'AlphaNom reduced our hiring cycle significantly and improved overall candidate quality.',
    stat: '14',
    statLabel: 'Days to Hire',
    dot: '#96AFCA',
    dotBg: '#EEF3F8',
    dotColor: '#1C2E4A',
  },
]

const METRICS = [
  { num: '92', label: 'Applications' },
  { num: '18', label: 'Shortlisted' },
  { num: '1',  label: 'Perfect Hire'  },
]

export default function Testimonials() {
  return (
    <section
      style={{
        padding: '6rem 0',
        background: 'linear-gradient(180deg, #FFFFFF 0%, #F4F8FF 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background blobs */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: '-180px', left: '-160px',
        width: '520px', height: '520px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(15,185,177,0.07) 0%, transparent 65%)',
        pointerEvents: 'none',
      }}/>
      <div aria-hidden="true" style={{
        position: 'absolute', bottom: '-120px', right: '-120px',
        width: '420px', height: '420px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(3,38,85,0.05) 0%, transparent 65%)',
        pointerEvents: 'none',
      }}/>
      <div aria-hidden="true" style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle, rgba(3,38,85,0.04) 1px, transparent 1px)',
        backgroundSize: '30px 30px',
        maskImage: 'radial-gradient(ellipse 60% 60% at 50% 50%, black 10%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(ellipse 60% 60% at 50% 50%, black 10%, transparent 100%)',
      }}/>

      <div style={{
        maxWidth: '1280px', margin: '0 auto',
        padding: '0 2.5rem', position: 'relative', zIndex: 2,
      }}>

        {/* ── Section Header ─────────────────────────────────────────────── */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
            <div style={{ width: '24px', height: '2px', background: '#0FB9B1', borderRadius: '2px' }}/>
            <span style={{
              fontFamily: 'var(--font-ui)', fontSize: '0.63rem', fontWeight: 700,
              letterSpacing: '0.16em', textTransform: 'uppercase', color: '#0FB9B1',
            }}>
              Success Stories
            </span>
            <div style={{ width: '24px', height: '2px', background: '#0FB9B1', borderRadius: '2px' }}/>
          </div>

          <h2 style={{
            fontFamily: 'var(--font-ui)',
            fontSize: 'clamp(2rem, 3.5vw, 3rem)',
            fontWeight: 800, lineHeight: 1.1,
            letterSpacing: '-0.03em', color: '#032655', margin: 0,
          }}>
            Real Outcomes,<br/>
            Real <span style={{ color: '#0FB9B1' }}>People.</span>
          </h2>

          <p style={{
            fontFamily: 'var(--font-ui)', fontSize: '0.9375rem', lineHeight: 1.75,
            color: '#5A7A9F', maxWidth: '520px', margin: '1rem auto 0',
          }}>
            Employers hire faster. Recruiters earn more. Here's what the
            AlphaNom community has to say.
          </p>
        </div>

        {/* ── Main Grid ──────────────────────────────────────────────────── */}
        <div
          className="testimonial-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 0.8fr',
            gap: '1.25rem',
            alignItems: 'stretch',
          }}
        >


          {/* ── LEFT: Featured Story ──────────────────────────────────────── */}
          <div className="featured-card" style={{
            background: '#032655',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 24px 60px rgba(3,38,85,0.18)',
            display: 'flex', flexDirection: 'column',
          }}>
            {/* Top gradient stripe */}
            <div style={{ height: '3px', background: 'linear-gradient(90deg, #0FB9B1 0%, #032655 100%)' }}/>

            <div style={{ padding: '2.25rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>

              {/* Quote icon + badge */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '12px',
                  background: 'rgba(15,185,177,0.14)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="22" height="22" fill="none" stroke="#0FB9B1" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/>
                    <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/>
                  </svg>
                </div>
                <span style={{
                  fontFamily: 'var(--font-ui)', fontSize: '0.56rem', fontWeight: 700,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: '#0FB9B1', background: 'rgba(15,185,177,0.12)',
                  border: '1px solid rgba(15,185,177,0.3)', borderRadius: '4px',
                  padding: '3px 9px',
                }}>
                  Employer · Series B
                </span>
              </div>

              {/* Headline */}
              <div>
                <h3 style={{
                  fontFamily: 'var(--font-ui)', fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
                  fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.025em',
                  color: '#fff', margin: '0 0 1rem',
                }}>
                  VP Engineering Hired<br/>
                  In Just{' '}
                  <span style={{ color: '#0FB9B1' }}>14 Days.</span>
                </h3>
                <p style={{
                  fontFamily: 'var(--font-ui)', fontSize: '0.9375rem',
                  lineHeight: 1.8, color: 'rgba(255,255,255,0.72)', margin: 0,
                }}>
                  "AlphaNom connected us with highly specialised recruiters who
                  understood our requirements from day one. The quality of profiles
                  was significantly better than traditional sourcing channels."
                </p>
              </div>

              {/* Author */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0,
                  background: 'linear-gradient(135deg, #0FB9B1 0%, #032655 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-ui)', fontSize: '0.75rem', fontWeight: 800, color: '#fff',
                }}>
                  SK
                </div>
                <div>
                  <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', fontWeight: 700, color: '#fff', margin: 0, lineHeight: 1.3 }}>
                    Siddharth Kapoor
                  </p>
                  <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.68rem', color: 'rgba(255,255,255,0.5)', margin: 0 }}>
                    CTO · Fintech Startup, Mumbai
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)' }}/>

              {/* Metrics row */}
              <div className="metrics-row" style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap' }}>
                {METRICS.map(({ num, label }) => (
                  <div key={label}>
                    <p style={{
                      fontFamily: 'var(--font-ui)', fontSize: 'clamp(1.6rem, 2.5vw, 2.1rem)',
                      fontWeight: 800, color: '#0FB9B1', lineHeight: 1,
                      letterSpacing: '-0.03em', margin: '0 0 4px',
                    }}>
                      {num}
                    </p>
                    <p style={{
                      fontFamily: 'var(--font-ui)', fontSize: '0.65rem', fontWeight: 600,
                      letterSpacing: '0.07em', textTransform: 'uppercase',
                      color: 'rgba(255,255,255,0.45)', margin: 0,
                    }}>
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT: Story Cards ────────────────────────────────────────── */}
          <div className="stories-col" style={{ display: 'grid', gap: '1rem', gridTemplateRows: 'repeat(4, 1fr)' }}>
            {SIDE_STORIES.map((item, i) => (
              <StoryCard key={i} item={item} />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .testimonial-grid {
            grid-template-columns: 1fr !important;
          }
          .stories-col {
            grid-template-rows: unset !important;
          }
          .featured-card {
            border-radius: 20px !important;
          }
        }
        @media (max-width: 600px) {
          .stories-col {
            grid-template-columns: 1fr 1fr !important;
            gap: 0.75rem !important;
          }
          .metrics-row {
            gap: 1.5rem !important;
          }
        }
        @media (max-width: 440px) {
          .stories-col {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  )
}

/* ─── Story Card ─────────────────────────────────────────────────────────────*/
function StoryCard({ item }: {
  item: {
    type: string; name: string; role: string; text: string;
    stat: string; statLabel: string; dot: string; dotBg: string; dotColor: string;
  }
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#fff',
        border: `1px solid ${hovered ? '#B8CFDF' : '#DCE8F4'}`,
        borderRadius: '16px',
        padding: '1.1rem 1.25rem',
        boxShadow: hovered
          ? '0 10px 28px rgba(3,38,85,0.10)'
          : '0 4px 14px rgba(3,38,85,0.05)',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease',
        cursor: 'default',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      {/* Left accent bar */}
      <div style={{
        position: 'absolute', left: 0, top: '20%', bottom: '20%',
        width: '3px', borderRadius: '0 2px 2px 0',
        background: item.dot,
        opacity: hovered ? 1 : 0.5,
        transition: 'opacity 0.18s ease',
      }}/>

      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
        <span style={{
          fontFamily: 'var(--font-ui)', fontSize: '0.56rem', fontWeight: 700,
          letterSpacing: '0.1em', textTransform: 'uppercase',
          color: item.dotColor, background: item.dotBg,
          borderRadius: '4px', padding: '2px 8px',
          border: `1px solid ${item.dot}`,
        }}>
          {item.type}
        </span>

        {/* Stat pill */}
        <div style={{ textAlign: 'right' }}>
          <p style={{
            fontFamily: 'var(--font-ui)', fontSize: '1.05rem', fontWeight: 800,
            color: '#032655', lineHeight: 1, letterSpacing: '-0.02em', margin: 0,
          }}>
            {item.stat}
          </p>
          <p style={{
            fontFamily: 'var(--font-ui)', fontSize: '0.55rem', fontWeight: 600,
            letterSpacing: '0.07em', textTransform: 'uppercase',
            color: '#96AFCA', margin: '1px 0 0',
          }}>
            {item.statLabel}
          </p>
        </div>
      </div>

      {/* Quote */}
      <p style={{
        fontFamily: 'var(--font-ui)', fontSize: '0.82rem', lineHeight: 1.7,
        color: '#3D5A7A', margin: '0 0 0.75rem',
      }}>
        {item.text}
      </p>

      {/* Author */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{
          width: '26px', height: '26px', borderRadius: '50%', flexShrink: 0,
          background: item.dot,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-ui)', fontSize: '0.5rem', fontWeight: 800, color: '#fff',
        }}>
          {item.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', fontWeight: 700, color: '#032655', margin: 0, lineHeight: 1.3 }}>
            {item.name}
          </p>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.62rem', color: '#96AFCA', margin: 0 }}>
            {item.role}
          </p>
        </div>
      </div>
    </div>
  )
}