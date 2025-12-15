'use client'

import { createContext, useContext, useState, useCallback, useMemo, useRef, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, CheckCircle2, XCircle, AlertTriangle, Info } from 'lucide-react'
import { cn } from '@/lib/cn'

export type ToastVariant = 'success' | 'error' | 'warning' | 'info'

export type ToastAction = {
  label: string
  onClick: () => void
}

export type ToastOptions = {
  id?: string
  title?: string
  message?: string
  variant?: ToastVariant
  duration?: number
  action?: ToastAction
  undo?: ToastAction
}

type ToastModel = {
  id: string
  title?: string
  message: string
  variant: ToastVariant
  duration: number
  action?: ToastAction
  undo?: ToastAction
}

export type AddToast = {
  (message: string, variant?: ToastVariant, duration?: number): string
  (options: ToastOptions): string
}

interface ToastContextType {
  toasts: ToastModel[]
  addToast: AddToast
  removeToast: (id: string) => void
  clearToasts: () => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastModel[]>([])
  const timeoutsRef = useRef<Map<string, number>>(new Map())

  const removeToast = useCallback((id: string) => {
    const existing = timeoutsRef.current.get(id)
    if (existing) window.clearTimeout(existing)
    timeoutsRef.current.delete(id)
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const clearToasts = useCallback(() => {
    timeoutsRef.current.forEach((t) => window.clearTimeout(t))
    timeoutsRef.current.clear()
    setToasts([])
  }, [])

  const scheduleDismiss = useCallback(
    (id: string, duration: number) => {
      if (duration <= 0) return
      const t = window.setTimeout(() => removeToast(id), duration)
      timeoutsRef.current.set(id, t)
    },
    [removeToast]
  )

  const addToast: AddToast = useCallback(
    (...args: any[]) => {
      const isObject = typeof args[0] === 'object'
      const options: ToastOptions = isObject
        ? (args[0] as ToastOptions)
        : { message: args[0] as string, variant: args[1] as ToastVariant, duration: args[2] as number }

      const id = options.id ?? Math.random().toString(36).slice(2, 10)
      const model: ToastModel = {
        id,
        title: options.title,
        message: options.message ?? '',
        variant: options.variant ?? 'info',
        duration: options.duration ?? 4000,
        action: options.action,
        undo: options.undo,
      }

      setToasts((prev) => [...prev, model])
      scheduleDismiss(id, model.duration)
      return id
    },
    [scheduleDismiss]
  )

  const value = useMemo(() => ({ toasts, addToast, removeToast, clearToasts }), [toasts, addToast, removeToast, clearToasts])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  )
}

function ToastContainer({ toasts, removeToast }: { toasts: ToastModel[]; removeToast: (id: string) => void }) {
  return (
    <div className="fixed bottom-24 right-4 left-4 md:left-auto md:bottom-4 z-[100] flex flex-col gap-2 max-w-md w-full pointer-events-none">
      <AnimatePresence initial={false}>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  )
}

function ToastItem({ toast, onClose }: { toast: ToastModel; onClose: () => void }) {
  const icon = {
    success: <CheckCircle2 className="h-5 w-5 text-success" aria-hidden="true" />,
    error: <XCircle className="h-5 w-5 text-error" aria-hidden="true" />,
    warning: <AlertTriangle className="h-5 w-5 text-warning" aria-hidden="true" />,
    info: <Info className="h-5 w-5 text-info" aria-hidden="true" />,
  }[toast.variant]

  const ring = {
    success: 'border-success/30',
    error: 'border-error/30',
    warning: 'border-warning/30',
    info: 'border-info/30',
  }[toast.variant]

  const glow = {
    success: 'shadow-[0_0_24px_rgba(34,197,94,0.12)]',
    error: 'shadow-[0_0_24px_rgba(239,68,68,0.14)]',
    warning: 'shadow-[0_0_24px_rgba(245,158,11,0.14)]',
    info: 'shadow-[0_0_24px_rgba(59,130,246,0.14)]',
  }[toast.variant]

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
      className={cn(
        'pointer-events-auto flex items-start gap-3 rounded-3xl border',
        'bg-bg-secondary/90 backdrop-blur-2xl',
        'px-4 py-3 shadow-enterprise',
        ring,
        glow
      )}
      role="status"
      aria-live="polite"
    >
      <span className="mt-0.5">{icon}</span>

      <div className="flex-1 min-w-0">
        {toast.title ? <p className="text-sm font-extrabold text-white">{toast.title}</p> : null}
        {toast.message ? (
          <p className={cn('text-sm text-white/80', toast.title ? 'mt-0.5' : undefined)}>{toast.message}</p>
        ) : null}

        {toast.action || toast.undo ? (
          <div className="mt-2 flex flex-wrap gap-2">
            {toast.action ? (
              <button
                type="button"
                onClick={() => {
                  toast.action?.onClick()
                  onClose()
                }}
                className="inline-flex items-center rounded-2xl px-3 py-1 text-xs font-bold text-white bg-white/10 border border-white/10 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
              >
                {toast.action.label}
              </button>
            ) : null}
            {toast.undo ? (
              <button
                type="button"
                onClick={() => {
                  toast.undo?.onClick()
                  onClose()
                }}
                className="inline-flex items-center rounded-2xl px-3 py-1 text-xs font-bold text-primary-200 bg-primary-500/10 border border-primary-500/25 hover:bg-primary-500/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
              >
                {toast.undo.label}
              </button>
            ) : null}
          </div>
        ) : null}
      </div>

      <button
        type="button"
        onClick={onClose}
        className="rounded-2xl p-2 text-white/55 hover:text-white/80 hover:bg-white/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary"
        aria-label="Cerrar notificación"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </motion.div>
  )
}

// Hook helpers for convenience
export function useSuccessToast() {
  const { addToast } = useToast()
  return useCallback((message: string) => addToast(message, 'success'), [addToast])
}

export function useErrorToast() {
  const { addToast } = useToast()
  return useCallback((message: string) => addToast(message, 'error'), [addToast])
}
