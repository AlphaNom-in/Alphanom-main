import { createAdminClient } from '@/lib/supabase/admin'
import Link                   from 'next/link'

const STATUS_STYLE: Record<string, { bg: string; color: string; dot: string; label: string }> = {
  in_pipeline:     { bg: '#EEF3F8', color: '#5A7A9F', dot: '#96AFCA', label: 'In Pipeline' },
  in_review:       { bg: '#EDE9FE', color: '#7C3AED', dot: '#7C3AED', label: 'In Review' },
  shortlisted:     { bg: '#D8F0EB', color: '#0A9E97', dot: '#0FB9B1', label: 'Shortlisted' },
  saved_for_later: { bg: '#FFF8E7', color: '#B7791F', dot: '#F5A623', label: 'Saved for Later' },
  hired:           { bg: '#DCFCE7', color: '#166534', dot: '#22C55E', label: 'Hired' },
  rejected:        { bg: '#FFF1F2', color: '#BE123C', dot: '#F43F5E', label: 'Not Selected' },
}

function getConsentBadge(status: string | null, expiresAt: string | null) {
  if (status === 'consented' || status === null) {
    return { bg: '#D8F0EB', color: '#0A9E97', dot: '#0FB9B1', label: 'Consented' }
  }
  if (status === 'withdrawn') {
    return { bg: '#FFF5F5', color: '#E53E3E', dot: '#E53E3E', label: 'Withdrawn' }
  }
  if (expiresAt && new Date(expiresAt) < new Date()) {
    return { bg: '#FFF8E7', color: '#B7791F', dot: '#F5A623', label: 'Link Expired' }
  }
  return { bg: '#EEF3F8', color: '#5A7A9F', dot: '#96AFCA', label: 'Awaiting' }
}

function fmtCTC(paise: number | null) {
  if (!paise) return '—'
  const L = paise / 100000
  return L >= 1 ? `₹${L.toFixed(1)}L` : `₹${Math.round(paise / 1000)}K`
}

function initials(name: string) {
  return (name ?? '').split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase() || '?'
}

function avatarColor(name: string) {
  const colors = ['#0FB9B1', '#032655', '#7C3AED', '#F5A623', '#276749', '#C53030', '#0A66C2', '#B7791F']
  return colors[(name?.charCodeAt(0) ?? 0) % colors.length]
}

