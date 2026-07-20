// Masks sensitive government ID numbers for display — only the last
// few characters are shown, e.g. "XXXX XXXX 2345" for Aadhaar or
// "XXXXX1234X" for PAN. Full values are still sent to/from Supabase;
// this only affects what's rendered in the UI.

export function maskAadhaar(value) {
  if (!value) return ''
  const digits = value.replace(/\s/g, '')
  if (digits.length < 4) return 'XXXX XXXX XXXX'
  const last4 = digits.slice(-4)
  return `XXXX XXXX ${last4}`
}

export function maskPan(value) {
  if (!value) return ''
  if (value.length < 4) return 'XXXXXXXXXX'
  const last4 = value.slice(-4)
  return `${'X'.repeat(value.length - 4)}${last4}`
}
