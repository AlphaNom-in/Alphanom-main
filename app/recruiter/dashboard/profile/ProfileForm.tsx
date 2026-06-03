'use client'

import { useState, useTransition } from 'react'
import { updateProfile } from '@/lib/recruiter/updateProfile'

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: '10px',
  border: '1.5px solid #D0DBE8',
  fontSize: '14px',
  color: '#032655',
  outline: 'none',
  boxSizing: 'border-box',
  background: '#fff',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '13px',
  fontWeight: 700,
  color: '#032655',
  marginBottom: '6px',
}

type Recruiter = {
  full_name: string
  contact_primary: string
  contact_secondary: string | null
  specialization: string[] | null
  years_of_experience: number | null
  cv_url: string | null
}

export default function ProfileForm({ recruiter }: { recruiter: Recruiter }) {
  const [pending, startTransition] = useTransition()
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [tags, setTags] = useState<string[]>(recruiter.specialization ?? [])
  const [tagInput, setTagInput] = useState('')

  function addTag(value: string) {
    const trimmed = value.trim()
    if (trimmed && !tags.includes(trimmed)) setTags((p) => [...p, trimmed])
    setTagInput('')
  }

  function removeTag(tag: string) {
    setTags((p) => p.filter((t) => t !== tag))
  }

  function handleTagKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag(tagInput)
    } else if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
      setTags((p) => p.slice(0, -1))
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    const formData = new FormData(e.currentTarget)
    formData.set('specialization', tags.join(','))

    startTransition(async () => {
      try {
        await updateProfile(formData)
        setSuccess(true)
      } catch (err: any) {
        setError(err.message ?? 'Something went wrong')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
          marginBottom: '16px',
        }}
      >
        <div>
          <label style={labelStyle}>Full Name</label>
          <input
            name="full_name"
            defaultValue={recruiter.full_name}
            required
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Primary Contact</label>
          <input
            name="contact_primary"
            defaultValue={recruiter.contact_primary}
            required
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Secondary Contact</label>
          <input
            name="contact_secondary"
            defaultValue={recruiter.contact_secondary ?? ''}
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Years of Experience</label>
          <input
            name="years_of_experience"
            type="number"
            min={0}
            max={50}
            defaultValue={recruiter.years_of_experience ?? ''}
            required
            style={inputStyle}
          />
        </div>
      </div>

      {/* Specialization */}
      <div style={{ marginBottom: '16px' }}>
        <label style={labelStyle}>Specialization</label>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px',
            padding: '8px 12px',
            borderRadius: '10px',
            border: '1.5px solid #D0DBE8',
            background: '#fff',
            minHeight: '46px',
            alignItems: 'center',
            cursor: 'text',
          }}
          onClick={() => document.getElementById('profile-tag-input')?.focus()}
        >
          {tags.map((tag) => (
            <span
              key={tag}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                background: '#D8F0EB',
                color: '#0A9E97',
                fontWeight: 600,
                fontSize: '12px',
                padding: '3px 10px',
                borderRadius: '20px',
              }}
            >
              {tag}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  removeTag(tag)
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#0A9E97',
                  padding: 0,
                  lineHeight: 1,
                  fontSize: '14px',
                }}
              >
                ×
              </button>
            </span>
          ))}
          <input
            id="profile-tag-input"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            onBlur={() => tagInput && addTag(tagInput)}
            placeholder={tags.length === 0 ? 'e.g. Tech, Sales — press Enter to add' : ''}
            style={{
              border: 'none',
              outline: 'none',
              fontSize: '14px',
              color: '#032655',
              flex: 1,
              minWidth: '160px',
              background: 'transparent',
            }}
          />
        </div>
      </div>

      {/* CV upload */}
      <div style={{ marginBottom: '24px' }}>
        <label style={labelStyle}>Upload New CV</label>
        <input
          name="cv"
          type="file"
          accept=".pdf,.doc,.docx"
          style={{ ...inputStyle, padding: '8px 14px', cursor: 'pointer' }}
        />
        {recruiter.cv_url && (
          <p style={{ fontSize: '12px', color: '#5A7A9F', marginTop: '4px' }}>
            Current:{' '}
            <a
              href={recruiter.cv_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#0FB9B1' }}
            >
              View uploaded CV
            </a>
          </p>
        )}
      </div>

      {error && (
        <p
          style={{
            color: '#E53E3E',
            fontSize: '13px',
            background: '#FFF5F5',
            border: '1px solid #FEB2B2',
            borderRadius: '8px',
            padding: '10px 14px',
            marginBottom: '16px',
          }}
        >
          {error}
        </p>
      )}

      {success && (
        <p
          style={{
            color: '#0A9E97',
            fontSize: '13px',
            background: '#D8F0EB',
            border: '1px solid #0FB9B1',
            borderRadius: '8px',
            padding: '10px 14px',
            marginBottom: '16px',
          }}
        >
          Profile updated successfully.
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        style={{
          padding: '12px 28px',
          borderRadius: '10px',
          border: 'none',
          background: pending ? '#96AFCA' : '#032655',
          color: '#fff',
          fontWeight: 600,
          fontSize: '14px',
          cursor: pending ? 'not-allowed' : 'pointer',
        }}
      >
        {pending ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  )
}
