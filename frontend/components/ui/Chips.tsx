'use client'

import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/cn'

export interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean
  tone?: 'default' | 'primary' | 'danger'
}

export const Chip = forwardRef<HTMLButtonElement, ChipProps>(
  ({ className, active, tone = 'default', type = 'button', ...props }, ref) => {
    const toneClass =
      tone === 'primary'
        ? 'border-primary-500/30 text-primary-200'
        : tone === 'danger'
          ? 'border-error/30 text-error'
          : 'border-white/10 text-white/80'

    const activeClass =
      active
        ? 'bg-primary-500/25 border-primary-500/35 text-white shadow-glow-soft'
        : 'bg-white/5 hover:bg-white/10'

    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          'inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold',
          'border backdrop-blur-md transition-all duration-fast ease-out',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40',
          'active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed',
          toneClass,
          activeClass,
          className
        )}
        {...props}
      />
    )
  }
)
Chip.displayName = 'Chip'

