import { useMutation, useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { CreateOrderResponse, Order, OrderItemInput } from '@/lib/types'

export function useLockSeats() {
  return useMutation({
    mutationFn: async (payload: { showtimeId: string; seats: Array<{ row: string; seatNumber: number }> }) => {
      const res = await api.post('/orders/lock-seats', payload)
      return res.data as { locks: any[]; expiresAt: string }
    },
  })
}

export function useCreateOrder() {
  return useMutation({
    mutationFn: async (payload: { items: OrderItemInput[]; channel?: 'web' | 'mobile' | 'pos' }) => {
      const res = await api.post('/orders', payload)
      return res.data as CreateOrderResponse
    },
  })
}

export function useOrder(id: string | undefined) {
  return useQuery<Order>({
    queryKey: ['orders', id],
    enabled: !!id,
    queryFn: async () => {
      const res = await api.get(`/orders/${id}`)
      return res.data
    },
    refetchInterval: (query) => {
      const data = query.state.data as Order | undefined
      if (!data) return 2000
      if (data.status === 'PAID' || data.status === 'EXPIRED' || data.status === 'CANCELLED') return false
      return 2500
    },
  })
}


