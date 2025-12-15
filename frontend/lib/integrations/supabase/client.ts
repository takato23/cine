import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { getSupabasePublicConfig } from './config'

let client: SupabaseClient | null = null

export function getSupabaseClient(): SupabaseClient | null {
  if (client) return client
  const cfg = getSupabasePublicConfig()
  if (!cfg) return null

  client = createClient(cfg.url, cfg.anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    realtime: {
      logLevel: 'error',
      // Reduce internal logging; we surface UX feedback via Toasts.
      logger: () => {
        /* swallow */
      },
    },
  })

  return client
}

