// Printable ASCII 0x21–0x7E: all letters, digits, and standard keyboard symbols.
// Excludes space (0x20) and any non-ASCII / Unicode characters.
export const PASSWORD_REGEX = /^[\x21-\x7E]+$/

export function validatePassword(password: string): string | null {
  if (password.length < 8) return 'Password must be at least 8 characters.'
  if (!PASSWORD_REGEX.test(password)) return 'Password may only contain letters, numbers, and standard symbols (!@#$%^&* etc). Spaces are not allowed.'
  return null
}
