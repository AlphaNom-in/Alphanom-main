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

  if (user.user_metadata.role !== 'employer') {
    redirect('/')
  }

  const [employerResult, notifResult] = await Promise.all([
    supabase
      .from('employers')
      .select('company_name, industry, company_address')
      .eq('user_id', user.id)
      .single(),
    supabase
      .from('notifications')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_read', false),
  ])

  const employer = employerResult.data

  const isProfileComplete = !!(
    employer?.company_address?.trim() &&
    employer?.industry?.trim()
  )

  return (
    <DashboardShell
      companyName={employer?.company_name ?? ''}
      isProfileComplete={isProfileComplete}
      initialUnreadCount={notifResult.count ?? 0}
    >
      {children}
    </DashboardShell>
  )
}
