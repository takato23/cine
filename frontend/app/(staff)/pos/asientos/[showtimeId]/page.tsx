'use client'

import { useParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useSeatAvailability, useLockSeats } from '@/lib/queries/seats'
import { SeatMap, SeatRow } from '@/components/seats/SeatMap'
import { usePosStore } from '@/lib/store/pos'
import { useState, useMemo } from 'react'
import { ArrowLeft, Check, RefreshCcw } from 'lucide-react'
import { Showtime } from '@/lib/types/showtime'
import { useToast } from '@/components/ui/Toast'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/states'

export default function PosSeatsPage() {
  const params = useParams()
  const router = useRouter()
  const showtimeId = params.showtimeId as string
  const { addToast } = useToast()

  const { data: showtimeData } = useQuery<Showtime>({
    queryKey: ['showtimes', showtimeId],
    queryFn: async () => {
      const res = await api.get(`/showtimes/${showtimeId}`)
      return res.data
    },
    enabled: !!showtimeId,
  })

  const { data: seatData, isLoading, isError, error, refetch, isFetching } = useSeatAvailability(showtimeId)
  const lockSeatsMutation = useLockSeats()
  const { ticketDraft, setTicketDraft } = usePosStore()

  const [selectedSeats, setSelectedSeats] = useState<{ row: string; seatNumber: number }[]>(
    ticketDraft?.seats || []
  )

  const seatRows: SeatRow[] = useMemo(() => {
    if (!seatData) return []
    return seatData.seats.map((row) => ({
      letter: row.letter,
      seats: row.seats.map((seat) => ({
        row: row.letter,
        number: seat.number,
        type: seat.type,
        available: seat.available,
        locked: seat.locked,
      })),
    }))
  }, [seatData])

  const handleSeatSelect = (row: string, seatNumber: number) => {
    setSelectedSeats((prev) => {
      const exists = prev.some((s) => s.row === row && s.seatNumber === seatNumber)
      if (exists) return prev
      return [...prev, { row, seatNumber }]
    })
  }

  const handleSeatDeselect = (row: string, seatNumber: number) => {
    setSelectedSeats((prev) =>
      prev.filter((s) => !(s.row === row && s.seatNumber === seatNumber))
    )
  }

  const handleConfirm = async () => {
    if (selectedSeats.length === 0) {
      addToast({ title: 'Elegí los asientos', message: 'Seleccioná al menos un asiento para continuar.', variant: 'info' })
      return
    }

    if (!showtimeData) return

    try {
      // Lockear asientos
      const lockResult = await lockSeatsMutation.mutateAsync({
        showtimeId,
        seats: selectedSeats,
      })

      // Actualizar draft con asientos y locks
      if (ticketDraft) {
        setTicketDraft({
          ...ticketDraft,
          seats: selectedSeats,
          locks: lockResult.locks.map((lock) => ({
            id: lock.id,
            expiresAt: new Date(lock.lockedUntil),
          })),
        })
      } else {
        setTicketDraft({
          showtimeId,
          showtime: showtimeData,
          seats: selectedSeats,
          locks: lockResult.locks.map((lock) => ({
            id: lock.id,
            expiresAt: new Date(lock.lockedUntil),
          })),
        })
      }

      // Volver al POS
      router.push('/pos')
    } catch (error: any) {
      addToast({
        title: 'No pudimos reservar los asientos',
        message: error?.response?.data?.error || error?.message || 'Reintentá en unos segundos.',
        variant: 'error',
        duration: 6500,
      })
    }
  }

  const totalPrice = selectedSeats.length * 5000 // TODO: usar pricing rules

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 rounded-2xl px-2 py-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver</span>
          </button>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-neutral-50">
              {showtimeData?.movie?.title || 'Seleccionar Asientos'}
            </h1>
            {showtimeData && (
              <p className="text-sm text-neutral-300">
                {showtimeData.room?.name} • {new Date(showtimeData.startTime).toLocaleTimeString('es-AR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            )}
          </div>
          <div className="w-20"></div>
        </div>

        {/* Seat Map */}
        {isLoading ? (
          <div className="py-10">
            <LoadingState title="Cargando asientos…" subtitle="Buscando disponibilidad en sala." />
          </div>
        ) : isError ? (
          <div className="py-10">
            <ErrorState
              title="No pudimos cargar los asientos"
              subtitle="Reintentá en unos segundos."
              error={error}
              onRetry={() => refetch()}
              retryLabel={isFetching ? 'Reintentando…' : 'Reintentar'}
            />
          </div>
        ) : seatRows.length === 0 ? (
          <div className="py-10">
            <EmptyState
              title="No hay asientos disponibles"
              subtitle="Puede ser un problema temporal. Reintentá o volvé al POS."
              action={
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="secondary"
                    leftIcon={<RefreshCcw className="h-4 w-4" />}
                    onClick={() => refetch()}
                    isLoading={isFetching}
                  >
                    Reintentar
                  </Button>
                  <Button variant="ghost" onClick={() => router.push('/pos')}>
                    Volver al POS
                  </Button>
                </div>
              }
            />
          </div>
        ) : seatRows.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <SeatMap
                rows={seatRows}
                selectedSeats={selectedSeats}
                onSeatSelect={handleSeatSelect}
                onSeatDeselect={handleSeatDeselect}
                disabled={lockSeatsMutation.isPending}
              />
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-24" variant="default">
                <h2 className="text-xl font-extrabold text-white mb-4 tracking-tight">Resumen</h2>
                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-sm text-neutral-300 mb-2">Asientos seleccionados:</p>
                    <div className="space-y-1">
                      {selectedSeats.length === 0 ? (
                        <p className="text-neutral-400 text-sm">Ninguno</p>
                      ) : (
                        selectedSeats.map((seat, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span className="text-neutral-300">
                              {seat.row}{seat.seatNumber}
                            </span>
                            <span className="text-neutral-50 font-medium">$5.000</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                  <div className="border-t border-neutral-700 pt-4">
                    <div className="flex justify-between text-lg font-bold text-neutral-50">
                      <span>Total</span>
                      <span>${totalPrice.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={handleConfirm}
                  disabled={selectedSeats.length === 0 || lockSeatsMutation.isPending}
                  isLoading={lockSeatsMutation.isPending}
                  size="lg"
                  className="w-full"
                  leftIcon={<Check className="h-5 w-5" />}
                >
                  Confirmar Asientos
                </Button>
              </Card>
            </div>
          </div>
        ) : (
          <div className="py-10">
            <EmptyState
              title="No se pudieron cargar los asientos"
              subtitle="Reintentá y, si el problema persiste, volvé al POS."
              action={
                <div className="flex flex-wrap gap-3">
                  <Button variant="secondary" onClick={() => refetch()} isLoading={isFetching}>
                    Reintentar
                  </Button>
                  <Button variant="ghost" onClick={() => router.push('/pos')}>
                    Volver al POS
                  </Button>
                </div>
              }
            />
          </div>
        )}
      </div>
    </div>
  )
}
