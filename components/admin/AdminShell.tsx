'use client'

import Link            from 'next/link'
import { usePathname } from 'next/navigation'
import { adminLogout } from '@/app/admin/login/action'

const NAV_SECTIONS = [
  {
    label: 'Overview',
    items: [
      {
        href: '/admin', label: 'Overview', exact: true,
        icon: (
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
          </svg>
        ),
      },
    ],
  },
  {
    label: 'Management',
    items: [
      {
        href: '/admin/recruiters', label: 'Recruiters', exact: false,
        icon: (
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
          </svg>
        ),
      },
      {
        href: '/admin/employers', label: 'Employers', exact: false,
        icon: (
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
          </svg>
        ),
      },
      {
        href: '/admin/jobs', label: 'Job Posts', exact: false,
        icon: (
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
        ),
      },
      {
        href: '/admin/candidates', label: 'Candidates', exact: false,
        icon: (
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
          </svg>
        ),
      },
    ],
  },
  {
    label: 'Tools',
    items: [
      {
        href: '/admin/notifications', label: 'Broadcast', exact: false,
        icon: (
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
          </svg>
        ),
      },
    ],
  },
]

const PAGE_TITLES: Record<string, string> = {
  '/admin':               'Overview',
  '/admin/recruiters':    'Recruiters',
  '/admin/employers':     'Employers',
  '/admin/jobs':          'Job Posts',
  '/admin/candidates':    'Candidates',
  '/admin/notifications': 'Broadcast',
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname  = usePathname()
  const pageTitle = PAGE_TITLES[pathname] ?? 'Admin'

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F4F6FB', fontFamily: 'var(--font-ui)' }}>

      <style>{`
        .an-nav-link:hover:not(.an-nav-active) {
          background: #F4F6FB !important;
          color: #3D5A7A !important;
        }
        .an-nav-link:hover:not(.an-nav-active) span { opacity: 1 !important; }
        .an-signout:hover { background: #FFF5F5 !important; color: #C53030 !important; }
        .an-tr:hover { background: #F8FAFC; }
        .an-stat-card:hover { box-shadow: 0 4px 16px rgba(15,28,46,0.09) !important; transform: translateY(-1px); }
        .an-stat-card { transition: box-shadow 0.15s, transform 0.15s; }
        .an-quick-link:hover { background: #EFF6FF !important; border-color: #D0E4FF !important; color: #032655 !important; }
        .an-quick-link { transition: all 0.12s; }
        .an-action-btn:hover { filter: brightness(0.94); }
        .an-action-btn { transition: filter 0.1s; }
        .an-view-all:hover { gap: 7px !important; }
        .an-view-all { transition: gap 0.12s; }
      `}</style>

      {/* ── Sidebar ─────────────────────────────────────── */}
      <aside style={{
        width: '232px', flexShrink: 0,
        background: '#fff',
        borderRight: '1px solid #E4EAF1',
        display: 'flex', flexDirection: 'column',
        position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 100,
        overflowY: 'auto',
      }}>

        {/* Brand */}
        <div style={{ padding: '18px 18px 14px', borderBottom: '1px solid #EEF2F7' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '34px', height: '34px', borderRadius: '9px', flexShrink: 0,
              background: 'linear-gradient(135deg,#032655 0%,#0FB9B1 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(3,38,85,0.25)',
            }}>
              <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 900, fontSize: '0.7rem', color: '#fff', letterSpacing: '0.02em' }}>AN</span>
            </div>
            <div>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.875rem', fontWeight: 800, color: '#0F1C2E', margin: 0, letterSpacing: '-0.02em' }}>AlphaNom</p>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.58rem', fontWeight: 700, color: '#0FB9B1', margin: 0, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Admin Console</p>
            </div>
          </div>
        </div>

        {/* Nav sections */}
        <nav style={{ flex: 1, padding: '12px 10px 8px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {NAV_SECTIONS.map(section => (
            <div key={section.label}>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.57rem', fontWeight: 700, color: '#C0CDD8', letterSpacing: '0.13em', textTransform: 'uppercase', margin: '0 0 4px 10px' }}>
                {section.label}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                {section.items.map(item => {
                  const active = item.exact ? pathname === item.href : pathname.startsWith(item.href)
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`an-nav-link${active ? ' an-nav-active' : ''}`}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '9px',
                        padding: '8px 10px', borderRadius: '8px', textDecoration: 'none',
                        background: active ? '#EFF6FF' : 'transparent',
                        color: active ? '#032655' : '#7A94AB',
                        fontFamily: 'var(--font-ui)', fontSize: '0.8rem',
                        fontWeight: active ? 700 : 500,
                        borderLeft: active ? '3px solid #0FB9B1' : '3px solid transparent',
                        transition: 'all 0.1s',
                      }}
                    >
                      <span style={{ opacity: active ? 1 : 0.75, flexShrink: 0 }}>{item.icon}</span>
                      {item.label}
                      {active && (
                        <div style={{ marginLeft: 'auto', width: '5px', height: '5px', borderRadius: '50%', background: '#0FB9B1', flexShrink: 0 }} />
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom: user + logout */}
        <div style={{ borderTop: '1px solid #EEF2F7', padding: '10px 10px 12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '9px', padding: '9px 10px', marginBottom: '2px', borderRadius: '8px', background: '#F4F6FB', border: '1px solid #EEF2F7' }}>
            <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'linear-gradient(135deg,#032655,#0FB9B1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="14" height="14" fill="none" stroke="#fff" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', fontWeight: 700, color: '#0F1C2E', margin: 0 }}>Administrator</p>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.6rem', color: '#96AFCA', margin: 0 }}>Full access · Superadmin</p>
            </div>
          </div>
          <form action={adminLogout}>
            <button
              type="submit"
              className="an-signout"
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '8px',
                padding: '8px 10px', borderRadius: '8px', border: 'none',
                background: 'transparent', color: '#96AFCA',
                fontFamily: 'var(--font-ui)', fontSize: '0.76rem', fontWeight: 500,
                cursor: 'pointer', textAlign: 'left', transition: 'all 0.12s',
              }}
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
              </svg>
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* ── Main wrapper ────────────────────────────────── */}
      <div style={{ marginLeft: '232px', flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* Top bar */}
        <header style={{
          height: '54px', background: '#fff', borderBottom: '1px solid #E4EAF1',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 32px', position: 'sticky', top: 0, zIndex: 50,
          boxShadow: '0 1px 0 #E4EAF1',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.62rem', fontWeight: 600, color: '#B0BEC8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Admin</span>
            <svg width="12" height="12" fill="none" stroke="#D0DBE8" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', fontWeight: 700, color: '#0F1C2E' }}>{pageTitle}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '5px 12px', borderRadius: '20px',
              background: '#F0FBF9', border: '1px solid rgba(15,185,177,0.25)',
            }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0FB9B1', boxShadow: '0 0 0 2px rgba(15,185,177,0.25)' }} />
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.68rem', fontWeight: 700, color: '#0A9E97', letterSpacing: '0.04em' }}>LIVE</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: '28px 32px 48px', minWidth: 0 }}>
          {children}
        </main>
      </div>
    </div>
  )
}