'use client'

import { useState } from 'react'
import { resendConsentEmail } from '@/lib/recruiter/submitCandidate'

export default function ResendConsentButton({ submissionId }: { submissionId: string }) {
  const [state, setState] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle')

  async function handleResend(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    setState('loading')
    try {
      await resendConsentEmail(submissionId)
      setState('sent')
      setTimeout(() => setState('idle'), 3000)
    } catch {
      setState('error')
      setTimeout(() => setState('idle'), 3000)
    }
  }

  if (state === 'sent') {
    return (
      <span style={{ fontFamily: 'var(--font-ui)', fontSize: '11px', fontWeight: 700, color: '#0A9E97', padding: '4px 10px', borderRadius: '20px', background: '#D8F0EB', whiteSpace: 'nowrap' }}>
        Sent ✓
      </span>
    )
  }

  if (state === 'error') {
    return (
      <span style={{ fontFamily: 'var(--font-ui)', fontSize: '11px', fontWeight: 700, color: '#E53E3E', padding: '4px 10px', borderRadius: '20px', background: '#FFF5F5', whiteSpace: 'nowrap' }}>
        Failed
      </span>
    )
  }

  return (
    <button
      onClick={handleResend}
      disabled={state === 'loading'}
      style={{
        fontFamily: 'var(--font-ui)', fontSize: '11px', fontWeight: 700,
        padding: '4px 10px', borderRadius: '20px',
        border: '1.5px solid #D0DBE8', background: '#fff', color: '#5A7A9F',
        cursor: state === 'loading' ? 'default' : 'pointer',
        whiteSpace: 'nowrap', flexShrink: 0,
        opacity: state === 'loading' ? 0.6 : 1,
      }}
    >
      {state === 'loading' ? 'Sending…' : 'Resend'}
    </button>
  )
}
