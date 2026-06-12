import { createClient } from '@/lib/supabase/server'
import { redirect }      from 'next/navigation'
import Link              from 'next/link'
import CandidatesFilter  from './CandidatesFilter'
import ContactDropdown   from '@/components/employer/ContactDropdown'
import UnlockButton      from '@/components/employer/UnlockButton'

const STATUS_TABS = [
  { key: 'all',            label: 'All' },
  { key: 'in_pipeline',    label: 'In Pipeline' },
  { key: 'in_review',      label: 'In Review' },
  { key: 'shortlisted',    label: 'Shortlisted' },
  { key: 'saved_for_later',label: 'Saved for Later' },
  { key: 'hired',          label: 'Hired' },
  { key: 'rejected',       label: 'Not Selected' },
]

const STATUS_STYLE: Record<string, { bg: string; color: string; accent: string; label: string }> = {
  in_pipeline:     { bg: '#EEF3F8', color: '#5A7A9F', accent: '#96AFCA', label: 'In Pipeline' },
  in_review:       { bg: '#EDE9FE', color: '#7C3AED', accent: '#7C3AED', label: 'In Review' },
  shortlisted:     { bg: '#D8F0EB', color: '#0A9E97', accent: '#0FB9B1', label: 'Shortlisted ⭐' },
  saved_for_later: { bg: '#FFF8E7', color: '#B7791F', accent: '#F5A623', label: 'Saved for Later' },
  hired:           { bg: '#C6F6D5', color: '#276749', accent: '#22C55E', label: 'Hired ✓' },
  rejected:        { bg: '#FFF5F5', color: '#C53030', accent: '#FC8181', label: 'Not Selected' },
}

function initials(name: string) {
  return name.split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase()
}

