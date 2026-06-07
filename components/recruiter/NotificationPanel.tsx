'use client'

import { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  getNotifications,
  markNotificationRead,
  markAllRead,
  type NotifRow,
} from '@/lib/notifications/actions'

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const secs = Math.floor(diff / 1000)
  if (secs < 60) return 'just now'
  const mins = Math.floor(secs / 60)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days === 1) return 'yesterday'
  if (days < 7) return `${days}d ago`
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

function groupNotifs(items: NotifRow[]): { label: string; items: NotifRow[] }[] {
  const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0)
  const ystStart = new Date(todayStart); ystStart.setDate(ystStart.getDate() - 1)
  const groups = [
    { label: 'Today',     items: items.filter(n => new Date(n.created_at) >= todayStart) },
    { label: 'Yesterday', items: items.filter(n => { const d = new Date(n.created_at); return d >= ystStart && d < todayStart }) },
    { label: 'Earlier',   items: items.filter(n => new Date(n.created_at) < ystStart) },
  ]
  return groups.filter(g => g.items.length > 0)
}

const JOB_ICON = (
  <svg width="16" height="16" fill="none" stroke="#0A9E97" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
  </svg>
)

const STATUS_ICON = (
  <svg width="16" height="16" fill="none" stroke="#5A7A9F" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
  </svg>
)

const CANDIDATE_ICON = (
  <svg width="16" height="16" fill="none" stroke="#032655" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
  </svg>
)

