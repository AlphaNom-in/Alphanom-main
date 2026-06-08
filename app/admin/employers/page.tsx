import { createAdminClient } from '@/lib/supabase/admin'
import EmployerActions        from './EmployerActions'

function initials(name: string) {
  return (name ?? '').split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase() || '?'
}

export default async function AdminEmployersPage() {
  const admin = createAdminClient()

  const { data: employers } = await admin
    .from('employers')
    .select('id, company_name, email, contact_primary, industry, company_address, is_verified, created_at')
    .order('created_at', { ascending: false })

  const { data: jobRows } = await admin
    .from('job_posts')
    .select('id, employer_id, status')

  const { data: subRows } = await admin
    .from('candidate_submissions')
    .select('status, job_posts(employer_id)')

  // Per-employer job counts
  const jobMap: Record<string, { total: number; active: number }> = {}
  for (const j of jobRows ?? []) {
    if (!jobMap[j.employer_id]) jobMap[j.employer_id] = { total: 0, active: 0 }
    jobMap[j.employer_id].total++
    if (j.status === 'active') jobMap[j.employer_id].active++
  }

  // Per-employer submission counts
  const subMap: Record<string, { total: number; hired: number }> = {}
  for (const s of subRows ?? []) {
    const eid = (s.job_posts as any)?.employer_id
    if (!eid) continue
    if (!subMap[eid]) subMap[eid] = { total: 0, hired: 0 }
    subMap[eid].total++
    if (s.status === 'hired') subMap[eid].hired++
  }

  const total      = employers?.length ?? 0
  const verified   = (employers ?? []).filter(e => e.is_verified).length
  const unverified = total - verified

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      <style>{`.an-tr:hover td { background: #F8FAFC; }`}</style>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-ui)', fontSize: '1.4rem', fontWeight: 800, color: '#0F1C2E', letterSpacing: '-0.025em', margin: '0 0 4px' }}>Employers</h1>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: '#96AFCA', margin: 0 }}>{total} registered employers</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[
            { label: 'Total',      value: total,      bg: '#EFF6FF', color: '#032655' },
            { label: 'Verified',   value: verified,   bg: '#F0FBF9', color: '#0A9E97' },
            { label: 'Unverified', value: unverified, bg: '#FFF8E7', color: '#B7791F' },
          ].map(c => (
            <div key={c.label} style={{ padding: '8px 16px', borderRadius: '8px', background: c.bg, border: `1px solid ${c.color}22` }}>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '1.1rem', fontWeight: 800, color: c.color, margin: 0, lineHeight: 1 }}>{c.value}</p>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.62rem', color: c.color, margin: '2px 0 0', opacity: 0.7 }}>{c.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E4EAF1', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #EEF2F7' }}>
                {['Company', 'Email', 'Industry', 'Location', 'Jobs', 'Active', 'Submissions', 'Hired', 'Status', 'Joined', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '11px 16px', fontFamily: 'var(--font-ui)', fontSize: '0.62rem', fontWeight: 700, color: '#96AFCA', textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(employers ?? []).map(e => {
                const jobs = jobMap[e.id]  ?? { total: 0, active: 0 }
                const subs = subMap[e.id]  ?? { total: 0, hired: 0 }
                return (
                  <tr key={e.id} className="an-tr" style={{ borderBottom: '1px solid #F4F6FB' }}>
                    {/* Company */}
                    <td style={{ padding: '13px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '34px', height: '34px', borderRadius: '9px', flexShrink: 0, background: '#EEF3F8', border: '1px solid #D0DBE8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 800, fontSize: '0.68rem', color: '#032655' }}>{initials(e.company_name ?? '')}</span>
                        </div>
                        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', fontWeight: 700, color: '#0F1C2E', margin: 0, whiteSpace: 'nowrap' }}>{e.company_name ?? '—'}</p>
                      </div>
                    </td>
                    {/* Email + Phone */}
                    <td style={{ padding: '13px 16px' }}>
                      <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', color: '#5A7A9F', margin: 0 }}>{e.email}</p>
                      {e.contact_primary && <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', color: '#96AFCA', margin: '2px 0 0' }}>{e.contact_primary}</p>}
                    </td>
                    {/* Industry */}
                    <td style={{ padding: '13px 16px' }}>
                      {e.industry
                        ? <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.68rem', fontWeight: 600, padding: '3px 8px', borderRadius: '5px', background: '#EFF6FF', color: '#032655' }}>{e.industry}</span>
                        : <span style={{ color: '#C0CDD8', fontSize: '0.75rem' }}>—</span>}
                    </td>
                    {/* Location */}
                    <td style={{ padding: '13px 16px' }}>
                      <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', color: '#5A7A9F', margin: 0, maxWidth: '140px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {e.company_address ?? '—'}
                      </p>
                    </td>
                    {/* Jobs total */}
                    <td style={{ padding: '13px 16px' }}>
                      <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.875rem', fontWeight: 700, color: '#0F1C2E', margin: 0 }}>{jobs.total}</p>
                    </td>
                    {/* Active jobs */}
                    <td style={{ padding: '13px 16px' }}>
                      <span style={{ display: 'inline-block', fontFamily: 'var(--font-ui)', fontSize: '0.75rem', fontWeight: 700, color: '#276749', background: '#C6F6D5', padding: '2px 8px', borderRadius: '5px' }}>
                        {jobs.active}
                      </span>
                    </td>
                    {/* Submissions */}
                    <td style={{ padding: '13px 16px' }}>
                      <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.875rem', fontWeight: 700, color: '#0F1C2E', margin: 0 }}>{subs.total}</p>
                    </td>
                    {/* Hired */}
                    <td style={{ padding: '13px 16px' }}>
                      <span style={{ display: 'inline-block', fontFamily: 'var(--font-ui)', fontSize: '0.78rem', fontWeight: 700, color: '#276749', background: '#C6F6D5', padding: '3px 9px', borderRadius: '6px' }}>
                        {subs.hired}
                      </span>
                    </td>
                    {/* Verified status */}
                    <td style={{ padding: '13px 16px' }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                        fontFamily: 'var(--font-ui)', fontSize: '0.68rem', fontWeight: 700,
                        padding: '3px 9px', borderRadius: '99px',
                        background: e.is_verified ? '#F0FBF9' : '#FFF8E7',
                        color: e.is_verified ? '#0A9E97' : '#B7791F',
                      }}>
                        <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'currentColor' }} />
                        {e.is_verified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    {/* Joined */}
                    <td style={{ padding: '13px 16px' }}>
                      <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', color: '#96AFCA', margin: 0, whiteSpace: 'nowrap' }}>
                        {new Date(e.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </td>
                    {/* Actions */}
                    <td style={{ padding: '13px 16px' }}>
                      <EmployerActions id={e.id} isVerified={!!e.is_verified} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {!employers?.length && (
            <div style={{ padding: '60px', textAlign: 'center' }}>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.875rem', color: '#96AFCA', margin: 0 }}>No employers yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}