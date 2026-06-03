import Link from 'next/link'
import SaveJobButton from './SaveJobButton'

type Props = {
  id: string
  title: string
  company: string | null
  department: string | null
  location: string | null
  work_model: string | null
  budget_min: number | null
  budget_max: number | null
  notice_period: string | null
}

function companyInitials(name: string | null) {
  if (!name) return 'CO'
  return name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
}

function toLPA(annual: number | null): string | null {
  if (!annual) return null
  const lpa = annual / 100000
  return Number.isInteger(lpa) ? `${lpa}` : lpa.toFixed(1)
}

function earningPotential(budgetMax: number | null): string | null {
  if (!budgetMax) return null
  return budgetMax >= 4000000 ? '3.5%' : '3%'
}

export default function JobListingCard({
  id, title, company, department, location,
  work_model, budget_min, budget_max, notice_period,
}: Props) {
  const minLPA = toLPA(budget_min)
  const maxLPA = toLPA(budget_max)
  const earning = earningPotential(budget_max)
  const isHighPay = budget_max != null && budget_max >= 4000000

  return (
    <div style={{
      background: '#fff', borderRadius: '12px', border: '1px solid #D0DBE8',
      padding: '14px 18px', display: 'flex', gap: '14px', alignItems: 'flex-start',
    }}>
      {/* Company avatar */}
      <div style={{
        width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0,
        background: 'linear-gradient(135deg, #032655, #0FB9B1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontSize: '11px', fontWeight: 800, color: '#fff' }}>
          {companyInitials(company)}
        </span>
      </div>

      {/* Body */}
      <div style={{ flex: 1, minWidth: 0 }}>

        {/* Title + salary */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '2px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#032655', margin: 0, lineHeight: 1.3 }}>
            {title}
          </h3>
          {minLPA && maxLPA && (
            <span style={{ fontSize: '13px', fontWeight: 800, color: '#0FB9B1', whiteSpace: 'nowrap', flexShrink: 0 }}>
              {minLPA} – {maxLPA} LPA
            </span>
          )}
        </div>

        {/* Company */}
        {company && (
          <p style={{ fontSize: '12px', color: '#5A7A9F', fontWeight: 500, marginBottom: '8px' }}>{company}</p>
        )}

        {/* Meta chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '10px' }}>
          {location && (
            <span style={{ fontSize: '11px', color: '#5A7A9F', background: '#F5F8FC', padding: '3px 8px', borderRadius: '5px', border: '1px solid #EEF3F8' }}>
              📍 {location}
            </span>
          )}
          {work_model && (
            <span style={{ fontSize: '11px', color: '#5A7A9F', background: '#F5F8FC', padding: '3px 8px', borderRadius: '5px', border: '1px solid #EEF3F8' }}>
              {work_model}
            </span>
          )}
          {department && (
            <span style={{ fontSize: '11px', color: '#0A9E97', background: '#D8F0EB', padding: '3px 8px', borderRadius: '5px', fontWeight: 500 }}>
              {department}
            </span>
          )}
          {notice_period && (
            <span style={{ fontSize: '11px', color: '#5A7A9F', background: '#F5F8FC', padding: '3px 8px', borderRadius: '5px', border: '1px solid #EEF3F8' }}>
              🕐 {notice_period}
            </span>
          )}
          {/* Earning potential */}
          {earning && (
            <span style={{
              fontSize: '11px', fontWeight: 700,
              color: isHighPay ? '#B7791F' : '#5A7A9F',
              background: isHighPay ? '#FFF8E7' : '#EEF3F8',
              padding: '3px 8px', borderRadius: '5px',
              border: `1px solid ${isHighPay ? '#F6E05E' : '#D0DBE8'}`,
            }}>
              💰 {earning} Earning Potential
            </span>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '7px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Link
            href={`/recruiter/dashboard/all-jobs/${id}`}
            style={{ padding: '6px 14px', borderRadius: '7px', background: '#0FB9B1', color: '#fff', fontWeight: 600, fontSize: '12px', textDecoration: 'none', whiteSpace: 'nowrap' }}
          >
            View Details
          </Link>
          <Link
            href={`/recruiter/dashboard/my-jobs/${id}/submit`}
            style={{ padding: '6px 14px', borderRadius: '7px', background: '#032655', color: '#fff', fontWeight: 600, fontSize: '12px', textDecoration: 'none', whiteSpace: 'nowrap' }}
          >
            Submit Candidate
          </Link>
          <SaveJobButton jobId={id} />
        </div>
      </div>
    </div>
  )
}
