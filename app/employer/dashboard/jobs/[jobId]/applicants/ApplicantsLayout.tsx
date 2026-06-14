'use client'

import { useState, useTransition } from 'react'
import StatusSelect    from './StatusSelect'
import { markProfileViewed } from '@/lib/employer/unlockProfile'

type Applicant = {
  id: string
  candidate_name: string
  email: string | null
  phone: string | null
  current_job_title: string | null
  current_company: string | null
  current_ctc: number | null
  current_location: string | null
  total_experience: number | null
  notice_period: string | null
  linkedin_url: string | null
  portfolio_url: string | null
  resume_url: string | null
  recruiter_note: string | null
  status: string
  submitted_at: string
  profile_unlocked: boolean
  profile_unlocked_at: string | null
}

const STATUS = {
  in_pipeline:     { bg: '#EEF3F8', color: '#5A7A9F', accent: '#96AFCA', label: 'In Pipeline' },
  in_review:       { bg: '#EDE9FE', color: '#7C3AED', accent: '#7C3AED', label: 'In Review' },
  shortlisted:     { bg: '#D8F0EB', color: '#0A9E97', accent: '#0FB9B1', label: 'Shortlisted ⭐' },
  saved_for_later: { bg: '#FFF8E7', color: '#B7791F', accent: '#F5A623', label: 'Saved for Later' },
  hired:           { bg: '#C6F6D5', color: '#276749', accent: '#22C55E', label: 'Hired ✓' },
  rejected:        { bg: '#FFF5F5', color: '#C53030', accent: '#FC8181', label: 'Not Selected' },
} as const

function initials(name: string) {
  return name.split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase()
}

function fmtCTC(paise: number) {
  const L = paise / 100000
  return L >= 1 ? `₹${L % 1 === 0 ? L : L.toFixed(1)}L` : `₹${Math.round(paise / 1000)}K`
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.58rem', fontWeight: 700, color: '#96AFCA', textTransform: 'uppercase' as const, letterSpacing: '0.12em', margin: '0 0 10px' }}>
      {children}
    </p>
  )
}

