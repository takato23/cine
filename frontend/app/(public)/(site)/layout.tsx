'use client'

import type { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { Navigation } from '@/components/Navigation'

export default function PublicSiteLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isHomePage = pathname === '/'

  return (
    <div className="min-h-screen bg-bg-primary">
      {!isHomePage && <Navigation />}
      <div className={isHomePage ? '' : 'pb-24 md:pb-0'}>{children}</div>
    </div>
  )
}
