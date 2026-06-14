'use server'

import { createClient }      from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath }    from 'next/cache'
import { sendBrevoEmail }    from '@/lib/email/brevo'
import { consentEmailHtml }  from '@/lib/email/templates'

function leadConsentEmailHtml({
  candidateFirstName,
  recruiterName,
  jobTitle,
  confirmUrl,
  withdrawUrl,
}: {
  candidateFirstName: string
  recruiterName: string
  jobTitle: string
  confirmUrl: string
  withdrawUrl: string
}): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F5F8FC;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F8FC;padding:40px 16px;">
    <tr><td align="center">
      <table width="540" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;border:1px solid #D0DBE8;overflow:hidden;max-width:540px;">
        <tr><td style="height:4px;background:linear-gradient(90deg,#032655,#0FB9B1);font-size:0;line-height:0;">&nbsp;</td></tr>
        <tr><td style="padding:28px 36px 0;">
          <table cellpadding="0" cellspacing="0"><tr>
            <td style="width:36px;height:36px;border-radius:9px;background:linear-gradient(135deg,#0FB9B1,#0A9E97);text-align:center;vertical-align:middle;">
              <span style="font-weight:900;font-size:12px;color:#fff;letter-spacing:0.04em;">AN</span>
            </td>
            <td style="padding-left:10px;font-weight:800;font-size:16px;color:#032655;letter-spacing:-0.02em;">AlphaNom</td>
          </tr></table>
        </td></tr>
        <tr><td style="padding:24px 36px 0;">
          <h1 style="font-size:20px;font-weight:800;color:#032655;margin:0 0 8px;letter-spacing:-0.025em;">Your profile has been reviewed</h1>
          <p style="font-size:14px;color:#5A7A9F;margin:0 0 18px;line-height:1.7;">Dear ${candidateFirstName},</p>
          <p style="font-size:14px;color:#2d3748;margin:0 0 16px;line-height:1.8;">
            A recruiter (<strong>${recruiterName}</strong>) has reviewed your application for the
            <strong style="color:#032655;">${jobTitle}</strong> role and would like to share your profile with the hiring company.
          </p>
          <p style="font-size:13px;color:#4a5568;margin:0 0 28px;line-height:1.8;">
            Please confirm below to allow your profile to be forwarded. Your details will only be shared after you give consent.
          </p>
        </td></tr>
        <tr><td style="padding:0 36px 28px;">
          <table cellpadding="0" cellspacing="0">
            <tr>
              <td style="background:linear-gradient(135deg,#032655,#0a3d7a);border-radius:8px;">
                <a href="${confirmUrl}" style="display:inline-block;padding:14px 32px;color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;letter-spacing:0.02em;">
                  Yes, share my profile &rarr;
                </a>
              </td>
            </tr>
          </table>
        </td></tr>
        <tr><td style="padding:0 36px 32px;">
          <div style="height:1px;background:#e2e8f0;margin-bottom:20px;"></div>
          <p style="font-size:13px;color:#718096;margin:0 0 8px;line-height:1.7;">
            Not interested? <a href="${withdrawUrl}" style="color:#c53030;text-decoration:none;font-weight:600;">Decline here</a> and your application will be withdrawn.
          </p>
          <p style="font-size:12px;color:#a0aec0;margin:0;">This link expires in <strong>48 hours</strong>.</p>
        </td></tr>
        <tr><td style="padding:20px 36px;border-top:1px solid #EEF3F8;">
          <p style="font-size:12px;color:#B0C4D8;margin:0;text-align:center;">
            AlphaNom &mdash; India's Premium Recruitment Network<br/>
            This email was triggered by a recruiter action. Do not reply.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

export type SendLeadConsentResult =
  | { ok: true }
  | { ok: false; error: string }

export async function sendLeadConsent(leadId: string): Promise<SendLeadConsentResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Unauthorized' }

  const { data: recruiter } = await supabase
    .from('recruiters')
    .select('id, full_name')
    .eq('user_id', user.id)
    .single()
  if (!recruiter) return { ok: false, error: 'Recruiter not found' }

  const admin = createAdminClient()

  const { data: lead } = await admin
    .from('recruiter_leads')
    .select('id, applicant_name, email, job_post_id, recruiter_id, status')
    .eq('id', leadId)
    .eq('recruiter_id', recruiter.id)
    .single()

  if (!lead) return { ok: false, error: 'Lead not found' }
  if (lead.status === 'consented') return { ok: false, error: 'Candidate has already consented.' }

  const token  = crypto.randomUUID()
  const expiry = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString()

  await admin
    .from('recruiter_leads')
    .update({ consent_token: token, consent_token_expires_at: expiry, status: 'consent_sent' })
    .eq('id', leadId)

  const { data: jobPost } = await admin
    .from('job_posts')
    .select('title')
    .eq('id', lead.job_post_id)
    .single()

  const jobTitle      = jobPost?.title ?? 'the position'
  const recruiterName = recruiter.full_name ?? 'Your Recruiter'
  const base          = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://alphanom.in'
  const confirmUrl    = `${base}/consent/lead/${token}/confirm`
  const withdrawUrl   = `${base}/consent/lead/${token}?withdraw=1`

  try {
    await sendBrevoEmail({
      to:       lead.email,
      toName:   lead.applicant_name,
      subject:  `Your application for ${jobTitle} — Please confirm`,
      html:     leadConsentEmailHtml({
        candidateFirstName: lead.applicant_name.split(' ')[0],
        recruiterName,
        jobTitle,
        confirmUrl,
        withdrawUrl,
      }),
      fromName: recruiterName,
    })
  } catch (err) {
    console.error('[Lead consent email failed]', err)
    return { ok: false, error: 'Failed to send email. Please try again.' }
  }

  revalidatePath('/recruiter/dashboard/leads')
  return { ok: true }
}

