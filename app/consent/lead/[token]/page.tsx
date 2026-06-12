import { createAdminClient } from '@/lib/supabase/admin'

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: '#F5F8FC', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 16px', fontFamily: "'Segoe UI', Arial, sans-serif" }}>
      <div style={{ width: '100%', maxWidth: '520px' }}>{children}</div>
    </div>
  )
}

export default async function LeadConsentPage({
  params,
  searchParams,
}: {
  params:       Promise<{ token: string }>
  searchParams: Promise<{ result?: string; withdraw?: string }>
}) {
  const { token }            = await params
  const { result, withdraw } = await searchParams

  const admin = createAdminClient()
  const { data: lead } = await admin
    .from('recruiter_leads')
    .select('id, applicant_name, job_post_id, status, consent_token_expires_at, recruiter_id, recruiters(full_name), job_posts(title)')
    .eq('consent_token', token)
    .maybeSingle()

  const jobTitle      = (lead?.job_posts as any)?.title ?? 'the position'
  const recruiterName = (lead?.recruiters as any)?.full_name ?? 'the recruiter'
  const candidateFirst = lead?.applicant_name?.split(' ')[0] ?? 'there'
  const isExpired     = lead?.consent_token_expires_at ? new Date(lead.consent_token_expires_at) < new Date() : true

  /* Not found */
  if (!lead) {
    return (
      <Shell>
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '48px 40px', textAlign: 'center' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <svg width="22" height="22" fill="none" stroke="#dc2626" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"/></svg>
          </div>
          <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>Invalid link</h2>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: 0, lineHeight: 1.6 }}>This link is invalid or has already been used.</p>
        </div>
      </Shell>
    )
  }

  /* Confirmed */
  if (lead.status === 'consented' || result === 'confirmed') {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #0f172a 0%, #0f2744 50%, #0a3d2e 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 16px', fontFamily: "'Segoe UI', Arial, sans-serif" }}>
        <div style={{ width: '100%', maxWidth: '480px' }}>
          <div style={{ background: '#fff', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.4)' }}>
            <div style={{ height: '5px', background: 'linear-gradient(90deg, #059669, #10b981)' }} />
            <div style={{ padding: '40px 36px', textAlign: 'center' }}>
              <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg,#059669,#10b981)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 0 0 12px rgba(16,185,129,0.1)' }}>
                <svg width="32" height="32" fill="none" stroke="#fff" strokeWidth={2.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>
              </div>
              <h1 style={{ fontSize: '22px', fontWeight: 900, color: '#0f172a', margin: '0 0 8px', letterSpacing: '-0.03em' }}>
                You're confirmed, {candidateFirst}!
              </h1>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 20px', lineHeight: 1.6 }}>
                Your profile for <strong style={{ color: '#111827' }}>{jobTitle}</strong> is now being shared with the hiring company.
              </p>
              <p style={{ fontSize: '13px', color: '#9ca3af', margin: 0, lineHeight: 1.7 }}>
                {recruiterName} will reach out to you soon. Keep an eye on your inbox.
              </p>
            </div>
          </div>
          <p style={{ textAlign: 'center', fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '16px' }}>
            Powered by AlphaNom
          </p>
        </div>
      </div>
    )
  }

  /* Withdrawn / rejected */
  if (lead.status === 'rejected' || result === 'withdrawn') {
    return (
      <Shell>
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #fecaca', padding: '48px 40px', textAlign: 'center' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <svg width="22" height="22" fill="none" stroke="#dc2626" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </div>
          <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>Application declined</h2>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: 0, lineHeight: 1.6 }}>
            Your application for <strong style={{ color: '#111827' }}>{jobTitle}</strong> has been withdrawn. The recruiter has been notified.
          </p>
        </div>
      </Shell>
    )
  }

  /* Expired */
  if (isExpired) {
    return (
      <Shell>
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #fde68a', padding: '48px 40px', textAlign: 'center' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#fffbeb', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <svg width="22" height="22" fill="none" stroke="#d97706" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>Link expired</h2>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: 0, lineHeight: 1.6 }}>
            This link expired after 48 hours. Please ask <strong>{recruiterName}</strong> to resend the consent request.
          </p>
        </div>
      </Shell>
    )
  }

  /* Withdraw confirmation */
  if (withdraw === '1') {
    return (
      <Shell>
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
          <div style={{ height: '4px', background: '#dc2626' }} />
          <div style={{ padding: '36px 32px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: '0 0 10px' }}>Decline this application?</h2>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 24px', lineHeight: 1.7 }}>
              You're about to decline your application for <strong style={{ color: '#111827' }}>{jobTitle}</strong>. {recruiterName} will be notified.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <a href={`/consent/lead/${token}`} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px', borderRadius: '8px', border: '1.5px solid #e5e7eb', background: '#fff', color: '#374151', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>
                Go back
              </a>
              <a href={`/consent/lead/${token}/withdraw`} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px', borderRadius: '8px', background: '#dc2626', color: '#fff', textDecoration: 'none', fontSize: '14px', fontWeight: 700 }}>
                Yes, decline
              </a>
            </div>
          </div>
        </div>
      </Shell>
    )
  }

  /* Default: pending consent */
  return (
    <Shell>
      <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #D0DBE8', overflow: 'hidden' }}>
        <div style={{ height: '4px', background: 'linear-gradient(90deg,#032655,#0FB9B1)' }} />
        <div style={{ padding: '32px 30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg,#0FB9B1,#0A9E97)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontWeight: 900, fontSize: '10px', color: '#fff', letterSpacing: '0.04em' }}>AN</span>
            </div>
            <span style={{ fontWeight: 800, fontSize: '15px', color: '#032655' }}>AlphaNom</span>
          </div>
          <h1 style={{ fontSize: '18px', fontWeight: 800, color: '#032655', margin: '0 0 8px' }}>Share your profile?</h1>
          <p style={{ fontSize: '14px', color: '#5A7A9F', margin: '0 0 20px', lineHeight: 1.7 }}>
            Dear {candidateFirst}, a recruiter has reviewed your application for <strong style={{ color: '#032655' }}>{jobTitle}</strong> and would like to share your profile with the hiring company.
          </p>
          <a
            href={`/consent/lead/${token}/confirm`}
            style={{ display: 'block', padding: '13px 24px', borderRadius: '9px', background: 'linear-gradient(135deg,#032655,#0FB9B1)', color: '#fff', textDecoration: 'none', fontSize: '14px', fontWeight: 700, textAlign: 'center' as const, marginBottom: '16px', boxShadow: '0 4px 14px rgba(3,38,85,0.22)' }}
          >
            Yes, share my profile &rarr;
          </a>
          <p style={{ fontSize: '12px', color: '#96AFCA', margin: 0, textAlign: 'center' as const }}>
            This link expires in 48 hours.{' '}
            <a href={`/consent/lead/${token}?withdraw=1`} style={{ color: '#E53E3E', textDecoration: 'none' }}>Decline</a>
          </p>
        </div>
      </div>
    </Shell>
  )
}
