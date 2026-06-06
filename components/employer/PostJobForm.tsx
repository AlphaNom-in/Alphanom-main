'use client'

import { useState, KeyboardEvent } from 'react'
import { useRouter } from 'next/navigation'
import { createJobAction } from '../../lib/jobs/createJobAction'
import { DEPARTMENTS } from '../../lib/constants/departments'
import RichTextEditor from '../ui/RichTextEditor'

const STEPS = [
  { title: 'Job Basics',       subtitle: 'Tell us about the role you\'re hiring for' },
  { title: 'Compensation',     subtitle: 'Set the budget and availability expectations' },
  { title: 'Requirements',     subtitle: 'Define what you\'re looking for in candidates' },
  { title: 'Job Description',  subtitle: 'Add context to help recruiters find the right fit' },
  { title: 'Review & Post',    subtitle: 'Check everything before publishing to 1,500+ recruiters' },
]

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&[a-z]+;/gi, ' ').replace(/\s+/g, ' ').trim()
}

function fmtBudget(val: string): string | null {
  const n = Number(val)
  if (!n || n <= 0) return null
  return `₹${n}L PA`
}

const WORK_MODELS  = ['On-site', 'Hybrid', 'WFH', 'Flexible']
const NOTICE_CHIPS = ['Immediate', '15 days', '30 days', '45 days', '60 days', '90 days']

