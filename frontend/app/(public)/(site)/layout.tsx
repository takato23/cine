import type { ReactNode } from 'react'
import { Navigation } from '@/components/Navigation'

export default function PublicSiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-bg-primary">
      <Navigation />
      <div className="pb-24 md:pb-0">{children}</div>
    </div>
  )
}

