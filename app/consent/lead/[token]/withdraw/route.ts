import { NextResponse }      from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params
  const origin    = new URL(req.url).origin
  const base      = `${origin}/consent/lead/${token}`

  const admin = createAdminClient()

  const { data: lead } = await admin
    .from('recruiter_leads')
    .select('id, status')
    .eq('consent_token', token)
    .single()

  if (!lead) return NextResponse.redirect(`${base}?result=not_found`)
  if (lead.status === 'consented') return NextResponse.redirect(`${base}?result=confirmed`)

  await admin
    .from('recruiter_leads')
    .update({ status: 'rejected' })
    .eq('consent_token', token)

  return NextResponse.redirect(`${base}?result=withdrawn`)
}
