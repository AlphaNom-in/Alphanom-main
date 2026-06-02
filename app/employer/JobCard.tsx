type Props = {
  title: string
  department: string
  status: string
}

export default function JobCard({
  title,
  department,
  status,
}: Props) {
  return (
    <div
      style={{
        background: '#fff',
        padding: '20px',
        borderRadius: '16px',
      }}
    >
      <h3>{title}</h3>

      <p>{department}</p>

      <p>{status}</p>
    </div>
  )
}