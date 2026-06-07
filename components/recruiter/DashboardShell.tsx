'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import LogoutButton from '../employer/LogoutButton'
import NotificationPanel from './NotificationPanel'
import { createClient } from '@/lib/supabase/client'

const PAGE_TITLES: Record<string, string> = {
  '/recruiter/dashboard':                  'Overview',
  '/recruiter/dashboard/all-jobs':         'All Jobs',
  '/recruiter/dashboard/my-jobs':          'Saved Jobs',
  '/recruiter/dashboard/submissions':      'My Submissions',
  '/recruiter/dashboard/helpdesk':         'Helpdesk',
  '/recruiter/dashboard/profile':          'My Profile',
  '/recruiter/dashboard/profile/complete': 'Complete Profile',
}

const NAV = [
  {
    label: 'Overview', href: '/recruiter/dashboard', exact: true,
    icon: <svg fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" style={{ width: '16px', height: '16px', flexShrink: 0 }}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>,
  },
  {
    label: 'All Jobs', href: '/recruiter/dashboard/all-jobs', exact: false,
    icon: <svg fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" style={{ width: '16px', height: '16px', flexShrink: 0 }}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>,
  },
  {
    label: 'Saved Jobs', href: '/recruiter/dashboard/my-jobs', exact: false,
    icon: <svg fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" style={{ width: '16px', height: '16px', flexShrink: 0 }}><path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" /></svg>,
  },
  {
    label: 'Submissions', href: '/recruiter/dashboard/submissions', exact: false,
    icon: <svg fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" style={{ width: '16px', height: '16px', flexShrink: 0 }}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.75 3.75 0 11-6.75 0 3.75 3.75 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>,
  },
  {
    label: 'Helpdesk', href: '/recruiter/dashboard/helpdesk', exact: true,
    icon: <svg fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" style={{ width: '16px', height: '16px', flexShrink: 0 }}><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" /></svg>,
  },
]

