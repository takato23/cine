'use client'

import { useRef, useState, useEffect, type CSSProperties, type ReactNode } from 'react'
import Image from 'next/image'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { cn } from '@/lib/cn'

type Props = {
  className?: string
  children: ReactNode
  backgroundUrl?: string | null
  /**
   * Default: 360 (px). Used as the cutout radius reference.
   */
  cutoutSizePx?: number
  /**
   * Default: right-ish focus.
   */
  cutoutX?: string
  cutoutY?: string
  priorityImage?: boolean
}

export function CutoutHero({
  className,
  children,
  backgroundUrl,
  cutoutSizePx = 360,
  cutoutX = '72%',
  cutoutY = '46%',
  priorityImage = false,
}: Props) {
  const ref = useRef<HTMLElement | null>(null)
  const reduceMotion = useReducedMotion()

  // Track whether the ref is ready (mounted and hydrated)
  const [isRefReady, setIsRefReady] = useState(false)

  useEffect(() => {
    // Only set ready after a microtask to ensure ref.current is populated
    const timer = requestAnimationFrame(() => {
      if (ref.current) {
        setIsRefReady(true)
      }
    })
    return () => cancelAnimationFrame(timer)
  }, [])

  // Use viewport scroll as fallback, element scroll when ref is ready
  const { scrollYProgress } = useScroll(
    isRefReady && ref.current
      ? { target: ref, offset: ['start start', 'end start'] as const }
      : undefined
  )
  const y = useTransform(scrollYProgress, [0, 1], [0, -80])
  const scale = useTransform(scrollYProgress, [0, 1], [1.03, 1.1])

  const vars: CSSProperties = {
    ['--cutout-x' as any]: cutoutX,
    ['--cutout-y' as any]: cutoutY,
    ['--cutout-size' as any]: `${cutoutSizePx}px`,
  }

  return (
    <section
      ref={ref as any}
      className={cn('relative min-h-[85vh] flex items-center overflow-hidden', className)}
      style={vars}
    >
      <div aria-hidden="true" className="absolute inset-0 cp-hero-base" />

      {backgroundUrl ? (
        <>
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 will-change-transform"
            style={reduceMotion ? undefined : { y }}
          >
            <Image
              src={backgroundUrl}
              alt=""
              fill
              priority={priorityImage}
              sizes="100vw"
              className="object-cover opacity-20 scale-[1.02]"
            />
          </motion.div>

          <motion.div
            aria-hidden="true"
            className="absolute inset-0 cp-cutout-in will-change-transform"
            style={reduceMotion ? undefined : { y, scale }}
          >
            <Image src={backgroundUrl} alt="" fill priority={false} sizes="100vw" className="object-cover opacity-75" />
          </motion.div>
        </>
      ) : null}

      <div aria-hidden="true" className="absolute inset-0 cp-cutout-out" />
      <div aria-hidden="true" className="absolute inset-0 cp-grain opacity-[0.55]" />
      <div aria-hidden="true" className="absolute inset-0 cp-hero-sheen" />
      <div aria-hidden="true" className="absolute inset-0 cp-vignette" />

      <div className="relative z-10 w-full">{children}</div>
    </section>
  )
}
