'use client'

import { useEffect, useRef, useState } from 'react'

/* ── Count-up ─────────────────────────────────────────────────────────────── */
function useCountUp(target: number, duration = 2000, started = false) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!started) return
    let start: number | null = null
    const tick = (ts: number) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / duration, 1)
      const ease = 1 - Math.pow(1 - p, 4)
      setVal(Math.floor(ease * target))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [target, duration, started])
  return val
}

/* ── Intersection reveal ──────────────────────────────────────────────────── */
function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [on, setOn] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect() } }, { threshold })
    io.observe(el); return () => io.disconnect()
  }, [threshold])
  return { ref, on }
}

/* ── Section label (same as landing) ─────────────────────────────────────── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '14px' }}>
      <div style={{ width: '24px', height: '2px', background: '#0FB9B1', borderRadius: '2px' }} />
      <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.63rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: '#0FB9B1' }}>{children}</span>
      <div style={{ width: '24px', height: '2px', background: '#0FB9B1', borderRadius: '2px' }} />
    </div>
  )
}

const VALUES = [
  {
    num: '01', color: '#0FB9B1',
    title: 'Speed Over Noise',
    desc: 'No spray-and-pray job boards. Every role reaches only the recruiters who specialise in it — meaning relevant candidates arrive in 48 hours, not 48 days.',
    icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>,
  },
  {
    num: '02', color: '#5A7A9F',
    title: 'Full Transparency',
    desc: 'Employers see every submission in real time. Recruiters see their placements and earnings without delays. No black boxes, no ambiguity — ever.',
    icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><circle cx="12" cy="12" r="3" /></svg>,
  },
  {
    num: '03', color: '#0FB9B1',
    title: 'Specialist-Only Network',
    desc: 'Every recruiter on AlphaNom is vetted for domain expertise. Finance roles go to finance recruiters. Tech roles to tech recruiters. Fit matters more than volume.',
    icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" /></svg>,
  },
  {
    num: '04', color: '#5A7A9F',
    title: 'Results-Based Model',
    desc: 'Employers pay nothing until a candidate is hired. Recruiters earn transparent commissions on every successful placement. Incentives are perfectly aligned.',
    icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  },
]

const STEPS = [
  {
    num: '01', color: '#0FB9B1',
    title: 'Employer Posts a Role',
    desc: 'A verified company publishes a detailed job brief — requirements, budget, and a note to recruiters. Goes live to the matched specialist network instantly.',
    tags: ['Verified Only', 'Instant Go-Live'],
    icon: <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>,
  },
  {
    num: '02', color: '#C8A96E',
    title: 'Specialists Submit Talent',
    desc: 'Domain-expert recruiters browse roles aligned with their niche and submit pre-screened candidates with full profiles — no cold outreach required.',
    tags: ['Pre-screened', 'Domain Matched'],
    icon: <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>,
  },
  {
    num: '03', color: '#5A7A9F',
    title: 'Track Every Stage Live',
    desc: 'Both parties see every submission, shortlist, and interview update on a shared live dashboard. Zero black holes, zero chasing.',
    tags: ['Live Dashboard', 'Zero Delays'],
    icon: <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>,
  },
  {
    num: '04', color: '#0FB9B1',
    title: 'Hire · Reward · Repeat',
    desc: 'When the hire is made, the recruiter earns their placement fee — transparent, fast, and with no middlemen. Then the cycle starts again.',
    tags: ['Transparent Fees', 'Fast Payouts'],
    icon: <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  },
]

const TIMELINE = [
  { year: '2024', title: 'The Problem Identified', body: 'Our founders watched companies spend months on open roles while specialist recruiters had no structured channel to reach them at scale. Traditional job boards served neither side well.' },
  { year: 'Early 2025', title: 'AlphaNom Founded', body: 'Built the first version — a lean matching layer between employers and recruitment specialists. Closed 50 roles in the first 90 days, proving the model worked.' },
  { year: 'Mid 2025', title: 'Network Opened', body: 'Expanded to 200+ companies and 1,500+ vetted recruiters across India, covering 30+ domains from fintech and SaaS to healthcare and deep tech.' },
  { year: 'Today', title: 'Scaling Impact', body: '8,000+ roles closed. ₹24Cr+ in recruiter earnings unlocked. The platform keeps getting faster, smarter, and more transparent with every hire.' },
]

export default function AboutPage() {
  const [hoveredVal, setHoveredVal]   = useState<number | null>(null)
  const [hoveredStep, setHoveredStep] = useState<number | null>(null)

  const statsReveal    = useReveal()
  const valuesReveal   = useReveal()
  const stepsReveal    = useReveal()
  const missionReveal  = useReveal()
  const timelineReveal = useReveal()

  const c0 = useCountUp(200,  1800, statsReveal.on)
  const c1 = useCountUp(1500, 2000, statsReveal.on)
  const c2 = useCountUp(8000, 2200, statsReveal.on)
  const c3 = useCountUp(95,   1600, statsReveal.on)

  return (
    <main style={{ fontFamily: 'var(--font-ui)' }}>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="about-hero" style={{ background: 'linear-gradient(145deg, #032655 0%, #0a3570 55%, #0e4080 100%)', position: 'relative', overflow: 'hidden', padding: '6rem 0 5rem' }}>
        <div aria-hidden style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.035) 1px, transparent 1px)', backgroundSize: '28px 28px', pointerEvents: 'none' }} />
        <div aria-hidden style={{ position: 'absolute', top: '-160px', right: '-160px', width: '520px', height: '520px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(15,185,177,0.13) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div aria-hidden style={{ position: 'absolute', bottom: '-100px', left: '-100px', width: '380px', height: '380px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(15,185,177,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div className="about-inner" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2.5rem', position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(15,185,177,0.1)', border: '1px solid rgba(15,185,177,0.22)', borderRadius: '100px', padding: '5px 16px', marginBottom: '1.5rem' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0FB9B1' }} />
            <span style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase' as const, color: '#0FB9B1' }}>About AlphaNom</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-ui)', fontSize: 'clamp(2.25rem, 5vw, 3.75rem)', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.08, margin: '0 0 1.25rem' }}>
            Hiring, the way it<br />
            <span style={{ color: '#0FB9B1' }}>should have always been.</span>
          </h1>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: 'clamp(0.9rem, 1.5vw, 1.05rem)', color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, maxWidth: '560px', margin: '0 auto' }}>
            AlphaNom is India's specialist recruitment marketplace — connecting companies who need to hire with the domain-expert recruiters best placed to help them do it. Faster, smarter, and transparently.
          </p>
        </div>
      </section>

      {/* ── MISSION ──────────────────────────────────────────────────────── */}
      <section className="about-mission" style={{ padding: '6rem 0', background: '#FFFFFF', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden style={{ position: 'absolute', top: '-200px', right: '-200px', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(15,185,177,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div
          ref={missionReveal.ref}
          className="about-inner about-mission-grid"
          style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center', opacity: missionReveal.on ? 1 : 0, transform: missionReveal.on ? 'none' : 'translateY(28px)', transition: 'opacity 0.65s ease, transform 0.65s ease' }}
        >
          <div>
            <SectionLabel>Our Mission</SectionLabel>
            <h2 style={{ fontFamily: 'var(--font-ui)', fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 800, color: '#032655', letterSpacing: '-0.03em', lineHeight: 1.1, margin: '0 0 1.25rem' }}>
              We exist to eliminate<br />
              <span style={{ color: '#0FB9B1' }}>the friction in hiring.</span>
            </h2>
            <p style={{ fontSize: '0.9375rem', color: '#5A7A9F', lineHeight: 1.75, marginBottom: '1rem' }}>
              The average company takes 45 days to close a role. The average recruiter submits candidates to firms they've never spoken with, hoping something sticks. Both sides lose time — and the best candidates slip through the cracks.
            </p>
            <p style={{ fontSize: '0.9375rem', color: '#5A7A9F', lineHeight: 1.75, marginBottom: '2rem' }}>
              AlphaNom was built to fix this. We match the right specialist recruiter to the right job — instantly, transparently, and with zero upfront cost to employers. Every feature on this platform exists to get people hired faster.
            </p>
            <div style={{ display: 'flex', gap: '2.5rem' }}>
              {[{ v: '48h', l: 'Avg. first submission' }, { v: '95%', l: 'Client satisfaction' }, { v: '0', l: 'Upfront cost to hire' }].map(s => (
                <div key={s.l}>
                  <p style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0FB9B1', letterSpacing: '-0.04em', margin: 0, lineHeight: 1 }}>{s.v}</p>
                  <p style={{ fontSize: '0.65rem', color: '#96AFCA', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase' as const, marginTop: '5px' }}>{s.l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — visual mock card */}
          <div style={{ position: 'relative' }}>
            <div aria-hidden style={{ position: 'absolute', top: '16px', left: '16px', right: '-16px', bottom: '-16px', background: '#D8F0EB', borderRadius: '20px', border: '1px solid rgba(15,185,177,0.18)' }} />
            <div style={{ position: 'relative', background: '#fff', borderRadius: '20px', border: '1px solid #DCE8F4', boxShadow: '0 20px 60px rgba(3,38,85,0.09)', padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '1rem', borderBottom: '1px solid #EEF3F8' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'linear-gradient(135deg, #032655, #0FB9B1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.68rem', color: '#fff' }}>AN</span>
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: '0.82rem', color: '#032655', margin: 0 }}>Real Hiring Outcome</p>
                  <p style={{ fontSize: '0.65rem', color: '#96AFCA', margin: 0 }}>Senior Product Designer · B2B SaaS</p>
                </div>
              </div>
              {[
                { label: 'Role Posted',         value: 'Day 1',    color: '#032655' },
                { label: 'First Submission',    value: 'Day 1, 14h', color: '#0A9E97' },
                { label: 'Candidates Reviewed', value: '12 profiled', color: '#032655' },
                { label: 'Interviews Done',     value: '3 shortlisted', color: '#032655' },
                { label: 'Offer Accepted',      value: 'Day 21 ✓', color: '#276749' },
              ].map(r => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 12px', background: '#F5F8FC', borderRadius: '9px' }}>
                  <span style={{ fontSize: '0.72rem', color: '#96AFCA', fontWeight: 600 }}>{r.label}</span>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: r.color }}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW WE WORK ──────────────────────────────────────────────────── */}
      <section className="about-steps" style={{ padding: '6rem 0', background: '#F4F8FC', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'radial-gradient(circle, rgba(3,38,85,0.04) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div aria-hidden style={{ position: 'absolute', top: '-200px', right: '-200px', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(15,185,177,0.08) 0%, transparent 65%)', pointerEvents: 'none' }} />

        <div ref={stepsReveal.ref} className="about-inner" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2.5rem', position: 'relative', zIndex: 2, opacity: stepsReveal.on ? 1 : 0, transform: stepsReveal.on ? 'none' : 'translateY(28px)', transition: 'opacity 0.65s ease, transform 0.65s ease' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <SectionLabel>How We Work</SectionLabel>
            <h2 style={{ fontFamily: 'var(--font-ui)', fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 800, color: '#032655', letterSpacing: '-0.03em', lineHeight: 1.1, margin: '0 0 1rem' }}>
              Four steps.<br />
              <span style={{ color: '#0FB9B1' }}>One great hire.</span>
            </h2>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.95rem', color: '#5A7A9F', lineHeight: 1.7, maxWidth: '520px', margin: '0 auto' }}>
              A clean, transparent workflow that gets top candidates in front of the right employers — faster than any traditional method.
            </p>
          </div>

          <div className="about-steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', position: 'relative' }}>
            <div aria-hidden className="about-connector" style={{ position: 'absolute', top: '52px', left: 'calc(12.5% + 24px)', right: 'calc(12.5% + 24px)', height: '2px', zIndex: 0, background: 'linear-gradient(90deg, #0FB9B1 0%, #D0DBE8 33%, #D0DBE8 66%, #0FB9B1 100%)' }} />
            {STEPS.map((step, i) => (
              <div
                key={i}
                onMouseEnter={() => setHoveredStep(i)}
                onMouseLeave={() => setHoveredStep(null)}
                style={{ background: '#FFFFFF', border: `1px solid ${hoveredStep === i ? step.color : '#DCE8F4'}`, borderRadius: '20px', padding: '1.75rem 1.5rem', position: 'relative', zIndex: 1, cursor: 'default', boxShadow: hoveredStep === i ? `0 20px 50px rgba(3,38,85,0.12), 0 0 0 3px ${step.color}18` : '0 4px 20px rgba(3,38,85,0.05)', transform: hoveredStep === i ? 'translateY(-4px)' : 'translateY(0)', transition: 'all 0.25s ease' }}
              >
                <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', background: hoveredStep === i ? step.color : '#032655', color: '#fff', fontFamily: 'var(--font-ui)', fontSize: '0.58rem', fontWeight: 800, letterSpacing: '0.1em', padding: '4px 12px', borderRadius: '100px', transition: 'background 0.25s ease', whiteSpace: 'nowrap' as const }}>
                  STEP {step.num}
                </div>
                <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: hoveredStep === i ? `${step.color}18` : '#EEF5FF', border: `1px solid ${hoveredStep === i ? step.color : '#DCE8F4'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: hoveredStep === i ? step.color : '#032655', marginBottom: '1.25rem', transition: 'all 0.25s ease' }}>
                  {step.icon}
                </div>
                <h3 style={{ fontFamily: 'var(--font-ui)', fontSize: '0.92rem', fontWeight: 700, color: '#032655', lineHeight: 1.3, marginBottom: '0.6rem', letterSpacing: '-0.01em' }}>{step.title}</h3>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: '#5A7A9F', lineHeight: 1.65, marginBottom: '1.25rem' }}>{step.desc}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '6px' }}>
                  {step.tags.map(tag => (
                    <span key={tag} style={{ fontFamily: 'var(--font-ui)', fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: step.color, background: `${step.color}12`, border: `1px solid ${step.color}30`, padding: '3px 8px', borderRadius: '4px' }}>{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VALUES ───────────────────────────────────────────────────────── */}
      <section className="about-values" style={{ padding: '6rem 0', background: '#FFFFFF', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden style={{ position: 'absolute', bottom: '-150px', left: '-150px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(3,38,85,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div ref={valuesReveal.ref} className="about-inner" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2.5rem', position: 'relative', zIndex: 2, opacity: valuesReveal.on ? 1 : 0, transform: valuesReveal.on ? 'none' : 'translateY(28px)', transition: 'opacity 0.65s ease, transform 0.65s ease' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <SectionLabel>What We Stand For</SectionLabel>
            <h2 style={{ fontFamily: 'var(--font-ui)', fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 800, color: '#032655', letterSpacing: '-0.03em', lineHeight: 1.1, margin: '0 0 1rem' }}>
              Principles that drive<br />
              <span style={{ color: '#0FB9B1' }}>every decision we make.</span>
            </h2>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.9375rem', color: '#5A7A9F', lineHeight: 1.7, maxWidth: '520px', margin: '0 auto' }}>
              AlphaNom is built on a simple belief: hiring gets better when both sides of the table win.
            </p>
          </div>

          <div className="about-values-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {VALUES.map((v, i) => (
              <div
                key={i}
                onMouseEnter={() => setHoveredVal(i)}
                onMouseLeave={() => setHoveredVal(null)}
                style={{ background: '#fff', border: `1px solid ${hoveredVal === i ? v.color + '50' : '#DCE8F4'}`, borderRadius: '14px', padding: '1rem 1.25rem', display: 'flex', alignItems: 'flex-start', gap: '1rem', boxShadow: hoveredVal === i ? `0 8px 28px rgba(3,38,85,0.09), 0 0 0 3px ${v.color}12` : '0 2px 12px rgba(3,38,85,0.04)', transform: hoveredVal === i ? 'translateX(4px)' : 'translateX(0)', transition: 'all 0.22s ease', cursor: 'default' }}
              >
                <div style={{ width: '42px', height: '42px', borderRadius: '11px', flexShrink: 0, background: hoveredVal === i ? v.color : '#EEF5FF', border: `1px solid ${hoveredVal === i ? v.color : '#DCE8F4'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: hoveredVal === i ? '#fff' : v.color, transition: 'all 0.22s ease' }}>
                  {v.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.1em', color: v.color }}>{v.num}</span>
                    <h3 style={{ fontFamily: 'var(--font-ui)', fontSize: '0.88rem', fontWeight: 700, color: '#032655', margin: 0 }}>{v.title}</h3>
                  </div>
                  <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: '#5A7A9F', lineHeight: 1.65, margin: 0 }}>{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── IMPACT STATS ─────────────────────────────────────────────────── */}
      <section className="about-stats" style={{ padding: '6rem 0', background: '#032655', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px)', backgroundSize: '28px 28px', pointerEvents: 'none' }} />
        <div aria-hidden style={{ position: 'absolute', top: '-100px', right: '-100px', width: '420px', height: '420px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(15,185,177,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div aria-hidden style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '280px', height: '280px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div ref={statsReveal.ref} className="about-inner" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2.5rem', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{ width: '24px', height: '2px', background: '#0FB9B1', borderRadius: '2px' }} />
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.63rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: '#0FB9B1' }}>Our Impact</span>
              <div style={{ width: '24px', height: '2px', background: '#0FB9B1', borderRadius: '2px' }} />
            </div>
            <h2 style={{ fontFamily: 'var(--font-ui)', fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.1, margin: '0 0 1rem' }}>
              Numbers that speak<br />
              <span style={{ color: '#0FB9B1' }}>for themselves.</span>
            </h2>
          </div>

          <div className="about-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', background: 'rgba(255,255,255,0.06)', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }}>
            {[
              { count: c0, suffix: '+',  label: 'Companies Hiring',  sub: 'Across every industry',      col: '#0FB9B1' },
              { count: c1, suffix: '+',  label: 'Active Recruiters', sub: 'Vetted domain specialists',  col: '#fff'    },
              { count: c2, suffix: '+',  label: 'Roles Closed',      sub: 'And growing every week',     col: '#0FB9B1' },
              { count: c3, suffix: '%',  label: 'Success Rate',      sub: 'Client satisfaction score',  col: '#fff'    },
            ].map((s, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.02)', padding: '2.5rem 2rem', textAlign: 'center' }}>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', fontWeight: 800, color: s.col, letterSpacing: '-0.04em', lineHeight: 1, margin: '0 0 0.5rem' }}>
                  {s.count.toLocaleString()}{s.suffix}
                </p>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.85rem', fontWeight: 700, color: 'rgba(255,255,255,0.85)', margin: '0 0 4px' }}>{s.label}</p>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)', fontWeight: 500 }}>{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OUR STORY ────────────────────────────────────────────────────── */}
      <section className="about-story" style={{ padding: '6rem 0', background: '#F4F8FC', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'radial-gradient(circle, rgba(3,38,85,0.04) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

        <div ref={timelineReveal.ref} className="about-inner" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2.5rem', position: 'relative', zIndex: 2, opacity: timelineReveal.on ? 1 : 0, transform: timelineReveal.on ? 'none' : 'translateY(28px)', transition: 'opacity 0.65s ease, transform 0.65s ease' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <SectionLabel>Our Story</SectionLabel>
            <h2 style={{ fontFamily: 'var(--font-ui)', fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 800, color: '#032655', letterSpacing: '-0.03em', lineHeight: 1.1, margin: '0 0 1rem' }}>
              Built by people<br />
              <span style={{ color: '#0FB9B1' }}>who felt the pain.</span>
            </h2>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.9375rem', color: '#5A7A9F', lineHeight: 1.7, maxWidth: '520px', margin: '0 auto' }}>
              AlphaNom started with a simple question: why does hiring still feel broken for everyone involved?
            </p>
          </div>

          <div className="about-timeline" style={{ maxWidth: '800px', margin: '0 auto', position: 'relative' }}>
            <div aria-hidden style={{ position: 'absolute', left: '19px', top: '8px', bottom: '8px', width: '2px', background: 'linear-gradient(180deg, #0FB9B1 0%, rgba(15,185,177,0.15) 100%)', borderRadius: '2px' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              {TIMELINE.map((t, i) => (
                <div key={i} style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
                  <div style={{ flexShrink: 0, width: '40px', height: '40px', borderRadius: '50%', background: i === TIMELINE.length - 1 ? '#032655' : '#fff', border: `2px solid ${i === TIMELINE.length - 1 ? '#032655' : '#0FB9B1'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1, boxShadow: '0 4px 14px rgba(3,38,85,0.1)' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: i === TIMELINE.length - 1 ? '#0FB9B1' : '#0A9E97' }} />
                  </div>
                  <div style={{ flex: 1, background: '#fff', borderRadius: '16px', border: '1px solid #DCE8F4', padding: '1.25rem 1.5rem', boxShadow: '0 4px 16px rgba(3,38,85,0.05)' }}>
                    <span style={{ display: 'inline-block', fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: '#0FB9B1', background: '#D8F0EB', border: '1px solid rgba(15,185,177,0.2)', borderRadius: '100px', padding: '3px 10px', marginBottom: '8px' }}>{t.year}</span>
                    <h3 style={{ fontFamily: 'var(--font-ui)', fontWeight: 800, fontSize: '0.95rem', color: '#032655', letterSpacing: '-0.02em', margin: '0 0 6px' }}>{t.title}</h3>
                    <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', color: '#5A7A9F', lineHeight: 1.7, margin: 0 }}>{t.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes floatY { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }

        @media (max-width: 960px) {
          .about-mission-grid { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
          .about-values-grid  { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 900px) {
          .about-steps-grid { grid-template-columns: 1fr 1fr !important; gap: 1rem !important; }
          .about-connector  { display: none !important; }
          .about-stats-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 560px) {
          .about-steps-grid { grid-template-columns: 1fr !important; }
          .about-stats-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .about-hero    { padding: 4rem 0 3.5rem !important; }
          .about-mission { padding: 4rem 0 !important; }
          .about-steps   { padding: 4rem 0 !important; }
          .about-values  { padding: 4rem 0 !important; }
          .about-stats   { padding: 4rem 0 !important; }
          .about-story   { padding: 4rem 0 !important; }
          .about-inner   { padding: 0 1.25rem !important; }
          .about-timeline { padding: 0 !important; }
        }
      `}</style>
    </main>
  )
}
