'use client'

import { useState, useMemo } from 'react'
import { Armchair } from 'lucide-react'

export interface Seat {
  row: string
  number: number
  type: 'STANDARD' | 'VIP' | 'GAP'
  available: boolean
  locked?: boolean
}

export interface SeatRow {
  letter: string
  seats: Seat[]
}

interface SeatMapProps {
  rows: SeatRow[]
  selectedSeats: Array<{ row: string; seatNumber: number }>
  onSeatSelect: (row: string, seatNumber: number) => void
  onSeatDeselect: (row: string, seatNumber: number) => void
  maxSeats?: number
  disabled?: boolean
}

export function SeatMap({
  rows,
  selectedSeats,
  onSeatSelect,
  onSeatDeselect,
  maxSeats,
  disabled = false,
}: SeatMapProps) {
  const selectedSet = useMemo(
    () =>
      new Set(selectedSeats.map((s) => `${s.row}-${s.seatNumber}`)),
    [selectedSeats]
  )

  const handleSeatClick = (row: string, seat: Seat) => {
    if (disabled || !seat.available || seat.locked) return

    const key = `${row}-${seat.number}`
    const isSelected = selectedSet.has(key)

    if (isSelected) {
      onSeatDeselect(row, seat.number)
    } else {
      if (maxSeats && selectedSeats.length >= maxSeats) {
        return
      }
      onSeatSelect(row, seat.number)
    }
  }

  const getSeatColor = (row: string, seat: Seat) => {
    const key = `${row}-${seat.number}`
    const isSelected = selectedSet.has(key)

    if (isSelected) {
      return 'bg-primary-500 text-white'
    }
    if (!seat.available || seat.locked) {
      return 'bg-neutral-700 text-neutral-500 cursor-not-allowed'
    }
    if (seat.type === 'VIP') {
      return 'bg-secondary-500 text-neutral-900 hover:bg-secondary-400'
    }
    return 'bg-neutral-600 text-neutral-200 hover:bg-neutral-500'
  }

  return (
    <div className="bg-bg-secondary rounded-xl p-6">
      {/* Screen */}
      <div className="mb-8 text-center">
        <div className="h-2 bg-neutral-600 rounded-full mb-2"></div>
        <p className="text-sm text-neutral-400 uppercase tracking-wider">Pantalla</p>
      </div>

      {/* Seats Grid */}
      <div className="space-y-4 max-h-[600px] overflow-y-auto">
        {rows.map((row) => (
          <div key={row.letter} className="flex items-center space-x-2">
            <div className="w-8 text-center font-semibold text-neutral-300">
              {row.letter}
            </div>
            <div className="flex-1 flex items-center space-x-1 flex-wrap gap-1">
              {row.seats.map((seat) => {
                const key = `${row.letter}-${seat.number}`
                const isSelected = selectedSet.has(key)
                const seatNumber = selectedSeats.findIndex(
                  (s) => s.row === row.letter && s.seatNumber === seat.number
                ) + 1

                return (
                  <button
                    key={seat.number}
                    onClick={() => handleSeatClick(row.letter, seat)}
                    disabled={disabled || !seat.available || seat.locked}
                    className={`
                      relative w-10 h-10 rounded-md transition-all duration-fast
                      ${getSeatColor(row.letter, seat)}
                      ${!disabled && seat.available && !seat.locked ? 'hover:scale-110 cursor-pointer' : ''}
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary
                    `}
                    aria-label={`Asiento ${row.letter}${seat.number}, ${seat.type === 'VIP' ? 'VIP' : 'General'}, ${seat.available ? 'disponible' : 'ocupado'}`}
                    aria-pressed={isSelected}
                  >
                    <Armchair className="w-5 h-5 mx-auto" />
                    {isSelected && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-white text-primary-500 rounded-full text-xs font-bold flex items-center justify-center">
                        {seatNumber}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4 justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-neutral-600 rounded-md flex items-center justify-center">
            <Armchair className="w-5 h-5 text-neutral-200" />
          </div>
          <span className="text-sm text-neutral-300">Disponible</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-secondary-500 rounded-md flex items-center justify-center">
            <Armchair className="w-5 h-5 text-neutral-900" />
          </div>
          <span className="text-sm text-neutral-300">VIP</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary-500 rounded-md flex items-center justify-center">
            <Armchair className="w-5 h-5 text-white" />
          </div>
          <span className="text-sm text-neutral-300">Seleccionado</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-neutral-700 rounded-md flex items-center justify-center">
            <Armchair className="w-5 h-5 text-neutral-500" />
          </div>
          <span className="text-sm text-neutral-300">Ocupado</span>
        </div>
      </div>
    </div>
  )
}