export default function DashboardShell({
  children, recruiterName, earnings = 0, initialUnreadCount = 0,
}: {
  children: React.ReactNode
  recruiterName: string
  earnings?: number
  initialUnreadCount?: number
}) {
  const pathname = usePathname()
  const router   = useRouter()
  const [navOpen,       setNavOpen]       = useState(false)
  const [isNotifOpen,   setIsNotifOpen]   = useState(false)
  const [unreadCount,   setUnreadCount]   = useState(initialUnreadCount)

  useEffect(() => { setNavOpen(false) }, [pathname])
  useEffect(() => { setIsNotifOpen(false) }, [pathname])

  useEffect(() => {
    function onVisibilityChange() {
      if (document.visibilityState === 'visible') router.refresh()
    }
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => document.removeEventListener('visibilitychange', onVisibilityChange)
  }, [router])

  useEffect(() => {
    const supabase = createClient()
    let channel: ReturnType<typeof supabase.channel> | null = null
    let cancelled = false
    ;(async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (cancelled || !user) return
      channel = supabase
        .channel(`rdash-notifs:${user.id}`)
        .on('postgres_changes', {
          event: 'INSERT', schema: 'public', table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        }, () => setUnreadCount(c => c + 1))
        .subscribe()
    })()
    return () => { cancelled = true; if (channel) supabase.removeChannel(channel) }
  }, [])

  useEffect(() => {
    document.body.style.overflow = navOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [navOpen])

  function handlePanelClose() {
    setIsNotifOpen(false)
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      supabase.from('notifications').select('id', { count: 'exact', head: true })
        .eq('user_id', user.id).eq('is_read', false)
        .then(({ count }) => setUnreadCount(count ?? 0))
    })
  }

  const abbr = recruiterName.split(' ').filter(Boolean).map((w: string) => w[0]).slice(0, 2).join('').toUpperCase() || 'R'

  const pageTitle = Object.entries(PAGE_TITLES)
    .find(([key]) => pathname === key || (!PAGE_TITLES[pathname] && pathname.startsWith(key + '/')))?.[1] ?? 'Dashboard'

  const SidebarContent = () => (
    <>
      {/* Teal top accent */}
      <div style={{ height: '3px', background: 'linear-gradient(90deg, #0FB9B1 0%, rgba(15,185,177,0.3) 100%)', flexShrink: 0 }} />

      {/* Brand */}
      <div style={{ padding: '1.25rem 1.25rem 1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '9px', flexShrink: 0, background: 'linear-gradient(135deg, #0FB9B1 0%, #0A9E97 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 3px 12px rgba(15,185,177,0.4)' }}>
              <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 900, fontSize: '0.7rem', color: '#fff', letterSpacing: '0.04em' }}>AN</span>
            </div>
            <div>
              <p style={{ fontFamily: 'var(--font-ui)', fontWeight: 800, fontSize: '0.95rem', color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.2 }}>AlphaNom</p>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.48rem', color: 'rgba(255,255,255,0.35)', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase' as const, marginTop: '1px' }}>Recruiter Portal</p>
            </div>
          </div>
          <button className="rdash-close-nav" onClick={() => setNavOpen(false)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', padding: '6px', cursor: 'pointer', display: 'none' }}>
            <svg width="15" height="15" fill="none" stroke="#fff" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      </div>

      <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', margin: '0 1.25rem 0.875rem' }} />

      <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.48rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.28)', padding: '0 1.25rem', marginBottom: '6px' }}>
        Navigation
      </p>

      <nav style={{ padding: '0 0.625rem', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {NAV.map((item) => {
          const active = item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link key={item.href} href={item.href} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '9px 11px', borderRadius: '9px', textDecoration: 'none',
              fontFamily: 'var(--font-ui)', fontSize: '0.875rem',
              fontWeight: active ? 700 : 500,
              color: active ? '#fff' : 'rgba(255,255,255,0.52)',
              background: active ? 'rgba(15,185,177,0.16)' : 'transparent',
              borderLeft: active ? '2.5px solid #0FB9B1' : '2.5px solid transparent',
            }}>
              <span style={{ color: active ? '#0FB9B1' : 'rgba(255,255,255,0.45)' }}>{item.icon}</span>
              {item.label}
              {active && <div style={{ marginLeft: 'auto', width: '5px', height: '5px', borderRadius: '50%', background: '#0FB9B1', flexShrink: 0 }} />}
            </Link>
          )
        })}
      </nav>

      <div style={{ flex: 1 }} />

      <div style={{ padding: '0 0.625rem 1.5rem' }}>
        <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', margin: '0 0.625rem 0.75rem' }} />
        <LogoutButton />
      </div>
    </>
  )

  return (
    <>
      <style>{`
        .rdash-root { display: flex; height: 100vh; overflow: hidden; background: #F5F8FC; }
        .rdash-sidebar { width: 240px; background: #032655; display: flex; flex-direction: column; flex-shrink: 0; height: 100vh; overflow-y: auto; }
        .rdash-overlay { display: none; }
        .rdash-hamburger { display: none; }
        .rdash-right { flex: 1; display: flex; flex-direction: column; min-width: 0; height: 100vh; overflow-x: hidden; }
        .rdash-header { height: 60px; background: #fff; border-bottom: 1px solid #D0DBE8; display: flex; align-items: center; justify-content: space-between; padding: 0 1.75rem; flex-shrink: 0; z-index: 10; gap: 12px; }
        .rdash-main { flex: 1; padding: 1.75rem; overflow-y: auto; min-height: 0; display: flex; flex-direction: column; }
        .rdash-earnings { display: flex; align-items: center; gap: 7px; background: #D8F0EB; border: 1px solid rgba(15,185,177,0.4); border-radius: 8px; padding: 5px 12px; }
        .rdash-close-nav { display: none !important; }
        .notif-panel { width: 420px; }

        @media (max-width: 768px) {
          .rdash-root { height: auto; min-height: 100vh; overflow: visible; flex-direction: column; }
          .rdash-sidebar { position: fixed; top: 0; left: 0; width: 280px; height: 100vh; z-index: 150; transform: translateX(-100%); transition: transform 0.28s ease; overflow-y: auto; }
          .rdash-sidebar.open { transform: translateX(0); }
          .rdash-overlay { display: block; position: fixed; inset: 0; background: rgba(3,38,85,0.5); z-index: 140; backdrop-filter: blur(2px); }
          .rdash-hamburger { display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 8px; background: #EEF3F8; border: 1px solid #D0DBE8; cursor: pointer; flex-shrink: 0; }
          .rdash-right { height: auto; overflow: visible; min-height: 100vh; }
          .rdash-header { padding: 0 1rem; position: sticky; top: 0; z-index: 20; }
          .rdash-main { padding: 1rem; overflow-y: auto; height: auto; min-height: 0; }
          .rdash-earnings { display: none; }
          .rdash-profile-name { display: none; }
          .rdash-close-nav { display: flex !important; }
          .rdash-page-subtitle { display: none; }
          .notif-panel { width: 100vw !important; }
        }

        @media (max-width: 768px) {
          .rdash-metrics-grid { grid-template-columns: 1fr 1fr !important; gap: 10px !important; }
          .rdash-two-col { flex-direction: column !important; }
          .rdash-two-col-sidebar { width: 100% !important; height: auto !important; }
          .rdash-two-col-main { height: auto !important; }
          .rdash-overview-bottom { grid-template-columns: 1fr !important; }
          .rdash-stats-row { grid-template-columns: 1fr 1fr !important; }
          .rdash-page-root { height: auto !important; min-height: 0 !important; }
          .rdash-scrollable { overflow-y: visible !important; height: auto !important; max-height: none !important; }
          .rdash-table-wrap { overflow-x: auto; }
          .rdash-table-wrap table { min-width: 560px; }
          .rdash-helpdesk-cards { grid-template-columns: 1fr !important; }
          .rdash-submit-grid { grid-template-columns: 1fr !important; }
          .rdash-profile-grid { grid-template-columns: 1fr !important; }
          .rdash-job-header { flex-direction: column !important; align-items: flex-start !important; }
          .rdash-job-header-right { width: 100%; }
        }
      `}</style>

      <div className="rdash-root">
        {navOpen && <div className="rdash-overlay" onClick={() => setNavOpen(false)} />}

        <aside className={`rdash-sidebar${navOpen ? ' open' : ''}`}>
          <SidebarContent />
        </aside>

        <div className="rdash-right">
          <header className="rdash-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
              <button className="rdash-hamburger" onClick={() => setNavOpen(true)}>
                <svg width="16" height="16" fill="none" stroke="#032655" strokeWidth={2.2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              </button>
              <div style={{ minWidth: 0 }}>
                <p className="rdash-page-subtitle" style={{ fontFamily: 'var(--font-ui)', fontSize: '0.5rem', fontWeight: 600, letterSpacing: '0.13em', textTransform: 'uppercase' as const, color: '#96AFCA', marginBottom: '1px' }}>
                  Recruiter Dashboard
                </p>
                <h1 style={{ fontFamily: 'var(--font-ui)', fontSize: '1rem', fontWeight: 800, color: '#032655', letterSpacing: '-0.02em', lineHeight: 1, whiteSpace: 'nowrap' as const, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {pageTitle}
                </h1>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
              {/* Notification bell */}
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
                  boxShadow: isNotifOpen ? '0 3px 10px rgba(3,38,85,0.28)' : '0 3px 10px rgba(15,185,177,0.38)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', flexShrink: 0, transition: 'all 0.18s ease',
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

              {/* Earnings */}
              <div className="rdash-earnings">
                <svg width="13" height="13" fill="none" stroke="#0A9E97" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.45rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#0A9E97', lineHeight: 1 }}>Est. Earnings</p>
                  <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', fontWeight: 800, color: '#032655', lineHeight: 1, marginTop: '1px' }}>
                    ₹{earnings.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              {/* Profile link */}
              <Link
                href="/recruiter/dashboard/profile"
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  background: '#EEF3F8', border: '1px solid #D0DBE8',
                  borderRadius: '9px', padding: '4px 10px 4px 4px',
                  textDecoration: 'none',
                }}
              >
                <div style={{ width: '28px', height: '28px', borderRadius: '7px', background: 'linear-gradient(135deg, #032655 0%, #0FB9B1 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 800, fontSize: '0.55rem', color: '#fff' }}>{abbr}</span>
                </div>
                <span className="rdash-profile-name" style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', fontWeight: 600, color: '#032655', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>
                  {recruiterName || 'My Account'}
                </span>
              </Link>
            </div>
          </header>

          <main className="rdash-main">{children}</main>
        </div>
      </div>

      {/* Notification panel + backdrop */}
      {isNotifOpen && (
        <>
          <div onClick={handlePanelClose} style={{ position: 'fixed', inset: 0, zIndex: 99, background: 'transparent' }} />
          <NotificationPanel onClose={handlePanelClose} onAllRead={() => setUnreadCount(0)} />
        </>
      )}
    </>
  )
}
