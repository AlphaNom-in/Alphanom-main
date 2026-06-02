import { z } from 'zod'

export const recruiterSignupSchema = z.object({
  full_name: z.string().min(2),

  email: z.email(),

  password: z.string().min(8),

  contact_primary: z.string().min(10),
})