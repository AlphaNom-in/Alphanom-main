'use client'

import Image from 'next/image'

const FEATURES = [
  {
    title: 'Verified Employers',
    desc: 'Every company is verified before jobs go live on the platform.'
  },
  {
    title: 'Quality Recruiters',
    desc: 'Connect with experienced recruiters across multiple domains.'
  },
  {
    title: 'Transparent Process',
    desc: 'Track submissions, shortlists and hiring progress in real-time.'
  }
]

export default function WhyAlphaNom() {
  return (
    <section
      style={{
        padding: '3rem 0',
        background: '#ffffff',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Glow */}
      <div
        style={{
          position: 'absolute',
          top: '-250px',
          right: '-200px',
          width: '600px',
          height: '600px',
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
        {/* Heading */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: '1.75rem'
          }}
        >
          <span
            style={{
              color: '#0FB9B1',
              fontSize: '.72rem',
              fontWeight: 700,
              letterSpacing: '.18em',
              textTransform: 'uppercase'
            }}
          >
            WHY ALPHANOM
          </span>

          <h2
            style={{
              color: '#032655',
              fontSize: 'clamp(1.8rem,3vw,2.75rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              marginTop: '10px',
              letterSpacing: '-0.03em'
            }}
          >
            One Platform.
            <br />
            Two Winners.
          </h2>

          <p
            style={{
              maxWidth: '620px',
              margin: '.8rem auto 0',
              color: '#5A7A9F',
              fontSize: '.9rem',
              lineHeight: 1.7
            }}
          >
            AlphaNom creates a win-win hiring ecosystem where employers
            find exceptional talent faster while recruiters unlock greater
            earning opportunities.
          </p>
        </div>

        {/* Main Layout */}
        <div
          className="why-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '.85fr 1.15fr',
            gap: '2rem',
            alignItems: 'center'
          }}
        >
          {/* LEFT IMAGE */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <div
              style={{
                width: '100%',
                maxWidth: '500px',
                background: '#F8FBFF',
                border: '1px solid #DCE8F4',
                borderRadius: '16px',
                padding: '.75rem',
                boxShadow:
                  '0 12px 30px rgba(3,38,85,.06)'
              }}
            >
              <Image
                src="/images/why-alphanom-diagram.png"
                alt="AlphaNom Ecosystem"
                width={500}
                height={500}
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block'
                }}
              />
            </div>
          </div>

          {/* RIGHT CONTENT */}
          <div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '.75rem'
              }}
            >
              {FEATURES.map((feature, index) => (
                <div
                  key={index}
                  style={{
                    background: '#fff',
                    border: '1px solid #DCE8F4',
                    borderRadius: '14px',
                    padding: '.9rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '.9rem',
                    boxShadow:
                      '0 6px 16px rgba(3,38,85,.04)'
                  }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      minWidth: '40px',
                      borderRadius: '10px',
                      background: '#032655',
                      color: '#0FB9B1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '.85rem'
                    }}
                  >
                    0{index + 1}
                  </div>

                  <div>
                    <h3
                      style={{
                        color: '#032655',
                        fontSize: '.95rem',
                        fontWeight: 700,
                        marginBottom: '.25rem'
                      }}
                    >
                      {feature.title}
                    </h3>

                    <p
                      style={{
                        color: '#5A7A9F',
                        fontSize: '.82rem',
                        lineHeight: 1.6
                      }}
                    >
                      {feature.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div
              style={{
                marginTop: '1rem',
                background:
                  'linear-gradient(135deg,#032655 0%,#0A356A 100%)',
                borderRadius: '16px',
                padding: '1.25rem',
                boxShadow:
                  '0 15px 35px rgba(3,38,85,.12)'
              }}
            >
              <h3
                style={{
                  color: '#fff',
                  fontSize: '1.05rem',
                  fontWeight: 800,
                  marginBottom: '.55rem'
                }}
              >
                Built For Modern Hiring
              </h3>

              <p
                style={{
                  color: 'rgba(255,255,255,.72)',
                  lineHeight: 1.6,
                  fontSize: '.85rem',
                  marginBottom: '1rem'
                }}
              >
                A single ecosystem where employers hire faster and recruiters
                earn more through a transparent hiring workflow.
              </p>

              <div
                style={{
                  display: 'flex',
                  gap: '.75rem',
                  flexWrap: 'wrap'
                }}
              >
                <button
                  style={{
                    background: '#0FB9B1',
                    border: 'none',
                    color: '#fff',
                    padding: '.7rem 1rem',
                    borderRadius: '10px',
                    fontWeight: 700,
                    fontSize: '.85rem',
                    cursor: 'pointer'
                  }}
                >
                  For Employers
                </button>

                <button
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,.15)',
                    color: '#fff',
                    padding: '.7rem 1rem',
                    borderRadius: '10px',
                    fontWeight: 700,
                    fontSize: '.85rem',
                    cursor: 'pointer'
                  }}
                >
                  For Recruiters
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .why-grid {
          align-items: center;
        }

        @media (max-width: 960px) {
          .why-grid {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
        }
      `}</style>
    </section>
  )
}