'use client'

import { useState, useTransition, useEffect } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import Link from 'next/link'
import SaveJobButton from '@/components/recruiter/SaveJobButton'
import { INDIA_CITIES } from '@/lib/constants/cities'
import { DEPARTMENTS } from '@/lib/constants/departments'

const SALARY_OPTIONS = [
  { label: 'Any Salary',        value: '' },
  { label: 'Less than 20 LPA',  value: 'lt20' },
  { label: '20 – 30 LPA',       value: '20_30' },
  { label: '30 – 40 LPA',       value: '30_40' },
  { label: 'More than 40 LPA',  value: 'gt40' },
]

/* ── helpers ─────────────────────────────────────────────────────────────── */
function timeAgo(d: string) {
  const diff = Date.now() - new Date(d).getTime()
  const hrs  = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (hrs < 1)   return 'Just now'
  if (hrs < 24)  return `${hrs}h ago`
  if (days < 7)  return `${days}d ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  return `${Math.floor(days / 30)}mo ago`
}

function formatBudget(val: number | null): string | null {
  if (!val || val <= 0) return null
  if (val >= 100000) return `₹${(val / 100000).toFixed(0)}L`
  return `₹${val}L`
}

function initials(name: string | null) {
  if (!name) return 'CO'
  return name.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase()
}

function companyCity(address: string | null) {
  if (!address) return null
  const parts = address.split(',')
  return parts.length > 1 ? parts[parts.length - 2]?.trim() : parts[0]?.trim()
}

/* Palette for company avatars */
const AVATARS = ['#032655','#0A9E97','#5A7A9F','#C8A96E','#276749','#1a4080']
function avatarColor(name: string | null) {
  if (!name) return AVATARS[0]
  return AVATARS[name.charCodeAt(0) % AVATARS.length]
}

function isHTML(text: string): boolean {
  return /<\/?(b|i|u|br|ul|ol|li|p|strong|em)\b[^>]*>/i.test(text)
}

/* Render recruiter_note — HTML (rich text editor) or plain text (legacy) */
function JobDescription({ text }: { text: string }) {
  if (isHTML(text)) {
    return (
      <>
        <div
          dangerouslySetInnerHTML={{ __html: text }}
          className="jd-html-rv"
          style={{ fontFamily: 'var(--font-ui)', fontSize: '0.875rem', color: '#3D5A7A', lineHeight: 1.75 }}
        />
        <style>{`
          .jd-html-rv b, .jd-html-rv strong { font-weight: 700; color: #032655; }
          .jd-html-rv i, .jd-html-rv em { font-style: italic; }
          .jd-html-rv u { text-decoration: underline; }
          .jd-html-rv ul, .jd-html-rv ol { margin: 6px 0; padding-left: 20px; }
          .jd-html-rv li { margin: 3px 0; }
          .jd-html-rv p { margin: 4px 0; }
        `}</style>
      </>
    )
  }

  /* Legacy plain-text with bullet detection */
  const lines = text.split(/\n+/).map((l: string) => l.trim()).filter(Boolean)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
      {lines.map((line, i) => {
        if (/^[-•*]\s/.test(line)) {
          return (
            <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#0FB9B1', flexShrink: 0, marginTop: '9px' }} />
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.875rem', color: '#3D5A7A', lineHeight: 1.75, margin: 0 }}>
                {line.replace(/^[-•*]\s/, '')}
              </p>
            </div>
          )
        }
        return (
          <p key={i} style={{ fontFamily: 'var(--font-ui)', fontSize: '0.875rem', color: '#3D5A7A', lineHeight: 1.75, margin: 0 }}>
            {line}
          </p>
        )
      })}
    </div>
  )
}

/* ── Component ────────────────────────────────────────────────────────────── */
export default function JobsView({ jobs }: { jobs: any[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(jobs[0]?.id ?? null)
  const [, startTransition] = useTransition()
  const [search, setSearch] = useState('')
  const router    = useRouter()
  const pathname  = usePathname()
  const sp        = useSearchParams()

  /* Sync search input from URL on mount */
  useEffect(() => { setSearch(sp.get('search') ?? '') }, [])

  /* Debounced search → URL */
  useEffect(() => {
    const t = setTimeout(() => {
      const p = new URLSearchParams(sp.toString())
      search ? p.set('search', search) : p.delete('search')
      startTransition(() => router.replace(`${pathname}?${p.toString()}`))
    }, 380)
    return () => clearTimeout(t)
  }, [search])

  function setFilter(key: string, val: string) {
    const p = new URLSearchParams(sp.toString())
    val ? p.set(key, val) : p.delete(key)
    startTransition(() => router.replace(`${pathname}?${p.toString()}`))
  }

  const selected = jobs.find(j => j.id === selectedId) ?? jobs[0] ?? null
  const employer = selected?.employers as any

  const selBudgetMin = formatBudget(selected?.budget_min)
  const selBudgetMax = formatBudget(selected?.budget_max)
  const hasBudget    = selBudgetMin || selBudgetMax
  const avatarBg     = avatarColor(employer?.company_name ?? null)
  const city         = companyCity(employer?.company_address ?? null)

  const activeWM = sp.get('work_model') ?? ''

  const DATE_OPTIONS = [
    { label: 'Date Posted', value: '' },
    { label: 'Past 24 hours', value: '24h' },
    { label: 'Past 1 week',   value: '1w' },
    { label: 'Past 1 month',  value: '1m' },
  ]

  const FILTER_KEYS = ['work_model', 'location', 'department', 'salary_range', 'date_posted']
  const hasActiveFilters = FILTER_KEYS.some(k => sp.get(k)) || !!search

  function clearAll() {
    setSearch('')
    const p = new URLSearchParams()
    startTransition(() => router.replace(pathname))
  }

  /* pill select base style */
  function pillSelect(active: boolean): React.CSSProperties {
    return {
      fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: active ? 700 : 600,
      padding: '6px 12px', borderRadius: '100px', cursor: 'pointer', outline: 'none',
      border: `1.5px solid ${active ? '#0FB9B1' : '#D0DBE8'}`,
      background: active ? '#D8F0EB' : '#fff',
      color: active ? '#0A9E97' : '#5A7A9F',
      appearance: 'none' as const, WebkitAppearance: 'none' as const,
      paddingRight: '24px',
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>

      {/* ── TOP FILTER BAR ──────────────────────────────────────────────── */}
      <div style={{ flexShrink: 0, borderBottom: '1px solid #EEF3F8', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' as const, background: '#fff' }}>

        {/* Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px', background: '#F5F8FC', border: '1.5px solid #D0DBE8', borderRadius: '100px', padding: '0 12px', flex: '1', minWidth: '180px', maxWidth: '280px' }}>
          <svg width="12" height="12" fill="none" stroke="#96AFCA" strokeWidth={2} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search roles…"
            style={{ border: 'none', outline: 'none', background: 'transparent', fontFamily: 'var(--font-ui)', fontSize: '0.75rem', color: '#032655', padding: '7px 0', width: '100%' }}
          />
          {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#96AFCA', fontSize: '15px', lineHeight: 1, padding: 0 }}>×</button>}
        </div>

        {/* Date Posted */}
        <div style={{ position: 'relative' as const }}>
          <select value={sp.get('date_posted') ?? ''} onChange={e => setFilter('date_posted', e.target.value)} style={pillSelect(!!sp.get('date_posted'))}>
            {DATE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <svg width="10" height="10" fill="none" stroke={sp.get('date_posted') ? '#0A9E97' : '#96AFCA'} strokeWidth={2.5} viewBox="0 0 24 24" style={{ position: 'absolute', right: '9px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Work Model */}
        <div style={{ position: 'relative' as const }}>
          <select value={sp.get('work_model') ?? ''} onChange={e => setFilter('work_model', e.target.value)} style={pillSelect(!!sp.get('work_model'))}>
            <option value="">Work Model</option>
            {['On-site', 'Hybrid', 'WFH', 'Flexible'].map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <svg width="10" height="10" fill="none" stroke={sp.get('work_model') ? '#0A9E97' : '#96AFCA'} strokeWidth={2.5} viewBox="0 0 24 24" style={{ position: 'absolute', right: '9px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Location */}
        <div style={{ position: 'relative' as const }}>
          <select value={sp.get('location') ?? ''} onChange={e => setFilter('location', e.target.value)} style={pillSelect(!!sp.get('location'))}>
            <option value="">Location</option>
            {INDIA_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <svg width="10" height="10" fill="none" stroke={sp.get('location') ? '#0A9E97' : '#96AFCA'} strokeWidth={2.5} viewBox="0 0 24 24" style={{ position: 'absolute', right: '9px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Department */}
        <div style={{ position: 'relative' as const }}>
          <select value={sp.get('department') ?? ''} onChange={e => setFilter('department', e.target.value)} style={pillSelect(!!sp.get('department'))}>
            <option value="">Department</option>
            {DEPARTMENTS.map(g => (
              <optgroup key={g.group} label={g.group}>
                {g.items.map(d => <option key={d} value={d}>{d}</option>)}
              </optgroup>
            ))}
          </select>
          <svg width="10" height="10" fill="none" stroke={sp.get('department') ? '#0A9E97' : '#96AFCA'} strokeWidth={2.5} viewBox="0 0 24 24" style={{ position: 'absolute', right: '9px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Salary */}
        <div style={{ position: 'relative' as const }}>
          <select value={sp.get('salary_range') ?? ''} onChange={e => setFilter('salary_range', e.target.value)} style={pillSelect(!!sp.get('salary_range'))}>
            {SALARY_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <svg width="10" height="10" fill="none" stroke={sp.get('salary_range') ? '#0A9E97' : '#96AFCA'} strokeWidth={2.5} viewBox="0 0 24 24" style={{ position: 'absolute', right: '9px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Clear all */}
        {hasActiveFilters && (
          <button onClick={clearAll} style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 700, color: '#E53E3E', background: '#FFF5F5', border: '1px solid #FEB2B2', borderRadius: '100px', padding: '6px 12px', cursor: 'pointer' }}>
            Clear all
          </button>
        )}

        {/* Result count */}
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', fontWeight: 600, color: '#96AFCA', marginLeft: 'auto' }}>
          {jobs.length} role{jobs.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* ── SPLIT PANEL ──────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>

      {/* ── LEFT PANEL ──────────────────────────────────────────────────── */}
      <div style={{ width: '340px', flexShrink: 0, display: 'flex', flexDirection: 'column', height: '100%', borderRight: '1px solid #D0DBE8', background: '#fff' }}>

        {/* Job count */}
        <div style={{ padding: '8px 14px', flexShrink: 0 }}>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', fontWeight: 600, color: '#96AFCA' }}>
            {jobs.length} active role{jobs.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Scrollable job list */}
        <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
          {jobs.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center' }}>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', color: '#96AFCA' }}>No jobs match your filters</p>
            </div>
          ) : (
            jobs.map(job => {
              const isActive = job.id === (selectedId ?? jobs[0]?.id)
              const bMin = formatBudget(job.budget_min)
              const bMax = formatBudget(job.budget_max)
              const emp  = job.employers as any
              const bg   = avatarColor(emp?.company_name ?? null)

              return (
                <div
                  key={job.id}
                  onClick={() => setSelectedId(job.id)}
                  style={{
                    padding: '14px 16px',
                    borderBottom: '1px solid #EEF3F8',
                    cursor: 'pointer',
                    background: isActive ? '#F0FBF9' : '#fff',
                    borderLeft: `3px solid ${isActive ? '#0FB9B1' : 'transparent'}`,
                    transition: 'background 0.15s',
                  }}
                >
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    {/* Company avatar */}
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', fontWeight: 800, color: '#fff', letterSpacing: '0.04em' }}>
                        {initials(emp?.company_name ?? null)}
                      </span>
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', fontWeight: 700, color: isActive ? '#032655' : '#1C2E4A', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {job.title}
                      </p>
                      {emp?.company_name && (
                        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', color: '#5A7A9F', margin: '0 0 4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {emp.company_name}
                        </p>
                      )}
                      <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', color: '#96AFCA', margin: '0 0 6px' }}>
                        {[job.location, job.work_model].filter(Boolean).join(' · ')}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                        {(bMin || bMax) && (
                          <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', fontWeight: 700, color: '#0A9E97', background: '#D8F0EB', border: '1px solid rgba(15,185,177,0.2)', borderRadius: '4px', padding: '2px 7px' }}>
                            {bMin}{bMin && bMax ? ' – ' : ''}{bMax} PA
                          </span>
                        )}
                        <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.6rem', color: '#B0BEC5', marginLeft: 'auto' }}>
                          {timeAgo(job.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* ── RIGHT PANEL ─────────────────────────────────────────────────── */}
      <div style={{ flex: 1, overflowY: 'auto', minHeight: 0, background: '#F5F8FC', minWidth: 0 }}>
        {!selected ? (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.875rem', color: '#96AFCA' }}>Select a job to view details</p>
          </div>
        ) : (
          <div key={selected.id} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>

            {/* ── Job header card ──────────────────────────────────────── */}
            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #D0DBE8', overflow: 'hidden', boxShadow: '0 1px 8px rgba(3,38,85,0.05)' }}>
              <div style={{ height: '3px', background: 'linear-gradient(90deg, #032655, #0FB9B1)' }} />
              <div style={{ padding: '20px 24px' }}>

                {/* Company row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: avatarBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
                    <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.85rem', fontWeight: 800, color: '#fff', letterSpacing: '0.04em' }}>
                      {initials(employer?.company_name ?? null)}
                    </span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px', flexWrap: 'wrap' }}>
                      <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.95rem', fontWeight: 700, color: '#032655', margin: 0 }}>
                        {employer?.company_name ?? 'Company'}
                      </p>
                      {employer?.is_verified && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-ui)', fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#0A9E97', background: '#D8F0EB', border: '1px solid rgba(15,185,177,0.25)', borderRadius: '4px', padding: '2px 7px' }}>
                          <svg width="8" height="8" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                          Verified
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                      {employer?.industry && <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', color: '#5A7A9F' }}>{employer.industry}</span>}
                      {employer?.industry && city && <span style={{ color: '#D0DBE8' }}>·</span>}
                      {city && <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', color: '#96AFCA' }}>📍 {city}</span>}
                    </div>
                  </div>
                </div>

                {/* Job title */}
                <h1 style={{ fontFamily: 'var(--font-ui)', fontSize: '1.35rem', fontWeight: 800, color: '#032655', letterSpacing: '-0.025em', lineHeight: 1.2, margin: '0 0 12px' }}>
                  {selected.title}
                </h1>

                {/* Meta chips */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px', alignItems: 'center', marginBottom: '16px' }}>
                  {selected.location && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 600, color: '#5A7A9F', background: '#F5F8FC', border: '1px solid #D0DBE8', borderRadius: '100px', padding: '4px 11px' }}>
                      <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                      {selected.location}
                    </span>
                  )}
                  {selected.work_model && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 600, color: '#5A7A9F', background: '#F5F8FC', border: '1px solid #D0DBE8', borderRadius: '100px', padding: '4px 11px' }}>
                      <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18h16.5a1.5 1.5 0 011.5 1.5v11.25a1.5 1.5 0 01-1.5 1.5H3.75a1.5 1.5 0 01-1.5-1.5V4.5a1.5 1.5 0 011.5-1.5z" /></svg>
                      {selected.work_model}
                    </span>
                  )}
                  {selected.department && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 600, color: '#5A7A9F', background: '#F5F8FC', border: '1px solid #D0DBE8', borderRadius: '100px', padding: '4px 11px' }}>
                      {selected.department}
                    </span>
                  )}
                  {hasBudget && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 700, color: '#0A9E97', background: '#D8F0EB', border: '1px solid rgba(15,185,177,0.25)', borderRadius: '100px', padding: '4px 11px' }}>
                      <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      {selBudgetMin} – {selBudgetMax} PA
                    </span>
                  )}
                  {selected.notice_period && (
                    <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', color: '#96AFCA' }}>
                      🕐 {selected.notice_period} notice
                    </span>
                  )}
                  <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', color: '#B0BEC5', marginLeft: '2px' }}>
                    · {timeAgo(selected.created_at)}
                  </span>
                </div>

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <Link
                    href={`/recruiter/dashboard/my-jobs/${selected.id}/submit`}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '10px 20px', borderRadius: '10px', background: '#032655', color: '#fff', fontFamily: 'var(--font-ui)', fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none' }}
                  >
                    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>
                    Submit Candidate
                  </Link>
                  <SaveJobButton jobId={selected.id} />
                  {selected.jd_pdf_url && (
                    <a href={selected.jd_pdf_url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 16px', borderRadius: '10px', border: '1.5px solid #D0DBE8', background: '#fff', color: '#5A7A9F', textDecoration: 'none', fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 600 }}>
                      <svg width="13" height="13" fill="none" stroke="#E53E3E" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                      View JD PDF
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* ── About the Job ────────────────────────────────────────── */}
            {selected.recruiter_note && (
              <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #D0DBE8', padding: '20px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                  <div style={{ width: '3px', height: '16px', background: '#0FB9B1', borderRadius: '2px' }} />
                  <h2 style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 800, color: '#032655', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>About the Job</h2>
                </div>
                <JobDescription text={selected.recruiter_note} />
              </div>
            )}

            {/* ── Requirements ─────────────────────────────────────────── */}
            {(selected.mandatory_criteria?.length > 0 || selected.preferred_criteria?.length > 0) && (
              <div style={{ display: 'grid', gridTemplateColumns: selected.mandatory_criteria?.length > 0 && selected.preferred_criteria?.length > 0 ? '1fr 1fr' : '1fr', gap: '12px' }}>

                {selected.mandatory_criteria?.length > 0 && (
                  <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #D0DBE8', padding: '20px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                      <div style={{ width: '3px', height: '16px', background: '#032655', borderRadius: '2px' }} />
                      <h2 style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 800, color: '#032655', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>Must-Have</h2>
                      <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.6rem', fontWeight: 700, color: '#0A9E97', background: '#D8F0EB', borderRadius: '10px', padding: '1px 7px' }}>{selected.mandatory_criteria.length}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                      {selected.mandatory_criteria.map((item: string, i: number) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '9px', padding: '8px 12px', background: '#F5F8FC', borderRadius: '8px', border: '1px solid #EEF3F8' }}>
                          <div style={{ width: '17px', height: '17px', borderRadius: '50%', background: '#D8F0EB', border: '1px solid rgba(15,185,177,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <svg width="8" height="8" fill="none" stroke="#0A9E97" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                          </div>
                          <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', fontWeight: 600, color: '#032655' }}>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selected.preferred_criteria?.length > 0 && (
                  <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #D0DBE8', padding: '20px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                      <div style={{ width: '3px', height: '16px', background: '#96AFCA', borderRadius: '2px' }} />
                      <h2 style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 800, color: '#032655', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>Good to Have</h2>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
                      {selected.preferred_criteria.map((item: string, i: number) => (
                        <span key={i} style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', fontWeight: 600, color: '#3D5A7A', background: '#F5F8FC', border: '1px solid #D0DBE8', borderRadius: '7px', padding: '5px 11px' }}>{item}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── Preferred Companies ───────────────────────────────────── */}
            {selected.preferred_companies?.length > 0 && (
              <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #D0DBE8', padding: '20px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <div style={{ width: '3px', height: '16px', background: '#0FB9B1', borderRadius: '2px' }} />
                  <h2 style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 800, color: '#032655', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>Preferred Company Backgrounds</h2>
                </div>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', color: '#96AFCA', margin: '0 0 12px' }}>Candidates from these companies are particularly welcome.</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {selected.preferred_companies.map((item: string, i: number) => (
                    <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-ui)', fontSize: '0.75rem', fontWeight: 700, color: '#0A9E97', background: '#D8F0EB', border: '1px solid rgba(15,185,177,0.2)', borderRadius: '8px', padding: '5px 12px' }}>
                      <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#0FB9B1' }} />
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* ── About the Company ─────────────────────────────────────── */}
            {employer && (
              <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #D0DBE8', padding: '20px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <div style={{ width: '3px', height: '16px', background: '#5A7A9F', borderRadius: '2px' }} />
                  <h2 style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 800, color: '#032655', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>About the Company</h2>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                  <div style={{ width: '52px', height: '52px', borderRadius: '12px', background: avatarBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', fontWeight: 800, color: '#fff' }}>
                      {initials(employer.company_name)}
                    </span>
                  </div>
                  <div>
                    <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.95rem', fontWeight: 700, color: '#032655', margin: '0 0 3px' }}>{employer.company_name}</p>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                      {employer.industry && (
                        <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.68rem', fontWeight: 600, color: '#5A7A9F', background: '#EEF3F8', borderRadius: '4px', padding: '2px 8px' }}>{employer.industry}</span>
                      )}
                      {employer.is_verified && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-ui)', fontSize: '0.55rem', fontWeight: 700, color: '#0A9E97', background: '#D8F0EB', borderRadius: '4px', padding: '2px 7px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                          <svg width="8" height="8" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                          Verified Employer
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {employer.company_address && (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '10px 14px', background: '#F5F8FC', borderRadius: '9px', border: '1px solid #EEF3F8' }}>
                    <svg width="13" height="13" fill="none" stroke="#96AFCA" strokeWidth={1.8} viewBox="0 0 24 24" style={{ flexShrink: 0, marginTop: '1px' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: '#5A7A9F', margin: 0, lineHeight: 1.5 }}>{employer.company_address}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      </div>{/* end split panel */}
    </div>
  )
}
