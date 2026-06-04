import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

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
    .from('recruiters').select('id').eq('user_id', user!.id).single()

  if (!recruiter) return <div>Recruiter profile not found</div>

  // Admin client so job title shows even for closed jobs
  const admin = createAdminClient()
  const { data: submissions } = await admin
    .from('candidate_submissions')
    .select('id, candidate_name, status, submitted_at, job_posts(title, department)')
    .eq('recruiter_id', recruiter.id)
    .order('submitted_at', { ascending: false })

  const total      = submissions?.length ?? 0
  const hired      = submissions?.filter(s => s.status === 'hired').length ?? 0
  const shortlisted = submissions?.filter(s => s.status === 'shortlisted').length ?? 0
  const rejected   = submissions?.filter(s => s.status === 'rejected').length ?? 0

  return (
    <div className="rdash-page-root" style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '16px' }}>

      {/* Header */}
      <div style={{ flexShrink: 0 }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#032655', marginBottom: '2px' }}>My Submissions</h1>
        <p style={{ color: '#5A7A9F', fontSize: '13px' }}>{total} candidate{total !== 1 ? 's' : ''} submitted across all jobs</p>
      </div>

      {/* Stats row */}
      <div className="rdash-stats-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', flexShrink: 0 }}>
        {[
          { label: 'Total',       value: total,       color: '#032655', bg: '#EEF3F8' },
          { label: 'Shortlisted', value: shortlisted, color: '#0A9E97', bg: '#D8F0EB' },
          { label: 'Hired',       value: hired,       color: '#276749', bg: '#C6F6D5' },
          { label: 'Rejected',    value: rejected,    color: '#E53E3E', bg: '#FFF5F5' },
        ].map(m => (
          <div key={m.label} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #D0DBE8', padding: '14px 16px' }}>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '11px', fontWeight: 700, color: '#96AFCA', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>{m.label}</p>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '22px', fontWeight: 800, color: m.color, lineHeight: 1 }}>{m.value}</p>
          </div>
        ))}
      </div>

      {/* List */}
      <div className="rdash-scrollable" style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
        {!submissions?.length ? (
          <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #D0DBE8', padding: '60px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#EEF3F8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <svg width="22" height="22" fill="none" stroke="#96AFCA" strokeWidth={1.6} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.75 3.75 0 11-6.75 0 3.75 3.75 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
            </div>
            <p style={{ color: '#5A7A9F', fontSize: '15px', fontWeight: 600, marginBottom: '6px' }}>No submissions yet</p>
            <p style={{ color: '#96AFCA', fontSize: '13px', marginBottom: '20px' }}>Browse open jobs and submit candidates to get started.</p>
            <Link href="/recruiter/dashboard/all-jobs" style={{ padding: '10px 22px', borderRadius: '10px', background: '#0FB9B1', color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>
              Browse Jobs
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {submissions.map((sub: any) => {
              const s = STATUS_STYLE[sub.status] ?? STATUS_STYLE.in_pipeline
              const job = sub.job_posts as { title: string; department: string | null } | null
              return (
                <Link
                  key={sub.id}
                  href={`/recruiter/dashboard/submissions/${sub.id}`}
                  style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '16px', background: '#fff', borderRadius: '12px', border: '1px solid #D0DBE8', padding: '14px 20px', transition: 'border-color 0.15s' }}
                >
                  {/* Status dot */}
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="16" height="16" fill="none" stroke={s.color} strokeWidth={1.8} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
                    </svg>
                  </div>

                  {/* Name + job */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', fontWeight: 700, color: '#032655', marginBottom: '2px' }}>
                      {sub.candidate_name}
                    </p>
                    <p style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', color: '#5A7A9F' }}>
                      {job?.title ?? '—'}{job?.department ? ` · ${job.department}` : ''}
                    </p>
                  </div>

                  {/* Status badge */}
                  <span style={{ fontFamily: 'var(--font-ui)', fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '20px', background: s.bg, color: s.color, whiteSpace: 'nowrap', flexShrink: 0 }}>
                    {s.label}
                  </span>

                  {/* Date */}
                  <p style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', color: '#96AFCA', whiteSpace: 'nowrap', flexShrink: 0 }}>
                    {new Date(sub.submitted_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>

                  {/* Chevron */}
                  <svg width="14" height="14" fill="none" stroke="#D0DBE8" strokeWidth={2} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
