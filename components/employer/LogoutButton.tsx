'use client'

import { useRouter } from 'next/navigation'
import { logout } from '@/lib/auth/logout'

export default function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    await logout()
    router.push('/employer/login')
  }

  return (
    <button
      onClick={handleLogout}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        width: '100%',
        padding: '9px 10px',
        borderRadius: '8px',
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.1)',
        color: 'rgba(255,255,255,0.55)',
        cursor: 'pointer',
        fontFamily: 'var(--font-ui)',
        fontSize: '0.875rem',
        fontWeight: 500,
        textAlign: 'left',
      }}
    >
      <svg fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" style={{ width: '15px', height: '15px', flexShrink: 0 }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
      </svg>
      Sign Out
    </button>
  )
}
