'use client'

import { useState } from 'react'
import SubmitCandidateForm from './SubmitCandidateForm'

const MAX_SLOTS = 7

function SlotDots({ used }: { used: number }) {
  return (
    <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
      {Array.from({ length: MAX_SLOTS }).map((_, i) => (
        <div
          key={i}
          style={{
            width: '10px', height: '10px', borderRadius: '50%',
            background: i < used ? '#032655' : 'rgba(255,255,255,0.25)',
            border: i < used ? 'none' : '1.5px solid rgba(255,255,255,0.4)',
            transition: 'background 0.2s',
          }}
        />
      ))}
    </div>
  )
}

export default function SlotGateWrapper({
  jobId,
  jobTitle,
  usedSlots,
}: {
  jobId: string
  jobTitle: string
  usedSlots: number
}) {
  const remaining = MAX_SLOTS - usedSlots
  const [acknowledged, setAcknowledged] = useState(usedSlots > 0)

  // ── First-time gate ───────────────────────────────────────────────────────
  if (!acknowledged) {
    return (
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '16px 0', minHeight: '60vh' }}>
        <div style={{ width: '100%', maxWidth: '480px' }}>

          {/* Card */}
          <div style={{ background: '#032655', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 12px 40px rgba(3,38,85,0.28)' }}>
            <div style={{ height: '4px', background: 'linear-gradient(90deg, #0FB9B1, #15C7C0)' }} />

            <div style={{ padding: '36px 32px 32px' }}>
              {/* Icon */}
              <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(15,185,177,0.15)', border: '1.5px solid rgba(15,185,177,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <svg width="26" height="26" fill="none" stroke="#0FB9B1" strokeWidth={1.8} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.25 9.71 2 12 2c2.291 0 4.545.25 6.75.721v1.515M19.75 4.236c.982.143 1.954.317 2.916.52a6.003 6.003 0 01-5.395 5.492M19.75 4.236V4.5a9.014 9.014 0 01-2.48 5.228m2.48-5.228V2.721" />
                </svg>
              </div>

              <h2 style={{ fontFamily: 'var(--font-ui)', fontSize: '1.35rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', margin: '0 0 8px' }}>
                7 Submission Slots
              </h2>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', margin: '0 0 24px', lineHeight: 1.65 }}>
                For <strong style={{ color: 'rgba(255,255,255,0.85)' }}>{jobTitle}</strong>
              </p>

              {/* Slot dots */}
              <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '12px', padding: '16px 20px', marginBottom: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.6rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center', margin: '0 0 12px' }}>
                  Your submission slots
                </p>
                <SlotDots used={0} />
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)', textAlign: 'center', margin: '10px 0 0' }}>
                  7 of 7 slots available
                </p>
              </div>

              {/* Rules */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
                {[
                  { icon: '🎯', text: 'You can submit a maximum of 7 candidate profiles for this role — across all time.' },
                  { icon: '💡', text: 'Quality over quantity. Recruiters who submit relevant candidates win more placements.' },
                  { icon: '🔒', text: 'Slots are permanent. Withdrawn or rejected candidates still count against your 7.' },
                ].map(r => (
                  <div key={r.icon} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '16px', flexShrink: 0, lineHeight: 1.4 }}>{r.icon}</span>
                    <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: 'rgba(255,255,255,0.65)', margin: 0, lineHeight: 1.6 }}>{r.text}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setAcknowledged(true)}
                style={{
                  width: '100%', padding: '14px', borderRadius: '12px', border: 'none',
                  background: 'linear-gradient(135deg, #0FB9B1, #0A9E97)',
                  color: '#fff', fontFamily: 'var(--font-ui)', fontSize: '0.9rem',
                  fontWeight: 800, cursor: 'pointer', letterSpacing: '-0.01em',
                  boxShadow: '0 4px 20px rgba(15,185,177,0.35)',
                }}
              >
                I understand — Start Submitting →
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Slots exhausted (should be blocked at page level too, but just in case) ─
  if (remaining <= 0) {
    return (
      <div style={{ maxWidth: '440px' }}>
        <div style={{ background: '#fff', borderRadius: '16px', border: '1.5px solid #FCA5A5', padding: '32px', textAlign: 'center' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: '#FFF5F5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <svg width="24" height="24" fill="none" stroke="#DC2626" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
            </svg>
          </div>
          <h3 style={{ fontFamily: 'var(--font-ui)', fontSize: '1rem', fontWeight: 800, color: '#032655', margin: '0 0 8px' }}>All 7 Slots Used</h3>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', color: '#5A7A9F', margin: 0, lineHeight: 1.65 }}>
            You have used all submission slots for this role. No further candidates can be submitted.
          </p>
        </div>
      </div>
    )
  }

  // ── Normal form with optional warning banner ───────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%' }}>

      {/* Slot meter bar */}
      <div style={{ background: '#fff', borderRadius: '12px', border: `1.5px solid ${remaining <= 2 ? '#FCA5A5' : '#D0DBE8'}`, padding: '12px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            {remaining <= 2 && (
              <svg width="14" height="14" fill="none" stroke="#DC2626" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
              </svg>
            )}
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 700, color: remaining <= 2 ? '#DC2626' : '#032655' }}>
              {remaining <= 2
                ? `Only ${remaining} slot${remaining === 1 ? '' : 's'} remaining!`
                : `Submission slots for this role`}
            </span>
          </div>
          <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 800, color: remaining <= 2 ? '#DC2626' : '#0A9E97' }}>
            {usedSlots} / {MAX_SLOTS} used
          </span>
        </div>
        <div style={{ display: 'flex', gap: '5px' }}>
          {Array.from({ length: MAX_SLOTS }).map((_, i) => (
            <div
              key={i}
              style={{
                flex: 1, height: '6px', borderRadius: '3px',
                background: i < usedSlots
                  ? (usedSlots >= 5 ? '#DC2626' : '#032655')
                  : '#EEF3F8',
              }}
            />
          ))}
        </div>
        {remaining <= 2 && (
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', color: '#DC2626', margin: '8px 0 0', lineHeight: 1.5 }}>
            Choose wisely — slots are permanent and don't reset even if a candidate withdraws.
          </p>
        )}
      </div>

      <SubmitCandidateForm jobId={jobId} jobTitle={jobTitle} />
    </div>
  )
}
