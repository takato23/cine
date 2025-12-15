export type MovieStatus = 'ESTRENO' | 'CARTELERA' | 'PROXIMAMENTE'

export interface Movie {
  id: string
  title: string
  synopsis: string
  duration: number
  genres: string[]
  rating?: string | null
  status: MovieStatus
  posterUrl?: string | null
  trailerUrl?: string | null
  releaseDate?: string | null
  originalTitle?: string | null
  director?: string | null
  isFeatured?: boolean // película destacada en cartelera
}


