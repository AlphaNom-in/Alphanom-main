import { createAdminClient } from '@/lib/supabase/admin'
import { withdrawConsent }   from './actions'

function Shell({ children, bg = '#f7f7f7' }: { children: React.ReactNode; bg?: string }) {
  return (
    <div style={{ minHeight: '100vh', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 16px', fontFamily: "'Segoe UI', Arial, sans-serif" }}>
      <div style={{ width: '100%', maxWidth: '520px' }}>{children}</div>
    </div>
  )
}

export default async function Page({
  params,
  searchParams,
}: {
  params:       Promise<{ token: string }>
  searchParams: Promise<{ result?: string; withdraw?: string }>
}) {
  const { token }             = await params
  const { result, withdraw }  = await searchParams

  const admin = createAdminClient()
  const { data: sub } = await admin
    .from('candidate_submissions')
    .select(`
      id, candidate_name, consent_status, consent_token_expires_at, job_post_id, recruiter_id,
      job_posts ( title, employers ( company_name ) ),
      recruiters ( full_name )
    `)
    .eq('consent_token', token)
    .maybeSingle()

  /* ── Token not found ─────────────────────────────── */
  if (!sub) {
    return (
      <Shell>
        <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', padding: '48px 40px', textAlign: 'center' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#fef2f2', border: '1.5px solid #fecaca', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <svg width="22" height="22" fill="none" stroke="#dc2626" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"/></svg>
          </div>
          <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>Invalid link</h2>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: 0, lineHeight: 1.6 }}>This link is invalid or has already been used.</p>
        </div>
      </Shell>
    )
  }

  const jobPost      = sub.job_posts as any
  const jobTitle     = jobPost?.title ?? 'the position'
  const companyName  = jobPost?.employers?.company_name ?? 'the company'
  const recruiterName = (sub.recruiters as any)?.full_name ?? 'HR Team'
  const candidateFirst = sub.candidate_name.split(' ')[0]
  const isExpired    = new Date(sub.consent_token_expires_at) < new Date()

  /* ── Confirmed ───────────────────────────────────── */
  if (sub.consent_status === 'consented' || result === 'confirmed') {
    const confirmedDate = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #0f172a 0%, #0f2744 50%, #0a3d2e 100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '32px 16px', fontFamily: "'Segoe UI', Arial, sans-serif",
      }}>
        {/* Glow backdrop */}
        <div style={{ position: 'fixed', top: '30%', left: '50%', transform: 'translate(-50%,-50%)', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ width: '100%', maxWidth: '540px', position: 'relative' }}>

          {/* Top company bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', padding: '0 4px' }}>
            <div>
              <p style={{ fontSize: '18px', fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '-0.01em' }}>{companyName}</p>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', margin: '3px 0 0', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Human Resources</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '20px', padding: '6px 14px' }}>
              <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981' }} />
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#6ee7b7' }}>Confirmed</span>
            </div>
          </div>

          {/* Main card */}
          <div style={{ background: '#fff', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.4)' }}>

            {/* Green accent top */}
            <div style={{ height: '5px', background: 'linear-gradient(90deg, #059669, #10b981, #34d399)' }} />

            <div style={{ padding: '40px 36px 36px' }}>
              {/* Checkmark + title */}
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <div style={{
                  width: '80px', height: '80px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 20px',
                  boxShadow: '0 0 0 12px rgba(16,185,129,0.1), 0 12px 32px rgba(16,185,129,0.35)',
                }}>
                  <svg width="38" height="38" fill="none" stroke="#fff" strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <h1 style={{ fontSize: '26px', fontWeight: 900, color: '#0f172a', margin: '0 0 8px', letterSpacing: '-0.03em' }}>
                  You're confirmed, {candidateFirst}!
                </h1>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: 0, lineHeight: 1.6 }}>
                  Your consent has been recorded and your application is now active.
                </p>
              </div>

              {/* Role detail pill */}
              <div style={{
                background: 'linear-gradient(135deg, #f0fdf4, #ecfdf5)',
                border: '1.5px solid #a7f3d0',
                borderRadius: '14px', padding: '20px 24px', marginBottom: '28px',
              }}>
                <p style={{ fontSize: '10px', fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 8px' }}>
                  Applied Position
                </p>
                <p style={{ fontSize: '20px', fontWeight: 800, color: '#064e3b', margin: '0 0 4px', letterSpacing: '-0.02em' }}>
                  {jobTitle}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <svg width="13" height="13" fill="none" stroke="#059669" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18"/></svg>
                  <p style={{ fontSize: '13px', color: '#059669', margin: 0, fontWeight: 600 }}>{companyName}</p>
                </div>
              </div>

              {/* What happens next */}
              <div style={{ marginBottom: '28px' }}>
                <p style={{ fontSize: '11px', fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 14px' }}>
                  What happens next
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    { icon: '👁', text: 'Your profile is now visible to the hiring team at ' + companyName },
                    { icon: '📞', text: recruiterName + ' will review your application and reach out' },
                    { icon: '🗓', text: 'Expect to hear back within a few business days' },
                  ].map((step, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px 14px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
                      <span style={{ fontSize: '16px', flexShrink: 0, lineHeight: 1 }}>{step.icon}</span>
                      <p style={{ fontSize: '13px', color: '#374151', margin: 0, lineHeight: 1.6 }}>{step.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Date stamp */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 14px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #f1f5f9', marginBottom: '28px' }}>
                <svg width="14" height="14" fill="none" stroke="#9ca3af" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5"/></svg>
                <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>
                  Consent recorded on <strong style={{ color: '#6b7280' }}>{confirmedDate}</strong>
                </p>
              </div>

              {/* Sign-off */}
              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="18" height="18" fill="none" stroke="#fff" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0"/></svg>
                </div>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 700, color: '#111827', margin: 0 }}>{recruiterName}</p>
                  <p style={{ fontSize: '12px', color: '#9ca3af', margin: '2px 0 0' }}>Human Resources · {companyName}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom note */}
          <p style={{ textAlign: 'center', fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '20px', lineHeight: 1.6 }}>
            This confirmation is securely recorded. Keep this page for your reference.
          </p>
        </div>
      </div>
    )
  }

  /* ── Withdrawn ───────────────────────────────────── */
  if (sub.consent_status === 'withdrawn' || result === 'withdrawn') {
    return (
      <Shell>
        <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #fecaca', padding: '48px 40px', textAlign: 'center' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#fef2f2', border: '1.5px solid #fecaca', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <svg width="22" height="22" fill="none" stroke="#dc2626" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </div>
          <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>Application withdrawn</h2>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 16px', lineHeight: 1.6 }}>
            Your application for <strong style={{ color: '#111827' }}>{jobTitle}</strong> at <strong style={{ color: '#111827' }}>{companyName}</strong> has been cancelled.
          </p>
          <p style={{ fontSize: '13px', color: '#9ca3af', margin: 0 }}>The recruiter has been notified.</p>
        </div>
      </Shell>
    )
  }

  /* ── Expired ─────────────────────────────────────── */
  if (isExpired) {
    return (
      <Shell>
        <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', padding: '48px 40px', textAlign: 'center' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#fffbeb', border: '1.5px solid #fde68a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <svg width="22" height="22" fill="none" stroke="#d97706" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>Link has expired</h2>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: 0, lineHeight: 1.6 }}>
            The 48-hour window has passed. Please ask <strong style={{ color: '#111827' }}>{recruiterName}</strong> to resend the verification link.
          </p>
        </div>
      </Shell>
    )
  }

  /* ── Withdraw confirmation sub-page ─────────────── */
  const withdrawWithToken = withdrawConsent.bind(null, token)

  if (withdraw === '1') {
    return (
      <Shell>
        <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
          <div style={{ height: '4px', background: '#dc2626' }} />
          <div style={{ padding: '40px 36px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: '0 0 10px' }}>
              Decline this application?
            </h2>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 8px', lineHeight: 1.7 }}>
              You are about to decline the application for <strong style={{ color: '#111827' }}>{jobTitle}</strong> at <strong style={{ color: '#111827' }}>{companyName}</strong>.
            </p>
            <p style={{ fontSize: '13px', color: '#9ca3af', margin: '0 0 28px' }}>
              {recruiterName} will be notified and your application will be cancelled.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <a
                href={`/consent/${token}`}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px', borderRadius: '6px', border: '1.5px solid #e5e7eb', background: '#fff', color: '#374151', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}
              >
                Go back
              </a>
              <form action={withdrawWithToken} style={{ flex: 1 }}>
                <button
                  type="submit"
                  style={{ width: '100%', padding: '12px', borderRadius: '6px', border: 'none', background: '#dc2626', color: '#fff', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Yes, decline
                </button>
              </form>
            </div>
          </div>
        </div>
      </Shell>
    )
  }

  /* ── Default: pending consent (fallback if someone visits the URL directly) */
  return (
    <Shell>
      <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        <div style={{ background: '#1a1a2e', padding: '20px 32px' }}>
          <p style={{ fontSize: '15px', fontWeight: 700, color: '#fff', margin: 0 }}>{companyName}</p>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', margin: '2px 0 0', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Human Resources</p>
        </div>
        <div style={{ padding: '36px 32px' }}>
          <p style={{ fontSize: '15px', color: '#111827', margin: '0 0 16px', lineHeight: 1.7 }}>
            Dear {candidateFirst},
          </p>
          <p style={{ fontSize: '15px', color: '#374151', margin: '0 0 8px', lineHeight: 1.8 }}>
            We'd like to confirm your interest in the <strong style={{ color: '#111827' }}>{jobTitle}</strong> position at <strong style={{ color: '#111827' }}>{companyName}</strong>.
          </p>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 28px', lineHeight: 1.7 }}>
            Please click below to confirm you'd like to proceed.
          </p>
          <a
            href={`/consent/${token}/confirm`}
            style={{ display: 'block', padding: '14px 24px', borderRadius: '6px', background: '#1a1a2e', color: '#fff', textDecoration: 'none', fontSize: '14px', fontWeight: 700, textAlign: 'center' as const, marginBottom: '20px' }}
          >
            Yes, proceed my application &rarr;
          </a>
          <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '16px' }}>
            <p style={{ fontSize: '12px', color: '#9ca3af', margin: '0 0 4px' }}>
              This link expires in 48 hours.
            </p>
            <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>
              Not interested?{' '}
              <a href={`/consent/${token}?withdraw=1`} style={{ color: '#dc2626', textDecoration: 'none', fontWeight: 600 }}>Decline this application</a>
            </p>
          </div>
        </div>
        <div style={{ padding: '16px 32px', borderTop: '1px solid #f3f4f6', background: '#fafafa' }}>
          <p style={{ fontSize: '13px', color: '#6b7280', margin: 0, lineHeight: 1.6 }}>
            Regards, <strong style={{ color: '#111827' }}>{recruiterName}</strong><br />
            <span style={{ fontSize: '12px', color: '#9ca3af' }}>Human Resources · {companyName}</span>
          </p>
        </div>
      </div>
    </Shell>
  )
}
