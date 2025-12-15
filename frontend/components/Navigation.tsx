'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuthStore } from '@/lib/store'
import { useCheckoutStore } from '@/lib/store/checkout'
import { usePathname } from 'next/navigation'
import {
  Film,
  LayoutDashboard,
  Popcorn,
  ShoppingBag,
  Ticket,
} from 'lucide-react'
import { cn } from '@/lib/cn'
import { AnimatePresence, motion } from 'framer-motion'
import { BottomNav } from './ui/BottomNav'
import { UserDropdown } from './ui/UserDropdown'

export function Navigation() {
  const { user, clearAuth, isAdmin, isStaff } = useAuthStore()
  const pathname = usePathname()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const isActive = (href: string) => pathname === href || pathname?.startsWith(`${href}/`)

  const { cart } = useCheckoutStore()
  const cartCount = useMemo(() => cart.reduce((sum, line) => sum + line.quantity, 0), [cart])

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const desktopLinks = useMemo(
    () => [
      { href: '/cartelera', icon: Film, label: 'Cartelera' },
      { href: '/confiteria', icon: Popcorn, label: 'Confitería' },
      ...(user ? [{ href: '/entradas', icon: Ticket, label: 'Mis entradas' }] : []),
      ...(isStaff() ? [{ href: '/pos', icon: ShoppingBag, label: 'POS' }] : []),
      ...(isAdmin() ? [{ href: '/admin', icon: LayoutDashboard, label: 'Admin' }] : []),
    ],
    [user, isAdmin, isStaff]
  )

  return (
    <>
      <nav
        className={cn(
          'sticky top-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5 py-2'
            : 'bg-transparent border-transparent py-4'
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between gap-3">
            <Link href="/" className="flex items-center gap-3 group min-w-0 relative z-10">
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 border border-white/10 overflow-hidden transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                <Image
                  src="/images/cinema-logo.png"
                  alt="Cinema Pergamino"
                  fill
                  sizes="40px"
                  className="object-contain p-1.5"
                  priority
                />
              </div>
              <div className="hidden sm:flex flex-col leading-none min-w-0">
                <span className="font-display text-lg font-black tracking-tight text-white truncate group-hover:text-primary transition-colors">
                  Cinema <span className="text-primary">Pergamino</span>
                </span>
                <span className="text-[10px] uppercase tracking-widest text-white/40 truncate group-hover:text-white/60 transition-colors">
                  Cine & Experiencias
                </span>
              </div>
            </Link>

            {/* Links desktop (Centered pill) */}
            <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center p-1 rounded-full bg-white/5 border border-white/5 backdrop-blur-md shadow-lg">
              {desktopLinks.map((item) => {
                const active = isActive(item.href)
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'relative flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300',
                      active ? 'text-white' : 'text-white/60 hover:text-white hover:bg-white/5'
                    )}
                  >
                    {active && (
                      <motion.div
                        layoutId="navbar-active"
                        className="absolute inset-0 bg-white/10 rounded-full border border-white/5 shadow-inner"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-2">
                      <Icon
                        className={cn(
                          'w-4 h-4',
                          active ? 'text-primary' : 'text-current'
                        )}
                      />
                      {item.label}
                    </span>
                  </Link>
                )
              })}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 relative z-10">
              <Link
                href="/checkout"
                className={cn(
                  "relative w-10 h-10 flex items-center justify-center rounded-full transition-all group",
                  cartCount > 0 ? "bg-white/10 text-white" : "text-white/60 hover:text-white hover:bg-white/5"
                )}
              >
                <ShoppingBag className="w-5 h-5 transition-transform group-hover:scale-110" />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 min-w-5 h-5 px-1.5 rounded-full bg-primary text-white text-[10px] font-bold grid place-items-center shadow-lg border border-neutral-900"
                    >
                      {cartCount > 99 ? '99+' : cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>

              {user ? (
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-3 group focus:outline-none"
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-full p-[2px] transition-all duration-300",
                      userMenuOpen ? "bg-primary scale-110" : "bg-white/10 hover:bg-white/20"
                    )}>
                      <div className="w-full h-full rounded-full bg-neutral-900 overflow-hidden relative">
                        <img
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name || user.email}`}
                          alt="Avatar"
                          className="w-full h-full object-cover p-0.5"
                        />
                      </div>
                    </div>
                  </button>

                  <UserDropdown
                    user={user}
                    isOpen={userMenuOpen}
                    onClose={() => setUserMenuOpen(false)}
                    onLogout={clearAuth}
                  />
                </div>
              ) : (
                <Link
                  href="/login"
                  className="hidden md:inline-flex h-10 items-center justify-center rounded-full bg-white text-black px-6 font-bold text-sm transition-transform hover:scale-105 active:scale-95"
                >
                  Entrar
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </>
  )
}
