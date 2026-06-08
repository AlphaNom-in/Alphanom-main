import { createAdminClient } from '@/lib/supabase/admin'
import RecruiterActions       from './RecruiterActions'
import Link                   from 'next/link'

function initials(name: string) {
  return (name ?? '').split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase() || '?'
}

export default async function AdminRecruitersPage() {
  const admin = createAdminClient()

  const { data: recruiters } = await admin
    .from('recruiters')
    .select('id, full_name, email, contact_primary, specialization, years_of_experience, total_roles_closed, is_verified, created_at')
    .order('created_at', { ascending: false })

  const { data: subStats } = await admin
    .from('candidate_submissions')
    .select('recruiter_id, status, current_ctc')

  const statsMap: Record<string, { total: number; hired: number; earnings: number }> = {}
  for (const s of subStats ?? []) {
    if (!s.recruiter_id) continue
    if (!statsMap[s.recruiter_id]) statsMap[s.recruiter_id] = { total: 0, hired: 0, earnings: 0 }
    statsMap[s.recruiter_id].total++
    if (s.status === 'hired') {
      statsMap[s.recruiter_id].hired++
      statsMap[s.recruiter_id].earnings += (s.current_ctc ?? 0) * 0.04
    }
  }

  function fmtEarnings(n: number) {
    if (n === 0) return '₹0'
    const L = n / 100000
    return L >= 1 ? `₹${L.toFixed(1)}L` : `₹${Math.round(n / 1000)}K`
  }

  const total      = recruiters?.length ?? 0
  const verified   = (recruiters ?? []).filter(r => r.is_verified).length
  const unverified = total - verified

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <style>{`.an-tr:hover td { background: #F8FAFC; }`}</style>

      {/* Header + summary chips */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-ui)', fontSize: '1.4rem', fontWeight: 800, color: '#0F1C2E', letterSpacing: '-0.025em', margin: '0 0 4px' }}>Recruiters</h1>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: '#96AFCA', margin: 0 }}>{total} registered recruiters</p>
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
                {['Recruiter', 'Contact', 'Specialization', 'Exp.', 'Submissions', 'Hired', 'Earnings', 'Status', 'Joined', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '11px 16px', fontFamily: 'var(--font-ui)', fontSize: '0.62rem', fontWeight: 700, color: '#96AFCA', textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(recruiters ?? []).map(r => {
                const s     = statsMap[r.id] ?? { total: 0, hired: 0, earnings: 0 }
                const specs = Array.isArray(r.specialization) ? r.specialization : r.specialization ? [r.specialization] : []
                return (
                  <tr key={r.id} className="an-tr" style={{ borderBottom: '1px solid #F4F6FB' }}>
                    {/* Name */}
                    <td style={{ padding: '13px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '34px', height: '34px', borderRadius: '9px', background: 'linear-gradient(135deg,#032655,#0FB9B1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 800, fontSize: '0.68rem', color: '#fff' }}>{initials(r.full_name)}</span>
                        </div>
                        <Link href={`/admin/recruiters/${r.id}`} style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', fontWeight: 700, color: '#032655', margin: 0, whiteSpace: 'nowrap', textDecoration: 'none' }}>
                          {r.full_name ?? '—'}
                        </Link>
                      </div>
                    </td>
                    {/* Contact */}
                    <td style={{ padding: '13px 16px' }}>
                      <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', color: '#5A7A9F', margin: 0 }}>{r.email}</p>
                      {r.contact_primary && <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', color: '#96AFCA', margin: '2px 0 0' }}>{r.contact_primary}</p>}
                    </td>
                    {/* Specialization */}
                    <td style={{ padding: '13px 16px', maxWidth: '180px' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {specs.length ? specs.slice(0, 2).map((sp: string, i: number) => (
                          <span key={i} style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', fontWeight: 600, padding: '2px 7px', borderRadius: '5px', background: '#EFF6FF', color: '#032655', whiteSpace: 'nowrap' }}>{sp}</span>
                        )) : <span style={{ color: '#C0CDD8', fontSize: '0.75rem' }}>—</span>}
                        {specs.length > 2 && <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', color: '#96AFCA' }}>+{specs.length - 2}</span>}
                      </div>
                    </td>
                    {/* Exp */}
                    <td style={{ padding: '13px 16px' }}>
                      <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', fontWeight: 600, color: '#0F1C2E', margin: 0 }}>
                        {r.years_of_experience != null ? `${r.years_of_experience}y` : '—'}
                      </p>
                    </td>
                    {/* Submissions */}
                    <td style={{ padding: '13px 16px' }}>
                      <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.875rem', fontWeight: 700, color: '#0F1C2E', margin: 0 }}>{s.total}</p>
                    </td>
                    {/* Hired */}
                    <td style={{ padding: '13px 16px' }}>
                      <span style={{ display: 'inline-block', fontFamily: 'var(--font-ui)', fontSize: '0.78rem', fontWeight: 700, color: '#276749', background: '#C6F6D5', padding: '3px 9px', borderRadius: '6px' }}>
                        {s.hired}
                      </span>
                    </td>
                    {/* Earnings */}
                    <td style={{ padding: '13px 16px' }}>
                      <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', fontWeight: 700, color: '#0A9E97', margin: 0 }}>{fmtEarnings(s.earnings)}</p>
                    </td>
                    {/* Verified */}
                    <td style={{ padding: '13px 16px' }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                        fontFamily: 'var(--font-ui)', fontSize: '0.68rem', fontWeight: 700,
                        padding: '3px 9px', borderRadius: '99px',
                        background: r.is_verified ? '#F0FBF9' : '#FFF8E7',
                        color: r.is_verified ? '#0A9E97' : '#B7791F',
                      }}>
                        <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'currentColor' }} />
                        {r.is_verified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    {/* Joined */}
                    <td style={{ padding: '13px 16px' }}>
                      <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', color: '#96AFCA', margin: 0, whiteSpace: 'nowrap' }}>
                        {new Date(r.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </td>
                    {/* Actions */}
                    <td style={{ padding: '13px 16px' }}>
                      <RecruiterActions id={r.id} isVerified={!!r.is_verified} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {!recruiters?.length && (
            <div style={{ padding: '60px', textAlign: 'center' }}>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.875rem', color: '#96AFCA', margin: 0 }}>No recruiters yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}