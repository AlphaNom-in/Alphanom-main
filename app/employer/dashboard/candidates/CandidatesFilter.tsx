'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useTransition, useState, useEffect } from 'react'

type Job = { id: string; title: string }

export default function CandidatesFilter({ jobs }: { jobs: Job[] }) {
  const router      = useRouter()
  const pathname    = usePathname()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  const [search, setSearch] = useState(searchParams.get('q') ?? '')

  // Sync if browser back/forward
  useEffect(() => {
    setSearch(searchParams.get('q') ?? '')
  }, [searchParams])

  function pushParams(updates: Record<string, string>) {
    const p = new URLSearchParams(searchParams.toString())
    for (const [k, v] of Object.entries(updates)) {
      if (v) p.set(k, v)
      else p.delete(k)
    }
    startTransition(() => router.replace(`${pathname}?${p.toString()}`))
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    pushParams({ q: search.trim() })
  }

  function handleClear() {
    setSearch('')
    pushParams({ q: '' })
  }

  const selectedJob = searchParams.get('job') ?? ''

  return (
    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>

      {/* Search */}
      <form onSubmit={handleSearch} style={{ position: 'relative', flex: '1', minWidth: '200px', maxWidth: '340px' }}>
        <svg
          width="14" height="14" fill="none" stroke="#96AFCA" strokeWidth={2} viewBox="0 0 24 24"
          style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search candidate name…"
          style={{
            width: '100%', padding: '9px 36px 9px 34px', borderRadius: '9px',
            border: '1.5px solid #D0DBE8', fontFamily: 'var(--font-ui)',
            fontSize: '0.82rem', color: '#032655', background: '#fff',
            outline: 'none', boxSizing: 'border-box',
          }}
        />
        {search && (
          <button
            type="button" onClick={handleClear}
            style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#96AFCA', fontSize: '16px', lineHeight: 1, padding: '2px' }}
          >
            ×
          </button>
        )}
      </form>

      {/* Job filter */}
      <select
        value={selectedJob}
        onChange={e => pushParams({ job: e.target.value })}
        style={{
          padding: '9px 14px', borderRadius: '9px',
          border: '1.5px solid #D0DBE8', fontFamily: 'var(--font-ui)',
          fontSize: '0.82rem', color: selectedJob ? '#032655' : '#96AFCA',
          background: '#fff', outline: 'none', cursor: 'pointer',
          minWidth: '180px',
        }}
      >
        <option value="">All Job Titles</option>
        {jobs.map(j => (
          <option key={j.id} value={j.id}>{j.title}</option>
        ))}
      </select>
    </div>
  )
}