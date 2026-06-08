'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updatePayoutDetails(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: recruiter } = await supabase
    .from('recruiters').select('id').eq('user_id', user.id).single()
  if (!recruiter) throw new Error('Recruiter not found')

  const raw = (k: string) => (formData.get(k) as string)?.trim() || null

  const { error } = await supabase.from('recruiters').update({
    bank_account_name:   raw('bank_account_name'),
    bank_account_number: raw('bank_account_number'),
    bank_ifsc:           raw('bank_ifsc'),
    upi_id:              raw('upi_id'),
    pan_number:          raw('pan_number'),
    gst_number:          raw('gst_number'),
  }).eq('id', recruiter.id)

  if (error) throw new Error(error.message)
  revalidatePath('/recruiter/dashboard/settings')
  return true
}