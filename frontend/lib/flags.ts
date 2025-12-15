function readEnv(name: string) {
  return typeof process !== 'undefined' ? (process.env as any)?.[name] : undefined
}

export function envString(name: string, defaultValue = '') {
  const v = readEnv(name)
  if (v === undefined || v === null || v === '') return defaultValue
  return String(v)
}

export function envBool(name: string, defaultValue = false) {
  const v = readEnv(name)
  if (v === undefined || v === null || v === '') return defaultValue
  const s = String(v).trim().toLowerCase()
  if (['1', 'true', 'yes', 'y', 'on'].includes(s)) return true
  if (['0', 'false', 'no', 'n', 'off'].includes(s)) return false
  return defaultValue
}

export function envNumber(name: string, defaultValue: number) {
  const v = readEnv(name)
  if (v === undefined || v === null || v === '') return defaultValue
  const n = Number(v)
  return Number.isFinite(n) ? n : defaultValue
}

// Explicit access for Next.js to inline the value
export const isMockMode = process.env.NEXT_PUBLIC_MOCK_MODE === 'true'

export function ff(name: string, defaultValue = false) {
  const key = name.startsWith('NEXT_PUBLIC_FF_') ? name : `NEXT_PUBLIC_FF_${name}`
  return envBool(key, defaultValue)
}

export function ffNumber(name: string, defaultValue: number) {
  const key = name.startsWith('NEXT_PUBLIC_FF_') ? name : `NEXT_PUBLIC_FF_${name}`
  return envNumber(key, defaultValue)
}

