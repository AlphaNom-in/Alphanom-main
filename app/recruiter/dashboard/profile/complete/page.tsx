'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition, useEffect } from 'react'
import { updateProfile } from '@/lib/recruiter/updateProfile'
import { createClient } from '@/lib/supabase/client'

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

export default function CompleteProfilePage() {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [ensuring, setEnsuring] = useState(true)

  // Ensure recruiter row exists before the user submits the form.
  // Covers users who signed up before the profile-creation fix was applied —
  // their auth user exists but no `recruiters` row was created.
  useEffect(() => {
    async function ensureRow() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setEnsuring(false); return }

      const { data: existing } = await supabase
        .from('recruiters').select('id').eq('user_id', user.id).single()

      if (!existing) {
        const raw = localStorage.getItem('__recruiter_signup__')
        if (raw) {
          try {
            const params = JSON.parse(raw) as {
              full_name: string; email: string; contact_primary: string
            }
            await supabase.from('recruiters').insert({ user_id: user.id, ...params })
            localStorage.removeItem('__recruiter_signup__')
          } catch {
            setError('Could not initialise your profile. Please try logging out and signing up again.')
          }
        }
      }
      setEnsuring(false)
    }
    ensureRow()
  }, [])

  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')

  function addTag(value: string) {
    const trimmed = value.trim()
    if (trimmed && !tags.includes(trimmed)) {
      setTags((prev) => [...prev, trimmed])
    }
    setTagInput('')
  }

  function removeTag(tag: string) {
    setTags((prev) => prev.filter((t) => t !== tag))
  }

  function handleTagKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag(tagInput)
    } else if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
      setTags((prev) => prev.slice(0, -1))
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (tags.length === 0) {
      setError('Please add at least one specialization.')
      return
    }
    setError(null)
    const formData = new FormData(e.currentTarget)
    formData.set('specialization', tags.join(','))

    startTransition(async () => {
      try {
        await updateProfile(formData)
        router.refresh()
        router.push('/recruiter/dashboard')
      } catch (err: any) {
        setError(err.message ?? 'Something went wrong')
      }
    })
  }

  if (ensuring) {
    return (
      <div style={{ minHeight: '100vh', background: '#F5F8FC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '32px', height: '32px', border: '3px solid #D0DBE8', borderTop: '3px solid #0FB9B1', borderRadius: '50%', margin: '0 auto 12px', animation: 'cpSpin 0.8s linear infinite' }} />
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.85rem', color: '#96AFCA' }}>Setting up your profile…</p>
          <style>{`@keyframes cpSpin { to { transform: rotate(360deg) } }`}</style>
        </div>
      </div>
    )
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#F5F8FC',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
      }}
    >
      <div style={{ width: '100%', maxWidth: '520px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #0FB9B1, #0A9E97)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}
          >
            <span style={{ fontWeight: 800, fontSize: '16px', color: '#fff' }}>
              AN
            </span>
          </div>
          <h1
            style={{
              fontSize: '26px',
              fontWeight: 800,
              color: '#032655',
              marginBottom: '8px',
              letterSpacing: '-0.03em',
            }}
          >
            Complete your profile
          </h1>
          <p style={{ color: '#5A7A9F', fontSize: '14px', lineHeight: 1.6 }}>
            Tell employers about your expertise so they know you're the right recruiter for their roles.
          </p>
        </div>

        <div
          style={{
            background: '#fff',
            borderRadius: '20px',
            border: '1px solid #D0DBE8',
            padding: '32px',
            boxShadow: '0 4px 32px rgba(3,38,85,0.06)',
          }}
        >
          <form onSubmit={handleSubmit}>
            {/* Specialization */}
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>
                Specialization <span style={{ color: '#E53E3E' }}>*</span>
              </label>
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
                onClick={() =>
                  document.getElementById('tag-input')?.focus()
                }
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
                      padding: '3px 10px 3px 10px',
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
                  id="tag-input"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  onBlur={() => tagInput && addTag(tagInput)}
                  placeholder={
                    tags.length === 0
                      ? 'e.g. Tech, Sales, Finance — press Enter to add'
                      : ''
                  }
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
              <p style={{ color: '#96AFCA', fontSize: '12px', marginTop: '4px' }}>
                Press Enter or comma to add each specialization
              </p>
            </div>

            {/* Years of experience */}
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>
                Years of Experience <span style={{ color: '#E53E3E' }}>*</span>
              </label>
              <input
                name="years_of_experience"
                type="number"
                min={0}
                max={50}
                required
                placeholder="e.g. 5"
                style={inputStyle}
              />
            </div>

            {/* Secondary contact */}
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Secondary Contact</label>
              <input
                name="contact_secondary"
                type="tel"
                placeholder="+91 98765 43210"
                style={inputStyle}
              />
            </div>

            {/* CV upload */}
            <div style={{ marginBottom: '28px' }}>
              <label style={labelStyle}>Your CV</label>
              <input
                name="cv"
                type="file"
                accept=".pdf,.doc,.docx"
                style={{
                  ...inputStyle,
                  padding: '8px 14px',
                  cursor: 'pointer',
                }}
              />
              <p style={{ color: '#96AFCA', fontSize: '12px', marginTop: '4px' }}>
                PDF, DOC or DOCX — helps employers understand your background
              </p>
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

            <button
              type="submit"
              disabled={pending}
              style={{
                width: '100%',
                padding: '13px',
                borderRadius: '10px',
                border: 'none',
                background: pending ? '#96AFCA' : '#0FB9B1',
                color: '#fff',
                fontWeight: 700,
                fontSize: '15px',
                cursor: pending ? 'not-allowed' : 'pointer',
              }}
            >
              {pending ? 'Saving...' : 'Complete Profile →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