export default function NotificationPanel({
  onClose,
  onAllRead,
}: {
  onClose: () => void
  onAllRead: () => void
}) {
  const router = useRouter()
  const [notifs, setNotifs]   = useState<NotifRow[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter]   = useState<'all' | 'unread'>('all')
  const [pending, start]      = useTransition()

  useEffect(() => {
    getNotifications().then(data => {
      setNotifs(data)
      setLoading(false)
    })
  }, [])

  const unreadCount = notifs.filter(n => !n.is_read).length
  const displayed   = filter === 'unread' ? notifs.filter(n => !n.is_read) : notifs
  const groups      = groupNotifs(displayed)

  function handleMarkAll() {
    start(async () => {
      await markAllRead()
      setNotifs(prev => prev.map(n => ({ ...n, is_read: true })))
      onAllRead()
    })
  }

  function handleClick(n: NotifRow) {
    start(async () => {
      if (!n.is_read) {
        await markNotificationRead(n.id)
        setNotifs(prev => prev.map(x => x.id === n.id ? { ...x, is_read: true } : x))
      }
      onClose()
      if (n.link) router.push(n.link)
    })
  }

  return (
    <div
      className="notif-panel"
      style={{
        position: 'fixed',
        top: '60px',
        right: 0,
        height: 'calc(100vh - 60px)',
        background: '#F5F8FC',
        borderLeft: '1px solid #D0DBE8',
        boxShadow: '-8px 0 40px rgba(3,38,85,0.1)',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* ── Header ─────────────────────────────────────────────── */}
      <div style={{
        padding: '0 20px',
        height: '56px',
        background: '#fff',
        borderBottom: '1px solid #D0DBE8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
          <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.95rem', fontWeight: 800, color: '#032655' }}>
            Notifications
          </span>
          {unreadCount > 0 && (
            <span style={{
              background: '#0FB9B1', color: '#fff',
              fontFamily: 'var(--font-ui)', fontSize: '0.58rem', fontWeight: 800,
              padding: '2px 7px', borderRadius: '99px',
            }}>
              {unreadCount}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAll}
              disabled={pending}
              style={{
                fontFamily: 'var(--font-ui)', fontSize: '0.68rem', fontWeight: 600,
                color: '#0FB9B1', background: 'none', border: 'none',
                cursor: pending ? 'not-allowed' : 'pointer',
                opacity: pending ? 0.5 : 1, padding: 0,
              }}
            >
              Mark all read
            </button>
          )}
          <button
            onClick={onClose}
            style={{
              width: '28px', height: '28px', borderRadius: '7px',
              background: '#EEF3F8', border: '1px solid #D0DBE8',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <svg width="13" height="13" fill="none" stroke="#5A7A9F" strokeWidth={2.2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Filter tabs ─────────────────────────────────────────── */}
      <div style={{
        display: 'flex', gap: '6px', padding: '10px 16px',
        background: '#fff', borderBottom: '1px solid #EEF3F8', flexShrink: 0,
      }}>
        {(['all', 'unread'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '5px 14px', borderRadius: '20px', border: 'none',
              fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 700,
              cursor: 'pointer',
              background: filter === f ? '#032655' : '#EEF3F8',
              color: filter === f ? '#fff' : '#5A7A9F',
            }}
          >
            {f === 'all' ? 'All' : `Unread${unreadCount > 0 ? ` (${unreadCount})` : ''}`}
          </button>
        ))}
      </div>

      {/* ── List ────────────────────────────────────────────────── */}
      <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '120px', gap: '10px' }}>
            <div style={{ width: '22px', height: '22px', border: '2.5px solid #D0DBE8', borderTop: '2.5px solid #0FB9B1', borderRadius: '50%', animation: 'nbell-spin 0.8s linear infinite' }} />
            <style>{`@keyframes nbell-spin { to { transform: rotate(360deg) } }`}</style>
          </div>
        ) : groups.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '260px', gap: '14px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: '#EEF3F8', border: '1px solid #D0DBE8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="24" height="24" fill="none" stroke="#96AFCA" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.88rem', fontWeight: 700, color: '#032655', margin: '0 0 4px' }}>
                {filter === 'unread' ? 'All caught up!' : 'No notifications yet'}
              </p>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', color: '#96AFCA', margin: 0 }}>
                {filter === 'unread' ? 'No unread notifications' : 'New jobs and status updates will appear here'}
              </p>
            </div>
          </div>
        ) : (
          groups.map(group => (
            <div key={group.label}>
              {/* Group label */}
              <div style={{
                padding: '10px 20px 6px',
                fontFamily: 'var(--font-ui)', fontSize: '0.58rem', fontWeight: 700,
                letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#96AFCA',
              }}>
                {group.label}
              </div>

              {group.items.map((n, i) => (
                <button
                  key={n.id}
                  onClick={() => handleClick(n)}
                  style={{
                    width: '100%', textAlign: 'left', display: 'block',
                    padding: '16px 20px 16px 17px',
                    background: n.is_read ? '#fff' : 'rgba(15,185,177,0.04)',
                    border: 'none',
                    borderTop: i === 0 ? '1px solid #EEF3F8' : '1px solid #EEF3F8',
                    borderLeft: `3px solid ${n.is_read ? 'transparent' : '#0FB9B1'}`,
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    {/* Icon */}
                    <div style={{
                      width: '38px', height: '38px', borderRadius: '10px', flexShrink: 0,
                      background: n.type === 'new_job' ? '#D8F0EB' : n.type === 'new_candidate' ? '#E8EDF5' : '#EEF3F8',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {n.type === 'new_job' ? JOB_ICON : n.type === 'new_candidate' ? CANDIDATE_ICON : STATUS_ICON}
                    </div>

                    {/* Text */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{
                        fontFamily: 'var(--font-ui)', fontSize: '0.82rem',
                        fontWeight: n.is_read ? 600 : 800,
                        color: '#032655', margin: '0 0 4px', lineHeight: 1.35,
                      }}>
                        {n.title}
                      </p>
                      {n.body && (
                        <p style={{
                          fontFamily: 'var(--font-ui)', fontSize: '0.73rem',
                          color: n.is_read ? '#5A7A9F' : '#032655',
                          margin: '0 0 6px',
                          lineHeight: 1.5,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical' as const,
                          overflow: 'hidden',
                        }}>
                          {n.body}
                        </p>
                      )}
                      <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.62rem', color: '#96AFCA', fontWeight: 500 }}>
                        {timeAgo(n.created_at)}
                      </span>
                    </div>

                    {/* Unread dot */}
                    {!n.is_read && (
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0FB9B1', flexShrink: 0, marginTop: '6px' }} />
                    )}
                  </div>
                </button>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
