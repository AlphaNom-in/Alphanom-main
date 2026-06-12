import { createClient } from '@/lib/supabase/server'
import JobsView from './JobsView'

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

  const jobIds = (allJobs ?? []).map((j) => j.id)
  const { data: submissions } = jobIds.length
    ? await supabase
        .from('candidate_submissions').select('job_post_id').in('job_post_id', jobIds)
        .or('consent_status.eq.consented,consent_status.is.null')
    : { data: [] }

  const countMap: Record<string, number> = {}
  for (const s of submissions ?? []) {
    countMap[s.job_post_id] = (countMap[s.job_post_id] ?? 0) + 1
  }

  return (
    <JobsView
      jobs={jobs}
      countMap={countMap}
      openCount={openJobs.length}
      closedCount={closedJobs.length}
      isClosed={isClosed}
    />
  )
}
