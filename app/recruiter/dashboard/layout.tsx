import { redirect } from 'next/navigation'
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

  if (!user) {
    redirect('/recruiter/login')
  }

  const role = user.user_metadata.role

  if (role !== 'recruiter') {
    redirect('/')
  }

  return (
    <DashboardShell>
      {children}
    </DashboardShell>
  )
}