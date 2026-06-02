'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import MetricCard from '@/components/employer/MetricCard'
import { getEmployerProfile } from '@/hooks/useEmployer'
import { getEmployerDashboardData } from '@/hooks/useEmployerDashboard'
import { isProfileComplete, profileCompletionSteps, profileCompletionPercent } from '@/hooks/useEmployerProfile'

const METRICS = [
  {
    key: 'activeJobs',
    title: 'Active Jobs',
    color: '#0FB9B1',
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" style={{ width: '15px', height: '15px' }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
      </svg>
    ),
  },
  {
    key: 'candidates',
    title: 'Total Candidates',
    color: '#032655',
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" style={{ width: '15px', height: '15px' }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
  },
  {
    key: 'shortlisted',
    title: 'Shortlisted',
    color: '#5A7A9F',
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" style={{ width: '15px', height: '15px' }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    key: 'closedRoles',
    title: 'Closed Roles',
    color: '#0A9E97',
    icon: (
      <svg fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" style={{ width: '15px', height: '15px' }}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
  },
]

export default function Page() {
  const [profile, setProfile] = useState<any>(null)
  const [metrics, setMetrics] = useState<any>(null)

  useEffect(() => {
    async function load() {
      const [profileData, metricData] = await Promise.all([
        getEmployerProfile(),
        getEmployerDashboardData(),
      ])
      setProfile(profileData)
      setMetrics(metricData)
    }
    load()
  }, [])

  if (!metrics) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '32px', height: '32px',
            border: '3px solid #D0DBE8', borderTop: '3px solid #0FB9B1',
            borderRadius: '50%', margin: '0 auto 10px',
            animation: 'dashSpin 0.8s linear infinite',
          }} />
          <p style={{ fontFamily: 'var(--font-ui)', color: '#96AFCA', fontSize: '0.82rem' }}>Loading…</p>
          <style>{`@keyframes dashSpin { to { transform: rotate(360deg) } }`}</style>
        </div>
      </div>
    )
  }

  const complete = isProfileComplete(profile)
  const steps = profileCompletionSteps(profile)
  const pct = profileCompletionPercent(profile)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      {/* ── Profile incomplete banner ────────────────────────────────── */}
      {!complete && (
        <div style={{
          background: '#fff',
          border: '1px solid #D0DBE8',
          borderLeft: '3px solid #F5A623',
          borderRadius: '12px',
          padding: '1rem 1.25rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          boxShadow: '0 2px 12px rgba(3,38,85,0.04)',
        }}>
          {/* Icon */}
          <div style={{
            width: '36px', height: '36px', borderRadius: '9px',
            background: '#FDF3DC', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg fill="none" stroke="#F5A623" strokeWidth={1.8} viewBox="0 0 24 24" style={{ width: '18px', height: '18px' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
          </div>

          {/* Text + steps */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', gap: '12px', flexWrap: 'wrap' }}>
              <div>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.85rem', fontWeight: 700, color: '#032655', marginBottom: '2px' }}>
                  Complete your profile to unlock job posting
                </p>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', color: '#5A7A9F' }}>
                  Add your industry and company address to start posting jobs to 1,500+ recruiters.
                </p>
              </div>
              <Link href="/employer/dashboard/profile" style={{
                display: 'inline-flex', alignItems: 'center', gap: '5px',
                padding: '7px 14px', borderRadius: '7px',
                background: '#032655', color: '#fff',
                fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 700,
                textDecoration: 'none', whiteSpace: 'nowrap',
              }}>
                Complete Profile
                <svg fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24" style={{ width: '11px', height: '11px' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            {/* Progress bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ flex: 1, height: '5px', background: '#EEF3F8', borderRadius: '99px', overflow: 'hidden' }}>
                <div style={{ width: `${pct}%`, height: '100%', background: '#0FB9B1', borderRadius: '99px', transition: 'width 0.4s ease' }} />
              </div>
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', fontWeight: 700, color: '#5A7A9F', flexShrink: 0 }}>{pct}%</span>
            </div>

            {/* Step checklist */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '10px', flexWrap: 'wrap' }}>
              {steps.map((step) => (
                <div key={step.label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <div style={{
                    width: '14px', height: '14px', borderRadius: '50%', flexShrink: 0,
                    background: step.done ? '#D8F0EB' : '#EEF3F8',
                    border: `1.5px solid ${step.done ? '#0FB9B1' : '#D0DBE8'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {step.done && (
                      <svg fill="none" stroke="#0A9E97" strokeWidth={2.5} viewBox="0 0 24 24" style={{ width: '8px', height: '8px' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    )}
                  </div>
                  <span style={{
                    fontFamily: 'var(--font-ui)', fontSize: '0.68rem',
                    fontWeight: step.required && !step.done ? 600 : 500,
                    color: step.done ? '#0A9E97' : step.required ? '#032655' : '#96AFCA',
                  }}>
                    {step.label}
                    {step.required && !step.done && (
                      <span style={{ color: '#F5A623', marginLeft: '2px' }}>*</span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Welcome banner ──────────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg, #032655 0%, #0a3570 55%, #0FB9B1 100%)',
        borderRadius: '16px', padding: '1.5rem 2rem',
        position: 'relative', overflow: 'hidden',
      }}>
        <div aria-hidden style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>
            Welcome back
          </p>
          <h2 style={{ fontFamily: 'var(--font-ui)', fontWeight: 800, fontSize: '1.45rem', color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.2, marginBottom: '0.4rem' }}>
            {profile?.company_name ?? 'Your Company'}
          </h2>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.83rem', color: 'rgba(255,255,255,0.55)', marginBottom: '1.25rem' }}>
            Here&apos;s your hiring overview for today.
          </p>
          <div style={{ display: 'flex', gap: '10px' }}>
            {complete ? (
              <Link href="/employer/dashboard/jobs/post" style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '8px 16px', borderRadius: '8px',
                background: '#0FB9B1', color: '#fff',
                fontFamily: 'var(--font-ui)', fontSize: '0.78rem', fontWeight: 700,
                textDecoration: 'none',
              }}>
                <svg fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24" style={{ width: '12px', height: '12px' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Post a Job
              </Link>
            ) : (
              <Link href="/employer/dashboard/profile" style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '8px 16px', borderRadius: '8px',
                background: '#F5A623', color: '#fff',
                fontFamily: 'var(--font-ui)', fontSize: '0.78rem', fontWeight: 700,
                textDecoration: 'none',
              }}>
                Complete Profile First
                <svg fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24" style={{ width: '12px', height: '12px' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            )}
            <Link href="/employer/dashboard/jobs" style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '8px 16px', borderRadius: '8px',
              background: 'rgba(255,255,255,0.12)', color: '#fff',
              border: '1px solid rgba(255,255,255,0.2)',
              fontFamily: 'var(--font-ui)', fontSize: '0.78rem', fontWeight: 600,
              textDecoration: 'none',
            }}>
              View Jobs
            </Link>
          </div>
        </div>
      </div>

      {/* ── Metrics ─────────────────────────────────────────────────── */}
      <div>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.5rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#96AFCA', marginBottom: '10px' }}>
          Hiring Metrics
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
          {METRICS.map((m) => (
            <MetricCard key={m.key} title={m.title} value={metrics[m.key]} icon={m.icon} color={m.color} />
          ))}
        </div>
      </div>

    </div>
  )
}
