'use client'

import { useState, useTransition, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { unsaveJob } from '@/lib/recruiter/unsaveJob'

/* ── helpers (same as JobsView) ───────────────────────────────────────────── */
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

const AVATARS = ['#032655', '#0A9E97', '#5A7A9F', '#C8A96E', '#276749', '#1a4080']
function avatarColor(name: string | null) {
  if (!name) return AVATARS[0]
  return AVATARS[name.charCodeAt(0) % AVATARS.length]
}

function SubmissionBadge({ count }: { count: number }) {
  const low = count < 10
  return (
    <span style={{
      fontFamily: 'var(--font-ui)', fontSize: '0.58rem', fontWeight: 600,
      color: low ? '#0A9E97' : '#5A7A9F',
      background: low ? '#D8F0EB' : '#EEF3F8',
      border: `1px solid ${low ? 'rgba(15,185,177,0.2)' : '#D0DBE8'}`,
      borderRadius: '4px', padding: '2px 6px', whiteSpace: 'nowrap' as const,
    }}>
      {count === 0 ? 'Be first' : `${count} submitted`}
    </span>
  )
}

function ReadMore({ children, maxHeight = 140 }: { children: React.ReactNode; maxHeight?: number }) {
  const [expanded, setExpanded] = useState(false)
  const [overflows, setOverflows] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (ref.current) setOverflows(ref.current.scrollHeight > maxHeight + 4)
  }, [children, maxHeight])
  return (
    <div>
      <div ref={ref} style={{ position: 'relative', maxHeight: expanded ? undefined : maxHeight, overflow: 'hidden' }}>
        {children}
        {!expanded && overflows && (
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '52px', background: 'linear-gradient(to bottom, transparent, #fff)', pointerEvents: 'none' }} />
        )}
      </div>
      {overflows && (
        <button onClick={() => setExpanded(e => !e)} style={{ marginTop: '8px', background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 700, color: '#0FB9B1', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          {expanded ? 'Read less ↑' : 'Read more ↓'}
        </button>
      )}
    </div>
  )
}

function isHTML(text: string): boolean {
  return /<\/?(b|i|u|br|ul|ol|li|p|strong|em)\b[^>]*>/i.test(text)
}

