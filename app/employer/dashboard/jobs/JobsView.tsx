'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'

const STATUS_CONFIG: Record<string, { color: string; bg: string; dot: string }> = {
  active:  { color: '#0A9E97', bg: '#D8F0EB', dot: '#0FB9B1' },
  closed:  { color: '#5A7A9F', bg: '#EEF3F8', dot: '#96AFCA' },
  draft:   { color: '#7A5C00', bg: '#FDF3DC', dot: '#F5A623' },
  paused:  { color: '#7A5C00', bg: '#FDF3DC', dot: '#F5A623' },
}

function Dot() {
  return <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: '#D0DBE8', flexShrink: 0, display: 'inline-block' }} />
}

type Props = {
  jobs: any[]
  countMap: Record<string, number>
  openCount: number
  closedCount: number
  isClosed: boolean
}

export default function JobsView({ jobs, countMap, openCount, closedCount, isClosed }: Props) {
  const [search, setSearch]     = useState('')
  const [dept, setDept]         = useState('')

  const departments = useMemo(() => {
    const seen = new Set<string>()
    for (const j of jobs) if (j.department) seen.add(j.department)
    return Array.from(seen).sort()
  }, [jobs])

  const displayJobs = useMemo(() => {
    const q = search.trim().toLowerCase()
    return jobs.filter(j => {
      const matchSearch = !q || j.title?.toLowerCase().includes(q) || j.department?.toLowerCase().includes(q)
      const matchDept   = !dept || j.department === dept
      return matchSearch && matchDept
    })
  }, [jobs, search, dept])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* ── Header row ────────────────────────────────────────────────────── */}
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '14px', flexWrap: 'wrap' }}>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '6px', background: '#EEF3F8', borderRadius: '10px', padding: '4px', flexShrink: 0 }}>
          <Link href="/employer/dashboard/jobs" style={{
            display: 'inline-flex', alignItems: 'center', gap: '7px',
            padding: '7px 16px', borderRadius: '7px',
            fontFamily: 'var(--font-ui)', fontSize: '0.78rem', fontWeight: 700,
            textDecoration: 'none',
            background: !isClosed ? '#fff' : 'transparent',
            color: !isClosed ? '#032655' : '#96AFCA',
            boxShadow: !isClosed ? '0 1px 4px rgba(3,38,85,0.08)' : 'none',
          }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: !isClosed ? '#0FB9B1' : '#C0CCDA', flexShrink: 0 }} />
            Open Jobs
            <span style={{ background: !isClosed ? '#D8F0EB' : '#E2E8F0', color: !isClosed ? '#0A9E97' : '#96AFCA', borderRadius: '10px', padding: '1px 7px', fontSize: '0.65rem', fontWeight: 800 }}>
              {openCount}
            </span>
          </Link>
          <Link href="/employer/dashboard/jobs?tab=closed" style={{
            display: 'inline-flex', alignItems: 'center', gap: '7px',
            padding: '7px 16px', borderRadius: '7px',
            fontFamily: 'var(--font-ui)', fontSize: '0.78rem', fontWeight: 700,
            textDecoration: 'none',
            background: isClosed ? '#fff' : 'transparent',
            color: isClosed ? '#032655' : '#96AFCA',
            boxShadow: isClosed ? '0 1px 4px rgba(3,38,85,0.08)' : 'none',
          }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: isClosed ? '#96AFCA' : '#C0CCDA', flexShrink: 0 }} />
            Closed Jobs
            <span style={{ background: isClosed ? '#EEF3F8' : '#E2E8F0', color: isClosed ? '#5A7A9F' : '#96AFCA', borderRadius: '10px', padding: '1px 7px', fontSize: '0.65rem', fontWeight: 800 }}>
              {closedCount}
            </span>
          </Link>
        </div>

        {/* Post a Job */}
        <Link href="/employer/dashboard/jobs/post" style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          padding: '8px 16px', borderRadius: '8px',
          background: '#032655', color: '#fff',
          fontFamily: 'var(--font-ui)', fontSize: '0.78rem', fontWeight: 700,
          textDecoration: 'none', flexShrink: 0,
        }}>
          <svg fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24" style={{ width: '12px', height: '12px' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Post a Job
        </Link>
      </div>

      {/* ── Search + Department filter ─────────────────────────────────────── */}
      <div style={{ flexShrink: 0, display: 'flex', gap: '10px', marginBottom: '14px', flexWrap: 'wrap' }}>

        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <svg width="14" height="14" fill="none" stroke="#96AFCA" strokeWidth={2} viewBox="0 0 24 24"
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by title or department…"
            style={{
              width: '100%', boxSizing: 'border-box',
              padding: '9px 12px 9px 34px',
              borderRadius: '10px', border: '1.5px solid #D0DBE8',
              fontFamily: 'var(--font-ui)', fontSize: '0.82rem', color: '#032655',
              background: '#fff', outline: 'none',
            }}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#96AFCA', padding: '2px', display: 'flex', alignItems: 'center' }}>
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          )}
        </div>

        {/* Department filter */}
        {departments.length > 0 && (
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <svg width="13" height="13" fill="none" stroke="#96AFCA" strokeWidth={2} viewBox="0 0 24 24"
              style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
            </svg>
            <select
              value={dept}
              onChange={e => setDept(e.target.value)}
              style={{
                padding: '9px 32px 9px 30px',
                borderRadius: '10px', border: `1.5px solid ${dept ? '#0FB9B1' : '#D0DBE8'}`,
                fontFamily: 'var(--font-ui)', fontSize: '0.82rem',
                color: dept ? '#0A9E97' : '#5A7A9F',
                background: dept ? '#F0FBF9' : '#fff',
                outline: 'none', cursor: 'pointer', appearance: 'none',
              }}
            >
              <option value="">All Departments</option>
              {departments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"
              style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#96AFCA' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
        )}

        {/* Active filter chips */}
        {(search || dept) && (
          <button
            onClick={() => { setSearch(''); setDept('') }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '9px 13px', borderRadius: '10px', border: '1.5px solid #D0DBE8', background: '#fff', cursor: 'pointer', fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 600, color: '#5A7A9F', flexShrink: 0 }}
          >
            <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            Clear
          </button>
        )}
      </div>

      {/* ── Result count ──────────────────────────────────────────────────── */}
      {(search || dept) && (
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', color: '#96AFCA', marginBottom: '10px', flexShrink: 0 }}>
          {displayJobs.length} result{displayJobs.length !== 1 ? 's' : ''} for {[search && `"${search}"`, dept && `dept: ${dept}`].filter(Boolean).join(' · ')}
        </p>
      )}

      {/* ── Job list ──────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
        {!displayJobs.length ? (
          <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #D0DBE8', padding: '3rem', textAlign: 'center' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#EEF3F8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <svg fill="none" stroke="#96AFCA" strokeWidth={1.5} viewBox="0 0 24 24" style={{ width: '22px', height: '22px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.9rem', fontWeight: 700, color: '#032655', marginBottom: '5px' }}>
              {search || dept ? 'No jobs match your filters' : `No ${isClosed ? 'closed' : 'open'} jobs`}
            </p>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.8rem', color: '#96AFCA', marginBottom: search || dept ? '1rem' : (isClosed ? 0 : '1.25rem') }}>
              {search || dept ? 'Try adjusting your search or department filter.' : (isClosed ? 'Jobs you close will appear here.' : 'Post your first job to start receiving candidates.')}
            </p>
            {!(search || dept) && !isClosed && (
              <Link href="/employer/dashboard/jobs/post" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '9px 18px', borderRadius: '8px', background: '#0FB9B1', color: '#fff', fontFamily: 'var(--font-ui)', fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none' }}>
                Post your first job
              </Link>
            )}
            {(search || dept) && (
              <button onClick={() => { setSearch(''); setDept('') }} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '9px 18px', borderRadius: '8px', background: '#EEF3F8', color: '#5A7A9F', fontFamily: 'var(--font-ui)', fontSize: '0.78rem', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {displayJobs.map((job) => {
              const s = STATUS_CONFIG[job.status?.toLowerCase?.() ?? ''] ?? STATUS_CONFIG.draft
              return (
                <Link key={job.id} href={`/employer/dashboard/jobs/${job.id}`} style={{
                  background: '#fff', borderRadius: '14px', border: '1px solid #D0DBE8',
                  padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '14px',
                  boxShadow: '0 1px 6px rgba(3,38,85,0.04)', textDecoration: 'none', cursor: 'pointer',
                }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '9px', background: '#EEF3F8', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg fill="none" stroke="#5A7A9F" strokeWidth={1.6} viewBox="0 0 24 24" style={{ width: '16px', height: '16px' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: '0.875rem', color: '#032655', marginBottom: '3px' }}>
                      {job.title}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                      {job.department && <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', color: '#5A7A9F' }}>{job.department}</span>}
                      {job.department && job.location && <Dot />}
                      {job.location && <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', color: '#5A7A9F' }}>{job.location}</span>}
                      {job.work_model && <><Dot /><span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', color: '#5A7A9F' }}>{job.work_model}</span></>}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#EEF3F8', borderRadius: '7px', padding: '5px 10px' }}>
                      <svg fill="none" stroke="#5A7A9F" strokeWidth={1.8} viewBox="0 0 24 24" style={{ width: '13px', height: '13px' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.75 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                      </svg>
                      <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 700, color: '#5A7A9F' }}>{countMap[job.id] ?? 0}</span>
                    </div>

                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: '5px',
                      fontFamily: 'var(--font-ui)', fontSize: '0.56rem', fontWeight: 700,
                      letterSpacing: '0.08em', textTransform: 'uppercase' as const,
                      color: s.color, background: s.bg, border: `1px solid ${s.dot}`,
                      borderRadius: '5px', padding: '4px 9px',
                    }}>
                      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: s.dot, flexShrink: 0 }} />
                      {job.status ?? 'Draft'}
                    </span>

                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: '5px',
                      fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 700,
                      color: '#032655', background: '#fff', border: '1.5px solid #D0DBE8',
                      borderRadius: '7px', padding: '6px 12px',
                    }}>
                      Open
                      <svg fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" style={{ width: '11px', height: '11px' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
