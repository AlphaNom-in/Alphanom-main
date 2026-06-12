'use client'

import { useState, useTransition } from 'react'
import { submitLeadAsCandidate, rejectLead } from '@/lib/recruiter/sendLeadConsent'

export function SubmitCandidateButton({
  leadId,
  status,
  candidateEmail,
}: {
  leadId: string
  status: string
  candidateEmail: string
}) {
  const [state,   setState]   = useState<'idle' | 'success' | 'error'>('idle')
  const [errMsg,  setErrMsg]  = useState<string | null>(null)
  const [pending, start]      = useTransition()

  if (status === 'consented') {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '6px 12px', borderRadius: '8px', background: '#DCFCE7', color: '#15803D', fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 700 }}>
        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>
        Consented
      </span>
    )
  }

  if (status === 'consent_sent' && state !== 'success') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', borderRadius: '10px', background: '#F0FBF9', border: '1.5px solid rgba(15,185,177,0.25)' }}>
        <svg width="14" height="14" fill="none" stroke="#0A9E97" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"/></svg>
        <div>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 700, color: '#0A9E97', margin: 0 }}>Consent email sent</p>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', color: '#5A7A9F', margin: 0 }}>Awaiting candidate confirmation</p>
        </div>
      </div>
    )
  }

  if (state === 'success') {
    return (
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '12px 16px', borderRadius: '10px', background: '#F0FBF9', border: '1.5px solid rgba(15,185,177,0.3)' }}>
        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#0FB9B1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="13" height="13" fill="none" stroke="#fff" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>
        </div>
        <div>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', fontWeight: 800, color: '#032655', margin: '0 0 2px' }}>Candidate Submitted</p>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.68rem', color: '#5A7A9F', margin: 0 }}>
            Consent email sent to <strong>{candidateEmail}</strong>
          </p>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.62rem', color: '#96AFCA', margin: '4px 0 0' }}>
            Candidate will appear in Submissions once they confirm.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-start' }}>
      <button
        disabled={pending}
        onClick={() => {
          setErrMsg(null)
          start(async () => {
            const r = await submitLeadAsCandidate(leadId)
            if (r.ok) setState('success')
            else setErrMsg(r.error ?? 'Something went wrong.')
          })
        }}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          padding: '8px 16px', borderRadius: '8px', border: 'none',
          background: pending ? '#96AFCA' : 'linear-gradient(135deg, #032655 0%, #0FB9B1 100%)',
          color: '#fff', fontFamily: 'var(--font-ui)', fontSize: '0.75rem',
          fontWeight: 700, cursor: pending ? 'not-allowed' : 'pointer',
          letterSpacing: '-0.01em',
        }}
      >
        {pending ? (
          <>
            <div style={{ width: '11px', height: '11px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
            Submitting…
          </>
        ) : (
          <>
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"/>
            </svg>
            Submit Candidate
          </>
        )}
      </button>
      {errMsg && (
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', color: '#DC2626', margin: 0, maxWidth: '260px' }}>{errMsg}</p>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}

export function RejectButton({ leadId }: { leadId: string }) {
  const [done,    setDone]    = useState(false)
  const [pending, start]      = useTransition()

  if (done) {
    return <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.68rem', color: '#CBD5E1' }}>Rejected</span>
  }

  return (
    <button
      disabled={pending}
      onClick={() => start(async () => { const r = await rejectLead(leadId); if (r.ok) setDone(true) })}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '4px',
        padding: '7px 12px', borderRadius: '8px',
        border: '1px solid #FCA5A5', background: '#FFF5F5',
        color: '#DC2626', fontFamily: 'var(--font-ui)', fontSize: '0.72rem',
        fontWeight: 600, cursor: pending ? 'not-allowed' : 'pointer',
        opacity: pending ? 0.6 : 1,
      }}
    >
      <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
      </svg>
      Reject
    </button>
  )
}
