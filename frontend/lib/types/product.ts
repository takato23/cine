export type ProductCategory = 'POCHOCLOS' | 'BEBIDAS' | 'SNACKS' | 'COMBOS'

export interface PromotionLite {
  name: string
  discount: number
}

export interface Product {
  id: string
  name: string
  description?: string | null
  category: ProductCategory
  price: number
  imageUrl?: string | null
  stock?: number | null
  isActive?: boolean
  promotion?: PromotionLite | null
}


