'use server'

import { createClient }      from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath }    from 'next/cache'
import { sendBrevoEmail }    from '@/lib/email/brevo'
import { recruiterStatusUpdateEmailHtml } from '@/lib/email/templates'

export async function updateCandidateStatus(
  submissionId: string,
  status: string,
  jobId: string
) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  // Verify this employer owns the job the submission belongs to
  const { data: employer } = await supabase
    .from('employers').select('id').eq('user_id', user.id).single()
  if (!employer) throw new Error('Employer not found')

  const { data: job } = await supabase
    .from('job_posts').select('id')
    .eq('id', jobId)
    .eq('employer_id', employer.id)
    .single()
  if (!job) throw new Error('Job not found')

  const admin = createAdminClient()

  // Update candidate status
  const { error } = await admin
    .from('candidate_submissions')
    .update({ status })
    .eq('id', submissionId)
    .eq('job_post_id', jobId)

  if (error) throw error

  revalidatePath(`/employer/dashboard/jobs/${jobId}/applicants`)
  revalidatePath(`/employer/dashboard/jobs/${jobId}`)
  revalidatePath('/employer/dashboard/jobs')
  revalidatePath('/employer/dashboard')
  revalidatePath('/recruiter/dashboard/all-jobs')
  revalidatePath('/recruiter/dashboard/my-jobs')

  // In-app + email notification → recruiter (non-blocking)
  ;(async () => {
    const [{ data: sub }, { data: jobPost }] = await Promise.all([
      admin.from('candidate_submissions').select('candidate_name, recruiter_id').eq('id', submissionId).single(),
      admin.from('job_posts').select('title, employers(company_name)').eq('id', jobId).single(),
    ])
    if (!sub?.recruiter_id) return

    const { data: recruiterProfile } = await admin
      .from('recruiters')
      .select('user_id, email, full_name')
      .eq('id', sub.recruiter_id)
      .single()
    if (!recruiterProfile?.user_id) return

    const cand        = sub.candidate_name
    const role        = jobPost?.title ?? 'a role'
    const companyName = (jobPost?.employers as any)?.company_name ?? 'the employer'
    const base        = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://alphanom.in'
    const dashboardUrl = `${base}/recruiter/dashboard/my-jobs/${jobId}`

    type StatusConfig = {
      label: string; badgeBg: string; badgeColor: string; accentColor: string
      notifTitle: string; heading: string; message: string; subject: string
    }

    const STATUS_CFG: Record<string, StatusConfig> = {
      shortlisted: {
        label:       'Shortlisted',
        badgeBg:     '#D8F0EB', badgeColor: '#0A9E97', accentColor: '#0FB9B1',
        notifTitle:  `${cand} was shortlisted`,
        heading:     `${cand} has been shortlisted`,
        message:     `your submission for the ${role} role at ${companyName} has been moved to the shortlist. The employer is seriously considering this candidate.`,
        subject:     `${cand} shortlisted — ${role} at ${companyName}`,
      },
      hired: {
        label:       'Hired',
        badgeBg:     '#C6F6D5', badgeColor: '#276749', accentColor: '#0FB9B1',
        notifTitle:  `${cand} was hired — congratulations`,
        heading:     `${cand} has been hired`,
        message:     `${cand} has been officially selected for the ${role} role at ${companyName}. This is a successful placement — well done!`,
        subject:     `Placement confirmed: ${cand} hired for ${role} at ${companyName}`,
      },
      in_review: {
        label:       'Under Review',
        badgeBg:     '#EEF3F8', badgeColor: '#5A7A9F', accentColor: '#5A7A9F',
        notifTitle:  `${cand} is under review`,
        heading:     `${cand} is under active review`,
        message:     `the employer is currently evaluating ${cand}'s profile for the ${role} role at ${companyName}. No action needed from you right now.`,
        subject:     `Update: ${cand} is under review — ${role} at ${companyName}`,
      },
      saved_for_later: {
        label:       'Saved for Later',
        badgeBg:     '#FFF8E7', badgeColor: '#B7791F', accentColor: '#D69E2E',
        notifTitle:  `${cand} was saved for later`,
        heading:     `${cand} has been saved for later`,
        message:     `the employer has saved ${cand}'s profile for the ${role} role at ${companyName} to revisit later. This is often a positive signal — stay tuned.`,
        subject:     `${cand} saved for later — ${role} at ${companyName}`,
      },
      rejected: {
        label:       'Not Selected',
        badgeBg:     '#F5F8FC', badgeColor: '#96AFCA', accentColor: '#D0DBE8',
        notifTitle:  `${cand} was not selected`,
        heading:     `Update on ${cand}`,
        message:     `the employer has decided not to move forward with ${cand} for the ${role} role at ${companyName} at this time. Use this as feedback to refine future submissions.`,
        subject:     `Update on ${cand} — ${role} at ${companyName}`,
      },
      in_pipeline: {
        label:       'In Pipeline',
        badgeBg:     '#EEF3F8', badgeColor: '#5A7A9F', accentColor: '#5A7A9F',
        notifTitle:  `${cand} moved back to pipeline`,
        heading:     `${cand} is back in the pipeline`,
        message:     `${cand}'s profile for the ${role} role at ${companyName} has been moved back into the active pipeline by the employer.`,
        subject:     `${cand} back in pipeline — ${role} at ${companyName}`,
      },
    }

    const cfg = STATUS_CFG[status] ?? {
      label:       status,
      badgeBg:     '#EEF3F8', badgeColor: '#5A7A9F', accentColor: '#96AFCA',
      notifTitle:  `${cand} status updated`,
      heading:     `Update on ${cand}`,
      message:     `${cand}'s status for the ${role} role has been updated to ${status}.`,
      subject:     `Update on ${cand} — ${role}`,
    }

    const firstName = (recruiterProfile.full_name ?? 'there').split(' ')[0]

    // In-app notification
    await admin.from('notifications').insert({
      user_id: recruiterProfile.user_id,
      type:    'status_update',
      title:   cfg.notifTitle,
      body:    `${cand} for "${role}" · ${cfg.label}`,
      link:    `/recruiter/dashboard/my-jobs/${jobId}`,
    })

    // Email notification
    if (recruiterProfile.email) {
      await sendBrevoEmail({
        to:       recruiterProfile.email,
        toName:   recruiterProfile.full_name ?? undefined,
        subject:  cfg.subject,
        html:     recruiterStatusUpdateEmailHtml({
          recruiterFirstName: firstName,
          candidateName:      cand,
          jobTitle:           role,
          companyName,
          statusLabel:        cfg.label,
          badgeBg:            cfg.badgeBg,
          badgeColor:         cfg.badgeColor,
          accentColor:        cfg.accentColor,
          heading:            cfg.heading,
          message:            cfg.message,
          dashboardUrl,
        }),
        fromName: 'AlphaNom',
      }).catch(err => console.error('[Status email]', err))
    }
  })().catch(err => console.error('[Status notification]', err))
}
