'use client'

import Link from 'next/link'
import { useState } from 'react'

const STEPS = [
  {
    num: '01',
    title: 'Create a Job Requirement',
    desc: 'Provide complete and accurate job details so recruiters can source the right candidates for your open role.',
    points: [
      'Fill in Job Title, Company Name, Location, Experience Range, and Skills Required',
      'Add Compensation Details and a clear Job Description',
      'Clearly mention mandatory skills and hiring timelines',
      'Define the recruitment fee or success payout for successful hires',
    ],
    iconPath: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z',
  },
  {
    num: '02',
    title: 'Publish the Requirement',
    desc: 'Once submitted, your requirement goes live and becomes instantly visible to relevant recruiters on the platform.',
    points: [
      'Your requirement becomes visible to relevant recruiters on the platform',
      'Recruiters can start sourcing suitable candidates immediately',
    ],
    iconPath: 'M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418',
  },
  {
    num: '03',
    title: 'Review Candidate Profiles',
    desc: 'Shortlisted profiles arrive through the platform — review them carefully and keep statuses updated.',
    points: [
      'Shortlisted candidate profiles will be shared through the platform',
      'Review resumes and candidate information carefully',
      'Update candidate status regularly to ensure smooth coordination',
    ],
    iconPath: 'M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z',
  },
  {
    num: '04',
    title: 'Conduct Interviews',
    desc: 'Schedule interviews with shortlisted candidates and share timely feedback to keep the process moving.',
    points: [
      'Schedule interviews directly with shortlisted candidates',
      'Share feedback after every interview round',
      'Help recruiters manage the hiring process effectively with timely updates',
    ],
    iconPath: 'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5',
  },
  {
    num: '05',
    title: 'Hire & Close the Position',
    desc: 'Once your ideal candidate joins, mark the position as closed and process the agreed recruitment fee.',
    points: [
      'Once a candidate joins successfully, mark the position as closed',
      'Recruitment fees will be processed according to the agreed payout structure',
    ],
    iconPath: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  },
]

const BEST_PRACTICES = [
  { title: 'Complete job descriptions', desc: 'Provide complete and accurate job descriptions to attract the right candidates.' },
  { title: 'Respond promptly', desc: 'Review candidate submissions quickly to keep recruiters and candidates engaged.' },
  { title: 'Share feedback fast', desc: 'Share interview feedback within 48 hours whenever possible to speed up hiring.' },
  { title: 'Keep status updated', desc: 'Keep job status current at all times to avoid unnecessary duplicate submissions.' },
]

const NOTES = [
  'Only candidates submitted through AlphaNom are eligible for platform-based recruitment payouts.',
  'Candidate ownership and replacement policies are governed by AlphaNom\'s terms and conditions.',
  'Employers are expected to maintain professional and ethical hiring practices at all times.',
]

export default function EmployerInstructionsPage() {
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
              For Employers
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
            Hire Faster Through a<br/>
            <span style={{ color: '#0FB9B1' }}>Network of Specialists.</span>
          </h1>

          <p style={{
            fontFamily: 'var(--font-ui)', fontSize: '1rem', fontWeight: 400,
            lineHeight: 1.75, color: '#5A7A9F',
            maxWidth: '560px', margin: '0 auto',
          }}>
            AlphaNom helps you hire through a network of verified freelance recruiters and
            recruitment agencies. Follow these simple steps to get started.
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
              Follow these five steps to post a job, review candidates, and make your next great hire.
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
              Get the Most Out of AlphaNom
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
              Ready to Hire?
            </span>
            <div style={{ width: '20px', height: '2px', background: '#0FB9B1', borderRadius: '2px' }}/>
          </div>

          <h2 style={{
            fontFamily: 'var(--font-ui)', fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
            fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em',
            color: '#FFFFFF', margin: '0 0 1rem',
          }}>
            Post Your First Role.<br/>
            <span style={{ color: '#0FB9B1' }}>Get Candidates in 48 Hours.</span>
          </h2>

          <p style={{
            fontFamily: 'var(--font-ui)', fontSize: '0.9375rem', color: 'rgba(255,255,255,0.6)',
            lineHeight: 1.7, margin: '0 auto 2.5rem', maxWidth: '460px',
          }}>
            Join 200+ companies that trust AlphaNom to connect them with specialist
            recruiters — faster hires, better fits, zero upfront cost.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link
              href="/employer/signup"
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
              Post a Job for Free
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </Link>
            <Link
              href="/employer/login"
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
