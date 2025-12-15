'use client'

import { useEffect, type ReactNode } from 'react'
import { migrateLegacyCheckoutSession } from '@/lib/store/checkout'

export function CheckoutSessionProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    migrateLegacyCheckoutSession()
  }, [])

  return children
}

