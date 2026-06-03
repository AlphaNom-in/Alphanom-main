import FAQAccordion from '@/components/recruiter/FAQAccordion'

export default function Page() {
  return (
    <div className="rdash-page-root" style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '20px', maxWidth: '760px' }}>

      {/* Header — fixed */}
      <div style={{ flexShrink: 0 }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#032655', marginBottom: '4px' }}>Helpdesk</h1>
        <p style={{ color: '#5A7A9F', fontSize: '13px' }}>Find answers or get in touch with our support team.</p>
      </div>

      {/* Support cards — fixed */}
      <div className="rdash-helpdesk-cards" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', flexShrink: 0 }}>
        <a
          href="https://wa.me/919999999999?text=Hi%2C%20I%20need%20help%20with%20my%20AlphaNom%20recruiter%20account."
          target="_blank" rel="noopener noreferrer"
          style={{ display: 'flex', alignItems: 'center', gap: '14px', background: '#fff', border: '1.5px solid #D0DBE8', borderRadius: '14px', padding: '16px 20px', textDecoration: 'none' }}
        >
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#E8F9F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>💬</div>
          <div>
            <p style={{ color: '#032655', fontWeight: 700, fontSize: '14px', marginBottom: '2px' }}>WhatsApp Support</p>
            <p style={{ color: '#5A7A9F', fontSize: '12px' }}>Responds within 1 hour</p>
          </div>
          <span style={{ marginLeft: 'auto', padding: '6px 14px', borderRadius: '8px', background: '#25D366', color: '#fff', fontWeight: 600, fontSize: '12px', whiteSpace: 'nowrap', flexShrink: 0 }}>Open →</span>
        </a>

        <a
          href="mailto:support@alphanom.in?subject=Recruiter%20Support%20Request"
          style={{ display: 'flex', alignItems: 'center', gap: '14px', background: '#fff', border: '1.5px solid #D0DBE8', borderRadius: '14px', padding: '16px 20px', textDecoration: 'none' }}
        >
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#EEF3F8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>✉️</div>
          <div>
            <p style={{ color: '#032655', fontWeight: 700, fontSize: '14px', marginBottom: '2px' }}>Email Support</p>
            <p style={{ color: '#5A7A9F', fontSize: '12px' }}>Within 24 business hours</p>
          </div>
          <span style={{ marginLeft: 'auto', padding: '6px 14px', borderRadius: '8px', background: '#032655', color: '#fff', fontWeight: 600, fontSize: '12px', whiteSpace: 'nowrap', flexShrink: 0 }}>Email →</span>
        </a>
      </div>

      {/* FAQ — takes remaining height, scrolls */}
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#032655', marginBottom: '12px', flexShrink: 0 }}>
          Frequently Asked Questions
        </h2>
        <div className="rdash-scrollable" style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
          <FAQAccordion />
        </div>
      </div>
    </div>
  )
}
