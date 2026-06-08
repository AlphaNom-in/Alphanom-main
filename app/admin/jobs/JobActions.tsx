'use client'

import { useState, useTransition } from 'react'
import { setJobStatus, deleteJob } from '@/lib/admin/actions'

const btn = (
  bg: string, color: string,
  extra?: React.CSSProperties,
): React.CSSProperties => ({
  display: 'inline-flex', alignItems: 'center', gap: '5px',
  padding: '5px 10px', borderRadius: '7px', border: 'none',
  cursor: 'pointer', fontFamily: 'var(--font-ui)', fontSize: '0.7rem',
  fontWeight: 700, background: bg, color, whiteSpace: 'nowrap',
  transition: 'filter 0.1s',
  ...extra,
})

export default function JobActions({ id, status }: { id: string; status: string }) {
  const [pending, start] = useTransition()
  const [confirm, setConfirm] = useState(false)

  const isActive = status === 'active'
  const isClosed = status === 'closed'

  if (confirm) {
    return (
      <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.68rem', color: '#C53030', fontWeight: 600, marginRight: '2px' }}>Delete?</span>
        <button
          className="an-action-btn"
          onClick={() => start(async () => { await deleteJob(id); setConfirm(false) })}
          disabled={pending}
          style={btn('#FEE2E2', '#C53030', { opacity: pending ? 0.6 : 1 })}
        >
          {pending
            ? <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" style={{ animation: 'spin 0.8s linear infinite' }}><path d="M12 2a10 10 0 110 20A10 10 0 0112 2zm0 2a8 8 0 100 16A8 8 0 0012 4z" opacity=".3"/><path d="M12 2a10 10 0 0110 10h-2A8 8 0 0012 4V2z"/></svg>
            : 'Yes, delete'}
        </button>
        <button
          className="an-action-btn"
          onClick={() => setConfirm(false)}
          style={btn('#F4F6FB', '#6B7E93', { border: '1px solid #E4EAF1' })}
        >
          Cancel
        </button>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>

      {/* Close / Reopen */}
      <button
        className="an-action-btn"
        disabled={pending}
        title={isActive ? 'Close job' : 'Reopen job'}
        onClick={() => start(async () => { await setJobStatus(id, isActive ? 'closed' : 'active') })}
        style={btn(
          isActive ? '#FFF8E7' : '#F0FBF9',
          isActive ? '#B7791F' : '#0A9E97',
          { opacity: pending ? 0.5 : 1, cursor: pending ? 'not-allowed' : 'pointer' },
        )}
      >
        {isActive
          ? <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          : <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"/></svg>}
        {isActive ? 'Close' : 'Reopen'}
      </button>

      {/* Pause / Unpause */}
      {!isClosed && (
        <button
          className="an-action-btn"
          disabled={pending}
          title={status === 'paused' ? 'Resume job' : 'Pause job'}
          onClick={() => start(async () => { await setJobStatus(id, status === 'paused' ? 'active' : 'paused') })}
          style={btn('#EFF6FF', '#3B5998', { opacity: pending ? 0.5 : 1, cursor: pending ? 'not-allowed' : 'pointer' })}
        >
          {status === 'paused'
            ? <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z"/></svg>
            : <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5"/></svg>}
          {status === 'paused' ? 'Resume' : 'Pause'}
        </button>
      )}

      {/* Delete */}
      <button
        className="an-action-btn"
        title="Delete job"
        onClick={() => setConfirm(true)}
        style={btn('#FFF5F5', '#C53030')}
      >
        <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/>
        </svg>
        Delete
      </button>
    </div>
  )
}