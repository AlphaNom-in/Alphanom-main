const pulse: React.CSSProperties = {
  background: 'linear-gradient(90deg, #EEF3F8 25%, #D8E4F0 50%, #EEF3F8 75%)',
  backgroundSize: '200% 100%',
  animation: 'shimmer 1.4s infinite',
  borderRadius: '8px',
}

export default function PageSkeleton() {
  return (
    <>
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Title row */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ ...pulse, height: '28px', width: '180px' }} />
          <div style={{ ...pulse, height: '24px', width: '80px', borderRadius: '20px' }} />
        </div>

        {/* Stat cards row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{ background: '#fff', borderRadius: '14px', border: '1px solid #D0DBE8', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ ...pulse, height: '13px', width: '80px' }} />
              <div style={{ ...pulse, height: '32px', width: '100px' }} />
              <div style={{ ...pulse, height: '11px', width: '120px' }} />
            </div>
          ))}
        </div>

        {/* Main content card */}
        <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #D0DBE8', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ ...pulse, height: '18px', width: '160px' }} />
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'center', paddingBottom: '14px', borderBottom: i < 5 ? '1px solid #EEF3F8' : 'none' }}>
              <div style={{ ...pulse, width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0 }} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ ...pulse, height: '14px', width: `${60 + i * 8}%` }} />
                <div style={{ ...pulse, height: '11px', width: '40%' }} />
              </div>
              <div style={{ ...pulse, height: '24px', width: '70px', borderRadius: '20px' }} />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
