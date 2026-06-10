import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  in_pipeline:     { bg: '#EEF3F8', color: '#5A7A9F', label: 'In Pipeline' },
  shortlisted:     { bg: '#D8F0EB', color: '#0A9E97', label: 'Shortlisted' },
  saved_for_later: { bg: '#FFF8E7', color: '#B7791F', label: 'Saved for Later' },
  hired:           { bg: '#C6F6D5', color: '#276749', label: 'Hired ✓' },
  rejected:        { bg: '#FFF5F5', color: '#E53E3E', label: 'Rejected' },
}

export default async function Page() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/recruiter/login')

  const { data: recruiter } = await supabase
    .from('recruiters').select('*').eq('user_id', user.id).single()

  if (!recruiter) redirect('/recruiter/login')

  const [
    { count: savedJobs },
    { count: submissions },
    { count: shortlisted },
    { count: hired },
    { count: inPipeline },
    { data: recentSubmissions },
    { data: savedJobsList },
  ] = await Promise.all([
    supabase.from('recruiter_saved_jobs').select('*', { count: 'exact', head: true }).eq('recruiter_id', recruiter.id),
    supabase.from('candidate_submissions').select('*', { count: 'exact', head: true }).eq('recruiter_id', recruiter.id),
    supabase.from('candidate_submissions').select('*', { count: 'exact', head: true }).eq('recruiter_id', recruiter.id).eq('status', 'shortlisted'),
    supabase.from('candidate_submissions').select('*', { count: 'exact', head: true }).eq('recruiter_id', recruiter.id).eq('status', 'hired'),
    supabase.from('candidate_submissions').select('*', { count: 'exact', head: true }).eq('recruiter_id', recruiter.id).eq('status', 'in_pipeline'),
    supabase.from('candidate_submissions')
      .select('id, candidate_name, status, submitted_at, job_posts(title)')
      .eq('recruiter_id', recruiter.id)
      .order('submitted_at', { ascending: false })
      .limit(8),
    supabase.from('recruiter_saved_jobs')
      .select('id, job_posts(id, title, location, work_model)')
      .eq('recruiter_id', recruiter.id)
      .order('saved_at', { ascending: false })
      .limit(5),
  ])

  const total        = submissions ?? 0
  const shortNum     = shortlisted ?? 0
  const hiredNum     = hired ?? 0
  const pipelineNum  = inPipeline ?? 0
  const nameFirst    = recruiter.full_name?.split(' ')[0] ?? 'Recruiter'
  const initial      = (recruiter.full_name ?? 'R')[0].toUpperCase()
  const specs        = (recruiter.specialization as string[] | null) ?? []

  const pipeline = [
    { label: 'In Pipeline', value: pipelineNum, color: '#5A7A9F' },
    { label: 'Shortlisted', value: shortNum,    color: '#0A9E97' },
    { label: 'Hired',       value: hiredNum,    color: '#276749' },
  ]

  const metrics = [
    {
      label: 'Saved Jobs', value: savedJobs ?? 0, iconBg: '#EEF3F8',
      icon: <svg width="14" height="14" fill="none" stroke="#5A7A9F" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" /></svg>,
    },
    {
      label: 'Submissions', value: total, iconBg: '#EEF3F8',
      icon: <svg width="14" height="14" fill="none" stroke="#5A7A9F" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>,
    },
    {
      label: 'Shortlisted', value: shortNum, iconBg: '#D8F0EB',
      icon: <svg width="14" height="14" fill="none" stroke="#0A9E97" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>,
    },
    {
      label: 'Roles Closed', value: recruiter.total_roles_closed ?? 0, iconBg: '#C6F6D5',
      icon: <svg width="14" height="14" fill="none" stroke="#276749" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    },
  ]

  return (
    <div className="rdash-page-root" style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '14px' }}>

      {/* ── Verification pending banner ────────────────────────────────── */}
      {!recruiter.is_verified && (
        <div style={{ flexShrink: 0, background: '#F0F4FF', border: '1px solid #C7D7F4', borderRadius: '12px', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '34px', height: '34px', borderRadius: '9px', background: '#E0EAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="16" height="16" fill="none" stroke="#3B5FCC" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', fontWeight: 700, color: '#1E3A8A', margin: '0 0 3px' }}>
              Account verification pending
            </p>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', color: '#3B5FCC', margin: 0, lineHeight: 1.5 }}>
              Your account is under review by the AlphaNom admin team. Candidate submission will be unlocked once your account is approved.
            </p>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '7px', background: '#E0EAFC', border: '1px solid #C7D7F4', flexShrink: 0 }}>
            <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#F5A623' }} />
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', fontWeight: 700, color: '#3B5FCC' }}>Awaiting approval</span>
          </div>
        </div>
      )}

      {/* ── Welcome card ─────────────────────────────────────────────────── */}
      <div style={{ flexShrink: 0, background: '#032655', borderRadius: '16px', padding: '22px 28px', position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden style={{ position: 'absolute', right: '-40px', top: '-50px', width: '220px', height: '220px', borderRadius: '50%', background: 'rgba(15,185,177,0.09)', pointerEvents: 'none' }} />
        <div aria-hidden style={{ position: 'absolute', right: '80px', bottom: '-40px', width: '130px', height: '130px', borderRadius: '50%', background: 'rgba(15,185,177,0.06)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '18px' }}>
          {/* Avatar */}
          <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: '#0FB9B1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '2px solid rgba(255,255,255,0.15)' }}>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: '1.5rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>{initial}</span>
          </div>

          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.4)', margin: '0 0 3px' }}>Welcome back</p>
            <h2 style={{ fontFamily: 'var(--font-ui)', fontWeight: 800, fontSize: '1.3rem', color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.2, margin: '0 0 8px' }}>{nameFirst}</h2>
            {specs.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '5px' }}>
                {specs.slice(0, 4).map((s) => (
                  <span key={s} style={{ fontFamily: 'var(--font-ui)', fontSize: '0.6rem', fontWeight: 600, color: 'rgba(255,255,255,0.65)', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '5px', padding: '2px 8px' }}>
                    {s}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
            <Link href="/recruiter/dashboard/all-jobs" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '9px 18px', borderRadius: '10px', background: '#0FB9B1', color: '#fff', fontFamily: 'var(--font-ui)', fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none' }}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
              Browse Jobs
            </Link>
            <Link href="/recruiter/dashboard/submissions" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '9px 16px', borderRadius: '10px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.85)', fontFamily: 'var(--font-ui)', fontSize: '0.78rem', fontWeight: 600, textDecoration: 'none' }}>
              My Submissions
            </Link>
          </div>
        </div>
      </div>

      {/* ── Metric cards ─────────────────────────────────────────────────── */}
      <div className="rdash-metrics-grid" style={{ flexShrink: 0, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
        {metrics.map((m) => (
          <div key={m.label} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #D0DBE8', padding: '18px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.6rem', fontWeight: 700, color: '#96AFCA', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>{m.label}</span>
              <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: m.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {m.icon}
              </div>
            </div>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '2rem', fontWeight: 800, color: '#032655', lineHeight: 1, margin: 0 }}>{m.value}</p>
          </div>
        ))}
      </div>

      {/* ── Bottom two columns ───────────────────────────────────────────── */}
      <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1fr 300px', gap: '14px' }}>

        {/* Submissions table */}
        <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #D0DBE8', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #EEF3F8', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
            <div>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.85rem', fontWeight: 700, color: '#032655', margin: 0 }}>Recent Submissions</p>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', color: '#96AFCA', margin: '2px 0 0' }}>{total} candidate{total !== 1 ? 's' : ''} submitted</p>
            </div>
            <Link href="/recruiter/dashboard/submissions" style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', color: '#0FB9B1', fontWeight: 600, textDecoration: 'none' }}>View all →</Link>
          </div>

          {!recentSubmissions?.length ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '40px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#F5F8FC', border: '1px solid #D0DBE8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="22" height="22" fill="none" stroke="#96AFCA" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
              </div>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', color: '#96AFCA', margin: 0 }}>No candidates submitted yet</p>
              <Link href="/recruiter/dashboard/all-jobs" style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', color: '#0FB9B1', fontWeight: 600, textDecoration: 'none' }}>Browse jobs →</Link>
            </div>
          ) : (
            <div className="rdash-scrollable rdash-table-wrap" style={{ overflowY: 'auto', flex: 1, minHeight: 0 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ position: 'sticky', top: 0, background: '#F5F8FC', zIndex: 1 }}>
                  <tr>
                    {['Candidate', 'Job Role', 'Status', 'Date'].map((h) => (
                      <th key={h} style={{ padding: '9px 20px', textAlign: 'left', fontFamily: 'var(--font-ui)', fontSize: '0.55rem', fontWeight: 700, color: '#96AFCA', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentSubmissions.map((sub: any, i: number) => {
                    const s       = STATUS_STYLE[sub.status] ?? STATUS_STYLE.in_pipeline
                    const nameStr = sub.candidate_name as string
                    const initials = nameStr.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
                    return (
                      <tr key={sub.id} style={{ borderTop: i === 0 ? 'none' : '1px solid #EEF3F8' }}>
                        <td style={{ padding: '10px 20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#EEF3F8', border: '1px solid #D0DBE8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.58rem', fontWeight: 800, color: '#5A7A9F' }}>{initials}</span>
                            </div>
                            <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', fontWeight: 600, color: '#032655' }}>{sub.candidate_name}</span>
                          </div>
                        </td>
                        <td style={{ padding: '10px 20px', fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: '#5A7A9F', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>
                          {(sub.job_posts as any)?.title ?? '—'}
                        </td>
                        <td style={{ padding: '10px 20px' }}>
                          <span style={{ background: s.bg, color: s.color, fontSize: '0.62rem', fontWeight: 700, fontFamily: 'var(--font-ui)', padding: '4px 9px', borderRadius: '20px', whiteSpace: 'nowrap' as const }}>{s.label}</span>
                        </td>
                        <td style={{ padding: '10px 20px', fontFamily: 'var(--font-ui)', fontSize: '0.72rem', color: '#96AFCA', whiteSpace: 'nowrap' as const }}>
                          {new Date(sub.submitted_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', minHeight: 0 }}>

          {/* Submission pipeline */}
          <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #D0DBE8', padding: '18px 20px', flexShrink: 0 }}>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.8rem', fontWeight: 700, color: '#032655', margin: '0 0 16px' }}>Submission Pipeline</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {pipeline.map((p, i) => {
                const barPct = total > 0 ? Math.round((p.value / total) * 100) : 0
                return (
                  <div key={p.label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', color: '#5A7A9F', fontWeight: 500 }}>{p.label}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.9rem', fontWeight: 800, color: p.color }}>{p.value}</span>
                        {total > 0 && (
                          <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.6rem', fontWeight: 600, color: '#96AFCA' }}>{barPct}%</span>
                        )}
                      </div>
                    </div>
                    <div style={{ height: '6px', background: '#F0F4F8', borderRadius: '99px', overflow: 'hidden' }}>
                      <div style={{ width: i === 0 && total > 0 ? `${barPct}%` : total > 0 ? `${barPct}%` : '0%', height: '100%', background: p.color, borderRadius: '99px' }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Saved jobs */}
          <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #D0DBE8', padding: '18px 20px', flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexShrink: 0 }}>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.8rem', fontWeight: 700, color: '#032655', margin: 0 }}>Saved Jobs</p>
              <Link href="/recruiter/dashboard/my-jobs" style={{ fontFamily: 'var(--font-ui)', fontSize: '0.68rem', color: '#0FB9B1', fontWeight: 600, textDecoration: 'none' }}>View all →</Link>
            </div>

            {!savedJobsList?.length ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#F5F8FC', border: '1px solid #D0DBE8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="17" height="17" fill="none" stroke="#96AFCA" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" /></svg>
                </div>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', color: '#96AFCA', margin: 0, textAlign: 'center' as const }}>No saved jobs yet</p>
                <Link href="/recruiter/dashboard/all-jobs" style={{ fontFamily: 'var(--font-ui)', fontSize: '0.68rem', color: '#0FB9B1', fontWeight: 600, textDecoration: 'none' }}>Browse →</Link>
              </div>
            ) : (
              <div style={{ overflowY: 'auto', flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {savedJobsList.map((sj: any, i) => {
                  const job = sj.job_posts
                  return (
                    <Link key={sj.id} href={`/recruiter/dashboard/my-jobs/${job?.id}`} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '10px', background: '#F5F8FC', textDecoration: 'none', border: '1px solid #EEF3F8' }}>
                      <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: '#EEF3F8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.6rem', fontWeight: 800, color: '#96AFCA' }}>{i + 1}</span>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', fontWeight: 600, color: '#032655', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const, margin: 0 }}>
                          {job?.title ?? '—'}
                        </p>
                        {job?.location && (
                          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.62rem', color: '#96AFCA', margin: '1px 0 0' }}>{job.location}</p>
                        )}
                      </div>
                      <svg width="12" height="12" fill="none" stroke="#96AFCA" strokeWidth={2} viewBox="0 0 24 24" style={{ flexShrink: 0 }}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
