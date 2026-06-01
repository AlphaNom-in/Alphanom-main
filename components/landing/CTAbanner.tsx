'use client'

import Link from 'next/link'

const STATS = [
  {
    value: '200+',
    label: 'Companies Hiring'
  },
  {
    value: '1,500+',
    label: 'Active Recruiters'
  },
  {
    value: '8,000+',
    label: 'Roles Closed'
  }
]

export default function CTASection() {
  return (
    <section
      style={{
        padding: '5rem 0',
        background: '#fff',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 2.5rem'
        }}
      >
        <div
          style={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '32px',
            background:
              'linear-gradient(135deg,#032655 0%,#0A356A 60%,#0FB9B1 180%)',
            padding: '4rem',
            boxShadow:
              '0 30px 80px rgba(3,38,85,.18)'
          }}
        >
          {/* Glow Effects */}

          <div
            style={{
              position: 'absolute',
              top: '-150px',
              right: '-150px',
              width: '350px',
              height: '350px',
              borderRadius: '50%',
              background:
                'radial-gradient(circle, rgba(15,185,177,.35) 0%, transparent 70%)'
            }}
          />

          <div
            style={{
              position: 'absolute',
              bottom: '-120px',
              left: '-120px',
              width: '280px',
              height: '280px',
              borderRadius: '50%',
              background:
                'radial-gradient(circle, rgba(255,255,255,.08) 0%, transparent 70%)'
            }}
          />

          {/* Content */}

          <div
            style={{
              position: 'relative',
              zIndex: 2,
              textAlign: 'center',
              maxWidth: '760px',
              margin: '0 auto'
            }}
          >
            <span
              style={{
                color: '#0FB9B1',
                fontSize: '.75rem',
                fontWeight: 700,
                letterSpacing: '.18em',
                textTransform: 'uppercase'
              }}
            >
              GET STARTED TODAY
            </span>

            <h2
              style={{
                color: '#fff',
                fontSize: 'clamp(2.3rem,4vw,4rem)',
                fontWeight: 800,
                lineHeight: 1.1,
                marginTop: '1rem'
              }}
            >
              Ready To Transform
              <br />
              Your Hiring Process?
            </h2>

            <p
              style={{
                color: 'rgba(255,255,255,.75)',
                fontSize: '1rem',
                lineHeight: 1.8,
                marginTop: '1rem',
                maxWidth: '620px',
                marginInline: 'auto'
              }}
            >
              Employers discover exceptional talent faster.
              Recruiters unlock new opportunities and grow
              their placement earnings through AlphaNom.
            </p>

            {/* CTA Buttons */}

            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '1rem',
                flexWrap: 'wrap',
                marginTop: '2rem'
              }}
            >
              <Link
                href="/auth/employer/signup"
                style={{
                  background: '#fff',
                  color: '#032655',
                  padding: '1rem 1.6rem',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                Join As Employer

                <svg
                  width="14"
                  height="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </Link>

              <Link
                href="/auth/recruiter/signup"
                style={{
                  background: 'transparent',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,.15)',
                  padding: '1rem 1.6rem',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  fontWeight: 700
                }}
              >
                Join As Recruiter
              </Link>
            </div>
          </div>

          {/* Stats */}

          <div
            className="cta-stats"
            style={{
              marginTop: '3rem',
              paddingTop: '2rem',
              borderTop: '1px solid rgba(255,255,255,.08)',
              display: 'grid',
              gridTemplateColumns: 'repeat(3,1fr)',
              gap: '1rem',
              position: 'relative',
              zIndex: 2
            }}
          >
            {STATS.map((item) => (
              <div
                key={item.label}
                style={{
                  textAlign: 'center'
                }}
              >
                <div
                  style={{
                    fontSize: '2rem',
                    fontWeight: 800,
                    color: '#fff'
                  }}
                >
                  {item.value}
                </div>

                <div
                  style={{
                    color: 'rgba(255,255,255,.65)',
                    fontSize: '.85rem'
                  }}
                >
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .cta-stats {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  )
}