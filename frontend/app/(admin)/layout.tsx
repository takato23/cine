'use client'

import type { ReactNode } from 'react'
import { RoleGuard } from '@/components/auth/RoleGuard'
import { AdminSidebar } from '@/components/admin/Sidebar'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <RoleGuard allow={['ADMIN']}>
      <div className="flex h-screen bg-black overflow-hidden selection:bg-primary-500/30">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto overflow-x-hidden relative">
          <div className="absolute inset-0 bg-fixed pointer-events-none z-0" style={{
            background: 'radial-gradient(circle at 50% 0%, rgba(120, 119, 198, 0.1) 0%, transparent 50%), radial-gradient(circle at 0% 0%, rgba(74, 32, 138, 0.15) 0%, transparent 50%)'
          }} />
          <div className="relative z-10 p-8 max-w-7xl mx-auto pb-32">
            {children}
          </div>
        </main>
      </div>
    </RoleGuard>
  )
}

