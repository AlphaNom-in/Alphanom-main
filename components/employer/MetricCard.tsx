type Props = {
  title: string
  value: number
  icon: React.ReactNode
  color?: string
}

export default function MetricCard({
  title,
  value,
  icon,
  color = '#0FB9B1',
}: Props) {
  return (
    <div style={{
      background: '#fff',
      borderRadius: '14px',
      border: '1px solid #D0DBE8',
      overflow: 'hidden',
      boxShadow: '0 2px 12px rgba(3,38,85,0.05)',
    }}>
      {/* Top colour accent */}
      <div style={{ height: '3px', background: color }} />

      <div style={{ padding: '18px 18px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
          <p style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '0.68rem',
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: '#5A7A9F',
          }}>
            {title}
          </p>

          <div style={{
            width: '30px', height: '30px', borderRadius: '7px',
            background: `${color}1A`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: color, flexShrink: 0,
          }}>
            {icon}
          </div>
        </div>

        <h2 style={{
          fontFamily: 'var(--font-ui)',
          fontSize: '2rem',
          fontWeight: 800,
          color: '#032655',
          letterSpacing: '-0.04em',
          lineHeight: 1,
          margin: 0,
        }}>
          {value}
        </h2>
      </div>
    </div>
  )
}
