import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import LogoutButton from '@/components/employer/LogoutButton'

export default async function RecruiterDashboard() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/recruiter/login')
  }

  const role = user.user_metadata?.role

  if (role !== 'recruiter') {
    redirect('/employer/dashboard')
  }

  return (
   <div className="min-h-screen flex flex-col items-center justify-center p-6">
  <h1 className="text-3xl font-bold mb-4">Recruiter Dashboard</h1>

  <p className="mb-2">Email: {user.email}</p>

  <p className="mb-4">Role: {role}</p>

  <LogoutButton />
</div>
  )
}