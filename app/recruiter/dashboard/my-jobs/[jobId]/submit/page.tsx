import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import SubmitCandidateForm from '@/components/recruiter/SubmitCandidateForm'

export default async function Page({ params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = await params
  const supabase = await createClient()

  const { data: job, error } = await supabase
    .from('job_posts')
    .select('id, title, department, location, work_model')
    .eq('id', jobId)
    .eq('status', 'active')
    .single()

  if (error || !job) notFound()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* Fixed header */}
      <div style={{ flexShrink: 0, marginBottom: '16px' }}>
        <Link
          href={`/recruiter/dashboard/my-jobs/${jobId}`}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#5A7A9F', textDecoration: 'none', marginBottom: '10px' }}
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Job
        </Link>

        <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#032655', marginBottom: '4px' }}>Submit Candidate</h1>

        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {[job.title, job.department, job.location, job.work_model].filter(Boolean).map((v, i) => (
            <span key={i} style={{ fontSize: '12px', color: '#5A7A9F', background: '#EEF3F8', padding: '3px 10px', borderRadius: '6px' }}>{v}</span>
          ))}
        </div>
      </div>

      {/* Scrollable form */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
        <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #D0DBE8', padding: '24px', maxWidth: '640px' }}>
          <SubmitCandidateForm jobId={job.id} jobTitle={job.title} />
        </div>
      </div>
    </div>
  )
}
