import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { closeJob } from '@/lib/employer/closeJob'
import { toggleJobPause } from '@/lib/employer/pauseJob'
import { reopenJob } from '@/lib/employer/reopenJob'

async function handleClose(jobId: string) {
  'use server'
  await closeJob(jobId)
  redirect('/employer/dashboard/jobs')
}

async function handlePause(jobId: string, currentStatus: string) {
  'use server'
  await toggleJobPause(jobId, currentStatus)
}

async function handleReopen(jobId: string) {
  'use server'
  await reopenJob(jobId)
}

/* Budget handles both old (LPA int) and new (rupees) storage formats */
function formatBudget(val: number | null): string | null {
  if (!val || val <= 0) return null
  if (val >= 100000) return `₹${(val / 100000).toFixed(0)}L`
  return `₹${val}L` // old format stored in LPA directly
}

/* Detect HTML content written by the rich-text editor */
function isHTML(text: string): boolean {
  return /<\/?(b|i|u|br|ul|ol|li|strong|em)\b[^>]*>/i.test(text)
}

/* Render recruiter_note — HTML (rich text editor) or plain text (legacy) */
function JobDescription({ text }: { text: string }) {
  if (isHTML(text)) {
    return (
      <>
        <div
          dangerouslySetInnerHTML={{ __html: text }}
          className="jd-html"
          style={{ fontFamily: 'var(--font-ui)', fontSize: '0.875rem', color: '#3D5A7A', lineHeight: 1.75 }}
        />
        <style>{`
          .jd-html b, .jd-html strong { font-weight: 700; }
          .jd-html i, .jd-html em { font-style: italic; }
          .jd-html u { text-decoration: underline; }
          .jd-html ul, .jd-html ol { margin: 6px 0; padding-left: 20px; }
          .jd-html li { margin: 3px 0; }
          .jd-html p { margin: 4px 0; }
        `}</style>
      </>
    )
  }

  /* Legacy plain-text rendering with bullet detection */
  const lines = text.split(/\n+/).map(l => l.trim()).filter(Boolean)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {lines.map((line, i) => {
        if (/^[-•*]\s/.test(line)) {
          return (
            <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#0FB9B1', flexShrink: 0, marginTop: '9px' }} />
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.875rem', color: '#3D5A7A', lineHeight: 1.75, margin: 0 }}>
                {line.replace(/^[-•*]\s/, '')}
              </p>
            </div>
          )
        }
        return (
          <p key={i} style={{ fontFamily: 'var(--font-ui)', fontSize: '0.875rem', color: '#3D5A7A', lineHeight: 1.75, margin: 0 }}>
            {line}
          </p>
        )
      })}
    </div>
  )
}

