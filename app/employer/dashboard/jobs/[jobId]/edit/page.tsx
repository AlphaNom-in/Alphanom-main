import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import EditJobForm from './EditJobForm'

export default async function Page({ params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/employer/login')

  const { data: employer } = await supabase
    .from('employers').select('id').eq('user_id', user.id).single()

  const { data: job } = await supabase
    .from('job_posts')
    .select('id, title, department, location, work_model, budget_min, budget_max, notice_period, recruiter_note, mandatory_criteria, preferred_criteria, preferred_companies, status')
    .eq('id', jobId)
    .eq('employer_id', employer?.id)
    .single()

  if (!job) notFound()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* Header */}
      <div style={{ flexShrink: 0, marginBottom: '20px' }}>
        <Link
          href={`/employer/dashboard/jobs/${jobId}`}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 600, color: '#96AFCA', textDecoration: 'none', marginBottom: '10px' }}
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Job
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-ui)', fontSize: '1.25rem', fontWeight: 800, color: '#032655', letterSpacing: '-0.02em', margin: '0 0 2px' }}>
              Edit Job
            </h1>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: '#5A7A9F', margin: 0 }}>
              {job.title}
            </p>
          </div>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontFamily: 'var(--font-ui)', fontSize: '0.58rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: job.status === 'active' ? '#0A9E97' : '#5A7A9F', background: job.status === 'active' ? '#D8F0EB' : '#EEF3F8', border: `1px solid ${job.status === 'active' ? 'rgba(15,185,177,0.3)' : '#D0DBE8'}`, borderRadius: '6px', padding: '4px 10px', marginTop: '2px' }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: job.status === 'active' ? '#0FB9B1' : '#96AFCA' }} />
            {job.status}
          </span>
        </div>
      </div>

      {/* Scrollable form */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
        <EditJobForm job={job as any} />
      </div>
    </div>
  )
}
