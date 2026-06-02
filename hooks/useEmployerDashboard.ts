import { createClient } from '@/lib/supabase/client'

export async function getEmployerDashboardData() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: employer } = await supabase
    .from('employers')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!employer) return null

  const { count: activeJobs } =
    await supabase
      .from('job_posts')
      .select('*', {
        count: 'exact',
        head: true,
      })
      .eq('employer_id', employer.id)
      .eq('status', 'active')

  const { data: jobs } =
    await supabase
      .from('job_posts')
      .select('id')
      .eq('employer_id', employer.id)

  const jobIds =
    jobs?.map((j) => j.id) || []

  let candidates = 0
  let shortlisted = 0

  if (jobIds.length > 0) {
    const { count } =
      await supabase
        .from('candidate_submissions')
        .select('*', {
          count: 'exact',
          head: true,
        })
        .in('job_post_id', jobIds)

    candidates = count || 0

    const { count: shortlistedCount } =
      await supabase
        .from('candidate_submissions')
        .select('*', {
          count: 'exact',
          head: true,
        })
        .in('job_post_id', jobIds)
        .eq('status', 'shortlisted')

    shortlisted = shortlistedCount || 0
  }

  const { count: closedRoles } =
    await supabase
      .from('job_posts')
      .select('*', {
        count: 'exact',
        head: true,
      })
      .eq('employer_id', employer.id)
      .eq('status', 'closed')

  return {
    activeJobs: activeJobs || 0,
    candidates,
    shortlisted,
    closedRoles: closedRoles || 0,
  }
}