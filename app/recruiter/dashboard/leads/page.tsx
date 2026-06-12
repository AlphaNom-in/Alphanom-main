import { createClient }      from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect }          from 'next/navigation'
import { SubmitCandidateButton, RejectButton } from './LeadsActions'
import JobFilter from './JobFilter'

const STATUS_LABEL: Record<string, { label: string; bg: string; color: string }> = {
  new:          { label: 'New',          bg: '#EEF3F8', color: '#032655' },
  consent_sent: { label: 'Consent Sent', bg: '#FFF7ED', color: '#C2410C' },
  consented:    { label: 'Consented',    bg: '#DCFCE7', color: '#15803D' },
  rejected:     { label: 'Rejected',     bg: '#FEF2F2', color: '#DC2626' },
}

function fmtCTC(paise: number | null | undefined) {
  if (paise == null) return null
  return `₹${(paise / 100000).toFixed(1)} LPA`
}
function fmtDate(iso: string | null | undefined) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ job?: string; status?: string }>
}) {
  const { job: jobFilter, status: statusFilter } = await searchParams

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/recruiter/login')

  const { data: recruiter } = await supabase
    .from('recruiters').select('id').eq('user_id', user.id).single()
  if (!recruiter) redirect('/recruiter/login')

  const admin = createAdminClient()

  let query = admin
    .from('recruiter_leads')
    .select(`
      id, applicant_name, email, phone,
      current_job_title, current_company,
      current_ctc, current_location,
      total_experience, notice_period,
      linkedin_url, portfolio_url, resume_url,
      cover_note, status, applied_at,
      job_post_id, job_posts(id, title, employers(company_name))
    `)
    .eq('recruiter_id', recruiter.id)
    .order('applied_at', { ascending: false })

  if (jobFilter) query = query.eq('job_post_id', jobFilter)
  if (statusFilter && statusFilter !== 'all') query = query.eq('status', statusFilter)

  const { data: leads } = await query

  const { data: shareLinks } = await admin
    .from('recruiter_share_links')
    .select('job_post_id, job_posts(id, title)')
    .eq('recruiter_id', recruiter.id)

  const jobs = (shareLinks ?? [])
    .map((l: any) => ({ id: l.job_post_id as string, title: l.job_posts?.title as string }))
    .filter(j => j.id && j.title)

  const counts = {
    all:          (leads ?? []).length,
    new:          (leads ?? []).filter(l => l.status === 'new').length,
    consent_sent: (leads ?? []).filter(l => l.status === 'consent_sent').length,
    consented:    (leads ?? []).filter(l => l.status === 'consented').length,
    rejected:     (leads ?? []).filter(l => l.status === 'rejected').length,
  }

  const activeStatus = statusFilter || 'all'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '16px' }}>

      {/* Page header */}
      <div style={{ flexShrink: 0 }}>
        <h1 style={{ fontFamily: 'var(--font-ui)', fontSize: '1.15rem', fontWeight: 800, color: '#032655', margin: '0 0 4px', letterSpacing: '-0.02em' }}>My Leads</h1>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: '#96AFCA', margin: 0 }}>
          Candidates who applied via your public share links
        </p>
      </div>

      {/* Filters */}
      <div style={{ flexShrink: 0, display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
        {(['all', 'new', 'consent_sent', 'consented', 'rejected'] as const).map(s => {
          const isActive = activeStatus === s
          const sp = new URLSearchParams(s !== 'all' ? { status: s } : {})
          if (jobFilter) sp.set('job', jobFilter)
          return (
            <a
              key={s}
              href={`/recruiter/dashboard/leads?${sp.toString()}`}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '5px',
                padding: '6px 12px', borderRadius: '8px', textDecoration: 'none',
                fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 700,
                background: isActive ? '#032655' : '#fff',
                color: isActive ? '#fff' : '#5A7A9F',
                border: isActive ? '1.5px solid #032655' : '1.5px solid #D0DBE8',
              }}
            >
              {s === 'all' ? 'All' : STATUS_LABEL[s]?.label ?? s}
              <span style={{ background: isActive ? 'rgba(255,255,255,0.2)' : '#EEF3F8', borderRadius: '10px', padding: '1px 6px', fontSize: '0.62rem', fontWeight: 800 }}>
                {counts[s]}
              </span>
            </a>
          )
        })}
        {jobs.length > 0 && (
          <div style={{ marginLeft: 'auto' }}>
            <JobFilter jobs={jobs} currentJob={jobFilter} />
          </div>
        )}
      </div>

      {/* Lead cards */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '4px' }}>
        {!leads?.length ? (
          <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #D0DBE8', padding: '48px', textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.88rem', color: '#96AFCA', margin: 0 }}>
              {activeStatus === 'all'
                ? 'No leads yet. Share your application link to start receiving candidates.'
                : `No ${STATUS_LABEL[activeStatus]?.label ?? activeStatus} leads.`}
            </p>
          </div>
        ) : leads.map(lead => {
          const st          = STATUS_LABEL[lead.status] ?? { label: lead.status, bg: '#EEF3F8', color: '#5A7A9F' }
          const canAct      = lead.status === 'new'
          const canResub    = lead.status === 'consent_sent'
          const jobPost     = lead.job_posts as any
          const jobTitle    = jobPost?.title ?? '—'
          const companyName = jobPost?.employers?.company_name ?? null
          const ctc         = fmtCTC(lead.current_ctc)

          return (
            <div
              key={lead.id}
              style={{ background: '#fff', borderRadius: '14px', border: '1.5px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 1px 6px rgba(3,38,85,0.05)' }}
            >
              {/* ── Job post banner ──────────────────────────────────────── */}
              <div style={{ background: '#F5F8FC', borderBottom: '1px solid #EEF3F8', padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0FB9B1', flexShrink: 0 }} />
                  <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', fontWeight: 700, color: '#96AFCA', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Applied for
                  </span>
                  <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.84rem', fontWeight: 800, color: '#032655', letterSpacing: '-0.01em' }}>
                    {jobTitle}
                  </span>
                  {companyName && (
                    <>
                      <span style={{ color: '#D0DBE8', fontSize: '0.75rem' }}>·</span>
                      <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', fontWeight: 600, color: '#5A7A9F' }}>
                        {companyName}
                      </span>
                    </>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.6rem', color: '#96AFCA' }}>
                    {fmtDate(lead.applied_at)}
                  </span>
                  <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.62rem', fontWeight: 700, color: st.color, background: st.bg, padding: '3px 9px', borderRadius: '20px' }}>
                    {st.label}
                  </span>
                </div>
              </div>

              {/* ── Card body ────────────────────────────────────────────── */}
              <div style={{ padding: '18px 20px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>

                {/* Avatar */}
                <div style={{ width: '44px', height: '44px', borderRadius: '11px', background: 'linear-gradient(135deg,#032655 0%,#0FB9B1 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', fontWeight: 800, color: '#fff' }}>
                    {lead.applicant_name.split(' ').filter(Boolean).map((w: string) => w[0]).slice(0, 2).join('')}
                  </span>
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  {/* Name + current role */}
                  <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.95rem', fontWeight: 800, color: '#032655', margin: '0 0 2px', letterSpacing: '-0.01em' }}>
                    {lead.applicant_name}
                  </p>
                  {(lead.current_job_title || lead.current_company) && (
                    <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', color: '#5A7A9F', margin: '0 0 12px' }}>
                      {lead.current_job_title}
                      {lead.current_job_title && lead.current_company && ' · '}
                      {lead.current_company}
                    </p>
                  )}

                  {/* Metrics grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '8px', marginBottom: '12px' }}>
                    {[
                      { label: 'Current CTC',  value: ctc },
                      { label: 'Experience',   value: lead.total_experience != null ? `${lead.total_experience} yrs` : null },
                      { label: 'Notice Period',value: lead.notice_period },
                      { label: 'Location',     value: lead.current_location },
                    ].filter(m => m.value).map(m => (
                      <div key={m.label} style={{ background: '#F5F8FC', border: '1px solid #EEF3F8', borderRadius: '8px', padding: '8px 10px' }}>
                        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.55rem', fontWeight: 700, color: '#96AFCA', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 2px' }}>{m.label}</p>
                        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.8rem', fontWeight: 700, color: '#032655', margin: 0 }}>{m.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Contact + links */}
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '12px' }}>
                    <a href={`mailto:${lead.email}`} style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', color: '#5A7A9F', textDecoration: 'none', background: '#EEF3F8', padding: '4px 10px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/></svg>
                      {lead.email}
                    </a>
                    <a href={`tel:${lead.phone}`} style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', color: '#5A7A9F', textDecoration: 'none', background: '#EEF3F8', padding: '4px 10px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"/></svg>
                      {lead.phone}
                    </a>
                    {lead.linkedin_url && (
                      <a href={lead.linkedin_url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', color: '#0A66C2', textDecoration: 'none', background: '#EBF4FF', padding: '4px 10px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                        LinkedIn
                      </a>
                    )}
                    {lead.portfolio_url && (
                      <a href={lead.portfolio_url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', color: '#5A7A9F', textDecoration: 'none', background: '#EEF3F8', padding: '4px 10px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"/></svg>
                        Portfolio
                      </a>
                    )}
                    {lead.resume_url && (
                      <a href={lead.resume_url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 700, color: '#0A9E97', textDecoration: 'none', background: '#F0FBF9', border: '1px solid rgba(15,185,177,0.25)', padding: '5px 12px', borderRadius: '7px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/></svg>
                        View Resume
                      </a>
                    )}
                  </div>

                  {/* Cover note */}
                  {lead.cover_note && (
                    <div style={{ marginBottom: '14px', padding: '10px 14px', background: '#F5F8FC', borderRadius: '8px', borderLeft: '3px solid #D0DBE8' }}>
                      <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.6rem', fontWeight: 700, color: '#96AFCA', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 5px' }}>Cover Note</p>
                      <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', color: '#5A7A9F', margin: 0, lineHeight: 1.65 }}>
                        {lead.cover_note}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  {(canAct || canResub) && (
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                      <SubmitCandidateButton
                        leadId={lead.id}
                        status={lead.status}
                        candidateEmail={lead.email}
                      />
                      {canAct && <RejectButton leadId={lead.id} />}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
