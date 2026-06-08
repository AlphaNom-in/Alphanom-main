'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateJobDefaults(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: employer } = await supabase
    .from('employers').select('id').eq('user_id', user.id).single()
  if (!employer) throw new Error('Employer not found')

  const raw = (k: string) => (formData.get(k) as string)?.trim() || null
  const commissionRaw = formData.get('default_commission_pct') as string
  const commission = commissionRaw ? parseFloat(commissionRaw) : null

  const { error } = await supabase.from('employers').update({
    default_work_model:     raw('default_work_model'),
    default_notice_period:  raw('default_notice_period'),
    default_commission_pct: commission,
  }).eq('id', employer.id)

  if (error) throw new Error(error.message)
  revalidatePath('/employer/dashboard/settings')
  return true
}