'use client'

import { useState } from 'react'
import { submitLead } from './actions'

type Job = {
  title: string
  department: string | null
  location: string | null
  work_model: string | null
  budget_min: number | null
  budget_max: number | null
  notice_period: string | null
}

const STEPS = [
  { title: 'Personal Info',       subtitle: 'Basic contact details' },
  { title: 'Professional Details',subtitle: 'Compensation & availability' },
  { title: 'Online Presence',     subtitle: 'Professional profiles & links' },
  { title: 'Resume & Cover Note', subtitle: "Upload your resume and tell us why you're a fit" },
]

const NOTICE_CHIPS = ['Immediate', '15 days', '30 days', '45 days', '60 days', '90 days']

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

const hint: React.CSSProperties = {
  fontFamily: 'var(--font-ui)', fontSize: '0.65rem', color: '#96AFCA', margin: '4px 0 0',
}

function Field({ label, required, children, hint: hintText }: { label: string; required?: boolean; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label style={lbl}>
        {label}{required && <span style={{ color: '#DC2626' }}> *</span>}
      </label>
      {children}
      {hintText && <p style={hint}>{hintText}</p>}
    </div>
  )
}

export default function ApplyForm({ job, slugData }: { job: Job; slugData: { recruiterId: string; jobPostId: string } }) {
  const [step,    setStep]    = useState(0)
  const [error,   setError]   = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [done,    setDone]    = useState(false)

  // Step 1
  const [name,         setName]         = useState('')
  const [email,        setEmail]        = useState('')
  const [phone,        setPhone]        = useState('')
  const [jobTitle,     setJobTitle]     = useState('')
  const [company,      setCompany]      = useState('')

  // Step 2
  const [currentCtc,   setCurrentCtc]   = useState('')
  const [experience,   setExperience]   = useState('')
  const [location,     setLocation]     = useState('')
  const [notice,       setNotice]       = useState('')

  // Step 3
  const [linkedin,     setLinkedin]     = useState('')
  const [portfolio,    setPortfolio]    = useState('')

  // Step 4
  const [resume,       setResume]       = useState<File | null>(null)
  const [coverNote,    setCoverNote]    = useState('')

  function validate(): string | null {
    if (step === 0) {
      if (!name.trim())    return 'Full name is required.'
      if (name.trim().length < 2) return 'Name must be at least 2 characters.'
      if (!email.trim())   return 'Email is required.'
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return 'Enter a valid email address.'
      if (!/^[6-9]\d{9}$/.test(phone)) return 'Enter a valid 10-digit mobile number starting with 6, 7, 8 or 9.'
      if (!jobTitle.trim()) return 'Current job title is required.'
      if (!company.trim())  return 'Current company is required.'
    }
    if (step === 1) {
      if (!currentCtc)  return 'Current CTC is required.'
      if (!experience && experience !== '0') return 'Total experience is required.'
      if (!location.trim()) return 'Current location is required.'
      if (!notice.trim())   return 'Notice period is required.'
    }
    if (step === 2) {
      if (!linkedin.trim()) return 'LinkedIn profile URL is required.'
    }
    if (step === 3) {
      if (!resume) return 'Please upload your resume.'
      if (!coverNote.trim()) return 'Please write a cover note.'
      if (coverNote.trim().length < 80) return 'Please write at least 80 characters in your cover note.'
    }
    return null
  }

  function handleNext() {
    const err = validate()
    if (err) { setError(err); return }
    setError(null)
    setStep(s => s + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleBack() {
    setError(null)
    setStep(s => s - 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleSubmit() {
    const err = validate()
    if (err) { setError(err); return }
    setError(null)
    setLoading(true)

    const fd = new FormData()
    fd.set('name',              name)
    fd.set('email',             email)
    fd.set('phone',             phone)
    fd.set('current_job_title', jobTitle)
    fd.set('current_company',   company)
    fd.set('current_ctc',       currentCtc)
    fd.set('total_experience',  experience)
    fd.set('current_location',  location)
    fd.set('notice_period',     notice)
    fd.set('linkedin_url',      linkedin)
    fd.set('portfolio_url',     portfolio)
    fd.set('cover_note',        coverNote)
    if (resume) fd.set('resume', resume)

    const result = await submitLead(slugData, fd)
    setLoading(false)

    if (!result.ok) { setError(result.error); return }
    setDone(true)
  }

  /* ── Success screen ─────────────────────────────────────────────────── */
  if (done) {
    const salaryLabel = job.budget_min && job.budget_max
      ? `₹${(job.budget_min / 100000).toFixed(0)}–${(job.budget_max / 100000).toFixed(0)} LPA`
      : null
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <div style={{ width: '68px', height: '68px', borderRadius: '50%', background: 'linear-gradient(135deg,#0FB9B1,#0A9E97)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 8px 24px rgba(15,185,177,0.3)' }}>
          <svg width="30" height="30" fill="none" stroke="#fff" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h2 style={{ fontFamily: 'var(--font-ui)', fontSize: '1.3rem', fontWeight: 800, color: '#032655', margin: '0 0 8px', letterSpacing: '-0.02em' }}>
          Application Submitted!
        </h2>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.88rem', color: '#5A7A9F', lineHeight: 1.7, margin: '0 0 6px' }}>
          Your application for <strong>{job.title}</strong> has been received.
        </p>
        {salaryLabel && (
          <span style={{ display: 'inline-block', fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 700, color: '#0A9E97', background: '#D8F0EB', borderRadius: '20px', padding: '3px 10px', marginBottom: '14px' }}>
            {salaryLabel}
          </span>
        )}
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.8rem', color: '#96AFCA', lineHeight: 1.7, margin: 0 }}>
          A recruiter will review your profile. If selected, you'll receive a consent email before your profile is shared with any employer.
        </p>
      </div>
    )
  }

  const salaryLabel = job.budget_min && job.budget_max
    ? `₹${(job.budget_min / 100000).toFixed(0)}–${(job.budget_max / 100000).toFixed(0)} LPA`
    : null

  const progress = ((step + 1) / STEPS.length) * 100

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Job banner */}
      <div style={{ background: 'linear-gradient(135deg, #032655 0%, #0a3d7a 100%)', borderRadius: '14px', padding: '20px 24px' }}>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.58rem', fontWeight: 700, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.14em', margin: '0 0 5px' }}>
          Applying for
        </p>
        <h1 style={{ fontFamily: 'var(--font-ui)', fontSize: '1.15rem', fontWeight: 800, color: '#fff', margin: '0 0 10px', letterSpacing: '-0.02em' }}>
          {job.title}
        </h1>
        <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap' }}>
          {job.department && <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.68rem', color: 'rgba(255,255,255,0.65)', background: 'rgba(255,255,255,0.1)', padding: '3px 10px', borderRadius: '20px' }}>{job.department}</span>}
          {job.location   && <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.68rem', color: 'rgba(255,255,255,0.65)', background: 'rgba(255,255,255,0.1)', padding: '3px 10px', borderRadius: '20px' }}>📍 {job.location}</span>}
          {job.work_model && <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.68rem', color: 'rgba(255,255,255,0.65)', background: 'rgba(255,255,255,0.1)', padding: '3px 10px', borderRadius: '20px' }}>{job.work_model}</span>}
          {salaryLabel    && <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.68rem', fontWeight: 700, color: '#7EECEA', background: 'rgba(15,185,177,0.18)', padding: '3px 10px', borderRadius: '20px' }}>{salaryLabel}</span>}
        </div>
      </div>

      {/* Step indicator */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0 }}>
        {STEPS.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 700,
              background: i < step ? '#0FB9B1' : i === step ? '#032655' : '#EEF3F8',
              color: i <= step ? '#fff' : '#96AFCA',
              boxShadow: i === step ? '0 0 0 4px rgba(3,38,85,0.12)' : 'none',
              transition: 'all 0.25s',
            }}>
              {i < step ? (
                <svg width="12" height="12" fill="none" stroke="#fff" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              ) : String(i + 1)}
            </div>
            {i < STEPS.length - 1 && (
              <div style={{ width: '56px', height: '2px', background: i < step ? '#0FB9B1' : '#D0DBE8', transition: 'background 0.25s' }} />
            )}
          </div>
        ))}
      </div>

      {/* Card */}
      <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #D0DBE8', boxShadow: '0 8px 40px rgba(3,38,85,0.08)', overflow: 'hidden' }}>
        {/* Progress bar */}
        <div style={{ height: '3px', background: '#EEF3F8' }}>
          <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg,#032655,#0FB9B1)', transition: 'width 0.4s ease' }} />
        </div>

        <div style={{ padding: '32px 36px 24px' }}>
          {/* Step header */}
          <div style={{ marginBottom: '24px' }}>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.54rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#0FB9B1', margin: '0 0 6px' }}>
              Step {step + 1} of {STEPS.length}
            </p>
            <h2 style={{ fontFamily: 'var(--font-ui)', fontSize: '1.3rem', fontWeight: 800, color: '#032655', letterSpacing: '-0.025em', margin: '0 0 4px', lineHeight: 1.2 }}>
              {STEPS[step].title}
            </h2>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.8rem', color: '#5A7A9F', margin: 0 }}>
              {STEPS[step].subtitle}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '10px', padding: '10px 14px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="14" height="14" fill="none" stroke="#DC2626" strokeWidth={2} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.008v.008H12v-.008z" />
              </svg>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: '#DC2626', margin: 0 }}>{error}</p>
            </div>
          )}

          {/* ── Step 1: Personal Info ─────────────────────────────────── */}
          {step === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <Field label="Full Name" required>
                <input style={inp} placeholder="e.g. Priya Sharma" value={name} onChange={e => setName(e.target.value)} autoFocus />
              </Field>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <Field label="Email Address" required>
                  <input style={inp} type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} />
                </Field>
                <Field label="Phone Number" required hint="10-digit Indian mobile number">
                  <input style={inp} type="tel" placeholder="9XXXXXXXXX" maxLength={10} value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} />
                </Field>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <Field label="Current Job Title" required>
                  <input style={inp} placeholder="e.g. Senior Engineer" value={jobTitle} onChange={e => setJobTitle(e.target.value)} />
                </Field>
                <Field label="Current Company" required>
                  <input style={inp} placeholder="e.g. Infosys" value={company} onChange={e => setCompany(e.target.value)} />
                </Field>
              </div>
            </div>
          )}

          {/* ── Step 2: Professional Details ─────────────────────────── */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <Field label="Current CTC (₹ LPA)" required>
                <input style={inp} type="number" min={0} placeholder="e.g. 12" value={currentCtc} onChange={e => setCurrentCtc(e.target.value)} autoFocus />
              </Field>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <Field label="Total Experience (years)" required>
                  <input style={inp} type="number" min={0} step={0.5} placeholder="e.g. 5" value={experience} onChange={e => setExperience(e.target.value)} />
                </Field>
                <Field label="Current Location" required>
                  <input style={inp} placeholder="e.g. Bengaluru" value={location} onChange={e => setLocation(e.target.value)} />
                </Field>
              </div>
              <Field label="Notice Period" required>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px', marginBottom: '10px' }}>
                  {NOTICE_CHIPS.map(n => (
                    <button key={n} type="button" onClick={() => setNotice(notice === n ? '' : n)} style={{
                      padding: '9px 6px', borderRadius: '8px', fontFamily: 'var(--font-ui)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
                      border: `1.5px solid ${notice === n ? '#0FB9B1' : '#D0DBE8'}`,
                      background: notice === n ? '#D8F0EB' : '#fff',
                      color: notice === n ? '#0A9E97' : '#5A7A9F',
                    }}>{n}</button>
                  ))}
                </div>
                <input style={inp} placeholder="Or type custom — e.g. 2 months" value={notice} onChange={e => setNotice(e.target.value)} />
              </Field>
            </div>
          )}

          {/* ── Step 3: Online Presence ───────────────────────────────── */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <Field label="LinkedIn Profile URL" required>
                <input style={inp} type="url" placeholder="https://linkedin.com/in/yourname" value={linkedin} onChange={e => setLinkedin(e.target.value)} autoFocus />
              </Field>
              <Field label="Portfolio / GitHub URL" hint="Optional — but strongly recommended">
                <input style={inp} type="url" placeholder="https://github.com/yourname" value={portfolio} onChange={e => setPortfolio(e.target.value)} />
              </Field>
            </div>
          )}

          {/* ── Step 4: Resume & Cover Note ──────────────────────────── */}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
              <div>
                <label style={lbl}>Resume <span style={{ color: '#DC2626' }}>*</span></label>
                <div style={{
                  position: 'relative', border: resume ? '1.5px solid #0FB9B1' : '1.5px dashed #D0DBE8',
                  borderRadius: '10px', padding: '20px', background: resume ? '#F0FBF9' : '#F8FAFC',
                  textAlign: 'center', cursor: 'pointer',
                }}>
                  {resume ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                      <svg width="18" height="18" fill="none" stroke="#0A9E97" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                      <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', fontWeight: 600, color: '#032655' }}>{resume.name}</span>
                      <button type="button" onClick={e => { e.stopPropagation(); setResume(null) }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#96AFCA', fontSize: '18px', lineHeight: 1, padding: 0 }}>×</button>
                    </div>
                  ) : (
                    <>
                      <svg width="24" height="24" fill="none" stroke="#96AFCA" strokeWidth={1.5} viewBox="0 0 24 24" style={{ margin: '0 auto 8px', display: 'block' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                      </svg>
                      <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', color: '#5A7A9F', margin: '0 0 4px' }}>Click to upload resume</p>
                      <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.62rem', color: '#96AFCA', margin: 0 }}>PDF, DOC or DOCX — max 10 MB</p>
                    </>
                  )}
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={e => setResume(e.target.files?.[0] ?? null)}
                    style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }}
                  />
                </div>
              </div>

              <div>
                <label style={lbl}>Why are you a good fit for this role? <span style={{ color: '#DC2626' }}>*</span></label>
                <textarea
                  rows={6}
                  placeholder={`Briefly describe your relevant experience and why you're excited about this role.\n\nE.g. specific skills, domain experience, or what draws you to this opportunity.`}
                  value={coverNote}
                  onChange={e => setCoverNote(e.target.value)}
                  style={{ ...inp, resize: 'vertical', lineHeight: 1.65 }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                  <p style={hint}>Minimum 80 characters</p>
                  <p style={{ ...hint, flexShrink: 0, color: coverNote.trim().length >= 80 ? '#0A9E97' : '#96AFCA' }}>
                    {coverNote.trim().length}/80
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div style={{ padding: '16px 36px 24px', borderTop: '1px solid #EEF3F8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                <>
                  <div style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.35)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                  Submitting…
                </>
              ) : (
                <>Submit Application <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg></>
              )}
            </button>
          )}
        </div>
      </div>

      <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', color: '#96AFCA', textAlign: 'center', margin: 0, lineHeight: 1.6 }}>
        Your information is only shared with the recruiter. You'll receive a consent email before your profile is shown to any employer.
      </p>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        input[type=number]::-webkit-outer-spin-button,
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
      `}</style>
    </div>
  )
}
