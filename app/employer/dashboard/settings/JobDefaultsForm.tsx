'use client'

import { useState, useTransition } from 'react'
import { updateJobDefaults } from '@/lib/employer/updateJobDefaults'

const WORK_MODELS = ['On-site', 'Hybrid', 'WFH', 'Flexible']
const NOTICE_OPTIONS = ['Immediate', '15 days', '30 days', '45 days', '60 days', '90 days']

const inp: React.CSSProperties = {
  width: '100%', padding: '10px 13px', borderRadius: '9px',
  border: '1.5px solid #D0DBE8', fontFamily: 'var(--font-ui)',
  fontSize: '0.875rem', color: '#032655', background: '#fff',
  outline: 'none', boxSizing: 'border-box',
}
const lbl: React.CSSProperties = {
  display: 'block', fontFamily: 'var(--font-ui)', fontSize: '0.7rem',
  fontWeight: 700, letterSpacing: '0.04em', color: '#3D5A7A', marginBottom: '6px',
}

export default function JobDefaultsForm({
  defaultWorkModel, defaultNoticePeriod,
}: {
  defaultWorkModel?:    string | null
  defaultNoticePeriod?: string | null
}) {
  const [workModel,     setWorkModel]     = useState(defaultWorkModel ?? '')
  const [noticePeriod,  setNoticePeriod]  = useState(defaultNoticePeriod ?? '')
  const [saved,   setSaved]   = useState(false)
  const [cleared, setCleared] = useState(false)
  const [errMsg,  setErrMsg]  = useState('')
  const [pending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaved(false); setCleared(false); setErrMsg('')
    const fd = new FormData(e.currentTarget)
    startTransition(async () => {
      try {
        await updateJobDefaults(fd)
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      } catch (err: any) {
        setErrMsg(err.message ?? 'Failed to save')
      }
    })
  }

  function handleClear() {
    setSaved(false); setCleared(false); setErrMsg('')
    setWorkModel(''); setNoticePeriod('')
    const fd = new FormData()
    fd.set('default_work_model', '')
    fd.set('default_notice_period', '')
    startTransition(async () => {
      try {
        await updateJobDefaults(fd)
        setCleared(true)
        setTimeout(() => setCleared(false), 3000)
      } catch (err: any) {
        setErrMsg(err.message ?? 'Failed to clear')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

        {/* Work Model */}
        <div>
          <label style={lbl}>Default Work Model</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '8px' }}>
            {WORK_MODELS.map(m => (
              <button
                key={m} type="button"
                onClick={() => setWorkModel(workModel === m ? '' : m)}
                style={{
                  padding: '9px 6px', borderRadius: '8px', fontFamily: 'var(--font-ui)',
                  fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                  border: `1.5px solid ${workModel === m ? '#0FB9B1' : '#D0DBE8'}`,
                  background: workModel === m ? '#D8F0EB' : '#fff',
                  color: workModel === m ? '#0A9E97' : '#5A7A9F',
                }}
              >{m}</button>
            ))}
          </div>
          <input type="hidden" name="default_work_model" value={workModel} />
        </div>

        {/* Notice Period */}
        <div>
          <label style={lbl}>Default Notice Period Preference</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px', marginBottom: '10px' }}>
            {NOTICE_OPTIONS.map(n => (
              <button
                key={n} type="button"
                onClick={() => setNoticePeriod(noticePeriod === n ? '' : n)}
                style={{
                  padding: '9px 6px', borderRadius: '8px', fontFamily: 'var(--font-ui)',
                  fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                  border: `1.5px solid ${noticePeriod === n ? '#0FB9B1' : '#D0DBE8'}`,
                  background: noticePeriod === n ? '#D8F0EB' : '#fff',
                  color: noticePeriod === n ? '#0A9E97' : '#5A7A9F',
                }}
              >{n}</button>
            ))}
          </div>
          <input
            style={inp} placeholder="Or type custom e.g. 2 months"
            value={noticePeriod} name="default_notice_period"
            onChange={e => setNoticePeriod(e.target.value)}
          />
        </div>

        {/* Feedback */}
        {errMsg && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '8px 12px' }}>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: '#DC2626', margin: 0 }}>{errMsg}</p>
          </div>
        )}
        {saved && (
          <div style={{ background: '#F0FBF9', border: '1px solid rgba(15,185,177,0.3)', borderRadius: '8px', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <svg width="13" height="13" fill="none" stroke="#0A9E97" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: '#0A9E97', margin: 0 }}>Defaults saved successfully.</p>
          </div>
        )}
        {cleared && (
          <div style={{ background: '#F5F8FC', border: '1px solid #D0DBE8', borderRadius: '8px', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <svg width="13" height="13" fill="none" stroke="#5A7A9F" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: '#5A7A9F', margin: 0 }}>Defaults cleared.</p>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button
            type="button" disabled={pending} onClick={handleClear}
            style={{
              padding: '10px 20px', borderRadius: '9px', border: '1.5px solid #D0DBE8',
              background: '#fff', color: '#5A7A9F',
              fontFamily: 'var(--font-ui)', fontSize: '0.82rem', fontWeight: 600,
              cursor: pending ? 'not-allowed' : 'pointer', opacity: pending ? 0.6 : 1,
            }}
          >
            Clear Defaults
          </button>
          <button
            type="submit" disabled={pending}
            style={{
              padding: '10px 28px', borderRadius: '9px', border: 'none',
              background: pending ? '#96AFCA' : '#032655', color: '#fff',
              fontFamily: 'var(--font-ui)', fontSize: '0.82rem', fontWeight: 700,
              cursor: pending ? 'not-allowed' : 'pointer',
            }}
          >
            {pending ? 'Saving…' : 'Save Defaults'}
          </button>
        </div>
      </div>
    </form>
  )
}