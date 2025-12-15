import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'

export interface SeatAvailabilityResponse {
  showtime: {
    id: string
    movie: any
    room: any
    startTime: string
    format: string
    language: string
    subtitles?: string | null
    pricingRule?: any
  }
  seats: Array<{
    letter: string
    seats: Array<{
      number: number
      type: 'STANDARD' | 'VIP'
      available: boolean
      locked: boolean
    }>
  }>
}

export function useSeatAvailability(showtimeId: string) {
  return useQuery<SeatAvailabilityResponse>({
    queryKey: ['showtimes', showtimeId, 'seats'],
    queryFn: async () => {
      const res = await api.get(`/showtimes/${showtimeId}/seats`)
      return res.data
    },
    enabled: !!showtimeId,
    staleTime: 10 * 1000, // 10 segundos
  })
}

export interface LockSeatsRequest {
  showtimeId: string
  seats: Array<{ row: string; seatNumber: number }>
}

export interface LockSeatsResponse {
  locks: Array<{
    id: string
    showtimeId: string
    row: string
    seatNumber: number
    lockedUntil: string
  }>
  expiresAt: string
}

export function useLockSeats() {
  const queryClient = useQueryClient()

  return useMutation<LockSeatsResponse, Error, LockSeatsRequest>({
    mutationFn: async (data) => {
      const res = await api.post('/orders/lock-seats', data)
      return res.data
    },
    onSuccess: (_, variables) => {
      // Invalidar cache de asientos para refrescar disponibilidad
      queryClient.invalidateQueries({
        queryKey: ['showtimes', variables.showtimeId, 'seats'],
      })
    },
  })
}

