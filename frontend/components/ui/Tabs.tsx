'use client'

import { cn } from '@/lib/cn'

export type TabsOption<T extends string> = {
  value: T
  label: string
  count?: number
}

export function Tabs<T extends string>({
  value,
  onValueChange,
  options,
  className,
}: {
  value: T
  onValueChange: (value: T) => void
  options: Array<TabsOption<T>>
  className?: string
}) {
  return (
    <div
      className={cn(
        'inline-flex rounded-2xl border border-white/10 bg-white/5 p-1 backdrop-blur-md',
        className
      )}
      role="tablist"
      aria-label="Pestañas"
    >
      {options.map((opt) => {
        const active = opt.value === value
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onValueChange(opt.value)}
            className={cn(
              'relative inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-fast',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40',
              active ? 'bg-primary-500/25 text-white shadow-glow-soft' : 'text-white/70 hover:text-white'
            )}
          >
            <span>{opt.label}</span>
            {typeof opt.count === 'number' && (
              <span
                className={cn(
                  'rounded-full px-2 py-0.5 text-[11px] font-bold tabular-nums',
                  active ? 'bg-white/15 text-white' : 'bg-white/10 text-white/70'
                )}
              >
                {opt.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

