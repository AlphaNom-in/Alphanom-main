'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { submitCandidate } from '@/lib/recruiter/submitCandidate'

const STEPS = [
  { title: 'Candidate Info',       subtitle: 'Basic contact details for the candidate' },
  { title: 'Professional Details', subtitle: 'Experience, compensation and availability' },
  { title: 'Online Presence',      subtitle: 'Professional profiles and portfolio links' },
  { title: 'Resume & Note',        subtitle: 'Upload the resume and add your recommendation' },
  { title: 'Review & Submit',      subtitle: 'Confirm all details before submitting' },
]

const NOTICE_CHIPS = ['Immediate', '15 days', '30 days', '45 days', '60 days', '90 days']

export default function SubmitCandidateForm({ jobId, jobTitle }: { jobId: string; jobTitle: string }) {
  const router = useRouter()
  const [step,      setStep]      = useState(0)
  const [loading,   setLoading]   = useState(false)
  const [stepError, setStepError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  // Step 1 — Candidate Info
  const [candidateName,    setCandidateName]    = useState('')
  const [email,            setEmail]            = useState('')
  const [contactPrimary,   setContactPrimary]   = useState('')
  const [contactSecondary, setContactSecondary] = useState('')

  // Step 2 — Professional Details
  const [currentCtc,      setCurrentCtc]      = useState('')
  const [totalExperience, setTotalExperience] = useState('')
  const [currentLocation, setCurrentLocation] = useState('')
  const [noticePeriod,    setNoticePeriod]    = useState('')

  // Step 3 — Online Presence
  const [linkedinUrl,   setLinkedinUrl]   = useState('')
  const [portfolioUrl,  setPortfolioUrl]  = useState('')

  // Step 4 — Resume & Note
  const [resume,        setResume]        = useState<File | null>(null)
  const [recruiterNote, setRecruiterNote] = useState('')

  function validateStep(): boolean {
    setStepError('')
    if (step === 0) {
      if (!candidateName.trim())  { setStepError('Full name is required.'); return false }
      if (!email.trim())          { setStepError('Email address is required.'); return false }
      if (!contactPrimary.trim()) { setStepError('Primary contact number is required.'); return false }
    }
    if (step === 3) {
      if (!resume)                { setStepError('Please upload the candidate\'s resume.'); return false }
      if (!recruiterNote.trim())  { setStepError('Your note is required before submitting.'); return false }
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
    if (!resume) { setStepError('Resume is missing.'); return }
    try {
      setLoading(true)
      const fd = new FormData()
      fd.append('job_post_id',  jobId)
      fd.append('candidate_name', candidateName)
      fd.append('email',          email)
      fd.append('contact_primary', contactPrimary)
      if (contactSecondary) fd.append('contact_secondary', contactSecondary)
      if (currentCtc)       fd.append('current_ctc',       currentCtc)
      if (totalExperience)  fd.append('total_experience',  totalExperience)
      if (currentLocation)  fd.append('current_location',  currentLocation)
      if (noticePeriod)     fd.append('notice_period',     noticePeriod)
      if (linkedinUrl)      fd.append('linkedin_url',      linkedinUrl)
      if (portfolioUrl)     fd.append('portfolio_url',     portfolioUrl)
      fd.append('resume',         resume)
      fd.append('recruiter_note', recruiterNote)
      await submitCandidate(fd)
      setSubmitted(true)
    } catch (err: any) {
      setStepError(err.message ?? 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function resetForm() {
    setStep(0); setStepError(''); setSubmitted(false)
    setCandidateName(''); setEmail(''); setContactPrimary(''); setContactSecondary('')
    setCurrentCtc(''); setTotalExperience(''); setCurrentLocation(''); setNoticePeriod('')
    setLinkedinUrl(''); setPortfolioUrl(''); setResume(null); setRecruiterNote('')
  }

  const progress = ((step + 1) / STEPS.length) * 100

  /* ── Success state ──────────────────────────────────────────────────────── */
  if (submitted) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
        <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg,#D8F0EB,#B2E8E3)', border: '2px solid rgba(15,185,177,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', boxShadow: '0 8px 24px rgba(15,185,177,0.2)' }}>
          <svg width="32" height="32" fill="none" stroke="#0A9E97" strokeWidth={2.2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h3 style={{ fontFamily: 'var(--font-ui)', fontSize: '1.25rem', fontWeight: 800, color: '#032655', letterSpacing: '-0.025em', margin: '0 0 0.5rem' }}>
          Candidate Submitted!
        </h3>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.875rem', color: '#5A7A9F', lineHeight: 1.7, margin: '0 0 0.25rem' }}>
          <strong style={{ color: '#032655' }}>{candidateName}</strong> has been submitted for
        </p>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.875rem', color: '#5A7A9F', lineHeight: 1.7, margin: '0 0 1.75rem' }}>
          <strong style={{ color: '#0A9E97' }}>{jobTitle}</strong>
        </p>
        <div style={{ display: 'flex', gap: '1px', background: '#EEF3F8', borderRadius: '12px', overflow: 'hidden', marginBottom: '1.75rem' }}>
          {[
            { icon: '📋', label: 'In pipeline',  sub: 'Status set to In Pipeline' },
            { icon: '👀', label: 'Under review', sub: 'Employer will be notified' },
            { icon: '⚡', label: 'Live now',     sub: 'Visible on employer dashboard' },
          ].map((s, i) => (
            <div key={i} style={{ flex: 1, background: '#F5F8FC', padding: '12px 8px', textAlign: 'center' }}>
              <p style={{ fontSize: '1.1rem', margin: '0 0 3px' }}>{s.icon}</p>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', fontWeight: 700, color: '#032655', margin: '0 0 2px' }}>{s.label}</p>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.6rem', color: '#96AFCA', margin: 0 }}>{s.sub}</p>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={resetForm} style={{ padding: '10px 20px', borderRadius: '10px', border: '1.5px solid #D0DBE8', background: '#fff', color: '#032655', fontFamily: 'var(--font-ui)', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}>
            Submit Another
          </button>
          <button onClick={() => router.push('/recruiter/dashboard')} style={{ padding: '10px 20px', borderRadius: '10px', border: 'none', background: '#032655', color: '#fff', fontFamily: 'var(--font-ui)', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}>
            View Submissions →
          </button>
        </div>
      </div>
    )
  }

  /* ── Step form ──────────────────────────────────────────────────────────── */
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', paddingBottom: '2rem' }}>

      {/* ── Step indicator ──────────────────────────────────────────────── */}
      <div style={{ width: '100%', maxWidth: '560px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {STEPS.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
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
              {i < STEPS.length - 1 && (
                <div style={{
                  width: '76px', height: '2px', flexShrink: 0,
                  background: i < step ? '#0FB9B1' : '#D0DBE8',
                  transition: 'background 0.3s ease',
                }} />
              )}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
          {STEPS.map((s, i) => (
            <p key={i} style={{
              fontFamily: 'var(--font-ui)', fontSize: '0.6rem', margin: 0, textAlign: 'center',
              fontWeight: i === step ? 700 : 400,
              color: i === step ? '#032655' : i < step ? '#0FB9B1' : '#96AFCA',
              width: i === 0 || i === STEPS.length - 1 ? '60px' : '90px',
              transition: 'color 0.2s',
            }}>{s.title}</p>
          ))}
        </div>
      </div>

      {/* ── Card ────────────────────────────────────────────────────────── */}
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
              <svg width="14" height="14" fill="none" stroke="#DC2626" strokeWidth={2} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.008v.008H12v-.008z" />
              </svg>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: '#DC2626', margin: 0 }}>{stepError}</p>
            </div>
          )}

          {/* ── STEP 1: Candidate Info ──────────────────────────────────── */}
          {step === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <Field label="Full Name *">
                <input style={inp} placeholder="e.g. Priya Sharma" value={candidateName} onChange={e => setCandidateName(e.target.value)} autoFocus />
              </Field>
              <Field label="Email *">
                <input style={inp} type="email" placeholder="candidate@email.com" value={email} onChange={e => setEmail(e.target.value)} />
              </Field>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <Field label="Primary Contact *">
                  <input style={inp} type="tel" placeholder="+91 98765 43210" value={contactPrimary} onChange={e => setContactPrimary(e.target.value)} />
                </Field>
                <Field label="Secondary Contact">
                  <input style={inp} type="tel" placeholder="+91 98765 43210" value={contactSecondary} onChange={e => setContactSecondary(e.target.value)} />
                </Field>
              </div>
            </div>
          )}

          {/* ── STEP 2: Professional Details ───────────────────────────── */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <Field label="Current CTC (₹ LPA)">
                  <input style={inp} type="number" min={0} placeholder="e.g. 12" value={currentCtc} onChange={e => setCurrentCtc(e.target.value)} autoFocus />
                </Field>
                <Field label="Total Experience (years)">
                  <input style={inp} type="number" min={0} placeholder="e.g. 5" value={totalExperience} onChange={e => setTotalExperience(e.target.value)} />
                </Field>
              </div>
              <Field label="Current Location">
                <input style={inp} placeholder="e.g. Bangalore" value={currentLocation} onChange={e => setCurrentLocation(e.target.value)} />
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

          {/* ── STEP 3: Online Presence ─────────────────────────────────── */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <Field label="LinkedIn URL">
                <input style={inp} type="url" placeholder="https://linkedin.com/in/…" value={linkedinUrl} onChange={e => setLinkedinUrl(e.target.value)} autoFocus />
              </Field>
              <Field label="Portfolio / GitHub URL">
                <input style={inp} type="url" placeholder="https://…" value={portfolioUrl} onChange={e => setPortfolioUrl(e.target.value)} />
              </Field>
              <div style={{ background: '#F8FAFC', border: '1px solid #E8EEF4', borderRadius: '10px', padding: '12px 16px' }}>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', color: '#5A7A9F', margin: 0, lineHeight: 1.6 }}>
                  Both fields are optional. A LinkedIn profile helps employers quickly verify the candidate's background.
                </p>
              </div>
            </div>
          )}

          {/* ── STEP 4: Resume & Note ───────────────────────────────────── */}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
              <div>
                <label style={lbl}>Resume <span style={{ color: '#DC2626' }}>*</span></label>
                <div style={{
                  position: 'relative', border: resume ? '1.5px solid #0FB9B1' : '1.5px dashed #D0DBE8',
                  borderRadius: '10px', padding: '20px', background: resume ? '#F0FBF9' : '#F8FAFC',
                  textAlign: 'center', transition: 'all 0.2s', cursor: 'pointer',
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
                <label style={lbl}>Your Note <span style={{ color: '#DC2626' }}>*</span></label>
                <textarea
                  rows={5}
                  placeholder="Why are you recommending this candidate? Any context the employer should know…"
                  value={recruiterNote}
                  onChange={e => setRecruiterNote(e.target.value)}
                  style={{ ...inp, resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.6 }}
                />
              </div>
            </div>
          )}

          {/* ── STEP 5: Review & Submit ─────────────────────────────────── */}
          {step === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

              <ReviewSection label="Candidate Info" onEdit={() => { setStep(0); setStepError('') }}>
                <p style={rv.title}>{candidateName}</p>
                <p style={rv.secondary}>{email}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '6px', marginTop: '8px' }}>
                  <Chip>{contactPrimary}</Chip>
                  {contactSecondary && <Chip>{contactSecondary}</Chip>}
                </div>
              </ReviewSection>

              <ReviewSection label="Professional Details" onEdit={() => { setStep(1); setStepError('') }}>
                {(currentCtc || totalExperience) && (
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' as const }}>
                    {currentCtc      && <Chip color="navy">₹{currentCtc}L PA</Chip>}
                    {totalExperience && <Chip color="teal">{totalExperience} yrs exp</Chip>}
                  </div>
                )}
                {currentLocation && <p style={{ ...rv.secondary, marginTop: '6px' }}>{currentLocation}</p>}
                {noticePeriod    && <p style={rv.secondary}>{noticePeriod} notice period</p>}
                {!currentCtc && !totalExperience && !currentLocation && !noticePeriod && (
                  <p style={rv.empty}>Not specified</p>
                )}
              </ReviewSection>

              <ReviewSection label="Online Presence" onEdit={() => { setStep(2); setStepError('') }}>
                {linkedinUrl  && <p style={{ ...rv.value, wordBreak: 'break-all' as const }}>{linkedinUrl}</p>}
                {portfolioUrl && <p style={{ ...rv.secondary, wordBreak: 'break-all' as const, marginTop: linkedinUrl ? '4px' : 0 }}>{portfolioUrl}</p>}
                {!linkedinUrl && !portfolioUrl && <p style={rv.empty}>No links added</p>}
              </ReviewSection>

              <ReviewSection label="Resume & Note" onEdit={() => { setStep(3); setStepError('') }}>
                {resume && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                    <svg width="13" height="13" fill="none" stroke="#0A9E97" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                    <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: '#032655', fontWeight: 600 }}>{resume.name}</span>
                  </div>
                )}
                {recruiterNote && (
                  <p style={{ ...rv.value, lineHeight: 1.6, WebkitLineClamp: 3, display: '-webkit-box', WebkitBoxOrient: 'vertical' as any, overflow: 'hidden' }}>
                    {recruiterNote.slice(0, 220)}{recruiterNote.length > 220 ? '…' : ''}
                  </p>
                )}
              </ReviewSection>

              <div style={{ background: '#F0FBF9', border: '1px solid rgba(15,185,177,0.25)', borderRadius: '10px', padding: '12px 16px', display: 'flex', gap: '10px', alignItems: 'flex-start', marginTop: '4px' }}>
                <svg width="15" height="15" fill="none" stroke="#0A9E97" strokeWidth={2} viewBox="0 0 24 24" style={{ flexShrink: 0, marginTop: '1px' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                </svg>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: '#0A9E97', margin: 0, lineHeight: 1.55 }}>
                  Submitting for <strong>{jobTitle}</strong>. The employer will be notified instantly after submission.
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
                <><div style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.35)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'submitSpin 0.7s linear infinite' }} />Submitting…</>
              ) : (
                <>Submit Candidate<svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg></>
              )}
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes submitSpin { to { transform: rotate(360deg) } }
        input[type=number]::-webkit-outer-spin-button,
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
      `}</style>
    </div>
  )
}

/* ── ReviewSection ──────────────────────────────────────────────────────────── */
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
    teal:    { background: '#D8F0EB', color: '#0A9E97', border: '1px solid rgba(15,185,177,0.25)' },
    navy:    { background: '#EEF3F8', color: '#032655', border: '1px solid #D0DBE8' },
    default: { background: '#F5F8FC', color: '#5A7A9F', border: '1px solid #D0DBE8' },
  }
  const s = color ? styles[color] : styles.default
  return (
    <span style={{ display: 'inline-block', fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 600, padding: '3px 9px', borderRadius: '6px', ...s }}>
      {children}
    </span>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={lbl}>{label}</label>
      {children}
    </div>
  )
}

/* ── Shared styles ──────────────────────────────────────────────────────────── */
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

const rv = {
  title:     { fontFamily: 'var(--font-ui)', fontSize: '0.95rem', fontWeight: 700, color: '#032655', margin: 0 } as React.CSSProperties,
  value:     { fontFamily: 'var(--font-ui)', fontSize: '0.82rem', color: '#032655', margin: 0 } as React.CSSProperties,
  secondary: { fontFamily: 'var(--font-ui)', fontSize: '0.75rem', color: '#5A7A9F', margin: '5px 0 0' } as React.CSSProperties,
  empty:     { fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: '#96AFCA', margin: 0, fontStyle: 'italic' } as React.CSSProperties,
}
