export default function Page() {
  return (
    <div style={{ height: '100%', overflowY: 'auto', minHeight: 0 }}>
    <div style={{ maxWidth: '680px' }}>
      <div style={{
        background: '#fff',
        borderRadius: '16px',
        border: '1px solid #D0DBE8',
        overflow: 'hidden',
        boxShadow: '0 2px 12px rgba(3,38,85,0.05)',
      }}>
        {/* Card header */}
        <div style={{
          padding: '13px 18px',
          borderBottom: '1px solid #EEF3F8',
          display: 'flex',
          alignItems: 'center',
          gap: '9px',
        }}>
          <div style={{
            width: '26px', height: '26px', borderRadius: '6px',
            background: '#EEF3F8',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg fill="none" stroke="#5A7A9F" strokeWidth={1.8} viewBox="0 0 24 24" style={{ width: '14px', height: '14px' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.82rem', fontWeight: 700, color: '#032655' }}>
            Account Settings
          </p>
        </div>

        {/* Placeholder body */}
        <div style={{ padding: '2.5rem', textAlign: 'center' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '10px',
            background: '#EEF3F8',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 12px',
          }}>
            <svg fill="none" stroke="#96AFCA" strokeWidth={1.5} viewBox="0 0 24 24" style={{ width: '20px', height: '20px' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
            </svg>
          </div>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.875rem', fontWeight: 600, color: '#032655', marginBottom: '5px' }}>
            Coming soon
          </p>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: '#96AFCA' }}>
            Account settings will be available here shortly.
          </p>
        </div>
      </div>
    </div>
    </div>
  )
}
