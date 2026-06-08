'use client'

import { useTransition } from 'react'
import { setEmployerVerified } from '@/lib/admin/actions'
import Link from 'next/link'

export default function EmployerActions({ id, isVerified }: { id: string; isVerified: boolean }) {
  const [pending, start] = useTransition()

  return (
    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
      <button
        className="an-action-btn"
        disabled={pending}
        title={isVerified ? 'Revoke verification' : 'Verify employer'}
        onClick={() => start(async () => { await setEmployerVerified(id, !isVerified) })}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '5px',
          padding: '5px 11px', borderRadius: '7px', border: 'none',
          cursor: pending ? 'not-allowed' : 'pointer',
          fontFamily: 'var(--font-ui)', fontSize: '0.7rem', fontWeight: 700,
          opacity: pending ? 0.5 : 1,
          background: isVerified ? '#FFF5F5' : '#F0FBF9',
          color:      isVerified ? '#C53030' : '#0A9E97',
          whiteSpace: 'nowrap',
        }}
      >
        {pending
          ? <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 110 20A10 10 0 0112 2zm0 2a8 8 0 100 16A8 8 0 0012 4z" opacity=".3"/><path d="M12 2a10 10 0 0110 10h-2A8 8 0 0012 4V2z"/></svg>
          : isVerified
            ? <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
            : <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>}
        {pending ? 'Saving…' : isVerified ? 'Unverify' : 'Verify'}
      </button>

      <Link
        href={`/admin/employers/${id}`}
        title="View profile"
        style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: '28px', height: '28px', borderRadius: '7px',
          background: '#F4F6FB', border: '1px solid #E4EAF1',
          color: '#6B7E93', textDecoration: 'none', flexShrink: 0,
        }}
      >
        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </Link>
    </div>
  )
}