'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/cn'

type Props = {
  children: ReactNode
  className?: string
  /**
   * Default: true. If false, renders only texture (no spotlight follow).
   */
  interactive?: boolean
}

export function SpotlightPanel({ children, className, interactive = true }: Props) {
  const ref = useRef<HTMLDivElement | null>(null)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (!interactive) return
    if (reduceMotion) return

    const el = ref.current
    if (!el) return

    let raf = 0

    const setFromEvent = (ev: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      const x = Math.max(0, Math.min(1, (ev.clientX - rect.left) / rect.width))
      const y = Math.max(0, Math.min(1, (ev.clientY - rect.top) / rect.height))
      el.style.setProperty('--spot-x', `${(x * 100).toFixed(2)}%`)
      el.style.setProperty('--spot-y', `${(y * 100).toFixed(2)}%`)
    }

    const onMove = (ev: PointerEvent) => {
      if (raf) cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => setFromEvent(ev))
    }

    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerdown', onMove)
    return () => {
      if (raf) cancelAnimationFrame(raf)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerdown', onMove)
    }
  }, [interactive, reduceMotion])

  return (
    <div
      ref={ref}
      className={cn(
        'relative overflow-hidden rounded-3xl border border-white/10 bg-bg-secondary/80 backdrop-blur-xl shadow-card',
        className
      )}
      style={
        {
          ['--spot-x' as any]: '55%',
          ['--spot-y' as any]: '35%',
        } as any
      }
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 cp-grain opacity-[0.55]" />
      <div
        aria-hidden="true"
        className={cn('pointer-events-none absolute inset-0 cp-spotlight', reduceMotion || !interactive ? 'opacity-0' : 'opacity-100')}
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 cp-vignette" />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
