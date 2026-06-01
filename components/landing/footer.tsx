'use client'

import { useState } from 'react'
import Link from 'next/link'

/* ─── Types ───────────────────────────────────────────────────────────────────*/
type FooterLink = { label: string; href: string }
type FooterColumn = { heading: string; links: FooterLink[] }

/* ─── Data ────────────────────────────────────────────────────────────────────*/
const FOOTER_COLUMNS: FooterColumn[] = [
  {
    heading: 'Platform',
    links: [
      { label: 'How It Works',       href: '/how-it-works'          },
      { label: 'For Employers',       href: '/instructions/employers' },
      { label: 'For Freelance Recruiters', href: '/instructions/recruiters' },
      { label: 'Pricing',             href: '/pricing'               },
      { label: 'Customers',           href: '/customers'             },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About Us',   href: '/about'   },
      { label: 'Careers',    href: '/careers' },
      { label: 'Blog',       href: '/blog'    },
      { label: 'Press',      href: '/press'   },
      { label: 'Contact',    href: '/contact' },
    ],
  },
  {
    heading: 'Support',
    links: [
      { label: 'Help Centre',        href: '/help'           },
      { label: 'FAQs',               href: '/faqs'           },
      { label: 'Recruiter Helpdesk', href: '/helpdesk'       },
      { label: 'Employer Support',   href: '/employer-support'},
      { label: 'Report an Issue',    href: '/report'         },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy Policy',    href: '/privacy'  },
      { label: 'Terms of Service',  href: '/terms'    },
      { label: 'Cookie Policy',     href: '/cookies'  },
      { label: 'Refund Policy',     href: '/refunds'  },
    ],
  },
]

type SocialLink = { label: string; href: string; icon: React.ReactNode }

const SOCIAL_LINKS: SocialLink[] = [
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com',
    icon: (
      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: 'Twitter / X',
    href: 'https://twitter.com',
    icon: (
      <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.763l7.726-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com',
    icon: (
      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
]

/* ─── Component ───────────────────────────────────────────────────────────────*/
export default function Footer() {
  return (
    <footer
      style={{
        background: '#021A3B',     /* --color-navy-deep */
        color: '#F5F5F5',
        fontFamily: 'var(--font-ui)',
        position: 'relative',
        overflow: 'hidden',
      }}
      aria-label="Site footer"
    >
      {/* ── Teal top border ────────────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        style={{
          height: '2.5px',
          background: 'linear-gradient(90deg, #032655 0%, #0FB9B1 35%, #15C7C0 65%, #032655 100%)',
        }}
      />

      {/* ── Subtle grid texture overlay ────────────────────────────────────── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'radial-gradient(circle at 18% 30%, rgba(15,185,177,0.06) 0%, transparent 55%), ' +
            'radial-gradient(circle at 82% 70%, rgba(15,199,192,0.05) 0%, transparent 50%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2.5rem', position: 'relative' }}>

        {/* ── Main grid ──────────────────────────────────────────────────────── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.6fr repeat(4, 1fr)',
            gap: '3rem',
            padding: '4rem 0 3rem',
          }}
          className="footer-grid"
        >

          {/* ── Brand column ─────────────────────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* Logo */}
            <Link
              href="/"
              style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
              aria-label="AlphaNom — Home"
            >
              <span
                aria-hidden="true"
                style={{
                  display: 'inline-block',
                  width: '7px', height: '7px',
                  borderRadius: '50%',
                  background: '#0FB9B1',
                  marginRight: '7px',
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontStyle: 'italic',
                  fontWeight: 400,
                  fontSize: '1.65rem',
                  lineHeight: 1,
                  color: '#F5F5F5',
                  letterSpacing: '-0.02em',
                }}
              >
                Alpha
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontWeight: 800,
                  fontSize: '1rem',
                  lineHeight: 1,
                  color: '#F5F5F5',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase' as const,
                  alignSelf: 'flex-end',
                  paddingBottom: '2px',
                  marginLeft: '1px',
                }}
              >
                Nom
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.5rem',
                  fontWeight: 700,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase' as const,
                  color: '#0FB9B1',
                  border: '1.5px solid #0FB9B1',
                  borderRadius: '3px',
                  padding: '3px 5px',
                  marginLeft: '7px',
                  alignSelf: 'center',
                  lineHeight: 1.3,
                }}
              >
                .in
              </span>
            </Link>

            {/* Tagline */}
            <p
              style={{
                fontSize: '0.875rem',
                fontWeight: 400,
                color: 'rgba(245,245,245,0.55)',
                lineHeight: 1.7,
                maxWidth: '240px',
              }}
            >
              Connecting ambitious companies with India's best freelance recruitment talent.
            </p>

            {/* Social row */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '0.25rem' }}>
              {SOCIAL_LINKS.map(s => (
                <SocialButton key={s.label} link={s} />
              ))}
            </div>

            {/* Contact snippet */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '0.25rem' }}>
              <a
                href="mailto:hello@alphanom.in"
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  color: 'rgba(245,245,245,0.45)',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '7px',
                  transition: 'color 0.15s ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#0FB9B1')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245,245,245,0.45)')}
              >
                <svg aria-hidden="true" style={{ width: '13px', height: '13px', flexShrink: 0 }} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                hello@alphanom.in
              </a>
              <a
                href="tel:+919XXXXXXXXX"
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  color: 'rgba(245,245,245,0.45)',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '7px',
                  transition: 'color 0.15s ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#0FB9B1')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245,245,245,0.45)')}
              >
                <svg aria-hidden="true" style={{ width: '13px', height: '13px', flexShrink: 0 }} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                +91 9X XXXX XXXX
              </a>
            </div>
          </div>

          {/* ── Link columns ─────────────────────────────────────────────── */}
          {FOOTER_COLUMNS.map(col => (
            <FooterCol key={col.heading} col={col} />
          ))}
        </div>

        {/* ── Divider ────────────────────────────────────────────────────────── */}
        <div
          aria-hidden="true"
          style={{ height: '1px', background: 'rgba(255,255,255,0.07)' }}
        />

        {/* ── Bottom strip ───────────────────────────────────────────────────── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.5rem 0',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          {/* Copyright */}
          <p
            style={{
              fontSize: '0.775rem',
              fontWeight: 400,
              color: 'rgba(245,245,245,0.35)',
              lineHeight: 1.5,
            }}
          >
            © {new Date().getFullYear()} AlphaNom Technologies Pvt. Ltd. All rights reserved.
          </p>

          {/* Made in India badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.72rem',
              fontWeight: 600,
              letterSpacing: '0.06em',
              color: 'rgba(245,245,245,0.3)',
            }}
          >
            <span aria-hidden="true" style={{ fontSize: '0.95rem' }}>🇮🇳</span>
            Made with care in India
          </div>
        </div>
      </div>

      {/* Responsive style override — collapses to 2-col then 1-col on mobile */}
      <style>{`
        @media (max-width: 1024px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 2.5rem !important;
          }
        }
        @media (max-width: 600px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
      `}</style>
    </footer>
  )
}

