'use client'

import Link from 'next/link'
import { useState } from 'react'

const STEPS = [
  {
    num: '01',
    title: 'Complete Your Profile',
    desc: 'Add your recruitment background to build credibility and improve your visibility to employers on the platform.',
    points: [
      'Add recruitment experience, specialization, and industries served',
      'Include your sourcing expertise and preferred tools',
      'Keep your profile updated to improve credibility and visibility',
    ],
    iconPath: 'M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z',
  },
  {
    num: '02',
    title: 'Browse Open Requirements',
    desc: 'Explore all active job openings on the platform and review the full details before committing to work on a role.',
    points: [
      'Explore active job openings available on the platform',
      'Review job descriptions, eligibility criteria, and compensation details',
      'Check recruitment payouts and timelines before accepting a role',
    ],
    iconPath: 'M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z',
  },
  {
    num: '03',
    title: 'Source & Screen Candidates',
    desc: 'Use your sourcing channels to identify candidates, then conduct initial assessments before submission.',
    points: [
      'Identify suitable candidates through your sourcing channels',
      'Conduct preliminary screening to assess role fitment',
      'Ensure candidates meet all mandatory requirements before submission',
    ],
    iconPath: 'M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z',
  },
  {
    num: '04',
    title: 'Submit Candidate Profiles',
    desc: 'All submissions must go through the AlphaNom platform — no off-platform sharing of candidate profiles.',
    points: [
      'Submit candidate profiles only through the AlphaNom platform',
      'Verify candidate consent before sharing their profile',
      'Ensure all information provided is accurate and up to date',
    ],
    iconPath: 'M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5',
  },
  {
    num: '05',
    title: 'Track Candidate Progress',
    desc: 'Stay engaged with every stage of the hiring process and coordinate with candidates to maintain momentum.',
    points: [
      'Monitor interview schedules and hiring updates in real time',
      'Coordinate with candidates throughout the recruitment process',
      'Help maintain candidate engagement right until joining',
    ],
    iconPath: 'M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z',
  },
  {
    num: '06',
    title: 'Earn Placement Fees',
    desc: 'Receive your payout upon successful candidate joining once the applicable payment cycle is complete.',
    points: [
      'Recruitment payouts released upon successful candidate joining',
      'Payout timelines follow the employer agreement and platform policies',
    ],
    iconPath: 'M15 8.25H9m6 3H9m3 6l-3-3h1.5a3 3 0 100-6M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  },
]

const BEST_PRACTICES = [
  { title: 'Quality over quantity', desc: 'Submit only relevant and well-screened candidates for each role.' },
  { title: 'No spam submissions', desc: 'Avoid duplicate or irrelevant submissions — they damage your credibility.' },
  { title: 'Professional communication', desc: 'Maintain respectful and clear communication with candidates and employers at all times.' },
  { title: 'Protect candidate data', desc: 'Keep all candidate information strictly confidential and handle it responsibly.' },
]

const NOTES = [
  'Candidate ownership is determined by the first valid submission recorded on the platform.',
  'Fraudulent, duplicate, or unauthorized submissions may lead to account suspension.',
  'Recruiters are responsible for obtaining candidate consent before profile submission.',
  'All activities must comply with AlphaNom\'s terms and ethical recruitment guidelines.',
]

export default function RecruiterInstructionsPage() {
  const [ctaHovered, setCtaHovered] = useState(false)

  return (
    <main style={{ background: '#F5F8FC' }}>

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section style={{
        position: 'relative',
        background: 'linear-gradient(150deg, #FFFFFF 0%, #EEF5FF 55%, #E5F4F2 100%)',
        overflow: 'hidden',
        padding: '5rem 2.5rem 4rem',
      }}>
        <div aria-hidden="true" style={{
          position: 'absolute', top: '-15%', left: '-10%',
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(3,38,85,0.05) 0%, transparent 65%)',
          pointerEvents: 'none',
        }}/>
        <div aria-hidden="true" style={{
          position: 'absolute', bottom: '-10%', right: '-10%',
          width: '450px', height: '450px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(15,185,177,0.09) 0%, transparent 65%)',
          pointerEvents: 'none',
        }}/>
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(circle, rgba(3,38,85,0.045) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          maskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 20%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 20%, transparent 100%)',
        }}/>

        <div style={{ maxWidth: '760px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
          {/* Eyebrow */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '1.25rem' }}>
            <div style={{ width: '24px', height: '2px', background: '#0FB9B1', borderRadius: '2px' }}/>
            <span style={{
              fontFamily: 'var(--font-ui)', fontSize: '0.63rem', fontWeight: 700,
              letterSpacing: '0.18em', textTransform: 'uppercase', color: '#0FB9B1',
            }}>
              For Freelance Recruiters
            </span>
            <div style={{ width: '24px', height: '2px', background: '#0FB9B1', borderRadius: '2px' }}/>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-ui)',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 800, lineHeight: 1.1,
            letterSpacing: '-0.03em', color: '#032655',
            margin: '0 0 1.25rem',
          }}>
            Everything You Need to<br/>
            <span style={{ color: '#0FB9B1' }}>Start Placing Candidates.</span>
          </h1>

          <p style={{
            fontFamily: 'var(--font-ui)', fontSize: '1rem', fontWeight: 400,
            lineHeight: 1.75, color: '#5A7A9F',
            maxWidth: '560px', margin: '0 auto',
          }}>
            AlphaNom enables freelance recruiters and recruitment agencies to work on live hiring
            requirements from multiple companies and earn placement fees for successful hires.
          </p>
        </div>
      </section>

      {/* ── Steps ────────────────────────────────────────────────────────────── */}
      <section style={{ padding: '5rem 2.5rem', background: '#FFFFFF' }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>

          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{
              fontFamily: 'var(--font-ui)', fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
              fontWeight: 800, color: '#032655', letterSpacing: '-0.03em', margin: '0 0 0.75rem',
            }}>
              Step-by-Step Guide
            </h2>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.9375rem', color: '#5A7A9F', margin: 0, lineHeight: 1.7 }}>
              Follow these six steps to start working on live requirements and earn placement fees.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {STEPS.map((step, i) => (
              <StepCard key={step.num} step={step} isLast={i === STEPS.length - 1} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Best Practices ───────────────────────────────────────────────────── */}
      <section style={{ padding: '5rem 2.5rem', background: '#F5F8FC' }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>

          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '0.75rem' }}>
              <div style={{ width: '20px', height: '2px', background: '#0FB9B1', borderRadius: '2px' }}/>
              <span style={{
                fontFamily: 'var(--font-ui)', fontSize: '0.63rem', fontWeight: 700,
                letterSpacing: '0.16em', textTransform: 'uppercase', color: '#0FB9B1',
              }}>
                Best Practices
              </span>
              <div style={{ width: '20px', height: '2px', background: '#0FB9B1', borderRadius: '2px' }}/>
            </div>
            <h2 style={{
              fontFamily: 'var(--font-ui)', fontSize: 'clamp(1.4rem, 2.5vw, 2rem)',
              fontWeight: 800, color: '#032655', letterSpacing: '-0.025em', margin: 0,
            }}>
              Work Smart on AlphaNom
            </h2>
          </div>

          <div className="bp-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1rem',
          }}>
            {BEST_PRACTICES.map((bp, i) => (
              <div key={i} style={{
                background: '#FFFFFF',
                border: '1px solid #D0DBE8',
                borderRadius: '14px',
                padding: '1.5rem',
                display: 'flex', alignItems: 'flex-start', gap: '14px',
                boxShadow: '0 2px 8px rgba(3,38,85,0.04)',
              }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '9px', flexShrink: 0,
                  background: '#D8F0EB', border: '1px solid rgba(15,185,177,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="16" height="16" fill="none" stroke="#0A9E97" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
                  </svg>
                </div>
                <div>
                  <p style={{
                    fontFamily: 'var(--font-ui)', fontSize: '0.875rem', fontWeight: 700,
                    color: '#032655', margin: '0 0 5px', lineHeight: 1.3,
                  }}>
                    {bp.title}
                  </p>
                  <p style={{
                    fontFamily: 'var(--font-ui)', fontSize: '0.8rem', fontWeight: 400,
                    color: '#5A7A9F', margin: 0, lineHeight: 1.6,
                  }}>
                    {bp.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Important Notes ──────────────────────────────────────────────────── */}
      <section style={{ padding: '0 2.5rem 5rem', background: '#F5F8FC' }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div style={{
            background: '#FFFFFF',
            border: '1px solid #D0DBE8',
            borderLeft: '4px solid #0FB9B1',
            borderRadius: '14px',
            padding: '2rem 2rem 2rem 1.75rem',
            boxShadow: '0 2px 8px rgba(3,38,85,0.04)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '9px', flexShrink: 0,
                background: '#EEF5FF', border: '1px solid #D0DBE8',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="17" height="17" fill="none" stroke="#032655" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"/>
                </svg>
              </div>
              <h3 style={{
                fontFamily: 'var(--font-ui)', fontSize: '1rem', fontWeight: 800,
                color: '#032655', margin: 0,
              }}>
                Important Notes
              </h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {NOTES.map((note, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <div style={{
                    width: '6px', height: '6px', borderRadius: '50%', flexShrink: 0,
                    background: '#0FB9B1', marginTop: '7px',
                  }}/>
                  <p style={{
                    fontFamily: 'var(--font-ui)', fontSize: '0.84rem', fontWeight: 400,
                    color: '#3D5A7A', margin: 0, lineHeight: 1.65,
                  }}>
                    {note}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <section style={{
        background: '#032655',
        padding: '5rem 2.5rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div aria-hidden="true" style={{
          position: 'absolute', top: '-100px', right: '-100px',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(15,185,177,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}/>
        <div aria-hidden="true" style={{
          position: 'absolute', bottom: '-60px', left: '-60px',
          width: '300px', height: '300px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}/>
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}/>

        <div style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '1.25rem' }}>
            <div style={{ width: '20px', height: '2px', background: '#0FB9B1', borderRadius: '2px' }}/>
            <span style={{
              fontFamily: 'var(--font-ui)', fontSize: '0.63rem', fontWeight: 700,
              letterSpacing: '0.18em', textTransform: 'uppercase', color: '#0FB9B1',
            }}>
              Ready to Start?
            </span>
            <div style={{ width: '20px', height: '2px', background: '#0FB9B1', borderRadius: '2px' }}/>
          </div>

          <h2 style={{
            fontFamily: 'var(--font-ui)', fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
            fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em',
            color: '#FFFFFF', margin: '0 0 1rem',
          }}>
            Start Placing Candidates.<br/>
            <span style={{ color: '#0FB9B1' }}>Start Earning Today.</span>
          </h2>

          <p style={{
            fontFamily: 'var(--font-ui)', fontSize: '0.9375rem', color: 'rgba(255,255,255,0.6)',
            lineHeight: 1.7, margin: '0 auto 2.5rem', maxWidth: '460px',
          }}>
            Join 1,500+ recruiters already using AlphaNom to access verified jobs,
            submit candidates, and earn placement fees — all from one platform.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link
              href="/recruiter/signup"
              onMouseEnter={() => setCtaHovered(true)}
              onMouseLeave={() => setCtaHovered(false)}
              style={{
                fontFamily: 'var(--font-ui)', fontSize: '0.875rem', fontWeight: 700,
                letterSpacing: '0.06em', textTransform: 'uppercase',
                background: ctaHovered ? '#0A9E97' : '#0FB9B1',
                color: '#FFFFFF', textDecoration: 'none',
                padding: '0.9rem 2rem', borderRadius: '10px',
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                boxShadow: ctaHovered ? '0 8px 28px rgba(15,185,177,0.45)' : '0 4px 16px rgba(15,185,177,0.3)',
                transform: ctaHovered ? 'translateY(-2px)' : 'translateY(0)',
                transition: 'all 0.2s ease',
              }}
            >
              Create Recruiter Account
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </Link>
            <Link
              href="/recruiter/login"
              style={{
                fontFamily: 'var(--font-ui)', fontSize: '0.875rem', fontWeight: 600,
                color: 'rgba(255,255,255,0.65)', textDecoration: 'none',
                borderBottom: '1px solid rgba(255,255,255,0.25)',
                paddingBottom: '1px',
                transition: 'color 0.15s ease',
              }}
            >
              Already have an account? Log in
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 640px) {
          .bp-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  )
}

function StepCard({ step, isLast }: { step: typeof STEPS[0]; isLast: boolean }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', gap: '1.25rem', alignItems: 'flex-start',
      }}
    >
      {/* Number + connector */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
        <div style={{
          width: '44px', height: '44px', borderRadius: '12px', flexShrink: 0,
          background: hovered ? '#032655' : '#EEF5FF',
          border: `1.5px solid ${hovered ? '#032655' : '#D0DBE8'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.2s ease',
          boxShadow: hovered ? '0 4px 14px rgba(3,38,85,0.2)' : 'none',
        }}>
          <span style={{
            fontFamily: 'var(--font-ui)', fontSize: '0.7rem', fontWeight: 800,
            color: hovered ? '#0FB9B1' : '#5A7A9F', letterSpacing: '0.02em',
            transition: 'color 0.2s ease',
          }}>
            {step.num}
          </span>
        </div>
        {!isLast && (
          <div style={{
            width: '1.5px', height: '100%', minHeight: '24px',
            background: 'linear-gradient(to bottom, #D0DBE8, transparent)',
            marginTop: '6px',
          }}/>
        )}
      </div>

      {/* Card */}
      <div style={{
        flex: 1, background: '#FFFFFF',
        border: `1.5px solid ${hovered ? '#0FB9B1' : '#D0DBE8'}`,
        borderRadius: '16px',
        padding: '1.5rem',
        boxShadow: hovered ? '0 8px 28px rgba(3,38,85,0.09)' : '0 2px 8px rgba(3,38,85,0.04)',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'all 0.22s ease',
        marginBottom: isLast ? 0 : '0',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.625rem' }}>
          <h3 style={{
            fontFamily: 'var(--font-ui)', fontSize: '1rem', fontWeight: 800,
            color: '#032655', margin: 0, letterSpacing: '-0.015em', lineHeight: 1.3,
          }}>
            {step.title}
          </h3>
          <div style={{
            width: '34px', height: '34px', borderRadius: '8px', flexShrink: 0,
            background: hovered ? '#D8F0EB' : '#F5F8FC',
            border: `1px solid ${hovered ? 'rgba(15,185,177,0.3)' : '#EEF3F8'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s ease',
          }}>
            <svg width="16" height="16" fill="none" stroke={hovered ? '#0A9E97' : '#96AFCA'} strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d={step.iconPath}/>
            </svg>
          </div>
        </div>

        <p style={{
          fontFamily: 'var(--font-ui)', fontSize: '0.84rem', fontWeight: 400,
          color: '#5A7A9F', margin: '0 0 1rem', lineHeight: 1.65,
        }}>
          {step.desc}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
          {step.points.map((pt, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '9px' }}>
              <div style={{
                width: '16px', height: '16px', borderRadius: '50%', flexShrink: 0,
                background: '#D8F0EB', border: '1px solid rgba(15,185,177,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginTop: '1px',
              }}>
                <svg width="8" height="8" fill="none" stroke="#0A9E97" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
                </svg>
              </div>
              <p style={{
                fontFamily: 'var(--font-ui)', fontSize: '0.8rem', fontWeight: 400,
                color: '#3D5A7A', margin: 0, lineHeight: 1.55,
              }}>
                {pt}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
