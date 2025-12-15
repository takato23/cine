import { envString, ff } from '@/lib/flags'

export type SupabasePublicConfig = {
  url: string
  anonKey: string
}

export function getSupabasePublicConfig(): SupabasePublicConfig | null {
  const url = envString('NEXT_PUBLIC_SUPABASE_URL', '').trim()
  const anonKey = envString('NEXT_PUBLIC_SUPABASE_ANON_KEY', '').trim()

  if (!url || !anonKey) return null

  try {
    const parsed = new URL(url)
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return null
  } catch {
    return null
  }

  return { url, anonKey }
}

export function isSupabaseRealtimeEnabled() {
  return ff('SUPABASE_REALTIME', false)
}

