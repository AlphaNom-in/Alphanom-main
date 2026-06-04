'use client'

import { useRef, useState, useTransition } from 'react'
import { submitCareerInterest } from './actions'

/* ── Section label (matching landing page) ────────────────────────────────── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '14px' }}>
      <div style={{ width: '24px', height: '2px', background: '#0FB9B1', borderRadius: '2px' }} />
      <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.63rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: '#0FB9B1' }}>{children}</span>
      <div style={{ width: '24px', height: '2px', background: '#0FB9B1', borderRadius: '2px' }} />
    </div>
  )
}

/* ── Life at AlphaNom perks data ──────────────────────────────────────────── */
const PERKS = [
  {
    color: '#0FB9B1',
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253" />
      </svg>
    ),
    title: 'Remote-First',
    body: 'Work from wherever you do your best thinking. We\'re async by design and results-driven by culture.',
  },
  {
    color: '#5A7A9F',
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    title: 'Move Fast',
    body: 'Small team, real ownership. Your work ships in days, not quarters. Ideas welcome at every level.',
  },
  {
    color: '#0FB9B1',
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
      </svg>
    ),
    title: 'Grow Fast',
    body: 'Learning budget, mentorship, and a clear path upward. We invest in people who invest in themselves.',
  },
  {
    color: '#C8A96E',
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Earn Well',
    body: 'Competitive compensation with ESOPs. When AlphaNom wins, everyone on the team wins.',
  },
  {
    color: '#5A7A9F',
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
    title: 'Great Team',
    body: 'A small, sharp team of builders who genuinely like working together. No politics, no bureaucracy.',
  },
  {
    color: '#0FB9B1',
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
      </svg>
    ),
    title: 'Real Impact',
    body: 'Every engineer, marketer, and ops person here is directly shaping how India hires. That matters.',
  },
]

const AREAS = [
  { title: 'Engineering',        desc: 'Full-stack, backend, infra — building the platform',    tags: ['Next.js', 'Supabase', 'TypeScript'], color: '#0FB9B1', bg: '#D8F0EB' },
  { title: 'Product & Design',   desc: 'Shaping the experience for employers and recruiters',    tags: ['Product', 'UX', 'Research'],          color: '#5A7A9F', bg: '#EEF3F8' },
  { title: 'Sales & Growth',     desc: 'Expanding the employer and recruiter network',           tags: ['B2B Sales', 'Partnerships', 'GTM'],    color: '#C8A96E', bg: '#FDF3DC' },
  { title: 'Operations',         desc: 'Running the platform and keeping everything on track',   tags: ['Ops', 'Support', 'Process'],           color: '#5A7A9F', bg: '#EEF3F8' },
]

const ROLES = ['Engineering', 'Product & Design', 'Sales & Growth', 'Operations', 'Marketing', 'Other']

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '11px 14px',
  borderRadius: '10px',
  border: '1.5px solid #DCE8F4',
  fontFamily: 'var(--font-ui)',
  fontSize: '0.875rem',
  color: '#032655',
  background: '#fff',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.18s',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-ui)',
  fontSize: '0.72rem',
  fontWeight: 700,
  color: '#032655',
  letterSpacing: '0.03em',
  marginBottom: '6px',
}

