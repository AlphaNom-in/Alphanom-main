import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const admin = createAdminClient()

  const { data: link } = await admin
    .from('recruiter_share_links')
    .select('job_post_id, is_active')
    .eq('slug', slug)
    .single()

  if (!link?.is_active) return { title: 'Job Opening | AlphaNom' }

  const { data: job } = await admin
    .from('job_posts')
    .select('title, location, budget_min, budget_max, employers(company_name)')
    .eq('id', link.job_post_id)
    .single()

  if (!job) return { title: 'Job Opening | AlphaNom' }

  const employer = job.employers as any
  const parts = [job.title, job.location].filter(Boolean)
  const salaryMin = job.budget_min ? Math.round(job.budget_min / 100000) : null
  const salaryMax = job.budget_max ? Math.round(job.budget_max / 100000) : null
  const salaryStr = salaryMin && salaryMax ? `₹${salaryMin}–${salaryMax} LPA` : null

  const descParts = [
    employer?.company_name,
    job.location,
    salaryStr,
    'Apply confidentially via AlphaNom.',
  ].filter(Boolean)

  const title = `${parts.join(' · ')} | AlphaNom`

  return {
    title,
    description: descParts.join(' · '),
    openGraph: {
      title,
      description: descParts.join(' · '),
      siteName: 'AlphaNom',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: descParts.join(' · '),
    },
  }
}

function isHTML(text: string) {
  return /<\/?(p|div|b|i|u|br|ul|ol|li|strong|em|h[1-6]|span)\b[^>]*>/i.test(text)
}

function Section({ title, accent = '#0FB9B1', children }: { title: string; accent?: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
        <div style={{ width: '3px', height: '18px', borderRadius: '2px', background: accent, flexShrink: 0 }} />
        <h2 style={{ fontFamily: 'var(--font-ui)', fontSize: '0.68rem', fontWeight: 800, color: '#032655', textTransform: 'uppercase', letterSpacing: '0.12em', margin: 0 }}>
          {title}
        </h2>
      </div>
      {children}
    </div>
  )
}

function Chip({ label }: { label: string }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', fontFamily: 'var(--font-ui)', fontSize: '0.78rem', fontWeight: 600, color: '#032655', background: '#EEF3F8', border: '1px solid #D0DBE8', borderRadius: '8px', padding: '6px 12px', margin: '0 6px 6px 0' }}>
      {label}
    </span>
  )
}

function MustChip({ label }: { label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 14px', background: '#F5F8FC', border: '1px solid #EEF3F8', borderRadius: '9px', marginBottom: '7px' }}>
      <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#D8F0EB', border: '1px solid rgba(15,185,177,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <svg width="9" height="9" fill="none" stroke="#0A9E97" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </div>
      <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', fontWeight: 600, color: '#032655' }}>{label}</span>
    </div>
  )
}

