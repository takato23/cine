import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Product } from '@/lib/types/product'
import type { Showtime } from '@/lib/types/showtime'
import { safeSessionStorage } from '@/lib/integrations/storage'

export type SelectedSeat = { row: string; seatNumber: number }

export type SeatLockInfo = {
  expiresAt: string
  locks: Array<{
    id: string
    showtimeId: string
    row: string
    seatNumber: number
    lockedUntil: string
  }>
}

export type CartLine = { product: Product; quantity: number }

type CheckoutState = {
  movieId: string | null
  showtimeId: string | null
  showtime: Showtime | null
  seats: SelectedSeat[]
  seatLock: SeatLockInfo | null
  cart: CartLine[]
  orderId: string | null
  ticketQuantity?: number // For General Admission
  setTickets: (payload: {
    movieId: string
    showtimeId: string
    showtime: Showtime | null
    seats: SelectedSeat[]
    seatLock: SeatLockInfo | null
    ticketQuantity?: number
  }) => void
  addToCart: (product: Product) => void
  setCartQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  setOrderId: (orderId: string | null) => void
  reset: () => void
}

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set, get) => ({
      movieId: null,
      showtimeId: null,
      showtime: null,
      seats: [],
      ticketQuantity: 0,
      seatLock: null,
      cart: [],
      orderId: null,

      setTickets: ({ movieId, showtimeId, showtime, seats, seatLock, ticketQuantity }) =>
        set({ movieId, showtimeId, showtime, seats, seatLock, ticketQuantity: ticketQuantity ?? 0 }),

      addToCart: (product) => {
        set((state) => {
          const existing = state.cart.find((l) => l.product.id === product.id)
          if (existing) {
            return {
              cart: state.cart.map((l) =>
                l.product.id === product.id ? { ...l, quantity: l.quantity + 1 } : l
              ),
            }
          }
          return { cart: [...state.cart, { product, quantity: 1 }] }
        })
      },

      setCartQuantity: (productId, quantity) => {
        const q = Math.max(0, quantity)
        set((state) => ({
          cart:
            q === 0
              ? state.cart.filter((l) => l.product.id !== productId)
              : state.cart.map((l) => (l.product.id === productId ? { ...l, quantity: q } : l)),
        }))
      },

      clearCart: () => set({ cart: [] }),

      setOrderId: (orderId) => set({ orderId }),

      reset: () =>
        set({
          movieId: null,
          showtimeId: null,
          showtime: null,
          seats: [],
          seatLock: null,
          cart: [],
          orderId: null,
        }),
    }),
    {
      name: 'checkout-session',
      storage: createJSONStorage(() => safeSessionStorage() as any),
      partialize: (s) => ({
        movieId: s.movieId,
        showtimeId: s.showtimeId,
        showtime: s.showtime,
        seats: s.seats,
        ticketQuantity: s.ticketQuantity,
        seatLock: s.seatLock,
        cart: s.cart,
        orderId: s.orderId,
      }),
    }
  )
)

let didMigrateLegacy = false

export function migrateLegacyCheckoutSession() {
  if (didMigrateLegacy) return
  didMigrateLegacy = true

  if (typeof window === 'undefined') return

  const state = useCheckoutStore.getState()
  const hasAny = state.seats.length > 0 || state.cart.length > 0 || !!state.orderId
  if (hasAny) return

  let touched = false

  try {
    const legacyTicketsRaw = sessionStorage.getItem('selectedTickets')
    const legacyCartRaw = sessionStorage.getItem('cart')
    const legacyTickets = legacyTicketsRaw ? JSON.parse(legacyTicketsRaw) : null
    const legacyCart = legacyCartRaw ? JSON.parse(legacyCartRaw) : null

    if (legacyTicketsRaw || legacyCartRaw) touched = true

    if (legacyTickets?.showtimeId && Array.isArray(legacyTickets?.seats)) {
      state.setTickets({
        movieId: legacyTickets?.movieId || '',
        showtimeId: legacyTickets.showtimeId,
        showtime: legacyTickets.showtime ?? null,
        seats: legacyTickets.seats,
        seatLock: legacyTickets.seatLock ?? null,
      })
    }

    if (Array.isArray(legacyCart) && legacyCart.length > 0) {
      legacyCart.forEach((l: any) => {
        if (l?.product?.id && typeof l?.quantity === 'number') {
          state.setCartQuantity(l.product.id, l.quantity)
        }
      })
    }

    const movieId = legacyTickets?.movieId
    const legacyOrderIdKey = movieId ? `checkoutOrderId:${movieId}` : null
    const legacyOrderId = legacyOrderIdKey ? sessionStorage.getItem(legacyOrderIdKey) : null
    if (legacyOrderId) {
      touched = true
      state.setOrderId(legacyOrderId)
    }
  } catch {
    // noop
  }

  if (!touched) return

  try {
    sessionStorage.removeItem('selectedTickets')
    sessionStorage.removeItem('cart')
    for (let i = sessionStorage.length - 1; i >= 0; i--) {
      const key = sessionStorage.key(i)
      if (key && key.startsWith('checkoutOrderId:')) {
        sessionStorage.removeItem(key)
      }
    }
  } catch {
    // noop
  }
}
