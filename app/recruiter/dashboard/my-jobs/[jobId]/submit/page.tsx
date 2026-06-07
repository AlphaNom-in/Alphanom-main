import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import SubmitCandidateForm from '@/components/recruiter/SubmitCandidateForm'

export default async function Page({ params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = await params
  const supabase = await createClient()

  const { data: job, error } = await supabase
    .from('job_posts')
    .select('id, title, employers(company_name)')
    .eq('id', jobId)
    .eq('status', 'active')
    .single()

  if (error || !job) notFound()

  const companyName = (job.employers as any)?.company_name ?? ''

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* Header */}
      <div style={{ flexShrink: 0, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Link
          href={`/recruiter/dashboard/my-jobs/${jobId}`}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#96AFCA', textDecoration: 'none', flexShrink: 0 }}
        >
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Link>
        {companyName && (
          <>
            <span style={{ color: '#D0DBE8', fontSize: '12px' }}>·</span>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#5A7A9F' }}>{companyName}</span>
          </>
        )}
      </div>

      {/* Scrollable form */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <SubmitCandidateForm jobId={job.id} jobTitle={job.title} />
        </div>
      </div>
    </div>
  )
}
