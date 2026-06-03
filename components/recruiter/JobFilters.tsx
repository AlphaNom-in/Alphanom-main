'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useTransition, useState, useEffect } from 'react'
import { DEPARTMENTS } from '@/lib/constants/departments'
import { INDIA_CITIES } from '@/lib/constants/cities'

const WORK_MODELS = ['On-site', 'Hybrid', 'WFH', 'Flexible']

const SALARY_OPTIONS = [
  { label: 'Any',           value: '' },
  { label: 'Less than 20 LPA', value: 'lt20' },
  { label: '20 – 30 LPA',   value: '20_30' },
  { label: '30 – 40 LPA',   value: '30_40' },
  { label: 'More than 40 LPA', value: 'gt40' },
]

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ paddingBottom: '18px', marginBottom: '18px', borderBottom: '1px solid #EEF3F8' }}>
      <p style={{
        fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em',
        textTransform: 'uppercase', color: '#96AFCA', marginBottom: '10px',
      }}>
        {title}
      </p>
      {children}
    </div>
  )
}

export default function JobFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()
  const [search, setSearch] = useState(searchParams.get('search') ?? '')

  useEffect(() => {
    const t = setTimeout(() => updateParam('search', search), 400)
    return () => clearTimeout(t)
  }, [search])

  function updateParam(key: string, value: string) {
    const p = new URLSearchParams(searchParams.toString())
    value ? p.set(key, value) : p.delete(key)
    startTransition(() => router.replace(`${pathname}?${p.toString()}`))
  }

  function clearAll() {
    setSearch('')
    startTransition(() => router.replace(pathname))
  }

  const hasFilters = ['search', 'location', 'work_model', 'department', 'salary_range'].some(
    (k) => searchParams.get(k)
  )

  return (
    <div style={{
      background: '#fff', border: '1px solid #D0DBE8',
      borderRadius: '16px', padding: '20px',
    }}>
      <p style={{ fontSize: '15px', fontWeight: 800, color: '#032655', marginBottom: '16px' }}>
        Filters
      </p>

      {/* Search */}
      <div style={{ marginBottom: '18px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          border: '1.5px solid #D0DBE8', borderRadius: '10px',
          padding: '0 12px', background: '#F5F8FC',
        }}>
          <svg width="14" height="14" fill="none" stroke="#96AFCA" strokeWidth={2} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search jobs..."
            style={{
              border: 'none', outline: 'none', background: 'transparent',
              fontSize: '13px', color: '#032655', padding: '9px 0', width: '100%',
            }}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#96AFCA', fontSize: '16px', padding: 0, lineHeight: 1 }}>×</button>
          )}
        </div>
      </div>

      {/* Work Mode */}
      <FilterSection title="Work Mode">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {['', ...WORK_MODELS].map((m) => {
            const active = (searchParams.get('work_model') ?? '') === m
            return (
              <label
                key={m}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
              >
                <div
                  onClick={() => updateParam('work_model', m)}
                  style={{
                    width: '16px', height: '16px', borderRadius: '50%', flexShrink: 0,
                    border: active ? '5px solid #0FB9B1' : '1.5px solid #D0DBE8',
                    background: '#fff', cursor: 'pointer', transition: 'border 0.15s',
                  }}
                />
                <span
                  onClick={() => updateParam('work_model', m)}
                  style={{ fontSize: '13px', color: active ? '#032655' : '#5A7A9F', fontWeight: active ? 600 : 400 }}
                >
                  {m || 'All'}
                </span>
              </label>
            )
          })}
        </div>
      </FilterSection>

      {/* Location */}
      <FilterSection title="Location">
        <select
          value={searchParams.get('location') ?? ''}
          onChange={(e) => updateParam('location', e.target.value)}
          style={{
            width: '100%', padding: '8px 10px', borderRadius: '8px',
            border: '1.5px solid #D0DBE8', fontSize: '13px',
            color: '#032655', background: '#fff', cursor: 'pointer',
          }}
        >
          <option value="">All Locations</option>
          {INDIA_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </FilterSection>

      {/* Department */}
      <FilterSection title="Department">
        <select
          value={searchParams.get('department') ?? ''}
          onChange={(e) => updateParam('department', e.target.value)}
          style={{
            width: '100%', padding: '8px 10px', borderRadius: '8px',
            border: '1.5px solid #D0DBE8', fontSize: '13px',
            color: '#032655', background: '#fff', cursor: 'pointer',
          }}
        >
          <option value="">All Departments</option>
          {DEPARTMENTS.map((group) => (
            <optgroup key={group.group} label={group.group}>
              {group.items.map((d) => <option key={d} value={d}>{d}</option>)}
            </optgroup>
          ))}
        </select>
      </FilterSection>

      {/* Salary Range (LPA) */}
      <FilterSection title="Salary Range">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {SALARY_OPTIONS.map((o) => {
            const active = (searchParams.get('salary_range') ?? '') === o.value
            return (
              <label key={o.value} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <div
                  onClick={() => updateParam('salary_range', o.value)}
                  style={{
                    width: '16px', height: '16px', borderRadius: '50%', flexShrink: 0,
                    border: active ? '5px solid #0FB9B1' : '1.5px solid #D0DBE8',
                    background: '#fff', cursor: 'pointer', transition: 'border 0.15s',
                  }}
                />
                <span
                  onClick={() => updateParam('salary_range', o.value)}
                  style={{ fontSize: '13px', color: active ? '#032655' : '#5A7A9F', fontWeight: active ? 600 : 400 }}
                >
                  {o.label}
                </span>
              </label>
            )
          })}
        </div>
      </FilterSection>

      {/* Clear */}
      {hasFilters && (
        <button
          onClick={clearAll}
          style={{
            width: '100%', padding: '9px', borderRadius: '8px',
            border: '1.5px solid #E53E3E', background: '#FFF5F5',
            color: '#E53E3E', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
          }}
        >
          Clear All Filters
        </button>
      )}
    </div>
  )
}
