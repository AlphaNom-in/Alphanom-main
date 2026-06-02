'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signUpEmployer } from '@/lib/auth/employer'

export default function EmployerSignupPage() {
  const router = useRouter()

  const [companyName, setCompanyName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [contactPrimary, setContactPrimary] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault()

    setError('')

    try {
      setLoading(true)

      await signUpEmployer({
        company_name: companyName,
        username,
        email,
        password,
        contact_primary: contactPrimary,
      })

      router.push('/employer/dashboard')
    } catch (err: any) {
      setError(err.message)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#F8FAFC',
        padding: '2rem',
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: '100%',
          maxWidth: '500px',
          background: '#fff',
          padding: '2rem',
          borderRadius: '16px',
          boxShadow:
            '0 10px 30px rgba(0,0,0,0.08)',
        }}
      >
        <h1
          style={{
            marginBottom: '1.5rem',
            fontSize: '2rem',
            fontWeight: 700,
          }}
        >
          Employer Signup
        </h1>

        {error && (
          <div
            style={{
              color: 'red',
              marginBottom: '1rem',
            }}
          >
            {error}
          </div>
        )}

        <div style={{ marginBottom: '1rem' }}>
          <label>Company Name</label>

          <input
            type="text"
            value={companyName}
            onChange={(e) =>
              setCompanyName(e.target.value)
            }
            required
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Username</label>

          <input
            type="text"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
            required
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Email</label>

          <input
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Password</label>

          <input
            type="password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label>Primary Contact Number</label>

          <input
            type="text"
            value={contactPrimary}
            onChange={(e) =>
              setContactPrimary(e.target.value)
            }
            required
            style={inputStyle}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            background: '#032655',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          {loading
            ? 'Creating Account...'
            : 'Create Employer Account'}
        </button>
      </form>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px',
  marginTop: '6px',
  border: '1px solid #D1D5DB',
  borderRadius: '8px',
  outline: 'none',
}