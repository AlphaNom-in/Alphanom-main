'use server'

import { createAdminClient } from '@/lib/supabase/admin'

export async function checkRecruiterEmailExists(email: string): Promise<boolean> {
  const admin = createAdminClient()
  const { data } = await admin.from('recruiters').select('id').eq('email', email).maybeSingle()
  return !!data
}