function fmtCTC(paise: number) {
  const L = paise / 100000
  return L >= 1 ? `₹${L % 1 === 0 ? L : L.toFixed(1)}L` : `₹${Math.round(paise / 1000)}K`
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; job?: string; q?: string }>
}) {
  const { status: statusParam, job: jobParam, q: searchQ } = await searchParams

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/employer/login')

  const { data: employer } = await supabase
    .from('employers').select('id').eq('user_id', user.id).single()
  if (!employer) redirect('/employer/login')

  // All jobs for this employer (for filter dropdown)
  const { data: jobs } = await supabase
    .from('job_posts')
    .select('id, title')
    .eq('employer_id', employer.id)
    .order('created_at', { ascending: false })

  const allJobs = jobs ?? []
  const jobIds  = allJobs.map(j => j.id)

  if (!jobIds.length) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <Header />
        <Empty message="No jobs posted yet. Post a job to start receiving candidates." />
      </div>
    )
  }

  // Build query
  let query = supabase
    .from('candidate_submissions')
    .select('id, candidate_name, email, phone, current_job_title, current_company, status, submitted_at, job_post_id, current_ctc, current_location, total_experience, notice_period, linkedin_url, portfolio_url, resume_url, profile_unlocked, profile_unlocked_at')
    .in('job_post_id', jobIds)
    .or('consent_status.eq.consented,consent_status.is.null')
    .order('submitted_at', { ascending: false })

  const activeStatus = statusParam && statusParam !== 'all' ? statusParam : null
  if (activeStatus) query = query.eq('status', activeStatus)

  if (jobParam)    query = query.eq('job_post_id', jobParam)
  if (searchQ?.trim()) query = query.ilike('candidate_name', `%${searchQ.trim()}%`)

  const { data: candidates } = await query
  const all = candidates ?? []

  // Job title lookup map
  const jobMap = Object.fromEntries(allJobs.map(j => [j.id, j.title]))

  // Counts per status (unfiltered by status tab — counts from full result if no status filter)
  const { data: allForCounts } = activeStatus || jobParam || searchQ?.trim()
    ? await supabase
        .from('candidate_submissions')
        .select('status')
        .in('job_post_id', jobIds)
        .or('consent_status.eq.consented,consent_status.is.null')
        .then(r => r)
    : { data: all }

  const counts = {
    all:            (allForCounts ?? []).length,
    in_pipeline:    (allForCounts ?? []).filter(c => c.status === 'in_pipeline').length,
    in_review:      (allForCounts ?? []).filter(c => c.status === 'in_review').length,
    shortlisted:    (allForCounts ?? []).filter(c => c.status === 'shortlisted').length,
    saved_for_later:(allForCounts ?? []).filter(c => c.status === 'saved_for_later').length,
    hired:          (allForCounts ?? []).filter(c => c.status === 'hired').length,
    rejected:       (allForCounts ?? []).filter(c => c.status === 'rejected').length,
  }

  const currentTab = statusParam ?? 'all'

  // Build URL helper — preserves other params, changes status
  function tabHref(key: string) {
    const p = new URLSearchParams()
    if (key !== 'all') p.set('status', key)
    if (jobParam)      p.set('job', jobParam)
    if (searchQ)       p.set('q', searchQ)
    const qs = p.toString()
    return `/employer/dashboard/candidates${qs ? `?${qs}` : ''}`
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '2rem' }}>

      {/* ── Header ───────────────────────────────────────────── */}
      <div>
        <h1 style={{ fontFamily: 'var(--font-ui)', fontSize: '1.5rem', fontWeight: 800, color: '#032655', letterSpacing: '-0.03em', margin: '0 0 4px' }}>
          All Candidates
        </h1>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', color: '#5A7A9F', margin: 0 }}>
          {counts.all} candidate{counts.all !== 1 ? 's' : ''} across {allJobs.length} job{allJobs.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* ── Status tabs + search/filter row ──────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

        {/* Status tabs */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {STATUS_TABS.map(tab => {
            const active = currentTab === tab.key
            const count  = counts[tab.key as keyof typeof counts]
            return (
              <Link
                key={tab.key}
                href={tabHref(tab.key)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  padding: '7px 14px', borderRadius: '99px', textDecoration: 'none',
                  fontFamily: 'var(--font-ui)', fontSize: '0.78rem', fontWeight: active ? 700 : 500,
                  background: active ? '#032655' : '#fff',
                  color: active ? '#fff' : '#5A7A9F',
                  border: `1.5px solid ${active ? '#032655' : '#D0DBE8'}`,
                  transition: 'all 0.15s',
                }}
              >
                {tab.label}
                <span style={{
                  fontFamily: 'var(--font-ui)', fontSize: '0.65rem', fontWeight: 700,
                  padding: '1px 6px', borderRadius: '99px',
                  background: active ? 'rgba(255,255,255,0.18)' : '#EEF3F8',
                  color: active ? '#fff' : '#96AFCA',
                }}>
                  {count}
                </span>
              </Link>
            )
          })}
        </div>

        {/* Search + job filter */}
        <CandidatesFilter jobs={allJobs} />
      </div>

      {/* ── Results ──────────────────────────────────────────── */}
      {!all.length ? (
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #D0DBE8', padding: '80px 24px', textAlign: 'center' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: '#EEF3F8', border: '1px solid #D0DBE8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <svg width="26" height="26" fill="none" stroke="#96AFCA" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
          </div>
          <p style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: '0.95rem', color: '#032655', margin: '0 0 6px' }}>No candidates found</p>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', color: '#96AFCA', margin: 0 }}>
            {currentTab !== 'all' ? `No candidates with this status.` : 'No candidates match your filters.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {all.map((c: any) => {
            const st = STATUS_STYLE[c.status] ?? STATUS_STYLE.in_pipeline
            const hasMetrics = c.current_location || c.total_experience != null || c.current_ctc != null || c.notice_period
            const jobTitle = jobMap[c.job_post_id] ?? '—'
            const locked = !c.profile_unlocked

            return (
              <div
                key={c.id}
                style={{
                  background: '#fff', borderRadius: '16px',
                  border: '1px solid #D0DBE8',
                  borderLeft: `4px solid ${locked ? '#E2E8F0' : st.accent}`,
                  boxShadow: '0 1px 4px rgba(3,38,85,0.06)',
                }}
              >
                {/* Identity */}
                <div style={{ padding: '18px 22px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                  {/* Avatar */}
                  <div style={{
                    width: '46px', height: '46px', borderRadius: '12px', flexShrink: 0,
                    background: locked ? '#F1F5F9' : 'linear-gradient(135deg, #032655 0%, #0FB9B1 100%)',
                    border: locked ? '1.5px solid #E2E8F0' : 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: locked ? 'none' : '0 4px 12px rgba(3,38,85,0.18)',
                  }}>
                    {locked ? (
                      <svg width="18" height="18" fill="none" stroke="#94A3B8" strokeWidth={1.8} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                      </svg>
                    ) : (
                      <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 800, fontSize: '0.95rem', color: '#fff', letterSpacing: '-0.02em' }}>
                        {initials(c.candidate_name)}
                      </span>
                    )}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Name — redacted bar when locked */}
                    <div style={{ height: '22px', display: 'flex', alignItems: 'center', marginBottom: '3px' }}>
                      {locked
                        ? <span style={{ display: 'inline-block', width: '140px', height: '13px', borderRadius: '5px', background: '#CBD5E1' }} />
                        : <h3 style={{ fontFamily: 'var(--font-ui)', fontSize: '0.95rem', fontWeight: 800, color: '#032655', margin: 0, letterSpacing: '-0.02em' }}>{c.candidate_name}</h3>
                      }
                    </div>

                    {(c.current_job_title || c.current_company) && (
                      <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', fontWeight: 600, color: '#5A7A9F', margin: '0 0 6px' }}>
                        {locked
                          ? (c.current_company ?? c.current_job_title ?? '—')
                          : [c.current_job_title, c.current_company].filter(Boolean).join(' · ')}
                      </p>
                    )}

                    {/* Job pill + contacts */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                      <Link
                        href={`/employer/dashboard/jobs/${c.job_post_id}/applicants`}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-ui)', fontSize: '0.7rem', fontWeight: 600, color: '#0FB9B1', textDecoration: 'none', background: '#F0FBF9', padding: '2px 8px', borderRadius: '6px', border: '1px solid rgba(15,185,177,0.25)' }}
                      >
                        <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                        {jobTitle}
                      </Link>
                      {locked ? (
                        /* Ghost locked buttons */
                        <>
                          {['Email', 'Call'].map(label => (
                            <span key={label} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 8px', borderRadius: '6px', border: '1px solid #E2E8F0', background: '#F8FAFC', fontFamily: 'var(--font-ui)', fontSize: '0.7rem', color: '#CBD5E1', userSelect: 'none' }}>
                              <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
                              {label}
                            </span>
                          ))}
                          {c.linkedin_url && (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 8px', borderRadius: '6px', border: '1px solid #E2E8F0', background: '#F8FAFC', fontFamily: 'var(--font-ui)', fontSize: '0.7rem', color: '#CBD5E1', userSelect: 'none' }}>
                              <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
                              LinkedIn
                            </span>
                          )}
                        </>
                      ) : (
                        <>
                          <ContactDropdown email={c.email} phone={c.phone} />
                          {c.linkedin_url && (
                            <a href={c.linkedin_url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontFamily: 'var(--font-ui)', fontSize: '0.7rem', color: '#0A66C2', textDecoration: 'none', fontWeight: 600 }}>
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                              LinkedIn
                            </a>
                          )}
                          {c.portfolio_url && (
                            <a href={c.portfolio_url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontFamily: 'var(--font-ui)', fontSize: '0.7rem', color: '#5A7A9F', textDecoration: 'none', fontWeight: 600 }}>
                              <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                              Portfolio
                            </a>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Status badge */}
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px', flexShrink: 0,
                    padding: '5px 12px', borderRadius: '99px',
                    background: locked ? '#F8FAFC' : st.bg,
                    border: `1px solid ${locked ? '#E2E8F0' : st.accent + '40'}`,
                  }}>
                    <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: locked ? '#CBD5E1' : st.accent }} />
                    <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.68rem', fontWeight: 700, color: locked ? '#94A3B8' : st.color }}>
                      {locked ? 'Locked' : st.label}
                    </span>
                  </div>
                </div>

                {/* Metrics */}
                {hasMetrics && (
                  <div style={{ borderTop: '1px solid #EEF3F8', display: 'flex' }}>
                    {[
                      c.current_location && {
                        icon: <svg width="12" height="12" fill="none" stroke="#5A7A9F" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>,
                        label: 'Location', value: c.current_location,
                      },
                      c.total_experience != null && {
                        icon: <svg width="12" height="12" fill="none" stroke="#5A7A9F" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>,
                        label: 'Experience', value: `${c.total_experience} yr${c.total_experience !== 1 ? 's' : ''}`,
                      },
                      c.current_ctc != null && {
                        icon: <svg width="12" height="12" fill="none" stroke="#5A7A9F" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
                        label: 'Current CTC', value: fmtCTC(c.current_ctc),
                      },
                      c.notice_period && {
                        icon: <svg width="12" height="12" fill="none" stroke="#5A7A9F" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>,
                        label: 'Notice Period', value: c.notice_period,
                      },
                    ].filter(Boolean).map((m: any, i, arr) => (
                      <div key={m.label} style={{ flex: 1, padding: '10px 18px', borderRight: i < arr.length - 1 ? '1px solid #EEF3F8' : 'none' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '5px' }}>
                          {m.icon}
                          <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.55rem', fontWeight: 700, color: '#96AFCA', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>{m.label}</span>
                        </div>
                        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', fontWeight: 700, color: '#032655', margin: 0 }}>{m.value}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Footer */}
                <div style={{ padding: '10px 22px', background: '#FAFCFE', borderTop: '1px solid #EEF3F8', borderRadius: '0 0 16px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                  <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.68rem', color: '#96AFCA' }}>
                    Submitted {new Date(c.submitted_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {locked ? (
                      <UnlockButton submissionId={c.id} />
                    ) : (
                      <>
                        {c.resume_url && (
                          <a
                            href={c.resume_url} target="_blank" rel="noopener noreferrer"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '6px 14px', borderRadius: '8px', background: '#032655', color: '#fff', textDecoration: 'none', fontFamily: 'var(--font-ui)', fontSize: '0.7rem', fontWeight: 700 }}
                          >
                            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                            Resume
                          </a>
                        )}
                        <Link
                          href={`/employer/dashboard/jobs/${c.job_post_id}/applicants`}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '6px 14px', borderRadius: '8px', border: '1.5px solid #D0DBE8', background: '#fff', color: '#5A7A9F', textDecoration: 'none', fontFamily: 'var(--font-ui)', fontSize: '0.7rem', fontWeight: 600 }}
                        >
                          View in Job →
                        </Link>
                      </>
                    )}
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

function Header() {
  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-ui)', fontSize: '1.5rem', fontWeight: 800, color: '#032655', letterSpacing: '-0.03em', margin: '0 0 4px' }}>All Candidates</h1>
    </div>
  )
}

function Empty({ message }: { message: string }) {
  return (
    <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #D0DBE8', padding: '80px 24px', textAlign: 'center' }}>
      <p style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: '0.95rem', color: '#032655', margin: '0 0 6px' }}>No candidates yet</p>
      <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', color: '#96AFCA', margin: 0 }}>{message}</p>
    </div>
  )
}