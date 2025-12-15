'use client'

import { X, CheckCircle, Clock, ExternalLink, QrCode } from 'lucide-react'
import { Order } from '@/lib/types/order'

interface PosCheckoutModalProps {
  order: Order | null
  isOpen: boolean
  onClose: () => void
  onPrint?: () => void
  onSimulatePayment?: (orderId: string) => void
}

export function PosCheckoutModal({ order, isOpen, onClose, onPrint, onSimulatePayment }: PosCheckoutModalProps) {
  if (!isOpen || !order) return null

  const isPaid = order.status === 'PAID'
  const isPending = order.status === 'PENDING'

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="glass-card w-full max-w-md border border-white/10 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        {/* Decorative Background */}
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-2 relative z-10">
          <h2 className="text-2xl font-bold text-white">
            {isPaid ? 'Venta Exitosa' : 'Confirmar Orden'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 relative z-10 overflow-y-auto custom-scrollbar">
          {isPaid ? (
            <div className="text-center py-6">
              <div className="w-24 h-24 mx-auto bg-green-500/20 rounded-full flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                <CheckCircle className="w-12 h-12 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">¡Todo listo!</h3>
              <p className="text-white/60">
                La venta se completó exitosamente.<br />
                Total cobrado: <strong className="text-white">${order.total.toLocaleString()}</strong>
              </p>
            </div>
          ) : (
            <>
              {!isPending && (
                <div className="text-center py-4">
                  <div className="w-16 h-16 mx-auto bg-orange-500/20 rounded-full flex items-center justify-center mb-4">
                    <Clock className="w-8 h-8 text-orange-400" />
                  </div>
                  <p className="text-white/60">Orden creada. Esperando pago...</p>
                </div>
              )}

              {isPending && (
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10 mb-6 text-center">
                  <p className="text-xs text-white/50 uppercase tracking-widest font-bold mb-4">Escaneá para Pagar</p>

                  <div className="bg-white p-4 rounded-xl inline-block shadow-lg mb-4">
                    {order?.payment?.qrCodeBase64 ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={`data:image/png;base64,${order.payment.qrCodeBase64}`}
                        alt="ID"
                        className="w-48 h-48 object-contain"
                      />
                    ) : order?.payment?.qrCode ? (
                      <div className="w-48 h-48 flex items-center justify-center">
                        <QrCode className="w-32 h-32 text-black" />
                      </div>
                    ) : (
                      <div className="w-48 h-48 flex items-center justify-center bg-gray-100 rounded-lg">
                        <p className="text-xs text-gray-400">QR no disponible</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-center gap-2">
                    <span className="text-2xl font-bold text-white">${order.total.toLocaleString()}</span>
                    <span className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-300 font-bold">Mercado Pago</span>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Order Details Mini */}
          <div className="bg-black/20 rounded-xl p-4 space-y-3">
            <div className="flex justify-between text-sm border-b border-white/5 pb-2">
              <span className="text-white/50">Orden ID</span>
              <span className="text-white font-mono opacity-80">{order.id.slice(0, 8)}...</span>
            </div>
            {order.items && (
              <div className="space-y-1">
                {order.items.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="flex justify-between text-xs text-white/60">
                    <span>
                      {item.type === 'ticket' ? `Entrada (Fila ${item.row})` : 'Producto'}
                    </span>
                    <span>x{item.quantity || 1}</span>
                  </div>
                ))}
                {order.items.length > 3 && (
                  <p className="text-xs text-white/30 italic">+{order.items.length - 3} items más...</p>
                )}
              </div>
            )}
            <div className="flex justify-between text-sm font-bold text-white pt-1">
              <span>Total</span>
              <span>${order.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 pt-2 bg-black/20 relative z-10 flex gap-3">
          {isPending && onSimulatePayment && (
            <button
              onClick={() => onSimulatePayment(order.id)}
              className="flex-1 py-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg shadow-lg shadow-orange-500/20 transition-all active:scale-95"
            >
              Simular Pago
            </button>
          )}

          {(isPaid || !onSimulatePayment) && (
            <>
              {onPrint && isPaid && (
                <button
                  onClick={onPrint}
                  className="flex-1 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all border border-white/5 hover:border-white/20"
                >
                  Imprimir Ticket
                </button>
              )}
              <button
                onClick={onClose}
                className={`flex-1 py-4 rounded-xl font-bold transition-all active:scale-95 ${isPaid
                    ? 'bg-primary hover:bg-primary-600 text-white shadow-glow-primary'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
              >
                {isPaid ? 'Nueva Venta' : 'Cerrar'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