export default function PostJobForm() {
  const router = useRouter()

  const [step,      setStep]      = useState(0)
  const [loading,   setLoading]   = useState(false)
  const [stepError, setStepError] = useState('')

  const [title,              setTitle]              = useState('')
  const [department,         setDepartment]         = useState('')
  const [location,           setLocation]           = useState('')
  const [workModel,          setWorkModel]          = useState('')
  const [budgetMin,          setBudgetMin]          = useState('')
  const [budgetMax,          setBudgetMax]          = useState('')
  const [noticePeriod,       setNoticePeriod]       = useState('')
  const [recruiterNote,      setRecruiterNote]      = useState('')
  const [mandatoryCriteria,  setMandatoryCriteria]  = useState<string[]>([])
  const [preferredCriteria,  setPreferredCriteria]  = useState<string[]>([])
  const [preferredCompanies, setPreferredCompanies] = useState<string[]>([])

  function validateStep(): boolean {
    setStepError('')
    if (step === 0 && !title.trim()) {
      setStepError('Job title is required to continue.')
      return false
    }
    return true
  }

  function handleNext() {
    if (!validateStep()) return
    setStep(s => s + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleBack() {
    setStepError('')
    setStep(s => s - 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleSubmit() {
    setStepError('')
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
    } catch (err: any) {
      setStepError(err.message ?? 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const progress = ((step + 1) / STEPS.length) * 100

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', paddingBottom: '2rem' }}>

      {/* ── Step indicator ─────────────────────────────────────────────── */}
      <div style={{ width: '100%', maxWidth: '560px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {STEPS.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
              {/* Circle */}
              <div style={{
                width: '34px', height: '34px', borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-ui)', fontSize: '0.75rem', fontWeight: 700,
                background: i < step ? '#0FB9B1' : i === step ? '#032655' : '#EEF3F8',
                color: i <= step ? '#fff' : '#96AFCA',
                boxShadow: i === step ? '0 0 0 4px rgba(3,38,85,0.12)' : 'none',
                transition: 'all 0.3s ease',
              }}>
                {i < step ? (
                  <svg width="13" height="13" fill="none" stroke="#fff" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                ) : String(i + 1)}
              </div>
              {/* Connecting line */}
              {i < STEPS.length - 1 && (
                <div style={{
                  width: '96px', height: '2px', flexShrink: 0,
                  background: i < step
                    ? 'linear-gradient(90deg,#0FB9B1,#0FB9B1)'
                    : 'linear-gradient(90deg,#D0DBE8,#D0DBE8)',
                  transition: 'background 0.3s ease',
                }} />
              )}
            </div>
          ))}
        </div>
        {/* Labels */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', paddingLeft: '0px' }}>
          {STEPS.map((s, i) => (
            <p key={i} style={{
              fontFamily: 'var(--font-ui)', fontSize: '0.6rem', margin: 0, textAlign: 'center',
              fontWeight: i === step ? 700 : 400,
              color: i === step ? '#032655' : i < step ? '#0FB9B1' : '#96AFCA',
              width: i === 0 || i === STEPS.length - 1 ? '60px' : '130px',
              transition: 'color 0.2s',
            }}>{s.title}</p>
          ))}
        </div>
      </div>

      {/* ── Card ───────────────────────────────────────────────────────── */}
      <div style={{
        width: '100%', maxWidth: '560px',
        background: '#fff', borderRadius: '20px',
        border: '1px solid #D0DBE8',
        boxShadow: '0 8px 40px rgba(3,38,85,0.09)',
        overflow: 'hidden',
      }}>
        {/* Progress bar */}
        <div style={{ height: '3px', background: '#EEF3F8' }}>
          <div style={{
            width: `${progress}%`, height: '100%',
            background: 'linear-gradient(90deg,#032655,#0FB9B1)',
            transition: 'width 0.45s cubic-bezier(0.4,0,0.2,1)',
          }} />
        </div>

        {/* Content */}
        <div style={{ padding: '36px 40px 28px' }}>
          {/* Step header */}
          <div style={{ marginBottom: '28px' }}>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.56rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: '#0FB9B1', margin: '0 0 7px' }}>
              Step {step + 1} of {STEPS.length}
            </p>
            <h2 style={{ fontFamily: 'var(--font-ui)', fontSize: '1.45rem', fontWeight: 800, color: '#032655', letterSpacing: '-0.025em', margin: '0 0 5px', lineHeight: 1.2 }}>
              {STEPS[step].title}
            </h2>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', color: '#5A7A9F', margin: 0, lineHeight: 1.55 }}>
              {STEPS[step].subtitle}
            </p>
          </div>

          {/* Error */}
          {stepError && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '10px', padding: '10px 14px', marginBottom: '22px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="14" height="14" fill="none" stroke="#DC2626" strokeWidth={2} viewBox="0 0 24 24" style={{ flexShrink: 0 }}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.008v.008H12v-.008z" /></svg>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: '#DC2626', margin: 0 }}>{stepError}</p>
            </div>
          )}

          {/* ── STEP 1: Job Basics ─────────────────────────────────────── */}
          {step === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <Field label="Job Title *">
                <input
                  style={inp} placeholder="e.g. Senior Product Designer"
                  value={title} onChange={e => setTitle(e.target.value)} autoFocus
                />
              </Field>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <Field label="Department">
                  <select style={inp} value={department} onChange={e => setDepartment(e.target.value)}>
                    <option value="">Select…</option>
                    {DEPARTMENTS.map(g => (
                      <optgroup key={g.group} label={g.group}>
                        {g.items.map(d => <option key={d} value={d}>{d}</option>)}
                      </optgroup>
                    ))}
                  </select>
                </Field>
                <Field label="Location">
                  <input style={inp} placeholder="e.g. Mumbai" value={location} onChange={e => setLocation(e.target.value)} />
                </Field>
              </div>

              <Field label="Work Model">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '8px' }}>
                  {WORK_MODELS.map(m => (
                    <button key={m} type="button" onClick={() => setWorkModel(workModel === m ? '' : m)} style={{
                      padding: '10px 6px', borderRadius: '9px', fontFamily: 'var(--font-ui)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                      border: `1.5px solid ${workModel === m ? '#032655' : '#D0DBE8'}`,
                      background: workModel === m ? '#032655' : '#fff',
                      color: workModel === m ? '#fff' : '#5A7A9F',
                    }}>{m}</button>
                  ))}
                </div>
              </Field>
            </div>
          )}

          {/* ── STEP 2: Compensation ───────────────────────────────────── */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
              <Field label="Budget Range (₹ LPA)">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '10px', alignItems: 'center' }}>
                  <input style={inp} type="number" min={0} placeholder="Min  e.g. 12" value={budgetMin} onChange={e => setBudgetMin(e.target.value)} />
                  <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', color: '#96AFCA', fontWeight: 500, textAlign: 'center' }}>—</span>
                  <input style={inp} type="number" min={0} placeholder="Max  e.g. 24" value={budgetMax} onChange={e => setBudgetMax(e.target.value)} />
                </div>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.62rem', color: '#96AFCA', marginTop: '5px' }}>Enter annual CTC in LPA. Recruiters see this to qualify candidates.</p>
              </Field>

              <Field label="Notice Period">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px', marginBottom: '10px' }}>
                  {NOTICE_CHIPS.map(n => (
                    <button key={n} type="button" onClick={() => setNoticePeriod(noticePeriod === n ? '' : n)} style={{
                      padding: '9px 6px', borderRadius: '8px', fontFamily: 'var(--font-ui)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                      border: `1.5px solid ${noticePeriod === n ? '#0FB9B1' : '#D0DBE8'}`,
                      background: noticePeriod === n ? '#D8F0EB' : '#fff',
                      color: noticePeriod === n ? '#0A9E97' : '#5A7A9F',
                    }}>{n}</button>
                  ))}
                </div>
                <input style={inp} placeholder="Or type custom  e.g. 2 months" value={noticePeriod} onChange={e => setNoticePeriod(e.target.value)} />
              </Field>
            </div>
          )}

          {/* ── STEP 3: Requirements ───────────────────────────────────── */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
              <TagInput
                label="Must-Have Requirements"
                hint="Skills or experience candidates must have"
                tags={mandatoryCriteria} onChange={setMandatoryCriteria}
                placeholder="e.g. 5+ years React — press Enter"
              />
              <TagInput
                label="Good to Have"
                hint="Nice extras, not dealbreakers"
                tags={preferredCriteria} onChange={setPreferredCriteria}
                placeholder="e.g. GraphQL — press Enter"
              />
              <TagInput
                label="Preferred Company Backgrounds"
                hint="Candidates from these companies are a bonus"
                tags={preferredCompanies} onChange={setPreferredCompanies}
                placeholder="e.g. Razorpay, Swiggy — press Enter"
              />
            </div>
          )}

          {/* ── STEP 4: Job Description ────────────────────────────────── */}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={lbl}>Description for Recruiters <span style={{ color: '#96AFCA', fontWeight: 400 }}>(optional)</span></label>
              <RichTextEditor
                value={recruiterNote} onChange={setRecruiterNote}
                placeholder="Describe the ideal candidate, responsibilities, what success looks like in this role…"
                minHeight="220px"
              />
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.62rem', color: '#96AFCA', margin: '2px 0 0' }}>
                Use bold, italic, and bullet points to make it scannable for recruiters.
              </p>
            </div>
          )}

          {/* ── STEP 5: Review & Post ──────────────────────────────────── */}
          {step === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

              {/* Job Basics */}
              <ReviewSection label="Job Basics" onEdit={() => { setStep(0); setStepError('') }}>
                <p style={rv.title}>{title}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '6px', marginTop: '8px' }}>
                  {department    && <Chip>{department}</Chip>}
                  {location      && <Chip>{location}</Chip>}
                  {workModel     && <Chip color="teal">{workModel}</Chip>}
                </div>
              </ReviewSection>

              {/* Compensation */}
              <ReviewSection label="Compensation" onEdit={() => { setStep(1); setStepError('') }}>
                {(budgetMin || budgetMax) ? (
                  <p style={rv.value}>
                    {fmtBudget(budgetMin) && fmtBudget(budgetMax)
                      ? `${fmtBudget(budgetMin)} — ${fmtBudget(budgetMax)}`
                      : fmtBudget(budgetMin) || fmtBudget(budgetMax)}
                    {' '}annual CTC
                  </p>
                ) : <p style={rv.empty}>Not specified</p>}
                {noticePeriod && <p style={rv.secondary}>{noticePeriod} notice period</p>}
              </ReviewSection>

              {/* Requirements */}
              <ReviewSection label="Requirements" onEdit={() => { setStep(2); setStepError('') }}>
                {mandatoryCriteria.length > 0 && (
                  <div style={{ marginBottom: '8px' }}>
                    <p style={rv.label}>Must-Have</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '5px', marginTop: '4px' }}>
                      {mandatoryCriteria.map((c, i) => <Chip key={i} color="navy">{c}</Chip>)}
                    </div>
                  </div>
                )}
                {preferredCriteria.length > 0 && (
                  <div style={{ marginBottom: '8px' }}>
                    <p style={rv.label}>Good to Have</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '5px', marginTop: '4px' }}>
                      {preferredCriteria.map((c, i) => <Chip key={i}>{c}</Chip>)}
                    </div>
                  </div>
                )}
                {preferredCompanies.length > 0 && (
                  <div>
                    <p style={rv.label}>Preferred Companies</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '5px', marginTop: '4px' }}>
                      {preferredCompanies.map((c, i) => <Chip key={i} color="teal">{c}</Chip>)}
                    </div>
                  </div>
                )}
                {mandatoryCriteria.length === 0 && preferredCriteria.length === 0 && preferredCompanies.length === 0 && (
                  <p style={rv.empty}>No requirements added</p>
                )}
              </ReviewSection>

              {/* Job Description */}
              <ReviewSection label="Job Description" onEdit={() => { setStep(3); setStepError('') }}>
                {recruiterNote ? (
                  <p style={{ ...rv.value, lineHeight: 1.6, WebkitLineClamp: 4, display: '-webkit-box', WebkitBoxOrient: 'vertical' as any, overflow: 'hidden' }}>
                    {stripHtml(recruiterNote).slice(0, 220)}{stripHtml(recruiterNote).length > 220 ? '…' : ''}
                  </p>
                ) : <p style={rv.empty}>No description added</p>}
              </ReviewSection>

              {/* Publish note */}
              <div style={{ background: '#F0FBF9', border: '1px solid rgba(15,185,177,0.25)', borderRadius: '10px', padding: '12px 16px', display: 'flex', gap: '10px', alignItems: 'flex-start', marginTop: '4px' }}>
                <svg width="15" height="15" fill="none" stroke="#0A9E97" strokeWidth={2} viewBox="0 0 24 24" style={{ flexShrink: 0, marginTop: '1px' }}><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: '#0A9E97', margin: 0, lineHeight: 1.55 }}>
                  Once posted, this job will be visible to <strong>1,500+ specialist recruiters</strong> and they will receive an email notification instantly.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div style={{ padding: '18px 40px 24px', borderTop: '1px solid #EEF3F8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {step > 0 ? (
            <button type="button" onClick={handleBack} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 18px', borderRadius: '9px', border: '1.5px solid #D0DBE8', background: '#fff', color: '#5A7A9F', fontFamily: 'var(--font-ui)', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
              Back
            </button>
          ) : <div />}

          {step < STEPS.length - 1 ? (
            <button type="button" onClick={handleNext} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '11px 26px', borderRadius: '9px', background: '#032655', color: '#fff', border: 'none', fontFamily: 'var(--font-ui)', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}>
              Continue
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </button>
          ) : (
            <button type="button" onClick={handleSubmit} disabled={loading} style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '11px 26px', borderRadius: '9px', background: loading ? '#96AFCA' : '#0FB9B1', color: '#fff', border: 'none', fontFamily: 'var(--font-ui)', fontSize: '0.82rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? (
                <><div style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.35)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'postSpin 0.7s linear infinite' }} />Posting…</>
              ) : (
                <><svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>Post Job</>
              )}
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes postSpin { to { transform: rotate(360deg) } }
        input[type=number]::-webkit-outer-spin-button,
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
      `}</style>
    </div>
  )
}

/* ── TagInput ──────────────────────────────────────────────────────────────── */
function TagInput({ label, hint, tags, onChange, placeholder }: {
  label: string; hint?: string; tags: string[]; onChange: (t: string[]) => void; placeholder?: string
}) {
  const [val, setVal] = useState('')

  function add() {
    const v = val.trim()
    if (v && !tags.includes(v)) onChange([...tags, v])
    setVal('')
  }

  function remove(i: number) { onChange(tags.filter((_, idx) => idx !== i)) }

  function onKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') { e.preventDefault(); add() }
    if (e.key === 'Backspace' && !val && tags.length) remove(tags.length - 1)
  }

  return (
    <div>
      <label style={lbl}>{label}</label>
      {hint && <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.62rem', color: '#96AFCA', margin: '-2px 0 6px' }}>{hint}</p>}
      <div style={{ border: '1.5px solid #D0DBE8', borderRadius: '10px', padding: '8px 10px', background: '#fff', minHeight: '48px', display: 'flex', flexWrap: 'wrap' as const, gap: '6px', alignItems: 'center' }}>
        {tags.map((t, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 600, color: '#032655', background: '#EEF3F8', border: '1px solid #D0DBE8', borderRadius: '6px', padding: '4px 9px' }}>
            {t}
            <button type="button" onClick={() => remove(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#96AFCA', fontSize: '15px', lineHeight: 1, padding: 0, display: 'flex', alignItems: 'center' }}>×</button>
          </span>
        ))}
        <input
          value={val} onChange={e => setVal(e.target.value)} onKeyDown={onKey} onBlur={add}
          placeholder={tags.length === 0 ? (placeholder ?? 'Type and press Enter…') : ''}
          style={{ border: 'none', outline: 'none', fontFamily: 'var(--font-ui)', fontSize: '0.82rem', color: '#032655', flex: '1', minWidth: '140px', background: 'transparent', padding: '2px 4px' }}
        />
      </div>
      <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.6rem', color: '#96AFCA', marginTop: '4px' }}>
        Press Enter or click away to add · Backspace removes last
      </p>
    </div>
  )
}

/* ── Review section ───────────────────────────────────────────────────────── */
function ReviewSection({ label, onEdit, children }: { label: string; onEdit: () => void; children: React.ReactNode }) {
  return (
    <div style={{ border: '1px solid #E8EEF4', borderRadius: '12px', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', background: '#F8FAFC', borderBottom: '1px solid #E8EEF4' }}>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', fontWeight: 700, color: '#3D5A7A', textTransform: 'uppercase' as const, letterSpacing: '0.08em', margin: 0 }}>{label}</p>
        <button type="button" onClick={onEdit} style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 700, color: '#0FB9B1', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          Edit
        </button>
      </div>
      <div style={{ padding: '14px 16px' }}>{children}</div>
    </div>
  )
}

function Chip({ children, color }: { children: React.ReactNode; color?: 'teal' | 'navy' }) {
  const styles = {
    teal: { background: '#D8F0EB', color: '#0A9E97', border: '1px solid rgba(15,185,177,0.25)' },
    navy: { background: '#EEF3F8', color: '#032655', border: '1px solid #D0DBE8' },
    default: { background: '#F5F8FC', color: '#5A7A9F', border: '1px solid #D0DBE8' },
  }
  const s = color ? styles[color] : styles.default
  return (
    <span style={{ display: 'inline-block', fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 600, padding: '3px 9px', borderRadius: '6px', ...s }}>
      {children}
    </span>
  )
}

const rv = {
  title:     { fontFamily: 'var(--font-ui)', fontSize: '0.95rem', fontWeight: 700, color: '#032655', margin: 0 } as React.CSSProperties,
  value:     { fontFamily: 'var(--font-ui)', fontSize: '0.82rem', color: '#032655', margin: 0 } as React.CSSProperties,
  secondary: { fontFamily: 'var(--font-ui)', fontSize: '0.75rem', color: '#5A7A9F', margin: '5px 0 0' } as React.CSSProperties,
  empty:     { fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: '#96AFCA', margin: 0, fontStyle: 'italic' } as React.CSSProperties,
  label:     { fontFamily: 'var(--font-ui)', fontSize: '0.6rem', fontWeight: 700, color: '#96AFCA', letterSpacing: '0.08em', textTransform: 'uppercase' as const, margin: 0 } as React.CSSProperties,
}

/* ── Shared styles ─────────────────────────────────────────────────────────── */
const inp: React.CSSProperties = {
  width: '100%', padding: '11px 14px', borderRadius: '9px',
  border: '1.5px solid #D0DBE8', fontFamily: 'var(--font-ui)',
  fontSize: '0.875rem', color: '#032655', background: '#fff',
  outline: 'none', boxSizing: 'border-box',
}

const lbl: React.CSSProperties = {
  display: 'block', fontFamily: 'var(--font-ui)', fontSize: '0.7rem',
  fontWeight: 700, letterSpacing: '0.04em', color: '#3D5A7A', marginBottom: '6px',
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={lbl}>{label}</label>
      {children}
    </div>
  )
}
