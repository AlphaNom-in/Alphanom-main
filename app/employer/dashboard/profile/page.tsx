'use client'

import { useEffect, useState } from 'react'
import { getEmployerProfile } from '@/hooks/useEmployer'
import {
  updateEmployerProfile,
  profileCompletionSteps,
  profileCompletionPercent,
  isProfileComplete,
  type EmployerProfile,
} from '@/hooks/useEmployerProfile'

const INDUSTRIES = [
  'Technology', 'Finance & Banking', 'Healthcare', 'E-commerce',
  'Manufacturing', 'Consulting', 'Real Estate', 'Education',
  'Media & Entertainment', 'FMCG', 'Automotive', 'Retail',
  'Logistics', 'Energy', 'Legal', 'Other',
]

export default function ProfilePage() {
  const [profile, setProfile] = useState<EmployerProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getEmployerProfile().then((data) => {
      setProfile(data)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '32px', height: '32px', border: '3px solid #D0DBE8', borderTop: '3px solid #0FB9B1', borderRadius: '50%', margin: '0 auto 10px', animation: 'profSpin 0.8s linear infinite' }} />
          <p style={{ fontFamily: 'var(--font-ui)', color: '#96AFCA', fontSize: '0.82rem' }}>Loading profile…</p>
          <style>{`@keyframes profSpin { to { transform: rotate(360deg) } }`}</style>
        </div>
      </div>
    )
  }

  if (!profile) return null

  const steps = profileCompletionSteps(profile)
  const pct = profileCompletionPercent(profile)
  const complete = isProfileComplete(profile)
  const initials = (profile.company_name ?? '?')
    .split(' ')
    .map((w: string) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div style={{ maxWidth: '720px', display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingBottom: '1.5rem' }}>

      {/* ── Profile header card ──────────────────────────────────────── */}
      <div style={{
        background: '#fff', borderRadius: '16px', border: '1px solid #D0DBE8',
        overflow: 'hidden', boxShadow: '0 2px 16px rgba(3,38,85,0.06)',
      }}>
        {/* Gradient strip */}
        <div style={{ height: '72px', background: 'linear-gradient(135deg, #032655 0%, #0a3570 60%, #0FB9B1 100%)', position: 'relative' }}>
          <div aria-hidden style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        </div>

        <div style={{ padding: '2.5rem 1.75rem 1.75rem' }}>
          {/* Avatar + name row */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1.25rem', marginTop: '-32px', marginBottom: '1rem' }}>
            {/* Static initials avatar */}
            <div style={{
              width: '64px', height: '64px', borderRadius: '14px',
              background: 'linear-gradient(135deg, #032655 0%, #0FB9B1 100%)',
              border: '3px solid #fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 4px 16px rgba(3,38,85,0.15)',
            }}>
              <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 800, fontSize: '1.1rem', color: '#fff' }}>
                {initials}
              </span>
            </div>

            {/* Name + handle */}
            <div style={{ paddingBottom: '4px' }}>
              <h2 style={{ fontFamily: 'var(--font-ui)', fontSize: '1.2rem', fontWeight: 800, color: '#032655', letterSpacing: '-0.03em', lineHeight: 1.2 }}>
                {profile.company_name}
              </h2>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', color: '#96AFCA', marginTop: '2px' }}>
                @{profile.username} · Employer
              </p>
            </div>

            {/* Completion badge */}
            <div style={{ marginLeft: 'auto', paddingBottom: '4px', textAlign: 'right' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '5px 10px', borderRadius: '99px',
                background: complete ? '#D8F0EB' : '#FDF3DC',
                border: `1px solid ${complete ? '#0FB9B1' : '#F5A623'}`,
              }}>
                {complete ? (
                  <svg fill="none" stroke="#0A9E97" strokeWidth={2.5} viewBox="0 0 24 24" style={{ width: '11px', height: '11px' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                ) : (
                  <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#F5A623' }} />
                )}
                <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', fontWeight: 700, color: complete ? '#0A9E97' : '#7A5C00' }}>
                  {complete ? 'Profile Complete' : `${pct}% Complete`}
                </span>
              </div>
              {!complete && (
                <div style={{ marginTop: '6px', width: '120px', height: '4px', background: '#EEF3F8', borderRadius: '99px', overflow: 'hidden', marginLeft: 'auto' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: '#F5A623', borderRadius: '99px' }} />
                </div>
              )}
            </div>
          </div>

          {/* Step pills */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {steps.map((step) => (
              <div key={step.label} style={{
                display: 'inline-flex', alignItems: 'center', gap: '5px',
                padding: '4px 10px', borderRadius: '99px',
                background: step.done ? '#D8F0EB' : '#EEF3F8',
                border: `1px solid ${step.done ? '#0FB9B1' : '#D0DBE8'}`,
              }}>
                {step.done ? (
                  <svg fill="none" stroke="#0A9E97" strokeWidth={2.5} viewBox="0 0 24 24" style={{ width: '9px', height: '9px' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                ) : (
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: step.required ? '#F5A623' : '#D0DBE8' }} />
                )}
                <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.62rem', fontWeight: 600, color: step.done ? '#0A9E97' : '#5A7A9F' }}>
                  {step.label}{!step.done && step.required && ' *'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Company Information ──────────────────────────────────────── */}
      <EditSection
        title="Company Information"
        icon={
          <svg fill="none" stroke="#5A7A9F" strokeWidth={1.8} viewBox="0 0 24 24" style={{ width: '14px', height: '14px' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
          </svg>
        }
        fields={[
          { key: 'company_name',    label: 'Company Name',     value: profile.company_name,        type: 'text',     placeholder: 'Acme Corp' },
          { key: 'industry',        label: 'Industry *',       value: profile.industry ?? '',      type: 'select',   options: INDUSTRIES, placeholder: 'Select industry', required: true },
          { key: 'company_address', label: 'Company Address *',value: profile.company_address ?? '',type: 'textarea', placeholder: '123 MG Road, Bangalore, Karnataka 560001', required: true },
        ]}
        onSave={async (data) => {
          await updateEmployerProfile(data)
          setProfile((p) => p ? { ...p, ...data } : p)
        }}
      />

      {/* ── Contact Details ──────────────────────────────────────────── */}
      <EditSection
        title="Contact Details"
        icon={
          <svg fill="none" stroke="#5A7A9F" strokeWidth={1.8} viewBox="0 0 24 24" style={{ width: '14px', height: '14px' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
          </svg>
        }
        fields={[
          { key: 'contact_primary',   label: 'Primary Contact',   value: profile.contact_primary,        type: 'text', placeholder: '+91 98765 43210' },
          { key: 'contact_secondary', label: 'Secondary Contact',  value: profile.contact_secondary ?? '', type: 'text', placeholder: '+91 91234 56789 (optional)' },
        ]}
        onSave={async (data) => {
          await updateEmployerProfile(data)
          setProfile((p) => p ? { ...p, ...data } : p)
        }}
      />

      {/* ── Account (read-only) ──────────────────────────────────────── */}
      <div style={{
        background: '#fff', borderRadius: '16px', border: '1px solid #D0DBE8',
        overflow: 'hidden', boxShadow: '0 2px 12px rgba(3,38,85,0.05)',
      }}>
        <div style={{ padding: '13px 18px', borderBottom: '1px solid #EEF3F8', display: 'flex', alignItems: 'center', gap: '9px' }}>
          <div style={{ width: '26px', height: '26px', borderRadius: '6px', background: '#EEF3F8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg fill="none" stroke="#5A7A9F" strokeWidth={1.8} viewBox="0 0 24 24" style={{ width: '14px', height: '14px' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
            </svg>
          </div>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', fontWeight: 700, color: '#032655' }}>Account</p>
          <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-ui)', fontSize: '0.62rem', color: '#96AFCA', fontWeight: 500 }}>Read-only</span>
        </div>
        <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <ReadField label="Email Address" value={profile.email} />
          <ReadField label="Username" value={`@${profile.username}`} />
          <ReadField label="Member Since" value={new Date(profile.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} />
          <ReadField label="Verification Status" value={profile.is_verified ? 'Verified ✓' : 'Pending verification'} valueColor={profile.is_verified ? '#0A9E97' : '#F5A623'} />
        </div>
      </div>

    </div>
  )
}

/* ── Read-only field ─────────────────────────────────────────────────────── */
function ReadField({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  return (
    <div style={{ padding: '10px 14px', background: '#FAFCFE', borderRadius: '9px', border: '1px solid #EEF3F8' }}>
      <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.6rem', fontWeight: 600, color: '#96AFCA', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '3px' }}>{label}</p>
      <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.875rem', fontWeight: 600, color: valueColor ?? '#032655' }}>{value}</p>
    </div>
  )
}

/* ── Editable section card ───────────────────────────────────────────────── */
type FieldDef = {
  key: string
  label: string
  value: string
  type: 'text' | 'textarea' | 'select'
  placeholder?: string
  options?: string[]
  required?: boolean
}

function EditSection({ title, icon, fields, onSave }: {
  title: string
  icon: React.ReactNode
  fields: FieldDef[]
  onSave: (data: Record<string, string>) => Promise<void>
}) {
  const [editing, setEditing] = useState(false)
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(fields.map((f) => [f.key, f.value]))
  )
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 13px',
    borderRadius: '9px', border: '1.5px solid #D0DBE8',
    fontFamily: 'var(--font-ui)', fontSize: '0.875rem',
    color: '#032655', background: '#fff', outline: 'none',
    boxSizing: 'border-box',
  }

  async function handleSave() {
    setSaving(true)
    try {
      await onSave(values)
      setSaved(true)
      setEditing(false)
      setTimeout(() => setSaved(false), 2500)
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  function handleCancel() {
    setValues(Object.fromEntries(fields.map((f) => [f.key, f.value])))
    setEditing(false)
  }

  return (
    <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #D0DBE8', overflow: 'hidden', boxShadow: '0 2px 12px rgba(3,38,85,0.05)' }}>
      {/* Section header */}
      <div style={{ padding: '13px 18px', borderBottom: '1px solid #EEF3F8', display: 'flex', alignItems: 'center', gap: '9px' }}>
        <div style={{ width: '26px', height: '26px', borderRadius: '6px', background: '#EEF3F8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {icon}
        </div>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', fontWeight: 700, color: '#032655' }}>{title}</p>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '7px' }}>
          {saved && !editing && (
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.68rem', fontWeight: 600, color: '#0A9E97', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <svg fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" style={{ width: '11px', height: '11px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              Saved
            </span>
          )}
          {editing ? (
            <>
              <button onClick={handleCancel} style={{ padding: '5px 12px', borderRadius: '7px', background: 'transparent', border: '1px solid #D0DBE8', fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 600, color: '#5A7A9F', cursor: 'pointer' }}>
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving} style={{ padding: '5px 14px', borderRadius: '7px', background: saving ? '#96AFCA' : '#032655', border: 'none', fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 700, color: '#fff', cursor: saving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                {saving && <div style={{ width: '10px', height: '10px', border: '2px solid rgba(255,255,255,0.4)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'profSpin 0.7s linear infinite' }} />}
                {saving ? 'Saving…' : 'Save'}
              </button>
            </>
          ) : (
            <button onClick={() => setEditing(true)} style={{ padding: '5px 12px', borderRadius: '7px', background: '#EEF3F8', border: '1px solid #D0DBE8', fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 600, color: '#032655', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <svg fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" style={{ width: '11px', height: '11px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
              </svg>
              Edit
            </button>
          )}
        </div>
      </div>

      {/* Fields */}
      <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {fields.map((field) => (
          <div key={field.key}>
            <label style={{ display: 'block', fontFamily: 'var(--font-ui)', fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.04em', color: '#5A7A9F', marginBottom: '5px' }}>
              {field.label}
            </label>
            {editing ? (
              field.type === 'select' ? (
                <select value={values[field.key]} onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))} style={inputStyle}>
                  <option value="">{field.placeholder ?? 'Select…'}</option>
                  {field.options?.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              ) : field.type === 'textarea' ? (
                <textarea value={values[field.key]} onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))} placeholder={field.placeholder} style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} />
              ) : (
                <input type="text" value={values[field.key]} onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))} placeholder={field.placeholder} style={inputStyle} />
              )
            ) : (
              <div style={{ padding: '10px 13px', borderRadius: '9px', background: '#FAFCFE', border: '1px solid #EEF3F8', fontFamily: 'var(--font-ui)', fontSize: '0.875rem', color: values[field.key] ? '#032655' : '#96AFCA' }}>
                {values[field.key] || (field.placeholder ?? '—')}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
