'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function JobsError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[Jobs page error]', error)
  }, [error])

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      height: '100%', gap: '16px', padding: '2rem',
    }}>
      <div style={{
        background: '#fff', borderRadius: '16px', border: '1px solid #D0DBE8',
        padding: '2.5rem', textAlign: 'center', maxWidth: '440px', width: '100%',
        boxShadow: '0 2px 16px rgba(3,38,85,0.06)',
      }}>
        <div style={{
          width: '48px', height: '48px', borderRadius: '12px', background: '#FFF5F5',
          border: '1px solid #FEB2B2', display: 'flex', alignItems: 'center',
          justifyContent: 'center', margin: '0 auto 1rem',
        }}>
          <svg fill="none" stroke="#E53E3E" strokeWidth={1.8} viewBox="0 0 24 24" style={{ width: '22px', height: '22px' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.95rem', fontWeight: 800, color: '#032655', marginBottom: '6px' }}>
          Something went wrong
        </p>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.8rem', color: '#96AFCA', marginBottom: '1.5rem', lineHeight: 1.6 }}>
          We couldn&apos;t load your jobs. Try refreshing — if it keeps happening, contact support.
          {error.digest && (
            <span style={{ display: 'block', marginTop: '6px', fontSize: '0.7rem', color: '#C0CCDA' }}>
              Error ID: {error.digest}
            </span>
          )}
        </p>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <button
            onClick={reset}
            style={{
              padding: '9px 18px', borderRadius: '8px',
              background: '#032655', color: '#fff', border: 'none',
              fontFamily: 'var(--font-ui)', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer',
            }}
          >
            Try again
          </button>
          <Link href="/employer/dashboard" style={{
            padding: '9px 18px', borderRadius: '8px',
            background: '#EEF3F8', color: '#5A7A9F',
            border: '1px solid #D0DBE8',
            fontFamily: 'var(--font-ui)', fontSize: '0.78rem', fontWeight: 600,
            textDecoration: 'none', display: 'inline-flex', alignItems: 'center',
          }}>
            Go to Overview
          </Link>
        </div>
      </div>
    </div>
  )
}
