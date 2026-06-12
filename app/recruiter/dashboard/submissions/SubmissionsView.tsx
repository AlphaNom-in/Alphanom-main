'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import ResendConsentButton from './ResendConsentButton'

const PAGE_SIZE = 10

const PIPELINE_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  in_pipeline:     { bg: '#EEF3F8', color: '#5A7A9F', label: 'In Pipeline' },
  in_review:       { bg: '#EDE9FE', color: '#7C3AED', label: 'In Review' },
  shortlisted:     { bg: '#D8F0EB', color: '#0A9E97', label: 'Shortlisted' },
  saved_for_later: { bg: '#FFF8E7', color: '#B7791F', label: 'Saved for Later' },
  hired:           { bg: '#C6F6D5', color: '#276749', label: 'Hired ✓' },
  rejected:        { bg: '#FFF5F5', color: '#E53E3E', label: 'Rejected' },
}

function getConsentBadge(status: string | null, expiresAt: string | null) {
  if (status === 'consented' || status === null)
    return { bg: '#D8F0EB', color: '#0A9E97', dot: '#0FB9B1', label: 'Consented', showResend: false }
  if (status === 'withdrawn')
    return { bg: '#FFF5F5', color: '#E53E3E', dot: '#E53E3E', label: 'Withdrawn', showResend: false }
  if (expiresAt && new Date(expiresAt) < new Date())
    return { bg: '#FFF8E7', color: '#B7791F', dot: '#F5A623', label: 'Link Expired', showResend: true }
  return { bg: '#EEF3F8', color: '#5A7A9F', dot: '#96AFCA', label: 'Awaiting Consent', showResend: true }
}

export type Submission = {
  id: string
  candidate_name: string
  status: string
  submitted_at: string
  consent_status: string | null
  consent_token_expires_at: string | null
  job_posts: { title: string; department: string | null; employers: { company_name: string } | null } | null
}

export type Stats = {
  total: number
  consented: number
  pending: number
  withdrawn: number
}

