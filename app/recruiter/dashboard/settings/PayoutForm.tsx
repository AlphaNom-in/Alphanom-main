'use client'

import { useState, useTransition } from 'react'
import { updatePayoutDetails } from '@/lib/recruiter/updatePayoutDetails'

const inp: React.CSSProperties = {
  width: '100%', padding: '10px 13px', borderRadius: '9px',
  border: '1.5px solid #D0DBE8', fontFamily: 'var(--font-ui)',
  fontSize: '0.875rem', color: '#032655', background: '#fff',
  outline: 'none', boxSizing: 'border-box',
}
const lbl: React.CSSProperties = {
  display: 'block', fontFamily: 'var(--font-ui)', fontSize: '0.7rem',
  fontWeight: 700, letterSpacing: '0.04em', color: '#3D5A7A', marginBottom: '6px',
}

type Props = {
  bankAccountName?:   string | null
  bankAccountNumber?: string | null
  bankIfsc?:          string | null
  upiId?:             string | null
  panNumber?:         string | null
  gstNumber?:         string | null
}

export default function PayoutForm({ bankAccountName, bankAccountNumber, bankIfsc, upiId, panNumber, gstNumber }: Props) {
  const [saved,  setSaved]  = useState(false)
  const [errMsg, setErrMsg] = useState('')
  const [pending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaved(false); setErrMsg('')
    const fd = new FormData(e.currentTarget)
    startTransition(async () => {
      try {
        await updatePayoutDetails(fd)
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      } catch (err: any) {
        setErrMsg(err.message ?? 'Failed to save')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* Bank Account */}
        <div>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', fontWeight: 700, color: '#5A7A9F', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: '7px' }}>
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" /></svg>
            Bank Account
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={lbl}>Account Holder Name</label>
              <input style={inp} name="bank_account_name" defaultValue={bankAccountName ?? ''} placeholder="As per bank records" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={lbl}>Account Number</label>
                <input style={inp} name="bank_account_number" defaultValue={bankAccountNumber ?? ''} placeholder="e.g. 1234567890" />
              </div>
              <div>
                <label style={lbl}>IFSC Code</label>
                <input name="bank_ifsc" defaultValue={bankIfsc ?? ''} placeholder="e.g. HDFC0001234" style={{ ...inp, textTransform: 'uppercase' }} />
              </div>
            </div>
          </div>
        </div>

        <div style={{ height: '1px', background: '#EEF3F8' }} />

        {/* UPI */}
        <div>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', fontWeight: 700, color: '#5A7A9F', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: '7px' }}>
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18h3" /></svg>
            UPI
          </p>
          <label style={lbl}>UPI ID</label>
          <input style={inp} name="upi_id" defaultValue={upiId ?? ''} placeholder="e.g. yourname@upi" />
        </div>

        <div style={{ height: '1px', background: '#EEF3F8' }} />

        {/* Tax / GST */}
        <div>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.75rem', fontWeight: 700, color: '#5A7A9F', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: '7px' }}>
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
            Invoicing Details
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={lbl}>PAN Number</label>
              <input style={{ ...inp, textTransform: 'uppercase' }} name="pan_number" defaultValue={panNumber ?? ''} placeholder="e.g. ABCDE1234F" maxLength={10} />
            </div>
            <div>
              <label style={lbl}>GST Number <span style={{ fontWeight: 400, color: '#96AFCA', fontSize: '0.65rem' }}>(optional)</span></label>
              <input style={{ ...inp, textTransform: 'uppercase' }} name="gst_number" defaultValue={gstNumber ?? ''} placeholder="15-digit GSTIN" maxLength={15} />
            </div>
          </div>
        </div>

        {/* Feedback */}
        {errMsg && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '8px 12px' }}>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: '#DC2626', margin: 0 }}>{errMsg}</p>
          </div>
        )}
        {saved && (
          <div style={{ background: '#F0FBF9', border: '1px solid rgba(15,185,177,0.3)', borderRadius: '8px', padding: '8px 12px', display: 'flex', gap: '6px', alignItems: 'center' }}>
            <svg width="13" height="13" fill="none" stroke="#0A9E97" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: '#0A9E97', margin: 0 }}>Payout details saved successfully.</p>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="submit" disabled={pending}
            style={{ padding: '10px 28px', borderRadius: '9px', border: 'none', background: pending ? '#96AFCA' : '#032655', color: '#fff', fontFamily: 'var(--font-ui)', fontSize: '0.82rem', fontWeight: 700, cursor: pending ? 'not-allowed' : 'pointer' }}
          >
            {pending ? 'Saving…' : 'Save Details'}
          </button>
        </div>
      </div>
    </form>
  )
}