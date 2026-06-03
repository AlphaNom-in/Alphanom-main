import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { isProfileComplete, profileCompletionSteps, profileCompletionPercent } from '@/hooks/useEmployerProfile'

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  in_pipeline:     { bg: '#EEF3F8', color: '#5A7A9F',  label: 'In Pipeline' },
  shortlisted:     { bg: '#D8F0EB', color: '#0A9E97',  label: 'Shortlisted' },
  saved_for_later: { bg: '#FFF8E7', color: '#B7791F',  label: 'Saved for Later' },
  hired:           { bg: '#C6F6D5', color: '#276749',  label: 'Hired ✓' },
  rejected:        { bg: '#FFF5F5', color: '#E53E3E',  label: 'Rejected' },
}

export default async function Page() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/employer/login')

  const { data: employer } = await supabase
    .from('employers').select('*').eq('user_id', user.id).single()

  const { data: jobs } = await supabase
    .from('job_posts').select('id, title, status').eq('employer_id', employer?.id ?? '')

  const jobIds = jobs?.map((j) => j.id) ?? []

  const [
    { count: activeJobs },
    { count: closedRoles },
    { data: submissions },
  ] = await Promise.all([
    supabase.from('job_posts').select('*', { count: 'exact', head: true }).eq('employer_id', employer?.id ?? '').eq('status', 'active'),
    supabase.from('job_posts').select('*', { count: 'exact', head: true }).eq('employer_id', employer?.id ?? '').eq('status', 'closed'),
    jobIds.length
      ? supabase.from('candidate_submissions')
          .select('id, candidate_name, status, submitted_at, job_post_id')
          .in('job_post_id', jobIds)
          .order('submitted_at', { ascending: false })
      : Promise.resolve({ data: [] }),
  ])

  const totalCandidates = submissions?.length ?? 0
  const shortlisted = submissions?.filter((s) => s.status === 'shortlisted').length ?? 0
  const hired = submissions?.filter((s) => s.status === 'hired').length ?? 0
  const recentSubmissions = (submissions ?? []).slice(0, 8)

  // Job performance: count per job
  const jobCountMap: Record<string, number> = {}
  for (const s of submissions ?? []) {
    jobCountMap[s.job_post_id] = (jobCountMap[s.job_post_id] ?? 0) + 1
  }
  const hotJobs = (jobs ?? [])
    .filter((j) => j.status === 'active')
    .map((j) => ({ ...j, count: jobCountMap[j.id] ?? 0 }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  const complete = isProfileComplete(employer)
  const steps = profileCompletionSteps(employer)
  const pct = profileCompletionPercent(employer)

  const pipeline = [
    { label: 'Submitted',   value: totalCandidates, color: '#5A7A9F', bg: '#EEF3F8' },
    { label: 'Shortlisted', value: shortlisted,      color: '#0A9E97', bg: '#D8F0EB' },
    { label: 'Hired',       value: hired,            color: '#276749', bg: '#C6F6D5' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '16px' }}>

      {/* Profile banner — fixed */}
      {!complete && (
        <div style={{ flexShrink: 0, background: '#fff', border: '1px solid #D0DBE8', borderLeft: '3px solid #F5A623', borderRadius: '12px', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', fontWeight: 700, color: '#032655', marginBottom: '2px' }}>Complete your profile to unlock job posting</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
              <div style={{ flex: 1, height: '4px', background: '#EEF3F8', borderRadius: '99px', overflow: 'hidden', maxWidth: '180px' }}>
                <div style={{ width: `${pct}%`, height: '100%', background: '#F5A623', borderRadius: '99px' }} />
              </div>
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', fontWeight: 700, color: '#F5A623' }}>{pct}%</span>
              {steps.map((s) => (
                <span key={s.label} style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', color: s.done ? '#0A9E97' : '#96AFCA', fontWeight: s.done ? 700 : 400 }}>
                  {s.done ? '✓' : '○'} {s.label}
                </span>
              ))}
            </div>
          </div>
          <Link href="/employer/dashboard/profile" style={{ padding: '7px 14px', borderRadius: '7px', background: '#F5A623', color: '#fff', fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0 }}>
            Complete Profile →
          </Link>
        </div>
      )}

      {/* Welcome + metrics — fixed */}
      <div style={{ flexShrink: 0, display: 'grid', gridTemplateColumns: '1fr auto', gap: '14px', alignItems: 'stretch' }}>

        {/* Welcome card */}
        <div style={{ background: 'linear-gradient(135deg, #032655 0%, #0a3570 60%, #0FB9B1 100%)', borderRadius: '14px', padding: '20px 24px', position: 'relative', overflow: 'hidden' }}>
          <div aria-hidden style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '20px 20px', pointerEvents: 'none' }} />
          <div style={{ position: 'relative' }}>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.55rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>Welcome back</p>
            <h2 style={{ fontFamily: 'var(--font-ui)', fontWeight: 800, fontSize: '1.25rem', color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.2, marginBottom: '14px' }}>{employer?.company_name ?? 'Your Company'}</h2>
            <div style={{ display: 'flex', gap: '8px' }}>
              {complete ? (
                <Link href="/employer/dashboard/jobs/post" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '7px 14px', borderRadius: '7px', background: '#0FB9B1', color: '#fff', fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 700, textDecoration: 'none' }}>
                  + Post a Job
                </Link>
              ) : (
                <Link href="/employer/dashboard/profile" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '7px 14px', borderRadius: '7px', background: '#F5A623', color: '#fff', fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 700, textDecoration: 'none' }}>
                  Complete Profile
                </Link>
              )}
              <Link href="/employer/dashboard/jobs" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '7px 14px', borderRadius: '7px', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 600, textDecoration: 'none' }}>
                View Jobs
              </Link>
            </div>
          </div>
        </div>

        {/* Metric cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {[
            { label: 'Active Jobs',   value: activeJobs ?? 0,   color: '#0FB9B1', bg: '#D8F0EB' },
            { label: 'Total Candidates', value: totalCandidates,  color: '#032655', bg: '#EEF3F8' },
            { label: 'Shortlisted',   value: shortlisted,       color: '#0A9E97', bg: '#D8F0EB' },
            { label: 'Closed Roles',  value: closedRoles ?? 0,  color: '#5A7A9F', bg: '#EEF3F8' },
          ].map((m) => (
            <div key={m.label} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #D0DBE8', padding: '14px 16px', minWidth: '120px' }}>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.62rem', color: '#96AFCA', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '6px' }}>{m.label}</p>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '1.5rem', fontWeight: 800, color: '#032655', lineHeight: 1 }}>{m.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom two-column — scrolls */}
      <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1fr 320px', gap: '14px' }}>

        {/* Recent Candidates */}
        <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #D0DBE8', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #EEF3F8', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', fontWeight: 700, color: '#032655', margin: 0 }}>Recent Candidates</p>
            <Link href="/employer/dashboard/jobs" style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', color: '#0FB9B1', fontWeight: 600, textDecoration: 'none' }}>View all →</Link>
          </div>

          {!recentSubmissions.length ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', color: '#96AFCA' }}>No candidates yet</p>
            </div>
          ) : (
            <div style={{ overflowY: 'auto', flex: 1, minHeight: 0 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ position: 'sticky', top: 0, background: '#F5F8FC', zIndex: 1 }}>
                  <tr>
                    {['Candidate', 'Job', 'Status', 'Date'].map((h) => (
                      <th key={h} style={{ padding: '9px 20px', textAlign: 'left', fontFamily: 'var(--font-ui)', fontSize: '0.55rem', fontWeight: 700, color: '#96AFCA', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentSubmissions.map((s: any, i) => {
                    const st = STATUS_STYLE[s.status] ?? STATUS_STYLE.in_pipeline
                    const jobTitle = jobs?.find((j) => j.id === s.job_post_id)?.title ?? '—'
                    return (
                      <tr key={s.id} style={{ borderTop: i === 0 ? 'none' : '1px solid #EEF3F8' }}>
                        <td style={{ padding: '11px 20px', fontFamily: 'var(--font-ui)', fontSize: '0.82rem', fontWeight: 600, color: '#032655' }}>{s.candidate_name}</td>
                        <td style={{ padding: '11px 20px', fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: '#5A7A9F', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{jobTitle}</td>
                        <td style={{ padding: '11px 20px' }}>
                          <span style={{ background: st.bg, color: st.color, fontSize: '0.62rem', fontWeight: 700, fontFamily: 'var(--font-ui)', padding: '3px 8px', borderRadius: '20px', whiteSpace: 'nowrap' }}>{st.label}</span>
                        </td>
                        <td style={{ padding: '11px 20px', fontFamily: 'var(--font-ui)', fontSize: '0.72rem', color: '#96AFCA', whiteSpace: 'nowrap' }}>
                          {new Date(s.submitted_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
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

          {/* Hiring pipeline */}
          <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #D0DBE8', padding: '16px 18px', flexShrink: 0 }}>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 700, color: '#032655', marginBottom: '14px' }}>Hiring Pipeline</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {pipeline.map((p, i) => {
                const pct = totalCandidates > 0 ? Math.round((p.value / totalCandidates) * 100) : 0
                return (
                  <div key={p.label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', color: '#5A7A9F' }}>{p.label}</span>
                      <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 700, color: p.color }}>{p.value} {i > 0 && totalCandidates > 0 ? `(${pct}%)` : ''}</span>
                    </div>
                    <div style={{ height: '5px', background: '#EEF3F8', borderRadius: '99px', overflow: 'hidden' }}>
                      <div style={{ width: i === 0 ? '100%' : `${pct}%`, height: '100%', background: p.color, borderRadius: '99px', transition: 'width 0.4s ease', opacity: 0.7 }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Hot jobs */}
          <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #D0DBE8', padding: '16px 18px', flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 700, color: '#032655', marginBottom: '12px', flexShrink: 0 }}>Active Jobs by Applicants</p>
            {!hotJobs.length ? (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: '#96AFCA' }}>No active jobs</p>
              </div>
            ) : (
              <div style={{ overflowY: 'auto', flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {hotJobs.map((j: any, i) => (
                  <Link key={j.id} href={`/employer/dashboard/jobs/${j.id}`} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '9px', background: '#F5F8FC', textDecoration: 'none', border: '1px solid #EEF3F8' }}>
                    <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', fontWeight: 800, color: '#96AFCA', width: '16px', flexShrink: 0 }}>#{i + 1}</span>
                    <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', fontWeight: 600, color: '#032655', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{j.title}</span>
                    <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 700, color: '#0A9E97', background: '#D8F0EB', padding: '2px 8px', borderRadius: '10px', flexShrink: 0 }}>{j.count}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
