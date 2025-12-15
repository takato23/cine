'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/lib/store'
import { usePosStore } from '@/lib/store/pos'
import { PosLayout } from '@/components/pos/PosLayout'
import { PosProductGrid } from '@/components/pos/PosProductGrid'
import { PosTicketPanel } from '@/components/pos/PosTicketPanel'
import { PosCart } from '@/components/pos/PosCart'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useRouter } from 'next/navigation'
import { PosCheckoutModal } from '@/components/pos/PosCheckoutModal'
import { useState } from 'react'
import { Order } from '@/lib/types/order'
import type { CreateOrderResponse } from '@/lib/types'
import { useToast } from '@/components/ui/Toast'
import { ErrorState } from '@/components/ui/states'
import Link from 'next/link'

export default function POSPage() {
  const { isStaff } = useAuthStore()
  const { mode, setMode, products, ticketDraft, clearCart, getTotal } = usePosStore()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [checkoutOrder, setCheckoutOrder] = useState<Order | null>(null)
  const [showCheckoutModal, setShowCheckoutModal] = useState(false)
  const { addToast } = useToast()

  const simulatePaymentMutation = useMutation({
    mutationFn: async (orderId: string) => {
      // En modo mock, simular webhook de pago
      const res = await api.post('/payments/mp/webhook', { paymentId: orderId })
      return res.data
    },
    onSuccess: (_, orderId) => {
      // Refrescar orden
      queryClient.invalidateQueries({ queryKey: ['orders', orderId] })
      // Actualizar orden local
      if (checkoutOrder) {
        setCheckoutOrder({ ...checkoutOrder, status: 'PAID' })
      }
    },
  })

  // Hotkeys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Esc para limpiar
      if (e.key === 'Escape' && (!e.target || (e.target as HTMLElement).tagName !== 'INPUT')) {
        if (confirm('¿Limpiar carrito?')) {
          clearCart()
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [clearCart])

  const createOrderMutation = useMutation({
    mutationFn: async () => {
      const items: Array<{
        type: 'ticket' | 'product'
        showtimeId?: string
        productId?: string
        row?: string
        seatNumber?: number
        quantity?: number
      }> = []

      // Agregar tickets
      if (ticketDraft && ticketDraft.seats.length > 0) {
        ticketDraft.seats.forEach((seat) => {
          items.push({
            type: 'ticket',
            showtimeId: ticketDraft.showtimeId,
            row: seat.row,
            seatNumber: seat.seatNumber,
            quantity: 1,
          })
        })
      }

      // Agregar productos
      products.forEach((item) => {
        items.push({
          type: 'product',
          productId: item.product.id,
          quantity: item.quantity,
        })
      })

      const res = await api.post('/orders', { items, channel: 'pos' })
      return res.data
    },
    onSuccess: (data: CreateOrderResponse) => {
      // Adjuntamos snapshot de payment para poder mostrar QR en el modal
      setCheckoutOrder({
        ...data.order,
        payment: {
          id: data.payment.id,
          status: 'PENDING',
          method: 'mercadopago',
          qrCode: data.payment.qrCodeUrl ?? null,
          qrCodeBase64: data.payment.qrCode ?? null,
          expiresAt: data.payment.expiresAt ?? null,
        },
      })
      setShowCheckoutModal(true)
      clearCart()
    },
    onError: (error: any) => {
      addToast({
        title: 'No pudimos cobrar',
        message: error?.response?.data?.error || error?.message || 'Reintentá en unos segundos.',
        variant: 'error',
        duration: 6500,
        action: {
          label: 'Reintentar',
          onClick: () => createOrderMutation.mutate(),
        },
      })
    },
  })

  const handleCheckout = () => {
    if (getTotal() === 0) {
      addToast({ title: 'Carrito vacío', message: 'Agregá productos o entradas para cobrar.', variant: 'info' })
      return
    }
    if (confirm(`¿Confirmar venta por $${getTotal().toLocaleString()}?`)) {
      createOrderMutation.mutate()
    }
  }

  if (!isStaff()) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="w-full max-w-lg px-4">
          <ErrorState
            title="Acceso denegado"
            subtitle="Solo personal autorizado puede acceder al POS."
            onRetry={() => router.push('/login')}
            retryLabel="Iniciar sesión"
          />
          <div className="mt-4 flex justify-center">
            <Link href="/">
              <span className="text-sm font-semibold text-white/60 hover:text-white transition-colors">Volver al sitio</span>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <PosLayout mode={mode} onModeChange={setMode}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Products or Tickets */}
        <div className="lg:col-span-2 space-y-6">
          {mode === 'products' && <PosProductGrid />}
          {mode === 'tickets' && <PosTicketPanel />}
        </div>

        {/* Right Column: Cart (Desktop) */}
        <div className="hidden lg:block">
          <PosCart />
        </div>
      </div>

      {/* Bottom Cart (Mobile) */}
      {mode === 'checkout' && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-bg-secondary border-t border-neutral-800 p-4 z-50">
          <PosCart />
        </div>
      )}

      {/* Checkout Button (Sticky Bottom) */}
      {getTotal() > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-primary-500 text-white p-4 z-50 lg:hidden shadow-2xl">
          <div className="container mx-auto flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total</p>
              <p className="text-2xl font-bold">${getTotal().toLocaleString()}</p>
            </div>
            <button
              onClick={handleCheckout}
              disabled={createOrderMutation.isPending}
              className="bg-white text-primary-500 px-8 py-3 rounded-lg font-bold transition-all duration-fast ease-out hover:bg-neutral-100 hover:shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              {createOrderMutation.isPending ? 'Procesando...' : 'Cobrar'}
            </button>
          </div>
        </div>
      )}

      {/* Desktop Checkout Button */}
      {getTotal() > 0 && (
        <div className="hidden lg:block fixed bottom-6 right-6 z-50">
          <button
            onClick={handleCheckout}
            disabled={createOrderMutation.isPending}
            className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-lg font-bold text-lg shadow-xl transition-all duration-fast ease-out hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/30"
          >
            {createOrderMutation.isPending ? 'Procesando...' : `Cobrar $${getTotal().toLocaleString()}`}
          </button>
        </div>
      )}

      {/* Checkout Modal */}
      <PosCheckoutModal
        order={checkoutOrder}
        isOpen={showCheckoutModal}
        onClose={() => {
          setShowCheckoutModal(false)
          setCheckoutOrder(null)
        }}
        onPrint={() => {
          // TODO: implementar impresión
          window.print()
        }}
        onSimulatePayment={(orderId) => {
          simulatePaymentMutation.mutate(orderId)
        }}
      />
    </PosLayout>
  )
}
