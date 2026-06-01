'use client'

import Image from 'next/image'

const COMPANIES = [
  'Razorpay',
  'PhonePe',
  'Swiggy',
  'Zepto',
  'Paytm',
  'Meesho'
]

export default function TrustedBy() {
  return (
    <section
      style={{
        padding: '5rem 0',
        background: '#fff',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Glow */}

      <div
        style={{
          position: 'absolute',
          top: '-200px',
          right: '-200px',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(15,185,177,.08) 0%, transparent 70%)',
          pointerEvents: 'none'
        }}
      />

      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 2.5rem',
          position: 'relative',
          zIndex: 2
        }}
      >
        {/* Header */}

        <div
          style={{
            textAlign: 'center',
            maxWidth: '760px',
            margin: '0 auto 3rem'
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
            TRUSTED BY INDUSTRY LEADERS
          </span>

          <h2
            style={{
              marginTop: '12px',
              color: '#032655',
              fontSize: 'clamp(2.2rem,4vw,3.5rem)',
              fontWeight: 800,
              lineHeight: 1.1
            }}
          >
            Trusted By India's
            <br />
            Hiring Leaders
          </h2>

          <p
            style={{
              marginTop: '1rem',
              color: '#5A7A9F',
              fontSize: '1rem',
              lineHeight: 1.8
            }}
          >
            Employers and recruitment partners rely on AlphaNom
            to discover talent faster, collaborate efficiently,
            and close critical roles with confidence.
          </p>
        </div>

        {/* Main Layout */}

        <div
          className="trusted-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1.1fr 1fr',
            gap: '1.25rem',
            alignItems: 'stretch'
          }}
        >
          {/* Featured Card */}

          <div
            style={{
              background: '#fff',
              border: '1px solid #DCE8F4',
              borderRadius: '24px',
              padding: '2rem',
              boxShadow:
                '0 15px 40px rgba(3,38,85,.06)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            {/* Company */}

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '1.5rem'
              }}
            >
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '14px',
                  background:
                    'linear-gradient(135deg,#032655,#0FB9B1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: '1rem'
                }}
              >
                A
              </div>

              <div>
                <h3
                  style={{
                    color: '#032655',
                    fontWeight: 800,
                    fontSize: '1.5rem'
                  }}
                >
                  AlphaNom
                </h3>

                <p
                  style={{
                    color: '#5A7A9F',
                    fontSize: '.9rem'
                  }}
                >
                  Recruitment Marketplace
                </p>
              </div>
            </div>

            {/* Quote */}

            <p
              style={{
                color: '#032655',
                fontSize: '1.05rem',
                lineHeight: 1.9,
                marginBottom: '2rem'
              }}
            >
              "AlphaNom helps employers connect with
              specialized recruiters while giving recruiters
              access to verified hiring opportunities — creating
              a faster, more transparent hiring ecosystem."
            </p>

            {/* Footer */}

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px'
              }}
            >
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  background:
                    'linear-gradient(135deg,#032655,#0FB9B1)'
                }}
              />

              <div>
                <h4
                  style={{
                    color: '#032655',
                    fontWeight: 700,
                    fontSize: '1rem'
                  }}
                >
                  Premium Hiring Network
                </h4>

                <p
                  style={{
                    color: '#5A7A9F',
                    fontSize: '.9rem'
                  }}
                >
                  Employers • Recruiters • Agencies
                </p>
              </div>
            </div>
          </div>

          {/* Company Grid */}

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem'
            }}
          >
            {COMPANIES.map((company, index) => (
              <div
                key={index}
                style={{
                  background: '#fff',
                  border: '1px solid #DCE8F4',
                  borderRadius: '18px',
                  minHeight: '110px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  boxShadow:
                    '0 8px 20px rgba(3,38,85,.04)',
                  transition: '.25s ease'
                }}
              >
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background:
                      'linear-gradient(135deg,#032655,#0FB9B1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: 800
                  }}
                >
                  {company.charAt(0)}
                </div>

                <span
                  style={{
                    fontSize: '1.35rem',
                    fontWeight: 700,
                    color: '#032655'
                  }}
                >
                  {company}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 960px) {
          .trusted-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  )
}