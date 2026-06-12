import { createClient }      from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import Link                  from 'next/link'
import SubmissionsView       from './SubmissionsView'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: recruiter } = await supabase
    .from('recruiters').select('id').eq('user_id', user!.id).single()

  if (!recruiter) return <div>Recruiter profile not found</div>

  const admin = createAdminClient()

  const { data: submissions } = await admin
    .from('candidate_submissions')
    .select('id, candidate_name, status, submitted_at, consent_status, consent_token_expires_at, job_posts(title, department, employers(company_name))')
    .eq('recruiter_id', recruiter.id)
    .order('submitted_at', { ascending: false })

  const all       = submissions ?? []
  const total     = all.length
  const consented = all.filter(s => s.consent_status === 'consented' || s.consent_status === null).length
  const pending   = all.filter(s => s.consent_status === 'pending_consent').length
  const withdrawn = all.filter(s => s.consent_status === 'withdrawn').length

  return (
    <div className="rdash-page-root" style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '14px' }}>

      {/* Header */}
      <div style={{ flexShrink: 0 }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#032655', marginBottom: '2px' }}>My Submissions</h1>
        <p style={{ color: '#5A7A9F', fontSize: '13px' }}>
          {total} candidate{total !== 1 ? 's' : ''} submitted across all jobs
        </p>
      </div>

      {/* Stats row */}
      <div className="rdash-stats-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', flexShrink: 0 }}>
        {[
          { label: 'Total',            value: total,     color: '#032655', bg: '#EEF3F8' },
          { label: 'Consent Given',    value: consented, color: '#0A9E97', bg: '#D8F0EB' },
          { label: 'Awaiting Consent', value: pending,   color: '#B7791F', bg: '#FFF8E7' },
          { label: 'Withdrawn',        value: withdrawn, color: '#E53E3E', bg: '#FFF5F5' },
        ].map(m => (
          <div key={m.label} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #D0DBE8', padding: '14px 16px' }}>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '11px', fontWeight: 700, color: '#96AFCA', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>{m.label}</p>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '22px', fontWeight: 800, color: m.color, lineHeight: 1, margin: 0 }}>{m.value}</p>
          </div>
        ))}
      </div>

      {/* Empty state (no submissions at all) */}
      {total === 0 ? (
        <div style={{ flex: 1, background: '#fff', borderRadius: '16px', border: '1px solid #D0DBE8', padding: '60px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#EEF3F8', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
            <svg width="22" height="22" fill="none" stroke="#96AFCA" strokeWidth={1.6} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.75 3.75 0 11-6.75 0 3.75 3.75 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
          </div>
          <p style={{ color: '#5A7A9F', fontSize: '15px', fontWeight: 600, marginBottom: '6px' }}>No submissions yet</p>
          <p style={{ color: '#96AFCA', fontSize: '13px', marginBottom: '20px' }}>Browse open jobs and submit candidates to get started.</p>
          <Link href="/recruiter/dashboard/all-jobs" style={{ padding: '10px 22px', borderRadius: '10px', background: '#0FB9B1', color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>
            Browse Jobs
          </Link>
        </div>
      ) : (
        <SubmissionsView
          submissions={all as any}
          stats={{ total, consented, pending, withdrawn }}
        />
      )}
    </div>
  )
}
