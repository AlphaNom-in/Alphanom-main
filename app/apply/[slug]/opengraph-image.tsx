import { ImageResponse } from 'next/og'
import { readFileSync } from 'fs'
import { join } from 'path'
import { createAdminClient } from '@/lib/supabase/admin'

export const alt = 'Job Opening on AlphaNom'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: { slug: string } }) {
  const { slug } = params
  const admin = createAdminClient()

  let title = 'Open Position'
  let location = ''
  let company = ''
  let salary = ''

  try {
    const { data: link } = await admin
      .from('recruiter_share_links')
      .select('job_post_id, is_active')
      .eq('slug', slug)
      .single()

    if (link?.is_active) {
      const { data: job } = await admin
        .from('job_posts')
        .select('title, location, budget_min, budget_max, employers(company_name)')
        .eq('id', link.job_post_id)
        .single()

      if (job) {
        title = job.title ?? title
        location = job.location ?? ''
        company = (job.employers as any)?.company_name ?? ''
        const salaryMin = job.budget_min ? Math.round(job.budget_min / 100000) : null
        const salaryMax = job.budget_max ? Math.round(job.budget_max / 100000) : null
        if (salaryMin && salaryMax) salary = `₹${salaryMin}–${salaryMax} LPA`
      }
    }
  } catch {
    // fallback to defaults
  }

  // Load the AlphaNom logo as base64
  let logoSrc: string | undefined
  try {
    const logoBuffer = readFileSync(join(process.cwd(), 'public/images/logo.png'))
    logoSrc = `data:image/png;base64,${logoBuffer.toString('base64')}`
  } catch {
    logoSrc = undefined
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: 'flex',
          flexDirection: 'column',
          background: '#032655',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background decorative circles */}
        <div style={{ position: 'absolute', top: -120, right: -120, width: 400, height: 400, borderRadius: '50%', background: 'rgba(15,185,177,0.07)', display: 'flex' }} />
        <div style={{ position: 'absolute', bottom: -80, left: -80, width: 280, height: 280, borderRadius: '50%', background: 'rgba(15,185,177,0.05)', display: 'flex' }} />

        {/* Teal top stripe */}
        <div style={{ height: 5, background: 'linear-gradient(90deg, #032655 0%, #0FB9B1 50%, #032655 100%)', display: 'flex' }} />

        {/* Content */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '52px 80px', justifyContent: 'space-between' }}>

          {/* Top: logo + brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {logoSrc ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={logoSrc} width={56} height={56} style={{ borderRadius: 12, display: 'block' }} alt="" />
            ) : (
              <div style={{ width: 56, height: 56, borderRadius: 12, background: '#0FB9B1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 28, fontWeight: 900, color: '#fff' }}>A</span>
              </div>
            )}
            <span style={{ fontSize: 30, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>AlphaNom</span>
            <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.2)', marginLeft: 4, display: 'flex' }} />
            <span style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Confidential Recruitment</span>
          </div>

          {/* Middle: job info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {company ? (
              <span style={{ fontSize: 22, color: '#0FB9B1', fontWeight: 600 }}>{company}</span>
            ) : null}
            <h1 style={{
              fontSize: title.length > 40 ? 48 : 60,
              fontWeight: 900,
              color: '#fff',
              margin: 0,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
            }}>
              {title}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              {location ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 100, padding: '8px 18px' }}>
                  <span style={{ fontSize: 18 }}>📍</span>
                  <span style={{ fontSize: 20, color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>{location}</span>
                </div>
              ) : null}
              {salary ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(15,185,177,0.15)', border: '1px solid rgba(15,185,177,0.3)', borderRadius: 100, padding: '8px 18px' }}>
                  <span style={{ fontSize: 20, color: '#0FB9B1', fontWeight: 700 }}>{salary}</span>
                </div>
              ) : null}
            </div>
          </div>

          {/* Bottom: apply nudge */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.35)' }}>
              alphanom.in · Confidential · Powered by AlphaNom
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'linear-gradient(135deg, #0FB9B1, #0A9E97)', borderRadius: 12, padding: '12px 24px' }}>
              <span style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>Apply Now →</span>
            </div>
          </div>
        </div>

        {/* Teal bottom stripe */}
        <div style={{ height: 5, background: 'linear-gradient(90deg, #0FB9B1 0%, #032655 100%)', display: 'flex' }} />
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
