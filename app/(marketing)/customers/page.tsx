'use client'

import { useState } from 'react'

/* ── Company data ─────────────────────────────────────────────────────────── */
type Company = { name: string; domain: string; location: string; category: 'startup' | 'mnc' | 'product'; initials: string; color: string }

const COMPANIES: Company[] = [
  /* Startups */
  { name: 'Darwinbox',    domain: 'HR Tech',      location: 'Hyderabad', category: 'startup',  initials: 'DB', color: '#0FB9B1' },
  { name: 'LeadSquared',  domain: 'Sales SaaS',   location: 'Bangalore', category: 'startup',  initials: 'LS', color: '#5A7A9F' },
  { name: 'Jar',          domain: 'Fintech',       location: 'Bangalore', category: 'startup',  initials: 'JR', color: '#C8A96E' },
  { name: 'Slice',        domain: 'Fintech',       location: 'Bangalore', category: 'startup',  initials: 'SL', color: '#0FB9B1' },
  { name: 'Fibe',         domain: 'Fintech',       location: 'Pune',      category: 'startup',  initials: 'FB', color: '#5A7A9F' },
  { name: 'KreditBee',    domain: 'Lending Tech',  location: 'Bangalore', category: 'startup',  initials: 'KB', color: '#C8A96E' },

  /* MNCs */
  { name: 'Mphasis',      domain: 'IT Services',   location: 'Bangalore', category: 'mnc',      initials: 'MP', color: '#032655' },
  { name: 'Hexaware',     domain: 'IT Services',   location: 'Mumbai',    category: 'mnc',      initials: 'HX', color: '#5A7A9F' },
  { name: 'GlobalLogic',  domain: 'Engineering',   location: 'Noida',     category: 'mnc',      initials: 'GL', color: '#0FB9B1' },
  { name: 'ThoughtWorks', domain: 'Consulting',    location: 'Bangalore', category: 'mnc',      initials: 'TW', color: '#032655' },
  { name: 'Nagarro',      domain: 'Digital Eng.',  location: 'Delhi',     category: 'mnc',      initials: 'NG', color: '#5A7A9F' },
  { name: 'Mastech',      domain: 'IT Staffing',   location: 'Chennai',   category: 'mnc',      initials: 'MS', color: '#C8A96E' },

  /* Product-based */
  { name: 'Freshworks',   domain: 'SaaS',          location: 'Chennai',   category: 'product',  initials: 'FW', color: '#0FB9B1' },
  { name: 'BrowserStack', domain: 'Dev Tools',     location: 'Mumbai',    category: 'product',  initials: 'BS', color: '#5A7A9F' },
  { name: 'WebEngage',    domain: 'MarTech',       location: 'Mumbai',    category: 'product',  initials: 'WE', color: '#C8A96E' },
  { name: 'MoEngage',     domain: 'MarTech',       location: 'Bangalore', category: 'product',  initials: 'ME', color: '#032655' },
  { name: 'Chargebee',    domain: 'Billing SaaS',  location: 'Chennai',   category: 'product',  initials: 'CB', color: '#0FB9B1' },
  { name: 'Wingify',      domain: 'Experimentation', location: 'Delhi',   category: 'product',  initials: 'WG', color: '#5A7A9F' },
]

const TABS = [
  { id: 'all',     label: 'All Companies' },
  { id: 'startup', label: 'Startups'      },
  { id: 'mnc',     label: 'MNCs'          },
  { id: 'product', label: 'Product-Based' },
] as const

const CATEGORY_META: Record<string, { label: string; desc: string; bg: string; color: string }> = {
  startup: { label: 'Startups',      desc: 'Fast-growing ventures scaling their teams rapidly.', bg: '#D8F0EB', color: '#0A9E97' },
  mnc:     { label: 'MNCs',          desc: 'Established multinationals hiring specialist talent.', bg: '#EEF3F8', color: '#5A7A9F' },
  product: { label: 'Product-Based', desc: 'Tech product companies building world-class teams.', bg: '#FDF3DC', color: '#B7791F' },
}

