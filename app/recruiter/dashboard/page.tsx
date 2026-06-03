import { createClient } from '@/lib/supabase/server'
import MetricCard from '@/components/recruiter/MetricCard'
import Link from 'next/link'

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  in_pipeline:     { bg: '#EEF3F8', color: '#5A7A9F', label: 'In Pipeline' },
  shortlisted:     { bg: '#D8F0EB', color: '#0A9E97', label: 'Shortlisted' },
  saved_for_later: { bg: '#FFF8E7', color: '#B7791F', label: 'Saved for Later' },
  hired:           { bg: '#C6F6D5', color: '#276749', label: 'Hired ✓' },
  rejected:        { bg: '#FFF5F5', color: '#E53E3E', label: 'Rejected' },
}

export default async function Page() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: recruiter } = await supabase
    .from('recruiters').select('*').eq('user_id', user?.id).single()

  if (!recruiter) return <div>Recruiter profile not found</div>

  const [
    { count: savedJobs },
    { count: submissions },
    { count: shortlisted },
    { data: recentSubmissions },
  ] = await Promise.all([
    supabase.from('recruiter_saved_jobs').select('*', { count: 'exact', head: true }).eq('recruiter_id', recruiter.id),
    supabase.from('candidate_submissions').select('*', { count: 'exact', head: true }).eq('recruiter_id', recruiter.id),
    supabase.from('candidate_submissions').select('*', { count: 'exact', head: true }).eq('recruiter_id', recruiter.id).eq('status', 'shortlisted'),
    supabase.from('candidate_submissions').select('id, candidate_name, status, submitted_at, job_posts(title)').eq('recruiter_id', recruiter.id).order('submitted_at', { ascending: false }).limit(20),
  ])

  return (
    <div className="rdash-page-root" style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '20px' }}>

      {/* Page header — fixed */}
      <div style={{ flexShrink: 0 }}>
        <h1 style={{ fontSize: '22px', color: '#032655', fontWeight: 700, marginBottom: '2px' }}>
          Welcome back, {recruiter.full_name}
        </h1>
        <p style={{ color: '#5A7A9F', fontSize: '13px' }}>Track your jobs, submissions and earnings.</p>
      </div>

      {/* Metric cards — fixed */}
      <div className="rdash-metrics-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', flexShrink: 0 }}>
        <MetricCard title="Saved Jobs"   value={savedJobs ?? 0} />
        <MetricCard title="Submissions"  value={submissions ?? 0} />
        <MetricCard title="Shortlisted"  value={shortlisted ?? 0} />
        <MetricCard title="Roles Closed" value={recruiter.total_roles_closed ?? 0} />
      </div>

      {/* Submissions table — takes remaining height, scrolls internally */}
      <div style={{ flex: 1, minHeight: 0, background: '#fff', borderRadius: '16px', border: '1px solid #D0DBE8', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid #EEF3F8', flexShrink: 0 }}>
          <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#032655', margin: 0 }}>My Submitted Candidates</h2>
          <Link href="/recruiter/dashboard/my-jobs" style={{ fontSize: '13px', color: '#0FB9B1', fontWeight: 600, textDecoration: 'none' }}>
            View all →
          </Link>
        </div>

        {!recentSubmissions?.length ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '8px' }}>
            <p style={{ color: '#5A7A9F', fontSize: '14px', fontWeight: 600 }}>No candidates submitted yet.</p>
            <Link href="/recruiter/dashboard/all-jobs" style={{ color: '#0FB9B1', fontWeight: 600, fontSize: '13px', textDecoration: 'none' }}>Browse jobs →</Link>
          </div>
        ) : (
          <div className="rdash-scrollable rdash-table-wrap" style={{ overflowY: 'auto', flex: 1, minHeight: 0 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ position: 'sticky', top: 0, background: '#F5F8FC', zIndex: 1 }}>
                <tr>
                  {['Candidate', 'Job Role', 'Status', 'Submitted'].map((h) => (
                    <th key={h} style={{ padding: '10px 24px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#96AFCA', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentSubmissions.map((sub: any, i: number) => {
                  const s = STATUS_STYLE[sub.status] ?? STATUS_STYLE.in_pipeline
                  return (
                    <tr key={sub.id} style={{ borderTop: i === 0 ? 'none' : '1px solid #EEF3F8' }}>
                      <td style={{ padding: '13px 24px', fontSize: '14px', fontWeight: 600, color: '#032655' }}>{sub.candidate_name}</td>
                      <td style={{ padding: '13px 24px', fontSize: '14px', color: '#5A7A9F' }}>{(sub.job_posts as any)?.title ?? '—'}</td>
                      <td style={{ padding: '13px 24px' }}>
                        <span style={{ background: s.bg, color: s.color, fontWeight: 600, fontSize: '12px', padding: '4px 10px', borderRadius: '20px', whiteSpace: 'nowrap' }}>
                          {s.label}
                        </span>
                      </td>
                      <td style={{ padding: '13px 24px', fontSize: '13px', color: '#96AFCA', whiteSpace: 'nowrap' }}>
                        {new Date(sub.submitted_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
