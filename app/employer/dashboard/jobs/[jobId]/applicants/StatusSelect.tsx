'use client'

import { useState, useTransition } from 'react'
import { updateCandidateStatus } from '@/lib/employer/updateCandidateStatus'
import { submitFeedback }         from '@/lib/employer/submitFeedback'

const OPTIONS = [
  { value: 'in_pipeline',     label: 'In Pipeline',     color: '#5A7A9F', bg: '#EEF3F8' },
  { value: 'in_review',       label: 'In Review',       color: '#7C3AED', bg: '#EDE9FE' },
  { value: 'shortlisted',     label: 'Shortlisted',     color: '#0A9E97', bg: '#D8F0EB' },
  { value: 'saved_for_later', label: 'Saved for Later', color: '#B7791F', bg: '#FFF8E7' },
  { value: 'hired',           label: 'Hired ✓',         color: '#276749', bg: '#C6F6D5' },
  { value: 'rejected',        label: 'Rejected',        color: '#E53E3E', bg: '#FFF5F5' },
]

export default function StatusSelect({
  submissionId,
  jobId,
  currentStatus,
  candidateName,
}: {
  submissionId:  string
  jobId:         string
  currentStatus: string
  candidateName: string
}) {
  const [statusPending, startTransition] = useTransition()
  const [displayStatus, setDisplayStatus] = useState(currentStatus)
  const [modalOpen,     setModalOpen]     = useState(false)
  const [newStatus,     setNewStatus]     = useState('')
  const [feedback,      setFeedback]      = useState('')
  const [fbPending,     setFbPending]     = useState(false)
  const [fbError,       setFbError]       = useState('')

  const opt    = OPTIONS.find(o => o.value === displayStatus) ?? OPTIONS[0]
  const newOpt = OPTIONS.find(o => o.value === newStatus)

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value
    if (next === displayStatus) return
    startTransition(async () => {
      await updateCandidateStatus(submissionId, next, jobId)
      setDisplayStatus(next)
      setNewStatus(next)
      setFeedback('')
      setModalOpen(true)
    })
  }

  async function handleSubmitFeedback() {
    const text = feedback.trim()
    if (!text || fbPending) return
    setFbPending(true)
    setFbError('')
    try {
      await submitFeedback(submissionId, jobId, newStatus, text)
      closeModal()
    } catch (err: any) {
      setFbError(err.message ?? 'Something went wrong. Please try again.')
    } finally {
      setFbPending(false)
    }
  }

  function closeModal() {
    setModalOpen(false)
    setNewStatus('')
    setFeedback('')
    setFbError('')
  }

  return (
    <>
      <select
        value={displayStatus}
        onChange={handleChange}
        disabled={statusPending}
        style={{
          padding: '6px 10px',
          borderRadius: '8px',
          border: `1.5px solid ${opt.color}`,
          background: opt.bg,
          color: opt.color,
          fontFamily: 'var(--font-ui)',
          fontSize: '0.72rem',
          fontWeight: 700,
          cursor: statusPending ? 'not-allowed' : 'pointer',
          opacity: statusPending ? 0.6 : 1,
          outline: 'none',
        }}
      >
        {OPTIONS.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>

      {/* ── Feedback modal ──────────────────────────────────────── */}
      {modalOpen && newOpt && (
        <div
          onClick={e => { if (e.target === e.currentTarget) closeModal() }}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(3,38,85,0.45)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '16px',
          }}
        >
          <div style={{
            background: '#fff', borderRadius: '20px',
            width: '100%', maxWidth: '460px',
            boxShadow: '0 24px 80px rgba(3,38,85,0.24)',
            overflow: 'hidden',
          }}>
            {/* Header */}
            <div style={{ padding: '24px 28px 18px', borderBottom: '1px solid #EEF3F8' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <h3 style={{ fontFamily: 'var(--font-ui)', fontSize: '1.1rem', fontWeight: 800, color: '#032655', margin: 0, letterSpacing: '-0.02em' }}>
                  Leave Feedback
                </h3>
                <button
                  onClick={closeModal}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#96AFCA', fontSize: '22px', lineHeight: 1, padding: '2px 6px', borderRadius: '6px' }}
                >
                  ×
                </button>
              </div>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', color: '#5A7A9F', margin: '0 0 12px', lineHeight: 1.5 }}>
                <strong style={{ color: '#032655' }}>{candidateName}</strong> has been moved to
              </p>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '5px 14px', borderRadius: '99px',
                background: newOpt.bg,
                border: `1px solid ${newOpt.color}40`,
              }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: newOpt.color, flexShrink: 0, display: 'block' }} />
                <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 700, color: newOpt.color }}>
                  {newOpt.label}
                </span>
              </span>
            </div>

            {/* Body */}
            <div style={{ padding: '20px 28px 26px' }}>
              <label style={{
                display: 'block', fontFamily: 'var(--font-ui)', fontSize: '0.7rem',
                fontWeight: 700, letterSpacing: '0.04em', color: '#3D5A7A', marginBottom: '8px',
              }}>
                Your Feedback{' '}
                <span style={{ fontWeight: 400, color: '#96AFCA', fontSize: '0.65rem' }}>(optional)</span>
              </label>
              <textarea
                rows={4}
                placeholder={`Why was ${candidateName} moved to ${newOpt.label}? This helps the recruiter improve future submissions.`}
                value={feedback}
                onChange={e => setFeedback(e.target.value)}
                autoFocus
                style={{
                  width: '100%', padding: '11px 14px', borderRadius: '10px',
                  border: '1.5px solid #D0DBE8', fontFamily: 'var(--font-ui)',
                  fontSize: '0.875rem', color: '#032655', background: '#fff',
                  outline: 'none', boxSizing: 'border-box',
                  resize: 'vertical', lineHeight: 1.6, minHeight: '96px',
                }}
              />

              {fbError && (
                <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '8px 12px', marginTop: '12px' }}>
                  <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', color: '#DC2626', margin: 0 }}>{fbError}</p>
                </div>
              )}

              <div style={{ display: 'flex', gap: '8px', marginTop: '16px', justifyContent: 'flex-end' }}>
                <button
                  onClick={closeModal}
                  style={{
                    padding: '9px 22px', borderRadius: '9px',
                    border: '1.5px solid #D0DBE8', background: '#fff',
                    color: '#5A7A9F', fontFamily: 'var(--font-ui)',
                    fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
                  }}
                >
                  Skip for now
                </button>
                <button
                  onClick={handleSubmitFeedback}
                  disabled={fbPending || !feedback.trim()}
                  style={{
                    padding: '9px 22px', borderRadius: '9px', border: 'none',
                    background: feedback.trim() ? '#0FB9B1' : '#D0DBE8',
                    color: feedback.trim() ? '#fff' : '#96AFCA',
                    fontFamily: 'var(--font-ui)', fontSize: '0.8rem', fontWeight: 700,
                    cursor: feedback.trim() && !fbPending ? 'pointer' : 'not-allowed',
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    transition: 'background 0.15s',
                  }}
                >
                  {fbPending
                    ? <><Spinner />Sending…</>
                    : 'Submit Feedback'}
                </button>
              </div>

              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.68rem', color: '#B0C4D8', margin: '14px 0 0', textAlign: 'center', lineHeight: 1.5 }}>
                Status already updated · Feedback is optional and visible only to the recruiter
              </p>
            </div>
          </div>
          <style>{`@keyframes _fbspin { to { transform: rotate(360deg) } }`}</style>
        </div>
      )}
    </>
  )
}

function Spinner() {
  return (
    <div style={{
      width: '12px', height: '12px', borderRadius: '50%',
      border: '2px solid rgba(255,255,255,0.3)',
      borderTopColor: '#fff',
      animation: '_fbspin 0.7s linear infinite',
      flexShrink: 0,
    }} />
  )
}