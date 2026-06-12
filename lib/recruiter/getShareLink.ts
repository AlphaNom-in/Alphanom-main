'use server'

import { createClient }      from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

function randomSlug(len = 8) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  return Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

export async function getShareLink(jobId: string): Promise<string> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: recruiter } = await supabase
    .from('recruiters').select('id').eq('user_id', user.id).single()
  if (!recruiter) throw new Error('Recruiter not found')

  const admin = createAdminClient()

  // Return existing link if one exists
  const { data: existing } = await admin
    .from('recruiter_share_links')
    .select('slug')
    .eq('recruiter_id', recruiter.id)
    .eq('job_post_id', jobId)
    .single()

  if (existing) return existing.slug

  // Generate unique slug
  let slug = randomSlug()
  let tries = 0
  while (tries < 5) {
    const { data: clash } = await admin
      .from('recruiter_share_links').select('id').eq('slug', slug).single()
    if (!clash) break
    slug = randomSlug()
    tries++
  }

  await admin.from('recruiter_share_links').insert({
    recruiter_id: recruiter.id,
    job_post_id:  jobId,
    slug,
    is_active:    true,
  })

  return slug
}
