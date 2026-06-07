import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import StatusSelect from './StatusSelect'

const STATUS = {
  in_pipeline:     { bg: '#EEF3F8', color: '#5A7A9F', accent: '#96AFCA', label: 'In Pipeline' },
  shortlisted:     { bg: '#D8F0EB', color: '#0A9E97', accent: '#0FB9B1', label: 'Shortlisted ⭐' },
  saved_for_later: { bg: '#FFF8E7', color: '#B7791F', accent: '#F5A623', label: 'Saved for Later' },
  hired:           { bg: '#C6F6D5', color: '#276749', accent: '#22C55E', label: 'Hired ✓' },
  rejected:        { bg: '#FFF5F5', color: '#C53030', accent: '#FC8181', label: 'Not Selected' },
} as const

function initials(name: string) {
  return name.split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase()
}

function fmtCTC(paise: number) {
  const L = paise / 100000
  return L >= 1 ? `₹${L % 1 === 0 ? L : L.toFixed(1)}L` : `₹${Math.round(paise / 1000)}K`
}

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
    .select('id, candidate_name, email, current_ctc, current_location, total_experience, notice_period, resume_url, recruiter_note, status, submitted_at')
    .eq('job_post_id', jobId)
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
    { label: 'Total',       value: counts.total,     top: '#032655' },
    { label: 'In Pipeline', value: counts.pipeline,  top: '#96AFCA' },
    { label: 'Shortlisted', value: counts.shortlist, top: '#0FB9B1' },
    { label: 'Hired',       value: counts.hired,     top: '#22C55E' },
    { label: 'Not Selected',value: counts.rejected,  top: '#FC8181' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '2rem' }}>

      {/* ── Breadcrumb ─────────────────────────────────────── */}
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
          {job.location && <><span style={{ color: '#D0DBE8' }}>·</span><span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: '#5A7A9F' }}>{job.location}</span></>}
          {job.work_model && <><span style={{ color: '#D0DBE8' }}>·</span><span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 600, color: '#0A9E97', background: '#D8F0EB', padding: '2px 8px', borderRadius: '20px' }}>{job.work_model}</span></>}
        </div>
      </div>

      {/* ── Stats bar ──────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
        {STATS.map(s => (
          <div key={s.label} style={{
            background: '#fff', borderRadius: '12px',
            border: '1px solid #D0DBE8',
            borderTop: `3px solid ${s.top}`,
            padding: '14px 16px',
          }}>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.58rem', fontWeight: 700, color: '#96AFCA', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 8px' }}>
              {s.label}
            </p>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '1.75rem', fontWeight: 800, color: '#032655', lineHeight: 1, margin: 0 }}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* ── Empty state ────────────────────────────────────── */}
      {!all.length ? (
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #D0DBE8', padding: '80px 24px', textAlign: 'center' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: '#EEF3F8', border: '1px solid #D0DBE8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <svg width="26" height="26" fill="none" stroke="#96AFCA" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
          </div>
          <p style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: '0.95rem', color: '#032655', margin: '0 0 6px' }}>No applicants yet</p>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', color: '#96AFCA', margin: 0 }}>Recruiters haven't submitted candidates for this role yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {all.map((a) => {
            const st = STATUS[a.status as keyof typeof STATUS] ?? STATUS.in_pipeline
            const hasMetrics = a.current_location || a.total_experience != null || a.current_ctc != null || a.notice_period

            return (
              <div
                key={a.id}
                style={{
                  background: '#fff',
                  borderRadius: '16px',
                  border: '1px solid #D0DBE8',
                  borderLeft: `4px solid ${st.accent}`,
                  overflow: 'hidden',
                  boxShadow: '0 1px 4px rgba(3,38,85,0.06)',
                }}
              >
                {/* ── Section 1: Identity ──────────────────── */}
                <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  {/* Avatar — single brand color */}
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '12px', flexShrink: 0,
                    background: 'linear-gradient(135deg, #032655 0%, #0FB9B1 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(3,38,85,0.2)',
                  }}>
                    <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 800, fontSize: '1rem', color: '#fff', letterSpacing: '-0.02em' }}>
                      {initials(a.candidate_name)}
                    </span>
                  </div>

                  {/* Name + contacts */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ fontFamily: 'var(--font-ui)', fontSize: '1rem', fontWeight: 800, color: '#032655', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
                      {a.candidate_name}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                      {a.email && (
                        <a href={`mailto:${a.email}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-ui)', fontSize: '0.72rem', color: '#0FB9B1', textDecoration: 'none', fontWeight: 500 }}>
                          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                          {a.email}
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Status badge */}
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px', flexShrink: 0,
                    padding: '6px 14px', borderRadius: '99px',
                    background: st.bg, border: `1px solid ${st.accent}40`,
                  }}>
                    <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: st.accent }} />
                    <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', fontWeight: 700, color: st.color }}>
                      {st.label}
                    </span>
                  </div>
                </div>

                {/* ── Section 2: Metrics grid ──────────────── */}
                {hasMetrics && (
                  <div style={{ borderTop: '1px solid #EEF3F8', borderBottom: '1px solid #EEF3F8', display: 'flex' }}>
                    {[
                      a.current_location && {
                        icon: <svg width="13" height="13" fill="none" stroke="#5A7A9F" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>,
                        label: 'Location', value: a.current_location,
                      },
                      a.total_experience != null && {
                        icon: <svg width="13" height="13" fill="none" stroke="#5A7A9F" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>,
                        label: 'Experience', value: `${a.total_experience} yr${a.total_experience !== 1 ? 's' : ''}`,
                      },
                      a.current_ctc != null && {
                        icon: <svg width="13" height="13" fill="none" stroke="#5A7A9F" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
                        label: 'Current CTC', value: fmtCTC(a.current_ctc),
                      },
                      a.notice_period && {
                        icon: <svg width="13" height="13" fill="none" stroke="#5A7A9F" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>,
                        label: 'Notice Period', value: a.notice_period,
                      },
                    ].filter(Boolean).map((m: any, i, arr) => (
                      <div
                        key={m.label}
                        style={{
                          flex: 1,
                          padding: '12px 20px',
                          borderRight: i < arr.length - 1 ? '1px solid #EEF3F8' : 'none',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '4px' }}>
                          {m.icon}
                          <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.58rem', fontWeight: 700, color: '#96AFCA', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>
                            {m.label}
                          </span>
                        </div>
                        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.85rem', fontWeight: 700, color: '#032655', margin: 0 }}>
                          {m.value}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* ── Section 3: Recruiter note ────────────── */}
                {a.recruiter_note && (
                  <div style={{ padding: '16px 24px', borderBottom: '1px solid #EEF3F8' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                      <svg width="13" height="13" fill="none" stroke="#0A9E97" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                      </svg>
                      <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.6rem', fontWeight: 700, color: '#0A9E97', textTransform: 'uppercase' as const, letterSpacing: '0.1em' }}>
                        Recruiter's Note
                      </span>
                    </div>
                    <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', color: '#032655', lineHeight: 1.65, margin: 0, paddingLeft: '4px' }}>
                      {a.recruiter_note}
                    </p>
                  </div>
                )}

                {/* ── Section 4: Footer ────────────────────── */}
                <div style={{
                  padding: '12px 24px',
                  background: '#FAFCFE',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.68rem', color: '#96AFCA', fontWeight: 500 }}>
                      Submitted {new Date(a.submitted_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {a.resume_url && (
                      <a
                        href={a.resume_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: '6px',
                          padding: '7px 16px', borderRadius: '8px',
                          border: '1.5px solid #032655',
                          background: '#032655', color: '#fff',
                          textDecoration: 'none', fontFamily: 'var(--font-ui)',
                          fontSize: '0.72rem', fontWeight: 700,
                        }}
                      >
                        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                        View Resume
                      </a>
                    )}
                    <StatusSelect submissionId={a.id} jobId={jobId} currentStatus={a.status} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
