import { createAdminClient } from '@/lib/supabase/admin'
import Link from 'next/link'

function fmtCTC(paise: number) {
  const L = paise / 100000
  return L >= 10 ? `₹${Math.round(L)}L` : `₹${L.toFixed(1)}L`
}
function initials(name: string) {
  return (name ?? '').split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase() || '?'
}
function avatarColor(name: string) {
  const colors = ['#0FB9B1','#032655','#7C3AED','#F5A623','#276749','#C53030','#0A66C2','#B7791F']
  const i = (name?.charCodeAt(0) ?? 0) % colors.length
  return colors[i]
}

export default async function AdminOverviewPage() {
  const admin = createAdminClient()

  const [
    { count: totalRecruiters },
    { count: totalEmployers },
    { count: totalJobs },
    { count: totalSubmissions },
    { data: hiredSubs },
    { data: recentSubs },
    { data: recentJobs },
  ] = await Promise.all([
    admin.from('recruiters').select('*', { count: 'exact', head: true }),
    admin.from('employers').select('*', { count: 'exact', head: true }),
    admin.from('job_posts').select('*', { count: 'exact', head: true }),
    admin.from('candidate_submissions').select('*', { count: 'exact', head: true }),
    admin.from('candidate_submissions').select('current_ctc').eq('status', 'hired'),
    admin.from('candidate_submissions')
      .select('id, candidate_name, status, submitted_at, job_posts(title), recruiters(full_name)')
      .order('submitted_at', { ascending: false }).limit(7),
    admin.from('job_posts')
      .select('id, title, status, created_at, employers(company_name)')
      .order('created_at', { ascending: false }).limit(5),
  ])

  const totalHired       = (hiredSubs ?? []).length
  const platformEarnings = (hiredSubs ?? []).reduce((sum, s) => sum + (s.current_ctc ? s.current_ctc * 0.04 : 0), 0)
  const hireRate         = totalSubmissions ? Math.round((totalHired / totalSubmissions) * 100) : 0

  const STATUS_STYLE: Record<string, { bg: string; color: string; dot: string }> = {
    in_pipeline:     { bg: '#EEF3F8', color: '#5A7A9F', dot: '#96AFCA' },
    in_review:       { bg: '#EDE9FE', color: '#7C3AED', dot: '#7C3AED' },
    shortlisted:     { bg: '#D8F0EB', color: '#0A9E97', dot: '#0FB9B1' },
    saved_for_later: { bg: '#FFF8E7', color: '#B7791F', dot: '#F5A623' },
    hired:           { bg: '#DCFCE7', color: '#166534', dot: '#22C55E' },
    rejected:        { bg: '#FFF1F2', color: '#BE123C', dot: '#F43F5E' },
  }

  const STATS = [
    {
      label: 'Total Recruiters', value: totalRecruiters ?? 0,
      href: '/admin/recruiters', accent: '#0FB9B1',
      sub: 'Registered on platform',
      icon: (
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
      ),
    },
    {
      label: 'Total Employers', value: totalEmployers ?? 0,
      href: '/admin/employers', accent: '#032655',
      sub: 'Companies signed up',
      icon: (
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
        </svg>
      ),
    },
    {
      label: 'Job Posts', value: totalJobs ?? 0,
      href: '/admin/jobs', accent: '#F5A623',
      sub: 'Across all employers',
      icon: (
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
        </svg>
      ),
    },
    {
      label: 'Submissions', value: totalSubmissions ?? 0,
      href: '/admin/candidates', accent: '#7C3AED',
      sub: 'Total candidates submitted',
      icon: (
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
        </svg>
      ),
    },
    {
      label: 'Candidates Hired', value: totalHired,
      href: '/admin/candidates?status=hired', accent: '#16A34A',
      sub: `${hireRate}% hire rate`,
      icon: (
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: 'Platform Earnings', value: platformEarnings > 0 ? fmtCTC(platformEarnings) : '₹0',
      href: '/admin/candidates?status=hired', accent: '#0A9E97',
      sub: '4% of all placed CTCs',
      icon: (
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ]

  const JOB_STATUS_DOT: Record<string, string> = {
    active: '#16A34A', paused: '#F5A623', closed: '#C53030',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.62rem', fontWeight: 700, color: '#0FB9B1', letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0 0 4px' }}>Dashboard</p>
          <h1 style={{ fontFamily: 'var(--font-ui)', fontSize: '1.5rem', fontWeight: 800, color: '#0F1C2E', letterSpacing: '-0.03em', margin: 0 }}>Platform Overview</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: '8px', background: '#fff', border: '1px solid #E4EAF1' }}>
          <svg width="13" height="13" fill="none" stroke="#96AFCA" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
          <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', color: '#6B7E93', fontWeight: 500 }}>
            {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
        {STATS.map(s => (
          <Link key={s.label} href={s.href} style={{ textDecoration: 'none' }}>
            <div style={{
              background: '#fff', borderRadius: '12px', padding: '20px',
              border: '1px solid #E4EAF1',
              borderTop: `3px solid ${s.accent}`,
              boxShadow: '0 1px 4px rgba(15,28,46,0.04)',
              display: 'flex', flexDirection: 'column', gap: '14px',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div style={{
                  width: '38px', height: '38px', borderRadius: '10px', flexShrink: 0,
                  background: `${s.accent}14`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: s.accent,
                }}>
                  {s.icon}
                </div>
                <svg width="14" height="14" fill="none" stroke="#C8D6E0" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                </svg>
              </div>
              <div>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '1.75rem', fontWeight: 800, color: '#0F1C2E', margin: '0 0 2px', letterSpacing: '-0.04em', lineHeight: 1 }}>
                  {s.value}
                </p>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', fontWeight: 600, color: '#3D5A7A', margin: '0 0 2px' }}>{s.label}</p>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.68rem', color: '#96AFCA', margin: 0 }}>{s.sub}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick nav pills */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {[
          { href: '/admin/recruiters', label: 'Manage Recruiters', icon: '👥' },
          { href: '/admin/employers',  label: 'Manage Employers',  icon: '🏢' },
          { href: '/admin/jobs',       label: 'Manage Jobs',       icon: '💼' },
          { href: '/admin/candidates', label: 'View Candidates',   icon: '📋' },
          { href: '/admin/notifications', label: 'Broadcast',      icon: '📣' },
        ].map(q => (
          <Link key={q.href} href={q.href} style={{
            display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '8px 16px',
            borderRadius: '8px', background: '#fff', border: '1px solid #E4EAF1',
            fontFamily: 'var(--font-ui)', fontSize: '0.78rem', fontWeight: 600, color: '#3D5A7A',
            textDecoration: 'none',
          }}>
            <span>{q.icon}</span>{q.label}
          </Link>
        ))}
      </div>

      {/* Activity grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

        {/* Recent submissions */}
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E4EAF1', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #F0F4FA', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#7C3AED' }} />
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', fontWeight: 700, color: '#0F1C2E', margin: 0 }}>Recent Submissions</p>
            </div>
            <Link href="/admin/candidates" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-ui)', fontSize: '0.7rem', fontWeight: 600, color: '#0FB9B1', textDecoration: 'none' }}>
              View all
              <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
            </Link>
          </div>
          <div>
            {(recentSubs ?? []).map((s: any, idx: number) => {
              const st  = STATUS_STYLE[s.status] ?? STATUS_STYLE.in_pipeline
              const col = avatarColor(s.candidate_name)
              return (
                <div key={s.id} style={{
                  padding: '11px 20px',
                  borderBottom: idx < (recentSubs?.length ?? 0) - 1 ? '1px solid #F4F6FB' : 'none',
                  display: 'flex', alignItems: 'center', gap: '11px',
                }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0, background: `${col}18`, border: `1.5px solid ${col}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 800, fontSize: '0.62rem', color: col }}>{initials(s.candidate_name)}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', fontWeight: 700, color: '#0F1C2E', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {s.candidate_name}
                    </p>
                    <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', color: '#96AFCA', margin: '2px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {(s.job_posts as any)?.title} · {(s.recruiters as any)?.full_name}
                    </p>
                  </div>
                  <span style={{
                    flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: '4px',
                    fontFamily: 'var(--font-ui)', fontSize: '0.62rem', fontWeight: 700,
                    padding: '3px 8px', borderRadius: '99px', background: st.bg, color: st.color,
                    whiteSpace: 'nowrap',
                  }}>
                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: st.dot }} />
                    {s.status.replace(/_/g, ' ')}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recent jobs */}
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E4EAF1', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #F0F4FA', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#F5A623' }} />
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', fontWeight: 700, color: '#0F1C2E', margin: 0 }}>Recent Job Posts</p>
            </div>
            <Link href="/admin/jobs" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-ui)', fontSize: '0.7rem', fontWeight: 600, color: '#0FB9B1', textDecoration: 'none' }}>
              View all
              <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
            </Link>
          </div>
          <div>
            {(recentJobs ?? []).map((j: any, idx: number) => {
              const col = avatarColor(j.employers?.company_name ?? '')
              const dot = JOB_STATUS_DOT[j.status] ?? '#96AFCA'
              return (
                <div key={j.id} style={{
                  padding: '13px 20px',
                  borderBottom: idx < (recentJobs?.length ?? 0) - 1 ? '1px solid #F4F6FB' : 'none',
                  display: 'flex', alignItems: 'center', gap: '11px',
                }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0, background: `${col}14`, border: `1.5px solid ${col}25`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 800, fontSize: '0.62rem', color: col }}>{initials(j.employers?.company_name ?? '')}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', fontWeight: 700, color: '#0F1C2E', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{j.title}</p>
                    <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', color: '#96AFCA', margin: '2px 0 0' }}>{j.employers?.company_name}</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', flexShrink: 0 }}>
                    <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.65rem', color: '#B0BEC8', margin: 0 }}>
                      {new Date(j.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: dot }} />
                      <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.62rem', fontWeight: 600, color: dot, textTransform: 'capitalize' }}>{j.status}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}