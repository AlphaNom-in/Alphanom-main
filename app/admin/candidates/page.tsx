import { createAdminClient } from '@/lib/supabase/admin'

const STATUS_STYLE: Record<string, { bg: string; color: string; dot: string; label: string }> = {
  in_pipeline:     { bg: '#EEF3F8', color: '#5A7A9F', dot: '#96AFCA', label: 'In Pipeline' },
  in_review:       { bg: '#EDE9FE', color: '#7C3AED', dot: '#7C3AED', label: 'In Review' },
  shortlisted:     { bg: '#D8F0EB', color: '#0A9E97', dot: '#0FB9B1', label: 'Shortlisted' },
  saved_for_later: { bg: '#FFF8E7', color: '#B7791F', dot: '#F5A623', label: 'Saved for Later' },
  hired:           { bg: '#DCFCE7', color: '#166534', dot: '#22C55E', label: 'Hired' },
  rejected:        { bg: '#FFF1F2', color: '#BE123C', dot: '#F43F5E', label: 'Not Selected' },
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
  searchParams: Promise<{ status?: string }>
}) {
  const { status } = await searchParams
  const admin = createAdminClient()

  let subsQuery = admin
    .from('candidate_submissions')
    .select('id, candidate_name, email, status, submitted_at, current_ctc, total_experience, job_posts(title, employers(company_name)), recruiters(full_name)')
    .order('submitted_at', { ascending: false })
    .limit(100)
  if (status && status !== 'all') subsQuery = subsQuery.eq('status', status)

  const [queryResult, allResult] = await Promise.all([
    subsQuery,
    admin.from('candidate_submissions').select('status'),
  ])

  const submissions = queryResult.data ?? []
  const allSubs = allResult.data ?? []

  const countByStatus: Record<string, number> = {}
  for (const s of allSubs) {
    countByStatus[s.status] = (countByStatus[s.status] ?? 0) + 1
  }
  const totalCount = allSubs.length

  const TABS = [
    { key: 'all',            label: 'All',           count: totalCount },
    { key: 'in_pipeline',    label: 'In Pipeline',   count: countByStatus['in_pipeline'] ?? 0 },
    { key: 'in_review',      label: 'In Review',     count: countByStatus['in_review'] ?? 0 },
    { key: 'shortlisted',    label: 'Shortlisted',   count: countByStatus['shortlisted'] ?? 0 },
    { key: 'hired',          label: 'Hired',         count: countByStatus['hired'] ?? 0 },
    { key: 'rejected',       label: 'Not Selected',  count: countByStatus['rejected'] ?? 0 },
  ]

  const currentTab = status ?? 'all'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <style>{`.an-tr:hover td { background: #F8FAFC; } .an-tab:hover { border-color: #96AFCA !important; color: #3D5A7A !important; }`}</style>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.62rem', fontWeight: 700, color: '#7C3AED', letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0 0 4px' }}>Tracking</p>
          <h1 style={{ fontFamily: 'var(--font-ui)', fontSize: '1.5rem', fontWeight: 800, color: '#0F1C2E', letterSpacing: '-0.03em', margin: 0 }}>Candidates</h1>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          {[
            { label: 'Total',    value: totalCount,                          color: '#032655', bg: '#EFF6FF' },
            { label: 'Hired',    value: countByStatus['hired'] ?? 0,         color: '#166534', bg: '#DCFCE7' },
            { label: 'Pipeline', value: countByStatus['in_pipeline'] ?? 0,   color: '#5A7A9F', bg: '#EEF3F8' },
          ].map(c => (
            <div key={c.label} style={{ padding: '8px 16px', borderRadius: '8px', background: c.bg, border: `1px solid ${c.color}22` }}>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '1.05rem', fontWeight: 800, color: c.color, margin: 0, lineHeight: 1 }}>{c.value}</p>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.6rem', color: c.color, margin: '2px 0 0', opacity: 0.75 }}>{c.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Status tabs */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {TABS.map(tab => {
          const active = currentTab === tab.key
          const href   = tab.key === 'all' ? '/admin/candidates' : `/admin/candidates?status=${tab.key}`
          return (
            <a
              key={tab.key} href={href}
              className={active ? '' : 'an-tab'}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '7px 14px', borderRadius: '8px', textDecoration: 'none',
                fontFamily: 'var(--font-ui)', fontSize: '0.75rem', fontWeight: active ? 700 : 500,
                background: active ? '#032655' : '#fff',
                color:      active ? '#fff'    : '#5A7A9F',
                border:     `1.5px solid ${active ? '#032655' : '#E4EAF1'}`,
                transition: 'all 0.1s',
              }}
            >
              {tab.label}
              <span style={{
                fontFamily: 'var(--font-ui)', fontSize: '0.62rem', fontWeight: 700,
                padding: '1px 6px', borderRadius: '99px',
                background: active ? 'rgba(255,255,255,0.2)' : '#F4F6FB',
                color:      active ? '#fff' : '#96AFCA',
              }}>
                {tab.count}
              </span>
            </a>
          )
        })}
      </div>

      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E4EAF1', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #EEF2F7' }}>
                {['Candidate', 'Job Title', 'Company', 'Recruiter', 'CTC', 'Exp', 'Status', 'Submitted'].map(h => (
                  <th key={h} style={{ padding: '11px 16px', fontFamily: 'var(--font-ui)', fontSize: '0.62rem', fontWeight: 700, color: '#96AFCA', textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(submissions as any[]).map((s: any) => {
                const st  = STATUS_STYLE[s.status] ?? STATUS_STYLE.in_pipeline
                const col = avatarColor(s.candidate_name)
                return (
                  <tr key={s.id} className="an-tr" style={{ borderBottom: '1px solid #F4F6FB' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0, background: `${col}14`, border: `1.5px solid ${col}28`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 800, fontSize: '0.6rem', color: col }}>{initials(s.candidate_name)}</span>
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.8rem', fontWeight: 700, color: '#0F1C2E', margin: 0, whiteSpace: 'nowrap' }}>{s.candidate_name}</p>
                          {s.email && <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', color: '#96AFCA', margin: '1px 0 0', whiteSpace: 'nowrap' }}>{s.email}</p>}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', maxWidth: '160px' }}>
                      <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: '#5A7A9F', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {s.job_posts?.title ?? '—'}
                      </p>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', color: '#5A7A9F', margin: 0, whiteSpace: 'nowrap' }}>{s.job_posts?.employers?.company_name ?? '—'}</p>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', color: '#5A7A9F', margin: 0, whiteSpace: 'nowrap' }}>{s.recruiters?.full_name ?? '—'}</p>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.8rem', fontWeight: 700, color: '#0F1C2E', margin: 0 }}>{fmtCTC(s.current_ctc)}</p>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: '#5A7A9F', margin: 0 }}>
                        {s.total_experience != null ? `${s.total_experience}y` : '—'}
                      </p>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-ui)', fontSize: '0.68rem', fontWeight: 700, padding: '3px 9px', borderRadius: '99px', background: st.bg, color: st.color, whiteSpace: 'nowrap' }}>
                        <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: st.dot }} />
                        {st.label}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', color: '#96AFCA', margin: 0, whiteSpace: 'nowrap' }}>
                        {new Date(s.submitted_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {!submissions.length && (
            <div style={{ padding: '64px', textAlign: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#EDE9FE', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <svg width="20" height="20" fill="none" stroke="#7C3AED" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z"/></svg>
              </div>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', fontWeight: 600, color: '#5A7A9F', margin: '0 0 4px' }}>No submissions found</p>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', color: '#96AFCA', margin: 0 }}>Try a different filter tab</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}