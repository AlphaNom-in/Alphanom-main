'use client'

import { useState, useTransition } from 'react'
import { sendBulkNotification }    from '@/lib/admin/sendBulkNotification'

const inp: React.CSSProperties = {
  width: '100%', padding: '10px 14px', borderRadius: '9px',
  border: '1.5px solid #D0DBE8', fontFamily: 'var(--font-ui)',
  fontSize: '0.875rem', color: '#032655', background: '#fff',
  outline: 'none', boxSizing: 'border-box',
}
const lbl: React.CSSProperties = {
  display: 'block', fontFamily: 'var(--font-ui)', fontSize: '0.7rem',
  fontWeight: 700, letterSpacing: '0.04em', color: '#3D5A7A', marginBottom: '6px',
}

type ChipGroupProps = {
  options: { value: string; label: string }[]
  value: string
  onChange: (v: string) => void
}
function ChipGroup({ options, value, onChange }: ChipGroupProps) {
  return (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      {options.map(o => (
        <button
          key={o.value} type="button"
          onClick={() => onChange(o.value)}
          style={{
            padding: '8px 18px', borderRadius: '99px', cursor: 'pointer',
            fontFamily: 'var(--font-ui)', fontSize: '0.78rem', fontWeight: 600,
            border: `1.5px solid ${value === o.value ? '#032655' : '#D0DBE8'}`,
            background: value === o.value ? '#032655' : '#fff',
            color: value === o.value ? '#fff' : '#5A7A9F',
            transition: 'all 0.15s',
          }}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

export default function AdminNotificationsPage() {
  const [target,  setTarget]  = useState('recruiters')
  const [channel, setChannel] = useState('both')
  const [title,   setTitle]   = useState('')
  const [body,    setBody]    = useState('')
  const [link,    setLink]    = useState('')
  const [result,  setResult]  = useState<{ inAppSent: number; emailSent: number } | null>(null)
  const [errMsg,  setErrMsg]  = useState('')
  const [pending, startTransition] = useTransition()

  function handleSend(e: React.FormEvent) {
    e.preventDefault()
    setResult(null); setErrMsg('')
    const fd = new FormData()
    fd.set('target', target)
    fd.set('channel', channel)
    fd.set('title', title)
    fd.set('body', body)
    fd.set('link', link)
    startTransition(async () => {
      try {
        const res = await sendBulkNotification(fd)
        if (res.error) { setErrMsg(res.error); return }
        setResult(res)
        setTitle(''); setBody(''); setLink('')
      } catch (err: any) {
        setErrMsg(err.message ?? 'Failed to send')
      }
    })
  }

  const targetLabel  = { recruiters: 'All Recruiters', employers: 'All Employers', both: 'Recruiters + Employers' }[target]
  const channelLabel = { inapp: 'In-App only', email: 'Email only', both: 'In-App + Email' }[channel]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '680px' }}>
      <div>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.62rem', fontWeight: 700, color: '#0FB9B1', letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0 0 4px' }}>Communications</p>
        <h1 style={{ fontFamily: 'var(--font-ui)', fontSize: '1.5rem', fontWeight: 800, color: '#0F1C2E', letterSpacing: '-0.03em', margin: '0 0 4px' }}>Broadcast Notification</h1>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: '#96AFCA', margin: 0 }}>Send a message to recruiters, employers, or both via in-app and/or email</p>
      </div>

      {/* Success */}
      {result && (
        <div style={{ background: '#F0FBF9', border: '1px solid rgba(15,185,177,0.3)', borderRadius: '12px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#D8F0EB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="18" height="18" fill="none" stroke="#0A9E97" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
          </div>
          <div>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.875rem', fontWeight: 700, color: '#0A9E97', margin: '0 0 2px' }}>Notification sent successfully!</p>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: '#5A7A9F', margin: 0 }}>
              {result.inAppSent > 0 && `${result.inAppSent} in-app`}
              {result.inAppSent > 0 && result.emailSent > 0 && ' · '}
              {result.emailSent > 0 && `${result.emailSent} emails`} delivered
            </p>
          </div>
        </div>
      )}

      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #D0DBE8', overflow: 'hidden' }}>
        <div style={{ padding: '16px 22px', borderBottom: '1px solid #EEF3F8' }}>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.875rem', fontWeight: 700, color: '#032655', margin: 0 }}>Compose Message</p>
        </div>
        <form onSubmit={handleSend}>
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '22px' }}>

            {/* Target */}
            <div>
              <label style={lbl}>SEND TO</label>
              <ChipGroup
                options={[
                  { value: 'recruiters', label: 'All Recruiters' },
                  { value: 'employers',  label: 'All Employers' },
                  { value: 'both',       label: 'Both' },
                ]}
                value={target} onChange={setTarget}
              />
            </div>

            {/* Channel */}
            <div>
              <label style={lbl}>CHANNEL</label>
              <ChipGroup
                options={[
                  { value: 'inapp', label: 'In-App Only' },
                  { value: 'email', label: 'Email Only' },
                  { value: 'both',  label: 'In-App + Email' },
                ]}
                value={channel} onChange={setChannel}
              />
            </div>

            <div style={{ height: '1px', background: '#EEF3F8' }} />

            {/* Title */}
            <div>
              <label style={lbl}>TITLE / SUBJECT</label>
              <input
                style={inp} required
                placeholder="e.g. Important Update from AlphaNom"
                value={title} onChange={e => setTitle(e.target.value)}
              />
            </div>

            {/* Body */}
            <div>
              <label style={lbl}>MESSAGE</label>
              <textarea
                rows={6} required
                placeholder="Write your message here…"
                value={body} onChange={e => setBody(e.target.value)}
                style={{ ...inp, resize: 'vertical', lineHeight: 1.7, minHeight: '120px' }}
              />
            </div>

            {/* Link (optional) */}
            <div>
              <label style={lbl}>LINK <span style={{ fontWeight: 400, color: '#96AFCA', fontSize: '0.65rem' }}>(optional — in-app notification only)</span></label>
              <input
                style={inp}
                placeholder="e.g. /recruiter/dashboard/all-jobs"
                value={link} onChange={e => setLink(e.target.value)}
              />
            </div>

            {errMsg && (
              <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '10px 14px' }}>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', color: '#DC2626', margin: 0 }}>{errMsg}</p>
              </div>
            )}

            {/* Preview + Send */}
            <div style={{ background: '#F8FAFC', borderRadius: '10px', padding: '14px 18px', border: '1px solid #EEF3F8' }}>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', fontWeight: 700, color: '#96AFCA', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Preview</p>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', color: '#5A7A9F', margin: 0, lineHeight: 1.5 }}>
                Sending to <strong style={{ color: '#032655' }}>{targetLabel}</strong> via <strong style={{ color: '#032655' }}>{channelLabel}</strong>
                {title && <> — "<em>{title.slice(0, 60)}{title.length > 60 ? '…' : ''}</em>"</>}
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="submit" disabled={pending || !title.trim() || !body.trim()}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '11px 32px', borderRadius: '10px', border: 'none',
                  background: pending || !title.trim() || !body.trim() ? '#96AFCA' : '#032655',
                  color: '#fff', fontFamily: 'var(--font-ui)', fontSize: '0.875rem', fontWeight: 700,
                  cursor: pending || !title.trim() || !body.trim() ? 'not-allowed' : 'pointer',
                }}
              >
                {pending ? (
                  <><div style={{ width: '14px', height: '14px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.35)', borderTopColor: '#fff', animation: '_spin 0.7s linear infinite' }} />Sending…</>
                ) : (
                  <><svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>Send Notification</>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
      <style>{`@keyframes _spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}