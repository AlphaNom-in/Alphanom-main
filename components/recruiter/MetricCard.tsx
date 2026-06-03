type Props = {
  title: string
  value: string | number
}

export default function MetricCard({
  title,
  value,
}: Props) {
  return (
    <div
      style={{
        background: '#fff',
        padding: '24px',
        borderRadius: '20px',
        boxShadow:
          '0 4px 20px rgba(3,38,85,0.05)',
      }}
    >
      <p
        style={{
          fontSize: '14px',
          color: '#64748B',
          marginBottom: '8px',
        }}
      >
        {title}
      </p>

      <h2
        style={{
          fontSize: '32px',
          color: '#032655',
          margin: 0,
        }}
      >
        {value}
      </h2>
    </div>
  )
}