function JobDescription({ text }: { text: string }) {
  if (isHTML(text)) {
    return (
      <>
        <div
          dangerouslySetInnerHTML={{ __html: text }}
          className="jd-html-ms"
          style={{ fontFamily: 'var(--font-ui)', fontSize: '0.875rem', color: '#3D5A7A', lineHeight: 1.75 }}
        />
        <style>{`
          .jd-html-ms b, .jd-html-ms strong { font-weight: 700; color: #032655; }
          .jd-html-ms i, .jd-html-ms em { font-style: italic; }
          .jd-html-ms u { text-decoration: underline; }
          .jd-html-ms ul, .jd-html-ms ol { margin: 6px 0; padding-left: 20px; }
          .jd-html-ms li { margin: 3px 0; }
          .jd-html-ms p { margin: 4px 0; }
        `}</style>
      </>
    )
  }

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
export default function MySavedJobsView({ savedJobs, submissionCounts }: { savedJobs: any[]; submissionCounts: Record<string, number> }) {
  const firstJobId = savedJobs[0]?.job_posts?.id ?? null
  const [selectedId, setSelectedId] = useState<string | null>(firstJobId)
  const [unsaving, setUnsaving] = useState<string | null>(null)
  const [, startTransition] = useTransition()
  const router = useRouter()

  function handleUnsave(e: React.MouseEvent, savedJobId: string) {
    e.stopPropagation()
    setUnsaving(savedJobId)
    startTransition(async () => {
      try {
        await unsaveJob(savedJobId)
        router.refresh()
      } finally {
        setUnsaving(null)
      }
    })
  }

  const selectedSaved = savedJobs.find(s => s.job_posts?.id === selectedId) ?? savedJobs[0] ?? null
  const selected      = selectedSaved?.job_posts as any ?? null
  const employer      = selected?.employers as any ?? null

  const selBudgetMin = formatBudget(selected?.budget_min)
  const selBudgetMax = formatBudget(selected?.budget_max)
  const hasBudget    = selBudgetMin || selBudgetMax
  const avgCTC       = ((selected?.budget_min ?? 0) + (selected?.budget_max ?? 0)) / 2
  const earningFee   = avgCTC > 0 ? formatBudget(Math.round(avgCTC * 0.04)) : null
  const avatarBg     = avatarColor(employer?.company_name ?? null)
  const city         = companyCity(employer?.company_address ?? null)
  const isActive     = selected?.status === 'active'

  if (savedJobs.length === 0) {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '40px' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#EEF3F8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="22" height="22" fill="none" stroke="#96AFCA" strokeWidth={1.6} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
          </svg>
        </div>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.9rem', fontWeight: 700, color: '#032655', margin: 0 }}>No saved jobs yet</p>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: '#96AFCA', margin: 0 }}>Browse all jobs and save the ones you want to work on.</p>
        <Link href="/recruiter/dashboard/all-jobs" style={{ padding: '9px 18px', borderRadius: '9px', background: '#032655', color: '#fff', textDecoration: 'none', fontFamily: 'var(--font-ui)', fontSize: '0.78rem', fontWeight: 700 }}>
          Browse All Jobs
        </Link>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', height: '100%', minHeight: 0 }}>
      <style>{`@keyframes unsaveSpin { to { transform: rotate(360deg) } }`}</style>

      {/* ── LEFT PANEL ──────────────────────────────────────────────────── */}
      <div style={{ width: '340px', flexShrink: 0, display: 'flex', flexDirection: 'column', height: '100%', borderRight: '1px solid #D0DBE8', background: '#fff' }}>

        {/* Header */}
        <div style={{ padding: '12px 14px 10px', flexShrink: 0, borderBottom: '1px solid #EEF3F8' }}>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', fontWeight: 600, color: '#96AFCA', margin: 0 }}>
            {savedJobs.length} saved job{savedJobs.length !== 1 ? 's' : ''} · {10 - savedJobs.length} slot{10 - savedJobs.length !== 1 ? 's' : ''} remaining
          </p>
        </div>

        {/* Scrollable list */}
        <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
          {savedJobs.map(saved => {
            const job    = saved.job_posts as any
            if (!job) return null
            const isAct  = job.status === 'active'
            const isSel  = job.id === (selectedId ?? firstJobId)
            const bMin   = formatBudget(job.budget_min)
            const bMax   = formatBudget(job.budget_max)
            const emp    = job.employers as any
            const bg     = avatarColor(emp?.company_name ?? null)

            return (
              <div
                key={saved.id}
                onClick={() => setSelectedId(job.id)}
                style={{ padding: '14px 16px', borderBottom: '1px solid #EEF3F8', cursor: 'pointer', background: isSel ? '#F0FBF9' : '#fff', borderLeft: `3px solid ${isSel ? '#0FB9B1' : 'transparent'}`, transition: 'background 0.15s', position: 'relative' as const }}
              >
                {/* Unsave ×  — absolute so it doesn't displace the card layout */}
                <button
                  onClick={e => handleUnsave(e, saved.id)}
                  disabled={unsaving === saved.id}
                  title="Remove from saved"
                  style={{ position: 'absolute' as const, top: '10px', right: '10px', width: '22px', height: '22px', borderRadius: '6px', border: '1px solid #EEF3F8', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: unsaving === saved.id ? 'not-allowed' : 'pointer', opacity: unsaving === saved.id ? 0.4 : 0.7, color: '#96AFCA', zIndex: 1 }}
                >
                  {unsaving === saved.id ? (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} style={{ animation: 'unsaveSpin 0.7s linear infinite' }}>
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4" />
                    </svg>
                  ) : (
                    <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </button>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', paddingRight: '28px' }}>
                  {/* Avatar */}
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', overflow: 'hidden', background: emp?.logo_url ? '#fff' : bg, border: emp?.logo_url ? '1px solid #D0DBE8' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, opacity: isAct ? 1 : 0.55 }}>
                    {emp?.logo_url ? (
                      <img src={emp.logo_url} alt={emp?.company_name ?? ''} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    ) : (
                      <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', fontWeight: 800, color: '#fff', letterSpacing: '0.04em' }}>
                        {initials(emp?.company_name ?? null)}
                      </span>
                    )}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px', flexWrap: 'wrap' as const }}>
                      <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', fontWeight: 700, color: isAct ? (isSel ? '#032655' : '#1C2E4A') : '#96AFCA', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>
                        {job.title}
                      </p>
                      {!isAct && (
                        <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.55rem', fontWeight: 700, color: '#5A7A9F', background: '#EEF3F8', border: '1px solid #D0DBE8', borderRadius: '4px', padding: '1px 6px', letterSpacing: '0.08em', textTransform: 'uppercase' as const, flexShrink: 0 }}>
                          {job.status}
                        </span>
                      )}
                    </div>
                    {emp?.company_name && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', margin: '0 0 4px', overflow: 'hidden' }}>
                        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', color: '#5A7A9F', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const, minWidth: 0 }}>
                          {emp.company_name}
                        </p>
                        {emp.is_verified && (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="#0A9E97" style={{ flexShrink: 0, marginTop: '1px' }}>
                            <title>Verified Employer</title>
                            <path d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.49 4.49 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.307 4.49 4.49 0 01-1.307-3.497A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"/>
                          </svg>
                        )}
                      </div>
                    )}
                    <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', color: '#96AFCA', margin: '0 0 6px' }}>
                      {[job.location, job.work_model].filter(Boolean).join(' · ')}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                      {(bMin || bMax) && (
                        <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', fontWeight: 700, color: isAct ? '#0A9E97' : '#96AFCA', background: isAct ? '#D8F0EB' : '#F5F8FC', border: `1px solid ${isAct ? 'rgba(15,185,177,0.2)' : '#EEF3F8'}`, borderRadius: '4px', padding: '2px 7px' }}>
                          {bMin}{bMin && bMax ? ' – ' : ''}{bMax} PA
                        </span>
                      )}
                      <SubmissionBadge count={submissionCounts[job.id] ?? 0} />
                      <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.6rem', color: '#B0BEC5', marginLeft: 'auto' }}>
                        Saved {timeAgo(saved.saved_at)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
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

            {/* ── Job header card ────────────────────────────────────────── */}
            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #D0DBE8', overflow: 'hidden', boxShadow: '0 1px 8px rgba(3,38,85,0.05)' }}>
              <div style={{ height: '3px', background: isActive ? 'linear-gradient(90deg, #032655, #0FB9B1)' : '#EEF3F8' }} />
              <div style={{ padding: '20px 24px' }}>

                {/* Company row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '14px', overflow: 'hidden', flexShrink: 0, boxShadow: '0 4px 12px rgba(0,0,0,0.15)', background: employer?.logo_url ? '#fff' : avatarBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {employer?.logo_url ? (
                      <img src={employer.logo_url} alt={employer?.company_name ?? ''} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    ) : (
                      <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.85rem', fontWeight: 800, color: '#fff', letterSpacing: '0.04em' }}>
                        {initials(employer?.company_name ?? null)}
                      </span>
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px', flexWrap: 'wrap' as const }}>
                      <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.95rem', fontWeight: 700, color: '#032655', margin: 0 }}>
                        {employer?.company_name ?? 'Company'}
                      </p>
                      {employer?.is_verified && (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="#0A9E97" style={{ flexShrink: 0 }}>
                          <title>Verified Employer</title>
                          <path d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.49 4.49 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.307 4.49 4.49 0 01-1.307-3.497A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"/>
                        </svg>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' as const, alignItems: 'center' }}>
                      {employer?.industry && <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', color: '#5A7A9F' }}>{employer.industry}</span>}
                      {employer?.industry && city && <span style={{ color: '#D0DBE8' }}>·</span>}
                      {city && <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', color: '#96AFCA' }}>📍 {city}</span>}
                    </div>
                  </div>
                </div>

                {/* Title */}
                <h1 style={{ fontFamily: 'var(--font-ui)', fontSize: '1.35rem', fontWeight: 800, color: '#032655', letterSpacing: '-0.025em', lineHeight: 1.2, margin: '0 0 12px' }}>
                  {selected.title}
                </h1>

                {/* Meta chips */}
                <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '7px', alignItems: 'center', marginBottom: '16px' }}>
                  {/* Status badge */}
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontFamily: 'var(--font-ui)', fontSize: '0.58rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: isActive ? '#0A9E97' : '#5A7A9F', background: isActive ? '#D8F0EB' : '#EEF3F8', border: `1px solid ${isActive ? 'rgba(15,185,177,0.3)' : '#D0DBE8'}`, borderRadius: '100px', padding: '4px 10px' }}>
                    <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: isActive ? '#0FB9B1' : '#96AFCA' }} />
                    {selected.status}
                  </span>
                  {selected.location && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 600, color: '#5A7A9F', background: '#F5F8FC', border: '1px solid #D0DBE8', borderRadius: '100px', padding: '4px 11px' }}>
                      📍 {selected.location}
                    </span>
                  )}
                  {selected.work_model && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 600, color: '#5A7A9F', background: '#F5F8FC', border: '1px solid #D0DBE8', borderRadius: '100px', padding: '4px 11px' }}>
                      {selected.work_model}
                    </span>
                  )}
                  {selected.department && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 600, color: '#5A7A9F', background: '#F5F8FC', border: '1px solid #D0DBE8', borderRadius: '100px', padding: '4px 11px' }}>
                      {selected.department}
                    </span>
                  )}
                  {earningFee && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 700, color: '#0A9E97', background: '#D8F0EB', border: '1px solid rgba(15,185,177,0.25)', borderRadius: '100px', padding: '4px 11px' }}>
                      Earning Potential: {earningFee}
                    </span>
                  )}
                  {selected.notice_period && (
                    <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', color: '#96AFCA' }}>
                      🕐 {selected.notice_period} notice
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' as const }}>
                  {isActive ? (
                    <Link href={`/recruiter/dashboard/my-jobs/${selected.id}/submit`} style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '10px 20px', borderRadius: '10px', background: '#032655', color: '#fff', fontFamily: 'var(--font-ui)', fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none' }}>
                      <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>
                      Submit Candidate
                    </Link>
                  ) : (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '10px 20px', borderRadius: '10px', background: '#EEF3F8', color: '#96AFCA', fontFamily: 'var(--font-ui)', fontSize: '0.78rem', fontWeight: 700, border: '1px solid #D0DBE8' }}>
                      <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                      Job Closed
                    </span>
                  )}
                  {selected.jd_pdf_url && (
                    <a href={selected.jd_pdf_url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 16px', borderRadius: '10px', border: '1.5px solid #D0DBE8', background: '#fff', color: '#5A7A9F', textDecoration: 'none', fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 600 }}>
                      <svg width="13" height="13" fill="none" stroke="#E53E3E" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                      View JD PDF
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* ── About the Job ──────────────────────────────────────────── */}
            {selected.recruiter_note && (
              <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #D0DBE8', padding: '20px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                  <div style={{ width: '3px', height: '16px', background: '#0FB9B1', borderRadius: '2px' }} />
                  <h2 style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 800, color: '#032655', textTransform: 'uppercase' as const, letterSpacing: '0.1em', margin: 0 }}>About the Job</h2>
                </div>
                <ReadMore><JobDescription text={selected.recruiter_note} /></ReadMore>
              </div>
            )}

            {/* ── Requirements ───────────────────────────────────────────── */}
            {(selected.mandatory_criteria?.length > 0 || selected.preferred_criteria?.length > 0) && (
              <div style={{ display: 'grid', gridTemplateColumns: selected.mandatory_criteria?.length > 0 && selected.preferred_criteria?.length > 0 ? '1fr 1fr' : '1fr', gap: '12px' }}>
                {selected.mandatory_criteria?.length > 0 && (
                  <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #D0DBE8', padding: '20px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                      <div style={{ width: '3px', height: '16px', background: '#032655', borderRadius: '2px' }} />
                      <h2 style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 800, color: '#032655', textTransform: 'uppercase' as const, letterSpacing: '0.1em', margin: 0 }}>Must-Have</h2>
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
                      <h2 style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 800, color: '#032655', textTransform: 'uppercase' as const, letterSpacing: '0.1em', margin: 0 }}>Good to Have</h2>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '7px' }}>
                      {selected.preferred_criteria.map((item: string, i: number) => (
                        <span key={i} style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', fontWeight: 600, color: '#3D5A7A', background: '#F5F8FC', border: '1px solid #D0DBE8', borderRadius: '7px', padding: '5px 11px' }}>{item}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── Preferred Companies ─────────────────────────────────────── */}
            {selected.preferred_companies?.length > 0 && (
              <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #D0DBE8', padding: '20px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <div style={{ width: '3px', height: '16px', background: '#0FB9B1', borderRadius: '2px' }} />
                  <h2 style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 800, color: '#032655', textTransform: 'uppercase' as const, letterSpacing: '0.1em', margin: 0 }}>Preferred Company Backgrounds</h2>
                </div>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', color: '#96AFCA', margin: '0 0 12px' }}>Candidates from these companies are particularly welcome.</p>
                <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '8px' }}>
                  {selected.preferred_companies.map((item: string, i: number) => (
                    <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-ui)', fontSize: '0.75rem', fontWeight: 700, color: '#0A9E97', background: '#D8F0EB', border: '1px solid rgba(15,185,177,0.2)', borderRadius: '8px', padding: '5px 12px' }}>
                      <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#0FB9B1' }} />
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* ── About the Company ───────────────────────────────────────── */}
            {employer && (
              <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #D0DBE8', padding: '20px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <div style={{ width: '3px', height: '16px', background: '#5A7A9F', borderRadius: '2px' }} />
                  <h2 style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 800, color: '#032655', textTransform: 'uppercase' as const, letterSpacing: '0.1em', margin: 0 }}>About the Company</h2>
                </div>

                {/* Logo + name row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                  <div style={{ width: '52px', height: '52px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0, background: employer.logo_url ? '#fff' : avatarBg, border: '1px solid #D0DBE8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {employer.logo_url ? (
                      <img src={employer.logo_url} alt={employer.company_name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    ) : (
                      <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', fontWeight: 800, color: '#fff' }}>{initials(employer.company_name)}</span>
                    )}
                  </div>
                  <div>
                    <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.95rem', fontWeight: 700, color: '#032655', margin: '0 0 4px' }}>{employer.company_name}</p>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' as const, alignItems: 'center' }}>
                      {employer.industry && <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.68rem', fontWeight: 600, color: '#5A7A9F', background: '#EEF3F8', borderRadius: '4px', padding: '2px 8px' }}>{employer.industry}</span>}
                      {employer.company_size && <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.68rem', fontWeight: 600, color: '#5A7A9F', background: '#EEF3F8', borderRadius: '4px', padding: '2px 8px' }}>👥 {employer.company_size}</span>}
                      {employer.founded_year && <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.68rem', color: '#96AFCA' }}>Est. {employer.founded_year}</span>}
                      {employer.is_verified && (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="#0A9E97" style={{ flexShrink: 0 }}>
                          <title>Verified Employer</title>
                          <path d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.49 4.49 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.307 4.49 4.49 0 01-1.307-3.497A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"/>
                        </svg>
                      )}
                    </div>
                  </div>
                </div>

                {/* Overview */}
                {employer.company_overview && (
                  <ReadMore maxHeight={96}>
                    <JobDescription text={employer.company_overview} />
                  </ReadMore>
                )}

                {/* Info row: website + headquarters */}
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '8px' }}>
                  {employer.company_website && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <svg width="13" height="13" fill="none" stroke="#96AFCA" strokeWidth={1.8} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253" />
                      </svg>
                      <a href={employer.company_website} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: '#0FB9B1', fontWeight: 600, textDecoration: 'none', wordBreak: 'break-all' as const }}>
                        {employer.company_website.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  )}
                  {employer.company_address && (
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '10px 14px', background: '#F5F8FC', borderRadius: '9px', border: '1px solid #EEF3F8' }}>
                      <svg width="13" height="13" fill="none" stroke="#96AFCA" strokeWidth={1.8} viewBox="0 0 24 24" style={{ flexShrink: 0, marginTop: '1px' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                      <div>
                        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.6rem', fontWeight: 700, color: '#96AFCA', letterSpacing: '0.06em', textTransform: 'uppercase' as const, margin: '0 0 2px' }}>Headquarters</p>
                        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: '#5A7A9F', margin: 0, lineHeight: 1.5 }}>{employer.company_address}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
