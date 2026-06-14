'use client'

import { useState, useTransition, useRef, KeyboardEvent } from 'react'
import { useRouter } from 'next/navigation'
import { updateJob } from '@/lib/employer/updateJob'
import { DEPARTMENTS } from '@/lib/constants/departments'
import RichTextEditor from '@/components/ui/RichTextEditor'

/* ── shared styles ─────────────────────────────────────────────────────── */
const inp: React.CSSProperties = {
  width: '100%', padding: '10px 13px', borderRadius: '9px',
  border: '1.5px solid #D0DBE8', fontFamily: 'var(--font-ui)',
  fontSize: '0.875rem', color: '#032655', background: '#fff',
  outline: 'none', boxSizing: 'border-box' as const,
}
const lbl: React.CSSProperties = {
  display: 'block', fontFamily: 'var(--font-ui)', fontSize: '0.68rem',
  fontWeight: 700, letterSpacing: '0.04em', color: '#5A7A9F', marginBottom: '5px',
}

/* ── Tag input ─────────────────────────────────────────────────────────── */
function TagInput({
  label, name, initial = [], placeholder,
}: {
  label: string; name: string; initial?: string[]; placeholder?: string
}) {
  const [tags, setTags]   = useState<string[]>(initial)
  const [input, setInput] = useState('')

  function add() {
    const v = input.trim()
    if (v && !tags.includes(v)) setTags(t => [...t, v])
    setInput('')
  }

  function remove(i: number) { setTags(t => t.filter((_, idx) => idx !== i)) }

  function onKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') { e.preventDefault(); add() }
    if (e.key === 'Backspace' && !input && tags.length) remove(tags.length - 1)
  }

  return (
    <div>
      <label style={lbl}>{label}</label>
      <input type="hidden" name={name} value={JSON.stringify(tags)} />

      <div style={{ border: '1.5px solid #D0DBE8', borderRadius: '9px', padding: '8px', background: '#fff', minHeight: '46px', display: 'flex', flexWrap: 'wrap' as const, gap: '6px', alignItems: 'center' }}>
        {tags.map((t, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 600, color: '#032655', background: '#EEF3F8', border: '1px solid #D0DBE8', borderRadius: '6px', padding: '3px 8px' }}>
            {t}
            <button type="button" onClick={() => remove(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#96AFCA', fontSize: '14px', lineHeight: 1, padding: 0, display: 'flex', alignItems: 'center' }}>×</button>
          </span>
        ))}
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={onKey}
          onBlur={add}
          placeholder={tags.length === 0 ? (placeholder ?? 'Type and press Enter…') : ''}
          style={{ border: 'none', outline: 'none', fontFamily: 'var(--font-ui)', fontSize: '0.82rem', color: '#032655', flex: '1', minWidth: '140px', background: 'transparent', padding: '2px 4px' }}
        />
      </div>
      <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.62rem', color: '#96AFCA', marginTop: '4px' }}>
        Press Enter or click away to add · Backspace to remove last
      </p>
    </div>
  )
}

/* ── Section card ──────────────────────────────────────────────────────── */
function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #D0DBE8', overflow: 'hidden', boxShadow: '0 2px 12px rgba(3,38,85,0.04)' }}>
      <div style={{ padding: '13px 18px', borderBottom: '1px solid #EEF3F8', display: 'flex', alignItems: 'center', gap: '9px' }}>
        <div style={{ width: '26px', height: '26px', borderRadius: '6px', background: '#EEF3F8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5A7A9F' }}>{icon}</div>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', fontWeight: 700, color: '#032655', margin: 0 }}>{title}</p>
      </div>
      <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>{children}</div>
    </div>
  )
}

/* ── Convert stored budget back to LPA for display ─────────────────────── */
function toLPADisplay(val: number | null | undefined): string {
  if (!val || val <= 0) return ''
  if (val >= 100000) return (val / 100000).toFixed(0)
  return String(val) // already in LPA (old format)
}

/* ── Props ─────────────────────────────────────────────────────────────── */
type Job = {
  id: string; title: string; department: string | null; location: string | null
  work_model: string | null; budget_min: number | null; budget_max: number | null
  notice_period: string | null; recruiter_note: string | null
  mandatory_criteria: string[] | null; preferred_criteria: string[] | null
  preferred_companies: string[] | null; application_limit: number | null
}

