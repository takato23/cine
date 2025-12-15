'use client'

import { type ReactNode, useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  className,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children: ReactNode
  footer?: ReactNode
  className?: string
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [open])

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={() => onOpenChange(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className={cn(
                'w-full max-w-lg mx-4 sm:mx-0 rounded-3xl border border-white/10 bg-bg-secondary/90 text-white shadow-2xl outline-none pointer-events-auto',
                'backdrop-blur-xl relative overflow-hidden flex flex-col max-h-[85vh]',
                className
              )}
            >
              {/* Premium Background Effects */}
              <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_120%_60%_at_50%_0%,rgba(255,255,255,0.05),transparent_60%)]" />
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

              <div className="relative p-6 sm:p-8 flex flex-col max-h-[90vh]">
                <div className="flex items-start justify-between gap-4 mb-6 shrink-0">
                  <div>
                    <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white to-white/60">
                      {title}
                    </h2>
                    {description && (
                      <p className="mt-1 text-sm text-neutral-400">
                        {description}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenChange(false)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto min-h-0 -mx-2 px-2">
                  {children}
                </div>

                {footer && (
                  <div className="mt-8 pt-6 border-t border-white/5 flex justify-end gap-3 shrink-0">
                    {footer}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  )
}

