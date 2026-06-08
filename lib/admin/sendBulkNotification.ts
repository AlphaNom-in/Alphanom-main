'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { Resend }            from 'resend'

const resend     = new Resend(process.env.RESEND_API_KEY!)
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL!
const APP_URL    = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

function buildBroadcastEmail(title: string, body: string, role: 'recruiter' | 'employer'): string {
  const dashboardUrl = role === 'recruiter'
    ? `${APP_URL}/recruiter/dashboard`
    : `${APP_URL}/employer/dashboard`

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title></head>
<body style="margin:0;padding:0;background:#EEF2F7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#EEF2F7;padding:40px 16px;">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#fff;border-radius:16px;border:1px solid #DDE4EE;overflow:hidden;box-shadow:0 4px 24px rgba(15,23,42,0.07);">
  <tr><td style="height:3px;background:linear-gradient(90deg,#032655 0%,#0FB9B1 100%);font-size:0;">&nbsp;</td></tr>
  <tr><td style="padding:28px 32px 20px;">
    <table cellpadding="0" cellspacing="0"><tr>
      <td style="width:34px;height:34px;border-radius:9px;background:linear-gradient(135deg,#0FB9B1,#0A9E97);text-align:center;vertical-align:middle;">
        <span style="font-size:12px;font-weight:900;color:#fff;line-height:34px;display:block;">AN</span>
      </td>
      <td style="padding-left:10px;vertical-align:middle;">
        <span style="font-size:16px;font-weight:800;color:#0F172A;letter-spacing:-0.02em;">AlphaNom</span>
      </td>
    </tr></table>
  </td></tr>
  <tr><td style="padding:0 32px 32px;">
    <h1 style="font-size:22px;font-weight:800;color:#0F172A;letter-spacing:-0.025em;line-height:1.25;margin:0 0 16px;">${title}</h1>
    <p style="font-size:14px;color:#475569;line-height:1.7;margin:0 0 28px;white-space:pre-wrap;">${body}</p>
    <a href="${dashboardUrl}" style="display:inline-block;background:#032655;color:#fff;font-size:14px;font-weight:700;padding:13px 32px;border-radius:10px;text-decoration:none;letter-spacing:0.01em;">
      Go to Dashboard →
    </a>
  </td></tr>
  <tr><td style="background:#F8FAFC;border-top:1px solid #E8EEF4;padding:16px 32px;">
    <p style="font-size:11px;color:#94A3B8;margin:0;">
      You received this message from AlphaNom admin. <a href="${dashboardUrl}" style="color:#94A3B8;">Manage preferences</a>
    </p>
  </td></tr>
</table>
</td></tr>
</table>
</body></html>`
}

export type BulkNotifResult = {
  inAppSent: number
  emailSent: number
  error?: string
}

export async function sendBulkNotification(formData: FormData): Promise<BulkNotifResult> {
  const target  = formData.get('target') as string   // 'recruiters' | 'employers' | 'both'
  const channel = formData.get('channel') as string  // 'inapp' | 'email' | 'both'
  const title   = (formData.get('title') as string)?.trim()
  const body    = (formData.get('body') as string)?.trim()
  const link    = (formData.get('link') as string)?.trim() || null

  if (!title || !body) return { inAppSent: 0, emailSent: 0, error: 'Title and message are required.' }

  const admin = createAdminClient()
  let inAppSent = 0
  let emailSent = 0

  const wantRecruiters = target === 'recruiters' || target === 'both'
  const wantEmployers  = target === 'employers'  || target === 'both'
  const doInApp = channel === 'inapp' || channel === 'both'
  const doEmail = channel === 'email' || channel === 'both'

  // Fetch targets
  const [{ data: recruiters }, { data: employers }] = await Promise.all([
    wantRecruiters ? admin.from('recruiters').select('user_id, email, full_name') : { data: [] },
    wantEmployers  ? admin.from('employers').select('user_id, email, contact_name') : { data: [] },
  ])

  // ── In-app notifications ────────────────────────────────────────
  if (doInApp) {
    const notifs: object[] = []
    for (const r of recruiters ?? []) {
      if (r.user_id) notifs.push({ user_id: r.user_id, type: 'admin_broadcast', title, body, link })
    }
    for (const e of employers ?? []) {
      if (e.user_id) notifs.push({ user_id: e.user_id, type: 'admin_broadcast', title, body, link })
    }
    if (notifs.length) {
      const BATCH = 500
      for (let i = 0; i < notifs.length; i += BATCH) {
        await admin.from('notifications').insert(notifs.slice(i, i + BATCH))
      }
      inAppSent = notifs.length
    }
  }

  // ── Email ────────────────────────────────────────────────────────
  if (doEmail) {
    const BATCH = 100
    const sendBatch = async (emails: string[], role: 'recruiter' | 'employer') => {
      const html = buildBroadcastEmail(title, body, role)
      for (let i = 0; i < emails.length; i += BATCH) {
        const chunk = emails.slice(i, i + BATCH)
        await resend.batch.send(chunk.map(to => ({
          from: `AlphaNom <${FROM_EMAIL}>`,
          to,
          subject: title,
          html,
        })))
        emailSent += chunk.length
      }
    }

    const recruiterEmails = (recruiters ?? []).map(r => r.email).filter(Boolean) as string[]
    const employerEmails  = (employers  ?? []).map(e => e.email).filter(Boolean) as string[]

    if (recruiterEmails.length) await sendBatch(recruiterEmails, 'recruiter')
    if (employerEmails.length)  await sendBatch(employerEmails,  'employer')
  }

  return { inAppSent, emailSent }
}