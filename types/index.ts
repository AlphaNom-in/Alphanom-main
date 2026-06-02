export interface Employer {
  id: string
  user_id: string

  company_name: string
  username: string
  email: string

  contact_primary: string
  contact_secondary?: string

  company_address?: string
  industry?: string

  logo_url?: string

  is_verified: boolean

  created_at: string
}

export interface Recruiter {
  id: string
  user_id: string

  full_name: string
  email: string

  contact_primary: string
  contact_secondary?: string

  specialization?: string[]

  years_of_experience?: number

  total_roles_closed: number

  cv_url?: string

  is_verified: boolean

  created_at: string
}