'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'

/* ─── Types ───────────────────────────────────────────────────────────────────*/
type NavLink = {
  label: string
  href: string
}

type DropdownItem = {
  label: string
  sub: string
  href: string
  icon: React.ReactNode
}

/* ─── Constants ───────────────────────────────────────────────────────────────*/
const NAV_LINKS: NavLink[] = [
  { label: 'Home',      href: '/'          },
  { label: 'Customers', href: '/customers' },
  { label: 'Careers',   href: '/careers'   },
  { label: 'About Us',  href: '/about'     },
]

const INSTRUCTION_ITEMS: DropdownItem[] = [
  {
    label: 'For Employers',
    sub:   'Post jobs & manage your hiring pipeline',
    href:  '/instructions/employers',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M2.25 21h19.5m-18-18h16.5a1.5 1.5 0 011.5 1.5v11.25a1.5 1.5 0 01-1.5 1.5H3.75a1.5 1.5 0 01-1.5-1.5V4.5a1.5 1.5 0 011.5-1.5z" />
      </svg>
    ),
  },
  {
    label: 'For Freelance Recruiters',
    sub:   'Submit candidates & grow your earnings',
    href:  '/instructions/recruiters',
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
  },
]

/* ─── Navbar ──────────────────────────────────────────────────────────────────*/
export default function Navbar() {
  const [scrolled,    setScrolled]    = useState(false)
  const [mobileOpen,  setMobileOpen]  = useState(false)
  const [instrOpen,   setInstrOpen]   = useState(false)
  const [mobileInstr, setMobileInstr] = useState(false)

  const instrRef      = useRef<HTMLDivElement>(null)
  const dropdownTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  /* ── Scroll shadow ────────────────────────────────────────────────────────*/
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* ── Close dropdown on outside click ─────────────────────────────────────*/
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (instrRef.current && !instrRef.current.contains(e.target as Node)) {
        setInstrOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  /* ── Close mobile menu on resize ─────────────────────────────────────────*/
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileOpen(false)
        setMobileInstr(false)
      }
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  /* ── Lock body scroll when mobile menu open ───────────────────────────────*/
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  /* ── Dropdown hover with small delay (prevents flicker) ──────────────────*/
  const openDropdown = useCallback(() => {
    if (dropdownTimer.current) clearTimeout(dropdownTimer.current)
    setInstrOpen(true)
  }, [])

  const closeDropdown = useCallback(() => {
    dropdownTimer.current = setTimeout(() => setInstrOpen(false), 130)
  }, [])

  /* ── Cleanup timer on unmount ─────────────────────────────────────────────*/
  useEffect(() => {
    return () => {
      if (dropdownTimer.current) clearTimeout(dropdownTimer.current)
    }
  }, [])

  /* ── Shared nav-link text style ───────────────────────────────────────────*/
  const linkStyle = (active = false): React.CSSProperties => ({
    fontFamily: 'var(--font-ui)',
    fontSize: '0.8125rem',
    fontWeight: 600,
    letterSpacing: '0.025em',
    color: active ? '#032655' : '#5A7A9F',
    textDecoration: 'none',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    transition: 'color 0.15s ease',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
  })

  return (
    <>
      {/* ─── Header ──────────────────────────────────────────────────────── */}
      <header
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          zIndex: 1000,
          background: '#FFFFFF',
          transition: 'box-shadow 0.3s ease',
          boxShadow: scrolled
            ? '0 1px 0 rgba(3,38,85,0.07), 0 4px 20px rgba(3,38,85,0.07)'
            : '0 1px 0 #EEF3F8',
        }}
      >
        {/* Teal top accent line — always visible, subtle */}
        <div
          style={{
            height: '2.5px',
            background: 'linear-gradient(90deg, #032655 0%, #0FB9B1 40%, #15C7C0 60%, #032655 100%)',
          }}
          aria-hidden="true"
        />

        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2.5rem' }}>
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: '68px',
            }}
            aria-label="Main navigation"
          >

            {/* ── Logo ─────────────────────────────────────────────────── */}
            <Link
              href="/"
              style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', flexShrink: 0 }}
              aria-label="AlphaNom — Home"
            >
              {/* Teal dot */}
              <span
                aria-hidden="true"
                style={{
                  display: 'inline-block',
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: '#0FB9B1',
                  marginRight: '7px',
                  flexShrink: 0,
                }}
              />
              {/* Alpha — Fraunces italic */}
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontStyle: 'italic',
                  fontWeight: 400,
                  fontSize: '1.7rem',
                  lineHeight: 1,
                  color: '#032655',
                  letterSpacing: '-0.02em',
                }}
              >
                Alpha
              </span>
              {/* Nom — Plus Jakarta Sans heavy */}
              <span
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontWeight: 800,
                  fontSize: '1.05rem',
                  lineHeight: 1,
                  color: '#032655',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase' as const,
                  alignSelf: 'flex-end',
                  paddingBottom: '2px',
                  marginLeft: '1px',
                }}
              >
                Nom
              </span>
              {/* .in badge */}
              <span
                className="hidden sm:inline-flex"
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.52rem',
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

            {/* ── Desktop Nav ───────────────────────────────────────────── */}
            <div
              className="hidden lg:flex"
              style={{ alignItems: 'center' }}
            >
              {NAV_LINKS.map((link, i) => (
                <div key={link.href} style={{ display: 'flex', alignItems: 'center' }}>
                  {i > 0 && <Dot />}
                  <NavLinkItem href={link.href} label={link.label} />
                </div>
              ))}

              <Dot />

              {/* ── Instructions dropdown ─────────────────────────────── */}
              <div
                ref={instrRef}
                style={{ position: 'relative' }}
                onMouseEnter={openDropdown}
                onMouseLeave={closeDropdown}
              >
                <button
                  onClick={() => setInstrOpen(v => !v)}
                  aria-haspopup="true"
                  aria-expanded={instrOpen}
                  style={linkStyle(instrOpen)}
                >
                  Instructions
                  <svg
                    aria-hidden="true"
                    style={{
                      width: '11px',
                      height: '11px',
                      color: '#0FB9B1',
                      transition: 'transform 0.22s ease',
                      transform: instrOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      flexShrink: 0,
                    }}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown panel */}
                <div
                  role="menu"
                  aria-label="Instructions options"
                  onMouseEnter={openDropdown}
                  onMouseLeave={closeDropdown}
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 14px)',
                    left: '50%',
                    transform: `translateX(-50%) scaleY(${instrOpen ? 1 : 0.94})`,
                    opacity: instrOpen ? 1 : 0,
                    pointerEvents: instrOpen ? 'auto' : 'none',
                    transformOrigin: 'top center',
                    transition: 'opacity 0.18s ease, transform 0.18s ease',
                    background: '#FFFFFF',
                    border: '1px solid #D0DBE8',
                    borderRadius: '10px',
                    boxShadow: '0 12px 36px rgba(3,38,85,0.13), 0 2px 8px rgba(3,38,85,0.06)',
                    minWidth: '295px',
                    overflow: 'hidden',
                    zIndex: 200,
                  }}
                >
                  {/* Teal top stripe */}
                  <div
                    aria-hidden="true"
                    style={{
                      height: '3px',
                      background: 'linear-gradient(90deg, #032655 0%, #0FB9B1 50%, #15C7C0 100%)',
                    }}
                  />

                  {/* Up-arrow pointer */}
                  <div
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      top: '3px',
                      left: '50%',
                      transform: 'translateX(-50%) translateY(-6px) rotate(45deg)',
                      width: '11px',
                      height: '11px',
                      background: '#0FB9B1',
                      borderRadius: '2px 0 0 0',
                    }}
                  />

                  <div style={{ padding: '8px 0' }}>
                    {INSTRUCTION_ITEMS.map((item, idx) => (
                      <div key={item.href}>
                        {idx > 0 && (
                          <div
                            aria-hidden="true"
                            style={{ height: '1px', background: '#EEF3F8', margin: '0 16px' }}
                          />
                        )}
                        <DropdownLink item={item} onSelect={() => setInstrOpen(false)} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Login / Sign Up CTA ───────────────────────────────────── */}
            <div className="hidden lg:flex" style={{ alignItems: 'center', flexShrink: 0 }}>
              <LoginSignupButton />
            </div>

            {/* ── Mobile Hamburger ──────────────────────────────────────── */}
            <button
              className="lg:hidden"
              onClick={() => setMobileOpen(v => !v)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '6px',
                display: 'flex',
                flexDirection: 'column',
                gap: '5px',
                justifyContent: 'center',
              }}
            >
              <span style={{
                display: 'block', height: '1.5px', width: '22px',
                background: '#032655', borderRadius: '2px',
                transition: 'transform 0.28s ease',
                transform: mobileOpen ? 'rotate(45deg) translateY(6.5px)' : 'none',
              }} />
              <span style={{
                display: 'block', height: '1.5px', width: '14px',
                background: '#0FB9B1', borderRadius: '2px',
                transition: 'opacity 0.22s ease, transform 0.22s ease',
                opacity: mobileOpen ? 0 : 1,
                transform: mobileOpen ? 'scaleX(0)' : 'scaleX(1)',
              }} />
              <span style={{
                display: 'block', height: '1.5px', width: '22px',
                background: '#032655', borderRadius: '2px',
                transition: 'transform 0.28s ease',
                transform: mobileOpen ? 'rotate(-45deg) translateY(-6.5px)' : 'none',
              }} />
            </button>
          </nav>
        </div>

        {/* ─── Mobile Menu ───────────────────────────────────────────────── */}
        <div
          className="lg:hidden"
          aria-hidden={!mobileOpen}
          style={{
            background: '#FFFFFF',
            borderTop: '1px solid #EEF3F8',
            overflow: 'hidden',
            maxHeight: mobileOpen ? '560px' : '0',
            opacity: mobileOpen ? 1 : 0,
            transition: 'max-height 0.38s cubic-bezier(0.4,0,0.2,1), opacity 0.28s ease',
          }}
        >
          {/* Teal gradient line at top of drawer */}
          <div
            aria-hidden="true"
            style={{
              height: '2px',
              background: 'linear-gradient(90deg, #0FB9B1 0%, #15C7C0 50%, transparent 100%)',
            }}
          />

          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1.25rem 2.5rem 1.75rem' }}>

            {/* Nav links */}
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  letterSpacing: '0.025em',
                  color: '#5A7A9F',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 0',
                  borderBottom: '1px solid #EEF3F8',
                }}
              >
                {link.label}
                <svg aria-hidden="true" style={{ width: '13px', height: '13px', color: '#C8D8E8' }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}

            {/* Instructions accordion */}
            <div>
              <button
                onClick={() => setMobileInstr(v => !v)}
                aria-expanded={mobileInstr}
                style={{
                  width: '100%',
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  letterSpacing: '0.025em',
                  color: mobileInstr ? '#032655' : '#5A7A9F',
                  background: 'none',
                  border: 'none',
                  borderBottom: '1px solid #EEF3F8',
                  padding: '0.75rem 0',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'color 0.15s ease',
                }}
              >
                Instructions
                <svg
                  aria-hidden="true"
                  style={{
                    width: '13px', height: '13px',
                    color: '#0FB9B1',
                    transition: 'transform 0.25s ease',
                    transform: mobileInstr ? 'rotate(90deg)' : 'rotate(0deg)',
                  }}
                  fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Accordion sub-links */}
              <div
                style={{
                  overflow: 'hidden',
                  maxHeight: mobileInstr ? '160px' : '0',
                  transition: 'max-height 0.3s ease',
                }}
              >
                <div style={{
                  paddingLeft: '1rem',
                  borderLeft: '2px solid #0FB9B1',
                  margin: '0.5rem 0 0.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                }}>
                  {INSTRUCTION_ITEMS.map(item => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => { setMobileOpen(false); setMobileInstr(false) }}
                      style={{
                        fontFamily: 'var(--font-ui)',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        color: '#5A7A9F',
                        textDecoration: 'none',
                        padding: '0.55rem 0',
                        display: 'block',
                        transition: 'color 0.15s ease',
                      }}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Login / Sign Up — split buttons on mobile */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginTop: '1.25rem' }}>
              <Link
                href="/employer/login"
                onClick={() => setMobileOpen(false)}
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  letterSpacing: '0.03em',
                  color: '#032655',
                  background: 'transparent',
                  border: '1.5px solid #D0DBE8',
                  borderRadius: '8px',
                  padding: '0.75rem',
                  textDecoration: 'none',
                  textAlign: 'center',
                  display: 'block',
                  transition: 'border-color 0.2s ease',
                }}
              >
                Log In
              </Link>
              <Link
                href="/employer/signup"
                onClick={() => setMobileOpen(false)}
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  letterSpacing: '0.03em',
                  color: '#FFFFFF',
                  background: '#032655',
                  border: '1.5px solid #032655',
                  borderRadius: '8px',
                  padding: '0.75rem',
                  textDecoration: 'none',
                  textAlign: 'center',
                  display: 'block',
                }}
              >
                Sign Up Free
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer so page content isn't hidden under fixed nav */}
      <div style={{ height: '71px' }} aria-hidden="true" />
    </>
  )
}

