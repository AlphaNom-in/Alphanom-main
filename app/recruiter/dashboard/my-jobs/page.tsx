import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import MySavedJobsView from './MySavedJobsView'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: recruiter } = await supabase
    .from('recruiters').select('id').eq('user_id', user!.id).single()

  if (!recruiter) return <div>Recruiter profile not found</div>

  const admin = createAdminClient()
  const { data: savedJobs } = await admin
    .from('recruiter_saved_jobs')
    .select(`
      id, saved_at,
      job_posts (
        id, title, department, location, work_model,
        budget_min, budget_max, notice_period, status,
        created_at, recruiter_note, jd_pdf_url,
        mandatory_criteria, preferred_criteria, preferred_companies,
        employers (company_name, logo_url, industry, company_address, is_verified)
      )
    `)
    .eq('recruiter_id', recruiter.id)
    .order('saved_at', { ascending: false })

  return (
    <div style={{ height: '100%', background: '#fff', borderRadius: '16px', border: '1px solid #D0DBE8', overflow: 'hidden', boxShadow: '0 2px 12px rgba(3,38,85,0.04)' }}>
      <MySavedJobsView savedJobs={savedJobs ?? []} />
    </div>
  )
}