export default async function Page({ params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/employer/login')

  const { data: employer } = await supabase
    .from('employers').select('id, company_name').eq('user_id', user.id).single()

  const { data: job } = await supabase
    .from('job_posts').select('*')
    .eq('id', jobId).eq('employer_id', employer?.id).single()

  if (!job) notFound()

  const [
    { count: totalApplicants },
    { count: shortlisted },
    { count: hired },
  ] = await Promise.all([
    supabase.from('candidate_submissions').select('*', { count: 'exact', head: true }).eq('job_post_id', jobId).or('consent_status.eq.consented,consent_status.is.null'),
    supabase.from('candidate_submissions').select('*', { count: 'exact', head: true }).eq('job_post_id', jobId).eq('status', 'shortlisted').or('consent_status.eq.consented,consent_status.is.null'),
    supabase.from('candidate_submissions').select('*', { count: 'exact', head: true }).eq('job_post_id', jobId).eq('status', 'hired').or('consent_status.eq.consented,consent_status.is.null'),
  ])

  const isClosed    = job.status === 'closed'
  const isPaused    = job.status === 'paused'
  const isAutoPaused = isPaused && !!job.auto_paused
  const budgetMin  = formatBudget(job.budget_min)
  const budgetMax  = formatBudget(job.budget_max)
  const hasBudget  = budgetMin || budgetMax
  const postedDate = new Date(job.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

  const hasCriteria    = job.mandatory_criteria?.length > 0
  const hasPreferred   = job.preferred_criteria?.length > 0
  const hasCompanies   = job.preferred_companies?.length > 0
  const hasDescription = !!job.recruiter_note

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* Breadcrumb */}
      <div style={{ flexShrink: 0, marginBottom: '14px' }}>
        <Link href="/employer/dashboard/jobs" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 600, color: '#96AFCA', textDecoration: 'none' }}>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          All Jobs
        </Link>
      </div>

      {/* Auto-paused banner */}
      {isAutoPaused && (
        <div style={{ flexShrink: 0, background: '#FFF8E7', border: '1px solid #F6E05E', borderRadius: '12px', padding: '14px 18px', display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '4px' }}>
          <svg width="16" height="16" fill="none" stroke="#D69E2E" strokeWidth={2} viewBox="0 0 24 24" style={{ flexShrink: 0, marginTop: '1px' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.008v.008H12v-.008z" />
          </svg>
          <div>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', fontWeight: 700, color: '#B7791F', margin: '0 0 3px' }}>
              Application limit reached — job auto-paused
            </p>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', color: '#975A16', margin: 0, lineHeight: 1.5 }}>
              This job received {job.application_limit} submission{job.application_limit !== 1 ? 's' : ''} and was automatically paused.
              Click &ldquo;Reopen for More Applications&rdquo; to accept new submissions (limit will be cleared).
            </p>
          </div>
        </div>
      )}

      {/* Scrollable content */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '4px' }}>

        {/* ── Header card ───────────────────────────────────────────────── */}
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #D0DBE8', overflow: 'hidden', flexShrink: 0 }}>
          {/* Top accent bar */}
          <div style={{ height: '3px', background: (isClosed || isPaused) ? '#EEF3F8' : 'linear-gradient(90deg, #032655, #0FB9B1)' }} />

          <div style={{ padding: '20px 24px' }}>
            {/* Row 1 — company + status + actions */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {employer?.company_name && (
                  <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 600, color: '#96AFCA' }}>
                    {employer.company_name}
                  </span>
                )}
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '5px',
                  fontFamily: 'var(--font-ui)', fontSize: '0.58rem', fontWeight: 800,
                  letterSpacing: '0.1em', textTransform: 'uppercase' as const,
                  color: isClosed ? '#5A7A9F' : isPaused ? '#B7791F' : '#0A9E97',
                  background: isClosed ? '#EEF3F8' : isPaused ? '#FFF8E7' : '#D8F0EB',
                  border: `1px solid ${isClosed ? '#D0DBE8' : isPaused ? '#F6E05E' : 'rgba(15,185,177,0.3)'}`,
                  borderRadius: '6px', padding: '3px 9px',
                }}>
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: isClosed ? '#96AFCA' : isPaused ? '#D69E2E' : '#0FB9B1' }} />
                  {job.status ?? 'active'}
                </span>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
                <Link href={`/employer/dashboard/jobs/${jobId}/edit`} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '9px', background: '#fff', border: '1.5px solid #D0DBE8', color: '#032655', fontFamily: 'var(--font-ui)', fontSize: '0.75rem', fontWeight: 700, textDecoration: 'none' }}>
                  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>
                  Edit
                </Link>
                <Link href={`/employer/dashboard/jobs/${jobId}/applicants`} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '9px', background: '#032655', color: '#fff', fontFamily: 'var(--font-ui)', fontSize: '0.75rem', fontWeight: 700, textDecoration: 'none' }}>
                  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
                  View Applicants
                  {(totalApplicants ?? 0) > 0 && (
                    <span style={{ background: '#0FB9B1', color: '#fff', borderRadius: '10px', fontSize: '0.6rem', fontWeight: 800, padding: '1px 7px' }}>{totalApplicants}</span>
                  )}
                </Link>
                {!isClosed && (
                  isAutoPaused ? (
                    <form action={handleReopen.bind(null, jobId)}>
                      <button type="submit" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '8px 14px', borderRadius: '9px', background: '#D8F0EB', color: '#0A9E97', border: '1px solid rgba(15,185,177,0.35)', fontFamily: 'var(--font-ui)', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>
                        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z" /></svg>
                        Reopen for More Applications
                      </button>
                    </form>
                  ) : (
                    <form action={handlePause.bind(null, jobId, job.status)}>
                      <button type="submit" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '8px 14px', borderRadius: '9px', background: isPaused ? '#D8F0EB' : '#FFF8E7', color: isPaused ? '#0A9E97' : '#B7791F', border: `1px solid ${isPaused ? 'rgba(15,185,177,0.35)' : '#F6E05E'}`, fontFamily: 'var(--font-ui)', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>
                        {isPaused ? (
                          <>
                            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z" /></svg>
                            Resume Job
                          </>
                        ) : (
                          <>
                            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" /></svg>
                            Pause Job
                          </>
                        )}
                      </button>
                    </form>
                  )
                )}
                {!isClosed && (
                  <form action={handleClose.bind(null, jobId)}>
                    <button type="submit" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '8px 14px', borderRadius: '9px', background: '#FFF5F5', color: '#E53E3E', border: '1px solid #FEB2B2', fontFamily: 'var(--font-ui)', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>
                      <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                      Close Job
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Row 2 — title */}
            <h1 style={{ fontFamily: 'var(--font-ui)', fontSize: '1.5rem', fontWeight: 800, color: '#032655', letterSpacing: '-0.025em', lineHeight: 1.15, margin: '0 0 14px' }}>
              {job.title}
            </h1>

            {/* Row 3 — meta chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '7px', alignItems: 'center' }}>
              {job.department && <MetaChip icon="dept">{job.department}</MetaChip>}
              {job.location   && <MetaChip icon="loc">{job.location}</MetaChip>}
              {job.work_model && <MetaChip icon="work">{job.work_model}</MetaChip>}
              {job.notice_period && <MetaChip icon="clock">{job.notice_period} notice</MetaChip>}
              {hasBudget && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 700, color: '#0A9E97', background: '#D8F0EB', border: '1px solid rgba(15,185,177,0.25)', borderRadius: '7px', padding: '5px 11px' }}>
                  <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {budgetMin} – {budgetMax} PA
                </span>
              )}
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', color: '#B0BEC5', marginLeft: '2px' }}>
                Posted {postedDate}
              </span>
            </div>
          </div>
        </div>

        {/* ── Pipeline strip ────────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: `1fr 1fr 1fr${job.application_limit ? ' 1fr' : ''} auto`, gap: '10px', flexShrink: 0 }}>
          {[
            { label: 'Total Submitted', value: totalApplicants ?? 0, color: '#5A7A9F', bg: '#EEF3F8', border: '#D0DBE8' },
            { label: 'Shortlisted',     value: shortlisted ?? 0,    color: '#0A9E97', bg: '#D8F0EB', border: 'rgba(15,185,177,0.25)' },
            { label: 'Hired',           value: hired ?? 0,          color: '#276749', bg: '#C6F6D5', border: 'rgba(39,103,73,0.2)' },
          ].map(s => (
            <div key={s.label} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: '12px', padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 600, color: s.color }}>{s.label}</span>
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: '1.4rem', fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</span>
            </div>
          ))}
          {job.application_limit && (
            <div style={{ background: isAutoPaused ? '#FFF8E7' : '#F5F8FC', border: `1px solid ${isAutoPaused ? '#F6E05E' : '#D0DBE8'}`, borderRadius: '12px', padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 600, color: isAutoPaused ? '#B7791F' : '#5A7A9F' }}>Application Cap</span>
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: '1.4rem', fontWeight: 800, color: isAutoPaused ? '#D69E2E' : '#032655', lineHeight: 1 }}>
                {totalApplicants ?? 0}<span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#96AFCA' }}>/{job.application_limit}</span>
              </span>
            </div>
          )}
          {/* JD PDF if exists */}
          {job.jd_pdf_url ? (
            <a href={job.jd_pdf_url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#fff', border: '1px solid #D0DBE8', borderRadius: '12px', padding: '14px 18px', color: '#032655', textDecoration: 'none', whiteSpace: 'nowrap' as const }}>
              <svg width="16" height="16" fill="none" stroke="#E53E3E" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
              <div>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 700, color: '#032655', margin: 0, lineHeight: 1 }}>JD Document</p>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.6rem', color: '#96AFCA', margin: '2px 0 0' }}>View PDF ↗</p>
              </div>
            </a>
          ) : (
            <div />
          )}
        </div>

        {/* ── Requirements — side by side ───────────────────────────────── */}
        {(hasCriteria || hasPreferred) && (
          <div style={{ display: 'grid', gridTemplateColumns: hasCriteria && hasPreferred ? '1fr 1fr' : '1fr', gap: '12px', flexShrink: 0 }}>

            {hasCriteria && (
              <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #D0DBE8', padding: '20px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                  <div style={{ width: '3px', height: '16px', background: '#032655', borderRadius: '2px' }} />
                  <h2 style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 800, color: '#032655', textTransform: 'uppercase' as const, letterSpacing: '0.1em', margin: 0 }}>Must-Have Requirements</h2>
                  <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.6rem', fontWeight: 700, color: '#0A9E97', background: '#D8F0EB', borderRadius: '10px', padding: '1px 7px' }}>{job.mandatory_criteria.length}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                  {job.mandatory_criteria.map((item: string, i: number) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '9px', padding: '8px 12px', background: '#F5F8FC', borderRadius: '8px', border: '1px solid #EEF3F8' }}>
                      <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#D8F0EB', border: '1px solid rgba(15,185,177,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <svg width="9" height="9" fill="none" stroke="#0A9E97" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                      </div>
                      <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.8rem', fontWeight: 600, color: '#032655' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {hasPreferred && (
              <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #D0DBE8', padding: '20px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                  <div style={{ width: '3px', height: '16px', background: '#96AFCA', borderRadius: '2px' }} />
                  <h2 style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 800, color: '#032655', textTransform: 'uppercase' as const, letterSpacing: '0.1em', margin: 0 }}>Good to Have</h2>
                  <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.6rem', fontWeight: 700, color: '#5A7A9F', background: '#EEF3F8', borderRadius: '10px', padding: '1px 7px' }}>{job.preferred_criteria.length}</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '8px' }}>
                  {job.preferred_criteria.map((item: string, i: number) => (
                    <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: '#F5F8FC', color: '#3D5A7A', border: '1px solid #D0DBE8', borderRadius: '8px', padding: '6px 12px', fontFamily: 'var(--font-ui)', fontSize: '0.78rem', fontWeight: 600 }}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Preferred Companies ───────────────────────────────────────── */}
        {hasCompanies && (
          <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #D0DBE8', padding: '20px 24px', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <div style={{ width: '3px', height: '16px', background: '#0FB9B1', borderRadius: '2px' }} />
              <h2 style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 800, color: '#032655', textTransform: 'uppercase' as const, letterSpacing: '0.1em', margin: 0 }}>Preferred Company Backgrounds</h2>
            </div>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', color: '#96AFCA', margin: '0 0 12px' }}>Candidates from these companies are particularly welcome.</p>
            <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '8px' }}>
              {job.preferred_companies.map((item: string, i: number) => (
                <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#D8F0EB', color: '#0A9E97', border: '1px solid rgba(15,185,177,0.25)', borderRadius: '8px', padding: '6px 12px', fontFamily: 'var(--font-ui)', fontSize: '0.78rem', fontWeight: 700 }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0FB9B1' }} />
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ── Job Description (below requirements) ─────────────────────── */}
        {hasDescription && (
          <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #D0DBE8', padding: '20px 24px', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <div style={{ width: '3px', height: '16px', background: '#0FB9B1', borderRadius: '2px' }} />
              <h2 style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 800, color: '#032655', textTransform: 'uppercase' as const, letterSpacing: '0.1em', margin: 0 }}>Job Description</h2>
            </div>
            <JobDescription text={job.recruiter_note} />
          </div>
        )}

        {/* ── Empty state ───────────────────────────────────────────────── */}
        {!hasDescription && !hasCriteria && !hasPreferred && !hasCompanies && (
          <div style={{ background: '#fff', borderRadius: '14px', border: '1px dashed #D0DBE8', padding: '36px 24px', textAlign: 'center', flexShrink: 0 }}>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', color: '#96AFCA', margin: 0 }}>
              No job description or requirements added. Consider editing this post to add more detail for recruiters.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Meta chip helper ─────────────────────────────────────────────────────── */
function MetaChip({ icon, children }: { icon: string; children: React.ReactNode }) {
  const icons: Record<string, React.ReactNode> = {
    dept: <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6z" /></svg>,
    loc:  <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>,
    work: <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18h16.5a1.5 1.5 0 011.5 1.5v11.25a1.5 1.5 0 01-1.5 1.5H3.75a1.5 1.5 0 01-1.5-1.5V4.5a1.5 1.5 0 011.5-1.5z" /></svg>,
    clock:<svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  }
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 600, color: '#5A7A9F', background: '#F5F8FC', border: '1px solid #D0DBE8', borderRadius: '7px', padding: '5px 11px' }}>
      {icons[icon]}
      {children}
    </span>
  )
}
