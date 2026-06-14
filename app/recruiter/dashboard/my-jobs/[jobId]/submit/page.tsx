import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import SlotGateWrapper from '@/components/recruiter/SlotGateWrapper'

export default async function Page({ params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: job, error }, { data: recruiter }] = await Promise.all([
    supabase
      .from('job_posts')
      .select('id, title, employers(company_name)')
      .eq('id', jobId)
      .eq('status', 'active')
      .single(),
    supabase
      .from('recruiters')
      .select('id, is_verified, years_of_experience, linkedin_url')
      .eq('user_id', user?.id)
      .single(),
  ])

  if (error || !job) notFound()

  // Count existing submissions for this recruiter + job
  const admin = createAdminClient()
  const { count: usedSlots } = await admin
    .from('candidate_submissions')
    .select('id', { count: 'exact', head: true })
    .eq('recruiter_id', recruiter?.id ?? '')
    .eq('job_post_id', jobId)
  const slotsUsed = usedSlots ?? 0

  const profileIncomplete =
    (!recruiter?.years_of_experience && recruiter?.years_of_experience !== 0) ||
    !recruiter?.linkedin_url

  if (!recruiter?.is_verified || profileIncomplete) {
    return (
      <div style={{ maxWidth: '520px' }}>
        <div style={{
          background: '#fff', borderRadius: '16px',
          border: '1px solid #D0DBE8', overflow: 'hidden',
          boxShadow: '0 2px 16px rgba(3,38,85,0.07)',
        }}>
          <div style={{ height: '3px', background: 'linear-gradient(90deg, #032655, #0FB9B1)' }} />
          <div style={{ padding: '2.5rem', textAlign: 'center' }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '14px',
              background: '#EEF3F8', border: '1px solid #D0DBE8',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1.25rem',
            }}>
              <svg fill="none" stroke="#5A7A9F" strokeWidth={1.6} viewBox="0 0 24 24" style={{ width: '26px', height: '26px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            <h2 style={{ fontFamily: 'var(--font-ui)', fontSize: '1.2rem', fontWeight: 800, color: '#032655', letterSpacing: '-0.025em', marginBottom: '0.5rem' }}>
              {!recruiter?.is_verified ? 'Verification Required' : 'Complete Your Profile'}
            </h2>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.875rem', color: '#5A7A9F', lineHeight: 1.65, maxWidth: '360px', margin: '0 auto 1.75rem' }}>
              {!recruiter?.is_verified
                ? 'Your account is pending approval by the AlphaNom admin team. You can submit candidates once your account is verified.'
                : 'Please complete your recruiter profile before submitting candidates.'}
            </p>
            {!recruiter?.is_verified ? (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '10px 18px', borderRadius: '8px',
                background: '#F5F8FC', border: '1px solid #D0DBE8',
              }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#F5A623', flexShrink: 0 }} />
                <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', fontWeight: 600, color: '#5A7A9F' }}>
                  Awaiting admin approval
                </span>
              </div>
            ) : (
              <Link href="/recruiter/dashboard/profile/complete" style={{
                display: 'inline-flex', alignItems: 'center', gap: '7px',
                padding: '11px 24px', borderRadius: '9px',
                background: '#032655', color: '#fff',
                fontFamily: 'var(--font-ui)', fontSize: '0.82rem', fontWeight: 700,
                textDecoration: 'none',
              }}>
                Complete Profile
                <svg fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24" style={{ width: '13px', height: '13px' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </div>
    )
  }

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
          <SlotGateWrapper jobId={job.id} jobTitle={job.title} usedSlots={slotsUsed} />
        </div>
      </div>
    </div>
  )
}
