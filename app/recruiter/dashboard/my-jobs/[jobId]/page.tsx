import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import { notFound } from 'next/navigation'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #D0DBE8', padding: '18px 20px' }}>
      <p style={{ fontSize: '11px', fontWeight: 700, color: '#96AFCA', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>
        {title}
      </p>
      {children}
    </div>
  )
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ display: 'inline-block', background: '#EEF3F8', color: '#5A7A9F', fontSize: '13px', padding: '4px 10px', borderRadius: '6px', marginRight: '6px', marginBottom: '6px' }}>
      {children}
    </span>
  )
}

export default async function Page({ params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = await params
  const admin = createAdminClient()

  const { data: job, error } = await admin
    .from('job_posts').select('*').eq('id', jobId).single()

  if (error || !job) notFound()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* Fixed header */}
      <div style={{ flexShrink: 0, marginBottom: '16px' }}>
        <Link
          href="/recruiter/dashboard/my-jobs"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#5A7A9F', textDecoration: 'none', marginBottom: '12px' }}
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Saved Jobs
        </Link>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#032655', marginBottom: '4px' }}>{job.title}</h1>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', fontSize: '13px', color: '#5A7A9F' }}>
              {job.department && <span>{job.department}</span>}
              {job.department && job.location && <span>·</span>}
              {job.location && <span>📍 {job.location}</span>}
              {job.work_model && <span>· {job.work_model}</span>}
            </div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <p style={{ fontSize: '18px', fontWeight: 800, color: '#0FB9B1', margin: 0 }}>
              {job.budget_min ? (job.budget_min / 100000).toFixed(0) : '?'} – {job.budget_max ? (job.budget_max / 100000).toFixed(0) : '?'} LPA
            </p>
            <p style={{ fontSize: '11px', color: '#96AFCA', marginTop: '2px' }}>Annual CTC</p>
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '4px' }}>

        {/* Quick stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          {[
            { label: 'Work Model',    value: job.work_model     || '—' },
            { label: 'Notice Period', value: job.notice_period  || '—' },
            { label: 'Budget',        value: job.budget_max ? `₹${Math.round(job.budget_max / 12 / 1000)}K/mo` : '—' },
          ].map((s) => (
            <div key={s.label} style={{ background: '#fff', borderRadius: '10px', border: '1px solid #D0DBE8', padding: '12px 16px' }}>
              <p style={{ fontSize: '10px', fontWeight: 700, color: '#96AFCA', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>{s.label}</p>
              <p style={{ fontSize: '14px', fontWeight: 700, color: '#032655', margin: 0 }}>{s.value}</p>
            </div>
          ))}
        </div>

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
            <p style={{ fontSize: '14px', color: '#5A7A9F', lineHeight: 1.7, margin: 0 }}>{job.recruiter_note}</p>
          </Section>
        )}

        {job.jd_pdf_url && (
          <a
            href={job.jd_pdf_url} target="_blank" rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 16px', borderRadius: '8px', border: '1.5px solid #D0DBE8', background: '#fff', color: '#032655', textDecoration: 'none', fontWeight: 600, fontSize: '13px', width: 'fit-content' }}
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            Download JD (PDF)
          </a>
        )}
      </div>

      {/* Fixed CTA */}
      <div style={{ flexShrink: 0, paddingTop: '14px', borderTop: '1px solid #D0DBE8', marginTop: '4px' }}>
        <Link
          href={`/recruiter/dashboard/my-jobs/${job.id}/submit`}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '11px 24px', borderRadius: '10px', background: '#0FB9B1', color: '#fff', fontWeight: 700, fontSize: '14px', textDecoration: 'none' }}
        >
          Submit Candidate
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </div>
  )
}
