'use client'

import { useTransition } from 'react'
import { setEmployerVerified } from '@/lib/admin/actions'

export default function EmployerActions({ id, isVerified }: { id: string; isVerified: boolean }) {
  const [pending, start] = useTransition()

  return (
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
  )
}