/* ─── Sub-components ──────────────────────────────────────────────────────────*/

/** Small bullet separator between nav items */
function Dot() {
  return (
    <span
      aria-hidden="true"
      style={{ color: '#C4D4E2', fontSize: '5px', margin: '0 1.2rem', flexShrink: 0 }}
    >
      ●
    </span>
  )
}

/** Desktop nav link — teal underline slides in on hover */
function NavLinkItem({ href, label }: { href: string; label: string }) {
  const [hovered, setHovered] = useState(false)

  return (
    <Link
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        fontFamily: 'var(--font-ui)',
        fontSize: '0.8125rem',
        fontWeight: 600,
        letterSpacing: '0.025em',
        color: hovered ? '#032655' : '#5A7A9F',
        textDecoration: 'none',
        padding: '4px 0',
        transition: 'color 0.15s ease',
      }}
    >
      {label}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: '-1px',
          left: 0,
          height: '1.5px',
          width: hovered ? '100%' : '0%',
          background: '#0FB9B1',
          borderRadius: '2px',
          transition: 'width 0.2s ease',
        }}
      />
    </Link>
  )
}

/** Desktop dropdown item row */
function DropdownLink({
  item,
  onSelect,
}: {
  item: DropdownItem
  onSelect: () => void
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <Link
      href={item.href}
      role="menuitem"
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '13px',
        padding: '13px 18px',
        textDecoration: 'none',
        background: hovered ? '#F4F8FC' : 'transparent',
        transition: 'background 0.15s ease',
      }}
    >
      {/* Icon container */}
      <div
        style={{
          width: '38px',
          height: '38px',
          borderRadius: '8px',
          background: hovered ? '#D8F0EB' : '#EEF3F8',
          border: `1px solid ${hovered ? '#0FB9B1' : '#D0DBE8'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          color: hovered ? '#0A9E97' : '#5A7A9F',
          transition: 'background 0.15s ease, border-color 0.15s ease, color 0.15s ease',
        }}
      >
        {item.icon}
      </div>

      {/* Label + sub */}
      <div style={{ flex: 1 }}>
        <p style={{
          fontFamily: 'var(--font-ui)',
          fontSize: '0.8125rem',
          fontWeight: 700,
          color: hovered ? '#032655' : '#1C2E4A',
          marginBottom: '3px',
          transition: 'color 0.15s ease',
        }}>
          {item.label}
        </p>
        <p style={{
          fontFamily: 'var(--font-ui)',
          fontSize: '0.75rem',
          fontWeight: 400,
          color: '#5A7A9F',
          lineHeight: 1.45,
        }}>
          {item.sub}
        </p>
      </div>

      {/* Arrow nudge */}
      <svg
        aria-hidden="true"
        style={{
          width: '13px', height: '13px',
          color: hovered ? '#0FB9B1' : 'transparent',
          alignSelf: 'center',
          flexShrink: 0,
          marginLeft: 'auto',
          transition: 'color 0.15s ease, transform 0.15s ease',
          transform: hovered ? 'translateX(2px)' : 'translateX(0)',
        }}
        fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  )
}

/**
 * Login / Sign Up — pill-style split button.
 * "Log In"   → navy outline (left)
 * "Sign Up"  → teal filled  (right)
 * They sit flush with a shared border-radius group.
 */
function LoginSignupButton() {
  const [loginHover,  setLoginHover]  = useState(false)
  const [signupHover, setSignupHover] = useState(false)

  const sharedBase: React.CSSProperties = {
    fontFamily: 'var(--font-ui)',
    fontSize: '0.8rem',
    fontWeight: 600,
    letterSpacing: '0.03em',
    padding: '0.6rem 1.2rem',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    border: 'none',
    outline: 'none',
    transition: 'background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease',
  }

  return (
    <div
      style={{
        display: 'inline-flex',
        border: '1.5px solid #032655',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: loginHover || signupHover
          ? '0 4px 16px rgba(3,38,85,0.15)'
          : '0 1px 4px rgba(3,38,85,0.08)',
        transition: 'box-shadow 0.2s ease',
      }}
    >
      {/* Log In */}
      <Link
        href="/employer/login"
        onMouseEnter={() => setLoginHover(true)}
        onMouseLeave={() => setLoginHover(false)}
        style={{
          ...sharedBase,
          background: loginHover ? '#F0F5FB' : '#FFFFFF',
          color: '#032655',
          borderRight: '1px solid #D0DBE8',
        }}
      >
        Log In
      </Link>

      {/* Sign Up */}
      <Link
        href="/employer/signup"
        onMouseEnter={() => setSignupHover(true)}
        onMouseLeave={() => setSignupHover(false)}
        style={{
          ...sharedBase,
          background: signupHover ? '#15C7C0' : '#0FB9B1',
          color: '#FFFFFF',
          gap: '5px',
        }}
      >
        Sign Up
        {/* Small arrow icon */}
        <svg
          aria-hidden="true"
          style={{
            width: '12px', height: '12px',
            transition: 'transform 0.18s ease',
            transform: signupHover ? 'translateX(2px)' : 'translateX(0)',
          }}
          fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  )
}