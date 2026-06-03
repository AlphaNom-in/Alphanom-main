import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

const STATUS_CONFIG: Record<string, { color: string; bg: string; dot: string }> = {
  active:  { color: '#0A9E97', bg: '#D8F0EB', dot: '#0FB9B1' },
  closed:  { color: '#5A7A9F', bg: '#EEF3F8', dot: '#96AFCA' },
  draft:   { color: '#7A5C00', bg: '#FDF3DC', dot: '#F5A623' },
  paused:  { color: '#7A5C00', bg: '#FDF3DC', dot: '#F5A623' },
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>
}) {
  const { tab } = await searchParams
  const isClosed = tab === 'closed'

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: employer } = await supabase
    .from('employers').select('id').eq('user_id', user?.id).single()

  const { data: allJobs } = employer
    ? await supabase
        .from('job_posts').select('*')
        .eq('employer_id', employer.id)
        .order('created_at', { ascending: false })
    : { data: [] }

  const openJobs   = (allJobs ?? []).filter((j) => j.status !== 'closed')
  const closedJobs = (allJobs ?? []).filter((j) => j.status === 'closed')
  const jobs = isClosed ? closedJobs : openJobs

  // Batch applicant counts
  const jobIds = (allJobs ?? []).map((j) => j.id)
  const { data: submissions } = jobIds.length
    ? await supabase
        .from('candidate_submissions').select('job_post_id').in('job_post_id', jobIds)
    : { data: [] }

  const countMap: Record<string, number> = {}
  for (const s of submissions ?? []) {
    countMap[s.job_post_id] = (countMap[s.job_post_id] ?? 0) + 1
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header — fixed */}
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '6px', background: '#EEF3F8', borderRadius: '10px', padding: '4px' }}>
          <Link
            href="/employer/dashboard/jobs"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '7px',
              padding: '7px 16px', borderRadius: '7px',
              fontFamily: 'var(--font-ui)', fontSize: '0.78rem', fontWeight: 700,
              textDecoration: 'none',
              background: !isClosed ? '#fff' : 'transparent',
              color: !isClosed ? '#032655' : '#96AFCA',
              boxShadow: !isClosed ? '0 1px 4px rgba(3,38,85,0.08)' : 'none',
              transition: 'all 0.15s',
            }}
          >
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: !isClosed ? '#0FB9B1' : '#C0CCDA', flexShrink: 0 }} />
            Open Jobs
            <span style={{
              background: !isClosed ? '#D8F0EB' : '#E2E8F0',
              color: !isClosed ? '#0A9E97' : '#96AFCA',
              borderRadius: '10px', padding: '1px 7px',
              fontSize: '0.65rem', fontWeight: 800,
            }}>
              {openJobs.length}
            </span>
          </Link>

          <Link
            href="/employer/dashboard/jobs?tab=closed"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '7px',
              padding: '7px 16px', borderRadius: '7px',
              fontFamily: 'var(--font-ui)', fontSize: '0.78rem', fontWeight: 700,
              textDecoration: 'none',
              background: isClosed ? '#fff' : 'transparent',
              color: isClosed ? '#032655' : '#96AFCA',
              boxShadow: isClosed ? '0 1px 4px rgba(3,38,85,0.08)' : 'none',
              transition: 'all 0.15s',
            }}
          >
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: isClosed ? '#96AFCA' : '#C0CCDA', flexShrink: 0 }} />
            Closed Jobs
            <span style={{
              background: isClosed ? '#EEF3F8' : '#E2E8F0',
              color: isClosed ? '#5A7A9F' : '#96AFCA',
              borderRadius: '10px', padding: '1px 7px',
              fontSize: '0.65rem', fontWeight: 800,
            }}>
              {closedJobs.length}
            </span>
          </Link>
        </div>

        {/* Post a Job */}
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

      {/* Scrollable content */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
      {!jobs.length ? (
        <div style={{
          background: '#fff', borderRadius: '16px', border: '1px solid #D0DBE8',
          padding: '3rem', textAlign: 'center',
        }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#EEF3F8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
            <svg fill="none" stroke="#96AFCA" strokeWidth={1.5} viewBox="0 0 24 24" style={{ width: '22px', height: '22px' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          </div>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.9rem', fontWeight: 700, color: '#032655', marginBottom: '5px' }}>
            No {isClosed ? 'closed' : 'open'} jobs
          </p>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.8rem', color: '#96AFCA', marginBottom: isClosed ? 0 : '1.25rem' }}>
            {isClosed ? 'Jobs you close will appear here.' : 'Post your first job to start receiving candidates.'}
          </p>
          {!isClosed && (
            <Link href="/employer/dashboard/jobs/post" style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '9px 18px', borderRadius: '8px',
              background: '#0FB9B1', color: '#fff',
              fontFamily: 'var(--font-ui)', fontSize: '0.8rem', fontWeight: 700,
              textDecoration: 'none',
            }}>
              Post your first job
            </Link>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {jobs.map((job) => {
            const s = STATUS_CONFIG[job.status?.toLowerCase?.() ?? ''] ?? STATUS_CONFIG.draft
            return (
              <Link key={job.id} href={`/employer/dashboard/jobs/${job.id}`} style={{
                background: '#fff', borderRadius: '14px', border: '1px solid #D0DBE8',
                padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '14px',
                boxShadow: '0 1px 6px rgba(3,38,85,0.04)', textDecoration: 'none', cursor: 'pointer',
              }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '9px', background: '#EEF3F8', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg fill="none" stroke="#5A7A9F" strokeWidth={1.6} viewBox="0 0 24 24" style={{ width: '16px', height: '16px' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: '0.875rem', color: '#032655', marginBottom: '3px' }}>
                    {job.title}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    {job.department && <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', color: '#5A7A9F' }}>{job.department}</span>}
                    {job.department && job.location && <Dot />}
                    {job.location && <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', color: '#5A7A9F' }}>{job.location}</span>}
                    {job.work_model && <><Dot /><span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', color: '#5A7A9F' }}>{job.work_model}</span></>}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#EEF3F8', borderRadius: '7px', padding: '5px 10px' }}>
                    <svg fill="none" stroke="#5A7A9F" strokeWidth={1.8} viewBox="0 0 24 24" style={{ width: '13px', height: '13px' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                    </svg>
                    <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 700, color: '#5A7A9F' }}>{countMap[job.id] ?? 0}</span>
                  </div>

                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '5px',
                    fontFamily: 'var(--font-ui)', fontSize: '0.56rem', fontWeight: 700,
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                    color: s.color, background: s.bg, border: `1px solid ${s.dot}`,
                    borderRadius: '5px', padding: '4px 9px',
                  }}>
                    <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: s.dot, flexShrink: 0 }} />
                    {job.status ?? 'Draft'}
                  </span>

                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '5px',
                    fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 700,
                    color: '#032655', background: '#fff', border: '1.5px solid #D0DBE8',
                    borderRadius: '7px', padding: '6px 12px',
                  }}>
                    Open
                    <svg fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" style={{ width: '11px', height: '11px' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      )}
      </div>
    </div>
  )
}

function Dot() {
  return <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: '#D0DBE8', flexShrink: 0, display: 'inline-block' }} />
}
