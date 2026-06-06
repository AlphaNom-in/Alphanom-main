'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function unsaveJob(savedJobId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: recruiter } = await supabase
    .from('recruiters').select('id').eq('user_id', user.id).single()
  if (!recruiter) throw new Error('Recruiter not found')

  const { error } = await supabase
    .from('recruiter_saved_jobs')
    .delete()
    .eq('id', savedJobId)
    .eq('recruiter_id', recruiter.id)

  if (error) throw error

  revalidatePath('/recruiter/dashboard/my-jobs')
  revalidatePath('/recruiter/dashboard')
}
