'use client'

import { useTransition } from 'react'
import { updateRecruiter, setRecruiterVerified, deleteRecruiter } from '@/lib/admin/actions'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const inp: React.CSSProperties = {
  width: '100%', padding: '9px 13px', borderRadius: '8px',
  border: '1.5px solid #D8E4F0', fontFamily: 'var(--font-ui)',
  fontSize: '0.82rem', color: '#0F1C2E', background: '#fff',
  outline: 'none', boxSizing: 'border-box',
}
const lbl: React.CSSProperties = {
  display: 'block', fontFamily: 'var(--font-ui)',
  fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.08em',
  textTransform: 'uppercase', color: '#7A94AB', marginBottom: '6px',
}

type Recruiter = {
  id: string
  full_name: string | null
  email: string | null
  contact_primary: string | null
  specialization: string[] | null
  years_of_experience: number | null
  total_roles_closed: number | null
  is_verified: boolean
}

export default function UpdateRecruiterForm({ recruiter }: { recruiter: Recruiter }) {
  const router  = useRouter()
  const [saved, setSaved] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [delPending, startDel] = useTransition()
  const [verPending, startVer] = useTransition()
  const [pending,    startSave] = useTransition()

  const specStr = (recruiter.specialization ?? []).join(', ')

  function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaved(false)
    const fd = new FormData(e.currentTarget)
    startSave(async () => {
      await updateRecruiter(recruiter.id, fd)
      setSaved(true)
    })
  }

  function handleVerify() {
    startVer(async () => {
      await setRecruiterVerified(recruiter.id, !recruiter.is_verified)
    })
  }

  function handleDelete() {
    startDel(async () => {
      await deleteRecruiter(recruiter.id)
      router.push('/admin/recruiters')
    })
  }

  const anyPending = pending || verPending || delPending

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Action bar */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
        <button
          type="button"
          disabled={anyPending}
          onClick={handleVerify}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '8px 18px', borderRadius: '8px', border: 'none',
            cursor: anyPending ? 'not-allowed' : 'pointer',
            fontFamily: 'var(--font-ui)', fontSize: '0.78rem', fontWeight: 700,
            opacity: anyPending ? 0.6 : 1,
            background: recruiter.is_verified ? '#FFF1F2' : '#F0FBF9',
            color:      recruiter.is_verified ? '#BE123C' : '#0A9E97',
          }}
        >
          {recruiter.is_verified
            ? <><svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>Revoke Verification</>
            : <><svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>Verify Recruiter</>}
        </button>

        {!confirmDelete ? (
          <button
            type="button"
            disabled={anyPending}
            onClick={() => setConfirmDelete(true)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '8px 18px', borderRadius: '8px', border: '1.5px solid #FECDD3',
              cursor: anyPending ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--font-ui)', fontSize: '0.78rem', fontWeight: 700,
              background: '#FFF1F2', color: '#BE123C',
              opacity: anyPending ? 0.6 : 1,
            }}
          >
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/></svg>
            Delete Recruiter
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', padding: '6px 14px', borderRadius: '8px', background: '#FFF1F2', border: '1.5px solid #FECDD3' }}>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', color: '#BE123C', fontWeight: 600 }}>
              Delete recruiter + all their submissions?
            </span>
            <button
              type="button" onClick={handleDelete} disabled={delPending}
              style={{ padding: '4px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 700, background: '#BE123C', color: '#fff' }}
            >
              {delPending ? 'Deleting…' : 'Yes, delete'}
            </button>
            <button
              type="button" onClick={() => setConfirmDelete(false)}
              style={{ padding: '4px 10px', borderRadius: '6px', border: '1px solid #E4EAF1', cursor: 'pointer', fontFamily: 'var(--font-ui)', fontSize: '0.72rem', fontWeight: 600, background: '#fff', color: '#6B7E93' }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Edit form */}
      <form onSubmit={handleSave}>
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E4EAF1', overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #F0F4FA', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="14" height="14" fill="none" stroke="#7A94AB" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125"/></svg>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', fontWeight: 700, color: '#0F1C2E', margin: 0 }}>Edit Recruiter Details</p>
          </div>
          <div style={{ padding: '22px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={lbl}>Full Name</label>
              <input style={inp} name="full_name" defaultValue={recruiter.full_name ?? ''} required />
            </div>
            <div>
              <label style={lbl}>Email</label>
              <input style={inp} name="email" type="email" defaultValue={recruiter.email ?? ''} required />
            </div>
            <div>
              <label style={lbl}>Contact (Phone)</label>
              <input style={inp} name="contact_primary" defaultValue={recruiter.contact_primary ?? ''} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={lbl}>Specializations <span style={{ fontWeight: 400, color: '#96AFCA', fontSize: '0.6rem' }}>(comma-separated)</span></label>
              <input style={inp} name="specialization" defaultValue={specStr} placeholder="e.g. Software Engineering, Product Management" />
            </div>
            <div>
              <label style={lbl}>Years of Experience</label>
              <input style={inp} name="years_of_experience" type="number" min="0" defaultValue={recruiter.years_of_experience ?? ''} />
            </div>
            <div>
              <label style={lbl}>Total Roles Closed</label>
              <input style={inp} name="total_roles_closed" type="number" min="0" defaultValue={recruiter.total_roles_closed ?? ''} />
            </div>
          </div>
          <div style={{ padding: '14px 22px', borderTop: '1px solid #F0F4FA', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {saved && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-ui)', fontSize: '0.75rem', color: '#0A9E97', fontWeight: 600 }}>
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>
                Changes saved
              </span>
            )}
            {!saved && <span />}
            <button
              type="submit" disabled={anyPending}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '7px',
                padding: '9px 24px', borderRadius: '8px', border: 'none',
                cursor: anyPending ? 'not-allowed' : 'pointer',
                fontFamily: 'var(--font-ui)', fontSize: '0.8rem', fontWeight: 700,
                background: anyPending ? '#96AFCA' : '#032655', color: '#fff',
              }}
            >
              {pending
                ? <><svg width="12" height="12" viewBox="0 0 24 24" fill="#fff"><path d="M12 2a10 10 0 110 20A10 10 0 0112 2zm0 2a8 8 0 100 16A8 8 0 0012 4z" opacity=".3"/><path d="M12 2a10 10 0 0110 10h-2A8 8 0 0012 4V2z"/></svg>Saving…</>
                : <><svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>Save Changes</>}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}