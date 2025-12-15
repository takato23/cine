import type { Movie } from './movie'

export type ShowtimeFormat = 'TWO_D' | 'THREE_D' | 'IMAX'

export interface RoomLite {
  id: string
  name: string
  capacity: number
  layout: unknown
  seatingMode?: 'ASSIGNED' | 'GENERAL'
}

export interface PricingRuleLite {
  id: string
  name: string
  basePrice: number
  seatType?: 'STANDARD' | 'VIP'
}

export interface Showtime {
  id: string
  movieId: string
  roomId: string
  startTime: string
  format: ShowtimeFormat
  language: string
  subtitles?: string | null
  movie?: Movie
  room?: RoomLite
  pricingRule?: PricingRuleLite | null
}

export interface SeatCell {
  number: number
  type: 'STANDARD' | 'VIP'
  available: boolean
  locked: boolean
}

export interface SeatRow {
  letter: string
  seats: SeatCell[]
}

export interface ShowtimeSeatsResponse {
  showtime: Showtime & { movie: Movie; room: RoomLite }
  seats: SeatRow[]
}


