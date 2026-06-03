import Link from 'next/link'

const personIcon = (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
)

const buildingIcon = (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18h16.5a1.5 1.5 0 011.5 1.5v11.25a1.5 1.5 0 01-1.5 1.5H3.75a1.5 1.5 0 01-1.5-1.5V4.5a1.5 1.5 0 011.5-1.5z" />
  </svg>
)

export default function RoleTabs({
  active,
  mode,
}: {
  active: 'recruiter' | 'employer'
  mode: 'login' | 'signup'
}) {
  const recruiterHref = mode === 'login' ? '/recruiter/login' : '/recruiter/signup'
  const employerHref  = mode === 'login' ? '/employer/login'  : '/employer/signup'

  return (
    <div style={{
      display: 'flex', gap: '5px',
      background: '#EEF3F8', borderRadius: '12px', padding: '4px',
      marginBottom: '20px', width: '100%', maxWidth: '400px',
    }}>
      <Link
        href={recruiterHref}
        style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
          padding: '9px 0', borderRadius: '8px', textDecoration: 'none',
          fontFamily: 'var(--font-ui)', fontSize: '0.75rem', fontWeight: 700,
          background: active === 'recruiter' ? '#032655' : 'transparent',
          color: active === 'recruiter' ? '#fff' : '#96AFCA',
          boxShadow: active === 'recruiter' ? '0 1px 6px rgba(3,38,85,0.18)' : 'none',
          transition: 'all 0.15s',
        }}
      >
        {personIcon}
        Recruiter
      </Link>

      <Link
        href={employerHref}
        style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
          padding: '9px 0', borderRadius: '8px', textDecoration: 'none',
          fontFamily: 'var(--font-ui)', fontSize: '0.75rem', fontWeight: 700,
          background: active === 'employer' ? '#032655' : 'transparent',
          color: active === 'employer' ? '#fff' : '#96AFCA',
          boxShadow: active === 'employer' ? '0 1px 6px rgba(3,38,85,0.18)' : 'none',
          transition: 'all 0.15s',
        }}
      >
        {buildingIcon}
        Employer
      </Link>
    </div>
  )
}
