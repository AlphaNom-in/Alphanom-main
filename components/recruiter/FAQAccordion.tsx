'use client'

import { useState } from 'react'

const FAQS = [
  {
    q: 'How do I submit a candidate for a job?',
    a: 'Go to All Jobs, find a role you want to pitch for, and click "Submit Candidate". Fill in the candidate\'s details, upload their resume, and add your note explaining why they\'re a good fit. The employer will review the submission.',
  },
  {
    q: 'How many jobs can I save?',
    a: 'You can save up to 10 jobs at a time. Saved jobs appear in your My Jobs tab so you can track and manage them easily. Remove a saved job to free up a slot.',
  },
  {
    q: 'What happens after I submit a candidate?',
    a: 'The employer reviews the submission. The candidate status will move through: In Pipeline → Shortlisted / Saved for Later → or Rejected. You can track status updates in the My Jobs section.',
  },
  {
    q: 'How does the commission/payout work?',
    a: 'When a candidate you submitted gets hired, you earn a commission based on the agreed placement fee. Payouts are processed after the candidate\'s joining date is confirmed by the employer. Contact support for specific commission details on a role.',
  },
  {
    q: 'Can I submit more than one candidate for the same job?',
    a: 'Yes, you can submit multiple candidates for the same job opening as long as each candidate is unique. Quality submissions with strong recruiter notes improve your chances of placement.',
  },
  {
    q: 'Can I edit or withdraw a submission?',
    a: 'Once submitted, you cannot edit a candidate\'s details. If you need to withdraw a submission or report an error, please contact support via WhatsApp or email.',
  },
  {
    q: 'How do I update my recruiter profile?',
    a: 'Go to Profile in the sidebar. You can update your specialisation, experience, contact details, and upload an updated CV at any time.',
  },
  {
    q: 'Why can\'t I see certain jobs?',
    a: 'All Jobs only shows jobs with an "active" status. Jobs that are paused or closed by the employer are hidden automatically. If you believe a job is missing incorrectly, contact support.',
  },
]

export default function FAQAccordion() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {FAQS.map((faq, i) => (
        <div
          key={i}
          style={{
            background: '#fff',
            borderRadius: '14px',
            border: `1.5px solid ${open === i ? '#0FB9B1' : '#D0DBE8'}`,
            overflow: 'hidden',
            transition: 'border-color 0.15s',
          }}
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px 20px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left',
              gap: '12px',
            }}
          >
            <span
              style={{
                color: '#032655',
                fontWeight: 600,
                fontSize: '15px',
                flex: 1,
              }}
            >
              {faq.q}
            </span>
            <span
              style={{
                color: '#0FB9B1',
                fontSize: '20px',
                fontWeight: 300,
                lineHeight: 1,
                flexShrink: 0,
              }}
            >
              {open === i ? '−' : '+'}
            </span>
          </button>

          {open === i && (
            <div
              style={{
                padding: '0 20px 18px',
                color: '#5A7A9F',
                fontSize: '14px',
                lineHeight: 1.7,
                borderTop: '1px solid #EEF3F8',
              }}
            >
              {faq.a}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
