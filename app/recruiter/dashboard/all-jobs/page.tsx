import { createAdminClient } from '@/lib/supabase/admin'
import JobsView from './JobsView'

export const dynamic = 'force-dynamic'

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>
}) {
  const params = await searchParams
  const admin  = createAdminClient()

  let query = admin
    .from('job_posts')
    .select('*, employers(company_name, logo_url, industry, company_address, is_verified, company_overview, company_website, company_size, founded_year)')
    .eq('status', 'active')

  if (params.search)
    query = query.or(`title.ilike.%${params.search}%,department.ilike.%${params.search}%`)
  if (params.location)   query = query.eq('location', params.location)
  if (params.work_model) query = query.eq('work_model', params.work_model)
  if (params.department) query = query.eq('department', params.department)

  if (params.salary_range) {
    switch (params.salary_range) {
      case 'lt20':  query = query.lt('budget_max', 2000000); break
      case '20_30': query = query.gte('budget_max', 2000000).lte('budget_max', 3000000); break
      case '30_40': query = query.gte('budget_max', 3000000).lte('budget_max', 4000000); break
      case 'gt40':  query = query.gte('budget_max', 4000000); break
    }
  }

  if (params.date_posted) {
    const ms: Record<string, number> = { '24h': 864e5, '1w': 6048e5, '1m': 2592e6 }
    if (ms[params.date_posted]) {
      const since = new Date(Date.now() - ms[params.date_posted]).toISOString()
      query = query.gte('created_at', since)
    }
  }

  const { data: jobs } = await query.order('created_at', { ascending: false })

  // Fetch total submission counts for all fetched jobs (across all recruiters)
  const jobIds = (jobs ?? []).map((j: any) => j.id)
  const submissionCounts: Record<string, number> = {}
  if (jobIds.length > 0) {
    const { data: subData } = await admin
      .from('candidate_submissions')
      .select('job_post_id')
      .in('job_post_id', jobIds)
    subData?.forEach((s: any) => {
      submissionCounts[s.job_post_id] = (submissionCounts[s.job_post_id] ?? 0) + 1
    })
  }

  return (
    <div style={{ height: '100%', background: '#fff', borderRadius: '16px', border: '1px solid #D0DBE8', overflow: 'hidden', boxShadow: '0 2px 12px rgba(3,38,85,0.04)' }}>
      <JobsView jobs={jobs ?? []} submissionCounts={submissionCounts} />
    </div>
  )
}
