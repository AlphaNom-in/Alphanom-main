import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { closeJob } from '@/lib/employer/closeJob'

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ display: 'inline-block', background: '#EEF3F8', color: '#5A7A9F', fontSize: '13px', padding: '4px 10px', borderRadius: '6px', marginRight: '6px', marginBottom: '6px' }}>
      {children}
    </span>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #D0DBE8', padding: '18px 20px' }}>
      <p style={{ fontFamily: 'var(--font-ui)', fontSize: '10px', fontWeight: 700, color: '#96AFCA', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>
        {title}
      </p>
      {children}
    </div>
  )
}

async function handleClose(jobId: string) {
  'use server'
  await closeJob(jobId)
  redirect('/employer/dashboard/jobs')
}

export default async function Page({ params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/employer/login')

  const { data: employer } = await supabase
    .from('employers').select('id').eq('user_id', user.id).single()

  const { data: job } = await supabase
    .from('job_posts').select('*')
    .eq('id', jobId)
    .eq('employer_id', employer?.id)
    .single()

  if (!job) notFound()

  const { count: applicantCount } = await supabase
    .from('candidate_submissions')
    .select('*', { count: 'exact', head: true })
    .eq('job_post_id', jobId)

  const isClosed = job.status === 'closed'

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '24px' }}>
        <div>
          <Link
            href="/employer/dashboard/jobs"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#96AFCA', textDecoration: 'none', marginBottom: '10px', fontFamily: 'var(--font-ui)' }}
          >
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            All Jobs
          </Link>

          <h1 style={{ fontFamily: 'var(--font-ui)', fontSize: '1.3rem', fontWeight: 800, color: '#032655', marginBottom: '6px', letterSpacing: '-0.02em' }}>
            {job.title}
          </h1>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            {job.department && <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: '#5A7A9F' }}>{job.department}</span>}
            {job.location && <><span style={{ color: '#D0DBE8' }}>·</span><span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: '#5A7A9F' }}>📍 {job.location}</span></>}
            {job.work_model && <><span style={{ color: '#D0DBE8' }}>·</span><span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: '#5A7A9F' }}>{job.work_model}</span></>}
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '4px',
              fontSize: '0.6rem', fontWeight: 700, fontFamily: 'var(--font-ui)',
              letterSpacing: '0.08em', textTransform: 'uppercase',
              padding: '3px 8px', borderRadius: '5px',
              color: isClosed ? '#5A7A9F' : '#0A9E97',
              background: isClosed ? '#EEF3F8' : '#D8F0EB',
            }}>
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: isClosed ? '#96AFCA' : '#0FB9B1', flexShrink: 0 }} />
              {job.status}
            </span>
          </div>
        </div>

        {/* Top-right actions */}
        <div style={{ display: 'flex', gap: '8px', flexShrink: 0, alignItems: 'center' }}>
          <Link
            href={`/employer/dashboard/jobs/${jobId}/applicants`}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '9px 18px', borderRadius: '8px',
              background: '#032655', color: '#fff',
              fontFamily: 'var(--font-ui)', fontSize: '0.78rem', fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
            View Applicants
            {(applicantCount ?? 0) > 0 && (
              <span style={{ background: '#0FB9B1', color: '#fff', borderRadius: '10px', fontSize: '0.6rem', fontWeight: 800, padding: '1px 6px' }}>
                {applicantCount}
              </span>
            )}
          </Link>

          {!isClosed && (
            <form action={handleClose.bind(null, jobId)}>
              <button
                type="submit"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  padding: '9px 18px', borderRadius: '8px',
                  background: '#FFF5F5', color: '#E53E3E',
                  border: '1px solid #FEB2B2',
                  fontFamily: 'var(--font-ui)', fontSize: '0.78rem', fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Close Job
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Quick stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '20px' }}>
        {[
          { label: 'Budget',        value: `₹${((job.budget_min ?? 0) / 100000).toFixed(0)}–${((job.budget_max ?? 0) / 100000).toFixed(0)} LPA` },
          { label: 'Work Model',    value: job.work_model    || '—' },
          { label: 'Notice Period', value: job.notice_period || '—' },
          { label: 'Applicants',    value: String(applicantCount ?? 0) },
        ].map((s) => (
          <div key={s.label} style={{ background: '#fff', borderRadius: '10px', border: '1px solid #D0DBE8', padding: '12px 16px' }}>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '10px', fontWeight: 700, color: '#96AFCA', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>{s.label}</p>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', fontWeight: 700, color: '#032655', margin: 0 }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Detail sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {job.mandatory_criteria?.length > 0 && (
          <Section title="Mandatory Criteria">
            <div>{job.mandatory_criteria.map((item: string, i: number) => <Tag key={i}>{item}</Tag>)}</div>
          </Section>
        )}

        {job.preferred_criteria?.length > 0 && (
          <Section title="Preferred Criteria">
            <div>{job.preferred_criteria.map((item: string, i: number) => <Tag key={i}>{item}</Tag>)}</div>
          </Section>
        )}

        {job.preferred_companies?.length > 0 && (
          <Section title="Preferred Companies">
            <div>{job.preferred_companies.map((item: string, i: number) => <Tag key={i}>{item}</Tag>)}</div>
          </Section>
        )}

        {job.recruiter_note && (
          <Section title="Job Description">
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', color: '#5A7A9F', lineHeight: 1.7, margin: 0 }}>{job.recruiter_note}</p>
          </Section>
        )}

        {job.jd_pdf_url && (
          <a
            href={job.jd_pdf_url} target="_blank" rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 16px', borderRadius: '8px', border: '1.5px solid #D0DBE8', background: '#fff', color: '#032655', textDecoration: 'none', fontWeight: 600, fontSize: '13px', width: 'fit-content', fontFamily: 'var(--font-ui)' }}
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            Download JD (PDF)
          </a>
        )}
      </div>
    </div>
  )
}
