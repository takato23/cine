'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Clock, ExternalLink, QrCode, RefreshCcw, ShieldCheck, Ticket, ShoppingBag, AlertTriangle, CheckCircle } from 'lucide-react'

import { useAuthStore } from '@/lib/store'
import { useCheckoutStore } from '@/lib/store/checkout'
import { useCreateOrder, useOrder } from '@/lib/queries/orders'
import type { CreateOrderResponse, OrderItemInput } from '@/lib/types'
import { api } from '@/lib/api'

import { Stepper } from '@/components/ui/Stepper'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { EmptyState, ErrorState, LoadingState } from '@/components/ui/states'
import SceneContainer from '@/components/canvas/SceneContainer'
import { Ticket3D } from '@/components/canvas/Ticket3D'
import { Confetti3D } from '@/components/canvas/Confetti3D'

function formatMoneyARS(amount: number) {
  return amount.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })
}

function formatTimeLeft(totalSeconds: number) {
  const s = Math.max(0, totalSeconds)
  const minutes = Math.floor(s / 60)
  const seconds = s % 60
  return { minutes, seconds }
}

export default function CheckoutPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const {
    showtimeId,
    seats,
    cart,
    seatLock,
    orderId,
    setOrderId,
    reset,
  } = useCheckoutStore()

  const [uiError, setUiError] = useState<string | null>(null)
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])

  const createOrderMutation = useCreateOrder()
  const orderQuery = useOrder(orderId ?? undefined)
  const order = orderQuery.data

  const expiresAtMs = useMemo(() => {
    const iso = order?.expiresAt ?? seatLock?.expiresAt ?? null
    if (!iso) return null
    const ms = new Date(iso).getTime()
    return Number.isFinite(ms) ? ms : null
  }, [order?.expiresAt, seatLock?.expiresAt])

  const timeLeftSeconds = useMemo(() => {
    if (!expiresAtMs) return 15 * 60
    return Math.max(0, Math.floor((expiresAtMs - now) / 1000))
  }, [expiresAtMs, now])

  const { minutes, seconds } = formatTimeLeft(timeLeftSeconds)

  const ticketItemsCount = seats.length
  const ticketsTotal = ticketItemsCount * 5000 // TODO: pricing rules real
  const productsTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const serviceFee = (ticketsTotal + productsTotal) * 0.05
  const total = ticketsTotal + productsTotal + serviceFee

  const paymentStatus = order?.payment?.status ?? null
  const orderStatus = order?.status ?? null
  const isPaid = orderStatus === 'PAID' || paymentStatus === 'APPROVED'
  const isExpired = orderStatus === 'EXPIRED' || timeLeftSeconds === 0

  const canCreateOrder = ticketItemsCount > 0 || cart.length > 0

  const handleCreateOrder = async () => {
    setUiError(null)
    if (!user) return

    const items: OrderItemInput[] = []

    if (showtimeId && seats.length > 0) {
      seats.forEach((seat) => {
        items.push({
          type: 'ticket',
          showtimeId,
          row: seat.row,
          seatNumber: seat.seatNumber,
          quantity: 1,
        })
      })
    }

    cart.forEach((item) => {
      items.push({
        type: 'product',
        productId: item.product.id,
        quantity: item.quantity,
      })
    })

    if (items.length === 0) {
      setUiError('Tu carrito está vacío. Volvé atrás para seleccionar entradas o productos.')
      return
    }

    try {
      const data = (await createOrderMutation.mutateAsync({
        items,
        channel: 'web',
      })) as CreateOrderResponse

      const newOrderId = data.order.id
      setOrderId(newOrderId)
    } catch (e: any) {
      setUiError(e?.response?.data?.error || e?.message || 'No se pudo crear la orden')
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[url('/images/noise.png')] bg-fixed flex items-center justify-center">
        <main className="container mx-auto px-4 max-w-lg">
          <Card className="p-8 backdrop-blur-xl bg-black/60 border-white/10" variant="glow">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary-500/10 flex items-center justify-center text-primary-400">
                <AlertTriangle className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-bold text-white">Iniciá sesión</h2>
              <p className="text-white/60">Necesitamos tu cuenta para asociar la compra y guardar tus entradas de forma segura.</p>
              <div className="flex gap-3 w-full pt-4">
                <Link href="/login" className="flex-1">
                  <Button className="w-full">Iniciar sesión</Button>
                </Link>
                <Link href="/cartelera" className="flex-1">
                  <Button variant="secondary" className="w-full">Volver</Button>
                </Link>
              </div>
            </div>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[url('/images/noise.png')] bg-fixed opacity-100">

      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-primary-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[120px]" />
      </div>

      <main className="container mx-auto px-4 py-8 max-w-6xl relative z-10">
        <header className="flex items-center justify-between gap-3 mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white/50 hover:text-white transition-colors hover:bg-white/5 rounded-xl px-3 py-2"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-semibold text-sm uppercase tracking-wide">Volver</span>
          </button>

          <div className="hidden md:block w-96">
            <Stepper
              steps={[
                { key: 'tickets', label: 'Entradas' },
                { key: 'snacks', label: 'Confitería' },
                { key: 'pay', label: 'Checkout' },
              ]}
              activeKey="pay"
            />
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white/70">
            <ShieldCheck className="h-3 w-3 text-green-400" />
            SECURE CHECKOUT
          </div>
        </header>

        <div className="mt-6">
          {!canCreateOrder ? (
            <div className="max-w-xl mx-auto">
              <EmptyState
                title="Carrito vacío"
                subtitle="Parece que no seleccionaste nada aún. ¡El show está por comenzar!"
                action={
                  <div className="flex gap-3">
                    <Link href="/cartelera">
                      <Button>Ver cartelera</Button>
                    </Link>
                    <Link href="/confiteria">
                      <Button variant="secondary">Ir a confitería</Button>
                    </Link>
                  </div>
                }
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

              {/* LEFT COLUMN: Summary & Timer */}
              <div className="lg:col-span-7 space-y-6">

                {/* Timer Card */}
                <div className="rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl p-1 overflow-hidden relative shadow-2xl">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-500/50 to-transparent opacity-50" />
                  <div className="p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5">
                        <Clock className={`h-6 w-6 ${timeLeftSeconds < 180 ? 'text-red-500 animate-pulse' : 'text-primary-400'}`} />
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-lg leading-tight">Tiempo Restante</h3>
                        <p className="text-white/50 text-sm">Para completar tu compra</p>
                      </div>
                    </div>

                    <div className="flex gap-2 font-mono">
                      <div className="flex flex-col items-center">
                        <div className={`text-4xl font-black tabular-nums tracking-widest ${timeLeftSeconds < 60 ? 'text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'text-white'}`}>
                          {minutes.toString().padStart(2, '0')}
                        </div>
                        <span className="text-[10px] text-white/30 uppercase tracking-widest">MIN</span>
                      </div>
                      <div className="text-4xl font-black text-white/20 animate-pulse">:</div>
                      <div className="flex flex-col items-center">
                        <div className={`text-4xl font-black tabular-nums tracking-widest ${timeLeftSeconds < 30 ? 'text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'text-primary-300'}`}>
                          {seconds.toString().padStart(2, '0')}
                        </div>
                        <span className="text-[10px] text-white/30 uppercase tracking-widest">SEC</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Summary Card with 3D Ticket */}
                <Card className="p-0 overflow-hidden bg-black/40 border-white/10 backdrop-blur-md" variant="glow">
                  <div className="h-56 w-full bg-gradient-to-b from-black/20 to-transparent relative">
                    <SceneContainer className="h-full w-full" camera={{ position: [0, 0, 5], fov: 40 }}>
                      <ambientLight intensity={0.5} />
                      <pointLight position={[10, 10, 10]} intensity={1} />
                      <Ticket3D quantity={ticketItemsCount} price={total} validated={isPaid} />
                      {isPaid && <Confetti3D count={150} />}
                    </SceneContainer>
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-6">
                      <h3 className="text-2xl font-black text-white">Resumen de Orden</h3>
                      <p className="text-white/60 text-sm">Revisá tus items antes de pagar</p>
                    </div>
                  </div>

                  <div className="p-6 mt-2 space-y-4">
                    {ticketItemsCount > 0 && (
                      <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary-500/20 text-primary-400">
                            <Ticket className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-white font-bold">{ticketItemsCount}x Entradas</p>
                            <p className="text-white/40 text-xs">Butacas {seats.map(s => `${s.row}${s.seatNumber}`).join(', ')}</p>
                          </div>
                        </div>
                        <span className="text-white font-mono font-bold">{formatMoneyARS(ticketsTotal)}</span>
                      </div>
                    )}

                    {cart.map((item) => (
                      <div key={item.product.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-orange-500/20 text-orange-400">
                            <ShoppingBag className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-white font-bold">{item.quantity}x {item.product.name}</p>
                            <p className="text-white/40 text-xs">Confitería</p>
                          </div>
                        </div>
                        <span className="text-white font-mono font-bold">{formatMoneyARS(item.product.price * item.quantity)}</span>
                      </div>
                    ))}

                    <div className="h-px bg-white/10 my-4" />

                    <div className="flex justify-between items-center text-sm text-white/50">
                      <span>Subtotal</span>
                      <span>{formatMoneyARS(ticketsTotal + productsTotal)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-white/50">
                      <span>Cargo por servicio (5%)</span>
                      <span>{formatMoneyARS(serviceFee)}</span>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <span className="text-xl font-bold text-white">Total</span>
                      <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-white">{formatMoneyARS(total)}</span>
                    </div>
                  </div>
                </Card>
              </div>

              {/* RIGHT COLUMN: Payment Actions */}
              <div className="lg:col-span-5 space-y-6">
                <Card className="p-8 bg-black/60 backdrop-blur-xl border-white/10 shadow-[0_0_50px_-20px_rgba(238,75,43,0.2)] sticky top-24" variant="glow">
                  <div className="mb-8 text-center">
                    <h2 className="text-2xl font-black text-white mb-2">Completar Pago</h2>
                    <p className="text-white/50 text-sm">Escaneá el QR para finalizar tu compra al instante.</p>
                  </div>

                  <div className="flex flex-col items-center justify-center">
                    {/* QR Container with Neon Glow */}
                    <div className="relative group perspective-1000">
                      <div className={`absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary-500 to-purple-600 opacity-75 blur-lg transition duration-1000 group-hover:duration-200 ${orderId ? 'animate-pulse' : ''}`}></div>
                      <div className="relative w-64 h-64 bg-white rounded-xl flex items-center justify-center overflow-hidden border-4 border-black">

                        {/* Scanning Line Effect */}
                        {orderId && !isPaid && !isExpired && (
                          <div className="absolute inset-0 pointer-events-none z-20">
                            <div className="h-1 w-full bg-primary-500 shadow-[0_0_15px_rgba(238,75,43,1)] animate-[scan_2s_ease-in-out_infinite]" />
                          </div>
                        )}

                        {!orderId ? (
                          <div className="flex flex-col items-center text-center p-6 text-black/40">
                            <QrCode className="h-16 w-16 mb-4 opacity-50" />
                            <p className="text-sm font-medium">El código QR aparecerá aquí</p>
                          </div>
                        ) : orderQuery.isLoading ? (
                          <LoadingState title="" subtitle="Generando..." />
                        ) : orderQuery.isError ? (
                          <p className="text-red-500 text-sm font-bold px-4 text-center">Error al cargar QR</p>
                        ) : order?.payment?.qrCodeBase64 ? (
                          <img
                            src={`data:image/png;base64,${order.payment.qrCodeBase64}`}
                            alt="QR Pago"
                            className="w-full h-full object-contain p-2"
                          />
                        ) : (
                          <p className="text-black text-sm">QR no disponible</p>
                        )}

                        {/* Success Overlay */}
                        {isPaid && (
                          <div className="absolute inset-0 z-30 bg-green-500/90 flex flex-col items-center justify-center text-white animate-in fade-in zoom-in duration-300">
                            <CheckCircle className="h-16 w-16 mb-2 drop-shadow-md" />
                            <p className="font-black text-xl">¡Pago Exitoso!</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 space-y-3">
                    {/* Action Buttons */}
                    <Button
                      onClick={handleCreateOrder}
                      disabled={createOrderMutation.isPending || !!orderId || isExpired}
                      className={`w-full h-14 text-lg font-bold shadow-lg ${orderId ? 'bg-zinc-800 text-zinc-400 hover:bg-zinc-800 cursor-not-allowed' : 'bg-white text-black hover:bg-zinc-200 shadow-white/20'}`}
                    >
                      {createOrderMutation.isPending ? 'Generando...' : orderId ? 'Escaneá el código arriba' : 'Generar Código de Pago'}
                    </Button>

                    {orderId && !isPaid && (
                      <Button
                        onClick={() => orderQuery.refetch()}
                        className="w-full border-white/10 hover:bg-white/5"
                        variant="ghost"
                      >
                        <RefreshCcw className="h-4 w-4 mr-2" /> Actualizar Estado
                      </Button>
                    )}

                    {order?.payment?.qrCode && (
                      <a
                        href={order.payment.qrCode}
                        target="_blank"
                        rel="noreferrer"
                        className="block w-full"
                      >
                        <Button variant="secondary" className="w-full">
                          <ExternalLink className="h-4 w-4 mr-2" /> Abrir App de Pago
                        </Button>
                      </a>
                    )}
                  </div>

                  {/* Dev Helper */}
                  {process.env.NODE_ENV !== 'production' && order?.payment?.id && !isPaid && (
                    <div className="mt-6 pt-6 border-t border-white/10">
                      <p className="text-xs text-center text-white/30 mb-2 uppercase tracking-widest font-bold">Modo Desarrollo</p>
                      <Button
                        variant="outline"
                        className="w-full border-green-500/30 text-green-500 hover:bg-green-500/10 hover:text-green-400"
                        onClick={async () => {
                          try {
                            await api.post('/payments/mp/webhook', { paymentId: order.payment!.id })
                            await orderQuery.refetch()
                            // Redirect to success after a brief delay to show the success state on card
                            setTimeout(() => {
                              router.push('/checkout/success')
                            }, 1500)
                          } catch { }
                        }}
                      >
                        Simular Pago Exitoso
                      </Button>
                    </div>
                  )}

                  {uiError && (
                    <div className="mt-4 p-4 rounded-xl bg-red-500/20 border border-red-500/30 text-red-200 text-sm text-center">
                      {uiError}
                    </div>
                  )}

                </Card>

                <div className="text-center">
                  <Button
                    variant="ghost"
                    className="text-white/40 hover:text-white"
                    onClick={() => {
                      reset()
                      setUiError(null)
                      router.push('/cartelera')
                    }}
                  >
                    Cancelar y volver al inicio
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
