'use client'

import { ReactNode } from 'react'
import { AlertTriangle, RefreshCcw, SearchX } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Button } from '@/components/ui/Button'

export function LoadingState({
  title = 'Cargando…',
  subtitle,
  className,
}: {
  title?: string
  subtitle?: string
  className?: string
}) {
  return (
    <div className={cn('rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl', className)}>
      <div className="flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-500/15 border border-primary-500/25">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white/80" />
        </span>
        <div>
          <p className="text-base font-bold text-white">{title}</p>
          {subtitle ? <p className="mt-1 text-sm text-white/60">{subtitle}</p> : null}
        </div>
      </div>
    </div>
  )
}

export function EmptyState({
  title = 'No hay resultados',
  subtitle,
  action,
  className,
}: {
  title?: string
  subtitle?: string
  action?: ReactNode
  className?: string
}) {
  return (
    <div className={cn('rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl', className)}>
      <div className="flex items-start gap-4">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 border border-white/10">
          <SearchX className="h-6 w-6 text-white/70" aria-hidden="true" />
        </span>
        <div className="flex-1">
          <p className="text-base font-bold text-white">{title}</p>
          {subtitle ? <p className="mt-1 text-sm text-white/60">{subtitle}</p> : null}
          {action ? <div className="mt-5">{action}</div> : null}
        </div>
      </div>
    </div>
  )
}

export function ErrorState({
  title = 'Ocurrió un error',
  subtitle,
  error,
  onRetry,
  retryLabel = 'Reintentar',
  className,
}: {
  title?: string
  subtitle?: string
  error?: unknown
  onRetry?: () => void
  retryLabel?: string
  className?: string
}) {
  const detail = error instanceof Error ? error.message : undefined

  return (
    <div className={cn('rounded-3xl border border-error/30 bg-error/10 p-8 backdrop-blur-xl', className)}>
      <div className="flex items-start gap-4">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-error/15 border border-error/30">
          <AlertTriangle className="h-6 w-6 text-error" aria-hidden="true" />
        </span>
        <div className="flex-1">
          <p className="text-base font-bold text-white">{title}</p>
          {subtitle ? <p className="mt-1 text-sm text-white/70">{subtitle}</p> : null}
          {detail ? <p className="mt-3 text-xs text-white/60">{detail}</p> : null}
          {onRetry ? (
            <div className="mt-5">
              <Button
                onClick={onRetry}
                leftIcon={<RefreshCcw className="h-4 w-4" />}
                variant="secondary"
              >
                {retryLabel}
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

