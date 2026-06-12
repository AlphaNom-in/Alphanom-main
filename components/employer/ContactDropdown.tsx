'use client'

import { useState, useRef, useEffect } from 'react'

export default function ContactDropdown({
  email,
  phone,
}: {
  email?: string | null
  phone?: string | null
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function onOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onOutside)
    return () => document.removeEventListener('mousedown', onOutside)
  }, [open])

  if (!email && !phone) return null

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '4px',
          fontFamily: 'var(--font-ui)', fontSize: '0.7rem', fontWeight: 600,
          color: open ? '#0A9E97' : '#5A7A9F',
          background: open ? '#F0FBF9' : '#F5F8FC',
          padding: '4px 10px', borderRadius: '7px',
          border: `1.5px solid ${open ? 'rgba(15,185,177,0.4)' : '#D0DBE8'}`,
          cursor: 'pointer', outline: 'none',
          transition: 'all 0.12s',
        }}
      >
        <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
        </svg>
        Contact
        <svg
          width="9" height="9" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 5px)', left: 0,
          zIndex: 50,
          background: '#fff', border: '1px solid #D0DBE8', borderRadius: '11px',
          padding: '10px 12px',
          boxShadow: '0 8px 28px rgba(3,38,85,0.13)',
          minWidth: '220px', display: 'flex', flexDirection: 'column', gap: '8px',
        }}>
          {email && (
            <a
              href={`mailto:${email}`}
              style={{ display: 'flex', alignItems: 'center', gap: '9px', textDecoration: 'none' }}
              onClick={() => setOpen(false)}
            >
              <div style={{ width: '28px', height: '28px', borderRadius: '7px', background: '#EEF3F8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="13" height="13" fill="none" stroke="#5A7A9F" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
              <div>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.55rem', fontWeight: 700, color: '#96AFCA', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 1px' }}>Email</p>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: '#032655', margin: 0, fontWeight: 500 }}>{email}</p>
              </div>
            </a>
          )}
          {phone && (
            <a
              href={`tel:${phone}`}
              style={{ display: 'flex', alignItems: 'center', gap: '9px', textDecoration: 'none' }}
              onClick={() => setOpen(false)}
            >
              <div style={{ width: '28px', height: '28px', borderRadius: '7px', background: '#EEF3F8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="13" height="13" fill="none" stroke="#5A7A9F" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
              </div>
              <div>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.55rem', fontWeight: 700, color: '#96AFCA', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 1px' }}>Phone</p>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: '#032655', margin: 0, fontWeight: 500 }}>{phone}</p>
              </div>
            </a>
          )}
        </div>
      )}
    </div>
  )
}
