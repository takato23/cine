import { create } from 'zustand'
import { Product } from '@/lib/types/product'
import { Showtime } from '@/lib/types/showtime'

export interface TicketDraft {
  showtimeId: string
  showtime: Showtime
  seats: Array<{ row: string; seatNumber: number }>
  locks?: Array<{ id: string; expiresAt: Date }>
}

export interface CartProduct {
  product: Product
  quantity: number
}

interface PosState {
  // Carrito de productos
  products: CartProduct[]
  
  // Draft de tickets (antes de seleccionar asientos)
  ticketDraft: TicketDraft | null
  
  // Modo actual: 'products' | 'tickets' | 'checkout'
  mode: 'products' | 'tickets' | 'checkout'
  
  // Acciones productos
  addProduct: (product: Product) => void
  removeProduct: (productId: string) => void
  updateProductQuantity: (productId: string, quantity: number) => void
  clearProducts: () => void
  
  // Acciones tickets
  setTicketDraft: (draft: TicketDraft | null) => void
  addSeatsToDraft: (seats: Array<{ row: string; seatNumber: number }>) => void
  removeSeatsFromDraft: (seats: Array<{ row: string; seatNumber: number }>) => void
  clearTicketDraft: () => void
  
  // Modo
  setMode: (mode: 'products' | 'tickets' | 'checkout') => void
  
  // Limpiar todo
  clearCart: () => void
  
  // Totales
  getProductsTotal: () => number
  getTicketsTotal: () => number
  getTotal: () => number
}

export const usePosStore = create<PosState>((set, get) => ({
  products: [],
  ticketDraft: null,
  mode: 'products',
  
  addProduct: (product) => {
    set((state) => {
      const existing = state.products.find((p) => p.product.id === product.id)
      if (existing) {
        return {
          products: state.products.map((p) =>
            p.product.id === product.id
              ? { ...p, quantity: p.quantity + 1 }
              : p
          ),
        }
      }
      return {
        products: [...state.products, { product, quantity: 1 }],
      }
    })
  },
  
  removeProduct: (productId) => {
    set((state) => ({
      products: state.products.filter((p) => p.product.id !== productId),
    }))
  },
  
  updateProductQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeProduct(productId)
      return
    }
    set((state) => ({
      products: state.products.map((p) =>
        p.product.id === productId ? { ...p, quantity } : p
      ),
    }))
  },
  
  clearProducts: () => {
    set({ products: [] })
  },
  
  setTicketDraft: (draft) => {
    set({ ticketDraft: draft })
  },
  
  addSeatsToDraft: (seats) => {
    set((state) => {
      if (!state.ticketDraft) return state
      const existingSeats = new Set(
        state.ticketDraft.seats.map((s) => `${s.row}-${s.seatNumber}`)
      )
      const newSeats = seats.filter(
        (s) => !existingSeats.has(`${s.row}-${s.seatNumber}`)
      )
      return {
        ticketDraft: {
          ...state.ticketDraft,
          seats: [...state.ticketDraft.seats, ...newSeats],
        },
      }
    })
  },
  
  removeSeatsFromDraft: (seats) => {
    set((state) => {
      if (!state.ticketDraft) return state
      const seatsToRemove = new Set(
        seats.map((s) => `${s.row}-${s.seatNumber}`)
      )
      return {
        ticketDraft: {
          ...state.ticketDraft,
          seats: state.ticketDraft.seats.filter(
            (s) => !seatsToRemove.has(`${s.row}-${s.seatNumber}`)
          ),
        },
      }
    })
  },
  
  clearTicketDraft: () => {
    set({ ticketDraft: null })
  },
  
  setMode: (mode) => {
    set({ mode })
  },
  
  clearCart: () => {
    set({
      products: [],
      ticketDraft: null,
      mode: 'products',
    })
  },
  
  getProductsTotal: () => {
    return get().products.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    )
  },
  
  getTicketsTotal: () => {
    // TODO: calcular precio de tickets cuando tengamos pricing rules
    const draft = get().ticketDraft
    if (!draft || draft.seats.length === 0) return 0
    // Por ahora asumimos precio base de 5000 por ticket
    return draft.seats.length * 5000
  },
  
  getTotal: () => {
    return get().getProductsTotal() + get().getTicketsTotal()
  },
}))

