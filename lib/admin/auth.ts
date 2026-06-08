import { createHmac } from 'crypto'

const secret = () => process.env.ADMIN_SECRET ?? 'change-this-in-env'
const TTL = 12 * 60 * 60 * 1000 // 12 hours

export function createAdminToken(): string {
  const exp = Date.now() + TTL
  const sig = createHmac('sha256', secret()).update(String(exp)).digest('hex')
  return `${exp}.${sig}`
}

export function verifyAdminToken(token: string | undefined): boolean {
  if (!token) return false
  const dot = token.lastIndexOf('.')
  if (dot === -1) return false
  const exp = token.slice(0, dot)
  const sig = token.slice(dot + 1)
  if (Date.now() > parseInt(exp, 10)) return false
  const expected = createHmac('sha256', secret()).update(exp).digest('hex')
  return sig === expected
}