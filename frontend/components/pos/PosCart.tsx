'use client'

import { usePosStore } from '@/lib/store/pos'
import { ShoppingCart, Plus, Minus, Trash2, X, Ticket } from 'lucide-react'

export function PosCart() {
  const {
    products,
    ticketDraft,
    clearCart,
    removeProduct,
    updateProductQuantity,
    getProductsTotal,
    getTicketsTotal,
    getTotal,
  } = usePosStore()

  const productsTotal = getProductsTotal()
  const ticketsTotal = getTicketsTotal()
  const total = getTotal()

  const hasItems = products.length > 0 || (ticketDraft && ticketDraft.seats.length > 0)

  return (
    <div className="glass-panel rounded-3xl p-6 sticky top-24 h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
            <ShoppingCart className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white leading-none">Carrito</h2>
            {hasItems && (
              <p className="text-xs text-white/40 mt-1">{products.length + (ticketDraft?.seats.length || 0)} items</p>
            )}
          </div>
        </div>
        {hasItems && (
          <button
            onClick={clearCart}
            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-red-500/20 text-white/50 hover:text-red-400 transition-colors flex items-center justify-center"
            aria-label="Limpiar carrito"
            title="Limpiar carrito"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-6 custom-scrollbar pr-2">
        {!hasItems ? (
          <div className="text-center py-12 flex flex-col items-center">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
              <ShoppingCart className="w-8 h-8 text-white/20" />
            </div>
            <p className="text-white/40 text-lg">Tu carrito está vacío</p>
            <p className="text-xs text-white/20 mt-1">Agregá productos o entradas</p>
          </div>
        ) : (
          <>
            {/* Tickets */}
            {ticketDraft && ticketDraft.seats.length > 0 && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 relative group">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                    <Ticket className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">
                      {ticketDraft.showtime.movie?.title ?? 'Entradas'}
                    </h3>
                    <p className="text-xs text-white/50">
                      {(ticketDraft.showtime.room?.name ?? 'Sala')} • {new Date(ticketDraft.showtime.startTime).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 bg-black/20 rounded-xl p-3 mb-3">
                  {ticketDraft.seats.map((seat, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <span className="text-white/70 font-mono">
                        {seat.row}{seat.seatNumber}
                      </span>
                      <span className="text-white font-medium">$5.000</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-end">
                  <span className="text-xs text-white/40 uppercase tracking-wider font-bold">Subtotal</span>
                  <span className="text-lg font-bold text-white">
                    ${ticketsTotal.toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            {/* Products */}
            {products.map((item) => (
              <div
                key={item.product.id}
                className="bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-2xl p-4 transition-colors group"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="font-bold text-white text-sm mb-1 line-clamp-2">
                      {item.product.name}
                    </h3>
                    <p className="text-xs text-white/50">
                      ${item.product.price.toLocaleString()} c/u
                    </p>
                  </div>
                  <button
                    onClick={() => removeProduct(item.product.id)}
                    className="text-white/20 hover:text-red-400 transition-colors p-1"
                    aria-label="Eliminar producto"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between bg-black/20 rounded-xl p-2">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => updateProductQuantity(item.product.id, item.quantity - 1)}
                      className="w-8 h-8 bg-white/5 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
                      aria-label="Disminuir cantidad"
                    >
                      <Minus className="w-3 h-3 text-white" />
                    </button>
                    <span className="text-white font-bold w-10 text-center text-sm">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateProductQuantity(item.product.id, item.quantity + 1)}
                      className="w-8 h-8 bg-white/5 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
                      aria-label="Aumentar cantidad"
                    >
                      <Plus className="w-3 h-3 text-white" />
                    </button>
                  </div>
                  <p className="text-white font-bold">
                    ${(item.product.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Totals & Actions */}
      {hasItems && (
        <div className="flex-shrink-0 pt-4 border-t border-white/10 space-y-3">
          {(productsTotal > 0 || ticketsTotal > 0) && (
            <div className="space-y-1 mb-2">
              {productsTotal > 0 && (
                <div className="flex justify-between text-xs text-white/50">
                  <span>Productos</span>
                  <span>${productsTotal.toLocaleString()}</span>
                </div>
              )}
              {ticketsTotal > 0 && (
                <div className="flex justify-between text-xs text-white/50">
                  <span>Entradas</span>
                  <span>${ticketsTotal.toLocaleString()}</span>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-between items-end">
            <div>
              <span className="text-xs text-white/40 uppercase tracking-wider font-bold">Total a Pagar</span>
            </div>
            <span className="text-3xl font-bold text-white">
              ${total.toLocaleString()}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
