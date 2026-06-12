'use client'

import { useTransition, useState } from 'react'
import { unlockProfile } from '@/lib/employer/unlockProfile'

export default function UnlockButton({ submissionId }: { submissionId: string }) {
  const [pending, startTransition] = useTransition()
  const [done, setDone] = useState(false)

  function handleClick() {
    startTransition(async () => {
      await unlockProfile(submissionId)
      setDone(true)
    })
  }

  if (done) return null

  return (
    <button
      onClick={handleClick}
      disabled={pending}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        padding: '6px 14px', borderRadius: '8px', border: 'none',
        background: pending ? '#96AFCA' : 'linear-gradient(135deg, #032655, #0FB9B1)',
        color: '#fff', fontFamily: 'var(--font-ui)', fontSize: '0.7rem', fontWeight: 700,
        cursor: pending ? 'not-allowed' : 'pointer',
        boxShadow: pending ? 'none' : '0 2px 8px rgba(3,38,85,0.2)',
      }}
    >
      {pending ? (
        <>
          <div style={{ width: '11px', height: '11px', border: '2px solid rgba(255,255,255,0.35)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
          Unlocking…
        </>
      ) : (
        <>
          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
          Unlock Full Profile
        </>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </button>
  )
}
