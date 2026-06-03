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
  const formRef = useRef<HTMLFormElement>(null)

  function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      try {
        await submitCandidate(formData)
        router.push('/recruiter/dashboard/my-jobs')
      } catch (err: any) {
        setError(err.message ?? 'Something went wrong')
      }
    })
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
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
