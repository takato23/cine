import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { safeLocalStorage } from '@/lib/integrations/storage'

interface User {
  id: string
  email: string
  name?: string
  role: 'ADMIN' | 'STAFF' | 'CLIENT'
}

interface AuthState {
  user: User | null
  token: string | null
  setAuth: (user: User, token: string) => void
  clearAuth: () => void
  isAdmin: () => boolean
  isStaff: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      setAuth: (user, token) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', token)
        }
        set({ user, token })
      },
      clearAuth: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token')
        }
        set({ user: null, token: null })
      },
      isAdmin: () => get().user?.role === 'ADMIN',
      isStaff: () => get().user?.role === 'STAFF' || get().user?.role === 'ADMIN',
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => safeLocalStorage() as any),
    }
  )
)
