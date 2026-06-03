'use client'

import { useTransition } from 'react'
import { updateCandidateStatus } from '@/lib/employer/updateCandidateStatus'

const OPTIONS = [
  { value: 'in_pipeline',     label: 'In Pipeline',      color: '#5A7A9F', bg: '#EEF3F8' },
  { value: 'shortlisted',     label: 'Shortlisted',      color: '#0A9E97', bg: '#D8F0EB' },
  { value: 'saved_for_later', label: 'Saved for Later',  color: '#B7791F', bg: '#FFF8E7' },
  { value: 'hired',           label: 'Hired ✓',          color: '#276749', bg: '#C6F6D5' },
  { value: 'rejected',        label: 'Rejected',         color: '#E53E3E', bg: '#FFF5F5' },
]

export default function StatusSelect({
  submissionId,
  jobId,
  currentStatus,
}: {
  submissionId: string
  jobId: string
  currentStatus: string
}) {
  const [pending, startTransition] = useTransition()
  const opt = OPTIONS.find((o) => o.value === currentStatus) ?? OPTIONS[0]

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value
    startTransition(async () => {
      await updateCandidateStatus(submissionId, newStatus, jobId)
    })
  }

  return (
    <select
      value={currentStatus}
      onChange={handleChange}
      disabled={pending}
      style={{
        padding: '6px 10px',
        borderRadius: '8px',
        border: `1.5px solid ${opt.color}`,
        background: opt.bg,
        color: opt.color,
        fontFamily: 'var(--font-ui)',
        fontSize: '0.72rem',
        fontWeight: 700,
        cursor: pending ? 'not-allowed' : 'pointer',
        opacity: pending ? 0.6 : 1,
        outline: 'none',
      }}
    >
      {OPTIONS.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  )
}
