'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { ToastProvider } from '@/components/ui/Toast'
import { CheckoutSessionProvider } from '@/components/providers/CheckoutSessionProvider'
import { IntegrationsProvider } from '@/components/providers/IntegrationsProvider'

// Nota: en monorepos/workspaces a veces conviven 2 copias de tipos de React y
// `ReactNode` puede no ser asignable entre paquetes. Tipamos children como `any`
// para evitar falsos positivos del compilador.
export function Providers({ children }: { children: any }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <IntegrationsProvider>
          <CheckoutSessionProvider>{children}</CheckoutSessionProvider>
        </IntegrationsProvider>
      </ToastProvider>
    </QueryClientProvider>
  )
}
