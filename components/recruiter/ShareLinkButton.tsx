'use client'

import { useState, useTransition } from 'react'
import { getShareLink } from '@/lib/recruiter/getShareLink'

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://alphanom.in'

export default function ShareLinkButton({ jobId, compact = false }: { jobId: string; compact?: boolean }) {
  const [slug,    setSlug]    = useState<string | null>(null)
  const [copied,  setCopied]  = useState(false)
  const [open,    setOpen]    = useState(false)
  const [pending, startTransition] = useTransition()

  function handleOpen() {
    setOpen(true)
    if (!slug) {
      startTransition(async () => {
        const s = await getShareLink(jobId)
        setSlug(s)
      })
    }
  }

  function handleCopy() {
    if (!slug) return
    navigator.clipboard.writeText(`${BASE}/apply/${slug}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const url = slug ? `${BASE}/apply/${slug}` : ''

  return (
    <>
      {compact ? (
        <button
          onClick={handleOpen}
          title="Share Application Link"
          style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '36px', height: '36px', borderRadius: '10px',
            border: '1.5px solid #D0DBE8', background: '#fff',
            color: '#5A7A9F', cursor: 'pointer', flexShrink: 0,
          }}
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
          </svg>
        </button>
      ) : (
        <button
          onClick={handleOpen}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '11px 20px', borderRadius: '10px',
            border: '1.5px solid #D0DBE8', background: '#fff',
            color: '#032655', fontFamily: 'var(--font-ui)', fontSize: '14px',
            fontWeight: 700, cursor: 'pointer',
          }}
        >
          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
          </svg>
          Share Application Link
        </button>
      )}

      {/* Modal overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(3,38,85,0.45)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: '#fff', borderRadius: '18px', width: '100%', maxWidth: '480px', padding: '28px', boxShadow: '0 20px 60px rgba(3,38,85,0.25)' }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-ui)', fontSize: '1.1rem', fontWeight: 800, color: '#032655', margin: '0 0 4px', letterSpacing: '-0.02em' }}>
                  Share Application Link
                </h2>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', color: '#96AFCA', margin: 0 }}>
                  Anyone with this link can apply directly. Only you see the responses.
                </p>
              </div>
              <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#96AFCA', padding: '4px' }}>
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* How it works */}
            <div style={{ background: '#F0FBF9', border: '1px solid rgba(15,185,177,0.2)', borderRadius: '10px', padding: '14px 16px', marginBottom: '20px' }}>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 700, color: '#0A9E97', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>How it works</p>
              {[
                'Share this link publicly or with candidates',
                'They fill a simple application form',
                'You review leads — only you can see them',
                'You send a consent email for profiles you approve',
                'Once confirmed, it goes to the employer',
              ].map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: i < 4 ? '6px' : 0 }}>
                  <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', fontWeight: 800, color: '#0FB9B1', background: '#D8F0EB', borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>{i + 1}</span>
                  <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', color: '#5A7A9F', margin: 0, lineHeight: 1.5 }}>{step}</p>
                </div>
              ))}
            </div>

            {/* Link box */}
            {pending ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 16px', background: '#F5F8FC', borderRadius: '10px', border: '1px solid #D0DBE8' }}>
                <div style={{ width: '14px', height: '14px', border: '2px solid #D0DBE8', borderTop: '2px solid #0FB9B1', borderRadius: '50%', animation: 'spin 0.7s linear infinite', flexShrink: 0 }} />
                <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: '#96AFCA' }}>Generating your link…</span>
              </div>
            ) : slug ? (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'stretch' }}>
                <div style={{ flex: 1, padding: '12px 14px', background: '#F5F8FC', borderRadius: '10px', border: '1px solid #D0DBE8', overflow: 'hidden' }}>
                  <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.72rem', color: '#5A7A9F', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{url}</p>
                </div>
                <button
                  onClick={handleCopy}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '0 18px',
                    borderRadius: '10px', border: 'none', cursor: 'pointer', flexShrink: 0,
                    background: copied ? '#0FB9B1' : '#032655', color: '#fff',
                    fontFamily: 'var(--font-ui)', fontSize: '0.78rem', fontWeight: 700,
                    transition: 'background 0.15s',
                  }}
                >
                  {copied ? (
                    <>
                      <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" /></svg>
                      Copy Link
                    </>
                  )}
                </button>
              </div>
            ) : null}
          </div>
        </div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </>
  )
}
