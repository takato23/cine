export type OrderItemType = 'ticket' | 'product'

export interface OrderItemInput {
  type: OrderItemType
  showtimeId?: string
  row?: string
  seatNumber?: number
  productId?: string
  quantity: number
}

export interface OrderItem {
  id: string
  type: OrderItemType
  showtimeId?: string | null
  productId?: string | null
  row?: string | null
  seatNumber?: number | null
  quantity: number
  unitPrice: number
  totalPrice: number
  showtime?: any
  product?: any
}

export interface Order {
  id: string
  status: 'PENDING' | 'PAID' | 'CANCELLED' | 'EXPIRED'
  subtotal: number
  serviceFee: number
  total: number
  expiresAt?: string | null
  items: OrderItem[]
  payment?: Payment | null
}

export interface Payment {
  id: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED'
  method: 'mercadopago' | string
  qrCode?: string | null
  qrCodeBase64?: string | null
  expiresAt?: string | null
}

export interface CreateOrderResponse {
  order: Order
  payment: {
    id: string
    qrCode: string | null
    qrCodeUrl: string | null
    expiresAt: string | null
  }
}


