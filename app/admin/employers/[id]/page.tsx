import { createAdminClient } from '@/lib/supabase/admin'
import Link                   from 'next/link'
import { notFound }           from 'next/navigation'
import UpdateEmployerForm     from './UpdateEmployerForm'

function fmtBudget(min: number | null, max: number | null) {
  if (!min && !max) return '—'
  const fmt = (n: number) => `₹${Math.round(n / 100000)}L`
  if (min && max) return `${fmt(min)}–${fmt(max)}`
  return fmt(min ?? max!)
}

export default async function EmployerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const admin  = createAdminClient()

  const [{ data: employer }, { data: jobs }, { data: subs }] = await Promise.all([
    admin.from('employers').select('id, company_name, email, contact_primary, industry, company_address, is_verified, created_at').eq('id', id).single(),
    admin.from('job_posts').select('id, title, status, budget_min, budget_max, location, work_model, created_at').eq('employer_id', id).order('created_at', { ascending: false }),
    admin.from('candidate_submissions').select('id, candidate_name, status, submitted_at, job_posts!inner(employer_id)').eq('job_posts.employer_id', id).order('submitted_at', { ascending: false }).limit(20),
  ])

  if (!employer) notFound()

  const totalJobs   = jobs?.length ?? 0
  const activeJobs  = (jobs ?? []).filter(j => j.status === 'active').length
  const totalSubs   = subs?.length ?? 0
  const hiredCount  = (subs ?? []).filter(s => s.status === 'hired').length

  const STATUS_DOT: Record<string, string> = { active: '#16A34A', paused: '#F5A623', closed: '#C53030' }
  const SUB_STATUS: Record<string, { bg: string; color: string; label: string }> = {
    in_pipeline:     { bg: '#EEF3F8', color: '#5A7A9F', label: 'Pipeline' },
    in_review:       { bg: '#EDE9FE', color: '#7C3AED', label: 'In Review' },
    shortlisted:     { bg: '#D8F0EB', color: '#0A9E97', label: 'Shortlisted' },
    saved_for_later: { bg: '#FFF8E7', color: '#B7791F', label: 'Saved' },
    hired:           { bg: '#DCFCE7', color: '#166534', label: 'Hired' },
    rejected:        { bg: '#FFF1F2', color: '#BE123C', label: 'Rejected' },
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>

      {/* Breadcrumb + header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
            <Link href="/admin/employers" style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', color: '#96AFCA', textDecoration: 'none', fontWeight: 500 }}>Employers</Link>
            <svg width="12" height="12" fill="none" stroke="#D0DBE8" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/></svg>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', color: '#5A7A9F', fontWeight: 600 }}>{employer.company_name ?? id}</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-ui)', fontSize: '1.4rem', fontWeight: 800, color: '#0F1C2E', letterSpacing: '-0.025em', margin: '0 0 4px' }}>
            {employer.company_name ?? 'Employer Profile'}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-ui)', fontSize: '0.68rem', fontWeight: 700, padding: '3px 9px', borderRadius: '99px', background: employer.is_verified ? '#F0FBF9' : '#FFF8E7', color: employer.is_verified ? '#0A9E97' : '#B7791F' }}>
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'currentColor' }} />
              {employer.is_verified ? 'Verified' : 'Pending Verification'}
            </span>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.68rem', color: '#96AFCA' }}>
              Joined {new Date(employer.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>
        </div>
        <Link
          href="/admin/employers"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '8px', border: '1px solid #E4EAF1', background: '#fff', fontFamily: 'var(--font-ui)', fontSize: '0.75rem', fontWeight: 600, color: '#5A7A9F', textDecoration: 'none' }}
        >
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"/></svg>
          Back to Employers
        </Link>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
        {[
          { label: 'Total Jobs',   value: totalJobs,  color: '#032655', bg: '#EFF6FF' },
          { label: 'Active Jobs',  value: activeJobs, color: '#16A34A', bg: '#DCFCE7' },
          { label: 'Submissions',  value: totalSubs,  color: '#7C3AED', bg: '#EDE9FE' },
          { label: 'Hired',        value: hiredCount, color: '#0A9E97', bg: '#F0FBF9' },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', borderRadius: '10px', border: '1px solid #E4EAF1', padding: '16px 18px', borderTop: `3px solid ${s.color}` }}>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '1.6rem', fontWeight: 800, color: '#0F1C2E', margin: '0 0 2px', letterSpacing: '-0.04em' }}>{s.value}</p>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.68rem', color: '#96AFCA', margin: 0, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Edit form + controls */}
      <UpdateEmployerForm employer={employer} />

      {/* Job posts table */}
      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E4EAF1', overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #F0F4FA', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#F5A623' }} />
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', fontWeight: 700, color: '#0F1C2E', margin: 0 }}>Job Posts ({totalJobs})</p>
          </div>
          <Link href={`/admin/jobs?employer_id=${id}`} style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', fontWeight: 600, color: '#0FB9B1', textDecoration: 'none' }}>
            View in Jobs →
          </Link>
        </div>
        {jobs?.length ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #EEF2F7' }}>
                  {['Title', 'Location', 'Budget', 'Work Model', 'Status', 'Posted'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', fontFamily: 'var(--font-ui)', fontSize: '0.6rem', fontWeight: 700, color: '#96AFCA', textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {jobs.map((j: any) => (
                  <tr key={j.id} style={{ borderBottom: '1px solid #F4F6FB' }}>
                    <td style={{ padding: '11px 16px', fontFamily: 'var(--font-ui)', fontSize: '0.78rem', fontWeight: 700, color: '#0F1C2E' }}>{j.title}</td>
                    <td style={{ padding: '11px 16px', fontFamily: 'var(--font-ui)', fontSize: '0.75rem', color: '#5A7A9F' }}>{j.location ?? '—'}</td>
                    <td style={{ padding: '11px 16px', fontFamily: 'var(--font-ui)', fontSize: '0.78rem', fontWeight: 600, color: '#0F1C2E' }}>{fmtBudget(j.budget_min, j.budget_max)}</td>
                    <td style={{ padding: '11px 16px' }}>
                      {j.work_model ? <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', fontWeight: 600, padding: '2px 7px', borderRadius: '5px', background: '#EFF6FF', color: '#032655' }}>{j.work_model}</span> : <span style={{ color: '#C0CDD8' }}>—</span>}
                    </td>
                    <td style={{ padding: '11px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: STATUS_DOT[j.status] ?? '#96AFCA' }} />
                        <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 600, color: STATUS_DOT[j.status] ?? '#96AFCA', textTransform: 'capitalize' }}>{j.status}</span>
                      </div>
                    </td>
                    <td style={{ padding: '11px 16px', fontFamily: 'var(--font-ui)', fontSize: '0.7rem', color: '#96AFCA' }}>
                      {new Date(j.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: '32px', textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', color: '#96AFCA', margin: 0 }}>No job posts yet</p>
          </div>
        )}
      </div>

      {/* Recent submissions */}
      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E4EAF1', overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #F0F4FA', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#7C3AED' }} />
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', fontWeight: 700, color: '#0F1C2E', margin: 0 }}>Recent Candidate Submissions</p>
        </div>
        {subs?.length ? (
          <div>
            {(subs as any[]).map((s: any, idx: number) => {
              const st = SUB_STATUS[s.status] ?? SUB_STATUS.in_pipeline
              return (
                <div key={s.id} style={{ padding: '11px 20px', borderBottom: idx < subs.length - 1 ? '1px solid #F4F6FB' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                  <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', fontWeight: 700, color: '#0F1C2E', margin: 0 }}>{s.candidate_name}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.68rem', fontWeight: 700, padding: '3px 9px', borderRadius: '99px', background: st.bg, color: st.color }}>{st.label}</span>
                    <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.68rem', color: '#96AFCA' }}>{new Date(s.submitted_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div style={{ padding: '32px', textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', color: '#96AFCA', margin: 0 }}>No candidate submissions yet</p>
          </div>
        )}
      </div>
    </div>
  )
}