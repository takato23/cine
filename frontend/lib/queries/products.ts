import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Product, ProductCategory } from '@/lib/types'

export function useProducts(params?: { active?: boolean; category?: ProductCategory }) {
  const active = params?.active ?? true
  const category = params?.category

  return useQuery<Product[]>({
    queryKey: ['products', { active, category: category ?? null }],
    queryFn: async () => {
      const res = await api.get('/products', {
        params: {
          active: active ? 'true' : undefined,
          category,
        },
      })
      return res.data
    },
  })
}


