import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ProfileForm from './ProfileForm'

export default async function Page() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/recruiter/login')

  const { data: recruiter } = await supabase
    .from('recruiters').select('*').eq('user_id', user.id).single()

  if (!recruiter) redirect('/recruiter/login')

  return (
    <div className="rdash-page-root" style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '16px', maxWidth: '680px' }}>

      {/* Header — fixed */}
      <div style={{ flexShrink: 0 }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#032655', marginBottom: '2px' }}>My Profile</h1>
        <p style={{ color: '#5A7A9F', fontSize: '13px' }}>Keep your profile up to date so employers can trust your submissions.</p>
      </div>

      {/* Content — scrolls */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '4px' }}>

        {/* Verification status banner */}
        {recruiter.is_verified ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 18px', borderRadius: '12px', background: '#F0FBF9', border: '1px solid rgba(15,185,177,0.3)', flexShrink: 0 }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#D8F0EB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#0A9E97">
                <title>Verified</title>
                <path d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.49 4.49 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.307 4.49 4.49 0 01-1.307-3.497A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"/>
              </svg>
            </div>
            <div>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', fontWeight: 700, color: '#0A9E97', margin: '0 0 1px' }}>Verified Recruiter</p>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', color: '#5A7A9F', margin: 0 }}>Your profile has been verified by the AlphaNom team. Employers can trust your submissions.</p>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 18px', borderRadius: '12px', background: '#FFF8E7', border: '1px solid rgba(245,166,35,0.3)', flexShrink: 0 }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#FDF3DC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="15" height="15" fill="none" stroke="#B7791F" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <div>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', fontWeight: 700, color: '#B7791F', margin: '0 0 1px' }}>Verification Pending</p>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', color: '#5A7A9F', margin: 0 }}>Your profile is under review. Once verified, a badge will appear on your submissions.</p>
            </div>
          </div>
        )}

        {/* Read-only info */}
        <div className="rdash-profile-grid" style={{ background: '#fff', borderRadius: '14px', border: '1px solid #D0DBE8', padding: '20px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', flexShrink: 0 }}>
          <InfoRow label="Full Name"      value={recruiter.full_name} />
          <InfoRow label="Email"          value={recruiter.email} />
          <InfoRow label="Primary Contact" value={recruiter.contact_primary} />
          <InfoRow label="Member Since"   value={new Date(recruiter.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} />
          {recruiter.linkedin_url && (
            <div style={{ gridColumn: '1 / -1' }}>
              <p style={{ fontSize: '10px', fontWeight: 700, color: '#96AFCA', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '3px' }}>LinkedIn</p>
              <a href={recruiter.linkedin_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '13px', fontWeight: 600, color: '#0FB9B1', textDecoration: 'none', wordBreak: 'break-all' }}>
                {recruiter.linkedin_url}
              </a>
            </div>
          )}
        </div>

        {/* Editable form */}
        <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #D0DBE8', padding: '20px 24px' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#032655', marginBottom: '18px', paddingBottom: '12px', borderBottom: '1px solid #EEF3F8' }}>
            Edit Details
          </h2>
          <ProfileForm recruiter={recruiter} />
        </div>
      </div>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p style={{ fontSize: '10px', fontWeight: 700, color: '#96AFCA', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '3px' }}>{label}</p>
      <p style={{ fontSize: '13px', fontWeight: 600, color: '#032655', margin: 0 }}>{value || '—'}</p>
    </div>
  )
}
