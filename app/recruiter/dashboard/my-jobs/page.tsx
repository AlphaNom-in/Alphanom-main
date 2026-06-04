import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

function toLPA(val: number | null) {
  if (!val) return null
  const lpa = val / 100000
  return Number.isInteger(lpa) ? `${lpa}` : lpa.toFixed(1)
}

export default async function Page() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: recruiter } = await supabase
    .from('recruiters').select('id').eq('user_id', user!.id).single()

  if (!recruiter) return <div>Recruiter profile not found</div>

  // Admin client bypasses RLS so closed/paused jobs the recruiter saved
  // still appear with their real status instead of silently vanishing.
  const admin = createAdminClient()
  const { data: savedJobs } = await admin
    .from('recruiter_saved_jobs')
    .select(`id, saved_at, job_posts(id, title, department, location, work_model, budget_min, budget_max, status)`)
    .eq('recruiter_id', recruiter.id)
    .order('saved_at', { ascending: false })

  return (
    <div className="rdash-page-root" style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '16px' }}>

      {/* Header — fixed */}
      <div style={{ flexShrink: 0 }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#032655', marginBottom: '2px' }}>Saved Jobs</h1>
        <p style={{ color: '#5A7A9F', fontSize: '13px' }}>{savedJobs?.length ?? 0} / 10 slots used</p>
      </div>

      {/* List — scrolls */}
      <div className="rdash-scrollable" style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
        {!savedJobs?.length ? (
          <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #D0DBE8', padding: '60px 24px', textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#EEF3F8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <svg width="22" height="22" fill="none" stroke="#96AFCA" strokeWidth={1.6} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
              </svg>
            </div>
            <p style={{ color: '#5A7A9F', fontSize: '15px', fontWeight: 600, marginBottom: '6px' }}>No saved jobs yet</p>
            <p style={{ color: '#96AFCA', fontSize: '13px', marginBottom: '20px' }}>Browse all jobs and save the ones you want to work on.</p>
            <Link href="/recruiter/dashboard/all-jobs" style={{ padding: '10px 22px', borderRadius: '10px', background: '#032655', color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>
              Browse All Jobs
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '4px' }}>
            {savedJobs.map((saved: any) => {
              const job = saved.job_posts
              if (!job) return null
              return (
                <div key={saved.id} style={{ background: '#fff', borderRadius: '14px', border: '1px solid #D0DBE8', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                      <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#032655', margin: 0 }}>{job.title}</h3>
                      {job.status !== 'active' && (
                        <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '20px', background: '#FFF5F5', color: '#E53E3E', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{job.status}</span>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', fontSize: '12px', color: '#5A7A9F', marginBottom: '6px' }}>
                      {job.department && <span>{job.department}</span>}
                      {job.department && job.location && <span>·</span>}
                      {job.location && <span>{job.location}</span>}
                      {(job.department || job.location) && job.work_model && <span>·</span>}
                      {job.work_model && <span>{job.work_model}</span>}
                    </div>
                    <p style={{ fontSize: '13px', fontWeight: 700, color: '#0FB9B1', margin: 0 }}>
                      {toLPA(job.budget_min)} – {toLPA(job.budget_max)} LPA
                    </p>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                    <p style={{ fontSize: '11px', color: '#96AFCA' }}>
                      Saved {new Date(saved.saved_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </p>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Link href={`/recruiter/dashboard/my-jobs/${job.id}`} style={{ padding: '7px 14px', borderRadius: '8px', textDecoration: 'none', background: '#0FB9B1', color: '#fff', fontWeight: 600, fontSize: '12px' }}>View</Link>
                      <Link href={`/recruiter/dashboard/my-jobs/${job.id}/submit`} style={{ padding: '7px 14px', borderRadius: '8px', textDecoration: 'none', background: '#032655', color: '#fff', fontWeight: 600, fontSize: '12px' }}>Submit</Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