export async function rejectLead(leadId: string): Promise<{ ok: boolean }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false }

  const { data: recruiter } = await supabase
    .from('recruiters').select('id').eq('user_id', user.id).single()
  if (!recruiter) return { ok: false }

  const admin = createAdminClient()
  await admin
    .from('recruiter_leads')
    .update({ status: 'rejected' })
    .eq('id', leadId)
    .eq('recruiter_id', recruiter.id)

  revalidatePath('/recruiter/dashboard/leads')
  return { ok: true }
}

export type SubmitLeadResult =
  | { ok: true; candidateEmail: string }
  | { ok: false; error: string }

export async function submitLeadAsCandidate(leadId: string): Promise<SubmitLeadResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Unauthorized' }

  const { data: recruiter } = await supabase
    .from('recruiters')
    .select('id, full_name, is_verified, years_of_experience, linkedin_url')
    .eq('user_id', user.id)
    .single()
  if (!recruiter) return { ok: false, error: 'Recruiter profile not found' }
  if (!recruiter.is_verified) return { ok: false, error: 'Your account is pending verification.' }

  const profileIncomplete =
    (!recruiter.years_of_experience && recruiter.years_of_experience !== 0) ||
    !recruiter.linkedin_url
  if (profileIncomplete) return { ok: false, error: 'Complete your recruiter profile first.' }

  const admin = createAdminClient()

  const { data: lead } = await admin
    .from('recruiter_leads')
    .select('*')
    .eq('id', leadId)
    .eq('recruiter_id', recruiter.id)
    .single()

  if (!lead) return { ok: false, error: 'Lead not found' }
  if (lead.status === 'consented') return { ok: false, error: 'Already submitted.' }

  // Reject if job is no longer active
  const { data: jobCheck } = await admin
    .from('job_posts')
    .select('status, application_limit')
    .eq('id', lead.job_post_id)
    .single()

  if (!jobCheck || jobCheck.status !== 'active') {
    return { ok: false, error: 'This job is no longer accepting submissions.' }
  }

  const consentToken  = crypto.randomUUID()
  const consentExpiry = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString()

  const { data: submission, error: subError } = await admin
    .from('candidate_submissions')
    .insert({
      job_post_id:              lead.job_post_id,
      recruiter_id:             lead.recruiter_id,
      candidate_name:           lead.applicant_name,
      email:                    lead.email,
      phone:                    lead.phone,
      current_job_title:        lead.current_job_title,
      current_company:          lead.current_company,
      current_ctc:              lead.current_ctc,
      expected_ctc:             null,
      current_location:         lead.current_location,
      total_experience:         lead.total_experience,
      notice_period:            lead.notice_period,
      linkedin_url:             lead.linkedin_url,
      portfolio_url:            lead.portfolio_url ?? null,
      resume_url:               lead.resume_url,
      recruiter_note:           '',
      recruiter_name_snapshot:  recruiter.full_name ?? null,
      consent_status:           'pending_consent',
      consent_token:            consentToken,
      consent_token_expires_at: consentExpiry,
    })
    .select('id')
    .single()

  if (subError) {
    console.error('[submitLeadAsCandidate] insert error:', subError)
    return { ok: false, error: 'Failed to create submission. Please try again.' }
  }

  await admin
    .from('recruiter_leads')
    .update({ status: 'consent_sent', submission_id: submission.id })
    .eq('id', leadId)

  // Auto-pause job if application_limit is reached
  if (jobCheck.application_limit) {
    const { count: totalCount } = await admin
      .from('candidate_submissions')
      .select('id', { count: 'exact', head: true })
      .eq('job_post_id', lead.job_post_id)

    if ((totalCount ?? 0) >= jobCheck.application_limit) {
      await admin
        .from('job_posts')
        .update({ status: 'paused', auto_paused: true })
        .eq('id', lead.job_post_id)
    }
  }

  const { data: jobPost } = await admin
    .from('job_posts')
    .select('title, employers(company_name)')
    .eq('id', lead.job_post_id)
    .single()

  const jobTitle    = jobPost?.title ?? 'the position'
  const companyName = (jobPost?.employers as any)?.company_name ?? 'the company'
  const recruiterName = recruiter.full_name ?? 'Your Recruiter'
  const base          = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://alphanom.in'
  const confirmUrl    = `${base}/consent/${consentToken}/confirm`
  const withdrawUrl   = `${base}/consent/${consentToken}?withdraw=1`

  try {
    await sendBrevoEmail({
      to:       lead.email,
      toName:   lead.applicant_name,
      subject:  `Action required: Confirm your application — ${jobTitle} at ${companyName}`,
      html:     consentEmailHtml({
        candidateFirstName: lead.applicant_name.split(' ')[0],
        recruiterName,
        jobTitle,
        companyName,
        confirmUrl,
        withdrawUrl,
      }),
      fromName: recruiterName,
    })
  } catch (err) {
    console.error('[submitLeadAsCandidate] email failed:', err)
  }

  revalidatePath('/recruiter/dashboard/leads')
  revalidatePath('/recruiter/dashboard/submissions')
  return { ok: true, candidateEmail: lead.email }
}
