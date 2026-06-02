import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

const STATUS_CONFIG: Record<string, { color: string; bg: string; dot: string }> = {
  active:  { color: '#0A9E97', bg: '#D8F0EB', dot: '#0FB9B1' },
  closed:  { color: '#5A7A9F', bg: '#EEF3F8', dot: '#96AFCA' },
  draft:   { color: '#7A5C00', bg: '#FDF3DC', dot: '#F5A623' },
  paused:  { color: '#7A5C00', bg: '#FDF3DC', dot: '#F5A623' },
}

export default async function Page() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: employer } = await supabase
    .from('employers')
    .select('id')
    .eq('user_id', user?.id)
    .single()

  const { data: jobs } = employer
    ? await supabase
        .from('job_posts')
        .select('*')
        .eq('employer_id', employer.id)
        .order('created_at', { ascending: false })
    : { data: [] }

  return (
    <div>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <p style={{
          fontFamily: 'var(--font-ui)', fontSize: '0.5rem', fontWeight: 700,
          letterSpacing: '0.15em', textTransform: 'uppercase', color: '#96AFCA',
        }}>
          {jobs?.length ?? 0} {jobs?.length === 1 ? 'role' : 'roles'} posted
        </p>

        <Link href="/employer/dashboard/jobs/post" style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          padding: '8px 16px', borderRadius: '8px',
          background: '#032655', color: '#fff',
          fontFamily: 'var(--font-ui)', fontSize: '0.78rem', fontWeight: 700,
          textDecoration: 'none',
        }}>
          <svg fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24" style={{ width: '12px', height: '12px' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Post a Job
        </Link>
      </div>

      {!jobs?.length ? (
        /* Empty state */
        <div style={{
          background: '#fff', borderRadius: '16px', border: '1px solid #D0DBE8',
          padding: '3rem', textAlign: 'center',
          boxShadow: '0 2px 12px rgba(3,38,85,0.05)',
        }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '12px', background: '#EEF3F8',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 14px',
          }}>
            <svg fill="none" stroke="#96AFCA" strokeWidth={1.5} viewBox="0 0 24 24" style={{ width: '22px', height: '22px' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          </div>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.9rem', fontWeight: 700, color: '#032655', marginBottom: '5px' }}>
            No jobs yet
          </p>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.8rem', color: '#96AFCA', marginBottom: '1.25rem' }}>
            Post your first job to start receiving candidates.
          </p>
          <Link href="/employer/dashboard/jobs/post" style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '9px 18px', borderRadius: '8px',
            background: '#0FB9B1', color: '#fff',
            fontFamily: 'var(--font-ui)', fontSize: '0.8rem', fontWeight: 700,
            textDecoration: 'none',
          }}>
            Post your first job
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {jobs.map((job) => {
            const s = STATUS_CONFIG[job.status?.toLowerCase?.() ?? ''] ?? STATUS_CONFIG.draft

            return (
              <div key={job.id} style={{
                background: '#fff',
                borderRadius: '14px',
                border: '1px solid #D0DBE8',
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                boxShadow: '0 1px 6px rgba(3,38,85,0.04)',
              }}>

                {/* Icon box */}
                <div style={{
                  width: '38px', height: '38px', borderRadius: '9px',
                  background: '#EEF3F8', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg fill="none" stroke="#5A7A9F" strokeWidth={1.6} viewBox="0 0 24 24" style={{ width: '16px', height: '16px' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </div>

                {/* Job info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: '0.875rem',
                    color: '#032655', marginBottom: '3px',
                  }}>
                    {job.title}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    {job.department && (
                      <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', color: '#5A7A9F' }}>
                        {job.department}
                      </span>
                    )}
                    {job.department && job.location && <Dot />}
                    {job.location && (
                      <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', color: '#5A7A9F' }}>
                        {job.location}
                      </span>
                    )}
                    {job.work_model && (
                      <>
                        <Dot />
                        <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', color: '#5A7A9F' }}>
                          {job.work_model}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Status badge */}
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '5px',
                  fontFamily: 'var(--font-ui)', fontSize: '0.56rem', fontWeight: 700,
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  color: s.color, background: s.bg,
                  border: `1px solid ${s.dot}`,
                  borderRadius: '5px', padding: '4px 9px', flexShrink: 0,
                }}>
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: s.dot, flexShrink: 0 }} />
                  {job.status ?? 'Draft'}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function Dot() {
  return (
    <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: '#D0DBE8', flexShrink: 0, display: 'inline-block' }} />
  )
}
