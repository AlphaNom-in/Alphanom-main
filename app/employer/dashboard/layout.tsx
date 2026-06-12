import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DashboardShell from '@/components/employer/DashboardShell'

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

  if (!user) {
    redirect('/employer/login')
  }

  // Recruiter account (or no role) trying to access employer dashboard
  if (user.user_metadata?.role === 'recruiter') {
    redirect('/employer/login?error=wrong_role')
  }

  const [employerResult, notifResult] = await Promise.all([
    supabase
      .from('employers')
      .select('company_name, industry, company_address, logo_url')
      .eq('user_id', user.id)
      .single(),
    supabase
      .from('notifications')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_read', false),
  ])

  const employer = employerResult.data

  // Auth user exists but no employer profile — incomplete signup
  if (!employer) {
    redirect('/employer/login?error=no_profile')
  }

  const isProfileComplete = !!(
    employer?.company_address?.trim() &&
    employer?.industry?.trim()
  )

  return (
    <DashboardShell
      companyName={employer?.company_name ?? ''}
      logoUrl={employer?.logo_url ?? null}
      isProfileComplete={isProfileComplete}
      initialUnreadCount={notifResult.count ?? 0}
    >
      {children}
    </DashboardShell>
  )
}
