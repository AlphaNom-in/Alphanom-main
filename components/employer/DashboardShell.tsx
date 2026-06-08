'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import LogoutButton from './LogoutButton'
import NotificationPanel from '@/components/recruiter/NotificationPanel'
import { createClient } from '@/lib/supabase/client'

type Props = {
  children: React.ReactNode
  companyName: string
  logoUrl?: string | null
  isProfileComplete: boolean
  initialUnreadCount?: number
}

const PAGE_TITLES: Record<string, string> = {
  '/employer/dashboard': 'Overview',
  '/employer/dashboard/jobs': 'All Jobs',
  '/employer/dashboard/jobs/post': 'Post a Job',
  '/employer/dashboard/candidates': 'All Candidates',
  '/employer/dashboard/settings': 'Settings',
  '/employer/dashboard/profile': 'My Profile',
}

function initials(name: string) {
  return name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
}

const NAV = [
  {
    label: 'Overview', href: '/employer/dashboard', exact: true,
    icon: <svg fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" style={{ width: '16px', height: '16px', flexShrink: 0 }}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>,
  },
  {
    label: 'All Jobs', href: '/employer/dashboard/jobs', exact: true,
    icon: <svg fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" style={{ width: '16px', height: '16px', flexShrink: 0 }}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>,
  },
  {
    label: 'Post Job', href: '/employer/dashboard/jobs/post', exact: true, locked: false,
    icon: <svg fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" style={{ width: '16px', height: '16px', flexShrink: 0 }}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>,
  },
  {
    label: 'Candidates', href: '/employer/dashboard/candidates', exact: false,
    icon: <svg fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" style={{ width: '16px', height: '16px', flexShrink: 0 }}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>,
  },
  {
    label: 'Settings', href: '/employer/dashboard/settings', exact: true,
    icon: <svg fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" style={{ width: '16px', height: '16px', flexShrink: 0 }}><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  },
]

export default function DashboardShell({ children, companyName, logoUrl, isProfileComplete, initialUnreadCount = 0 }: Props) {
  const pathname    = usePathname()
  const router      = useRouter()
  const pageTitle   = PAGE_TITLES[pathname] ?? 'Dashboard'
  const [isNotifOpen, setIsNotifOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(initialUnreadCount)

  // Close panel on navigation
  useEffect(() => { setIsNotifOpen(false) }, [pathname])

  useEffect(() => {
    function onVisibilityChange() {
      if (document.visibilityState === 'visible') router.refresh()
    }
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => document.removeEventListener('visibilitychange', onVisibilityChange)
  }, [router])

  // Supabase Realtime — increment badge when a new notification arrives
  useEffect(() => {
    const supabase = createClient()
    let channel: ReturnType<typeof supabase.channel> | null = null
    let cancelled = false

    ;(async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (cancelled || !user) return

      channel = supabase
        .channel(`employer-notifs:${user.id}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        }, () => {
          setUnreadCount(c => c + 1)
        })
        .subscribe()
    })()

    return () => {
      cancelled = true
      if (channel) supabase.removeChannel(channel)
    }
  }, [])

  // Refetch accurate count when panel closes
  function handlePanelClose() {
    setIsNotifOpen(false)
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      supabase
        .from('notifications')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_read', false)
        .then(({ count }) => setUnreadCount(count ?? 0))
    })
  }

  const navItems = NAV.map(item => ({
    ...item,
    locked: item.label === 'Post Job' ? !isProfileComplete : false,
  }))

  return (
    <>
      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#F5F8FC' }}>

        {/* ── Sidebar ─────────────────────────────────────────────────────── */}
        <aside style={{
          width: '240px', flexShrink: 0, height: '100vh',
          background: '#032655',
          display: 'flex', flexDirection: 'column',
        }}>
          {/* Teal top accent */}
          <div style={{ height: '3px', background: 'linear-gradient(90deg, #0FB9B1 0%, rgba(15,185,177,0.3) 100%)', flexShrink: 0 }} />

          {/* Brand */}
          <div style={{ padding: '1.25rem 1.25rem 1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '34px', height: '34px', borderRadius: '9px', flexShrink: 0,
                background: 'linear-gradient(135deg, #0FB9B1 0%, #0A9E97 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 3px 12px rgba(15,185,177,0.4)',
              }}>
                <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 900, fontSize: '0.7rem', color: '#fff', letterSpacing: '0.04em' }}>AN</span>
              </div>
              <div>
                <p style={{ fontFamily: 'var(--font-ui)', fontWeight: 800, fontSize: '0.95rem', color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.2 }}>AlphaNom</p>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.48rem', color: 'rgba(255,255,255,0.35)', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase' as const, marginTop: '1px' }}>Employer Portal</p>
              </div>
            </div>
          </div>

          <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', margin: '0 1.25rem 0.875rem' }} />

          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.48rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.28)', padding: '0 1.25rem', marginBottom: '6px' }}>
            Navigation
          </p>

          {/* Nav */}
          <nav style={{ padding: '0 0.625rem', display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {navItems.map((item) => {
              const active = item.exact ? pathname === item.href : pathname.startsWith(item.href)
              return (
                <Link key={item.href} href={item.locked ? '#' : item.href} style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '9px 11px', borderRadius: '9px', textDecoration: 'none',
                  fontFamily: 'var(--font-ui)', fontSize: '0.875rem',
                  fontWeight: active ? 700 : 500,
                  color: active ? '#fff' : item.locked ? 'rgba(255,255,255,0.28)' : 'rgba(255,255,255,0.52)',
                  background: active ? 'rgba(15,185,177,0.16)' : 'transparent',
                  borderLeft: active ? '2.5px solid #0FB9B1' : '2.5px solid transparent',
                  pointerEvents: item.locked ? 'none' : 'auto',
                }}>
                  <span style={{ color: active ? '#0FB9B1' : item.locked ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.45)' }}>
                    {item.icon}
                  </span>
                  {item.label}
                  {item.locked && (
                    <svg fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth={2} viewBox="0 0 24 24" style={{ width: '11px', height: '11px', marginLeft: 'auto', flexShrink: 0 }}>
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
                padding: '10px 12px', borderRadius: '9px', textDecoration: 'none',
                background: 'rgba(15,185,177,0.1)', border: '1px solid rgba(15,185,177,0.2)',
              }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0FB9B1', flexShrink: 0, boxShadow: '0 0 0 3px rgba(15,185,177,0.2)' }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 700, color: '#0FB9B1', lineHeight: 1.2 }}>Complete Profile</p>
                  <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.6rem', color: 'rgba(255,255,255,0.38)', marginTop: '1px' }}>Unlock job posting</p>
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
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, height: '100vh', overflow: 'clip' }}>

          {/* Header */}
          <header style={{
            height: '60px', background: '#fff', borderBottom: '1px solid #D0DBE8',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 1.75rem', flexShrink: 0, zIndex: 10,
          }}>
            <div>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.5rem', fontWeight: 600, letterSpacing: '0.13em', textTransform: 'uppercase' as const, color: '#96AFCA', marginBottom: '1px' }}>
                Employer Dashboard
              </p>
              <h1 style={{ fontFamily: 'var(--font-ui)', fontSize: '1rem', fontWeight: 800, color: '#032655', letterSpacing: '-0.02em', lineHeight: 1 }}>
                {pageTitle}
              </h1>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>

              {/* ── Notification bell ───────────────────────── */}
              <button
                onClick={() => setIsNotifOpen(v => !v)}
                title="Notifications"
                style={{
                  position: 'relative' as const,
                  width: '40px', height: '40px', borderRadius: '11px',
                  background: isNotifOpen
                    ? 'linear-gradient(135deg, #032655 0%, #0a3570 100%)'
                    : 'linear-gradient(135deg, #0FB9B1 0%, #0A9E97 100%)',
                  border: 'none',
                  boxShadow: isNotifOpen
                    ? '0 3px 10px rgba(3,38,85,0.28)'
                    : '0 3px 10px rgba(15,185,177,0.38)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', flexShrink: 0,
                  transition: 'all 0.18s ease',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
                </svg>
                {unreadCount > 0 && (
                  <div style={{
                    position: 'absolute' as const, top: '-6px', right: '-6px',
                    minWidth: '19px', height: '19px',
                    background: '#E53E3E', borderRadius: '99px', border: '2.5px solid #fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px',
                    boxShadow: '0 2px 6px rgba(229,62,62,0.45)',
                  }}>
                    <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.5rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  </div>
                )}
              </button>

              <Link href="/employer/dashboard/profile" style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                background: '#EEF3F8', border: '1px solid #D0DBE8',
                borderRadius: '9px', padding: '4px 10px 4px 4px',
                textDecoration: 'none', position: 'relative' as const,
              }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '7px', overflow: 'hidden',
                  background: logoUrl ? '#fff' : 'linear-gradient(135deg, #032655 0%, #0FB9B1 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  {logoUrl ? (
                    <img src={logoUrl} alt={companyName} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  ) : (
                    <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 800, fontSize: '0.55rem', color: '#fff' }}>
                      {companyName ? initials(companyName) : 'EM'}
                    </span>
                  )}
                </div>
                <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', fontWeight: 600, color: '#032655', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>
                  {companyName || 'My Account'}
                </span>
                {!isProfileComplete && (
                  <div style={{ position: 'absolute' as const, top: '-3px', right: '-3px', width: '9px', height: '9px', borderRadius: '50%', background: '#F5A623', border: '2px solid #fff' }} />
                )}
              </Link>
            </div>
          </header>

          {/* Content */}
          <main style={{ flex: 1, padding: '1.75rem', overflowY: 'auto', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
            {children}
          </main>
        </div>
      </div>

      {/* ── Notification panel + transparent backdrop ────────────── */}
      {isNotifOpen && (
        <>
          <div
            onClick={handlePanelClose}
            style={{ position: 'fixed', inset: 0, zIndex: 99, background: 'transparent' }}
          />
          <NotificationPanel
            onClose={handlePanelClose}
            onAllRead={() => setUnreadCount(0)}
          />
        </>
      )}
    </>
  )
}
