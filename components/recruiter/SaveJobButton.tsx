'use client'

import { useTransition, useState } from 'react'
import { saveJob } from '@/lib/recruiter/saveJob'

export default function SaveJobButton({ jobId, initialSaved = false }: { jobId: string; initialSaved?: boolean }) {
  const [pending, startTransition] = useTransition()
  const [saved, setSaved] = useState(initialSaved)
  const [error, setError] = useState('')

  function handleSave() {
    if (saved) return
    startTransition(async () => {
      try {
        await saveJob(jobId)
        setSaved(true)
        setError('')
      } catch (err: any) {
        setError(err?.message || 'Failed to save')
        setTimeout(() => setError(''), 3000)
      }
    })
  }

  if (saved) {
    return (
      <button
        disabled
        style={{
          padding: '10px 20px',
          borderRadius: '10px',
          fontWeight: 600,
          fontSize: '14px',
          cursor: 'default',
          whiteSpace: 'nowrap',
          border: '1.5px solid #0A9E97',
          background: '#D8F0EB',
          color: '#0A9E97',
        }}
      >
        ✓ Saved
      </button>
    )
  }

  return (
    <>
      <button
        onClick={handleSave}
        disabled={pending}
        style={{
          padding: '10px 20px',
          borderRadius: '10px',
          fontWeight: 600,
          fontSize: '14px',
          cursor: pending ? 'default' : 'pointer',
          whiteSpace: 'nowrap',
          transition: 'all 0.2s',
          border: error ? '1.5px solid #E53E3E' : '1.5px solid #032655',
          background: error ? '#FFF5F5' : '#fff',
          color: error ? '#E53E3E' : '#032655',
        }}
      >
        {pending ? 'Saving…' : error ? error : 'Save Job'}
      </button>
    </>
  )
}
