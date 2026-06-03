import { createClient } from '@/lib/supabase/server'
import PostJobForm from '@/components/employer/PostJobForm'
import Link from 'next/link'

export default async function Page() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { data: employer } = await supabase
    .from('employers')
    .select('company_address, industry')
    .eq('user_id', user?.id)
    .single()

  const isComplete = !!(employer?.company_address?.trim() && employer?.industry?.trim())

  if (!isComplete) {
    return (
      <div style={{ maxWidth: '560px' }}>
        <div style={{
          background: '#fff',
          borderRadius: '16px',
          border: '1px solid #D0DBE8',
          overflow: 'hidden',
          boxShadow: '0 2px 16px rgba(3,38,85,0.07)',
        }}>
          {/* Top accent */}
          <div style={{ height: '3px', background: 'linear-gradient(90deg, #F5A623, #E09200)' }} />

          <div style={{ padding: '2.5rem', textAlign: 'center' }}>
            {/* Lock icon */}
            <div style={{
              width: '56px', height: '56px', borderRadius: '14px',
              background: '#FDF3DC', border: '1px solid #F5A623',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1.25rem',
            }}>
              <svg fill="none" stroke="#F5A623" strokeWidth={1.6} viewBox="0 0 24 24" style={{ width: '26px', height: '26px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>

            <h2 style={{ fontFamily: 'var(--font-ui)', fontSize: '1.25rem', fontWeight: 800, color: '#032655', letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>
              Complete your profile first
            </h2>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.875rem', color: '#5A7A9F', lineHeight: 1.65, marginBottom: '1.75rem', maxWidth: '380px', margin: '0 auto 1.75rem' }}>
              To post jobs on AlphaNom, you need to add your <strong style={{ color: '#032655' }}>industry</strong> and <strong style={{ color: '#032655' }}>company address</strong>. This takes less than a minute.
            </p>

            {/* What's needed */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1.75rem', textAlign: 'left', maxWidth: '320px', margin: '0 auto 1.75rem' }}>
              {[
                { label: 'Industry', done: !!employer?.industry },
                { label: 'Company Address', done: !!employer?.company_address },
              ].map((item) => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', background: item.done ? '#D8F0EB' : '#FDF3DC', borderRadius: '8px', border: `1px solid ${item.done ? '#0FB9B1' : '#F5A623'}` }}>
                  <div style={{
                    width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0,
                    background: item.done ? '#0FB9B1' : 'transparent',
                    border: `2px solid ${item.done ? '#0FB9B1' : '#F5A623'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {item.done ? (
                      <svg fill="none" stroke="#fff" strokeWidth={2.5} viewBox="0 0 24 24" style={{ width: '10px', height: '10px' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    ) : (
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#F5A623' }} />
                    )}
                  </div>
                  <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', fontWeight: 600, color: item.done ? '#0A9E97' : '#7A5C00' }}>
                    {item.label}
                    {!item.done && <span style={{ fontWeight: 400, marginLeft: '4px' }}>— missing</span>}
                  </span>
                </div>
              ))}
            </div>

            <Link href="/employer/dashboard/profile" style={{
              display: 'inline-flex', alignItems: 'center', gap: '7px',
              padding: '11px 24px', borderRadius: '9px',
              background: '#032655', color: '#fff', border: 'none',
              fontFamily: 'var(--font-ui)', fontSize: '0.82rem', fontWeight: 700,
              textDecoration: 'none', letterSpacing: '0.02em',
            }}>
              Go to Profile
              <svg fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24" style={{ width: '13px', height: '13px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flexShrink: 0, marginBottom: '1.25rem' }}>
        <h1 style={{ fontFamily: 'var(--font-ui)', fontSize: '1.25rem', fontWeight: 800, color: '#032655', letterSpacing: '-0.02em', marginBottom: '2px' }}>
          Post a Job
        </h1>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: '#5A7A9F' }}>
          Fill in the details below to publish a new role to 1,500+ specialist recruiters.
        </p>
      </div>
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
        <PostJobForm />
      </div>
    </div>
  )
}
