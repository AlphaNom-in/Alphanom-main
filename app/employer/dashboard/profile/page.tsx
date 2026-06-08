'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ensureEmployerProfile } from '@/hooks/useEmployer'
import {
  updateEmployerProfile,
  uploadEmployerLogo,
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

const COMPANY_SIZES = [
  '1 – 10', '11 – 50', '51 – 200', '201 – 500', '501 – 1,000', '1,000+',
]

export default function ProfilePage() {
  const [profile, setProfile] = useState<EmployerProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    ensureEmployerProfile().then((data) => {
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

  if (!profile) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px' }}>
      <p style={{ fontFamily: 'var(--font-ui)', color: '#96AFCA', fontSize: '0.85rem' }}>
        Profile not found. Please try refreshing the page.
      </p>
    </div>
  )

  const steps    = profileCompletionSteps(profile)
  const pct      = profileCompletionPercent(profile)
  const complete = isProfileComplete(profile)
  const initials = (profile.company_name ?? '?')
    .split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div style={{ maxWidth: '720px', display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingBottom: '1.5rem' }}>

      {/* ── Profile header card ──────────────────────────────────────── */}
      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #D0DBE8', overflow: 'hidden', boxShadow: '0 2px 16px rgba(3,38,85,0.06)' }}>
        <div style={{ height: '72px', background: 'linear-gradient(135deg, #032655 0%, #0a3570 60%, #0FB9B1 100%)', position: 'relative' }}>
          <div aria-hidden style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        </div>

        <div style={{ padding: '2.5rem 1.75rem 1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1.25rem', marginTop: '-32px', marginBottom: '1rem' }}>
            {/* Avatar — shows logo if available */}
            <div style={{
              width: '64px', height: '64px', borderRadius: '14px',
              background: profile.logo_url ? '#fff' : 'linear-gradient(135deg, #032655 0%, #0FB9B1 100%)',
              border: '3px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, overflow: 'hidden', boxShadow: '0 4px 16px rgba(3,38,85,0.15)',
            }}>
              {profile.logo_url ? (
                <img src={profile.logo_url} alt={profile.company_name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              ) : (
                <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 800, fontSize: '1.1rem', color: '#fff' }}>{initials}</span>
              )}
            </div>

            <div style={{ paddingBottom: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '2px' }}>
                <h2 style={{ fontFamily: 'var(--font-ui)', fontSize: '1.2rem', fontWeight: 800, color: '#032655', letterSpacing: '-0.03em', lineHeight: 1.2, margin: 0 }}>
                  {profile.company_name}
                </h2>
                {profile.is_verified && (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="#0A9E97" style={{ flexShrink: 0 }}>
                    <title>Verified by AlphaNom</title>
                    <path d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.49 4.49 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.307 4.49 4.49 0 01-1.307-3.497A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"/>
                  </svg>
                )}
              </div>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', color: '#96AFCA', margin: 0 }}>
                @{profile.username} · Employer
              </p>
            </div>

            <div style={{ marginLeft: 'auto', paddingBottom: '4px', textAlign: 'right' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '5px 10px', borderRadius: '99px', background: complete ? '#D8F0EB' : '#FDF3DC', border: `1px solid ${complete ? '#0FB9B1' : '#F5A623'}` }}>
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
              <div key={step.label} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 10px', borderRadius: '99px', background: step.done ? '#D8F0EB' : '#EEF3F8', border: `1px solid ${step.done ? '#0FB9B1' : '#D0DBE8'}` }}>
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

      {/* ── Company Logo ─────────────────────────────────────────────── */}
      <LogoSection
        profile={profile}
        onUpdate={(url) => setProfile((p) => p ? { ...p, logo_url: url } : p)}
      />

      {/* ── Company Overview ─────────────────────────────────────────── */}
      <EditSection
        title="Company Overview"
        icon={
          <svg fill="none" stroke="#5A7A9F" strokeWidth={1.8} viewBox="0 0 24 24" style={{ width: '14px', height: '14px' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        }
        fields={[
          {
            key: 'company_overview', label: 'About the Company',
            value: profile.company_overview ?? '', type: 'textarea',
            placeholder: 'Tell recruiters and candidates about your company, culture, mission and what makes you a great place to work…',
          },
        ]}
        onSave={async (data) => {
          await updateEmployerProfile(data)
          setProfile((p) => p ? { ...p, ...data } : p)
          router.refresh()
        }}
      />

      {/* ── Company Information ──────────────────────────────────────── */}
      <EditSection
        title="Company Information"
        icon={
          <svg fill="none" stroke="#5A7A9F" strokeWidth={1.8} viewBox="0 0 24 24" style={{ width: '14px', height: '14px' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
          </svg>
        }
        fields={[
          { key: 'company_name',    label: 'Company Name',      value: profile.company_name,                                    type: 'text',     placeholder: 'Acme Corp' },
          { key: 'industry',        label: 'Industry *',        value: profile.industry ?? '',                                  type: 'select',   options: INDUSTRIES,    placeholder: 'Select industry', required: true },
          { key: 'company_size',    label: 'Company Size',      value: profile.company_size ?? '',                              type: 'select',   options: COMPANY_SIZES, placeholder: 'Select size' },
          { key: 'company_website', label: 'Website',           value: profile.company_website ?? '',                          type: 'text',     placeholder: 'https://acmecorp.com' },
          { key: 'founded_year',    label: 'Founded Year',      value: profile.founded_year ? String(profile.founded_year) : '', type: 'text',    placeholder: 'e.g. 2015' },
          { key: 'company_address', label: 'Headquarters *',    value: profile.company_address ?? '',                          type: 'textarea', placeholder: '123 MG Road, Bangalore, Karnataka 560001', required: true },
        ]}
        onSave={async (data) => {
          const wasComplete = isProfileComplete(profile)
          const toSave: any = { ...data }
          if ('founded_year' in toSave) {
            toSave.founded_year = toSave.founded_year ? parseInt(toSave.founded_year) || null : null
          }
          await updateEmployerProfile(toSave)
          const updated = { ...profile!, ...toSave } as EmployerProfile
          setProfile((p) => p ? { ...p, ...toSave } : p)
          if (!wasComplete && isProfileComplete(updated)) {
            window.location.href = '/employer/dashboard/jobs'
          } else {
            router.refresh()
          }
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
          { key: 'contact_primary',   label: 'Primary Contact',  value: profile.contact_primary,        type: 'text', placeholder: '+91 98765 43210' },
          { key: 'contact_secondary', label: 'Secondary Contact', value: profile.contact_secondary ?? '', type: 'text', placeholder: '+91 91234 56789 (optional)' },
        ]}
        onSave={async (data) => {
          await updateEmployerProfile(data)
          setProfile((p) => p ? { ...p, ...data } : p)
          router.refresh()
        }}
      />

      {/* ── Account (read-only) ──────────────────────────────────────── */}
      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #D0DBE8', overflow: 'hidden', boxShadow: '0 2px 12px rgba(3,38,85,0.05)' }}>
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

/* ── Company Logo section ────────────────────────────────────────────────── */
function LogoSection({ profile, onUpdate }: { profile: EmployerProfile; onUpdate: (url: string) => void }) {
  const [preview,   setPreview]   = useState<string | null>(null)
  const [file,      setFile]      = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [saved,     setSaved]     = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const displayUrl = preview ?? profile.logo_url
  const initials = (profile.company_name ?? '?').split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  async function handleSave() {
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadEmployerLogo(file)
      await updateEmployerProfile({ logo_url: url })
      onUpdate(url)
      setSaved(true)
      setFile(null)
      setPreview(null)
      setTimeout(() => setSaved(false), 2500)
    } catch (err) {
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #D0DBE8', overflow: 'hidden', boxShadow: '0 2px 12px rgba(3,38,85,0.05)' }}>
      {/* Header */}
      <div style={{ padding: '13px 18px', borderBottom: '1px solid #EEF3F8', display: 'flex', alignItems: 'center', gap: '9px' }}>
        <div style={{ width: '26px', height: '26px', borderRadius: '6px', background: '#EEF3F8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg fill="none" stroke="#5A7A9F" strokeWidth={1.8} viewBox="0 0 24 24" style={{ width: '14px', height: '14px' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
        </div>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', fontWeight: 700, color: '#032655' }}>Company Logo</p>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '7px' }}>
          {saved && (
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.68rem', fontWeight: 600, color: '#0A9E97', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <svg fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" style={{ width: '11px', height: '11px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              Saved
            </span>
          )}
          {file && (
            <>
              <button onClick={() => { setFile(null); setPreview(null) }} style={{ padding: '5px 12px', borderRadius: '7px', background: 'transparent', border: '1px solid #D0DBE8', fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 600, color: '#5A7A9F', cursor: 'pointer' }}>
                Cancel
              </button>
              <button onClick={handleSave} disabled={uploading} style={{ padding: '5px 14px', borderRadius: '7px', background: uploading ? '#96AFCA' : '#032655', border: 'none', fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 700, color: '#fff', cursor: uploading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                {uploading && <div style={{ width: '10px', height: '10px', border: '2px solid rgba(255,255,255,0.4)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'profSpin 0.7s linear infinite' }} />}
                {uploading ? 'Uploading…' : 'Save Logo'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '18px', display: 'flex', alignItems: 'center', gap: '20px' }}>
        {/* Avatar preview with edit button */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '16px', overflow: 'hidden', border: '1.5px solid #D0DBE8', background: '#F5F8FC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {displayUrl ? (
              <img src={displayUrl} alt="Company logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            ) : (
              <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 800, fontSize: '1.4rem', color: '#032655' }}>{initials}</span>
            )}
          </div>
          <button
            onClick={() => inputRef.current?.click()}
            style={{ position: 'absolute', bottom: '-8px', right: '-8px', width: '26px', height: '26px', borderRadius: '50%', background: '#032655', border: '2px solid #fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.15)' }}
          >
            <svg fill="none" stroke="#fff" strokeWidth={2.5} viewBox="0 0 24 24" style={{ width: '10px', height: '10px' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
            </svg>
          </button>
          <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" onChange={handleFile} style={{ display: 'none' }} />
        </div>

        <div>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', fontWeight: 600, color: '#032655', margin: '0 0 4px' }}>
            {profile.logo_url ? 'Update company logo' : 'Upload company logo'}
          </p>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', color: '#96AFCA', margin: '0 0 10px', lineHeight: 1.5 }}>
            PNG, JPG or WebP · Shown on job cards and recruiter profiles
          </p>
          <button
            onClick={() => inputRef.current?.click()}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: '8px', background: '#EEF3F8', border: '1px solid #D0DBE8', fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 600, color: '#032655', cursor: 'pointer' }}
          >
            <svg fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" style={{ width: '12px', height: '12px' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            Choose file
          </button>
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
  const [saved,  setSaved]  = useState(false)

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
              <div style={{ padding: '10px 13px', borderRadius: '9px', background: '#FAFCFE', border: '1px solid #EEF3F8', fontFamily: 'var(--font-ui)', fontSize: '0.875rem', color: values[field.key] ? '#032655' : '#96AFCA', whiteSpace: 'pre-wrap' as const }}>
                {values[field.key] || (field.placeholder ?? '—')}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
