'use client'

import type { ReactNode } from 'react'
import { RoleGuard } from '@/components/auth/RoleGuard'

export default function StaffLayout({ children }: { children: ReactNode }) {
  return <RoleGuard allow={['ADMIN', 'STAFF']}>{children}</RoleGuard>
}

