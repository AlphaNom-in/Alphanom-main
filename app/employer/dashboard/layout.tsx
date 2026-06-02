import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DashboardShell from '@/components/employer/DashboardShell'

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

  const { data: employer } = await supabase
    .from('employers')
    .select('company_name, industry, company_address')
    .eq('user_id', user.id)
    .single()

  const isProfileComplete = !!(
    employer?.company_address?.trim() &&
    employer?.industry?.trim()
  )

  return (
    <DashboardShell
      companyName={employer?.company_name ?? ''}
      isProfileComplete={isProfileComplete}
    >
      {children}
    </DashboardShell>
  )
}
