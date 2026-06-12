import { createClient }     from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link                   from 'next/link'
import ApplicantsLayout       from './ApplicantsLayout'

export default async function Page({ params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = await params
  const supabase  = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/employer/login')

  const { data: employer } = await supabase
    .from('employers').select('id').eq('user_id', user.id).single()

  const { data: job } = await supabase
    .from('job_posts')
    .select('id, title, department, location, work_model, status')
    .eq('id', jobId)
    .eq('employer_id', employer?.id)
    .single()

  if (!job) notFound()

  const { data: applicants } = await supabase
    .from('candidate_submissions')
    .select('id, candidate_name, email, phone, current_job_title, current_company, current_ctc, current_location, total_experience, notice_period, linkedin_url, portfolio_url, resume_url, recruiter_note, status, submitted_at')
    .eq('job_post_id', jobId)
    .or('consent_status.eq.consented,consent_status.is.null')
    .order('submitted_at', { ascending: false })

  const all = applicants ?? []

  const counts = {
    total:     all.length,
    pipeline:  all.filter(a => a.status === 'in_pipeline').length,
    shortlist: all.filter(a => a.status === 'shortlisted').length,
    hired:     all.filter(a => a.status === 'hired').length,
    rejected:  all.filter(a => a.status === 'rejected').length,
  }

  const STATS = [
    { label: 'Total',        value: counts.total,     accent: '#032655' },
    { label: 'In Pipeline',  value: counts.pipeline,  accent: '#96AFCA' },
    { label: 'Shortlisted',  value: counts.shortlist, accent: '#0FB9B1' },
    { label: 'Hired',        value: counts.hired,     accent: '#22C55E' },
    { label: 'Not Selected', value: counts.rejected,  accent: '#FC8181' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', paddingBottom: '2rem' }}>

      {/* ── Breadcrumb + title ─────────────────────────────── */}
      <div>
        <Link
          href={`/employer/dashboard/jobs/${jobId}`}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 600, color: '#96AFCA', textDecoration: 'none', marginBottom: '10px' }}
        >
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          {job.title}
        </Link>
        <h1 style={{ fontFamily: 'var(--font-ui)', fontSize: '1.5rem', fontWeight: 800, color: '#032655', letterSpacing: '-0.03em', margin: '0 0 4px' }}>
          Applicants
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: '#5A7A9F' }}>{job.title}</span>
          {job.location && (
            <><span style={{ color: '#D0DBE8' }}>·</span><span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: '#5A7A9F' }}>{job.location}</span></>
          )}
          {job.work_model && (
            <><span style={{ color: '#D0DBE8' }}>·</span>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 600, color: '#0A9E97', background: '#D8F0EB', padding: '2px 8px', borderRadius: '20px' }}>{job.work_model}</span></>
          )}
        </div>
      </div>

      {/* ── Stats bar ──────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
        {STATS.map(s => (
          <div key={s.label} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #D0DBE8', borderTop: `3px solid ${s.accent}`, padding: '12px 16px' }}>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.56rem', fontWeight: 700, color: '#96AFCA', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 6px' }}>
              {s.label}
            </p>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '1.6rem', fontWeight: 800, color: '#032655', lineHeight: 1, margin: 0 }}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* ── Two-panel layout ───────────────────────────────── */}
      <ApplicantsLayout applicants={all} jobId={jobId} />
    </div>
  )
}
