'use server'

import { createAdminClient } from '@/lib/supabase/admin'

type Notif = { type: string; title: string; body?: string; link?: string }

export async function createNotification(userId: string, n: Notif) {
  const admin = createAdminClient()
  await admin.from('notifications').insert({
    user_id: userId, type: n.type, title: n.title,
    body: n.body ?? null, link: n.link ?? null,
  })
}

export async function createNotificationsForMany(userIds: string[], n: Notif) {
  if (!userIds.length) return
  const admin = createAdminClient()
  await admin.from('notifications').insert(
    userIds.map(uid => ({
      user_id: uid, type: n.type, title: n.title,
      body: n.body ?? null, link: n.link ?? null,
    }))
  )
}