export default function EditJobForm({ job }: { job: Job }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const data = new FormData(e.currentTarget)
    startTransition(async () => {
      try {
        await updateJob(job.id, data)
        router.push(`/employer/dashboard/jobs/${job.id}`)
        router.refresh()
      } catch (err: any) {
        setError(err.message ?? 'Something went wrong. Please try again.')
      }
    })
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      onKeyDown={e => { if (e.key === 'Enter' && (e.target as HTMLElement).tagName !== 'TEXTAREA') e.preventDefault() }}
      style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '720px' }}
    >

      {/* Job Details */}
      <Section title="Job Details" icon={<svg fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" style={{ width: '14px', height: '14px' }}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>}>
        <div>
          <label style={lbl}>Job Title <span style={{ color: '#E53E3E' }}>*</span></label>
          <input name="title" required defaultValue={job.title} placeholder="e.g. Senior Product Designer" style={inp} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={lbl}>Department</label>
            <select name="department" defaultValue={job.department ?? ''} style={{ ...inp, cursor: 'pointer' }}>
              <option value="">Select Department</option>
              {DEPARTMENTS.map(g => (
                <optgroup key={g.group} label={g.group}>
                  {g.items.map(d => <option key={d} value={d}>{d}</option>)}
                </optgroup>
              ))}
            </select>
          </div>
          <div>
            <label style={lbl}>Location</label>
            <input name="location" defaultValue={job.location ?? ''} placeholder="e.g. Mumbai" style={inp} />
          </div>
        </div>
        <div>
          <label style={lbl}>Work Model</label>
          <select name="work_model" defaultValue={job.work_model ?? ''} style={{ ...inp, cursor: 'pointer' }}>
            <option value="">Select Work Model</option>
            {['On-site', 'Hybrid', 'WFH', 'Flexible'].map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </Section>

      {/* Compensation */}
      <Section title="Compensation & Timeline" icon={<svg fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" style={{ width: '14px', height: '14px' }}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={lbl}>Budget Min (₹ LPA)</label>
            <input name="budget_min" type="number" min={0} defaultValue={toLPADisplay(job.budget_min)} placeholder="e.g. 12" style={inp} />
          </div>
          <div>
            <label style={lbl}>Budget Max (₹ LPA)</label>
            <input name="budget_max" type="number" min={0} defaultValue={toLPADisplay(job.budget_max)} placeholder="e.g. 20" style={inp} />
          </div>
        </div>
        <div>
          <label style={lbl}>Notice Period</label>
          <input name="notice_period" defaultValue={job.notice_period ?? ''} placeholder="e.g. 30 days" style={inp} />
        </div>
        <div>
          <label style={lbl}>Application Limit</label>
          <input
            name="application_limit"
            type="number"
            min={1}
            defaultValue={job.application_limit ?? ''}
            placeholder="Leave blank for unlimited"
            style={inp}
          />
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.62rem', color: '#96AFCA', marginTop: '4px' }}>
            Job will auto-pause once this many submissions are received. Clear to remove the limit.
          </p>
        </div>
      </Section>

      {/* Requirements */}
      <Section title="Requirements" icon={<svg fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" style={{ width: '14px', height: '14px' }}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}>
        <TagInput
          label="Must-Have Requirements"
          name="mandatory_criteria"
          initial={job.mandatory_criteria ?? []}
          placeholder="e.g. 5+ years React — press Enter to add"
        />
        <TagInput
          label="Good to Have"
          name="preferred_criteria"
          initial={job.preferred_criteria ?? []}
          placeholder="e.g. GraphQL experience — press Enter to add"
        />
        <TagInput
          label="Preferred Company Backgrounds"
          name="preferred_companies"
          initial={job.preferred_companies ?? []}
          placeholder="e.g. Razorpay, Swiggy — press Enter to add"
        />
      </Section>

      {/* Job Description */}
      <Section title="Job Description" icon={<svg fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" style={{ width: '14px', height: '14px' }}><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" /></svg>}>
        <div>
          <label style={lbl}>Description for Recruiters</label>
          <RichTextEditor
            name="recruiter_note"
            value={job.recruiter_note ?? ''}
            placeholder="Describe the role, ideal background, what good looks like…"
            minHeight="200px"
          />
        </div>
      </Section>

      {/* Error */}
      {error && (
        <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '10px', padding: '11px 14px', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
          <svg width="14" height="14" fill="none" stroke="#DC2626" strokeWidth={2} viewBox="0 0 24 24" style={{ flexShrink: 0, marginTop: '1px' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.008v.008H12v-.008z" />
          </svg>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: '#DC2626', margin: 0 }}>{error}</p>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <button
          type="submit"
          disabled={pending}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '11px 24px', borderRadius: '9px', border: 'none', background: pending ? '#96AFCA' : '#032655', color: '#fff', fontFamily: 'var(--font-ui)', fontSize: '0.875rem', fontWeight: 700, cursor: pending ? 'not-allowed' : 'pointer', transition: 'background 0.18s' }}
        >
          {pending ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} style={{ animation: 'editSpin 0.8s linear infinite' }}>
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
              Saving…
            </>
          ) : (
            <>
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              Save Changes
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          style={{ padding: '11px 20px', borderRadius: '9px', border: '1.5px solid #D0DBE8', background: '#fff', color: '#5A7A9F', fontFamily: 'var(--font-ui)', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}
        >
          Cancel
        </button>
      </div>

      <style>{`@keyframes editSpin { to { transform: rotate(360deg) } }`}</style>
    </form>
  )
}
