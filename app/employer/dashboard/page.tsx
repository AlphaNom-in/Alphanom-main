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
  const shortlisted     = submissions?.filter((s) => s.status === 'shortlisted').length ?? 0
  const hired           = submissions?.filter((s) => s.status === 'hired').length ?? 0
  const recentSubmissions = (submissions ?? []).slice(0, 8)

  const jobCountMap: Record<string, number> = {}
  for (const s of submissions ?? []) {
    jobCountMap[s.job_post_id] = (jobCountMap[s.job_post_id] ?? 0) + 1
  }
  const hotJobs = (jobs ?? [])
    .filter((j) => j.status === 'active')
    .map((j) => ({ ...j, count: jobCountMap[j.id] ?? 0 }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  const complete        = isProfileComplete(employer)
  const steps           = profileCompletionSteps(employer)
  const pct             = profileCompletionPercent(employer)
  const companyInitial  = (employer?.company_name ?? 'C')[0].toUpperCase()

  const pipeline = [
    { label: 'Submitted',   value: totalCandidates, color: '#5A7A9F' },
    { label: 'Shortlisted', value: shortlisted,      color: '#0A9E97' },
    { label: 'Hired',       value: hired,            color: '#276749' },
  ]

  const metrics = [
    {
      label: 'Active Jobs', value: activeJobs ?? 0, iconBg: '#D8F0EB',
      icon: (
        <svg width="14" height="14" fill="none" stroke="#0A9E97" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
        </svg>
      ),
    },
    {
      label: 'Total Candidates', value: totalCandidates, iconBg: '#EEF3F8',
      icon: (
        <svg width="14" height="14" fill="none" stroke="#5A7A9F" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
      ),
    },
    {
      label: 'Shortlisted', value: shortlisted, iconBg: '#D8F0EB',
      icon: (
        <svg width="14" height="14" fill="none" stroke="#0A9E97" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
      ),
    },
    {
      label: 'Roles Closed', value: closedRoles ?? 0, iconBg: '#EEF3F8',
      icon: (
        <svg width="14" height="14" fill="none" stroke="#5A7A9F" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '14px' }}>

      {/* ── Profile completion banner ───────────────────────────────────── */}
      {!complete && (
        <div style={{ flexShrink: 0, background: '#FFFBF0', border: '1px solid #F6D860', borderRadius: '12px', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '34px', height: '34px', borderRadius: '9px', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="16" height="16" fill="none" stroke="#D97706" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', fontWeight: 700, color: '#92400E', margin: '0 0 6px' }}>
              Complete your profile to unlock job posting
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '160px', height: '4px', background: '#FDE68A', borderRadius: '99px', overflow: 'hidden' }}>
                <div style={{ width: `${pct}%`, height: '100%', background: '#D97706', borderRadius: '99px' }} />
              </div>
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', fontWeight: 700, color: '#D97706' }}>{pct}%</span>
              {steps.map((s) => (
                <span key={s.label} style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', color: s.done ? '#059669' : '#D97706', fontWeight: 600 }}>
                  {s.done ? '✓' : '○'} {s.label}
                </span>
              ))}
            </div>
          </div>
          <Link href="/employer/dashboard/profile" style={{ padding: '8px 16px', borderRadius: '9px', background: '#D97706', color: '#fff', fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0 }}>
            Complete Profile →
          </Link>
        </div>
      )}

      {/* ── Welcome card — solid navy, no gradient ──────────────────────── */}
      <div style={{ flexShrink: 0, background: '#032655', borderRadius: '16px', padding: '22px 28px', position: 'relative', overflow: 'hidden' }}>
        {/* Soft decorative circles */}
        <div aria-hidden style={{ position: 'absolute', right: '-40px', top: '-50px', width: '220px', height: '220px', borderRadius: '50%', background: 'rgba(15,185,177,0.09)', pointerEvents: 'none' }} />
        <div aria-hidden style={{ position: 'absolute', right: '80px', bottom: '-40px', width: '130px', height: '130px', borderRadius: '50%', background: 'rgba(15,185,177,0.06)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '18px' }}>
          {/* Company initial avatar */}
          <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: '#0FB9B1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '2px solid rgba(255,255,255,0.15)' }}>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: '1.5rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>
              {companyInitial}
            </span>
          </div>

          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: 'rgba(255,255,255,0.4)', margin: '0 0 3px' }}>
              Welcome back
            </p>
            <h2 style={{ fontFamily: 'var(--font-ui)', fontWeight: 800, fontSize: '1.3rem', color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.2, margin: 0 }}>
              {employer?.company_name ?? 'Your Company'}
            </h2>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
            {complete ? (
              <Link href="/employer/dashboard/jobs/post" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '9px 18px', borderRadius: '10px', background: '#0FB9B1', color: '#fff', fontFamily: 'var(--font-ui)', fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none' }}>
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Post a Job
              </Link>
            ) : (
              <Link href="/employer/dashboard/profile" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '9px 18px', borderRadius: '10px', background: '#F59E0B', color: '#fff', fontFamily: 'var(--font-ui)', fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none' }}>
                Complete Profile
              </Link>
            )}
            <Link href="/employer/dashboard/jobs" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '9px 16px', borderRadius: '10px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.85)', fontFamily: 'var(--font-ui)', fontSize: '0.78rem', fontWeight: 600, textDecoration: 'none' }}>
              View Jobs
            </Link>
          </div>
        </div>
      </div>

      {/* ── Metric cards — full-width 4-col ────────────────────────────── */}
      <div style={{ flexShrink: 0, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
        {metrics.map((m) => (
          <div key={m.label} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #D0DBE8', padding: '18px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.6rem', fontWeight: 700, color: '#96AFCA', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>
                {m.label}
              </span>
              <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: m.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {m.icon}
              </div>
            </div>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '2rem', fontWeight: 800, color: '#032655', lineHeight: 1, margin: 0 }}>
              {m.value}
            </p>
          </div>
        ))}
      </div>

      {/* ── Bottom two columns ──────────────────────────────────────────── */}
      <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1fr 300px', gap: '14px' }}>

        {/* Recent Candidates */}
        <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #D0DBE8', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #EEF3F8', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
            <div>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.85rem', fontWeight: 700, color: '#032655', margin: 0 }}>Recent Candidates</p>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', color: '#96AFCA', margin: '2px 0 0' }}>
                {totalCandidates} total submission{totalCandidates !== 1 ? 's' : ''}
              </p>
            </div>
            <Link href="/employer/dashboard/jobs" style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', color: '#0FB9B1', fontWeight: 600, textDecoration: 'none' }}>
              View all →
            </Link>
          </div>

          {!recentSubmissions.length ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '40px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#F5F8FC', border: '1px solid #D0DBE8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="22" height="22" fill="none" stroke="#96AFCA" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
              </div>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', color: '#96AFCA', margin: 0 }}>No candidates yet</p>
            </div>
          ) : (
            <div style={{ overflowY: 'auto', flex: 1, minHeight: 0 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ position: 'sticky', top: 0, background: '#F5F8FC', zIndex: 1 }}>
                  <tr>
                    {['Candidate', 'Job', 'Status', 'Date', ''].map((h) => (
                      <th key={h} style={{ padding: '9px 20px', textAlign: 'left', fontFamily: 'var(--font-ui)', fontSize: '0.55rem', fontWeight: 700, color: '#96AFCA', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentSubmissions.map((s: any, i) => {
                    const st       = STATUS_STYLE[s.status] ?? STATUS_STYLE.in_pipeline
                    const jobTitle = jobs?.find((j) => j.id === s.job_post_id)?.title ?? '—'
                    const initials = s.candidate_name
                      .split(' ')
                      .map((n: string) => n[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()
                    return (
                      <tr key={s.id} style={{ borderTop: i === 0 ? 'none' : '1px solid #EEF3F8', cursor: 'pointer' }}>
                        <td style={{ padding: '10px 20px' }}>
                          <Link href={`/employer/dashboard/jobs/${s.job_post_id}/applicants`} style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                            <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#EEF3F8', border: '1px solid #D0DBE8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.58rem', fontWeight: 800, color: '#5A7A9F' }}>{initials}</span>
                            </div>
                            <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', fontWeight: 600, color: '#032655' }}>
                              {s.candidate_name}
                            </span>
                          </Link>
                        </td>
                        <td style={{ padding: '10px 20px', fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: '#5A7A9F', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>
                          {jobTitle}
                        </td>
                        <td style={{ padding: '10px 20px' }}>
                          <span style={{ background: st.bg, color: st.color, fontSize: '0.62rem', fontWeight: 700, fontFamily: 'var(--font-ui)', padding: '4px 9px', borderRadius: '20px', whiteSpace: 'nowrap' as const }}>
                            {st.label}
                          </span>
                        </td>
                        <td style={{ padding: '10px 20px', fontFamily: 'var(--font-ui)', fontSize: '0.72rem', color: '#96AFCA', whiteSpace: 'nowrap' as const }}>
                          {new Date(s.submitted_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </td>
                        <td style={{ padding: '10px 16px' }}>
                          <Link href={`/employer/dashboard/jobs/${s.job_post_id}/applicants`} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '26px', height: '26px', borderRadius: '7px', background: '#F5F8FC', border: '1px solid #D0DBE8', color: '#5A7A9F', textDecoration: 'none', fontSize: '0.7rem' }}>
                            →
                          </Link>
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
          <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #D0DBE8', padding: '18px 20px', flexShrink: 0 }}>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.8rem', fontWeight: 700, color: '#032655', margin: '0 0 16px' }}>
              Hiring Pipeline
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {pipeline.map((p, i) => {
                const barPct = totalCandidates > 0 ? Math.round((p.value / totalCandidates) * 100) : 0
                return (
                  <div key={p.label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', color: '#5A7A9F', fontWeight: 500 }}>
                        {p.label}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.9rem', fontWeight: 800, color: p.color }}>
                          {p.value}
                        </span>
                        {i > 0 && totalCandidates > 0 && (
                          <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.6rem', fontWeight: 600, color: '#96AFCA' }}>
                            {barPct}%
                          </span>
                        )}
                      </div>
                    </div>
                    <div style={{ height: '6px', background: '#F0F4F8', borderRadius: '99px', overflow: 'hidden' }}>
                      <div style={{ width: i === 0 ? '100%' : `${barPct}%`, height: '100%', background: p.color, borderRadius: '99px' }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Active jobs by applicants */}
          <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #D0DBE8', padding: '18px 20px', flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.8rem', fontWeight: 700, color: '#032655', margin: '0 0 14px', flexShrink: 0 }}>
              Active Jobs
            </p>
            {!hotJobs.length ? (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: '#96AFCA', margin: 0 }}>No active jobs</p>
              </div>
            ) : (
              <div style={{ overflowY: 'auto', flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {hotJobs.map((j: any, i) => (
                  <Link key={j.id} href={`/employer/dashboard/jobs/${j.id}`} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '10px', background: '#F5F8FC', textDecoration: 'none', border: '1px solid #EEF3F8' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: '#EEF3F8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.6rem', fontWeight: 800, color: '#96AFCA' }}>{i + 1}</span>
                    </div>
                    <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', fontWeight: 600, color: '#032655', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>
                      {j.title}
                    </span>
                    <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.68rem', fontWeight: 700, color: '#0A9E97', background: '#D8F0EB', padding: '3px 8px', borderRadius: '10px', flexShrink: 0 }}>
                      {j.count}
                    </span>
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
