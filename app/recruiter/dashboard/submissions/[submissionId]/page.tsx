import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

const STATUS_STYLE: Record<string, { bg: string; color: string; label: string; dot: string }> = {
  in_pipeline:     { bg: '#EEF3F8', color: '#5A7A9F', label: 'In Pipeline',     dot: '#96AFCA' },
  shortlisted:     { bg: '#D8F0EB', color: '#0A9E97', label: 'Shortlisted',      dot: '#0FB9B1' },
  saved_for_later: { bg: '#FFF8E7', color: '#B7791F', label: 'Saved for Later',  dot: '#F6AD55' },
  hired:           { bg: '#C6F6D5', color: '#276749', label: 'Hired ✓',          dot: '#48BB78' },
  rejected:        { bg: '#FFF5F5', color: '#E53E3E', label: 'Rejected',         dot: '#FC8181' },
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  if (!value) return null
  return (
    <div style={{ display: 'flex', gap: '12px', padding: '10px 0', borderBottom: '1px solid #F0F4F8' }}>
      <span style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', fontWeight: 600, color: '#96AFCA', width: '140px', flexShrink: 0, paddingTop: '1px' }}>{label}</span>
      <span style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: '#032655', flex: 1 }}>{value}</span>
    </div>
  )
}

export default async function Page({ params }: { params: Promise<{ submissionId: string }> }) {
  const { submissionId } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: recruiter } = await supabase
    .from('recruiters').select('id').eq('user_id', user!.id).single()

  if (!recruiter) notFound()

  // Use regular client — RLS allows recruiters to read their own submissions
  const { data: sub, error } = await supabase
    .from('candidate_submissions')
    .select('*')
    .eq('id', submissionId)
    .eq('recruiter_id', recruiter.id)
    .single()

  if (error || !sub) notFound()

  // Admin client to get job title even if closed
  const admin = createAdminClient()
  const { data: job } = await admin
    .from('job_posts')
    .select('title, department, location, work_model, status')
    .eq('id', sub.job_post_id)
    .single()

  const s = STATUS_STYLE[sub.status] ?? STATUS_STYLE.in_pipeline

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* Back nav */}
      <div style={{ flexShrink: 0, marginBottom: '16px' }}>
        <Link
          href="/recruiter/dashboard/submissions"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#5A7A9F', textDecoration: 'none', marginBottom: '14px' }}
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          My Submissions
        </Link>

        {/* Header card */}
        <div style={{ background: 'linear-gradient(135deg, #032655 0%, #0a3570 60%, #0FB9B1 100%)', borderRadius: '14px', padding: '20px 24px', position: 'relative', overflow: 'hidden' }}>
          <div aria-hidden style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '20px 20px', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
            <div>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>Submitted Candidate</p>
              <h1 style={{ fontFamily: 'var(--font-ui)', fontSize: '22px', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: '6px' }}>{sub.candidate_name}</h1>
              {job && (
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>
                  {job.title}{job.department ? ` · ${job.department}` : ''}{job.location ? ` · ${job.location}` : ''}
                </p>
              )}
            </div>
            {/* Status badge */}
            <div style={{ flexShrink: 0, textAlign: 'right' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', background: s.bg, borderRadius: '10px', padding: '8px 14px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: s.dot, flexShrink: 0 }} />
                <span style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', fontWeight: 700, color: s.color }}>{s.label}</span>
              </div>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '6px' }}>
                {new Date(sub.submitted_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>

        {/* Contact details */}
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #D0DBE8', padding: '16px 20px' }}>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '11px', fontWeight: 700, color: '#96AFCA', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Contact</p>
          <Row label="Email"            value={sub.email ? <a href={`mailto:${sub.email}`} style={{ color: '#0FB9B1', textDecoration: 'none' }}>{sub.email}</a> : null} />
          <Row label="Primary Contact"  value={sub.contact_primary} />
          <Row label="Secondary Contact" value={sub.contact_secondary} />
          <Row label="LinkedIn"         value={sub.linkedin_url ? <a href={sub.linkedin_url} target="_blank" rel="noopener noreferrer" style={{ color: '#0284C7', textDecoration: 'none' }}>View Profile ↗</a> : null} />
          <Row label="Portfolio"        value={sub.portfolio_url ? <a href={sub.portfolio_url} target="_blank" rel="noopener noreferrer" style={{ color: '#0284C7', textDecoration: 'none' }}>View Portfolio ↗</a> : null} />
        </div>

        {/* Professional details */}
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #D0DBE8', padding: '16px 20px' }}>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '11px', fontWeight: 700, color: '#96AFCA', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Professional</p>
          <Row label="Current Location" value={sub.current_location} />
          <Row label="Experience"       value={sub.total_experience != null ? `${sub.total_experience} years` : null} />
          <Row label="Current CTC"      value={sub.current_ctc != null ? `₹${(sub.current_ctc / 100000).toFixed(1)} LPA` : null} />
          <Row label="Notice Period"    value={sub.notice_period} />
        </div>

        {/* Recruiter note */}
        {sub.recruiter_note && (
          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #D0DBE8', padding: '16px 20px' }}>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '11px', fontWeight: 700, color: '#96AFCA', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Your Note</p>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', color: '#5A7A9F', lineHeight: 1.7, margin: 0 }}>{sub.recruiter_note}</p>
          </div>
        )}

        {/* Resume */}
        {sub.resume_url && (
          <a
            href={sub.resume_url} target="_blank" rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '11px 20px', borderRadius: '10px', border: '1.5px solid #D0DBE8', background: '#fff', color: '#032655', textDecoration: 'none', fontWeight: 600, fontSize: '13px', width: 'fit-content' }}
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            Download Resume
          </a>
        )}
      </div>
    </div>
  )
}
