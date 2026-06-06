'use server'

import { Resend } from 'resend'
import { createAdminClient } from '@/lib/supabase/admin'

const resend     = new Resend(process.env.RESEND_API_KEY!)
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL!
const APP_URL    = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

function fmt(val: number | null): string | null {
  if (!val || val <= 0) return null
  if (val >= 100000) return `₹${(val / 100000).toFixed(0)}L`
  return `₹${val}L`
}

function commission(budgetMax: number | null): string | null {
  if (!budgetMax || budgetMax <= 0) return null
  const fee = Math.round(budgetMax * 0.04)
  if (fee >= 100000) return `₹${(fee / 100000).toFixed(2)}L`
  return `₹${fee.toLocaleString('en-IN')}`
}

function buildEmail(job: any, employer: any, related: any[]): string {
  const companyName   = employer?.company_name ?? 'A Company'
  const initial       = companyName[0].toUpperCase()
  const bMin          = fmt(job.budget_min)
  const bMax          = fmt(job.budget_max)
  const budgetStr     = bMin && bMax ? `${bMin} – ${bMax} PA` : bMax ? `Up to ${bMax} PA` : null
  const commissionStr = commission(job.budget_max)
  const criteria      = (job.mandatory_criteria as string[] | null)?.slice(0, 4) ?? []
  const jobUrl        = `${APP_URL}/recruiter/dashboard/all-jobs`

  /* ── detail rows ── */
  const details = [
    job.location      && { label: 'Location',     value: job.location },
    job.work_model    && { label: 'Work Model',    value: job.work_model },
    job.department    && { label: 'Department',    value: job.department },
    job.notice_period && { label: 'Notice Period', value: job.notice_period },
  ].filter(Boolean) as { label: string; value: string }[]

  const detailCols = details.map(d => `
    <td style="padding:0 8px 0 0;vertical-align:top;width:25%;">
      <div style="background:#F8FAFC;border:1px solid #E8EEF4;border-radius:8px;padding:10px 12px;">
        <p style="font-size:9px;font-weight:700;color:#94A3B8;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 3px;">${d.label}</p>
        <p style="font-size:12px;font-weight:600;color:#1E293B;margin:0;line-height:1.3;">${d.value}</p>
      </div>
    </td>`).join('')

  /* ── requirements ── */
  const reqItems = criteria.map(c => `
    <tr>
      <td style="padding:0 0 8px 0;">
        <table cellpadding="0" cellspacing="0" width="100%"><tr>
          <td style="width:20px;height:20px;border-radius:50%;background:#D8F0EB;text-align:center;vertical-align:middle;font-size:11px;color:#0A9E97;font-weight:700;flex-shrink:0;">✓</td>
          <td style="padding-left:10px;font-size:13px;color:#334155;font-weight:500;line-height:1.4;">${c}</td>
        </tr></table>
      </td>
    </tr>`).join('')

  /* ── related job cards ── */
  const relatedCards = related.slice(0, 2).map((j, idx) => {
    const emp  = j.employers as any
    const bm   = fmt(j.budget_max)
    const comm = commission(j.budget_max)
    return `
    <tr>
      <td style="padding:${idx === 0 ? '0' : '10px'} 0 0 0;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC;border:1px solid #E8EEF4;border-radius:10px;">
          <tr>
            <td style="padding:14px 16px;">
              <table width="100%" cellpadding="0" cellspacing="0"><tr>
                <td>
                  <p style="font-size:13px;font-weight:700;color:#0F172A;margin:0 0 3px;line-height:1.3;">${j.title}</p>
                  <p style="font-size:11px;color:#64748B;margin:0;">${emp?.company_name ?? ''}${j.location ? ` &nbsp;·&nbsp; ${j.location}` : ''}</p>
                </td>
                <td align="right" style="vertical-align:middle;padding-left:12px;">
                  ${bm ? `<span style="display:inline-block;background:#D8F0EB;color:#0A9E97;font-size:11px;font-weight:700;padding:4px 10px;border-radius:20px;white-space:nowrap;">${bm}</span>` : ''}
                  ${comm ? `<p style="font-size:10px;color:#94A3B8;margin:4px 0 0;text-align:right;">Earn up to ${comm}</p>` : ''}
                </td>
              </tr></table>
            </td>
          </tr>
        </table>
      </td>
    </tr>`
  }).join('')

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="color-scheme" content="light">
  <title>New Job Alert — AlphaNom</title>
</head>
<body style="margin:0;padding:0;background:#EEF2F7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;-webkit-font-smoothing:antialiased;">

<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#EEF2F7;padding:40px 16px;">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" role="presentation" style="max-width:560px;width:100%;">

  <!-- ═══ CARD ═══ -->
  <tr><td style="background:#ffffff;border-radius:16px;border:1px solid #DDE4EE;overflow:hidden;box-shadow:0 4px 24px rgba(15,23,42,0.07);">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation">

    <!-- accent bar -->
    <tr><td style="height:3px;background:linear-gradient(90deg,#032655 0%,#0FB9B1 100%);font-size:0;line-height:0;">&nbsp;</td></tr>

    <!-- ── HEADER ── -->
    <tr><td style="padding:24px 28px 20px;">
      <table width="100%" cellpadding="0" cellspacing="0"><tr>
        <!-- Logo -->
        <td style="vertical-align:middle;">
          <table cellpadding="0" cellspacing="0"><tr>
            <td style="width:32px;height:32px;border-radius:8px;background:linear-gradient(135deg,#0FB9B1,#0A9E97);text-align:center;vertical-align:middle;">
              <span style="font-size:11px;font-weight:900;color:#fff;letter-spacing:0.05em;line-height:32px;display:block;">AN</span>
            </td>
            <td style="padding-left:9px;vertical-align:middle;">
              <span style="font-size:15px;font-weight:800;color:#0F172A;letter-spacing:-0.02em;">AlphaNom</span>
            </td>
          </tr></table>
        </td>
        <!-- Badge -->
        <td align="right" style="vertical-align:middle;">
          <span style="display:inline-block;background:#FEF9EC;border:1px solid #FDE68A;color:#92400E;font-size:10px;font-weight:700;padding:5px 12px;border-radius:20px;letter-spacing:0.06em;text-transform:uppercase;">
            ✦ New Job Alert
          </span>
        </td>
      </tr></table>
    </td></tr>

    <!-- divider -->
    <tr><td style="padding:0 28px;"><div style="height:1px;background:#F1F5F9;"></div></td></tr>

    <!-- ── COMPANY + JOB HERO ── -->
    <tr><td style="padding:28px 28px 0;">

      <!-- Company row -->
      <table cellpadding="0" cellspacing="0" style="margin-bottom:18px;"><tr>
        <td style="width:44px;height:44px;border-radius:10px;background:#032655;text-align:center;vertical-align:middle;font-size:17px;font-weight:800;color:#fff;letter-spacing:-0.01em;">${initial}</td>
        <td style="padding-left:12px;vertical-align:middle;">
          <p style="font-size:13px;font-weight:700;color:#0F172A;margin:0 0 2px;">${companyName}</p>
          ${employer?.industry ? `<p style="font-size:11px;color:#94A3B8;margin:0;font-weight:400;">${employer.industry}</p>` : ''}
        </td>
      </tr></table>

      <!-- Label -->
      <p style="font-size:10px;font-weight:700;color:#0FB9B1;letter-spacing:0.14em;text-transform:uppercase;margin:0 0 8px;">Featured Role</p>

      <!-- Job Title -->
      <h1 style="font-size:26px;font-weight:800;color:#0F172A;letter-spacing:-0.03em;line-height:1.15;margin:0 0 22px;">${job.title}</h1>

    </td></tr>

    <!-- ── DETAIL CHIPS ── -->
    ${details.length > 0 ? `
    <tr><td style="padding:0 28px 24px;">
      <table width="100%" cellpadding="0" cellspacing="0"><tr>${detailCols}</tr></table>
    </td></tr>` : ''}

    <!-- ── SALARY + EARN CARD ── -->
    ${budgetStr || commissionStr ? `
    <tr><td style="padding:0 28px 24px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:12px;overflow:hidden;border:1px solid #1e3a6e;">
        <tr>
          <!-- Salary -->
          ${budgetStr ? `
          <td width="50%" style="background:#032655;padding:18px 20px;vertical-align:middle;${commissionStr ? 'border-right:1px solid rgba(255,255,255,0.1);' : ''}">
            <p style="font-size:9px;font-weight:700;color:rgba(255,255,255,0.45);letter-spacing:0.14em;text-transform:uppercase;margin:0 0 6px;">Salary Range</p>
            <p style="font-size:20px;font-weight:800;color:#0FB9B1;margin:0;line-height:1.1;">${budgetStr}</p>
          </td>` : ''}
          <!-- Earn -->
          ${commissionStr ? `
          <td width="50%" style="background:#021e44;padding:18px 20px;vertical-align:middle;">
            <p style="font-size:9px;font-weight:700;color:rgba(255,255,255,0.45);letter-spacing:0.14em;text-transform:uppercase;margin:0 0 6px;">Your Chance to Earn</p>
            <p style="font-size:20px;font-weight:800;color:#0FB9B1;margin:0 0 3px;line-height:1.1;">Up to ${commissionStr}</p>
            <p style="font-size:10px;color:rgba(255,255,255,0.3);margin:0;">4% of annual CTC on placement</p>
          </td>` : ''}
        </tr>
      </table>
    </td></tr>` : ''}

    <!-- ── REQUIREMENTS ── -->
    ${criteria.length > 0 ? `
    <tr><td style="padding:0 28px 24px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E8EEF4;border-radius:12px;padding:18px 20px;">
        <tr><td>
          <p style="font-size:10px;font-weight:700;color:#475569;letter-spacing:0.12em;text-transform:uppercase;margin:0 0 14px;padding-bottom:10px;border-bottom:1px solid #F1F5F9;">Must-Have Requirements</p>
          <table width="100%" cellpadding="0" cellspacing="0">
            ${reqItems}
          </table>
        </td></tr>
      </table>
    </td></tr>` : ''}

    <!-- ── CTA ── -->
    <tr><td style="padding:4px 28px 32px;text-align:center;">
      <a href="${jobUrl}"
         style="display:inline-block;background:#0FB9B1;color:#ffffff;font-size:15px;font-weight:700;padding:15px 40px;border-radius:10px;text-decoration:none;letter-spacing:0.01em;line-height:1;">
        View Job &amp; Submit Candidate &rarr;
      </a>
      <p style="font-size:12px;color:#94A3B8;margin:14px 0 0;line-height:1.5;">
        Be among the first to submit &mdash; early candidates get priority attention from employers.
      </p>
    </td></tr>

    <!-- ── OTHER ROLES ── -->
    ${related.length > 0 ? `
    <tr><td style="padding:0 28px 28px;">
      <div style="height:1px;background:#F1F5F9;margin-bottom:20px;"></div>
      <p style="font-size:10px;font-weight:700;color:#475569;letter-spacing:0.12em;text-transform:uppercase;margin:0 0 12px;">Other Active Roles</p>
      <table width="100%" cellpadding="0" cellspacing="0">
        ${relatedCards}
      </table>
      <div style="text-align:center;margin-top:16px;">
        <a href="${jobUrl}" style="font-size:12px;font-weight:600;color:#0FB9B1;text-decoration:none;">Browse all open jobs on AlphaNom &rarr;</a>
      </div>
    </td></tr>` : ''}

    <!-- ── FOOTER ── -->
    <tr><td style="background:#F8FAFC;border-top:1px solid #E8EEF4;padding:18px 28px;border-radius:0 0 16px 16px;">
      <table width="100%" cellpadding="0" cellspacing="0"><tr>
        <td style="vertical-align:middle;">
          <p style="font-size:11px;color:#94A3B8;margin:0;line-height:1.6;">
            You're receiving this as a registered recruiter on <strong style="color:#64748B;">AlphaNom</strong> &mdash; India's Premium Recruitment Network.
          </p>
        </td>
        <td align="right" style="vertical-align:middle;padding-left:16px;white-space:nowrap;">
          <a href="${APP_URL}/recruiter/dashboard/profile" style="font-size:11px;color:#94A3B8;text-decoration:underline;">Preferences</a>
        </td>
      </tr></table>
    </td></tr>

  </table>
  </td></tr>
  <!-- ═══ END CARD ═══ -->

</table>
</td></tr>
</table>

</body>
</html>`
}

export async function notifyRecruitersNewJob(jobId: string): Promise<void> {
  const admin = createAdminClient()

  // Fetch job + employer
  const { data: job } = await admin
    .from('job_posts')
    .select('*, employers(company_name, industry)')
    .eq('id', jobId)
    .single()
  if (!job) return

  const employer = job.employers as any

  // Fetch 2 other active jobs (same dept first, fallback to any)
  let related: any[] = []
  if (job.department) {
    const { data: sameDept } = await admin
      .from('job_posts')
      .select('id, title, location, budget_max, employers(company_name)')
      .eq('status', 'active').eq('department', job.department).neq('id', jobId)
      .limit(2)
    related = sameDept ?? []
  }
  if (related.length < 2) {
    const { data: any2 } = await admin
      .from('job_posts')
      .select('id, title, location, budget_max, employers(company_name)')
      .eq('status', 'active').neq('id', jobId).not('id', 'in', `(${related.map(r => `'${r.id}'`).join(',')})`)
      .limit(2 - related.length)
    related = [...related, ...(any2 ?? [])]
  }

  // Fetch all recruiter emails
  const { data: recruiters } = await admin.from('recruiters').select('email, full_name')
  if (!recruiters?.length) return

  const html    = buildEmail(job, employer, related)
  const subject = `New Role: ${job.title} at ${employer?.company_name ?? 'a company'} — Submit & Earn${commission(job.budget_max) ? ` ${commission(job.budget_max)}` : ''}`

  // Resend batch send — max 100 per request
  const BATCH = 100
  for (let i = 0; i < recruiters.length; i += BATCH) {
    const chunk = recruiters.slice(i, i + BATCH)
    await resend.batch.send(
      chunk.map(r => ({
        from: `AlphaNom Jobs <${FROM_EMAIL}>`,
        to: r.email,
        subject,
        html,
      }))
    )
  }
}
