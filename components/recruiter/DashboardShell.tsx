'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import LogoutButton from '../employer/LogoutButton'

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const links = [
    {
      label: 'Dashboard',
      href: '/recruiter/dashboard',
    },
    {
      label: 'All Jobs',
      href: '/recruiter/dashboard/all-jobs',
    },
    {
      label: 'My Jobs',
      href: '/recruiter/dashboard/my-jobs',
    },
    {
      label: 'Helpdesk',
      href: '/recruiter/dashboard/helpdesk',
    },
    {
      label: 'Profile',
      href: '/recruiter/dashboard/profile',
    },
  ]

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: '#F5F8FC',
      }}
    >
      <aside
        style={{
          width: '260px',
          background: '#032655',
          color: '#fff',
          padding: '2rem',
        }}
      >
        <h2
          style={{
            marginBottom: '2rem',
          }}
        >
          AlphaNom
        </h2>

        <nav
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                padding: '12px 16px',
                borderRadius: '10px',
                textDecoration: 'none',
                color: '#fff',
                background:
                  pathname === link.href
                    ? '#0FB9B1'
                    : 'transparent',
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
         <div style={{ marginTop: 'auto' }}>
  <LogoutButton />
</div>
      </aside>

      <main
        style={{
          flex: 1,
          padding: '2rem',
        }}
      >
        {children}
      </main>
    </div>
  )
}