'use client'

import { useEffect, useMemo, type ReactNode } from 'react'
import { useToast } from '@/components/ui/Toast'
import { SupabaseRealtimeManager } from '@/lib/integrations/supabase'
import { ff } from '@/lib/flags'

export function IntegrationsProvider({ children }: { children: ReactNode }) {
  const { addToast } = useToast()

  const supabaseRealtime = useMemo(() => {
    return new SupabaseRealtimeManager({
      onToast: (t) =>
        addToast({
          id: t.id,
          title: t.title,
          message: t.message,
          variant: t.variant,
          duration: t.duration,
        }),
    })
    // `addToast` is stable enough for memo purposes in this app.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!ff('SUPABASE_REALTIME', false)) return
    supabaseRealtime.start()
    return () => supabaseRealtime.stop()
  }, [supabaseRealtime])

  return <>{children}</>
}
