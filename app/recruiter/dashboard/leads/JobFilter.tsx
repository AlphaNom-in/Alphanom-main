'use client'

import { useRouter, useSearchParams } from 'next/navigation'

export default function JobFilter({ jobs, currentJob }: { jobs: { id: string; title: string }[]; currentJob?: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(searchParams.toString())
    if (e.target.value) params.set('job', e.target.value)
    else params.delete('job')
    router.push(`/recruiter/dashboard/leads?${params.toString()}`)
  }

  return (
    <select
      value={currentJob ?? ''}
      onChange={handleChange}
      style={{ padding: '6px 12px', borderRadius: '8px', border: '1.5px solid #D0DBE8', background: '#fff', fontFamily: 'var(--font-ui)', fontSize: '0.72rem', color: '#032655', cursor: 'pointer' }}
    >
      <option value="">All Jobs</option>
      {jobs.map(j => (
        <option key={j.id} value={j.id}>{j.title}</option>
      ))}
    </select>
  )
}
