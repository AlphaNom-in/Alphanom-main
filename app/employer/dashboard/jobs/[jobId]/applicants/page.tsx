import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import StatusSelect from './StatusSelect'

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  in_pipeline:     { bg: '#EEF3F8', color: '#5A7A9F', label: 'In Pipeline' },
  shortlisted:     { bg: '#D8F0EB', color: '#0A9E97', label: 'Shortlisted' },
  saved_for_later: { bg: '#FFF8E7', color: '#B7791F', label: 'Saved for Later' },
  hired:           { bg: '#C6F6D5', color: '#276749', label: 'Hired ✓' },
  rejected:        { bg: '#FFF5F5', color: '#E53E3E', label: 'Rejected' },
}

export default async function Page({ params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/employer/login')

  const { data: employer } = await supabase
    .from('employers').select('id').eq('user_id', user.id).single()

  const { data: job } = await supabase
    .from('job_posts').select('id, title, department, location')
    .eq('id', jobId)
    .eq('employer_id', employer?.id)
    .single()

  if (!job) notFound()

  const { data: applicants } = await supabase
    .from('candidate_submissions')
    .select('id, candidate_name, email, contact_primary, contact_secondary, linkedin_url, current_ctc, current_location, total_experience, notice_period, resume_url, recruiter_note, status, submitted_at')
    .eq('job_post_id', jobId)
    .order('submitted_at', { ascending: false })

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '24px' }}>
        <div>
          <Link
            href={`/employer/dashboard/jobs/${jobId}`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#96AFCA', textDecoration: 'none', marginBottom: '10px', fontFamily: 'var(--font-ui)' }}
          >
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            {job.title}
          </Link>
          <h1 style={{ fontFamily: 'var(--font-ui)', fontSize: '1.3rem', fontWeight: 800, color: '#032655', marginBottom: '4px', letterSpacing: '-0.02em' }}>
            Applicants
          </h1>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: '#5A7A9F' }}>
            {applicants?.length ?? 0} candidate{(applicants?.length ?? 0) !== 1 ? 's' : ''} submitted for {job.title}
          </p>
        </div>
      </div>

      {/* Empty state */}
      {!applicants?.length ? (
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #D0DBE8', padding: '60px 24px', textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#EEF3F8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <svg width="22" height="22" fill="none" stroke="#96AFCA" strokeWidth={1.6} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
          </div>
          <p style={{ fontFamily: 'var(--font-ui)', color: '#5A7A9F', fontSize: '14px', fontWeight: 600 }}>No applicants yet</p>
          <p style={{ fontFamily: 'var(--font-ui)', color: '#96AFCA', fontSize: '13px', marginTop: '4px' }}>Recruiters haven't submitted candidates for this role yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {applicants.map((a) => {
            return (
              <div key={a.id} style={{ background: '#fff', borderRadius: '14px', border: '1px solid #D0DBE8', padding: '20px 24px' }}>
                {/* Top row */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '14px' }}>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-ui)', fontSize: '15px', fontWeight: 700, color: '#032655', marginBottom: '4px' }}>
                      {a.candidate_name}
                    </h3>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', fontSize: '13px', color: '#5A7A9F' }}>
                      {a.email && <a href={`mailto:${a.email}`} style={{ color: '#0FB9B1', textDecoration: 'none', fontFamily: 'var(--font-ui)' }}>{a.email}</a>}
                      {a.contact_primary && <span style={{ fontFamily: 'var(--font-ui)' }}>{a.contact_primary}</span>}
                      {a.linkedin_url && (
                        <a href={a.linkedin_url} target="_blank" rel="noopener noreferrer" style={{ color: '#0284C7', textDecoration: 'none', fontFamily: 'var(--font-ui)' }}>
                          LinkedIn ↗
                        </a>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                    <StatusSelect
                      submissionId={a.id}
                      jobId={jobId}
                      currentStatus={a.status}
                    />
                  </div>
                </div>

                {/* Detail chips */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                  {a.current_location && <Chip label="Location" value={a.current_location} />}
                  {a.total_experience != null && <Chip label="Experience" value={`${a.total_experience} yrs`} />}
                  {a.current_ctc != null && <Chip label="Current CTC" value={`₹${(a.current_ctc / 100000).toFixed(1)}L`} />}
                  {a.notice_period && <Chip label="Notice" value={a.notice_period} />}
                </div>

                {/* Recruiter note */}
                {a.recruiter_note && (
                  <div style={{ background: '#F5F8FC', borderRadius: '8px', padding: '10px 14px', marginBottom: '12px' }}>
                    <p style={{ fontFamily: 'var(--font-ui)', fontSize: '11px', fontWeight: 700, color: '#96AFCA', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Job Description</p>
                    <p style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: '#5A7A9F', lineHeight: 1.6, margin: 0 }}>{a.recruiter_note}</p>
                  </div>
                )}

                {/* Bottom row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                  <p style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', color: '#96AFCA' }}>
                    Submitted {new Date(a.submitted_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {a.resume_url && (
                      <a
                        href={a.resume_url} target="_blank" rel="noopener noreferrer"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '7px 14px', borderRadius: '7px', border: '1px solid #D0DBE8', background: '#fff', color: '#032655', textDecoration: 'none', fontSize: '12px', fontWeight: 600, fontFamily: 'var(--font-ui)' }}
                      >
                        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                        Resume
                      </a>
                    )}
                    {a.contact_secondary && (
                      <a href={`tel:${a.contact_secondary}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '7px 14px', borderRadius: '7px', background: '#032655', color: '#fff', textDecoration: 'none', fontSize: '12px', fontWeight: 600, fontFamily: 'var(--font-ui)' }}>
                        {a.contact_secondary}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function Chip({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: '#F5F8FC', border: '1px solid #EEF3F8', borderRadius: '6px', padding: '4px 10px' }}>
      <span style={{ fontFamily: 'var(--font-ui)', fontSize: '10px', fontWeight: 700, color: '#96AFCA', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}: </span>
      <span style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', fontWeight: 600, color: '#032655' }}>{value}</span>
    </div>
  )
}