export default function ApplicantsLayout({ applicants, jobId }: { applicants: Applicant[]; jobId: string }) {
  const [selectedId, setSelectedId] = useState<string | null>(applicants[0]?.id ?? null)
  const [viewedIds,  setViewedIds]  = useState<Set<string>>(
    () => new Set(applicants.filter(a => a.profile_unlocked).map(a => a.id))
  )
  const [, startTransition] = useTransition()

  const selected = applicants.find(a => a.id === selectedId) ?? null
  const st       = selected ? (STATUS[selected.status as keyof typeof STATUS] ?? STATUS.in_pipeline) : null

  function handleSelect(id: string) {
    setSelectedId(id)
    if (!viewedIds.has(id)) {
      startTransition(async () => {
        await markProfileViewed(id)
        setViewedIds(prev => new Set([...prev, id]))
      })
    }
  }

  if (!applicants.length) {
    return (
      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #D0DBE8', padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: '#EEF3F8', border: '1px solid #D0DBE8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <svg width="26" height="26" fill="none" stroke="#96AFCA" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
          </svg>
        </div>
        <p style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: '0.95rem', color: '#032655', margin: '0 0 6px' }}>No applicants yet</p>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', color: '#96AFCA', margin: 0 }}>Recruiters haven't submitted candidates for this role yet.</p>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>

      {/* ── LEFT PANEL ─────────────────────────────────────── */}
      <div style={{
        width: '360px', flexShrink: 0,
        display: 'flex', flexDirection: 'column', gap: '8px',
        height: 'calc(100vh - 280px)', minHeight: '400px',
        overflowY: 'auto', paddingRight: '4px',
        scrollbarWidth: 'thin', scrollbarColor: '#D0DBE8 transparent',
      } as React.CSSProperties}>
        {applicants.map((a) => {
          const ast     = STATUS[a.status as keyof typeof STATUS] ?? STATUS.in_pipeline
          const isSel   = a.id === selectedId
          const isViewed = viewedIds.has(a.id)
          return (
            <button
              key={a.id}
              type="button"
              onClick={() => handleSelect(a.id)}
              style={{
                width: '100%', textAlign: 'left',
                background: isSel ? '#EEF3F8' : isViewed ? '#fff' : '#F5F8FC',
                borderRadius: '14px',
                border: `1.5px solid ${isSel ? '#96AFCA' : '#D0DBE8'}`,
                borderLeft: `4px solid ${isSel ? '#032655' : ast.accent}`,
                padding: '15px 16px', cursor: 'pointer', outline: 'none',
                transition: 'border-color 0.12s, background 0.12s',
                boxShadow: isSel ? '0 2px 8px rgba(3,38,85,0.08)' : '0 1px 3px rgba(3,38,85,0.04)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                {/* Avatar */}
                <div style={{
                  width: '46px', height: '46px', borderRadius: '11px', flexShrink: 0,
                  background: isViewed ? 'linear-gradient(135deg, #032655 0%, #0FB9B1 100%)' : '#F1F5F9',
                  border: isViewed ? 'none' : '1.5px solid #E2E8F0',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: isViewed ? '0 3px 10px rgba(3,38,85,0.18)' : 'none',
                }}>
                  {isViewed ? (
                    <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 800, fontSize: '0.9rem', color: '#fff', letterSpacing: '-0.01em' }}>
                      {initials(a.candidate_name)}
                    </span>
                  ) : (
                    <svg width="18" height="18" fill="none" stroke="#94A3B8" strokeWidth={1.8} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  )}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  {/* Name */}
                  <div style={{ marginBottom: '4px' }}>
                    <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.9rem', fontWeight: 800, color: '#032655', letterSpacing: '-0.01em' }}>{a.candidate_name}</span>
                  </div>

                  {/* Subtitle */}
                  {(a.current_job_title || a.current_company) && (
                    <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.76rem', color: '#3D5A7A', fontWeight: 600, margin: '0 0 8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {[a.current_job_title, a.current_company].filter(Boolean).join(' · ')}
                    </p>
                  )}

                  {/* Status + date */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '3px 9px', borderRadius: '99px', background: ast.bg, border: `1px solid ${ast.accent}60` }}>
                      <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: ast.accent, flexShrink: 0 }} />
                      <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.62rem', fontWeight: 700, color: ast.color }}>{ast.label}</span>
                    </div>
                    <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.66rem', color: '#96AFCA', fontWeight: 500, flexShrink: 0 }}>
                      {new Date(a.submitted_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>

                  {/* Metrics */}
                  {(a.current_ctc != null || a.notice_period || a.total_experience != null) && (
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #EEF3F8' }}>
                      {a.current_ctc != null && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-ui)', fontSize: '0.72rem', color: '#5A7A9F', fontWeight: 600 }}>
                          <svg width="12" height="12" fill="none" stroke="#96AFCA" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          {fmtCTC(a.current_ctc)}
                        </span>
                      )}
                      {a.notice_period && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-ui)', fontSize: '0.72rem', color: '#5A7A9F', fontWeight: 600 }}>
                          <svg width="12" height="12" fill="none" stroke="#96AFCA" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
                          {a.notice_period}
                        </span>
                      )}
                      {a.total_experience != null && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-ui)', fontSize: '0.72rem', color: '#5A7A9F', fontWeight: 600 }}>
                          <svg width="12" height="12" fill="none" stroke="#96AFCA" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                          {a.total_experience} yr{a.total_experience !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* ── RIGHT PANEL ────────────────────────────────────── */}
      {selected && st && (
        <div style={{ flex: 1, minWidth: 0, background: '#fff', borderRadius: '16px', border: '1px solid #D0DBE8', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 280px)', minHeight: '400px', overflow: 'hidden' }}>

          {/* ── HEADER ── */}
          <div style={{ padding: '24px 28px 20px', borderBottom: '1px solid #EEF3F8', flexShrink: 0 }}>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '18px', marginBottom: '16px' }}>
              {/* Avatar */}
              <div style={{
                width: '64px', height: '64px', borderRadius: '16px', flexShrink: 0,
                background: viewedIds.has(selected.id) ? 'linear-gradient(135deg, #032655 0%, #0FB9B1 100%)' : '#F1F5F9',
                border: viewedIds.has(selected.id) ? 'none' : '2px solid #E2E8F0',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: viewedIds.has(selected.id) ? '0 6px 20px rgba(3,38,85,0.2)' : 'none',
              }}>
                {viewedIds.has(selected.id) ? (
                  <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 800, fontSize: '1.35rem', color: '#fff', letterSpacing: '-0.02em' }}>
                    {initials(selected.candidate_name)}
                  </span>
                ) : (
                  <svg width="26" height="26" fill="none" stroke="#94A3B8" strokeWidth={1.6} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                )}
              </div>

              {/* Name block */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <h2 style={{ fontFamily: 'var(--font-ui)', fontSize: '1.2rem', fontWeight: 800, color: '#032655', margin: '0 0 5px', letterSpacing: '-0.03em' }}>{selected.candidate_name}</h2>
                {(selected.current_job_title || selected.current_company) && (
                  <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.88rem', fontWeight: 600, color: '#5A7A9F', margin: '0 0 6px' }}>
                    {[selected.current_job_title, selected.current_company].filter(Boolean).join(' · ')}
                  </p>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                  {selected.current_location && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-ui)', fontSize: '0.72rem', color: '#96AFCA' }}>
                      <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                      {selected.current_location}
                    </span>
                  )}
                  <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', color: '#96AFCA' }}>
                    Submitted {new Date(selected.submitted_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>

              {/* Status badge */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '99px', background: st.bg, border: `1px solid ${st.accent}40`, flexShrink: 0 }}>
                <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: st.accent }} />
                <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.68rem', fontWeight: 700, color: st.color }}>{st.label}</span>
              </div>
            </div>

            {/* Action row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              {selected.resume_url && (
                <a href={selected.resume_url} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '9px', background: '#032655', color: '#fff', textDecoration: 'none', fontFamily: 'var(--font-ui)', fontSize: '0.75rem', fontWeight: 700 }}>
                  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                  View Resume
                </a>
              )}
              <StatusSelect submissionId={selected.id} jobId={jobId} currentStatus={selected.status} candidateName={selected.candidate_name} />
              {selected.email && (
                <a href={`mailto:${selected.email}`}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '8px 14px', borderRadius: '9px', border: '1.5px solid #D0DBE8', background: '#fff', color: '#5A7A9F', textDecoration: 'none', fontFamily: 'var(--font-ui)', fontSize: '0.75rem', fontWeight: 600 }}>
                  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                  Email
                </a>
              )}
              {selected.phone && (
                <a href={`tel:${selected.phone}`}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '8px 14px', borderRadius: '9px', border: '1.5px solid #D0DBE8', background: '#fff', color: '#5A7A9F', textDecoration: 'none', fontFamily: 'var(--font-ui)', fontSize: '0.75rem', fontWeight: 600 }}>
                  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
                  Call
                </a>
              )}
              {selected.linkedin_url && (
                <a href={selected.linkedin_url} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '8px 14px', borderRadius: '9px', border: '1.5px solid #D0DBE8', background: '#fff', color: '#0A66C2', textDecoration: 'none', fontFamily: 'var(--font-ui)', fontSize: '0.75rem', fontWeight: 700 }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                  LinkedIn
                </a>
              )}
              {selected.portfolio_url && (
                <a href={selected.portfolio_url} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '8px 14px', borderRadius: '9px', border: '1.5px solid #D0DBE8', background: '#fff', color: '#5A7A9F', textDecoration: 'none', fontFamily: 'var(--font-ui)', fontSize: '0.75rem', fontWeight: 700 }}>
                  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                  Portfolio
                </a>
              )}
            </div>
          </div>

          {/* ── SCROLLABLE BODY ── */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '22px 28px', display: 'flex', flexDirection: 'column', gap: '22px' }}>

            {/* Why is this candidate a fit */}
            {selected.recruiter_note && (
              <div>
                <SectionLabel>Why is this candidate a fit?</SectionLabel>
                <div style={{ background: '#F0FBF9', border: '1px solid rgba(15,185,177,0.2)', borderRadius: '12px', padding: '16px 18px' }}>
                  <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.88rem', color: '#032655', lineHeight: 1.8, margin: 0 }}>
                    {selected.recruiter_note}
                  </p>
                </div>
              </div>
            )}

            {/* Professional details */}
            {(selected.current_ctc != null || selected.notice_period || selected.total_experience != null || selected.current_location) && (
              <div>
                <SectionLabel>Professional Details</SectionLabel>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                  {selected.current_ctc != null && (
                    <div style={{ background: '#F5F8FC', borderRadius: '10px', padding: '12px 14px' }}>
                      <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.55rem', fontWeight: 700, color: '#96AFCA', textTransform: 'uppercase' as const, letterSpacing: '0.1em', margin: '0 0 4px' }}>Current CTC</p>
                      <p style={{ fontFamily: 'var(--font-ui)', fontSize: '1rem', fontWeight: 800, color: '#032655', margin: 0 }}>{fmtCTC(selected.current_ctc)}</p>
                    </div>
                  )}
                  {selected.notice_period && (
                    <div style={{ background: '#F5F8FC', borderRadius: '10px', padding: '12px 14px' }}>
                      <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.55rem', fontWeight: 700, color: '#96AFCA', textTransform: 'uppercase' as const, letterSpacing: '0.1em', margin: '0 0 4px' }}>Notice Period</p>
                      <p style={{ fontFamily: 'var(--font-ui)', fontSize: '1rem', fontWeight: 800, color: '#032655', margin: 0 }}>{selected.notice_period}</p>
                    </div>
                  )}
                  {selected.total_experience != null && (
                    <div style={{ background: '#F5F8FC', borderRadius: '10px', padding: '12px 14px' }}>
                      <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.55rem', fontWeight: 700, color: '#96AFCA', textTransform: 'uppercase' as const, letterSpacing: '0.1em', margin: '0 0 4px' }}>Experience</p>
                      <p style={{ fontFamily: 'var(--font-ui)', fontSize: '1rem', fontWeight: 800, color: '#032655', margin: 0 }}>{selected.total_experience} yr{selected.total_experience !== 1 ? 's' : ''}</p>
                    </div>
                  )}
                  {selected.current_location && (
                    <div style={{ background: '#F5F8FC', borderRadius: '10px', padding: '12px 14px' }}>
                      <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.55rem', fontWeight: 700, color: '#96AFCA', textTransform: 'uppercase' as const, letterSpacing: '0.1em', margin: '0 0 4px' }}>Location</p>
                      <p style={{ fontFamily: 'var(--font-ui)', fontSize: '1rem', fontWeight: 800, color: '#032655', margin: 0 }}>{selected.current_location}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Contact */}
            {(selected.email || selected.phone) && (
              <div>
                <SectionLabel>Contact</SectionLabel>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {selected.email && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', background: '#F5F8FC', borderRadius: '10px' }}>
                      <div style={{ width: '30px', height: '30px', borderRadius: '7px', background: '#EEF3F8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <svg width="14" height="14" fill="none" stroke="#5A7A9F" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                      </div>
                      <div>
                        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.55rem', fontWeight: 700, color: '#96AFCA', textTransform: 'uppercase' as const, letterSpacing: '0.1em', margin: '0 0 4px' }}>Email</p>
                        <a href={`mailto:${selected.email}`} style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', color: '#032655', textDecoration: 'none', fontWeight: 500 }}>{selected.email}</a>
                      </div>
                    </div>
                  )}
                  {selected.phone && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', background: '#F5F8FC', borderRadius: '10px' }}>
                      <div style={{ width: '30px', height: '30px', borderRadius: '7px', background: '#EEF3F8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <svg width="14" height="14" fill="none" stroke="#5A7A9F" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
                      </div>
                      <div>
                        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.55rem', fontWeight: 700, color: '#96AFCA', textTransform: 'uppercase' as const, letterSpacing: '0.1em', margin: '0 0 4px' }}>Phone</p>
                        <a href={`tel:${selected.phone}`} style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', color: '#032655', textDecoration: 'none', fontWeight: 500 }}>{selected.phone}</a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Links */}
            {(selected.linkedin_url || selected.portfolio_url) && (
              <div>
                <SectionLabel>Links</SectionLabel>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {selected.linkedin_url && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', background: '#F5F8FC', borderRadius: '10px' }}>
                      <div style={{ width: '30px', height: '30px', borderRadius: '7px', background: '#EEF3F8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="#0A66C2"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.55rem', fontWeight: 700, color: '#96AFCA', textTransform: 'uppercase' as const, letterSpacing: '0.1em', margin: '0 0 4px' }}>LinkedIn</p>
                        <a href={selected.linkedin_url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', color: '#0A66C2', textDecoration: 'none', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', display: 'block', whiteSpace: 'nowrap' }}>{selected.linkedin_url}</a>
                      </div>
                    </div>
                  )}
                  {selected.portfolio_url && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', background: '#F5F8FC', borderRadius: '10px' }}>
                      <div style={{ width: '30px', height: '30px', borderRadius: '7px', background: '#EEF3F8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <svg width="14" height="14" fill="none" stroke="#5A7A9F" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.55rem', fontWeight: 700, color: '#96AFCA', textTransform: 'uppercase' as const, letterSpacing: '0.1em', margin: '0 0 4px' }}>Portfolio</p>
                        <a href={selected.portfolio_url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', color: '#5A7A9F', textDecoration: 'none', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', display: 'block', whiteSpace: 'nowrap' }}>{selected.portfolio_url}</a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  )
}
