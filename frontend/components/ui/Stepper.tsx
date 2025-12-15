'use client'

import { cn } from '@/lib/cn'

export type StepperStep = {
  key: string
  label: string
}

export function Stepper({
  steps,
  activeKey,
  className,
}: {
  steps: StepperStep[]
  activeKey: string
  className?: string
}) {
  const activeIndex = Math.max(0, steps.findIndex((s) => s.key === activeKey))

  return (
    <ol className={cn('flex flex-wrap items-center gap-2', className)} aria-label="Progreso">
      {steps.map((step, idx) => {
        const state = idx < activeIndex ? 'done' : idx === activeIndex ? 'active' : 'todo'
        return (
          <li key={step.key} className="flex items-center gap-2">
            <span
              className={cn(
                'inline-flex h-8 w-8 items-center justify-center rounded-xl border text-sm font-extrabold tabular-nums',
                state === 'done'
                  ? 'bg-success/15 border-success/35 text-success'
                  : state === 'active'
                    ? 'bg-primary-500/25 border-primary-500/35 text-white shadow-glow-soft'
                    : 'bg-white/5 border-white/10 text-white/60'
              )}
              aria-hidden="true"
            >
              {idx + 1}
            </span>
            <span
              className={cn(
                'text-sm font-semibold',
                state === 'active' ? 'text-white' : state === 'done' ? 'text-white/80' : 'text-white/60'
              )}
            >
              {step.label}
            </span>
            {idx !== steps.length - 1 && <span className="mx-1 h-px w-6 bg-white/10" aria-hidden="true" />}
          </li>
        )
      })}
    </ol>
  )
}

