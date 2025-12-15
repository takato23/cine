import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Showtime, ShowtimeSeatsResponse } from '@/lib/types'

export function useShowtimes(params: { movieId?: string; date?: string }) {
  const { movieId, date } = params
  return useQuery<Showtime[]>({
    queryKey: ['showtimes', movieId ?? null, date ?? null],
    enabled: !!movieId,
    queryFn: async () => {
      const res = await api.get('/showtimes', { params: { movieId, date } })
      return res.data
    },
  })
}

export function useShowtimeSeats(showtimeId: string | undefined) {
  return useQuery<ShowtimeSeatsResponse>({
    queryKey: ['showtimes', showtimeId, 'seats'],
    enabled: !!showtimeId,
    queryFn: async () => {
      const res = await api.get(`/showtimes/${showtimeId}/seats`)
      return res.data
    },
  })
}