/* ── Page ─────────────────────────────────────────────────────────────────── */
export default function CareersPage() {
  const [pending, startTransition] = useTransition()
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hoveredPerk, setHoveredPerk] = useState<number | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const data = new FormData(e.currentTarget)
    startTransition(async () => {
      try {
        await submitCareerInterest(data)
        setSubmitted(true)
        formRef.current?.reset()
      } catch (err: any) {
        setError(err.message ?? 'Something went wrong. Please try again.')
      }
    })
  }

  return (
    <main style={{ fontFamily: 'var(--font-ui)' }}>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section style={{ background: 'linear-gradient(145deg, #032655 0%, #0a3570 55%, #0e4080 100%)', position: 'relative', overflow: 'hidden', padding: '5.5rem 0 4.5rem' }}>
        <div aria-hidden style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.035) 1px, transparent 1px)', backgroundSize: '28px 28px', pointerEvents: 'none' }} />
        <div aria-hidden style={{ position: 'absolute', top: '-120px', right: '-120px', width: '420px', height: '420px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(15,185,177,0.13) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div aria-hidden style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(15,185,177,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div className="car-inner" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2.5rem', position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(15,185,177,0.1)', border: '1px solid rgba(15,185,177,0.22)', borderRadius: '100px', padding: '5px 16px', marginBottom: '1.5rem' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0FB9B1' }} />
            <span style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase' as const, color: '#0FB9B1' }}>Careers at AlphaNom</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-ui)', fontSize: 'clamp(2rem, 4.5vw, 3.25rem)', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.08, margin: '0 0 1.25rem' }}>
            Build the future of<br />
            <span style={{ color: '#0FB9B1' }}>hiring in India.</span>
          </h1>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.9375rem', color: 'rgba(255,255,255,0.58)', lineHeight: 1.8, maxWidth: '500px', margin: '0 auto' }}>
            We're a small team solving a big problem. If you want real ownership, real impact, and a product used by hundreds of companies — read on.
          </p>
        </div>
      </section>

      {/* ── LIFE AT ALPHANOM ──────────────────────────────────────────────── */}
      <section className="car-life" style={{ padding: '5.5rem 0', background: '#F4F8FC', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(3,38,85,0.04) 1px, transparent 1px)', backgroundSize: '28px 28px', pointerEvents: 'none' }} />
        <div aria-hidden style={{ position: 'absolute', top: '-180px', right: '-180px', width: '540px', height: '540px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(15,185,177,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div className="car-inner" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2.5rem', position: 'relative', zIndex: 2 }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <SectionLabel>Life at AlphaNom</SectionLabel>
            <h2 style={{ fontFamily: 'var(--font-ui)', fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 800, color: '#032655', letterSpacing: '-0.03em', lineHeight: 1.1, margin: '0 0 1rem' }}>
              Small team. Big mission.<br />
              <span style={{ color: '#0FB9B1' }}>Zero compromise.</span>
            </h2>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.9375rem', color: '#5A7A9F', lineHeight: 1.7, maxWidth: '520px', margin: '0 auto' }}>
              We hire people who want to own things, move fast, and build something that genuinely matters to the people who use it every day.
            </p>
          </div>

          {/* Perks grid */}
          <div className="car-perks-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            {PERKS.map((p, i) => (
              <div
                key={i}
                onMouseEnter={() => setHoveredPerk(i)}
                onMouseLeave={() => setHoveredPerk(null)}
                style={{ background: '#fff', border: `1px solid ${hoveredPerk === i ? p.color + '55' : '#DCE8F4'}`, borderRadius: '16px', padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start', boxShadow: hoveredPerk === i ? `0 8px 28px rgba(3,38,85,0.08), 0 0 0 3px ${p.color}12` : '0 2px 12px rgba(3,38,85,0.04)', transform: hoveredPerk === i ? 'translateY(-2px)' : 'none', transition: 'all 0.22s ease', cursor: 'default' }}
              >
                <div style={{ width: '40px', height: '40px', borderRadius: '11px', background: hoveredPerk === i ? p.color : `${p.color}15`, border: `1px solid ${p.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: hoveredPerk === i ? '#fff' : p.color, flexShrink: 0, transition: 'all 0.22s ease' }}>
                  {p.icon}
                </div>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-ui)', fontSize: '0.9rem', fontWeight: 700, color: '#032655', margin: '0 0 5px', letterSpacing: '-0.01em' }}>{p.title}</h3>
                  <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: '#5A7A9F', lineHeight: 1.65, margin: 0 }}>{p.body}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Open areas */}
          <div style={{ marginTop: '3.5rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <h3 style={{ fontFamily: 'var(--font-ui)', fontSize: '1.1rem', fontWeight: 800, color: '#032655', letterSpacing: '-0.02em', margin: '0 0 6px' }}>Areas we're building in</h3>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', color: '#96AFCA' }}>No fixed openings — we hire great people when we find them.</p>
            </div>
            <div className="car-areas-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
              {AREAS.map((a, i) => (
                <div key={i} style={{ background: '#fff', border: '1px solid #DCE8F4', borderRadius: '14px', padding: '1.25rem', boxShadow: '0 2px 10px rgba(3,38,85,0.04)' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: a.bg, border: `1px solid ${a.color}25`, borderRadius: '6px', padding: '3px 9px', marginBottom: '10px' }}>
                    <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: a.color }} />
                    <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: a.color }}>{a.title}</span>
                  </div>
                  <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: '#5A7A9F', lineHeight: 1.6, margin: '0 0 10px' }}>{a.desc}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '4px' }}>
                    {a.tags.map(t => (
                      <span key={t} style={{ fontFamily: 'var(--font-ui)', fontSize: '0.6rem', fontWeight: 700, color: a.color, background: `${a.color}10`, border: `1px solid ${a.color}25`, borderRadius: '4px', padding: '2px 7px', letterSpacing: '0.06em' }}>{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── INTEREST FORM ─────────────────────────────────────────────────── */}
      <section className="car-form-sec" style={{ padding: '5.5rem 0', background: '#FFFFFF', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden style={{ position: 'absolute', bottom: '-160px', left: '-160px', width: '520px', height: '520px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(3,38,85,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div className="car-inner" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2.5rem', position: 'relative', zIndex: 2 }}>
          <div className="car-form-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '4rem', alignItems: 'flex-start' }}>

            {/* Left — copy */}
            <div style={{ paddingTop: '0.5rem' }}>
              <SectionLabel>Express Interest</SectionLabel>
              <h2 style={{ fontFamily: 'var(--font-ui)', fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 800, color: '#032655', letterSpacing: '-0.03em', lineHeight: 1.1, margin: '0 0 1.25rem' }}>
                Think you'd fit in?<br />
                <span style={{ color: '#0FB9B1' }}>We'd love to hear from you.</span>
              </h2>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.875rem', color: '#5A7A9F', lineHeight: 1.8, marginBottom: '2rem' }}>
                We don't always have specific open roles listed, but we're always looking for great people. Drop your details and we'll reach out when there's a fit.
              </p>

              {/* Trust signals */}
              {[
                { icon: '⚡', text: 'We respond to every submission within 5 business days.' },
                { icon: '🔒', text: 'Your information is private and never shared.' },
                { icon: '🎯', text: 'We only reach out when there\'s a genuine fit.' },
              ].map((t, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '1rem', flexShrink: 0, marginTop: '1px' }}>{t.icon}</span>
                  <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: '#5A7A9F', lineHeight: 1.6, margin: 0 }}>{t.text}</p>
                </div>
              ))}
            </div>

            {/* Right — form or thank-you */}
            <div>
              {submitted ? (
                /* ── Thank-you state ── */
                <div style={{ background: '#fff', border: '1px solid #DCE8F4', borderRadius: '24px', padding: '3rem 2.5rem', textAlign: 'center', boxShadow: '0 8px 40px rgba(3,38,85,0.08)', position: 'relative', overflow: 'hidden' }}>
                  {/* Top gradient accent */}
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #0FB9B1, #032655)' }} />

                  {/* Checkmark circle */}
                  <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, #D8F0EB, #B2E8E3)', border: '2px solid rgba(15,185,177,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 8px 24px rgba(15,185,177,0.2)' }}>
                    <svg width="32" height="32" fill="none" stroke="#0A9E97" strokeWidth={2.2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>

                  <h3 style={{ fontFamily: 'var(--font-ui)', fontSize: '1.4rem', fontWeight: 800, color: '#032655', letterSpacing: '-0.03em', margin: '0 0 0.625rem' }}>
                    Thanks for reaching out! 🎉
                  </h3>
                  <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.9rem', color: '#5A7A9F', lineHeight: 1.7, margin: '0 0 0.5rem', maxWidth: '380px', marginLeft: 'auto', marginRight: 'auto' }}>
                    We've received your interest and will review it carefully. If there's a fit, someone from our team will be in touch within <strong style={{ color: '#032655' }}>5 business days</strong>.
                  </p>
                  <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', color: '#96AFCA', margin: '0 0 2rem' }}>
                    In the meantime, feel free to explore the platform.
                  </p>

                  {/* Decorative stat strip */}
                  <div style={{ display: 'flex', gap: '1px', background: '#EEF3F8', borderRadius: '12px', overflow: 'hidden', marginTop: '1.5rem' }}>
                    {[{ v: 'Fast', l: 'Response' }, { v: 'Real', l: 'Ownership' }, { v: 'Big', l: 'Mission' }].map((s, i) => (
                      <div key={i} style={{ flex: 1, background: '#F5F8FC', padding: '0.875rem 0.5rem', textAlign: 'center' }}>
                        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.95rem', fontWeight: 800, color: '#0FB9B1', margin: 0, lineHeight: 1 }}>{s.v}</p>
                        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.6rem', color: '#96AFCA', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, margin: '3px 0 0' }}>{s.l}</p>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setSubmitted(false)}
                    style={{ marginTop: '1.5rem', background: 'none', border: '1.5px solid #DCE8F4', borderRadius: '9px', padding: '8px 20px', fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 700, color: '#96AFCA', cursor: 'pointer', letterSpacing: '0.04em' }}
                  >
                    Submit Another
                  </button>
                </div>
              ) : (
                /* ── Form ── */
                <div style={{ background: '#fff', border: '1px solid #DCE8F4', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 8px 40px rgba(3,38,85,0.07)' }}>
                  <div style={{ height: '3px', background: 'linear-gradient(90deg, #0FB9B1, #032655)' }} />
                  <div style={{ padding: '2rem 2.25rem' }}>
                    <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase' as const, color: '#0FB9B1', margin: '0 0 1.25rem' }}>
                      Interest Form — Takes 2 minutes
                    </p>

                    <form ref={formRef} onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                      {/* Name + Email */}
                      <div className="car-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                          <label style={labelStyle}>Full Name <span style={{ color: '#E53E3E' }}>*</span></label>
                          <input name="full_name" required placeholder="Riya Sharma" style={inputStyle} />
                        </div>
                        <div>
                          <label style={labelStyle}>Email Address <span style={{ color: '#E53E3E' }}>*</span></label>
                          <input name="email" type="email" required placeholder="riya@email.com" style={inputStyle} />
                        </div>
                      </div>

                      {/* Role + Experience */}
                      <div className="car-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                          <label style={labelStyle}>Area of Interest <span style={{ color: '#E53E3E' }}>*</span></label>
                          <select name="role_interest" required defaultValue="" style={{ ...inputStyle, cursor: 'pointer' }}>
                            <option value="" disabled>Select area…</option>
                            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                          </select>
                        </div>
                        <div>
                          <label style={labelStyle}>Years of Experience</label>
                          <input name="experience_years" type="number" min={0} max={40} placeholder="e.g. 4" style={inputStyle} />
                        </div>
                      </div>

                      {/* LinkedIn */}
                      <div>
                        <label style={labelStyle}>LinkedIn Profile</label>
                        <input name="linkedin_url" type="url" placeholder="https://linkedin.com/in/your-profile" style={inputStyle} />
                      </div>

                      {/* Message */}
                      <div>
                        <label style={labelStyle}>Why AlphaNom? <span style={{ color: '#E53E3E' }}>*</span></label>
                        <textarea
                          name="message"
                          required
                          rows={4}
                          placeholder="Tell us what excites you about AlphaNom and what you'd bring to the team…"
                          style={{ ...inputStyle, resize: 'vertical' as const, fontFamily: 'var(--font-ui)' }}
                        />
                      </div>

                      {/* Resume */}
                      <div>
                        <label style={labelStyle}>Resume / CV <span style={{ color: '#96AFCA', fontWeight: 400 }}>(optional)</span></label>
                        <input
                          name="resume"
                          type="file"
                          accept=".pdf,.doc,.docx"
                          style={{ ...inputStyle, padding: '8px 14px', cursor: 'pointer', color: '#5A7A9F' }}
                        />
                        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', color: '#96AFCA', marginTop: '4px' }}>PDF, DOC or DOCX — max 10 MB</p>
                      </div>

                      {error && (
                        <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '10px', padding: '10px 14px', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                          <svg width="14" height="14" fill="none" stroke="#DC2626" strokeWidth={2} viewBox="0 0 24 24" style={{ flexShrink: 0, marginTop: '1px' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.008v.008H12v-.008z" />
                          </svg>
                          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: '#DC2626', margin: 0 }}>{error}</p>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={pending}
                        style={{ width: '100%', padding: '13px', borderRadius: '11px', border: 'none', background: pending ? '#96AFCA' : '#032655', color: '#fff', fontFamily: 'var(--font-ui)', fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.04em', cursor: pending ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '0.25rem', transition: 'background 0.18s' }}
                      >
                        {pending ? (
                          <>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} style={{ animation: 'carSpin 0.8s linear infinite' }}>
                              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                            </svg>
                            Sending…
                          </>
                        ) : (
                          <>
                            Submit Interest
                            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes carSpin { to { transform: rotate(360deg) } }
        input:focus, textarea:focus, select:focus { border-color: #0FB9B1 !important; box-shadow: 0 0 0 3px rgba(15,185,177,0.1) !important; }

        @media (max-width: 960px) {
          .car-form-layout { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
          .car-perks-grid  { grid-template-columns: 1fr 1fr !important; }
          .car-areas-grid  { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 600px) {
          .car-perks-grid  { grid-template-columns: 1fr !important; }
          .car-areas-grid  { grid-template-columns: 1fr 1fr !important; }
          .car-form-row    { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .car-inner   { padding: 0 1.25rem !important; }
          .car-life    { padding: 4rem 0 !important; }
          .car-form-sec { padding: 4rem 0 !important; }
          .car-areas-grid  { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  )
}
