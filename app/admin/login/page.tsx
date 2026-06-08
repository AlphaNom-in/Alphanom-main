'use client'

import { useActionState } from 'react'
import { adminLogin }     from './action'

export default function AdminLoginPage() {
  const [state, action, pending] = useActionState(adminLogin, null)

  return (
    <div style={{
      minHeight: '100vh', background: '#F4F6FB',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
    }}>
      <div style={{
        width: '100%', maxWidth: '400px', background: '#fff',
        borderRadius: '16px', overflow: 'hidden',
        border: '1px solid #E4EAF1',
        boxShadow: '0 4px 24px rgba(3,38,85,0.08)',
      }}>
        {/* Top accent */}
        <div style={{ height: '4px', background: 'linear-gradient(90deg,#032655,#0FB9B1)' }} />

        <div style={{ padding: '44px 40px 40px' }}>
          {/* Brand */}
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '16px',
              background: 'linear-gradient(135deg,#032655,#0FB9B1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
              boxShadow: '0 8px 24px rgba(15,185,177,0.35)',
            }}>
              <svg width="26" height="26" fill="none" stroke="#fff" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <h1 style={{ fontFamily: 'var(--font-ui)', fontSize: '1.5rem', fontWeight: 800, color: '#032655', margin: '0 0 6px', letterSpacing: '-0.03em' }}>
              Admin Portal
            </h1>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', color: '#96AFCA', margin: 0 }}>
              AlphaNom internal access only
            </p>
          </div>

          <form action={action}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-ui)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.04em', color: '#3D5A7A', marginBottom: '6px' }}>
                  USERNAME
                </label>
                <input
                  name="username" type="text" autoComplete="username" required
                  placeholder="Enter admin username"
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1.5px solid #D0DBE8', fontFamily: 'var(--font-ui)', fontSize: '0.875rem', color: '#032655', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontFamily: 'var(--font-ui)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.04em', color: '#3D5A7A', marginBottom: '6px' }}>
                  PASSWORD
                </label>
                <input
                  name="password" type="password" autoComplete="current-password" required
                  placeholder="Enter admin password"
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1.5px solid #D0DBE8', fontFamily: 'var(--font-ui)', fontSize: '0.875rem', color: '#032655', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              {state?.error && (
                <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '10px', padding: '10px 14px' }}>
                  <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', color: '#DC2626', margin: 0 }}>{state.error}</p>
                </div>
              )}

              <button
                type="submit" disabled={pending}
                style={{
                  width: '100%', padding: '13px', borderRadius: '10px', border: 'none',
                  background: pending ? '#96AFCA' : '#032655',
                  color: '#fff', fontFamily: 'var(--font-ui)', fontSize: '0.875rem',
                  fontWeight: 700, cursor: pending ? 'not-allowed' : 'pointer',
                  marginTop: '4px', letterSpacing: '0.02em',
                }}
              >
                {pending ? 'Signing in…' : 'Sign In'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}