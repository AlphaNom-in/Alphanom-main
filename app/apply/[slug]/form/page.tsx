import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createAdminClient } from '@/lib/supabase/admin'
import ApplyForm from '../ApplyForm'

export const dynamic = 'force-dynamic'

export default async function ApplyFormPage({ params }: { params: Promise<{ slug: string }> }) {
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
    .select('title, department, location, work_model, budget_min, budget_max, notice_period')
    .eq('id', link.job_post_id)
    .single()

  if (!job) notFound()

  const slugData = { recruiterId: link.recruiter_id, jobPostId: link.job_post_id }

  return (
    <div style={{ minHeight: '100vh', background: '#F5F8FC', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <header style={{ background: '#fff', borderBottom: '1px solid #EEF3F8', flexShrink: 0, boxShadow: '0 1px 0 rgba(3,38,85,0.05), 0 4px 16px rgba(3,38,85,0.06)' }}>
        <div style={{ height: '2.5px', background: 'linear-gradient(90deg, #032655 0%, #0FB9B1 40%, #15C7C0 60%, #032655 100%)' }} />
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: '0 24px', height: '54px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Image src="/images/logo.png" alt="AlphaNom" width={44} height={44} style={{ display: 'block' }} />
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: '1.15rem', fontWeight: 800, color: '#032655', letterSpacing: '-0.02em' }}>
              AlphaNom
            </span>
            <span style={{ width: '1px', height: '18px', background: '#D0DBE8' }} />
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 700, color: '#5A7A9F', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Application Form</span>
          </div>
          <Link
            href={`/apply/${slug}`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 600, color: '#5A7A9F', textDecoration: 'none' }}
          >
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Job Details
          </Link>
        </div>
      </header>

      {/* Body */}
      <main style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: '32px 24px 56px' }}>
        <div style={{ width: '100%', maxWidth: '720px' }}>
          <ApplyForm job={job} slugData={slugData} />
        </div>
      </main>

      {/* Footer */}
      <footer style={{ padding: '16px 24px', textAlign: 'center', borderTop: '1px solid #D0DBE8', background: '#fff', flexShrink: 0 }}>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.62rem', color: '#96AFCA', margin: 0 }}>
          Powered by <strong style={{ color: '#5A7A9F' }}>AlphaNom</strong> · Confidential recruitment platform ·{' '}
          <a href="https://alphanom.in" style={{ color: '#0FB9B1', textDecoration: 'none' }}>alphanom.in</a>
        </p>
      </footer>
    </div>
  )
}
