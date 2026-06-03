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

        {/* Read-only info */}
        <div className="rdash-profile-grid" style={{ background: '#fff', borderRadius: '14px', border: '1px solid #D0DBE8', padding: '20px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', flexShrink: 0 }}>
          <InfoRow label="Full Name"      value={recruiter.full_name} />
          <InfoRow label="Email"          value={recruiter.email} />
          <InfoRow label="Primary Contact" value={recruiter.contact_primary} />
          <InfoRow label="Member Since"   value={new Date(recruiter.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} />
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
