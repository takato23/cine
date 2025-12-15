'use client'

import { useParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useSeatAvailability, useLockSeats } from '@/lib/queries/seats'
import { SeatRow } from '@/components/seats/SeatMap' // Type import
import SeatMap3D from '@/components/seats/SeatMap3D'
import SceneContainer from '@/components/canvas/SceneContainer'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, Check, Clock, Info, RefreshCcw, ShieldCheck, Ticket, Users } from 'lucide-react'
import { Showtime } from '@/lib/types/showtime'
import { useAuthStore } from '@/lib/store'
import { useCheckoutStore } from '@/lib/store/checkout'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Modal } from '@/components/ui/Modal'
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/states'
import { useToast } from '@/components/ui/Toast'
import { cn } from '@/lib/cn'
import { ff } from '@/lib/flags'
import { QuantitySelector } from '@/components/ui/QuantitySelector'


export default function ClientSeatsPage() {
  const params = useParams()
  const router = useRouter()
  const showtimeId = params.showtimeId as string
  const movieId = params.id as string
  const { user } = useAuthStore()
  const { addToast } = useToast()
  const {
    showtimeId: storedShowtimeId,
    seats: storedSeats,
    seatLock: storedSeatLock,
    setTickets,
    clearCart,
  } = useCheckoutStore()

  const { data: showtimeData } = useQuery<Showtime>({
    queryKey: ['showtimes', showtimeId],
    queryFn: async () => {
      const res = await api.get(`/showtimes/${showtimeId}`)
      return res.data
    },
    enabled: !!showtimeId,
  })

  const {
    data: seatData,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useSeatAvailability(showtimeId)
  const lockSeatsMutation = useLockSeats()

  const isSameSession = storedShowtimeId === showtimeId && (storedSeats.length > 0 || !!storedSeatLock)
  const [selectedSeats, setSelectedSeats] = useState<{ row: string; seatNumber: number }[]>(
    isSameSession ? storedSeats : []
  )
  const [generalQuantity, setGeneralQuantity] = useState(1)
  const [expiredModalOpen, setExpiredModalOpen] = useState(false)

  // NEW: View Mode State
  const [viewMode, setViewMode] = useState<'AERIAL' | 'POV'>('AERIAL');

  const warnedRef = useRef(false)
  const [now, setNow] = useState(() => Date.now())

  // Navigation Logic



  const expiresAtMs = useMemo(() => {
    if (!isSameSession) return null
    const iso = storedSeatLock?.expiresAt ?? null
    if (!iso) return null
    const ms = new Date(iso).getTime()
    return Number.isFinite(ms) ? ms : null
  }, [isSameSession, storedSeatLock?.expiresAt])

  useEffect(() => {
    if (!isSameSession) return
    if (storedSeats.length === 0) return
    setSelectedSeats((prev) => (prev.length > 0 ? prev : storedSeats))
  }, [isSameSession, storedSeats])

  useEffect(() => {
    if (!expiresAtMs) return
    const t = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(t)
  }, [expiresAtMs])

  const timeLeftSeconds = useMemo(() => {
    if (!expiresAtMs) return null
    return Math.max(0, Math.floor((expiresAtMs - now) / 1000))
  }, [expiresAtMs, now])

  const isExpired = timeLeftSeconds === 0 && !!expiresAtMs

  const timeLabel = useMemo(() => {
    if (timeLeftSeconds === null) return null
    const m = Math.floor(timeLeftSeconds / 60)
    const s = timeLeftSeconds % 60
    return `${m}:${String(s).padStart(2, '0')}`
  }, [timeLeftSeconds])

  useEffect(() => {
    if (!ff('SEAT_TIMER', true)) return
    if (timeLeftSeconds === null) return
    if (timeLeftSeconds <= 60 && timeLeftSeconds > 0 && !warnedRef.current) {
      warnedRef.current = true
      addToast({
        title: 'Tu reserva está por expirar',
        message: `Te quedan ${timeLabel} para confirmar o reintentar la reserva.`,
        variant: 'warning',
        duration: 5500,
      })
    }
    if (timeLeftSeconds > 60) warnedRef.current = false
  }, [addToast, timeLabel, timeLeftSeconds])

  useEffect(() => {
    if (!ff('SEAT_TIMER', true)) return
    if (!isExpired) return
    setExpiredModalOpen(true)
  }, [isExpired])

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

  // NEW: Focused Seat for POV Navigation (Decoupled from Selection)
  const [focusedSeat, setFocusedSeat] = useState<{ row: string; seatNumber: number } | null>(null);

  // Navigation Logic
  const handleSeatNavigation = (direction: 'next' | 'prev') => {
    // 1. If MULTIPLE seats selected: CYCLE through them.
    if (selectedSeats.length > 1) {
      const sorted = [...selectedSeats].sort((a, b) => {
        if (a.row === b.row) return a.seatNumber - b.seatNumber;
        return a.row.localeCompare(b.row);
      });

      let currentTarget = focusedSeat || sorted[sorted.length - 1]; // Start from focused or last
      // Verify current target is in list (might have been deselected)
      const idx = sorted.findIndex(s => s.row === currentTarget.row && s.seatNumber === currentTarget.seatNumber);

      let nextIdx = idx;
      if (idx === -1) {
        nextIdx = sorted.length - 1;
      } else {
        if (direction === 'next') {
          nextIdx = (idx + 1) % sorted.length; // Loop
        } else {
          nextIdx = (idx - 1 + sorted.length) % sorted.length; // Loop back
        }
      }
      setFocusedSeat(sorted[nextIdx]);
      return;
    }

    // 2. If SINGLE (or zero) seat selected: BEHAVIOR: Move selection (Explore)
    if (selectedSeats.length === 0) return;
    const active = selectedSeats[0];

    // Find current seat object to know row logic
    const currentRowIndex = seatRows.findIndex(r => r.letter === active.row);
    if (currentRowIndex === -1) return;

    const rowData = seatRows[currentRowIndex];
    const currentSeatIndex = rowData.seats.findIndex(s => s.number === active.seatNumber);

    let nextSeat = null;
    if (direction === 'next') {
      if (currentSeatIndex < rowData.seats.length - 1) {
        nextSeat = rowData.seats[currentSeatIndex + 1];
      }
    } else {
      if (currentSeatIndex > 0) {
        nextSeat = rowData.seats[currentSeatIndex - 1];
      }
    }

    if (nextSeat && nextSeat.available && !nextSeat.locked) {
      setSelectedSeats([{ row: active.row, seatNumber: nextSeat.number }]);
      setFocusedSeat(null); // Reset focus when moving selection
      setViewMode('POV');
    }
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (viewMode !== 'POV') return;
      if (e.key === 'ArrowRight') handleSeatNavigation('next');
      if (e.key === 'ArrowLeft') handleSeatNavigation('prev');
      if (e.key === 'Escape') setViewMode('AERIAL');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, selectedSeats, seatRows]);

  const handleSeatSelect = (row: string, seatNumber: number) => {
    setSelectedSeats((prev) => {
      const exists = prev.some((s) => s.row === row && s.seatNumber === seatNumber)
      if (exists) return prev
      return [...prev, { row, seatNumber }]
    })
    // Removed auto-POV switch as per user request
  }

  const handleSeatDeselect = (row: string, seatNumber: number) => {
    setSelectedSeats((prev) =>
      prev.filter((s) => !(s.row === row && s.seatNumber === seatNumber))
    )
  }

  const handleConfirm = async () => {
    if (!user) {
      router.push('/login')
      return
    }

    const seatingMode = seatData?.showtime?.room?.seatingMode || 'ASSIGNED';
    const isGeneral = seatingMode === 'GENERAL';

    if (!isGeneral && selectedSeats.length === 0) {
      addToast({ title: 'Elegí tus asientos', message: 'Seleccioná al menos un asiento para continuar.', variant: 'info' })
      return
    }

    try {
      let lock = null

      // Lock seats only if NOT general admission
      if (!isGeneral) {
        lock = await lockSeatsMutation.mutateAsync({
          showtimeId,
          seats: selectedSeats,
        })
      }

      // Reset cart and save selection
      clearCart()
      setTickets({
        movieId,
        showtimeId,
        showtime: showtimeData ?? null,
        seats: isGeneral ? [] : selectedSeats,
        ticketQuantity: isGeneral ? generalQuantity : selectedSeats.length,
        seatLock: lock
          ? {
            expiresAt: lock.expiresAt,
            locks: lock.locks,
          }
          : null,
      })

      // Navigate
      router.push('/confiteria')
    } catch (error: any) {
      addToast({
        title: 'No pudimos continuar',
        message: error?.response?.data?.error || error?.message || 'Reintentá en unos segundos.',
        variant: 'error',
        duration: 6500,
      })
    }
  }

  const handleRelock = async () => {
    if (!user) {
      router.push('/login')
      return
    }
    if (selectedSeats.length === 0) {
      addToast({ title: 'Sin asientos', message: 'Seleccioná asientos para reintentar la reserva.', variant: 'info' })
      return
    }
    try {
      const lock = await lockSeatsMutation.mutateAsync({
        showtimeId,
        seats: selectedSeats,
      })
      setTickets({
        movieId,
        showtimeId,
        showtime: showtimeData ?? null,
        seats: selectedSeats,
        seatLock: lock
          ? {
            expiresAt: lock.expiresAt,
            locks: lock.locks,
          }
          : null,
      })
      setExpiredModalOpen(false)
      addToast({ title: 'Reserva renovada', message: 'Listo. Seguís con tus asientos reservados.', variant: 'success' })
    } catch (error: any) {
      addToast({
        title: 'No pudimos reintentar la reserva',
        message: error?.response?.data?.error || error?.message || 'Probá seleccionar otros asientos.',
        variant: 'error',
        duration: 6500,
      })
    }
  }

  const handleContinue = () => {
    router.push('/confiteria')
  }

  const totalPrice = useMemo(() => {
    if (showtimeData?.room?.seatingMode === 'GENERAL') {
      return generalQuantity * 5000
    }
    return selectedSeats.length * 5000
  }, [showtimeData?.room?.seatingMode, generalQuantity, selectedSeats.length])

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
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold text-neutral-50 mb-1">
              {showtimeData?.movie?.title || 'Seleccionar Asientos'}
            </h1>
            {showtimeData && (
              <div className="flex items-center gap-3 mt-1">
                <span className={cn(
                  "px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border",
                  showtimeData.room?.name.toLowerCase().includes('amarilla')
                    ? "bg-yellow-500/20 border-yellow-500/50 text-yellow-200"
                    : "bg-red-500/20 border-red-500/50 text-red-200"
                )}>
                  {showtimeData.room?.name}
                </span>
                <span className="text-neutral-500">•</span>
                <span className="text-sm text-neutral-300 font-medium">
                  {new Date(showtimeData.startTime).toLocaleTimeString('es-AR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
                <span className="text-neutral-500">•</span>
                <span className="text-xs font-bold text-neutral-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-md uppercase">
                  {showtimeData.room?.seatingMode === 'GENERAL' ? 'General' : 'Numerada'}
                </span>
              </div>
            )}
          </div>
          <div className="w-20"></div>
        </div>

        {/* Content based on Seating Mode */}
        {/* Unified Seating Logic */

          isLoading ? (
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
          ) : (seatRows.length === 0 && showtimeData?.room?.seatingMode !== 'GENERAL') ? (
            <div className="py-10">
              <EmptyState
                title="No hay asientos disponibles"
                subtitle="Puede ser un problema temporal. Reintentá o volvé a la película."
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
                    <Button variant="ghost" onClick={() => router.push(`/pelicula/${movieId}`)}>
                      Volver a la película
                    </Button>
                  </div>
                }
              />
            </div>

          ) : (seatRows.length > 0 || showtimeData?.room?.seatingMode === 'GENERAL') ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                {/* GENERAL ADMISSION LOGIC */}
                {seatData?.showtime?.room?.seatingMode === 'GENERAL' ? (
                  <div className="h-[75vh] w-full rounded-3xl overflow-hidden border border-white/5 bg-black/20 relative flex flex-col">
                    {/* 3D Map (View Only) */}
                    <div className="flex-1 relative">
                      <SceneContainer className="h-full w-full" camera={{ position: [0, 8, 12], fov: 55 }}>
                        <ambientLight intensity={1.5} />
                        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
                        <SeatMap3D
                          rows={seatRows}
                          selectedSeats={[]}
                          onToggleSeat={() => { }} // No-op
                          roomName={showtimeData?.room?.name || ''}
                          viewMode="AERIAL"
                          seatingType="general"
                        />
                      </SceneContainer>
                      <div className="absolute inset-0 bg-black/20 pointer-events-none" /> {/* Overlay to dim interaction */}
                      <div className="absolute inset-0 bg-gradient-radial from-primary-500/10 via-transparent to-transparent pointer-events-none"></div>
                    </div>

                    {/* Quantity Selector Overlay - Premium Redesign */}
                    <div className="absolute inset-x-0 bottom-0 md:top-0 md:bg-black/40 md:backdrop-blur-sm flex flex-col items-center justify-end md:justify-center z-10 p-6 pointer-events-none">
                      <div className="pointer-events-auto bg-black/90 backdrop-blur-xl border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl shadow-black/50 overflow-hidden relative group">
                        {/* Decorative Glow */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-500/20 blur-[60px] rounded-full group-hover:bg-primary-500/30 transition-colors duration-500" />
                        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500/10 blur-[60px] rounded-full" />

                        <div className="flex items-center gap-4 mb-6 relative">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-white shadow-inner">
                            <Ticket className="w-6 h-6 text-primary-400" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-white tracking-tight">Entrada General</h3>
                            <p className="text-sm text-neutral-400 font-medium">Ubicación libre por orden de llegada</p>
                          </div>
                        </div>

                        <div className="space-y-6 relative">
                          <div className="flex items-center justify-between bg-white/5 rounded-2xl p-2 border border-white/5">
                            <button
                              onClick={() => setGeneralQuantity(Math.max(1, generalQuantity - 1))}
                              className="w-14 h-14 flex items-center justify-center rounded-xl bg-white/5 text-white hover:bg-white/10 active:scale-95 transition-all disabled:opacity-50"
                              disabled={generalQuantity <= 1}
                            >
                              <span className="text-2xl font-light">−</span>
                            </button>
                            <div className="flex flex-col items-center gap-1">
                              <span className="text-4xl font-bold text-white tabular-nums tracking-tighter">{generalQuantity}</span>
                              <span className="text-xs uppercase tracking-widest text-neutral-500 font-bold">Tickets</span>
                            </div>
                            <button
                              onClick={() => setGeneralQuantity(Math.min(10, generalQuantity + 1))}
                              className="w-14 h-14 flex items-center justify-center rounded-xl bg-white/10 text-white hover:bg-white/20 active:scale-95 transition-all shadow-lg shadow-white/5"
                            >
                              <span className="text-2xl font-light">+</span>
                            </button>
                          </div>

                          <div className="space-y-4 pt-2">
                            <div className="flex justify-between items-center text-sm px-2">
                              <span className="text-neutral-400">Precio unitario</span>
                              <span className="text-white font-medium">$5.000</span>
                            </div>

                            <div className="border-t border-white/10 pt-4 flex justify-between items-end px-2">
                              <span className="text-neutral-300 font-medium pb-1">Total a pagar</span>
                              <span className="text-3xl font-bold text-primary-400 bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-primary-200">
                                ${(generalQuantity * 5000).toLocaleString()}
                              </span>
                            </div>

                            {/* Mobile/Direct Action Button */}
                            <div className="pt-2">
                              <Button
                                onClick={handleConfirm}
                                className="w-full bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 shadow-lg shadow-primary-500/20"
                                size="lg"
                                isLoading={lockSeatsMutation.isPending}
                              >
                                Continuar
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* ASSIGNED SEATING LOGIC (Existing) */
                  <>
                    {ff('SEAT_TIMER', true) && timeLabel ? (
                      <Card className="mb-6 p-5" variant={isExpired ? 'outlined' : 'default'}>
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-500/15 border border-primary-500/25">
                              <ShieldCheck className="h-5 w-5 text-primary-300" aria-hidden="true" />
                            </span>
                            <div>
                              <p className="text-sm font-extrabold text-white">Reserva de asientos</p>
                              <p className="text-xs text-white/60">Tus asientos quedan guardados mientras avanzás.</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-extrabold tabular-nums',
                                isExpired ? 'border-error/40 bg-error/10 text-error' : 'border-warning/40 bg-warning/10 text-warning'
                              )}
                              role="status"
                              aria-live="polite"
                            >
                              <Clock className="h-4 w-4" aria-hidden="true" />
                              {isExpired ? 'Expirada' : timeLabel}
                            </div>

                            {isExpired ? (
                              <Button
                                size="sm"
                                variant="secondary"
                                leftIcon={<RefreshCcw className="h-4 w-4" />}
                                onClick={handleRelock}
                                isLoading={lockSeatsMutation.isPending}
                              >
                                Reintentar
                              </Button>
                            ) : (
                              <Button size="sm" variant="secondary" onClick={handleContinue}>
                                Continuar
                              </Button>
                            )}
                          </div>
                        </div>
                      </Card>
                    ) : null}

                    <div className="h-[75vh] w-full rounded-3xl overflow-hidden border border-white/5 bg-black/20 relative">
                      <SceneContainer className="h-full w-full" camera={{ position: [0, 8, 12], fov: 55 }}>
                        <ambientLight intensity={0.5} />
                        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                        <SeatMap3D
                          rows={seatRows}
                          selectedSeats={selectedSeats}
                          onToggleSeat={(row, seatNumber) => {
                            const isSelected = selectedSeats.some(s => s.row === row && s.seatNumber === seatNumber);
                            if (isSelected) {
                              handleSeatDeselect(row, seatNumber);
                            } else {
                              handleSeatSelect(row, seatNumber);
                            }
                          }}
                          roomName={showtimeData?.room?.name || ''}
                          viewMode={viewMode}
                          focusedSeat={focusedSeat}
                          seatingType="assigned"
                        />
                      </SceneContainer>

                      {/* Navigation Overlay (POV Mode) */}
                      {viewMode === 'POV' && (
                        <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-4">
                          {/* Top Controls */}
                          <div className="flex justify-end pointer-events-auto">
                            <button
                              onClick={() => setViewMode('AERIAL')}
                              className="bg-black/60 backdrop-blur-md text-white rounded-full px-4 py-2 text-sm font-bold border border-white/10 hover:bg-white/10 transition-all flex items-center gap-2"
                            >
                              <RefreshCcw className="w-4 h-4" />
                              Vista Aérea
                            </button>
                          </div>

                          {/* Side Arrows */}
                          <div className="absolute top-1/2 left-4 -translate-y-1/2 pointer-events-auto">
                            <button
                              onClick={() => handleSeatNavigation('prev')}
                              className="bg-black/40 backdrop-blur-md p-3 rounded-full text-white/70 hover:text-white hover:bg-white/20 transition-all"
                            >
                              <ArrowLeft className="w-6 h-6" />
                            </button>
                          </div>
                          <div className="absolute top-1/2 right-4 -translate-y-1/2 pointer-events-auto">
                            <button
                              onClick={() => handleSeatNavigation('next')}
                              className="bg-black/40 backdrop-blur-md p-3 rounded-full text-white/70 hover:text-white hover:bg-white/20 transition-all"
                            >
                              <ArrowLeft className="w-6 h-6 rotate-180" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Manual Toggle to Enter POV (Aerial Mode) */}
                      {viewMode === 'AERIAL' && selectedSeats.length > 0 && (
                        <div className="absolute top-4 right-4 z-20 pointer-events-auto">
                          <button
                            onClick={() => setViewMode('POV')}
                            className="bg-white/10 backdrop-blur-md text-white rounded-full px-4 py-2 text-sm font-bold border border-white/20 hover:bg-white/20 transition-all flex items-center gap-2 shadow-lg"
                          >
                            <ShieldCheck className="w-4 h-4" />
                            Ver desde butaca
                          </button>
                        </div>
                      )}

                      {/* Legend Overlay */}
                      <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-6 pointer-events-none z-10 transition-opacity duration-300" style={{ opacity: viewMode === 'POV' ? 0 : 1 }}>
                        <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                          <div className="w-4 h-4 rounded-md bg-[#5a5252] border border-white/20"></div>
                          <span className="text-xs font-bold text-white/80">Disponible</span>
                        </div>
                        <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                          <div className="w-4 h-4 rounded-md bg-[#ee4b2b] border border-white/20 shadow-glow-primary-sm"></div>
                          <span className="text-xs font-bold text-white/80">Seleccionado</span>
                        </div>
                        <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                          <div className="w-4 h-4 rounded-md bg-[#3d3736] border border-white/10 opacity-50"></div>
                          <span className="text-xs font-bold text-white/40">Ocupado</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Summary */}
              <div className="lg:col-span-1">
                <Card className="p-6 sticky top-24" variant="default">
                  <h2 className="text-xl font-extrabold text-white mb-4 tracking-tight">Resumen</h2>
                  {seatData?.showtime?.room?.seatingMode === 'GENERAL' ? (
                    <div className="space-y-4 mb-6">
                      <div>
                        <p className="text-sm text-neutral-300 mb-2">Entradas Generales:</p>
                        <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/10">
                          <span className="text-white font-bold text-lg">{generalQuantity} x $5.000</span>
                        </div>
                      </div>
                      <div className="border-t border-neutral-700 pt-4">
                        <div className="flex justify-between text-lg font-bold text-neutral-50">
                          <span>Total</span>
                          <span>${(generalQuantity * 5000).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
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
                  )}

                  <Button
                    onClick={handleConfirm}
                    disabled={seatData?.showtime?.room?.seatingMode !== 'GENERAL' ? (selectedSeats.length === 0 || lockSeatsMutation.isPending) : generalQuantity < 1}
                    isLoading={lockSeatsMutation.isPending}
                    size="lg"
                    className="w-full"
                    leftIcon={<Check className="h-5 w-5" />}
                  >
                    Continuar a Confitería
                  </Button>
                </Card>
              </div>
            </div>
          ) : (

            <div className="py-10">
              <EmptyState
                title="No se pudieron cargar los asientos"
                subtitle="Reintentá y, si el problema persiste, volvé a intentar más tarde."
                action={
                  <Button variant="secondary" onClick={() => refetch()} isLoading={isFetching}>
                    Reintentar
                  </Button>
                }
              />
            </div>
          )
        }
      </div>

      <Modal
        open={ff('SEAT_TIMER', true) && expiredModalOpen}
        onOpenChange={setExpiredModalOpen}
        title="Tu reserva expiró"
        description="Los asientos se liberaron automáticamente. Podés reintentar la reserva o elegir otros asientos."
      >
        <div className="flex flex-wrap items-center gap-2">
          {selectedSeats.slice(0, 6).map((s) => (
            <span
              key={`${s.row}-${s.seatNumber}`}
              className="inline-flex items-center rounded-2xl border border-white/10 bg-white/5 px-3 py-1 text-xs font-extrabold text-white"
            >
              {s.row}
              {s.seatNumber}
            </span>
          ))}
          {selectedSeats.length > 6 ? (
            <span className="text-xs font-bold text-white/60">+{selectedSeats.length - 6}</span>
          ) : null}
        </div>
        footer={
          <div className="flex flex-wrap gap-3 justify-end">
            <Button variant="secondary" onClick={() => setExpiredModalOpen(false)}>
              Elegir otros
            </Button>
            <Button
              onClick={handleRelock}
              leftIcon={<RefreshCcw className="h-4 w-4" />}
              isLoading={lockSeatsMutation.isPending}
            >
              Reintentar reserva
            </Button>
          </div>
        }
      </Modal>
    </div >
  )
}
