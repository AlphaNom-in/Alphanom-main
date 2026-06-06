'use server'

import { Resend } from 'resend'

const resend     = new Resend(process.env.RESEND_API_KEY!)
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL!   // e.g. hello@alphanom.in
const FROM_NAME  = 'AlphaNom Security'

export async function sendBrevoEmail({
  to,
  toName,
  subject,
  html,
}: {
  to: string
  toName?: string
  subject: string
  html: string
}) {
  if (!process.env.RESEND_API_KEY || !FROM_EMAIL) {
    throw new Error('Resend credentials not configured. Set RESEND_API_KEY and RESEND_FROM_EMAIL in .env.local')
  }

  const { error } = await resend.emails.send({
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
    to: toName ? `${toName} <${to}>` : to,
    subject,
    html,
  })

  if (error) throw new Error(error.message)
}
