export type BackoffOptions = {
  baseMs?: number
  maxMs?: number
  jitterRatio?: number
}

export function backoffMs(attempt: number, opts?: BackoffOptions) {
  const baseMs = opts?.baseMs ?? 800
  const maxMs = opts?.maxMs ?? 20_000
  const jitterRatio = opts?.jitterRatio ?? 0.25

  const exp = Math.min(maxMs, baseMs * Math.pow(2, Math.max(0, attempt)))
  const jitter = exp * jitterRatio * (Math.random() * 2 - 1)
  return Math.max(0, Math.round(exp + jitter))
}

