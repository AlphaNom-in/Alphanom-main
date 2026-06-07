import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import DashboardShell from '@/components/recruiter/DashboardShell'

export const dynamic = 'force-dynamic'

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/recruiter/login')

  if (user.user_metadata.role !== 'recruiter') redirect('/')

  const { data: recruiter } = await supabase
    .from('recruiters')
    .select('id, full_name, years_of_experience, linkedin_url')
    .eq('user_id', user.id)
    .single()

  const headersList = await headers()
  const pathname = headersList.get('x-pathname') ?? ''

  const profileIncomplete =
    (!recruiter?.years_of_experience && recruiter?.years_of_experience !== 0) ||
    !recruiter?.linkedin_url

  const onCompleteRoute = pathname === '/recruiter/dashboard/profile/complete'

  if (profileIncomplete && !onCompleteRoute) {
    redirect('/recruiter/dashboard/profile/complete')
  }

  // Earnings + unread notification count — run in parallel
  const [earningsResult, notifResult] = await Promise.all([
    recruiter?.id
      ? supabase
          .from('candidate_submissions')
          .select('job_posts(budget_max)')
          .eq('recruiter_id', recruiter.id)
          .eq('status', 'shortlisted')
      : Promise.resolve({ data: [] }),
    supabase
      .from('notifications')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_read', false),
  ])

  // Estimate: 8.33% of annual CTC (1 month) as placement fee
  const earnings = (earningsResult.data ?? []).reduce((sum: number, s: any) => {
    return sum + Math.round((s.job_posts?.budget_max ?? 0) * 0.0833)
  }, 0)

  const unreadCount = notifResult.count ?? 0

  return (
    <DashboardShell
      recruiterName={recruiter?.full_name ?? ''}
      earnings={earnings}
      initialUnreadCount={unreadCount}
    >
      {children}
    </DashboardShell>
  )
}
