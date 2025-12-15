'use client'

import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/lib/store'
import { ErrorState, LoadingState } from '@/components/ui/states'

type Role = 'ADMIN' | 'STAFF' | 'CLIENT'

export function RoleGuard({
  allow,
  children,
}: {
  allow: Role[]
  children: ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const user = useAuthStore((s) => s.user)
  const [mounted, setMounted] = useState(false)

  const nextUrl = useMemo(() => {
    const next = pathname || '/'
    return `/login?next=${encodeURIComponent(next)}`
  }, [pathname])

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!mounted) return
    if (!user) router.replace(nextUrl)
  }, [mounted, nextUrl, router, user])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-bg-primary">
        <main className="container mx-auto px-4 py-10 max-w-3xl">
          <LoadingState title="Cargando…" subtitle="Validando acceso." />
        </main>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-bg-primary">
        <main className="container mx-auto px-4 py-10 max-w-3xl">
          <LoadingState title="Redirigiendo…" subtitle="Necesitás iniciar sesión para continuar." />
        </main>
      </div>
    )
  }

  if (!allow.includes(user.role as Role)) {
    return (
      <div className="min-h-screen bg-bg-primary">
        <main className="container mx-auto px-4 py-10 max-w-3xl">
          <ErrorState
            title="Acceso denegado"
            subtitle="No tenés permisos para ver esta sección."
            onRetry={() => router.push('/')}
            retryLabel="Volver al sitio"
          />
          <div className="mt-4 flex justify-center">
            <Link href="/login">
              <span className="text-sm font-semibold text-white/60 hover:text-white transition-colors">
                Cambiar de cuenta
              </span>
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return children
}

