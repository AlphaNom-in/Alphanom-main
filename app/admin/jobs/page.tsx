import { createAdminClient } from '@/lib/supabase/admin'
import JobActions             from './JobActions'

function fmtBudget(min: number | null, max: number | null) {
  if (!min && !max) return '—'
  const fmt = (n: number) => `₹${Math.round(n / 100000)}L`
  if (min && max) return `${fmt(min)}–${fmt(max)}`
  return fmt(min ?? max!)
}

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  active: { bg: '#F0FBF9', color: '#0A9E97' },
  paused: { bg: '#FFF8E7', color: '#B7791F' },
  closed: { bg: '#FFF5F5', color: '#C53030' },
}

export default async function AdminJobsPage() {
  const admin = createAdminClient()

  const { data: jobs } = await admin
    .from('job_posts')
    .select('id, title, department, location, work_model, budget_min, budget_max, status, created_at, employers(company_name)')
    .order('created_at', { ascending: false })

  const { data: subCounts } = await admin
    .from('candidate_submissions')
    .select('job_post_id, status')

  const countMap: Record<string, { total: number; hired: number }> = {}
  for (const s of subCounts ?? []) {
    if (!countMap[s.job_post_id]) countMap[s.job_post_id] = { total: 0, hired: 0 }
    countMap[s.job_post_id].total++
    if (s.status === 'hired') countMap[s.job_post_id].hired++
  }

  const total  = jobs?.length ?? 0
  const active = (jobs ?? []).filter(j => j.status === 'active').length
  const paused = (jobs ?? []).filter(j => j.status === 'paused').length
  const closed = (jobs ?? []).filter(j => j.status === 'closed').length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <style>{`.an-tr:hover td { background: #F8FAFC; }`}</style>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-ui)', fontSize: '1.4rem', fontWeight: 800, color: '#0F1C2E', letterSpacing: '-0.025em', margin: '0 0 4px' }}>Job Posts</h1>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: '#96AFCA', margin: 0 }}>{total} total job posts</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[
            { label: 'Total',  value: total,  bg: '#EFF6FF', color: '#032655' },
            { label: 'Active', value: active, bg: '#F0FBF9', color: '#0A9E97' },
            { label: 'Paused', value: paused, bg: '#FFF8E7', color: '#B7791F' },
            { label: 'Closed', value: closed, bg: '#FFF5F5', color: '#C53030' },
          ].map(c => (
            <div key={c.label} style={{ padding: '8px 14px', borderRadius: '8px', background: c.bg, border: `1px solid ${c.color}22` }}>
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
                {['Job Title', 'Company', 'Location', 'Budget', 'Work Model', 'Submissions', 'Hired', 'Status', 'Posted', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '11px 16px', fontFamily: 'var(--font-ui)', fontSize: '0.62rem', fontWeight: 700, color: '#96AFCA', textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(jobs ?? []).map((j: any) => {
                const counts = countMap[j.id] ?? { total: 0, hired: 0 }
                const st     = STATUS_STYLE[j.status] ?? STATUS_STYLE.active
                return (
                  <tr key={j.id} className="an-tr" style={{ borderBottom: '1px solid #F4F6FB' }}>
                    {/* Title */}
                    <td style={{ padding: '13px 16px', maxWidth: '200px' }}>
                      <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', fontWeight: 700, color: '#0F1C2E', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{j.title}</p>
                      {j.department && <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.68rem', color: '#96AFCA', margin: '2px 0 0' }}>{j.department}</p>}
                    </td>
                    {/* Company */}
                    <td style={{ padding: '13px 16px' }}>
                      <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: '#5A7A9F', margin: 0, whiteSpace: 'nowrap' }}>{j.employers?.company_name ?? '—'}</p>
                    </td>
                    {/* Location */}
                    <td style={{ padding: '13px 16px' }}>
                      <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: '#5A7A9F', margin: 0, whiteSpace: 'nowrap' }}>{j.location ?? '—'}</p>
                    </td>
                    {/* Budget */}
                    <td style={{ padding: '13px 16px' }}>
                      <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', fontWeight: 600, color: '#0F1C2E', margin: 0, whiteSpace: 'nowrap' }}>{fmtBudget(j.budget_min, j.budget_max)}</p>
                    </td>
                    {/* Work Model */}
                    <td style={{ padding: '13px 16px' }}>
                      {j.work_model
                        ? <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.68rem', fontWeight: 600, padding: '3px 8px', borderRadius: '5px', background: '#EFF6FF', color: '#032655', whiteSpace: 'nowrap' }}>{j.work_model}</span>
                        : <span style={{ color: '#C0CDD8' }}>—</span>}
                    </td>
                    {/* Submissions */}
                    <td style={{ padding: '13px 16px' }}>
                      <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.875rem', fontWeight: 700, color: '#0F1C2E', margin: 0 }}>{counts.total}</p>
                    </td>
                    {/* Hired */}
                    <td style={{ padding: '13px 16px' }}>
                      <span style={{ display: 'inline-block', fontFamily: 'var(--font-ui)', fontSize: '0.78rem', fontWeight: 700, color: '#276749', background: '#C6F6D5', padding: '3px 9px', borderRadius: '6px' }}>
                        {counts.hired}
                      </span>
                    </td>
                    {/* Status */}
                    <td style={{ padding: '13px 16px' }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                        fontFamily: 'var(--font-ui)', fontSize: '0.68rem', fontWeight: 700,
                        padding: '3px 9px', borderRadius: '99px',
                        background: st.bg, color: st.color,
                        whiteSpace: 'nowrap', textTransform: 'capitalize',
                      }}>
                        <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'currentColor' }} />
                        {j.status}
                      </span>
                    </td>
                    {/* Posted */}
                    <td style={{ padding: '13px 16px' }}>
                      <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', color: '#96AFCA', margin: 0, whiteSpace: 'nowrap' }}>
                        {new Date(j.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </td>
                    {/* Actions */}
                    <td style={{ padding: '13px 16px' }}>
                      <JobActions id={j.id} status={j.status ?? 'active'} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {!jobs?.length && (
            <div style={{ padding: '60px', textAlign: 'center' }}>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.875rem', color: '#96AFCA', margin: 0 }}>No jobs posted yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}