'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import LogoutButton from './LogoutButton'

type Props = {
  children: React.ReactNode
  companyName: string
  isProfileComplete: boolean
}

const PAGE_TITLES: Record<string, string> = {
  '/employer/dashboard': 'Overview',
  '/employer/dashboard/jobs': 'All Jobs',
  '/employer/dashboard/jobs/post': 'Post a Job',
  '/employer/dashboard/settings': 'Settings',
  '/employer/dashboard/profile': 'My Profile',
}

function initials(name: string) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export default function DashboardShell({
  children,
  companyName,
  isProfileComplete,
}: Props) {
  const pathname = usePathname()
  const pageTitle = PAGE_TITLES[pathname] ?? 'Dashboard'

  const NAV = [
    {
      label: 'Overview',
      href: '/employer/dashboard',
      exact: true,
      icon: (
        <svg fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" style={{ width: '15px', height: '15px', flexShrink: 0 }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
        </svg>
      ),
    },
    {
      label: 'Jobs',
      href: '/employer/dashboard/jobs',
      exact: true,
      icon: (
        <svg fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" style={{ width: '15px', height: '15px', flexShrink: 0 }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
        </svg>
      ),
    },
    {
      label: 'Post Job',
      href: '/employer/dashboard/jobs/post',
      exact: true,
      locked: !isProfileComplete,
      icon: (
        <svg fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" style={{ width: '15px', height: '15px', flexShrink: 0 }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      ),
    },
    {
      label: 'Settings',
      href: '/employer/dashboard/settings',
      exact: true,
      icon: (
        <svg fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" style={{ width: '15px', height: '15px', flexShrink: 0 }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F5F8FC' }}>

      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <aside style={{
        width: '240px',
        background: '#032655',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        height: '100vh',
      }}>
        <div style={{ height: '3px', background: 'linear-gradient(90deg, #032655 0%, #0FB9B1 100%)', flexShrink: 0 }} />

        {/* Brand */}
        <div style={{ padding: '1.25rem 1.25rem 0.875rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '8px',
              background: 'linear-gradient(135deg, #0FB9B1 0%, #0A9E97 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 800, fontSize: '0.68rem', color: '#fff' }}>AN</span>
            </div>
            <div>
              <p style={{ fontFamily: 'var(--font-ui)', fontWeight: 800, fontSize: '0.95rem', color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.2 }}>AlphaNom</p>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.5rem', color: 'rgba(255,255,255,0.38)', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: '1px' }}>Employer Portal</p>
            </div>
          </div>
        </div>

        <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', margin: '0 1.25rem 0.75rem' }} />

        <p style={{
          fontFamily: 'var(--font-ui)', fontSize: '0.48rem', fontWeight: 700,
          letterSpacing: '0.16em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.28)', padding: '0 1.25rem', marginBottom: '5px',
        }}>
          Navigation
        </p>

        {/* Nav */}
        <nav style={{ padding: '0 0.625rem', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {NAV.map((item) => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '9px',
                  padding: '9px 10px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.875rem',
                  fontWeight: active ? 700 : 500,
                  color: active ? '#fff' : item.locked ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.5)',
                  background: active ? 'rgba(15,185,177,0.15)' : 'transparent',
                  borderLeft: active ? '2.5px solid #0FB9B1' : '2.5px solid transparent',
                }}
              >
                {item.icon}
                {item.label}
                {item.locked && (
                  <svg fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth={2} viewBox="0 0 24 24" style={{ width: '11px', height: '11px', marginLeft: 'auto', flexShrink: 0 }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                )}
                {!item.locked && active && (
                  <div style={{ marginLeft: 'auto', width: '5px', height: '5px', borderRadius: '50%', background: '#0FB9B1', flexShrink: 0 }} />
                )}
              </Link>
            )
          })}
        </nav>

        <div style={{ flex: 1 }} />

        {/* Profile incomplete nudge */}
        {!isProfileComplete && (
          <div style={{ margin: '0 0.625rem 0.75rem' }}>
            <Link href="/employer/dashboard/profile" style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 12px', borderRadius: '8px',
              background: 'rgba(15,185,177,0.1)', border: '1px solid rgba(15,185,177,0.2)',
              textDecoration: 'none',
            }}>
              <div style={{
                width: '6px', height: '6px', borderRadius: '50%',
                background: '#0FB9B1', flexShrink: 0,
                boxShadow: '0 0 0 3px rgba(15,185,177,0.2)',
              }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 700, color: '#0FB9B1', lineHeight: 1.2 }}>Complete Profile</p>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', marginTop: '1px' }}>Unlock job posting</p>
              </div>
              <svg fill="none" stroke="#0FB9B1" strokeWidth={2} viewBox="0 0 24 24" style={{ width: '12px', height: '12px', flexShrink: 0 }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        )}

        {/* Logout */}
        <div style={{ padding: '0 0.625rem 1.5rem' }}>
          <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', margin: '0 0.625rem 0.75rem' }} />
          <LogoutButton />
        </div>
      </aside>

      {/* ── Right panel ─────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* Header */}
        <header style={{
          height: '60px',
          background: '#fff',
          borderBottom: '1px solid #D0DBE8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1.75rem',
          flexShrink: 0,
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}>
          <div>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.5rem', fontWeight: 600, letterSpacing: '0.13em', textTransform: 'uppercase', color: '#96AFCA', marginBottom: '1px' }}>
              Employer Dashboard
            </p>
            <h1 style={{ fontFamily: 'var(--font-ui)', fontSize: '1rem', fontWeight: 800, color: '#032655', letterSpacing: '-0.02em', lineHeight: 1 }}>
              {pageTitle}
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Notification bell */}
            <button style={{
              width: '36px', height: '36px', borderRadius: '8px',
              background: '#EEF3F8', border: '1px solid #D0DBE8',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}>
              <svg fill="none" stroke="#5A7A9F" strokeWidth={1.8} viewBox="0 0 24 24" style={{ width: '15px', height: '15px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
            </button>

            {/* Profile chip — links to profile page */}
            <Link href="/employer/dashboard/profile" style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: '#EEF3F8', border: '1px solid #D0DBE8',
              borderRadius: '9px', padding: '4px 10px 4px 4px',
              textDecoration: 'none', cursor: 'pointer', position: 'relative',
            }}>
              {/* Avatar */}
              <div style={{
                width: '28px', height: '28px', borderRadius: '7px',
                background: 'linear-gradient(135deg, #032655 0%, #0FB9B1 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 800, fontSize: '0.55rem', color: '#fff' }}>
                  {companyName ? initials(companyName) : 'EM'}
                </span>
              </div>
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', fontWeight: 600, color: '#032655', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {companyName || 'My Account'}
              </span>

              {/* Incomplete dot */}
              {!isProfileComplete && (
                <div style={{
                  position: 'absolute', top: '-3px', right: '-3px',
                  width: '9px', height: '9px', borderRadius: '50%',
                  background: '#F5A623', border: '2px solid #fff',
                }} />
              )}
            </Link>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, padding: '1.75rem', overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
