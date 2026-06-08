'use server'

import { cookies }           from 'next/headers'
import { redirect }          from 'next/navigation'
import { createAdminToken }  from '@/lib/admin/auth'

export async function adminLogin(
  _prev: { error: string } | null,
  formData: FormData
): Promise<{ error: string }> {
  const username = (formData.get('username') as string)?.trim()
  const password = (formData.get('password') as string)?.trim()

  if (
    username !== process.env.ADMIN_USERNAME ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return { error: 'Invalid username or password.' }
  }

  const token = createAdminToken()
  const jar   = await cookies()
  jar.set('admin_token', token, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge:   12 * 60 * 60,
    path:     '/',
  })

  redirect('/admin')
}

export async function adminLogout() {
  const jar = await cookies()
  jar.delete('admin_token')
  redirect('/admin/login')
}