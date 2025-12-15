'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Product } from '@/lib/types/product'
import { Plus, Edit, Trash2, Package, Coffee, Popcorn, Cookie } from 'lucide-react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { LoadingState, EmptyState } from '@/components/ui/states'
import { useToast } from '@/components/ui/Toast'
import { StatsCard } from '@/components/admin/StatsCard'

export default function AdminProductosPage() {
  const queryClient = useQueryClient()
  const { addToast } = useToast()
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos')

  const { data: products, isLoading, refetch } = useQuery<Product[]>({
    queryKey: ['products', 'admin'],
    queryFn: async () => {
      const res = await api.get('/products')
      return res.data
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/products/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      addToast({ title: 'Producto eliminado', variant: 'success' })
    },
  })

  const categories = [
    { key: 'Todos', label: 'Todos', icon: Package },
    { key: 'POCHOCLOS', label: 'Pochoclos', icon: Popcorn },
    { key: 'BEBIDAS', label: 'Bebidas', icon: Coffee },
    { key: 'SNACKS', label: 'Snacks', icon: Cookie },
    { key: 'COMBOS', label: 'Combos', icon: Package },
  ]

  const filteredProducts = products?.filter(
    (p) => selectedCategory === 'Todos' || p.category === selectedCategory
  )

  const totalProducts = products?.length || 0
  const lowStockProducts = products?.filter(p => p.stock != null && p.stock < 10).length || 0

  return (
    <div className="space-y-8 animate-fade-in">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-black text-white tracking-tight mb-1"
          >
            Productos
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-neutral-400"
          >
            Gestiona confitería y combos.
          </motion.p>
        </div>
        <Button leftIcon={<Plus className="w-5 h-5" />}>
          Nuevo Producto
        </Button>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard
          title="Total Productos"
          value={totalProducts}
          icon={Package}
          color="text-blue-400"
          delay={0}
        />
        <StatsCard
          title="Stock Bajo"
          value={lowStockProducts}
          icon={Package}
          color="text-amber-400"
          delay={0.1}
        />
        <StatsCard
          title="Categorías"
          value={categories.length - 1}
          icon={Package}
          color="text-purple-400"
          delay={0.2}
        />
      </div>

      {/* Category Pills */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
      >
        {categories.map((cat, idx) => {
          const isSelected = selectedCategory === cat.key
          return (
            <motion.button
              key={cat.key}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + idx * 0.05 }}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-4 py-2 rounded-2xl whitespace-nowrap font-semibold text-sm transition-all border flex items-center gap-2 ${isSelected
                ? 'bg-primary-500 text-white border-primary-500 shadow-lg shadow-primary-500/25'
                : 'bg-white/5 text-neutral-300 hover:bg-white/10 border-white/10'
                }`}
            >
              <cat.icon className="w-4 h-4" />
              {cat.label}
            </motion.button>
          )
        })}
      </motion.div>

      {isLoading ? (
        <LoadingState title="Cargando productos..." subtitle="Obteniendo catálogo." />
      ) : !filteredProducts || filteredProducts.length === 0 ? (
        <EmptyState
          title="Sin productos"
          subtitle={selectedCategory === 'Todos' ? 'No hay productos en el sistema.' : `No hay productos en ${selectedCategory}.`}
          action={<Button leftIcon={<Plus className="w-4 h-4" />}>Agregar Producto</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + idx * 0.05 }}
            >
              <Card className="h-full bg-black/40 backdrop-blur-xl border-white/5 hover:border-white/10 transition-colors overflow-hidden flex flex-col group">
                {/* Product Image Area */}
                <div className="aspect-video relative bg-gradient-to-br from-primary-500/10 to-purple-500/10 flex items-center justify-center">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <Package className="w-16 h-16 text-white/10" />
                  )}
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-1 rounded-lg text-xs font-bold bg-black/50 backdrop-blur-md text-white/80 border border-white/10">
                      {product.category}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-1">{product.name}</h3>
                    <p className="text-sm text-neutral-400 line-clamp-2 mb-3">{product.description}</p>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-primary-400">
                      ${product.price.toLocaleString()}
                    </span>
                    {product.stock !== null && (
                      <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${product.stock != null && product.stock < 10
                        ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                        : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                        }`}>
                        Stock: {product.stock}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="flex-1"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="px-3 text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10"
                      onClick={() => {
                        if (confirm('¿Eliminar este producto?')) {
                          deleteMutation.mutate(product.id)
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
