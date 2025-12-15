'use client'

import { ReactNode } from 'react'
import { Popcorn, Ticket, Wallet } from 'lucide-react'

interface PosLayoutProps {
  children: ReactNode
  mode: 'products' | 'tickets' | 'checkout'
  onModeChange: (mode: 'products' | 'tickets' | 'checkout') => void
}

export function PosLayout({ children, mode, onModeChange }: PosLayoutProps) {
  return (
    <div className="min-h-screen bg-background-dark text-white relative overflow-hidden flex flex-col">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] rounded-full bg-primary/10 blur-[150px]" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-[120px]" />
      </div>

      {/* Header */}
      <header className="relative z-20 border-b border-white/5 bg-black/20 backdrop-blur-xl sticky top-0">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-glow-primary">
              <span className="font-bold text-white text-lg">CP</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white leading-none">Punto de Venta</h1>
              <p className="text-xs text-white/50 mt-1">Cinema Pergamino</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex bg-white/5 rounded-full p-1 border border-white/10" role="tablist">
            <button
              onClick={() => onModeChange('products')}
              role="tab"
              aria-selected={mode === 'products'}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${mode === 'products'
                  ? 'bg-primary text-white shadow-glow-primary'
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
            >
              <Popcorn className="w-4 h-4" />
              Confitería
            </button>
            <button
              onClick={() => onModeChange('tickets')}
              role="tab"
              aria-selected={mode === 'tickets'}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${mode === 'tickets'
                  ? 'bg-primary text-white shadow-glow-primary'
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
            >
              <Ticket className="w-4 h-4" />
              Entradas
            </button>
            <button
              onClick={() => onModeChange('checkout')}
              role="tab"
              aria-selected={mode === 'checkout'}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${mode === 'checkout'
                  ? 'bg-primary text-white shadow-glow-primary'
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
            >
              <Wallet className="w-4 h-4" />
              Cobro
            </button>
          </div>

          {/* Status / User */}
          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              ONLINE
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 container mx-auto px-6 py-8 relative z-10">
        <div className="animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  )
}

