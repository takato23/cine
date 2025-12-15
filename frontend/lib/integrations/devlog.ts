type LogLevel = 'log' | 'warn' | 'error'

const isDev = process.env.NODE_ENV !== 'production'

type OnceOptions = {
  /** Default: 30s */
  ttlMs?: number
}

const lastSeenAt = new Map<string, number>()

function shouldLogOnce(key: string, ttlMs: number) {
  const now = Date.now()
  const last = lastSeenAt.get(key)
  if (last && now - last < ttlMs) return false
  lastSeenAt.set(key, now)
  return true
}

function devConsole(level: LogLevel, args: any[]) {
  if (!isDev) return
  // eslint-disable-next-line no-console
  console[level](...args)
}

export function devLog(...args: any[]) {
  devConsole('log', args)
}

export function devWarn(...args: any[]) {
  devConsole('warn', args)
}

export function devError(...args: any[]) {
  devConsole('error', args)
}

export function devLogOnce(key: string, ...args: any[]) {
  if (!shouldLogOnce(`log:${key}`, 30_000)) return
  devLog(...args)
}

export function devWarnOnce(key: string, ...args: any[]) {
  if (!shouldLogOnce(`warn:${key}`, 30_000)) return
  devWarn(...args)
}

export function devErrorOnce(key: string, ...args: any[]) {
  if (!shouldLogOnce(`error:${key}`, 30_000)) return
  devError(...args)
}

export function logOnce(level: LogLevel, key: string, args: any[], options?: OnceOptions) {
  const ttlMs = options?.ttlMs ?? 30_000
  if (!shouldLogOnce(`${level}:${key}`, ttlMs)) return
  devConsole(level, args)
}

