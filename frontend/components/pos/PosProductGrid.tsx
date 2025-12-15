'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Product } from '@/lib/types/product'
import { usePosStore } from '@/lib/store/pos'
import { Search, Plus } from 'lucide-react'
import { ProductCardSkeleton } from '@/components/ui/Skeleton'

export function PosProductGrid() {
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos')
  const { addProduct } = usePosStore()

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ['products', 'pos'],
    queryFn: async () => {
      const res = await api.get('/products?active=true')
      return res.data
    },
  })

  // Hotkey: / para buscar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && e.target !== searchInputRef.current) {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const categories = ['Todos', 'POCHOCLOS', 'BEBIDAS', 'SNACKS', 'COMBOS']

  const filteredProducts = products?.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  }) || []

  return (
    <div className="bg-black/40 backdrop-blur-xl border border-white/5 p-6 rounded-[2rem] h-full flex flex-col overflow-hidden shadow-2xl">
      {/* Search */}
      <div className="relative mb-8 flex-shrink-0 group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500/20 to-purple-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 blur-md" />
        <div className="relative bg-black/50 rounded-2xl">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5 group-focus-within:text-primary-400 transition-colors" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Buscar productos... (presiona /)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent border border-white/10 text-white placeholder-white/30 pl-12 pr-4 py-4 rounded-2xl text-base font-medium focus:outline-none focus:border-primary-500/50 focus:bg-white/5 transition-all"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex space-x-3 mb-8 overflow-x-auto pb-2 flex-shrink-0 no-scrollbar items-center">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2.5 rounded-xl whitespace-nowrap text-sm font-bold transition-all duration-300 border ${selectedCategory === cat
              ? 'bg-primary-500 text-white border-primary-500 shadow-lg shadow-primary-500/25 scale-105'
              : 'bg-white/5 text-white/60 border-white/5 hover:bg-white/10 hover:text-white hover:border-white/10'
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 flex-1">
          {Array.from({ length: 10 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12 flex-1 flex flex-col items-center justify-center animate-fade-in">
          <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6">
            <Search className="w-10 h-10 text-white/20" />
          </div>
          <h3 className="text-white font-bold text-lg mb-2">No encontramos nada</h3>
          <p className="text-white/40 max-w-xs mx-auto">Intenta con otros términos de búsqueda o cambia de categoría.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 overflow-y-auto pr-2 pb-4 flex-1 custom-scrollbar content-start">
          {filteredProducts.map((product) => (
            <button
              key={product.id}
              onClick={() => addProduct(product)}
              className="group relative bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 rounded-2xl p-3 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col h-full overflow-hidden"
            >
              {/* Product Image */}
              <div className="relative aspect-square rounded-xl mb-3 overflow-hidden bg-black/20">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/20">
                    <Plus className="w-8 h-8 group-hover:text-primary-500 transition-colors" />
                  </div>
                )}
                {/* Stock Badge */}
                {typeof product.stock === 'number' && product.stock < 10 && (
                  <div className="absolute top-2 right-2 px-2 py-1 rounded bg-rose-500 text-white text-[10px] font-black tracking-wider uppercase z-20 shadow-lg">
                    {product.stock} left
                  </div>
                )}
                {/* Floating Add Icon on Hover */}
                <div className="absolute bottom-2 right-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-20">
                  <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white shadow-lg">
                    <Plus className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col">
                <h3 className="font-bold text-white text-sm leading-tight mb-1 line-clamp-2 group-hover:text-primary-400 transition-colors">
                  {product.name}
                </h3>
                {product.description && (
                  <p className="text-[11px] text-white/40 mb-3 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                )}
                <div className="mt-auto">
                  <div className="text-base font-black text-white group-hover:text-primary-400 transition-colors">
                    ${product.price.toLocaleString()}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
