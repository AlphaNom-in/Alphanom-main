'use client'

import { useState, KeyboardEvent } from 'react'
import { useRouter } from 'next/navigation'
import { createJobAction } from '../../lib/jobs/createJobAction'
import { DEPARTMENTS } from '../../lib/constants/departments'
import RichTextEditor from '../ui/RichTextEditor'

export default function PostJobForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [department, setDepartment] = useState('')
  const [location, setLocation] = useState('')
  const [workModel, setWorkModel] = useState('')
  const [budgetMin, setBudgetMin] = useState('')
  const [budgetMax, setBudgetMax] = useState('')
  const [noticePeriod, setNoticePeriod] = useState('')
  const [recruiterNote, setRecruiterNote] = useState('')
  const [mandatoryCriteria, setMandatoryCriteria] = useState<string[]>([])
  const [preferredCriteria, setPreferredCriteria] = useState<string[]>([])
  const [preferredCompanies, setPreferredCompanies] = useState<string[]>([])

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault()
    try {
      setLoading(true)
      await createJobAction({
        title,
        department,
        location,
        work_model: workModel,
        budget_min: Number(budgetMin),
        budget_max: Number(budgetMax),
        notice_period: noticePeriod,
        recruiter_note: recruiterNote,
        mandatory_criteria: mandatoryCriteria,
        preferred_criteria: preferredCriteria,
        preferred_companies: preferredCompanies,
      })
      router.push('/employer/dashboard/jobs')
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '680px' }}>
      <form
        onSubmit={handleSubmit}
        onKeyDown={e => { if (e.key === 'Enter' && (e.target as HTMLElement).tagName !== 'TEXTAREA' && (e.target as HTMLElement).tagName !== 'DIV') e.preventDefault() }}
        style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
      >

        {/* ── Job Details ──────────────────────────────────────────────────── */}
        <Section
          icon={
            <svg fill="none" stroke="#5A7A9F" strokeWidth={1.8} viewBox="0 0 24 24" style={{ width: '14px', height: '14px' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          }
          title="Job Details"
        >
          <Field label="Job Title *">
            <input
              style={input}
              placeholder="e.g. Senior Product Designer"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Field>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Field label="Department">
              <select style={input} value={department} onChange={(e) => setDepartment(e.target.value)}>
                <option value="">Select Department</option>
                {DEPARTMENTS.map((group) => (
                  <optgroup key={group.group} label={group.group}>
                    {group.items.map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </Field>
            <Field label="Location">
              <input
                style={input}
                placeholder="e.g. Mumbai"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </Field>
          </div>

          <Field label="Work Model">
            <select style={input} value={workModel} onChange={(e) => setWorkModel(e.target.value)}>
              <option value="">Select Work Model</option>
              <option value="On-site">On-site</option>
              <option value="Hybrid">Hybrid</option>
              <option value="WFH">WFH</option>
              <option value="Flexible">Flexible</option>
            </select>
          </Field>
        </Section>

        {/* ── Compensation ─────────────────────────────────────────────────── */}
        <Section
          icon={
            <svg fill="none" stroke="#5A7A9F" strokeWidth={1.8} viewBox="0 0 24 24" style={{ width: '14px', height: '14px' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          title="Compensation & Timeline"
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Field label="Budget Min (₹ LPA)">
              <input
                style={input}
                type="number"
                placeholder="e.g. 12"
                value={budgetMin}
                onChange={(e) => setBudgetMin(e.target.value)}
              />
            </Field>
            <Field label="Budget Max (₹ LPA)">
              <input
                style={input}
                type="number"
                placeholder="e.g. 20"
                value={budgetMax}
                onChange={(e) => setBudgetMax(e.target.value)}
              />
            </Field>
          </div>

          <Field label="Notice Period">
            <input
              style={input}
              placeholder="e.g. 30 days"
              value={noticePeriod}
              onChange={(e) => setNoticePeriod(e.target.value)}
            />
          </Field>
        </Section>

        {/* ── Requirements ─────────────────────────────────────────────────── */}
        <Section
          icon={
            <svg fill="none" stroke="#5A7A9F" strokeWidth={1.8} viewBox="0 0 24 24" style={{ width: '14px', height: '14px' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          title="Requirements"
        >
          <TagInput
            label="Must-Have Requirements"
            tags={mandatoryCriteria}
            onChange={setMandatoryCriteria}
            placeholder="e.g. 5+ years React — press Enter to add"
          />
          <TagInput
            label="Good to Have"
            tags={preferredCriteria}
            onChange={setPreferredCriteria}
            placeholder="e.g. GraphQL experience — press Enter to add"
          />
          <TagInput
            label="Preferred Company Backgrounds"
            tags={preferredCompanies}
            onChange={setPreferredCompanies}
            placeholder="e.g. Razorpay, Swiggy — press Enter to add"
          />
        </Section>

        {/* ── Job Description ───────────────────────────────────────────────── */}
        <Section
          icon={
            <svg fill="none" stroke="#5A7A9F" strokeWidth={1.8} viewBox="0 0 24 24" style={{ width: '14px', height: '14px' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
            </svg>
          }
          title="Job Description"
        >
          <Field label="Description for Recruiters">
            <RichTextEditor
              value={recruiterNote}
              onChange={setRecruiterNote}
              placeholder="Describe what you're looking for — ideal background, must-haves, preferred companies, etc."
              minHeight="200px"
            />
          </Field>
        </Section>

        {/* Submit */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '7px',
              padding: '11px 24px', borderRadius: '9px',
              background: loading ? '#96AFCA' : '#032655',
              color: '#fff', border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--font-ui)', fontSize: '0.875rem', fontWeight: 700,
            }}
          >
            {loading ? (
              <>
                <div style={{
                  width: '14px', height: '14px',
                  border: '2px solid rgba(255,255,255,0.35)',
                  borderTop: '2px solid #fff',
                  borderRadius: '50%',
                  animation: 'postSpin 0.7s linear infinite',
                }} />
                Posting…
              </>
            ) : (
              <>
                <svg fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24" style={{ width: '13px', height: '13px' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Create Job
              </>
            )}
          </button>
        </div>

        <style>{`@keyframes postSpin { to { transform: rotate(360deg) } }`}</style>
      </form>
    </div>
  )
}

/* ── Tag input (controlled) ────────────────────────────────────────────────── */
function TagInput({
  label,
  tags,
  onChange,
  placeholder,
}: {
  label: string
  tags: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
}) {
  const [inputVal, setInputVal] = useState('')

  function add() {
    const v = inputVal.trim()
    if (v && !tags.includes(v)) onChange([...tags, v])
    setInputVal('')
  }

  function remove(i: number) {
    onChange(tags.filter((_, idx) => idx !== i))
  }

  function onKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') { e.preventDefault(); add() }
    if (e.key === 'Backspace' && !inputVal && tags.length) remove(tags.length - 1)
  }

  return (
    <div>
      <label style={{ display: 'block', fontFamily: 'var(--font-ui)', fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.04em', color: '#5A7A9F', marginBottom: '5px' }}>
        {label}
      </label>
      <div style={{ border: '1.5px solid #D0DBE8', borderRadius: '9px', padding: '8px', background: '#fff', minHeight: '46px', display: 'flex', flexWrap: 'wrap' as const, gap: '6px', alignItems: 'center' }}>
        {tags.map((t, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 600, color: '#032655', background: '#EEF3F8', border: '1px solid #D0DBE8', borderRadius: '6px', padding: '3px 8px' }}>
            {t}
            <button type="button" onClick={() => remove(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#96AFCA', fontSize: '14px', lineHeight: 1, padding: 0, display: 'flex', alignItems: 'center' }}>×</button>
          </span>
        ))}
        <input
          value={inputVal}
          onChange={e => setInputVal(e.target.value)}
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

/* ── Shared style object ───────────────────────────────────────────────────── */
const input: React.CSSProperties = {
  width: '100%',
  padding: '10px 13px',
  borderRadius: '9px',
  border: '1.5px solid #D0DBE8',
  fontFamily: 'var(--font-ui)',
  fontSize: '0.875rem',
  color: '#032655',
  background: '#fff',
  outline: 'none',
  boxSizing: 'border-box',
}

/* ── Section card ──────────────────────────────────────────────────────────── */
function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
}) {
  return (
    <div style={{
      background: '#fff', borderRadius: '16px',
      border: '1px solid #D0DBE8', overflow: 'hidden',
      boxShadow: '0 2px 12px rgba(3,38,85,0.05)',
    }}>
      <div style={{
        padding: '13px 18px', borderBottom: '1px solid #EEF3F8',
        display: 'flex', alignItems: 'center', gap: '9px',
      }}>
        <div style={{
          width: '26px', height: '26px', borderRadius: '6px',
          background: '#EEF3F8',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {icon}
        </div>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', fontWeight: 700, color: '#032655' }}>
          {title}
        </p>
      </div>
      <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {children}
      </div>
    </div>
  )
}

/* ── Form field with label ─────────────────────────────────────────────────── */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{
        display: 'block',
        fontFamily: 'var(--font-ui)', fontSize: '0.68rem', fontWeight: 600,
        letterSpacing: '0.04em', color: '#5A7A9F', marginBottom: '5px',
      }}>
        {label}
      </label>
      {children}
    </div>
  )
}
