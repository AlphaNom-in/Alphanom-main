import { createAdminClient } from '@/lib/supabase/admin'
import JobListingCard from '@/components/recruiter/JobListingCard'
import JobFilters from '@/components/recruiter/JobFilters'

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>
}) {
  const params = await searchParams
  const admin = createAdminClient()


  let query = admin
    .from('job_posts')
    .select('*, employers(company_name)')
    .eq('status', 'active')

  if (params.search)     query = query.or(`title.ilike.%${params.search}%,department.ilike.%${params.search}%`)
  if (params.location)   query = query.eq('location', params.location)
  if (params.work_model) query = query.eq('work_model', params.work_model)
  if (params.department) query = query.eq('department', params.department)

  if (params.salary_range) {
    switch (params.salary_range) {
      case 'lt20':   query = query.lt('budget_max', 2000000); break
      case '20_30':  query = query.gte('budget_max', 2000000).lte('budget_max', 3000000); break
      case '30_40':  query = query.gte('budget_max', 3000000).lte('budget_max', 4000000); break
      case 'gt40':   query = query.gte('budget_max', 4000000); break
    }
  }

  const { data: jobs } = await query.order('created_at', { ascending: false })

  const hasFilters = Object.keys(params).some(
    (k) => ['search', 'location', 'work_model', 'department', 'salary_range'].includes(k) && params[k]
  )

  return (
    <div className="rdash-page-root" style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '14px' }}>

      {/* Page header — fixed */}
      <div style={{ flexShrink: 0 }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#032655', marginBottom: '2px' }}>All Jobs</h1>
        <p style={{ color: '#5A7A9F', fontSize: '13px' }}>{jobs?.length ?? 0} active roles available</p>
      </div>

      {/* Two-column area — takes all remaining height */}
      <div className="rdash-two-col" style={{ flex: 1, minHeight: 0, display: 'flex', gap: '18px' }}>

        {/* Sidebar filters */}
        <aside className="rdash-two-col-sidebar" style={{ width: '248px', flexShrink: 0, overflowY: 'auto', height: '100%' }}>
          <JobFilters />
        </aside>

        {/* Job list */}
        <div className="rdash-two-col-main rdash-scrollable" style={{ flex: 1, overflowY: 'auto', minWidth: 0, height: '100%' }}>
          {jobs?.length === 0 ? (
            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #D0DBE8', padding: '60px 24px', textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <p style={{ color: '#5A7A9F', fontSize: '15px', fontWeight: 600, marginBottom: '4px' }}>No jobs match your filters</p>
              <p style={{ color: '#96AFCA', fontSize: '13px' }}>
                {hasFilters ? 'Try adjusting or clearing your filters.' : 'No active jobs at the moment.'}
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingBottom: '4px' }}>
              {jobs?.map((job: any) => (
                <JobListingCard
                  key={job.id}
                  id={job.id}
                  title={job.title}
                  company={job.employers?.company_name ?? null}
                  department={job.department}
                  location={job.location}
                  work_model={job.work_model}
                  budget_min={job.budget_min}
                  budget_max={job.budget_max}
                  notice_period={job.notice_period}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