export default function SubmissionsView({
  submissions,
  stats,
}: {
  submissions: Submission[]
  stats: Stats
}) {
  const [search,        setSearch]        = useState('')
  const [companyFilter, setCompanyFilter] = useState('all')
  const [consentFilter, setConsentFilter] = useState('all')
  const [page,          setPage]          = useState(1)

  function changeFilter<T>(setter: (v: T) => void) {
    return (v: T) => { setter(v); setPage(1) }
  }

  // Unique companies from submissions
  const companies = useMemo(() => {
    const seen = new Set<string>()
    for (const s of submissions) {
      const c = s.job_posts?.employers?.company_name
      if (c) seen.add(c)
    }
    return Array.from(seen).sort()
  }, [submissions])

  // Apply all filters
  const filtered = useMemo(() => {
    let r = submissions
    const q = search.trim().toLowerCase()
    if (q)                            r = r.filter(s => s.candidate_name.toLowerCase().includes(q))
    if (companyFilter !== 'all')      r = r.filter(s => s.job_posts?.employers?.company_name === companyFilter)
    if (consentFilter === 'consented') r = r.filter(s => s.consent_status === 'consented' || s.consent_status === null)
    else if (consentFilter === 'pending')   r = r.filter(s => s.consent_status === 'pending_consent')
    else if (consentFilter === 'withdrawn') r = r.filter(s => s.consent_status === 'withdrawn')
    return r
  }, [submissions, search, companyFilter, consentFilter])

  const totalPages  = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage    = Math.min(page, totalPages)
  const paginated   = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const CONSENT_TABS = [
    { key: 'all',       label: 'All',             count: stats.total,     dot: '#96AFCA', activeColor: '#032655' },
    { key: 'consented', label: 'Consent Given',   count: stats.consented, dot: '#0FB9B1', activeColor: '#0A9E97' },
    { key: 'pending',   label: 'Awaiting',        count: stats.pending,   dot: '#F5A623', activeColor: '#B7791F' },
    { key: 'withdrawn', label: 'Withdrawn',       count: stats.withdrawn, dot: '#E53E3E', activeColor: '#E53E3E' },
  ]

  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: '12px', overflow: 'hidden' }}>

      {/* ── Search + Company filter ── */}
      <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
        {/* Search */}
        <div style={{ flex: 1, position: 'relative' }}>
          <svg
            width="15" height="15" fill="none" stroke="#96AFCA" strokeWidth={2} viewBox="0 0 24 24"
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            placeholder="Search candidates…"
            value={search}
            onChange={e => changeFilter(setSearch)(e.target.value)}
            style={{
              width: '100%', boxSizing: 'border-box',
              padding: '9px 12px 9px 34px',
              borderRadius: '9px', border: '1.5px solid #D0DBE8',
              background: '#fff', fontFamily: 'var(--font-ui)', fontSize: '13px', color: '#032655',
              outline: 'none',
            }}
          />
        </div>

        {/* Company filter */}
        <select
          value={companyFilter}
          onChange={e => changeFilter(setCompanyFilter)(e.target.value)}
          style={{
            padding: '9px 12px', borderRadius: '9px', border: '1.5px solid #D0DBE8',
            background: '#fff', fontFamily: 'var(--font-ui)', fontSize: '13px', color: '#032655',
            cursor: 'pointer', outline: 'none', minWidth: '160px',
          }}
        >
          <option value="all">All Companies</option>
          {companies.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* ── Consent filter tabs ── */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', flexShrink: 0 }}>
        {CONSENT_TABS.map(tab => {
          const active = consentFilter === tab.key
          return (
            <button
              key={tab.key}
              onClick={() => changeFilter(setConsentFilter)(tab.key)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '6px 13px', borderRadius: '8px', cursor: 'pointer',
                fontFamily: 'var(--font-ui)', fontSize: '0.74rem', fontWeight: active ? 700 : 500,
                background: active ? tab.activeColor : '#fff',
                color:      active ? '#fff' : '#5A7A9F',
                border:     `1.5px solid ${active ? tab.activeColor : '#E4EAF1'}`,
              }}
            >
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: active ? '#fff' : tab.dot, flexShrink: 0 }} />
              {tab.label}
              <span style={{
                fontFamily: 'var(--font-ui)', fontSize: '0.62rem', fontWeight: 700,
                padding: '1px 6px', borderRadius: '99px',
                background: active ? 'rgba(255,255,255,0.22)' : '#F4F6FB',
                color: active ? '#fff' : '#96AFCA',
              }}>
                {tab.count}
              </span>
            </button>
          )
        })}
      </div>

      {/* ── Results info ── */}
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', color: '#96AFCA', margin: 0 }}>
          {filtered.length === 0
            ? 'No results'
            : `${(safePage - 1) * PAGE_SIZE + 1}–${Math.min(safePage * PAGE_SIZE, filtered.length)} of ${filtered.length}`}
        </p>
        {(search || companyFilter !== 'all' || consentFilter !== 'all') && (
          <button
            onClick={() => { setSearch(''); setCompanyFilter('all'); setConsentFilter('all'); setPage(1) }}
            style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', color: '#96AFCA', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
          >
            Clear filters
          </button>
        )}
      </div>

      {/* ── Cards (scrollable) ── */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', scrollbarWidth: 'thin' }}>
        {paginated.length === 0 ? (
          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #D0DBE8', padding: '48px 24px', textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', color: '#5A7A9F', fontWeight: 600, margin: '0 0 4px' }}>No submissions found</p>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', color: '#96AFCA', margin: 0 }}>Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', paddingBottom: '4px' }}>
            {paginated.map((sub) => {
              const job      = sub.job_posts
              const company  = job?.employers?.company_name ?? null
              const consent  = getConsentBadge(sub.consent_status, sub.consent_token_expires_at)
              const pipeline = PIPELINE_STYLE[sub.status] ?? PIPELINE_STYLE.in_pipeline
              const showPipeline = sub.consent_status === 'consented' || sub.consent_status === null

              return (
                <div
                  key={sub.id}
                  style={{ display: 'flex', alignItems: 'center', gap: '13px', background: '#fff', borderRadius: '11px', border: '1px solid #D0DBE8', padding: '12px 18px' }}
                >
                  {/* Avatar */}
                  <div style={{ width: '34px', height: '34px', borderRadius: '9px', background: consent.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="15" height="15" fill="none" stroke={consent.color} strokeWidth={1.8} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
                    </svg>
                  </div>

                  {/* Name + job + company */}
                  <Link href={`/recruiter/dashboard/submissions/${sub.id}`} style={{ flex: 1, minWidth: 0, textDecoration: 'none' }}>
                    <p style={{ fontFamily: 'var(--font-ui)', fontSize: '13px', fontWeight: 700, color: '#032655', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {sub.candidate_name}
                    </p>
                    <p style={{ fontFamily: 'var(--font-ui)', fontSize: '11px', color: '#5A7A9F', margin: '2px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {job?.title ?? '—'}
                      {company ? <span style={{ color: '#96AFCA' }}> · {company}</span> : null}
                    </p>
                  </Link>

                  {/* Consent badge */}
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-ui)', fontSize: '10px', fontWeight: 700, padding: '3px 9px', borderRadius: '20px', background: consent.bg, color: consent.color, whiteSpace: 'nowrap', flexShrink: 0 }}>
                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: consent.dot }} />
                    {consent.label}
                  </span>

                  {/* Pipeline badge (consented only) */}
                  {showPipeline && (
                    <span style={{ fontFamily: 'var(--font-ui)', fontSize: '10px', fontWeight: 700, padding: '3px 9px', borderRadius: '20px', background: pipeline.bg, color: pipeline.color, whiteSpace: 'nowrap', flexShrink: 0 }}>
                      {pipeline.label}
                    </span>
                  )}

                  {/* Resend */}
                  {consent.showResend && <ResendConsentButton submissionId={sub.id} />}

                  {/* Date */}
                  <p style={{ fontFamily: 'var(--font-ui)', fontSize: '11px', color: '#96AFCA', whiteSpace: 'nowrap', flexShrink: 0, margin: 0 }}>
                    {new Date(sub.submitted_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>

                  {/* Chevron */}
                  <Link href={`/recruiter/dashboard/submissions/${sub.id}`} style={{ display: 'flex', flexShrink: 0 }}>
                    <svg width="13" height="13" fill="none" stroke="#D0DBE8" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', paddingTop: '4px' }}>
          {/* Prev */}
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={safePage === 1}
            style={{
              width: '30px', height: '30px', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1.5px solid #D0DBE8', background: safePage === 1 ? '#F5F8FC' : '#fff',
              cursor: safePage === 1 ? 'default' : 'pointer', color: safePage === 1 ? '#D0DBE8' : '#5A7A9F',
            }}
          >
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Page numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(n => n === 1 || n === totalPages || Math.abs(n - safePage) <= 1)
            .reduce<(number | '…')[]>((acc, n, idx, arr) => {
              if (idx > 0 && n - (arr[idx - 1] as number) > 1) acc.push('…')
              acc.push(n)
              return acc
            }, [])
            .map((n, i) =>
              n === '…' ? (
                <span key={`e${i}`} style={{ fontFamily: 'var(--font-ui)', fontSize: '12px', color: '#96AFCA', width: '30px', textAlign: 'center' }}>…</span>
              ) : (
                <button
                  key={n}
                  onClick={() => setPage(n as number)}
                  style={{
                    width: '30px', height: '30px', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: `1.5px solid ${safePage === n ? '#032655' : '#D0DBE8'}`,
                    background: safePage === n ? '#032655' : '#fff',
                    color: safePage === n ? '#fff' : '#5A7A9F',
                    fontFamily: 'var(--font-ui)', fontSize: '12px', fontWeight: 700, cursor: 'pointer',
                  }}
                >
                  {n}
                </button>
              )
            )}

          {/* Next */}
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={safePage === totalPages}
            style={{
              width: '30px', height: '30px', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1.5px solid #D0DBE8', background: safePage === totalPages ? '#F5F8FC' : '#fff',
              cursor: safePage === totalPages ? 'default' : 'pointer', color: safePage === totalPages ? '#D0DBE8' : '#5A7A9F',
            }}
          >
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
