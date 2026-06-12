import { z } from 'zod'
import { PASSWORD_REGEX } from './password'

export const recruiterSignupSchema = z.object({
  full_name: z.string().min(2),

  email: z.email(),

  password: z.string().min(8).regex(PASSWORD_REGEX, 'Password may only contain letters, numbers, and standard symbols. Spaces are not allowed.'),

  contact_primary: z.string().min(10),
})