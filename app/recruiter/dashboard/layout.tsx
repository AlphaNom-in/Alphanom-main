import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import DashboardShell from '@/components/recruiter/DashboardShell'

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
    .select('id, full_name, years_of_experience')
    .eq('user_id', user.id)
    .single()

  const headersList = await headers()
  const pathname = headersList.get('x-pathname') ?? ''

  const profileIncomplete =
    !recruiter?.years_of_experience &&
    recruiter?.years_of_experience !== 0

  const onCompleteRoute = pathname === '/recruiter/dashboard/profile/complete'

  if (profileIncomplete && !onCompleteRoute) {
    redirect('/recruiter/dashboard/profile/complete')
  }

  // Earnings: sum of budget_max for shortlisted submissions as an estimate
  let earnings = 0
  if (recruiter?.id) {
    const { data: shortlisted } = await supabase
      .from('candidate_submissions')
      .select('job_posts(budget_max)')
      .eq('recruiter_id', recruiter.id)
      .eq('status', 'shortlisted')

    // Estimate: 8.33% of annual CTC (1 month) as placement fee
    earnings = (shortlisted ?? []).reduce((sum: number, s: any) => {
      return sum + Math.round((s.job_posts?.budget_max ?? 0) * 0.0833)
    }, 0)
  }

  return (
    <DashboardShell recruiterName={recruiter?.full_name ?? ''} earnings={earnings}>
      {children}
    </DashboardShell>
  )
}