export default async function AdminCandidatesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; recruiter_id?: string; consent?: string; page?: string }>
}) {
  const { status, recruiter_id, consent: consentFilter, page: pageParam } = await searchParams

  const PAGE_SIZE   = 10
  const currentPage = Math.max(1, parseInt(pageParam ?? '1', 10) || 1)
  const from        = (currentPage - 1) * PAGE_SIZE
  const to          = from + PAGE_SIZE - 1
  const admin = createAdminClient()

  // Counts query (unfiltered by status/consent)
  const { data: allForCounts } = await admin
    .from('candidate_submissions')
    .select('status, consent_status, consent_token_expires_at')

  const allSubs     = allForCounts ?? []
  const totalCount  = allSubs.length
  const countByStatus: Record<string, number> = {}
  for (const s of allSubs) countByStatus[s.status] = (countByStatus[s.status] ?? 0) + 1

  const consentedCount = allSubs.filter(s => s.consent_status === 'consented' || s.consent_status === null).length
  const pendingCount   = allSubs.filter(s => s.consent_status === 'pending_consent').length
  const withdrawnCount = allSubs.filter(s => s.consent_status === 'withdrawn').length

  // Main query — apply filters + paginate
  let query = admin
    .from('candidate_submissions')
    .select('id, candidate_name, email, phone, current_job_title, current_company, status, submitted_at, current_ctc, total_experience, consent_status, consent_token_expires_at, profile_unlocked, profile_unlocked_at, job_posts(title, employers(company_name)), recruiters(id, full_name)', { count: 'exact' })
    .order('submitted_at', { ascending: false })
    .range(from, to)

  if (status && status !== 'all')   query = query.eq('status', status)
  if (recruiter_id)                 query = query.eq('recruiter_id', recruiter_id)
  if (consentFilter === 'consented')  query = query.or('consent_status.eq.consented,consent_status.is.null')
  else if (consentFilter === 'pending')   query = query.eq('consent_status', 'pending_consent')
  else if (consentFilter === 'withdrawn') query = query.eq('consent_status', 'withdrawn')

  const { data: submissions, count: filteredCount } = await query

  const totalPages  = Math.max(1, Math.ceil((filteredCount ?? 0) / PAGE_SIZE))

  // Build filter href helper — filter changes always reset to page 1
  function href(params: { status?: string; consent?: string; recruiter_id?: string }) {
    const p = new URLSearchParams()
    if (params.recruiter_id ?? recruiter_id) p.set('recruiter_id', params.recruiter_id ?? recruiter_id!)
    if (params.status   && params.status   !== 'all') p.set('status',  params.status)
    if (params.consent  && params.consent  !== 'all') p.set('consent', params.consent)
    const s = p.toString()
    return `/admin/candidates${s ? `?${s}` : ''}`
  }

  // Build page href — preserves active filters
  function hrefPage(p: number) {
    const params = new URLSearchParams()
    if (recruiter_id)                           params.set('recruiter_id', recruiter_id)
    if (status       && status       !== 'all') params.set('status',  status)
    if (consentFilter && consentFilter !== 'all') params.set('consent', consentFilter)
    if (p > 1) params.set('page', String(p))
    const s = params.toString()
    return `/admin/candidates${s ? `?${s}` : ''}`
  }

  const STATUS_TABS = [
    { key: 'all',            label: 'All',           count: totalCount },
    { key: 'in_pipeline',    label: 'In Pipeline',   count: countByStatus['in_pipeline'] ?? 0 },
    { key: 'in_review',      label: 'In Review',     count: countByStatus['in_review'] ?? 0 },
    { key: 'shortlisted',    label: 'Shortlisted',   count: countByStatus['shortlisted'] ?? 0 },
    { key: 'hired',          label: 'Hired',         count: countByStatus['hired'] ?? 0 },
    { key: 'rejected',       label: 'Not Selected',  count: countByStatus['rejected'] ?? 0 },
  ]

  const CONSENT_TABS = [
    { key: 'all',       label: 'All Consent',      count: totalCount,     dot: '#96AFCA', color: '#5A7A9F' },
    { key: 'consented', label: 'Consent Given',    count: consentedCount, dot: '#0FB9B1', color: '#0A9E97' },
    { key: 'pending',   label: 'Awaiting Consent', count: pendingCount,   dot: '#F5A623', color: '#B7791F' },
    { key: 'withdrawn', label: 'Withdrawn',        count: withdrawnCount, dot: '#E53E3E', color: '#E53E3E' },
  ]

  const currentStatus  = status  ?? 'all'
  const currentConsent = consentFilter ?? 'all'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 0 }}>
      <style>{`.an-tr:hover td { background: #F8FAFC; } .an-tab:hover { border-color: #96AFCA !important; color: #3D5A7A !important; }`}</style>
      {/* ── Static header section ─────────────────────────────────────────── */}
      <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '16px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.62rem', fontWeight: 700, color: '#7C3AED', letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0 0 4px' }}>Tracking</p>
          <h1 style={{ fontFamily: 'var(--font-ui)', fontSize: '1.5rem', fontWeight: 800, color: '#0F1C2E', letterSpacing: '-0.03em', margin: '0 0 4px' }}>Candidates</h1>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', color: '#96AFCA', margin: 0 }}>
            Submission timestamps &amp; record IDs are immutable audit records for resolving duplicate submission or prior-claim disputes.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          {[
            { label: 'Total',       value: totalCount,        color: '#032655', bg: '#EFF6FF' },
            { label: 'Consented',   value: consentedCount,    color: '#0A9E97', bg: '#D8F0EB' },
            { label: 'Awaiting',    value: pendingCount,      color: '#B7791F', bg: '#FFF8E7' },
            { label: 'Withdrawn',   value: withdrawnCount,    color: '#E53E3E', bg: '#FFF5F5' },
          ].map(c => (
            <div key={c.label} style={{ padding: '8px 16px', borderRadius: '8px', background: c.bg, border: `1px solid ${c.color}22` }}>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '1.05rem', fontWeight: 800, color: c.color, margin: 0, lineHeight: 1 }}>{c.value}</p>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.6rem', color: c.color, margin: '2px 0 0', opacity: 0.75 }}>{c.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recruiter filter banner */}
      {recruiter_id && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', borderRadius: '8px', background: '#EDE9FE', border: '1px solid #DDD6FE' }}>
          <svg width="14" height="14" fill="none" stroke="#7C3AED" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z"/></svg>
          <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: '#7C3AED', fontWeight: 600 }}>
            Filtered by recruiter — showing {submissions?.length ?? 0} submission{(submissions?.length ?? 0) !== 1 ? 's' : ''}
          </span>
          <Link href={`/admin/recruiters/${recruiter_id}`} style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 600, color: '#0FB9B1', textDecoration: 'none', marginLeft: '2px' }}>
            ← Back to recruiter
          </Link>
          <Link href="/admin/candidates" style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 600, color: '#6B7E93', textDecoration: 'none', padding: '4px 10px', borderRadius: '6px', background: '#fff', border: '1px solid #D0DBE8' }}>
            <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
            Clear filter
          </Link>
        </div>
      )}

      {/* Pipeline status tabs */}
      <div>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.62rem', fontWeight: 700, color: '#96AFCA', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px' }}>Pipeline Status</p>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {STATUS_TABS.map(tab => {
            const active = currentStatus === tab.key
            return (
              <a
                key={tab.key}
                href={href({ status: tab.key, consent: currentConsent })}
                className={active ? '' : 'an-tab'}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  padding: '7px 14px', borderRadius: '8px', textDecoration: 'none',
                  fontFamily: 'var(--font-ui)', fontSize: '0.75rem', fontWeight: active ? 700 : 500,
                  background: active ? '#032655' : '#fff',
                  color:      active ? '#fff'    : '#5A7A9F',
                  border:     `1.5px solid ${active ? '#032655' : '#E4EAF1'}`,
                }}
              >
                {tab.label}
                <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.62rem', fontWeight: 700, padding: '1px 6px', borderRadius: '99px', background: active ? 'rgba(255,255,255,0.2)' : '#F4F6FB', color: active ? '#fff' : '#96AFCA' }}>
                  {tab.count}
                </span>
              </a>
            )
          })}
        </div>
      </div>

      {/* Consent filter tabs */}
      <div>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.62rem', fontWeight: 700, color: '#96AFCA', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px' }}>Candidate Consent</p>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {CONSENT_TABS.map(tab => {
            const active = currentConsent === tab.key
            return (
              <a
                key={tab.key}
                href={href({ status: currentStatus, consent: tab.key })}
                className={active ? '' : 'an-tab'}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  padding: '7px 14px', borderRadius: '8px', textDecoration: 'none',
                  fontFamily: 'var(--font-ui)', fontSize: '0.75rem', fontWeight: active ? 700 : 500,
                  background: active ? tab.color : '#fff',
                  color:      active ? '#fff'    : tab.color,
                  border:     `1.5px solid ${active ? tab.color : '#E4EAF1'}`,
                }}
              >
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: active ? '#fff' : tab.dot, flexShrink: 0 }} />
                {tab.label}
                <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.62rem', fontWeight: 700, padding: '1px 6px', borderRadius: '99px', background: active ? 'rgba(255,255,255,0.2)' : '#F4F6FB', color: active ? '#fff' : '#96AFCA' }}>
                  {tab.count}
                </span>
              </a>
            )
          })}
        </div>
      </div>
      </div>{/* end static section */}

      {/* ── Scrollable data section ───────────────────────────────────────── */}
      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: '14px' }}>

      {/* Table — card scrolls internally; thead is sticky */}
      <div style={{ flex: 1, minHeight: 0, background: '#fff', borderRadius: '12px', border: '1px solid #E4EAF1', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ position: 'sticky', top: 0, zIndex: 2 }}>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #EEF2F7' }}>
                {['Record ID', 'Candidate', 'Job Title', 'Company', 'Recruiter', 'CTC', 'Exp', 'Consent', 'Pipeline', 'Profile Unlocked', 'Submission Timestamp'].map(h => (
                  <th key={h} style={{ padding: '11px 16px', fontFamily: 'var(--font-ui)', fontSize: '0.62rem', fontWeight: 700, color: h === 'Record ID' || h === 'Submission Timestamp' ? '#7C3AED' : '#96AFCA', textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(submissions ?? []).map((s: any) => {
                const st      = STATUS_STYLE[s.status] ?? STATUS_STYLE.in_pipeline
                const consent = getConsentBadge(s.consent_status, s.consent_token_expires_at)
                const col     = avatarColor(s.candidate_name)
                return (
                  <tr key={s.id} className="an-tr" style={{ borderBottom: '1px solid #F4F6FB' }}>
                    {/* Record ID */}
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.62rem', fontWeight: 700, color: '#7C3AED', background: '#F5F3FF', border: '1px solid #DDD6FE', borderRadius: '5px', padding: '2px 7px', whiteSpace: 'nowrap', letterSpacing: '0.04em' }}>
                          {s.id.slice(0, 8)}…
                        </span>
                        <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.52rem', color: '#B0BEC5', whiteSpace: 'nowrap' }} title={s.id}>
                          {s.id.slice(8, 18)}…
                        </span>
                      </div>
                    </td>
                    {/* Candidate */}
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0, background: `${col}14`, border: `1.5px solid ${col}28`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 800, fontSize: '0.6rem', color: col }}>{initials(s.candidate_name)}</span>
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.8rem', fontWeight: 700, color: '#0F1C2E', margin: 0, whiteSpace: 'nowrap' }}>{s.candidate_name}</p>
                          {s.email && <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', color: '#96AFCA', margin: '1px 0 0', whiteSpace: 'nowrap' }}>{s.email}</p>}
                          {s.phone && <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', color: '#96AFCA', margin: '1px 0 0', whiteSpace: 'nowrap' }}>{s.phone}</p>}
                          {s.current_job_title && <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.62rem', color: '#B0BEC5', margin: '1px 0 0', whiteSpace: 'nowrap' }}>{s.current_job_title}{s.current_company ? ` · ${s.current_company}` : ''}</p>}
                        </div>
                      </div>
                    </td>
                    {/* Job */}
                    <td style={{ padding: '12px 16px', maxWidth: '160px' }}>
                      <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: '#5A7A9F', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {s.job_posts?.title ?? '—'}
                      </p>
                    </td>
                    {/* Company */}
                    <td style={{ padding: '12px 16px' }}>
                      <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', color: '#5A7A9F', margin: 0, whiteSpace: 'nowrap' }}>{s.job_posts?.employers?.company_name ?? '—'}</p>
                    </td>
                    {/* Recruiter */}
                    <td style={{ padding: '12px 16px' }}>
                      <Link
                        href={`/admin/candidates?recruiter_id=${s.recruiters?.id}`}
                        style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', color: '#5A7A9F', textDecoration: 'none', whiteSpace: 'nowrap' }}
                      >
                        {s.recruiters?.full_name ?? '—'}
                      </Link>
                    </td>
                    {/* CTC */}
                    <td style={{ padding: '12px 16px' }}>
                      <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.8rem', fontWeight: 700, color: '#0F1C2E', margin: 0 }}>{fmtCTC(s.current_ctc)}</p>
                    </td>
                    {/* Exp */}
                    <td style={{ padding: '12px 16px' }}>
                      <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: '#5A7A9F', margin: 0 }}>
                        {s.total_experience != null ? `${s.total_experience}y` : '—'}
                      </p>
                    </td>
                    {/* Consent */}
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontFamily: 'var(--font-ui)', fontSize: '0.68rem', fontWeight: 700, padding: '3px 9px', borderRadius: '99px', background: consent.bg, color: consent.color, whiteSpace: 'nowrap' }}>
                        <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: consent.dot, flexShrink: 0 }} />
                        {consent.label}
                      </span>
                    </td>
                    {/* Pipeline status */}
                    <td style={{ padding: '12px 16px' }}>
                      {(s.consent_status === 'consented' || s.consent_status === null) ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-ui)', fontSize: '0.68rem', fontWeight: 700, padding: '3px 9px', borderRadius: '99px', background: st.bg, color: st.color, whiteSpace: 'nowrap' }}>
                          <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: st.dot }} />
                          {st.label}
                        </span>
                      ) : (
                        <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.68rem', color: '#96AFCA' }}>—</span>
                      )}
                    </td>
                    {/* Profile Unlocked */}
                    <td style={{ padding: '12px 16px' }}>
                      {s.profile_unlocked && s.profile_unlocked_at ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-ui)', fontSize: '0.68rem', fontWeight: 700, padding: '2px 8px', borderRadius: '99px', background: '#D8F0EB', color: '#0A9E97', whiteSpace: 'nowrap', marginBottom: '3px' }}>
                            <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                            </svg>
                            Unlocked
                          </span>
                          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.68rem', fontWeight: 600, color: '#3D5A7A', margin: 0, whiteSpace: 'nowrap' }}>
                            {new Date(s.profile_unlocked_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                          <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.62rem', color: '#0A9E97', margin: 0, whiteSpace: 'nowrap', fontWeight: 600 }}>
                            {new Date(s.profile_unlocked_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' })} IST
                          </p>
                        </div>
                      ) : (
                        <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', color: '#D0DBE8' }}>—</span>
                      )}
                    </td>
                    {/* Submission Timestamp */}
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', fontWeight: 700, color: '#3D5A7A', margin: 0, whiteSpace: 'nowrap' }}>
                          {new Date(s.submitted_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                        <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.68rem', color: '#7C3AED', margin: 0, whiteSpace: 'nowrap', fontWeight: 600 }}>
                          {new Date(s.submitted_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' })} IST
                        </p>
                        <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.55rem', color: '#B0BEC5', margin: 0, whiteSpace: 'nowrap' }} title={s.submitted_at}>
                          {new Date(s.submitted_at).toISOString().replace('T', ' ').slice(0, 19)} UTC
                        </p>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {!(submissions ?? []).length && (
            <div style={{ padding: '64px', textAlign: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#EDE9FE', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <svg width="20" height="20" fill="none" stroke="#7C3AED" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z"/></svg>
              </div>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', fontWeight: 600, color: '#5A7A9F', margin: '0 0 4px' }}>No submissions found</p>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', color: '#96AFCA', margin: 0 }}>Try adjusting the filters</p>
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', paddingBottom: '4px' }}>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', color: '#96AFCA', margin: 0 }}>
            Showing {from + 1}–{Math.min(to + 1, filteredCount ?? 0)} of <strong style={{ color: '#3D5A7A' }}>{filteredCount}</strong> submissions
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {/* Prev */}
            {currentPage > 1 ? (
              <a href={hrefPage(currentPage - 1)} style={pgBtn(false)}>
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
              </a>
            ) : (
              <span style={pgBtn(false, true)}>
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
              </span>
            )}

            {/* Page numbers */}
            {buildPageRange(currentPage, totalPages).map((item, i) =>
              item === '…' ? (
                <span key={`ellipsis-${i}`} style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', color: '#96AFCA', padding: '0 4px' }}>…</span>
              ) : (
                <a key={item} href={hrefPage(item as number)} style={pgBtn(item === currentPage)}>
                  {item}
                </a>
              )
            )}

            {/* Next */}
            {currentPage < totalPages ? (
              <a href={hrefPage(currentPage + 1)} style={pgBtn(false)}>
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
              </a>
            ) : (
              <span style={pgBtn(false, true)}>
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
              </span>
            )}
          </div>
        </div>
      )}
      </div>{/* end scrollable section */}
    </div>
  )
}

function pgBtn(active: boolean, disabled = false): React.CSSProperties {
  return {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    minWidth: '32px', height: '32px', padding: '0 8px',
    borderRadius: '7px', textDecoration: 'none',
    fontFamily: 'var(--font-ui)', fontSize: '0.75rem', fontWeight: active ? 700 : 500,
    background: active ? '#7C3AED' : disabled ? '#F8FAFC' : '#fff',
    color:      active ? '#fff'    : disabled ? '#C0CCDA' : '#3D5A7A',
    border:     `1.5px solid ${active ? '#7C3AED' : '#E4EAF1'}`,
    cursor:     disabled ? 'default' : 'pointer',
    pointerEvents: disabled ? 'none' : 'auto',
  }
}

function buildPageRange(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages: (number | '…')[] = []
  const addPage = (n: number) => { if (!pages.includes(n)) pages.push(n) }
  const addEllipsis = () => { if (pages[pages.length - 1] !== '…') pages.push('…') }
  addPage(1)
  if (current > 3) addEllipsis()
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) addPage(i)
  if (current < total - 2) addEllipsis()
  addPage(total)
  return pages
}
