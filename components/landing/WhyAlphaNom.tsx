'use client'

import { useState } from 'react'

const FEATURES = [
  {
    num: '01',
    title: 'Verified Employers Only',
    desc: 'Every company is manually verified before jobs go live. No fake listings, no wasted submissions.',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    color: '#0FB9B1',
  },
  {
    num: '02',
    title: 'Specialist Recruiter Network',
    desc: 'Access domain experts across fintech, SaaS, ops, and more — recruiters who know the talent.',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
    color: '#5A7A9F',
  },
  {
    num: '03',
    title: 'Real-time Tracking',
    desc: 'Every submission, shortlist, and interview tracked live on a shared dashboard. Zero ambiguity.',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    color: '#0FB9B1',
  },
  {
    num: '04',
    title: 'Transparent Fee Structure',
    desc: 'Recruiters know exactly what they earn. Employers know exactly what they pay. No surprises.',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: '#5A7A9F',
  },
]

export default function WhyAlphaNom() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)

  return (
    <section className="why-section" style={{ padding: '6rem 0', background: '#FFFFFF', position: 'relative', overflow: 'hidden' }}>

      {/* Background */}
      <div style={{ position: 'absolute', top: '-200px', right: '-200px', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(15,185,177,0.07) 0%, transparent 70%)', pointerEvents: 'none' }}/>
      <div style={{ position: 'absolute', bottom: '-150px', left: '-150px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(3,38,85,0.04) 0%, transparent 70%)', pointerEvents: 'none' }}/>

      <div className="why-inner" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2.5rem', position: 'relative', zIndex: 2 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '14px' }}>
            <div style={{ width: '24px', height: '2px', background: '#0FB9B1', borderRadius: '2px' }}/>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.63rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#0FB9B1' }}>
              Why AlphaNom
            </span>
            <div style={{ width: '24px', height: '2px', background: '#0FB9B1', borderRadius: '2px' }}/>
          </div>
          <h2 style={{ fontFamily: 'var(--font-ui)', fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 800, color: '#032655', letterSpacing: '-0.03em', lineHeight: 1.1, margin: '0 0 1rem' }}>
            One Platform.<br/>
            <span style={{ color: '#0FB9B1' }}>Two Winners.</span>
          </h2>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.9375rem', color: '#5A7A9F', lineHeight: 1.7, maxWidth: '540px', margin: '0 auto' }}>
            AlphaNom creates a win-win hiring ecosystem where employers find talent faster and recruiters unlock greater earning opportunities.
          </p>
        </div>

        {/* Main 2-col layout */}
        <div className="why-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}>

          {/* LEFT: Visual ecosystem diagram — hidden on mobile */}
          <div className="why-diagram" style={{ position: 'relative' }}>
            <EcosystemDiagram />
          </div>

          {/* RIGHT: Features + mini CTA */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {FEATURES.map((f, i) => (
              <div
                key={i}
                onMouseEnter={() => setHoveredFeature(i)}
                onMouseLeave={() => setHoveredFeature(null)}
                style={{
                  background: '#fff',
                  border: `1px solid ${hoveredFeature === i ? f.color + '50' : '#DCE8F4'}`,
                  borderRadius: '14px',
                  padding: '1rem 1.25rem',
                  display: 'flex', alignItems: 'flex-start', gap: '1rem',
                  boxShadow: hoveredFeature === i ? `0 8px 28px rgba(3,38,85,0.09), 0 0 0 3px ${f.color}12` : '0 2px 12px rgba(3,38,85,0.04)',
                  transform: hoveredFeature === i ? 'translateX(4px)' : 'translateX(0)',
                  transition: 'all 0.22s ease', cursor: 'default',
                }}
              >
                {/* Icon box */}
                <div style={{
                  width: '42px', height: '42px', borderRadius: '11px', flexShrink: 0,
                  background: hoveredFeature === i ? f.color : '#EEF5FF',
                  border: `1px solid ${hoveredFeature === i ? f.color : '#DCE8F4'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: hoveredFeature === i ? '#fff' : f.color,
                  transition: 'all 0.22s ease',
                }}>
                  {f.icon}
                </div>
                {/* Text */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.1em', color: f.color }}>
                      {f.num}
                    </span>
                    <h3 style={{ fontFamily: 'var(--font-ui)', fontSize: '0.88rem', fontWeight: 700, color: '#032655', margin: 0 }}>
                      {f.title}
                    </h3>
                  </div>
                  <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: '#5A7A9F', lineHeight: 1.65, margin: 0 }}>
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}

            {/* Mini CTA block */}
            <div style={{
              marginTop: '0.5rem',
              background: 'linear-gradient(135deg, #032655 0%, #0A356A 100%)',
              borderRadius: '16px', padding: '1.5rem',
              boxShadow: '0 16px 40px rgba(3,38,85,0.15)',
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '180px', height: '180px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(15,185,177,0.2) 0%, transparent 70%)', pointerEvents: 'none' }}/>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#0FB9B1', margin: '0 0 8px' }}>
                  Built for Modern Hiring
                </p>
                <h3 style={{ fontFamily: 'var(--font-ui)', fontSize: '1.05rem', fontWeight: 800, color: '#fff', margin: '0 0 8px', letterSpacing: '-0.02em' }}>
                  Start Hiring Smarter Today
                </h3>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.8rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.6, margin: '0 0 1.25rem' }}>
                  A single ecosystem where employers hire faster and recruiters earn more.
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <a href="/employer/signup" style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', background: '#0FB9B1', color: '#fff', border: 'none', padding: '0.65rem 1.25rem', borderRadius: '9px', cursor: 'pointer', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    For Employers
                    <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                  </a>
                  <a href="/recruiter/signup" style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.18)', padding: '0.65rem 1.25rem', borderRadius: '9px', cursor: 'pointer', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
                    For Recruiters
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .why-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
          .why-diagram { display: none !important; }
        }
        @media (max-width: 600px) {
          .why-grid { gap: 1.25rem !important; }
        }
        @media (max-width: 480px) {
          .why-section { padding: 4rem 0 !important; }
          .why-inner { padding: 0 1.25rem !important; }
        }
      `}</style>
    </section>
  )
}

/* ─── Ecosystem Visual Diagram ───────────────────────────────────────────────*/
function EcosystemDiagram() {
  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '480px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

      {/* Outer ring */}
      <div style={{
        position: 'absolute', width: '380px', height: '380px', borderRadius: '50%',
        border: '1px dashed rgba(15,185,177,0.2)',
        top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
      }}/>
      <div style={{
        position: 'absolute', width: '280px', height: '280px', borderRadius: '50%',
        border: '1px dashed rgba(3,38,85,0.1)',
        top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
      }}/>

      {/* Center hub */}
      <div style={{
        position: 'relative', zIndex: 10,
        width: '100px', height: '100px', borderRadius: '50%',
        background: 'linear-gradient(135deg, #032655 0%, #0A356A 100%)',
        boxShadow: '0 12px 40px rgba(3,38,85,0.3), 0 0 0 8px rgba(3,38,85,0.08), 0 0 0 16px rgba(3,38,85,0.04)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: '2px',
      }}>
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.55rem', fontWeight: 800, color: '#0FB9B1', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Alpha</span>
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', fontWeight: 800, color: '#fff', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Nom</span>
        <div style={{ width: '20px', height: '1.5px', background: 'rgba(15,185,177,0.6)', borderRadius: '2px', marginTop: '2px' }}/>
      </div>

      {/* Employer node — top left */}
      <DiagramNode
        top="6%" left="4%"
        label="Employer"
        sublabel="Posts Jobs"
        color="#0FB9B1"
        icon={
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18h16.5a1.5 1.5 0 011.5 1.5v11.25a1.5 1.5 0 01-1.5 1.5H3.75a1.5 1.5 0 01-1.5-1.5V4.5a1.5 1.5 0 011.5-1.5z"/>
          </svg>
        }
      />

      {/* Recruiter node — top right */}
      <DiagramNode
        top="6%" right="4%"
        label="Recruiter"
        sublabel="Submits Talent"
        color="#5A7A9F"
        icon={
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>
          </svg>
        }
      />

      {/* Candidate node — bottom left */}
      <DiagramNode
        bottom="6%" left="4%"
        label="Candidate"
        sublabel="Gets Placed"
        color="#C8A96E"
        icon={
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z"/>
          </svg>
        }
      />

      {/* Hire node — bottom right */}
      <DiagramNode
        bottom="6%" right="4%"
        label="Placement"
        sublabel="Fee Paid"
        color="#0FB9B1"
        icon={
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        }
      />

      {/* Floating stat chips */}
      <div style={{ position: 'absolute', top: '38%', left: '-2%', zIndex: 8 }}>
        <StatChip value="48h" label="Avg. Response" color="#0FB9B1" />
      </div>
      <div style={{ position: 'absolute', top: '38%', right: '-2%', zIndex: 8 }}>
        <StatChip value="88%" label="Placement Rate" color="#032655" />
      </div>
      <div style={{ position: 'absolute', bottom: '28%', left: '50%', transform: 'translateX(-50%)', zIndex: 8 }}>
        <StatChip value="85+" label="Roles Filled" color="#5A7A9F" />
      </div>

      {/* Connector lines SVG */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 5 }} viewBox="0 0 440 480" fill="none">
        {/* Employer → center */}
        <line x1="120" y1="90" x2="220" y2="240" stroke="#0FB9B1" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.4"/>
        {/* Recruiter → center */}
        <line x1="320" y1="90" x2="220" y2="240" stroke="#5A7A9F" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.4"/>
        {/* Candidate → center */}
        <line x1="120" y1="390" x2="220" y2="240" stroke="#C8A96E" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.4"/>
        {/* Hire → center */}
        <line x1="320" y1="390" x2="220" y2="240" stroke="#0FB9B1" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.4"/>
      </svg>
    </div>
  )
}

function DiagramNode({ label, sublabel, color, icon, top, bottom, left, right }: {
  label: string; sublabel: string; color: string; icon: React.ReactNode;
  top?: string; bottom?: string; left?: string; right?: string;
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'absolute', top, bottom, left, right, zIndex: 8,
        background: '#fff',
        border: `1px solid ${hovered ? color : '#DCE8F4'}`,
        borderRadius: '14px', padding: '10px 14px',
        display: 'flex', alignItems: 'center', gap: '9px',
        boxShadow: hovered ? `0 8px 24px rgba(3,38,85,0.12)` : '0 4px 16px rgba(3,38,85,0.07)',
        transform: hovered ? 'scale(1.05)' : 'scale(1)',
        transition: 'all 0.2s ease', cursor: 'default',
        minWidth: '130px',
      }}
    >
      <div style={{ width: '34px', height: '34px', borderRadius: '9px', flexShrink: 0, background: `${color}18`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
        {icon}
      </div>
      <div>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', fontWeight: 700, color: '#032655', margin: 0, lineHeight: 1.2 }}>{label}</p>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.6rem', color: '#96AFCA', margin: 0 }}>{sublabel}</p>
      </div>
    </div>
  )
}

function StatChip({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <div style={{
      background: '#fff',
      border: `1px solid ${color}30`,
      borderRadius: '100px', padding: '6px 14px',
      boxShadow: '0 4px 16px rgba(3,38,85,0.1)',
      display: 'flex', alignItems: 'center', gap: '8px',
      animation: 'floatY 4s ease-in-out infinite',
    }}>
      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: color, flexShrink: 0 }}/>
      <div>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.8rem', fontWeight: 800, color: '#032655', margin: 0, lineHeight: 1, letterSpacing: '-0.01em' }}>{value}</p>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.55rem', color: '#96AFCA', margin: 0 }}>{label}</p>
      </div>
    </div>
  )
}