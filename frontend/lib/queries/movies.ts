import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Movie } from '@/lib/types'

export function useMovies() {
  return useQuery<Movie[]>({
    queryKey: ['movies'],
    queryFn: async () => {
      const res = await api.get('/movies')
      return res.data
    },
  })
}

export function useMovie(id: string | undefined) {
  return useQuery<Movie>({
    queryKey: ['movies', id],
    enabled: !!id,
    queryFn: async () => {
      const res = await api.get(`/movies/${id}`)
      return res.data
    },
  })
}


