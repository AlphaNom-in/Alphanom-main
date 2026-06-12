'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { submitCandidate } from '@/lib/recruiter/submitCandidate'
import { createClient } from '@/lib/supabase/client'

const STEPS = [
  { title: 'Candidate Info',       subtitle: 'Basic contact details for the candidate' },
  { title: 'Professional Details', subtitle: 'Compensation, availability and candidate confirmation' },
  { title: 'Online Presence',      subtitle: 'Professional profiles and portfolio links' },
  { title: 'Resume & Fit Reason',  subtitle: 'Upload the resume and explain why this candidate fits' },
  { title: 'Review & Submit',      subtitle: 'Confirm all details before submitting' },
]

const NOTICE_CHIPS = ['Immediate', '15 days', '30 days', '45 days', '60 days', '90 days']

const NAME_REGEX  = /^[A-Za-z\s'\-\.]{2,}$/
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function validatePhone(raw: string): string | null {
  const val = raw.trim()
  if (!val) return 'Phone number is required.'
  if (!/^[6-9]\d{9}$/.test(val)) return 'Enter a valid 10-digit mobile number starting with 6, 7, 8 or 9.'
  return null
}

export default function SubmitCandidateForm({ jobId, jobTitle }: { jobId: string; jobTitle: string }) {
  const router = useRouter()
  const [step,      setStep]      = useState(0)
  const [loading,        setLoading]        = useState(false)
  const [stepError,      setStepError]      = useState('')
  const [submitted,        setSubmitted]        = useState(false)
  const [consentEmail,     setConsentEmail]     = useState('')
  const [submissionId,     setSubmissionId]     = useState('')
  const [consentReceived,  setConsentReceived]  = useState(false)
  const [consentDeclined,  setConsentDeclined]  = useState(false)

  // Step 1 — Candidate Info
  const [candidateName,    setCandidateName]    = useState('')
  const [email,            setEmail]            = useState('')
  const [phone,            setPhone]            = useState('')
  const [currentJobTitle,  setCurrentJobTitle]  = useState('')
  const [currentCompany,   setCurrentCompany]   = useState('')

  // Step 2 — Professional Details
  const [currentCtc,      setCurrentCtc]      = useState('')
  const [expectedCtc,     setExpectedCtc]     = useState('')
  const [totalExperience, setTotalExperience] = useState('')
  const [currentLocation, setCurrentLocation] = useState('')
  const [noticePeriod,    setNoticePeriod]    = useState('')
  const [candidateAware,  setCandidateAware]  = useState(false)

  // Step 3 — Online Presence
  const [linkedinUrl,  setLinkedinUrl]  = useState('')
  const [portfolioUrl, setPortfolioUrl] = useState('')

  // Step 4 — Resume & Fit Reason
  const [resume,      setResume]      = useState<File | null>(null)
  const [fitReason,   setFitReason]   = useState('')

  function validateStep(): boolean {
    setStepError('')

    if (step === 0) {
      if (!candidateName.trim()) { setStepError('Full name is required.'); return false }
      if (candidateName.trim().length < 2) { setStepError('Full name must be at least 2 characters.'); return false }
      if (!NAME_REGEX.test(candidateName.trim())) { setStepError('Full name may only contain letters, spaces, hyphens or apostrophes.'); return false }
      if (!email.trim()) { setStepError('Email address is required.'); return false }
      if (!EMAIL_REGEX.test(email.trim())) { setStepError('Please enter a valid email address.'); return false }
      const phoneErr = validatePhone(phone)
      if (phoneErr) { setStepError(phoneErr); return false }
      if (!currentJobTitle.trim()) { setStepError('Current job title is required.'); return false }
      if (!currentCompany.trim()) { setStepError('Current company is required.'); return false }
    }

    if (step === 1) {
      if (!currentCtc) { setStepError('Current CTC is required — confirm this with the candidate before submitting.'); return false }
      if (Number(currentCtc) < 0) { setStepError('Current CTC cannot be negative.'); return false }
      if (!expectedCtc) { setStepError('Expected CTC is required — confirm this with the candidate before submitting.'); return false }
      if (Number(expectedCtc) < 0) { setStepError('Expected CTC cannot be negative.'); return false }
      if (!noticePeriod.trim()) { setStepError('Notice period is required — confirm this with the candidate before submitting.'); return false }
      if (!totalExperience && totalExperience !== '0') { setStepError('Total experience is required.'); return false }
      if (Number(totalExperience) < 0) { setStepError('Total experience cannot be negative.'); return false }
      if (!currentLocation.trim()) { setStepError('Current location is required.'); return false }
    }

    if (step === 2) {
      if (!linkedinUrl.trim())  { setStepError('LinkedIn profile URL is required.'); return false }
      if (!portfolioUrl.trim()) { setStepError('Portfolio / GitHub URL is required.'); return false }
    }

    if (step === 3) {
      if (!resume) { setStepError("Please upload the candidate's resume."); return false }
      if (!fitReason.trim()) { setStepError('Please explain why this candidate is a good fit.'); return false }
      if (fitReason.trim().length < 100) { setStepError('Please write at least 2 lines (minimum 100 characters) explaining why this candidate is a good fit.'); return false }
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
    if (!candidateAware) { setStepError('You must confirm the candidate is actively aware of and interested in this specific role before submitting.'); return }
    if (!resume) { setStepError('Resume is missing.'); return }
    try {
      setLoading(true)
      const fd = new FormData()
      fd.append('job_post_id',    jobId)
      fd.append('candidate_name',   candidateName)
      fd.append('email',            email)
      fd.append('phone',            phone)
      fd.append('current_job_title', currentJobTitle)
      fd.append('current_company',  currentCompany)
      fd.append('current_ctc',      currentCtc)
      fd.append('expected_ctc',   expectedCtc)
      fd.append('total_experience', totalExperience)
      fd.append('current_location', currentLocation)
      fd.append('notice_period',  noticePeriod)
      fd.append('linkedin_url',   linkedinUrl)
      fd.append('portfolio_url',  portfolioUrl)
      fd.append('resume',         resume)
      fd.append('fit_reason',     fitReason)
      const result = await submitCandidate(fd)
      setConsentEmail(result.candidateEmail ?? email)
      setSubmissionId(result.submissionId)
      setSubmitted(true)
    } catch (err: any) {
      setStepError(err.message ?? 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function resetForm() {
    setStep(0); setStepError(''); setSubmitted(false)
    setConsentReceived(false); setConsentDeclined(false); setSubmissionId(''); setConsentEmail('')
    setCandidateName(''); setEmail(''); setPhone(''); setCurrentJobTitle(''); setCurrentCompany('')
    setCurrentCtc(''); setExpectedCtc(''); setTotalExperience(''); setCurrentLocation(''); setNoticePeriod(''); setCandidateAware(false)
    setLinkedinUrl(''); setPortfolioUrl(''); setResume(null); setFitReason('')
  }

  // Realtime consent listener — fires when candidate clicks confirm link
  useEffect(() => {
    if (!submissionId || !submitted) return
    const supabase = createClient()
    const channel  = supabase
      .channel(`consent-${submissionId}`)
      .on('postgres_changes', {
        event:  'UPDATE',
        schema: 'public',
        table:  'candidate_submissions',
        filter: `id=eq.${submissionId}`,
      }, (payload: any) => {
        if (payload.new?.consent_status === 'consented')  setConsentReceived(true)
        if (payload.new?.consent_status === 'withdrawn')  setConsentDeclined(true)
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [submissionId, submitted])

  const progress = ((step + 1) / STEPS.length) * 100

  /* ── Candidate confirmed (realtime) ─────────────────────────────────────── */
  if (submitted && consentReceived) {
    return (
      <div style={{ padding: '1.5rem 0.5rem' }}>
        {/* Celebration header */}
        <div style={{
          background: 'linear-gradient(135deg, #032655 0%, #065f46 100%)',
          borderRadius: '16px', padding: '24px 20px', marginBottom: '1.25rem', textAlign: 'center', position: 'relative', overflow: 'hidden',
        }}>
          {/* Background rings */}
          <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', borderRadius: '50%', border: '1.5px solid rgba(16,185,129,0.2)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '150px', height: '150px', borderRadius: '50%', border: '1.5px solid rgba(16,185,129,0.1)', pointerEvents: 'none' }} />

          {/* Checkmark */}
          <div style={{
            width: '60px', height: '60px', borderRadius: '50%',
            background: 'rgba(16,185,129,0.2)', border: '2px solid rgba(16,185,129,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px',
            boxShadow: '0 0 0 8px rgba(16,185,129,0.08)',
          }}>
            <svg width="28" height="28" fill="none" stroke="#10b981" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>

          <h3 style={{ fontFamily: 'var(--font-ui)', fontSize: '1.1rem', fontWeight: 900, color: '#fff', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
            Consent Verified!
          </h3>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.8rem', color: 'rgba(255,255,255,0.65)', margin: 0, lineHeight: 1.5 }}>
            {candidateName} has confirmed their application
          </p>
        </div>

        {/* Status card */}
        <div style={{ background: '#F0FDF4', border: '1.5px solid #6ee7b7', borderRadius: '14px', padding: '16px 18px', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', flexShrink: 0, boxShadow: '0 0 0 3px rgba(16,185,129,0.2)' }} />
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 800, color: '#065f46', textTransform: 'uppercase' as const, letterSpacing: '0.08em', margin: 0 }}>
              Profile is now live
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '8px' }}>
            {[
              { label: 'Candidate',  value: candidateName },
              { label: 'Position',   value: jobTitle },
              { label: 'Consent',    value: 'Verified ✓' },
              { label: 'Visibility', value: 'Live with employer' },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', color: '#15803D', margin: 0 }}>{row.label}</p>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 700, color: '#064e3b', margin: 0 }}>{row.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Info note */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', background: '#F5F8FC', borderRadius: '10px', border: '1px solid #EEF3F8', padding: '12px 14px', marginBottom: '1.5rem' }}>
          <svg width="15" height="15" fill="none" stroke="#96AFCA" strokeWidth={2} viewBox="0 0 24 24" style={{ flexShrink: 0, marginTop: '1px' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
          </svg>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', color: '#5A7A9F', margin: 0, lineHeight: 1.6 }}>
            The employer has been notified and {candidateName.split(' ')[0]}'s profile is visible in their applicants dashboard. You'll receive updates as the application progresses.
          </p>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={resetForm}
            style={{ flex: 1, padding: '11px', borderRadius: '10px', border: '1.5px solid #D0DBE8', background: '#fff', color: '#032655', fontFamily: 'var(--font-ui)', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}
          >
            Submit Another
          </button>
          <button
            onClick={() => router.push('/recruiter/dashboard/submissions')}
            style={{ flex: 1, padding: '11px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg,#032655,#065f46)', color: '#fff', fontFamily: 'var(--font-ui)', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}
          >
            View Submissions →
          </button>
        </div>
      </div>
    )
  }

  /* ── Candidate declined ─────────────────────────────────────────────────── */
  if (submitted && consentDeclined) {
    return (
      <div style={{ padding: '1.5rem 0.5rem' }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #1a0a0a 0%, #450a0a 100%)',
          borderRadius: '16px', padding: '24px 20px', marginBottom: '1.25rem', textAlign: 'center', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', borderRadius: '50%', border: '1.5px solid rgba(239,68,68,0.2)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '150px', height: '150px', borderRadius: '50%', border: '1.5px solid rgba(239,68,68,0.1)', pointerEvents: 'none' }} />

          <div style={{
            width: '60px', height: '60px', borderRadius: '50%',
            background: 'rgba(239,68,68,0.15)', border: '2px solid rgba(239,68,68,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px',
            boxShadow: '0 0 0 8px rgba(239,68,68,0.07)',
          }}>
            <svg width="26" height="26" fill="none" stroke="#ef4444" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>

          <h3 style={{ fontFamily: 'var(--font-ui)', fontSize: '1.1rem', fontWeight: 900, color: '#fff', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
            Submission Declined
          </h3>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.8rem', color: 'rgba(255,255,255,0.55)', margin: 0, lineHeight: 1.5 }}>
            {candidateName} has declined this submission
          </p>
        </div>

        {/* Status card */}
        <div style={{ background: '#FFF5F5', border: '1.5px solid #FEB2B2', borderRadius: '14px', padding: '16px 18px', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', flexShrink: 0 }} />
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 800, color: '#742A2A', textTransform: 'uppercase' as const, letterSpacing: '0.08em', margin: 0 }}>
              Submission Withdrawn
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '8px' }}>
            {[
              { label: 'Candidate', value: candidateName },
              { label: 'Position',  value: jobTitle },
              { label: 'Status',    value: 'Declined by candidate' },
              { label: 'Visibility', value: 'Not shared with employer' },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', color: '#C53030', margin: 0 }}>{row.label}</p>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 700, color: '#742A2A', margin: 0 }}>{row.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Info note */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', background: '#F5F8FC', borderRadius: '10px', border: '1px solid #EEF3F8', padding: '12px 14px', marginBottom: '1.5rem' }}>
          <svg width="15" height="15" fill="none" stroke="#96AFCA" strokeWidth={2} viewBox="0 0 24 24" style={{ flexShrink: 0, marginTop: '1px' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
          </svg>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', color: '#5A7A9F', margin: 0, lineHeight: 1.6 }}>
            {candidateName.split(' ')[0]}'s profile has not been shared with the employer. Please speak with the candidate before resubmitting.
          </p>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={resetForm} style={{ flex: 1, padding: '11px', borderRadius: '10px', border: '1.5px solid #D0DBE8', background: '#fff', color: '#032655', fontFamily: 'var(--font-ui)', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}>
            Submit Another
          </button>
          <button onClick={() => router.push('/recruiter/dashboard/submissions')} style={{ flex: 1, padding: '11px', borderRadius: '10px', border: 'none', background: '#032655', color: '#fff', fontFamily: 'var(--font-ui)', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}>
            View Submissions →
          </button>
        </div>
      </div>
    )
  }

  /* ── Awaiting consent ────────────────────────────────────────────────────── */
  if (submitted) {
    return (
      <div style={{ padding: '1.5rem 0.5rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '1.25rem' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: '#EEF3F8', border: '1.5px solid #D0DBE8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="24" height="24" fill="none" stroke="#032655" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </div>
          <div>
            <h3 style={{ fontFamily: 'var(--font-ui)', fontSize: '1.05rem', fontWeight: 800, color: '#032655', margin: '0 0 3px', letterSpacing: '-0.02em' }}>
              Profile saved — awaiting consent
            </h3>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: '#5A7A9F', margin: 0 }}>
              {jobTitle}
            </p>
          </div>
        </div>

        {/* Consent notice */}
        <div style={{ background: '#FFF8E7', border: '1px solid #F6E05E', borderRadius: '10px', padding: '12px 14px', marginBottom: '1rem' }}>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', fontWeight: 700, color: '#744210', margin: '0 0 3px' }}>
            Candidate consent required
          </p>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.74rem', color: '#92400E', margin: 0, lineHeight: 1.6 }}>
            {candidateName}'s profile will only go live with the employer once they confirm their consent. This protects both you and the candidate.
          </p>
        </div>

        {/* Email sent info */}
        <div style={{ background: '#F5F8FC', borderRadius: '12px', border: '1px solid #EEF3F8', padding: '14px', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <svg width="16" height="16" fill="none" stroke="#0A9E97" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.76rem', fontWeight: 700, color: '#032655', margin: 0 }}>Consent email sent</p>
          </div>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', color: '#5A7A9F', margin: '0 0 4px', lineHeight: 1.6 }}>
            A verification email has been sent to <strong style={{ color: '#032655' }}>{consentEmail}</strong>.
          </p>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.73rem', color: '#96AFCA', margin: 0 }}>
            Ask {candidateName.split(' ')[0]} to check their inbox and click the confirmation link. The link expires in 48 hours.
          </p>
        </div>

        {/* What happens next */}
        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', fontWeight: 700, color: '#96AFCA', textTransform: 'uppercase' as const, letterSpacing: '0.08em', margin: '0 0 8px' }}>What happens next</p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{ flex: 1, background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '10px', padding: '10px 12px' }}>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.73rem', fontWeight: 700, color: '#166534', margin: '0 0 2px' }}>If they confirm</p>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.68rem', color: '#15803D', margin: 0, lineHeight: 1.5 }}>Profile goes live with the employer instantly</p>
            </div>
            <div style={{ flex: 1, background: '#FFF5F5', border: '1px solid #FED7D7', borderRadius: '10px', padding: '10px 12px' }}>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.73rem', fontWeight: 700, color: '#742A2A', margin: '0 0 2px' }}>If they decline</p>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.68rem', color: '#C53030', margin: 0, lineHeight: 1.5 }}>Submission is cancelled and you'll be notified</p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={resetForm} style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1.5px solid #D0DBE8', background: '#fff', color: '#032655', fontFamily: 'var(--font-ui)', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}>
            Submit Another
          </button>
          <button onClick={() => router.push('/recruiter/dashboard/submissions')} style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 'none', background: '#032655', color: '#fff', fontFamily: 'var(--font-ui)', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}>
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
                <input
                  style={inp}
                  placeholder="e.g. Priya Sharma"
                  value={candidateName}
                  onChange={e => setCandidateName(e.target.value)}
                  autoFocus
                />
                <p style={hint}>Letters, spaces, hyphens and apostrophes only</p>
              </Field>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <Field label="Email Address *">
                  <input
                    style={inp}
                    type="email"
                    placeholder="candidate@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </Field>
                <Field label="Phone Number *">
                  <input
                    style={inp}
                    type="tel"
                    placeholder="e.g. 9876543210"
                    maxLength={10}
                    value={phone}
                    onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  />
                </Field>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <Field label="Current Job Title *">
                  <input
                    style={inp}
                    placeholder="e.g. Senior Engineer"
                    value={currentJobTitle}
                    onChange={e => setCurrentJobTitle(e.target.value)}
                  />
                </Field>
                <Field label="Current Company *">
                  <input
                    style={inp}
                    placeholder="e.g. Infosys"
                    value={currentCompany}
                    onChange={e => setCurrentCompany(e.target.value)}
                  />
                </Field>
              </div>
            </div>
          )}

          {/* ── STEP 2: Professional Details ───────────────────────────── */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

              {/* CTC row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <Field label="Current CTC (₹ LPA) *">
                    <input style={inp} type="number" min={0} placeholder="e.g. 12" value={currentCtc} onChange={e => setCurrentCtc(e.target.value)} autoFocus />
                  </Field>
                </div>
                <div>
                  <Field label="Expected CTC (₹ LPA) *">
                    <input style={inp} type="number" min={0} placeholder="e.g. 18" value={expectedCtc} onChange={e => setExpectedCtc(e.target.value)} />
                  </Field>
                </div>
              </div>
              <p style={{ ...hint, marginTop: '-12px' }}>Both CTC figures must be confirmed directly with the candidate before submitting</p>

              {/* Experience + Location row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <Field label="Total Experience (years) *">
                  <input style={inp} type="number" min={0} placeholder="e.g. 5" value={totalExperience} onChange={e => setTotalExperience(e.target.value)} />
                </Field>
                <Field label="Current Location *">
                  <input style={inp} placeholder="e.g. Bangalore" value={currentLocation} onChange={e => setCurrentLocation(e.target.value)} />
                </Field>
              </div>

              {/* Notice Period */}
              <Field label="Notice Period *">
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
              <Field label="LinkedIn Profile URL *">
                <input style={inp} type="url" placeholder="https://linkedin.com/in/username" value={linkedinUrl} onChange={e => setLinkedinUrl(e.target.value)} autoFocus />
              </Field>
              <Field label="Portfolio / GitHub URL *">
                <input style={inp} type="url" placeholder="https://github.com/username" value={portfolioUrl} onChange={e => setPortfolioUrl(e.target.value)} />
              </Field>
            </div>
          )}

          {/* ── STEP 4: Resume & Fit Reason ─────────────────────────────── */}
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
                <label style={lbl}>Why is this candidate a fit? <span style={{ color: '#DC2626' }}>*</span></label>
                <textarea
                  rows={6}
                  placeholder={`Write at least 2 lines explaining why this candidate is right for this role.\n\nE.g. their relevant skills, domain experience, cultural alignment, or why they stand out for this specific position.`}
                  value={fitReason}
                  onChange={e => setFitReason(e.target.value)}
                  style={{ ...inp, resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.6 }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '5px' }}>
                  <p style={hint}>Minimum 100 characters — be specific about why they suit this role</p>
                  <p style={{ ...hint, flexShrink: 0, marginLeft: '8px', color: fitReason.trim().length >= 100 ? '#0A9E97' : fitReason.trim().length >= 60 ? '#B7791F' : '#96AFCA' }}>
                    {fitReason.trim().length}/100
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 5: Review & Submit ─────────────────────────────────── */}
          {step === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

              <ReviewSection label="Candidate Info" onEdit={() => { setStep(0); setStepError('') }}>
                <p style={rv.title}>{candidateName}</p>
                <p style={{ ...rv.secondary, marginTop: '2px' }}>{currentJobTitle} · {currentCompany}</p>
                <div style={{ display: 'flex', gap: '14px', marginTop: '5px', flexWrap: 'wrap' as const }}>
                  <p style={{ ...rv.secondary, margin: 0 }}>{email}</p>
                  <p style={{ ...rv.secondary, margin: 0 }}>{phone}</p>
                </div>
              </ReviewSection>

              <ReviewSection label="Professional Details" onEdit={() => { setStep(1); setStepError('') }}>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' as const, marginBottom: '6px' }}>
                  <Chip color="navy">Current: ₹{currentCtc}L PA</Chip>
                  <Chip color="navy">Expected: ₹{expectedCtc}L PA <span style={{ fontSize: '0.6rem', opacity: 0.65 }}>(admin only)</span></Chip>
                  {totalExperience && <Chip color="teal">{totalExperience} yrs exp</Chip>}
                </div>
                {currentLocation && <p style={{ ...rv.secondary, marginTop: '4px' }}>{currentLocation}</p>}
                <p style={rv.secondary}>{noticePeriod} notice period</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '6px' }}>
                  <svg width="12" height="12" fill="none" stroke="#0A9E97" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', color: '#0A9E97', margin: 0, fontWeight: 600 }}>Candidate is aware and interested</p>
                </div>
              </ReviewSection>

              <ReviewSection label="Online Presence" onEdit={() => { setStep(2); setStepError('') }}>
                {linkedinUrl && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '4px' }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="#0A66C2"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    <p style={{ ...rv.secondary, wordBreak: 'break-all' as const, margin: 0 }}>{linkedinUrl}</p>
                  </div>
                )}
                {portfolioUrl && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <svg width="11" height="11" fill="none" stroke="#5A7A9F" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                    <p style={{ ...rv.secondary, wordBreak: 'break-all' as const, margin: 0 }}>{portfolioUrl}</p>
                  </div>
                )}
              </ReviewSection>

              <ReviewSection label="Resume & Fit Reason" onEdit={() => { setStep(3); setStepError('') }}>
                {resume && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                    <svg width="13" height="13" fill="none" stroke="#0A9E97" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                    <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: '#032655', fontWeight: 600 }}>{resume.name}</span>
                  </div>
                )}
                {fitReason && (
                  <p style={{ ...rv.value, lineHeight: 1.6, display: '-webkit-box', WebkitBoxOrient: 'vertical' as any, WebkitLineClamp: 3, overflow: 'hidden' }}>
                    {fitReason.slice(0, 220)}{fitReason.length > 220 ? '…' : ''}
                  </p>
                )}
              </ReviewSection>

              {/* Candidate awareness gate — final confirmation before submit */}
              <div style={{
                background: candidateAware ? '#F0FBF9' : '#FFFBEB',
                border: `1.5px solid ${candidateAware ? 'rgba(15,185,177,0.35)' : '#F6E05E'}`,
                borderRadius: '10px', padding: '14px 16px',
                display: 'flex', gap: '12px', alignItems: 'flex-start',
                transition: 'all 0.2s',
              }}>
                <input
                  type="checkbox"
                  id="candidate-aware"
                  checked={candidateAware}
                  onChange={e => setCandidateAware(e.target.checked)}
                  style={{ marginTop: '3px', width: '16px', height: '16px', accentColor: '#032655', flexShrink: 0, cursor: 'pointer' }}
                />
                <label htmlFor="candidate-aware" style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', color: '#032655', lineHeight: 1.6, cursor: 'pointer' }}>
                  I confirm that <strong>{candidateName}</strong> is <strong>actively aware</strong> of this specific role and has expressed genuine interest in it. I have spoken to them about this opportunity.
                </label>
              </div>

              <div style={{ background: '#F0FBF9', border: '1px solid rgba(15,185,177,0.25)', borderRadius: '10px', padding: '12px 16px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
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

const hint: React.CSSProperties = {
  fontFamily: 'var(--font-ui)', fontSize: '0.65rem', color: '#96AFCA', margin: '4px 0 0',
}

const rv = {
  title:     { fontFamily: 'var(--font-ui)', fontSize: '0.95rem', fontWeight: 700, color: '#032655', margin: 0 } as React.CSSProperties,
  value:     { fontFamily: 'var(--font-ui)', fontSize: '0.82rem', color: '#032655', margin: 0 } as React.CSSProperties,
  secondary: { fontFamily: 'var(--font-ui)', fontSize: '0.75rem', color: '#5A7A9F', margin: '5px 0 0' } as React.CSSProperties,
  empty:     { fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: '#96AFCA', margin: 0, fontStyle: 'italic' } as React.CSSProperties,
}