/* ─── Sub-components ──────────────────────────────────────────────────────────*/

/** Single link column */
function FooterCol({ col }: { col: FooterColumn }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {/* Column heading */}
      <p
        style={{
          fontFamily: 'var(--font-ui)',
          fontSize: '0.65rem',
          fontWeight: 700,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: '#0FB9B1',
          marginBottom: '0.25rem',
        }}
      >
        {col.heading}
      </p>

      {/* Links */}
      {col.links.map(link => (
        <FooterLinkItem key={link.href} link={link} />
      ))}
    </div>
  )
}

/** Individual footer link with hover state */
function FooterLinkItem({ link }: { link: FooterLink }) {
  const [hovered, setHovered] = useState(false)

  return (
    <Link
      href={link.href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontSize: '0.8125rem',
        fontWeight: hovered ? 500 : 400,
        color: hovered ? '#F5F5F5' : 'rgba(245,245,245,0.5)',
        textDecoration: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        transition: 'color 0.15s ease, font-weight 0.1s ease',
        lineHeight: 1.5,
      }}
    >
      {/* Teal dash slides in on hover */}
      <span
        aria-hidden="true"
        style={{
          display: 'inline-block',
          width: hovered ? '10px' : '0px',
          height: '1px',
          background: '#0FB9B1',
          borderRadius: '1px',
          transition: 'width 0.18s ease',
          flexShrink: 0,
        }}
      />
      {link.label}
    </Link>
  )
}

/** Social icon button */
function SocialButton({ link }: { link: SocialLink }) {
  const [hovered, setHovered] = useState(false)

  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={link.label}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '34px',
        height: '34px',
        borderRadius: '7px',
        border: `1px solid ${hovered ? '#0FB9B1' : 'rgba(255,255,255,0.12)'}`,
        background: hovered ? 'rgba(15,185,177,0.15)' : 'rgba(255,255,255,0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: hovered ? '#0FB9B1' : 'rgba(245,245,245,0.45)',
        transition: 'border-color 0.18s ease, background 0.18s ease, color 0.18s ease, transform 0.18s ease',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        flexShrink: 0,
      }}
    >
      {link.icon}
    </a>
  )
}