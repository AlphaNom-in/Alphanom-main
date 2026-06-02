import { z } from 'zod'

export const employerSignupSchema = z.object({
  company_name: z.string().min(2),

  username: z.string().min(3),

  email: z.email(),

  password: z.string().min(8),

  contact_primary: z.string().min(10),
})