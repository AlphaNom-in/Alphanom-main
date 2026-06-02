'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { loginRecruiter } from '@/lib/auth/recruiter'

export default function RecruiterLoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault()

    try {
      setLoading(true)
      setError('')

      await loginRecruiter(
        email,
        password
      )

      router.push('/recruiter/dashboard')
    } catch (err: any) {
      console.error(err)
      setError(err.message)
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
          boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
        }}
      >
        <h1
          style={{
            marginBottom: '1.5rem',
            fontSize: '2rem',
            fontWeight: 700,
          }}
        >
          Recruiter Login
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
          <label>Email</label>

          <input
            type="email"
            required
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label>Password</label>

          <input
            type="password"
            required
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            style={inputStyle}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={buttonStyle}
        >
          {loading
            ? 'Logging In...'
            : 'Login'}
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
}

const buttonStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px',
  border: 'none',
  borderRadius: '8px',
  background: '#032655',
  color: '#fff',
  fontWeight: 600,
  cursor: 'pointer',
}