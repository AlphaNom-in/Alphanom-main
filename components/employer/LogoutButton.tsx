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
    <button onClick={handleLogout}>
      Logout
    </button>
  )
}