export default async function JobDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const admin = createAdminClient()

  const { data: link } = await admin
    .from('recruiter_share_links')
    .select('recruiter_id, job_post_id, is_active')
    .eq('slug', slug)
    .single()

  if (!link || !link.is_active) notFound()

  const { data: job } = await admin
    .from('job_posts')
    .select(`
      id, title, department, location, work_model, budget_min, budget_max,
      notice_period, mandatory_criteria, preferred_criteria, preferred_companies,
      recruiter_note, jd_pdf_url,
      employers (
        company_name, logo_url, industry, company_size, founded_year,
        company_overview, company_website, company_address, is_verified
      )
    `)
    .eq('id', link.job_post_id)
    .single()

  if (!job) notFound()

  const employer = job.employers as any
  const salaryMin = job.budget_min ? `₹${(job.budget_min / 100000).toFixed(0)}` : null
  const salaryMax = job.budget_max ? `₹${(job.budget_max / 100000).toFixed(0)}` : null
  const salaryLabel = salaryMin && salaryMax ? `${salaryMin}–${salaryMax} LPA` : salaryMax ? `Up to ${salaryMax} LPA` : null

  function initials(name: string) {
    return name.split(' ').filter(Boolean).map((w: string) => w[0]).slice(0, 2).join('').toUpperCase()
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F5F8FC', display: 'flex', flexDirection: 'column' }}>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header style={{ background: '#fff', borderBottom: '1px solid #EEF3F8', position: 'sticky', top: 0, zIndex: 20, flexShrink: 0, boxShadow: '0 1px 0 rgba(3,38,85,0.05), 0 4px 16px rgba(3,38,85,0.06)' }}>
        <div style={{ height: '2.5px', background: 'linear-gradient(90deg, #032655 0%, #0FB9B1 40%, #15C7C0 60%, #032655 100%)' }} />
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: '0 24px', height: '54px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Image src="/images/logo.png" alt="AlphaNom" width={44} height={44} style={{ display: 'block', flexShrink: 0 }} />
          <span style={{ fontFamily: 'var(--font-ui)', fontSize: '1.15rem', fontWeight: 800, color: '#032655', letterSpacing: '-0.02em' }}>
            AlphaNom
          </span>
          <span style={{ width: '1px', height: '18px', background: '#D0DBE8', flexShrink: 0 }} />
          <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 700, color: '#5A7A9F', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Job Details
          </span>
        </div>
      </header>

      {/* ── Main content ────────────────────────────────────────────────── */}
      <main style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: '36px 24px 64px' }}>
        <div style={{ width: '100%', maxWidth: '720px' }}>

          {/* ── Hero card: company + job title ─────────────────────────── */}
          <div style={{ background: '#fff', borderRadius: '18px', border: '1px solid #D0DBE8', overflow: 'hidden', boxShadow: '0 2px 20px rgba(3,38,85,0.07)', marginBottom: '24px' }}>
            {/* Gradient top strip */}
            <div style={{ height: '5px', background: 'linear-gradient(90deg, #032655 0%, #0FB9B1 100%)' }} />

            <div style={{ padding: '28px 32px 24px' }}>
              {/* Company row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                {/* Company logo */}
                <div style={{
                  width: '64px', height: '64px', borderRadius: '14px', flexShrink: 0,
                  background: employer?.logo_url ? '#fff' : '#032655',
                  border: '1.5px solid #D0DBE8',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  overflow: 'hidden', boxShadow: '0 4px 14px rgba(3,38,85,0.1)',
                }}>
                  {employer?.logo_url ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={employer.logo_url} alt={employer.company_name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  ) : (
                    <span style={{ fontFamily: 'var(--font-ui)', fontSize: '1rem', fontWeight: 800, color: '#fff' }}>
                      {employer?.company_name ? initials(employer.company_name) : 'CO'}
                    </span>
                  )}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <p style={{ fontFamily: 'var(--font-ui)', fontSize: '1rem', fontWeight: 700, color: '#032655', margin: 0 }}>
                      {employer?.company_name ?? 'Company'}
                    </p>
                    {employer?.is_verified && (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="#0A9E97" style={{ flexShrink: 0 }}>
                        <title>Verified</title>
                        <path d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.49 4.49 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.307 4.49 4.49 0 01-1.307-3.497A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" />
                      </svg>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {employer?.industry && (
                      <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', fontWeight: 600, color: '#5A7A9F', background: '#EEF3F8', borderRadius: '5px', padding: '2px 8px' }}>
                        {employer.industry}
                      </span>
                    )}
                    {employer?.company_size && (
                      <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', fontWeight: 600, color: '#5A7A9F', background: '#EEF3F8', borderRadius: '5px', padding: '2px 8px' }}>
                        👥 {employer.company_size}
                      </span>
                    )}
                    {employer?.founded_year && (
                      <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', color: '#96AFCA', padding: '2px 4px' }}>
                        Est. {employer.founded_year}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Job title */}
              <h1 style={{ fontFamily: 'var(--font-ui)', fontSize: '1.7rem', fontWeight: 900, color: '#032655', letterSpacing: '-0.03em', lineHeight: 1.15, margin: '0 0 16px' }}>
                {job.title}
              </h1>

              {/* Meta chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                {job.department && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontFamily: 'var(--font-ui)', fontSize: '0.75rem', fontWeight: 600, color: '#5A7A9F', background: '#F5F8FC', border: '1px solid #D0DBE8', borderRadius: '100px', padding: '5px 13px' }}>
                    {job.department}
                  </span>
                )}
                {job.location && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontFamily: 'var(--font-ui)', fontSize: '0.75rem', fontWeight: 600, color: '#5A7A9F', background: '#F5F8FC', border: '1px solid #D0DBE8', borderRadius: '100px', padding: '5px 13px' }}>
                    <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                    {job.location}
                  </span>
                )}
                {job.work_model && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontFamily: 'var(--font-ui)', fontSize: '0.75rem', fontWeight: 600, color: '#5A7A9F', background: '#F5F8FC', border: '1px solid #D0DBE8', borderRadius: '100px', padding: '5px 13px' }}>
                    <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18h16.5a1.5 1.5 0 011.5 1.5v11.25a1.5 1.5 0 01-1.5 1.5H3.75a1.5 1.5 0 01-1.5-1.5V4.5a1.5 1.5 0 011.5-1.5z" /></svg>
                    {job.work_model}
                  </span>
                )}
                {salaryLabel && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontFamily: 'var(--font-ui)', fontSize: '0.75rem', fontWeight: 700, color: '#0A9E97', background: '#D8F0EB', border: '1px solid rgba(15,185,177,0.25)', borderRadius: '100px', padding: '5px 13px' }}>
                    <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {salaryLabel}
                  </span>
                )}
                {job.notice_period && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontFamily: 'var(--font-ui)', fontSize: '0.75rem', fontWeight: 600, color: '#96AFCA', background: '#F5F8FC', border: '1px solid #EEF3F8', borderRadius: '100px', padding: '5px 13px' }}>
                    🕐 {job.notice_period} notice
                  </span>
                )}
              </div>

              {/* CTA button */}
              <Link
                href={`/apply/${slug}/form`}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '13px 28px', borderRadius: '11px',
                  background: 'linear-gradient(135deg, #032655 0%, #0FB9B1 100%)',
                  color: '#fff', fontFamily: 'var(--font-ui)', fontSize: '0.88rem',
                  fontWeight: 700, textDecoration: 'none', letterSpacing: '-0.01em',
                  boxShadow: '0 6px 20px rgba(3,38,85,0.22)',
                }}
              >
                Apply for this Role
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>

          {/* ── Job Details card ────────────────────────────────────────── */}
          <div style={{ background: '#fff', borderRadius: '18px', border: '1px solid #D0DBE8', padding: '32px', boxShadow: '0 2px 20px rgba(3,38,85,0.06)', marginBottom: '24px' }}>

            {/* About the Role */}
            {job.recruiter_note && (
              <Section title="About the Role">
                {isHTML(job.recruiter_note) ? (
                  <>
                    <div
                      dangerouslySetInnerHTML={{ __html: job.recruiter_note }}
                      className="pub-jd"
                      style={{ fontFamily: 'var(--font-ui)', fontSize: '0.88rem', color: '#3D5A7A', lineHeight: 1.8 }}
                    />
                    <style>{`
                      .pub-jd b, .pub-jd strong { font-weight: 700; color: #032655; }
                      .pub-jd i, .pub-jd em { font-style: italic; }
                      .pub-jd u { text-decoration: underline; }
                      .pub-jd ul, .pub-jd ol { margin: 8px 0; padding-left: 22px; }
                      .pub-jd li { margin: 5px 0; }
                      .pub-jd p { margin: 6px 0; }
                    `}</style>
                  </>
                ) : (
                  <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.88rem', color: '#3D5A7A', lineHeight: 1.8, margin: 0, whiteSpace: 'pre-wrap' }}>
                    {job.recruiter_note}
                  </p>
                )}
              </Section>
            )}

            {/* Must-Have Requirements */}
            {job.mandatory_criteria?.length > 0 && (
              <Section title="Must-Have Requirements" accent="#032655">
                {job.mandatory_criteria.map((item: string, i: number) => (
                  <MustChip key={i} label={item} />
                ))}
              </Section>
            )}

            {/* Good to Have */}
            {job.preferred_criteria?.length > 0 && (
              <Section title="Good to Have" accent="#96AFCA">
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {job.preferred_criteria.map((item: string, i: number) => (
                    <Chip key={i} label={item} />
                  ))}
                </div>
              </Section>
            )}

            {/* Preferred Company Backgrounds */}
            {job.preferred_companies?.length > 0 && (
              <Section title="Preferred Company Backgrounds" accent="#0FB9B1">
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', color: '#96AFCA', margin: '0 0 10px' }}>
                  Candidates from these companies are particularly welcome.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {job.preferred_companies.map((item: string, i: number) => (
                    <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-ui)', fontSize: '0.78rem', fontWeight: 700, color: '#0A9E97', background: '#D8F0EB', border: '1px solid rgba(15,185,177,0.2)', borderRadius: '8px', padding: '6px 12px', margin: '0 6px 6px 0' }}>
                      <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#0FB9B1' }} />
                      {item}
                    </span>
                  ))}
                </div>
              </Section>
            )}

            {/* Quick Facts */}
            {(job.notice_period || job.work_model || salaryLabel) && (
              <Section title="Quick Facts" accent="#5A7A9F">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px' }}>
                  {[
                    { label: 'Work Model',    value: job.work_model },
                    { label: 'Location',      value: job.location },
                    { label: 'Notice Period', value: job.notice_period },
                    { label: 'Salary Range',  value: salaryLabel },
                  ].filter(f => f.value).map(f => (
                    <div key={f.label} style={{ background: '#F5F8FC', border: '1px solid #EEF3F8', borderRadius: '10px', padding: '12px 16px' }}>
                      <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.58rem', fontWeight: 700, color: '#96AFCA', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 4px' }}>
                        {f.label}
                      </p>
                      <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.88rem', fontWeight: 700, color: '#032655', margin: 0 }}>
                        {f.value}
                      </p>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* JD PDF */}
            {job.jd_pdf_url && (
              <div style={{ marginTop: '4px' }}>
                <a
                  href={job.jd_pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '10px 18px', borderRadius: '9px', border: '1.5px solid #D0DBE8', background: '#fff', color: '#5A7A9F', textDecoration: 'none', fontFamily: 'var(--font-ui)', fontSize: '0.78rem', fontWeight: 600 }}
                >
                  <svg width="14" height="14" fill="none" stroke="#E53E3E" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                  Download Full JD (PDF)
                </a>
              </div>
            )}
          </div>

          {/* ── Company Profile card ────────────────────────────────────── */}
          {employer && (
            <div style={{ background: '#fff', borderRadius: '18px', border: '1px solid #D0DBE8', padding: '32px', boxShadow: '0 2px 20px rgba(3,38,85,0.06)', marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <div style={{ width: '3px', height: '18px', borderRadius: '2px', background: '#5A7A9F', flexShrink: 0 }} />
                <h2 style={{ fontFamily: 'var(--font-ui)', fontSize: '0.68rem', fontWeight: 800, color: '#032655', textTransform: 'uppercase', letterSpacing: '0.12em', margin: 0 }}>
                  About the Company
                </h2>
              </div>

              {/* Logo + name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '18px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '13px', overflow: 'hidden', flexShrink: 0, background: employer.logo_url ? '#fff' : '#032655', border: '1.5px solid #D0DBE8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {employer.logo_url ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={employer.logo_url} alt={employer.company_name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  ) : (
                    <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.85rem', fontWeight: 800, color: '#fff' }}>
                      {initials(employer.company_name ?? 'CO')}
                    </span>
                  )}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                    <p style={{ fontFamily: 'var(--font-ui)', fontSize: '1rem', fontWeight: 700, color: '#032655', margin: 0 }}>
                      {employer.company_name}
                    </p>
                    {employer.is_verified && (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="#0A9E97">
                        <title>Verified</title>
                        <path d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.49 4.49 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.307 4.49 4.49 0 01-1.307-3.497A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" />
                      </svg>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {employer.industry && <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', fontWeight: 600, color: '#5A7A9F', background: '#EEF3F8', borderRadius: '5px', padding: '2px 8px' }}>{employer.industry}</span>}
                    {employer.company_size && <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', fontWeight: 600, color: '#5A7A9F', background: '#EEF3F8', borderRadius: '5px', padding: '2px 8px' }}>👥 {employer.company_size}</span>}
                    {employer.founded_year && <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', color: '#96AFCA' }}>Est. {employer.founded_year}</span>}
                  </div>
                </div>
              </div>

              {/* Overview */}
              {employer.company_overview && (
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.88rem', color: '#3D5A7A', lineHeight: 1.8, margin: '0 0 18px', whiteSpace: 'pre-wrap' }}>
                  {employer.company_overview}
                </p>
              )}

              {/* Website + Address */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {employer.company_website && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                    <svg width="14" height="14" fill="none" stroke="#96AFCA" strokeWidth={1.8} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253" />
                    </svg>
                    <a href={employer.company_website} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', color: '#0FB9B1', fontWeight: 600, textDecoration: 'none', wordBreak: 'break-all' }}>
                      {employer.company_website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
                {employer.company_address && (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '9px', padding: '12px 14px', background: '#F5F8FC', borderRadius: '10px', border: '1px solid #EEF3F8' }}>
                    <svg width="14" height="14" fill="none" stroke="#96AFCA" strokeWidth={1.8} viewBox="0 0 24 24" style={{ flexShrink: 0, marginTop: '2px' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    <div>
                      <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.58rem', fontWeight: 700, color: '#96AFCA', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 3px' }}>Headquarters</p>
                      <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', color: '#5A7A9F', margin: 0, lineHeight: 1.5 }}>{employer.company_address}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Bottom Apply CTA ────────────────────────────────────────── */}
          <div style={{ background: 'linear-gradient(135deg, #032655 0%, #0a3d7a 100%)', borderRadius: '18px', padding: '32px', textAlign: 'center', boxShadow: '0 8px 32px rgba(3,38,85,0.22)' }}>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.14em', margin: '0 0 8px' }}>
              Interested?
            </p>
            <h2 style={{ fontFamily: 'var(--font-ui)', fontSize: '1.4rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', margin: '0 0 6px' }}>
              Apply for {job.title}
            </h2>
            {salaryLabel && (
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.88rem', fontWeight: 700, color: '#7EECEA', margin: '0 0 22px' }}>
                {salaryLabel}
              </p>
            )}
            <Link
              href={`/apply/${slug}/form`}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '14px 32px', borderRadius: '12px',
                background: 'linear-gradient(135deg, #0FB9B1 0%, #0A9E97 100%)',
                color: '#fff', fontFamily: 'var(--font-ui)', fontSize: '0.95rem',
                fontWeight: 800, textDecoration: 'none', letterSpacing: '-0.01em',
                boxShadow: '0 6px 24px rgba(15,185,177,0.4)',
              }}
            >
              Start Application
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)', margin: '16px 0 0' }}>
              Takes about 5 minutes · Your data is shared only with the recruiter
            </p>
          </div>
        </div>
      </main>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer style={{ padding: '18px 24px', textAlign: 'center', borderTop: '1px solid #D0DBE8', background: '#fff', flexShrink: 0 }}>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.62rem', color: '#96AFCA', margin: 0 }}>
          Powered by <strong style={{ color: '#5A7A9F' }}>AlphaNom</strong> · Confidential recruitment platform ·{' '}
          <a href="https://alphanom.in" style={{ color: '#0FB9B1', textDecoration: 'none' }}>alphanom.in</a>
        </p>
      </footer>
    </div>
  )
}