const QUOTES = [
  {
    quote: 'We needed a senior backend engineer with very specific fintech exposure. AlphaNom connected us with a recruiter who understood the brief immediately — we had three strong profiles within 48 hours.',
    name:  'Head of Engineering',
    at:    'Series B Fintech · Bangalore',
    stat:  '18 days', statLabel: 'to close the role',
    color: '#0FB9B1', bg: '#D8F0EB',
  },
  {
    quote: 'The specialist-only network is genuinely different. Every candidate we received was pre-screened by someone who actually understood our product domain. No noise, just quality.',
    name:  'VP of People',
    at:    'SaaS Product Company · Chennai',
    stat:  '100%', statLabel: 'offer acceptance rate',
    color: '#5A7A9F', bg: '#EEF3F8',
  },
  {
    quote: 'As a mid-size IT firm, we don\'t have the brand pull of a TCS or Infosys. AlphaNom gave us access to recruiters who filled our niche roles — tech roles that had been open for months.',
    name:  'Talent Acquisition Lead',
    at:    'IT Services MNC · Mumbai',
    stat:  '3 hires', statLabel: 'in the first month',
    color: '#C8A96E', bg: '#FDF3DC',
  },
]

/* ── Page ─────────────────────────────────────────────────────────────────── */
export default function CustomersPage() {
  const [active, setActive] = useState<'all' | 'startup' | 'mnc' | 'product'>('all')
  const [hovered, setHovered] = useState<string | null>(null)

  const filtered = active === 'all' ? COMPANIES : COMPANIES.filter(c => c.category === active)

  return (
    <main style={{ fontFamily: 'var(--font-ui)' }}>

      {/* ── HERO ───────────────────────────────────────────────────────── */}
      <section className="cust-hero" style={{ background: 'linear-gradient(145deg, #032655 0%, #0a3570 55%, #0e4080 100%)', position: 'relative', overflow: 'hidden', padding: '5rem 0 4.5rem' }}>
        <div aria-hidden style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.035) 1px, transparent 1px)', backgroundSize: '28px 28px', pointerEvents: 'none' }} />
        <div aria-hidden style={{ position: 'absolute', top: '-120px', right: '-120px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(15,185,177,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div className="cust-inner" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2.5rem', position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '1.25rem' }}>
            <div style={{ width: '24px', height: '2px', background: '#0FB9B1', borderRadius: '2px' }} />
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.63rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: '#0FB9B1' }}>Our Customers</span>
            <div style={{ width: '24px', height: '2px', background: '#0FB9B1', borderRadius: '2px' }} />
          </div>
          <h1 style={{ fontFamily: 'var(--font-ui)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.1, margin: '0 0 1rem' }}>
            Trusted by teams that<br />
            <span style={{ color: '#0FB9B1' }}>move fast and hire smart.</span>
          </h1>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.9375rem', color: 'rgba(255,255,255,0.58)', lineHeight: 1.75, maxWidth: '520px', margin: '0 auto' }}>
            From high-growth startups to established MNCs and product companies — AlphaNom powers hiring across industries and stages.
          </p>

          {/* Inline stats */}
          <div className="cust-hero-stats" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0', marginTop: '2.5rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', overflow: 'hidden', maxWidth: '560px', marginLeft: 'auto', marginRight: 'auto' }}>
            {[
              { v: '200+', l: 'Companies' },
              { v: '30+',  l: 'Domains' },
              { v: '95%',  l: 'Satisfaction' },
            ].map((s, i) => (
              <div key={i} style={{ flex: 1, padding: '1.25rem 1rem', textAlign: 'center', borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '1.5rem', fontWeight: 800, color: i % 2 === 0 ? '#0FB9B1' : '#fff', letterSpacing: '-0.03em', margin: 0, lineHeight: 1 }}>{s.v}</p>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.38)', marginTop: '4px' }}>{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPANY GRID ───────────────────────────────────────────────── */}
      <section style={{ padding: '5rem 0', background: '#F4F8FC', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(3,38,85,0.04) 1px, transparent 1px)', backgroundSize: '28px 28px', pointerEvents: 'none' }} />

        <div className="cust-inner" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2.5rem', position: 'relative', zIndex: 2 }}>

          {/* Filter tabs */}
          <div className="cust-tabs" style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginBottom: '3rem', background: '#fff', border: '1px solid #DCE8F4', borderRadius: '14px', padding: '5px', width: 'fit-content', margin: '0 auto 3rem' }}>
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActive(tab.id)}
                style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', fontWeight: 700, padding: '8px 18px', borderRadius: '9px', border: 'none', cursor: 'pointer', transition: 'all 0.18s ease', background: active === tab.id ? '#032655' : 'transparent', color: active === tab.id ? '#fff' : '#5A7A9F' }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Category badge */}
          {active !== 'all' && (
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 600, color: CATEGORY_META[active].color, background: CATEGORY_META[active].bg, border: `1px solid ${CATEGORY_META[active].color}30`, borderRadius: '100px', padding: '5px 14px' }}>
                <span>{CATEGORY_META[active].label}</span>
                <span style={{ opacity: 0.5 }}>·</span>
                <span style={{ fontWeight: 400 }}>{CATEGORY_META[active].desc}</span>
              </span>
            </div>
          )}

          {/* Grid */}
          <div className="cust-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            {filtered.map((c) => (
              <div
                key={c.name}
                onMouseEnter={() => setHovered(c.name)}
                onMouseLeave={() => setHovered(null)}
                style={{ background: '#fff', border: `1px solid ${hovered === c.name ? c.color + '55' : '#DCE8F4'}`, borderRadius: '16px', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: hovered === c.name ? `0 10px 32px rgba(3,38,85,0.1), 0 0 0 3px ${c.color}12` : '0 2px 12px rgba(3,38,85,0.04)', transform: hovered === c.name ? 'translateY(-2px)' : 'translateY(0)', transition: 'all 0.22s ease', cursor: 'default' }}
              >
                {/* Avatar */}
                <div style={{ width: '44px', height: '44px', borderRadius: '11px', background: `${c.color}15`, border: `1px solid ${c.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 800, fontSize: '0.72rem', color: c.color, letterSpacing: '0.04em' }}>{c.initials}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: '0.88rem', color: '#032655', margin: '0 0 3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{c.name}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' as const }}>
                    <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', fontWeight: 700, color: c.color, background: `${c.color}12`, border: `1px solid ${c.color}25`, borderRadius: '4px', padding: '2px 7px' }}>{c.domain}</span>
                    <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', color: '#96AFCA' }}>📍 {c.location}</span>
                  </div>
                </div>
                {/* Category dot */}
                <div style={{ flexShrink: 0 }}>
                  <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: CATEGORY_META[c.category].color, background: CATEGORY_META[c.category].bg, borderRadius: '4px', padding: '3px 7px' }}>
                    {c.category === 'startup' ? 'Startup' : c.category === 'mnc' ? 'MNC' : 'Product'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <p style={{ fontFamily: 'var(--font-ui)', textAlign: 'center', fontSize: '0.78rem', color: '#96AFCA', marginTop: '2rem' }}>
            Showing {filtered.length} of 200+ companies actively hiring on AlphaNom
          </p>
        </div>
      </section>

      {/* ── QUOTES ─────────────────────────────────────────────────────── */}
      <section style={{ padding: '5rem 0', background: '#FFFFFF', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden style={{ position: 'absolute', top: '-160px', right: '-160px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(15,185,177,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div className="cust-inner" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2.5rem', position: 'relative', zIndex: 2 }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{ width: '24px', height: '2px', background: '#0FB9B1', borderRadius: '2px' }} />
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.63rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: '#0FB9B1' }}>What They Say</span>
              <div style={{ width: '24px', height: '2px', background: '#0FB9B1', borderRadius: '2px' }} />
            </div>
            <h2 style={{ fontFamily: 'var(--font-ui)', fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 800, color: '#032655', letterSpacing: '-0.03em', lineHeight: 1.1, margin: 0 }}>
              Hiring teams speak for themselves.
            </h2>
          </div>

          <div className="cust-quotes" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
            {QUOTES.map((q, i) => (
              <div key={i} style={{ background: '#fff', border: '1px solid #DCE8F4', borderRadius: '20px', padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', boxShadow: '0 4px 20px rgba(3,38,85,0.05)', position: 'relative', overflow: 'hidden' }}>
                {/* Top accent */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: `linear-gradient(90deg, ${q.color}, transparent)`, borderRadius: '20px 20px 0 0' }} />

                {/* Quote mark */}
                <div style={{ fontFamily: 'Georgia, serif', fontSize: '3rem', color: q.color, opacity: 0.18, lineHeight: 1, marginBottom: '-0.5rem' }}>"</div>

                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.85rem', color: '#3D5A7A', lineHeight: 1.75, margin: 0, flex: 1 }}>{q.quote}</p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', paddingTop: '1rem', borderTop: '1px solid #EEF3F8' }}>
                  <div>
                    <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', fontWeight: 700, color: '#032655', margin: '0 0 2px' }}>{q.name}</p>
                    <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', color: '#96AFCA', margin: 0 }}>{q.at}</p>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <p style={{ fontFamily: 'var(--font-ui)', fontSize: '1.1rem', fontWeight: 800, color: q.color, margin: 0, lineHeight: 1 }}>{q.stat}</p>
                    <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.6rem', color: '#96AFCA', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase' as const, marginTop: '2px' }}>{q.statLabel}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM TRUST STRIP ─────────────────────────────────────────── */}
      <section style={{ padding: '3rem 0', background: '#032655', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px)', backgroundSize: '28px 28px', pointerEvents: 'none' }} />
        <div aria-hidden style={{ position: 'absolute', right: '-60px', top: '-60px', width: '220px', height: '220px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(15,185,177,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div className="cust-inner cust-strip" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2.5rem', position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', background: 'rgba(255,255,255,0.06)', borderRadius: '16px', overflow: 'hidden' }}>
          {[
            { v: '200+',    l: 'Companies Hiring',   c: '#0FB9B1' },
            { v: '< 48h',   l: 'First Submission',   c: '#fff'    },
            { v: '₹0',      l: 'Upfront Cost',       c: '#0FB9B1' },
            { v: '30+',     l: 'Industry Domains',   c: '#fff'    },
          ].map((s, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.02)', padding: '1.75rem 1rem', textAlign: 'center' }}>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', fontWeight: 800, color: s.c, letterSpacing: '-0.03em', lineHeight: 1, margin: '0 0 4px' }}>{s.v}</p>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.09em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.38)', margin: 0 }}>{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .cust-grid   { grid-template-columns: 1fr 1fr !important; }
          .cust-quotes { grid-template-columns: 1fr !important; }
          .cust-strip  { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 560px) {
          .cust-grid  { grid-template-columns: 1fr !important; }
          .cust-strip { grid-template-columns: 1fr 1fr !important; }
          .cust-tabs  { flex-wrap: wrap !important; justify-content: flex-start !important; width: 100% !important; }
        }
        @media (max-width: 480px) {
          .cust-hero   { padding: 3.5rem 0 3rem !important; }
          .cust-inner  { padding: 0 1.25rem !important; }
          .cust-hero-stats { flex-direction: column !important; }
        }
      `}</style>
    </main>
  )
}
