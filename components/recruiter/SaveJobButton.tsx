'use client'

import { useTransition, useState } from 'react'
import { saveJob } from '@/lib/recruiter/saveJob'

type Status = 'idle' | 'saved' | 'duplicate' | 'error'

export default function SaveJobButton({ jobId }: { jobId: string }) {
  const [pending, startTransition] = useTransition()
  const [status, setStatus] = useState<Status>('idle')
  const [errMsg, setErrMsg] = useState('')

  function handleSave() {
    startTransition(async () => {
      try {
        await saveJob(jobId)
        setStatus('saved')
        setTimeout(() => setStatus('idle'), 2500)
      } catch (err: any) {
        const msg: string = err?.message ?? ''
        if (msg.includes('unique') || msg.includes('duplicate') || msg.includes('already')) {
          setStatus('duplicate')
          setTimeout(() => setStatus('idle'), 2500)
        } else {
          setErrMsg(msg || 'Failed to save')
          setStatus('error')
          setTimeout(() => setStatus('idle'), 3000)
        }
      }
    })
  }

  const styles: Record<Status, React.CSSProperties> = {
    idle:      { border: '1.5px solid #032655', background: '#fff',      color: '#032655' },
    saved:     { border: '1.5px solid #0A9E97', background: '#D8F0EB',   color: '#0A9E97' },
    duplicate: { border: '1.5px solid #B7791F', background: '#FFF8E7',   color: '#B7791F' },
    error:     { border: '1.5px solid #E53E3E', background: '#FFF5F5',   color: '#E53E3E' },
  }

  const labels: Record<Status, string> = {
    idle:      pending ? 'Saving...' : 'Save Job',
    saved:     '✓ Saved',
    duplicate: 'Already Saved',
    error:     errMsg || 'Error',
  }

  return (
    <button
      onClick={handleSave}
      disabled={pending || status !== 'idle'}
      style={{
        padding: '10px 20px',
        borderRadius: '10px',
        fontWeight: 600,
        fontSize: '14px',
        cursor: pending || status !== 'idle' ? 'default' : 'pointer',
        whiteSpace: 'nowrap',
        transition: 'all 0.2s',
        ...styles[status],
      }}
    >
      {labels[status]}
    </button>
  )
}
