'use client'

import { useTransition, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { submitCandidate } from '@/lib/recruiter/submitCandidate'

const label: React.CSSProperties = {
  display: 'block',
  color: '#032655',
  fontWeight: 600,
  fontSize: '14px',
  marginBottom: '6px',
}

const input: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: '10px',
  border: '1.5px solid #D0DBE8',
  fontSize: '14px',
  color: '#032655',
  outline: 'none',
  boxSizing: 'border-box',
}

function Field({
  label: labelText,
  name,
  type = 'text',
  required,
  placeholder,
}: {
  label: string
  name: string
  type?: string
  required?: boolean
  placeholder?: string
}) {
  return (
    <div style={{ marginBottom: '18px' }}>
      <label style={label}>
        {labelText}
        {required && <span style={{ color: '#E53E3E' }}> *</span>}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        style={input}
      />
    </div>
  )
}

export default function SubmitCandidateForm({
  jobId,
  jobTitle,
}: {
  jobId: string
  jobTitle: string
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [candidateName, setCandidateName] = useState('')
  const formRef = useRef<HTMLFormElement>(null)

  function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)
    const name = formData.get('candidate_name') as string

    startTransition(async () => {
      try {
        await submitCandidate(formData)
        setCandidateName(name)
        setSubmitted(true)
      } catch (err: any) {
        setError(err.message ?? 'Something went wrong')
      }
    })
  }

  /* ── Success state ────────────────────────────────────────────────── */
  if (submitted) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
        {/* Checkmark circle */}
        <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, #D8F0EB, #B2E8E3)', border: '2px solid rgba(15,185,177,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', boxShadow: '0 8px 24px rgba(15,185,177,0.2)' }}>
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

        {/* Info strip */}
        <div style={{ display: 'flex', gap: '1px', background: '#EEF3F8', borderRadius: '12px', overflow: 'hidden', marginBottom: '1.75rem' }}>
          {[
            { icon: '📋', label: 'In pipeline', sub: 'Status set to In Pipeline' },
            { icon: '👀', label: 'Under review', sub: 'Employer will be notified' },
            { icon: '⚡', label: 'Live now', sub: 'Visible on employer dashboard' },
          ].map((s, i) => (
            <div key={i} style={{ flex: 1, background: '#F5F8FC', padding: '12px 8px', textAlign: 'center' }}>
              <p style={{ fontSize: '1.1rem', margin: '0 0 3px' }}>{s.icon}</p>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', fontWeight: 700, color: '#032655', margin: '0 0 2px' }}>{s.label}</p>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.6rem', color: '#96AFCA', margin: 0 }}>{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => { setSubmitted(false); setError(null); formRef.current?.reset() }}
            style={{ padding: '10px 20px', borderRadius: '10px', border: '1.5px solid #D0DBE8', background: '#fff', color: '#032655', fontFamily: 'var(--font-ui)', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}
          >
            Submit Another
          </button>
          <button
            onClick={() => router.push('/recruiter/dashboard')}
            style={{ padding: '10px 20px', borderRadius: '10px', border: 'none', background: '#032655', color: '#fff', fontFamily: 'var(--font-ui)', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}
          >
            View Submissions →
          </button>
        </div>
      </div>
    )
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      onKeyDown={e => { if (e.key === 'Enter' && (e.target as HTMLElement).tagName !== 'TEXTAREA') e.preventDefault() }}
    >
      <input type="hidden" name="job_post_id" value={jobId} />

      <p
        style={{
          color: '#5A7A9F',
          fontSize: '14px',
          marginBottom: '28px',
        }}
      >
        Submitting for: <strong style={{ color: '#032655' }}>{jobTitle}</strong>
      </p>

      {/* Section: Candidate Info */}
      <SectionHeading>Candidate Information</SectionHeading>

      <Field
        label="Full Name"
        name="candidate_name"
        required
        placeholder="e.g. Priya Sharma"
      />

      <div className="rdash-submit-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <Field
          label="Primary Contact"
          name="contact_primary"
          type="tel"
          required
          placeholder="+91 98765 43210"
        />
        <Field
          label="Secondary Contact"
          name="contact_secondary"
          type="tel"
          placeholder="+91 98765 43210"
        />
      </div>

      <Field
        label="Email"
        name="email"
        type="email"
        required
        placeholder="candidate@email.com"
      />

      <div className="rdash-submit-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <Field
          label="LinkedIn URL"
          name="linkedin_url"
          type="url"
          placeholder="https://linkedin.com/in/..."
        />
        <Field
          label="Portfolio URL"
          name="portfolio_url"
          type="url"
          placeholder="https://..."
        />
      </div>

      {/* Section: Professional Details */}
      <SectionHeading>Professional Details</SectionHeading>

      <div className="rdash-submit-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <Field
          label="Current CTC (₹ LPA)"
          name="current_ctc"
          type="number"
          placeholder="e.g. 12"
        />
        <Field
          label="Total Experience (years)"
          name="total_experience"
          type="number"
          placeholder="e.g. 5"
        />
      </div>

      <div className="rdash-submit-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <Field
          label="Current Location"
          name="current_location"
          placeholder="e.g. Bangalore"
        />
        <Field
          label="Notice Period"
          name="notice_period"
          placeholder="e.g. 30 days"
        />
      </div>

      {/* Section: Documents & Notes */}
      <SectionHeading>Documents & Notes</SectionHeading>

      <div style={{ marginBottom: '18px' }}>
        <label style={label}>
          Resume <span style={{ color: '#E53E3E' }}>*</span>
        </label>
        <input
          name="resume"
          type="file"
          required
          accept=".pdf,.doc,.docx"
          style={{
            ...input,
            padding: '8px 14px',
            cursor: 'pointer',
          }}
        />
        <p style={{ color: '#96AFCA', fontSize: '12px', marginTop: '4px' }}>
          PDF, DOC or DOCX — max 10 MB
        </p>
      </div>

      <div style={{ marginBottom: '28px' }}>
        <label style={label}>
          Your Note <span style={{ color: '#E53E3E' }}>*</span>
        </label>
        <textarea
          name="recruiter_note"
          required
          rows={4}
          placeholder="Why are you recommending this candidate? Any context the employer should know..."
          style={{
            ...input,
            resize: 'vertical',
            fontFamily: 'inherit',
          }}
        />
      </div>

      {error && (
        <p
          style={{
            color: '#E53E3E',
            fontSize: '14px',
            marginBottom: '16px',
            background: '#FFF5F5',
            padding: '10px 14px',
            borderRadius: '8px',
            border: '1px solid #FEB2B2',
          }}
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        style={{
          padding: '13px 32px',
          borderRadius: '10px',
          border: 'none',
          background: pending ? '#96AFCA' : '#032655',
          color: '#fff',
          fontWeight: 600,
          fontSize: '15px',
          cursor: pending ? 'not-allowed' : 'pointer',
        }}
      >
        {pending ? 'Submitting...' : 'Submit Candidate →'}
      </button>
    </form>
  )
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3
      style={{
        color: '#032655',
        fontSize: '15px',
        fontWeight: 700,
        marginBottom: '16px',
        paddingBottom: '8px',
        borderBottom: '1px solid #D0DBE8',
      }}
    >
      {children}
    </h3>
  )
}
