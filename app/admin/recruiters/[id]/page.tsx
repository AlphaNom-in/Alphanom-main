import { createAdminClient } from '@/lib/supabase/admin'
import Link                   from 'next/link'
import { notFound }           from 'next/navigation'
import UpdateRecruiterForm     from './UpdateRecruiterForm'

function fmtCTC(paise: number | null) {
  if (!paise) return '—'
  const L = paise / 100000
  return L >= 1 ? `₹${L.toFixed(1)}L` : `₹${Math.round(paise / 1000)}K`
}

export default async function RecruiterDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const admin  = createAdminClient()

  const [{ data: recruiter }, { data: subs }] = await Promise.all([
    admin.from('recruiters').select('id, full_name, email, contact_primary, specialization, years_of_experience, total_roles_closed, is_verified, created_at').eq('id', id).single(),
    admin.from('candidate_submissions')
      .select('id, candidate_name, status, submitted_at, current_ctc, job_posts(title, employers(company_name))')
      .eq('recruiter_id', id)
      .order('submitted_at', { ascending: false })
      .limit(30),
  ])

  if (!recruiter) notFound()

  const totalSubs  = subs?.length ?? 0
  const hiredCount = (subs ?? []).filter(s => s.status === 'hired').length
  const earnings   = (subs ?? []).filter(s => s.status === 'hired').reduce((sum: number, s: any) => sum + (s.current_ctc ? s.current_ctc * 0.04 : 0), 0)
  const hireRate   = totalSubs ? Math.round((hiredCount / totalSubs) * 100) : 0

  const specs = Array.isArray(recruiter.specialization) ? recruiter.specialization : []

  const SUB_STATUS: Record<string, { bg: string; color: string; dot: string; label: string }> = {
    in_pipeline:     { bg: '#EEF3F8', color: '#5A7A9F', dot: '#96AFCA', label: 'Pipeline' },
    in_review:       { bg: '#EDE9FE', color: '#7C3AED', dot: '#7C3AED', label: 'In Review' },
    shortlisted:     { bg: '#D8F0EB', color: '#0A9E97', dot: '#0FB9B1', label: 'Shortlisted' },
    saved_for_later: { bg: '#FFF8E7', color: '#B7791F', dot: '#F5A623', label: 'Saved' },
    hired:           { bg: '#DCFCE7', color: '#166534', dot: '#22C55E', label: 'Hired' },
    rejected:        { bg: '#FFF1F2', color: '#BE123C', dot: '#F43F5E', label: 'Rejected' },
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>

      {/* Breadcrumb + header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
            <Link href="/admin/recruiters" style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', color: '#96AFCA', textDecoration: 'none', fontWeight: 500 }}>Recruiters</Link>
            <svg width="12" height="12" fill="none" stroke="#D0DBE8" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/></svg>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', color: '#5A7A9F', fontWeight: 600 }}>{recruiter.full_name ?? id}</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-ui)', fontSize: '1.4rem', fontWeight: 800, color: '#0F1C2E', letterSpacing: '-0.025em', margin: '0 0 6px' }}>
            {recruiter.full_name ?? 'Recruiter Profile'}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-ui)', fontSize: '0.68rem', fontWeight: 700, padding: '3px 9px', borderRadius: '99px', background: recruiter.is_verified ? '#F0FBF9' : '#FFF8E7', color: recruiter.is_verified ? '#0A9E97' : '#B7791F' }}>
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'currentColor' }} />
              {recruiter.is_verified ? 'Verified' : 'Pending Verification'}
            </span>
            {specs.map((s: string, i: number) => (
              <span key={i} style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', fontWeight: 600, padding: '2px 8px', borderRadius: '5px', background: '#EFF6FF', color: '#032655' }}>{s}</span>
            ))}
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.68rem', color: '#96AFCA' }}>
              Joined {new Date(recruiter.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>
        </div>
        <Link
          href="/admin/recruiters"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '8px', border: '1px solid #E4EAF1', background: '#fff', fontFamily: 'var(--font-ui)', fontSize: '0.75rem', fontWeight: 600, color: '#5A7A9F', textDecoration: 'none' }}
        >
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"/></svg>
          Back to Recruiters
        </Link>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
        {[
          { label: 'Submissions',   value: totalSubs,                       color: '#7C3AED', bg: '#EDE9FE' },
          { label: 'Hired',         value: hiredCount,                      color: '#16A34A', bg: '#DCFCE7' },
          { label: 'Hire Rate',     value: `${hireRate}%`,                  color: '#0A9E97', bg: '#F0FBF9' },
          { label: 'Est. Earnings', value: earnings > 0 ? `₹${Math.round(earnings / 100000)}L` : '₹0', color: '#F5A623', bg: '#FFF8E7' },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', borderRadius: '10px', border: '1px solid #E4EAF1', padding: '16px 18px', borderTop: `3px solid ${s.color}` }}>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '1.6rem', fontWeight: 800, color: '#0F1C2E', margin: '0 0 2px', letterSpacing: '-0.04em' }}>{s.value}</p>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.68rem', color: '#96AFCA', margin: 0, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Edit form + controls */}
      <UpdateRecruiterForm recruiter={recruiter} />

      {/* Submissions table */}
      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E4EAF1', overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #F0F4FA', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#7C3AED' }} />
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', fontWeight: 700, color: '#0F1C2E', margin: 0 }}>Candidate Submissions ({totalSubs})</p>
          </div>
          <Link href={`/admin/candidates?recruiter_id=${id}`} style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', fontWeight: 600, color: '#0FB9B1', textDecoration: 'none' }}>
            View in Candidates →
          </Link>
        </div>
        {subs?.length ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #EEF2F7' }}>
                  {['Candidate', 'Job Title', 'Company', 'CTC', 'Status', 'Submitted'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', fontFamily: 'var(--font-ui)', fontSize: '0.6rem', fontWeight: 700, color: '#96AFCA', textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(subs as any[]).map((s: any) => {
                  const st = SUB_STATUS[s.status] ?? SUB_STATUS.in_pipeline
                  return (
                    <tr key={s.id} style={{ borderBottom: '1px solid #F4F6FB' }}>
                      <td style={{ padding: '11px 16px', fontFamily: 'var(--font-ui)', fontSize: '0.78rem', fontWeight: 700, color: '#0F1C2E' }}>{s.candidate_name}</td>
                      <td style={{ padding: '11px 16px', fontFamily: 'var(--font-ui)', fontSize: '0.75rem', color: '#5A7A9F', maxWidth: '150px' }}>
                        <p style={{ margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.job_posts?.title ?? '—'}</p>
                      </td>
                      <td style={{ padding: '11px 16px', fontFamily: 'var(--font-ui)', fontSize: '0.75rem', color: '#5A7A9F' }}>{s.job_posts?.employers?.company_name ?? '—'}</td>
                      <td style={{ padding: '11px 16px', fontFamily: 'var(--font-ui)', fontSize: '0.78rem', fontWeight: 700, color: '#0F1C2E' }}>{fmtCTC(s.current_ctc)}</td>
                      <td style={{ padding: '11px 16px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-ui)', fontSize: '0.68rem', fontWeight: 700, padding: '3px 9px', borderRadius: '99px', background: st.bg, color: st.color, whiteSpace: 'nowrap' }}>
                          <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: st.dot }} />
                          {st.label}
                        </span>
                      </td>
                      <td style={{ padding: '11px 16px', fontFamily: 'var(--font-ui)', fontSize: '0.7rem', color: '#96AFCA' }}>
                        {new Date(s.submitted_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: '32px', textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', color: '#96AFCA', margin: 0 }}>No submissions yet</p>
          </div>
        )}
      </div>
    </div>
  )
}