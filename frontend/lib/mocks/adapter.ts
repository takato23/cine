import type { AxiosAdapter, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import type { CreateOrderResponse, Movie, Order, OrderItemInput, Product, ProductCategory, Showtime } from '@/lib/types'
import { ffNumber } from '@/lib/flags'

type PricingRule = {
  id: string
  name: string
  basePrice: number
  seatType?: 'STANDARD' | 'VIP'
}

type LockKey = `${string}-${number}`

const rooms = [
  { id: 'room-roja', name: 'Sala Roja', capacity: 96, layout: null },
  { id: 'room-amarilla', name: 'Sala Amarilla', capacity: 72, layout: null },
  { id: 'room-lux', name: 'Lux Hall', capacity: 120, layout: null },
]

const movies: Movie[] = [
  {
    id: 'm1',
    title: 'Duna: Parte Dos',
    synopsis: 'Paul Atreides se une a Chani y a los Fremen mientras busca venganza contra los conspiradores que destruyeron a su familia.',
    duration: 166,
    genres: ['Ciencia Ficción', 'Aventura'],
    rating: 'SAM 13',
    status: 'CARTELERA',
    posterUrl: '/images/movies/duna_2.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=Way9Dexny3w',
  },
  {
    id: 'm2',
    title: 'Super Mario Bros',
    synopsis: 'Mientras trabajan en una avería subterránea, los plomeros de Brooklyn, Mario y su hermano Luigi, son transportados por una tubería misteriosa.',
    duration: 92,
    genres: ['Animación', 'Familia'],
    rating: 'ATP',
    status: 'CARTELERA',
    posterUrl: '/images/movies/mario_bros.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=TnGl01FkMMo',
  },
  {
    id: 'm3',
    title: 'Intensamente 2',
    synopsis: 'Riley entra en la adolescencia y el Cuartel General sufre una repentina reforma para hacer sitio a algo totalmente inesperado: ¡nuevas emociones!',
    duration: 96,
    genres: ['Animación', 'Familia'],
    rating: 'ATP',
    status: 'ESTRENO',
    posterUrl: '/images/movies/intensamente_2.jpg',
    trailerUrl: 'https://www.youtube.com/watch?v=L0y7i1h45wU',
  },
]

const products: Product[] = [
  {
    id: 'p1',
    name: 'Pochoclos grandes',
    description: 'Clásicos, crocantes y recién hechos.',
    category: 'POCHOCLOS',
    price: 4500,
    isActive: true,
    imageUrl: '/images/products/popcorn_large.png',
  },
  {
    id: 'p2',
    name: 'Pochoclos caramel',
    description: 'Dulces y premium.',
    category: 'POCHOCLOS',
    price: 5200,
    isActive: true,
    imageUrl: '/images/products/popcorn_caramel.png',
  },
  {
    id: 'p3',
    name: 'Gaseosa 500ml',
    description: 'Coca / Sprite / Fanta (según stock).',
    category: 'BEBIDAS',
    price: 3000,
    isActive: true,
    imageUrl: '/images/products/soda_cup.png',
  },
  {
    id: 'p4',
    name: 'Agua mineral',
    description: 'Sin gas.',
    category: 'BEBIDAS',
    price: 2200,
    isActive: true,
    imageUrl: '/images/products/mineral_water.png',
  },
  {
    id: 'p5',
    name: 'Nachos + queso',
    description: 'Para compartir.',
    category: 'SNACKS',
    price: 5600,
    isActive: true,
    imageUrl: '/images/products/nachos_cheese.png',
  },
  {
    id: 'p6',
    name: 'Combo Clásico',
    description: 'Pochoclos + gaseosa.',
    category: 'COMBOS',
    price: 6900,
    isActive: true,
    imageUrl: '/images/products/combo_classic.png',
  },
  {
    id: 'p7',
    name: 'Hot Dog Premium',
    description: 'Con todos los aderezos.',
    category: 'SNACKS',
    price: 4800,
    isActive: true,
    imageUrl: '/images/products/hotdog_premium.png',
  },
  {
    id: 'p8',
    name: 'Combo Familiar',
    description: '2 Pochoclos grandes + 2 gaseosas.',
    category: 'COMBOS',
    price: 12500,
    isActive: true,
    imageUrl: '/images/products/combo_family.png',
  },
]

let pricingRules: PricingRule[] = [
  { id: 'pr1', name: 'General', basePrice: 5000, seatType: 'STANDARD' },
  { id: 'pr2', name: 'VIP', basePrice: 6500, seatType: 'VIP' },
]

const deletedShowtimes = new Set<string>()

type SeatLockState = {
  expiresAtMs: number
  seats: Set<LockKey>
}

const seatLocks = new Map<string, SeatLockState>() // showtimeId -> locks

const orders = new Map<string, Order>()
const paymentsToOrder = new Map<string, string>() // paymentId -> orderId

function parseQueryFromUrl(url: string) {
  const i = url.indexOf('?')
  if (i === -1) return { path: url, query: new URLSearchParams() }
  return { path: url.slice(0, i), query: new URLSearchParams(url.slice(i + 1)) }
}

function normalizePath(url: string) {
  const { path } = parseQueryFromUrl(url)
  return path.startsWith('/') ? path : `/${path}`
}

function parseJSON(data: any) {
  if (!data) return null
  if (typeof data === 'string') {
    try {
      return JSON.parse(data)
    } catch {
      return null
    }
  }
  return data
}

function ok<T>(config: InternalAxiosRequestConfig, data: T, status = 200): AxiosResponse<T> {
  return {
    data,
    status,
    statusText: status === 200 ? 'OK' : 'SUCCESS',
    headers: {},
    config,
  }
}

function fail(config: InternalAxiosRequestConfig, status: number, message: string) {
  return Promise.reject({
    config,
    response: { status, data: { error: message } },
    message,
  })
}

function delayMs() {
  return ffNumber('MOCK_DELAY_MS', 220)
}

async function maybeDelay() {
  const ms = delayMs()
  if (ms <= 0) return
  await new Promise((r) => setTimeout(r, ms))
}

function formatDateKey(d: Date) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function buildShowtimesForDate(dateKey: string) {
  const times = ['17:30', '19:30', '21:45']
  const list: Showtime[] = []
  movies
    .filter((m) => m.status !== 'PROXIMAMENTE')
    .forEach((m, i) => {
      times.forEach((t, j) => {
        const room = rooms[(i + j) % rooms.length]
        const id = `st-${m.id}-${dateKey}-${t.replace(':', '')}-${room.id}`
        if (deletedShowtimes.has(id)) return
        list.push({
          id,
          movieId: m.id,
          roomId: room.id,
          startTime: `${dateKey}T${t}:00.000Z`,
          format: j === 0 ? 'TWO_D' : j === 1 ? 'THREE_D' : 'IMAX',
          language: 'Español',
          subtitles: j === 0 ? null : 'Español',
          movie: m,
          room,
          pricingRule: j === 2 ? { id: 'pr2', name: 'VIP', basePrice: 6500, seatType: 'VIP' } : { id: 'pr1', name: 'General', basePrice: 5000, seatType: 'STANDARD' },
        })
      })
    })
  return list
}

function buildShowtimeById(id: string): Showtime | null {
  const parts = id.split('-')
  if (parts.length < 3) return null
  const movieId = parts[1]
  const movie = movies.find((m) => m.id === movieId)
  if (!movie) return null
  const dateKey = parts[2]
  const timePart = parts[3] ?? '1930'
  const roomId = parts.slice(4).join('-')
  const room = rooms.find((r) => r.id === roomId) ?? rooms[0]
  const hh = timePart.slice(0, 2)
  const mm = timePart.slice(2, 4)
  const t = `${hh}:${mm}`
  return {
    id,
    movieId,
    roomId: room.id,
    startTime: `${dateKey}T${t}:00.000Z`,
    format: 'TWO_D',
    language: 'Español',
    subtitles: null,
    movie,
    room,
    pricingRule: { id: 'pr1', name: 'General', basePrice: 5000, seatType: 'STANDARD' },
  }
}

function seedFromString(s: string) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function getSeatLock(showtimeId: string) {
  const l = seatLocks.get(showtimeId)
  if (!l) return null
  if (Date.now() > l.expiresAtMs) {
    seatLocks.delete(showtimeId)
    return null
  }
  return l
}

function buildSeats(showtimeId: string) {
  const rows = 'ABCDEFGHIJ'.split('') // 10 Rows
  const seatsPerRow = 25
  const rand = mulberry32(seedFromString(showtimeId))

  const lock = getSeatLock(showtimeId)
  const locked = lock?.seats ?? new Set<LockKey>()

  return rows.map((letter, idx) => {
    const isVipRow = idx >= rows.length - 2
    const seats = Array.from({ length: seatsPerRow }, (_, i) => {
      const n = i + 1
      const key: LockKey = `${letter}-${n}`
      const occupied = rand() < 0.08
      const isLocked = locked.has(key)
      return {
        number: n,
        type: isVipRow ? 'VIP' : 'STANDARD',
        available: !occupied && !isLocked,
        locked: isLocked,
      }
    })
    return { letter, seats }
  })
}

function computeTotals(items: OrderItemInput[]) {
  const ticketsTotal = items
    .filter((i) => i.type === 'ticket')
    .reduce((sum, _) => sum + 5000, 0)
  const productsTotal = items
    .filter((i) => i.type === 'product')
    .reduce((sum, i) => {
      const p = products.find((p) => p.id === i.productId)
      return sum + (p?.price ?? 0) * (i.quantity ?? 0)
    }, 0)
  const subtotal = ticketsTotal + productsTotal
  const serviceFee = Math.round(subtotal * 0.05)
  const total = subtotal + serviceFee
  return { subtotal, serviceFee, total }
}

export const mockAdapter: AxiosAdapter = async (config) => {
  await maybeDelay()

  const method = (config.method || 'get').toLowerCase()
  const { path, query } = parseQueryFromUrl(config.url || '/')
  const urlPath = normalizePath(path)

  const params = (config.params ?? {}) as Record<string, any>
  const getParam = (k: string) => params[k] ?? query.get(k) ?? undefined

  // Movies
  if (method === 'get' && urlPath === '/movies') {
    return ok(config, movies.filter((m) => !('deleted' in (m as any))))
  }
  if (urlPath.startsWith('/movies/') && method === 'get') {
    const id = urlPath.split('/')[2]
    const m = movies.find((x) => x.id === id)
    if (!m) return fail(config, 404, 'Película no encontrada')
    return ok(config, m)
  }
  if (urlPath.startsWith('/movies/') && method === 'delete') {
    const id = urlPath.split('/')[2]
    const idx = movies.findIndex((x) => x.id === id)
    if (idx === -1) return fail(config, 404, 'Película no encontrada')
      ; (movies[idx] as any).deleted = true
    return ok(config, { ok: true })
  }

  // Products
  if (method === 'get' && urlPath === '/products') {
    const active = getParam('active')
    const category = getParam('category') as ProductCategory | undefined
    const list = products.filter((p) => !(p as any).deleted)
    const filtered = list
      .filter((p) => (active === 'true' ? p.isActive !== false : true))
      .filter((p) => (category ? p.category === category : true))
    return ok(config, filtered)
  }
  if (urlPath.startsWith('/products/') && method === 'delete') {
    const id = urlPath.split('/')[2]
    const idx = products.findIndex((x) => x.id === id)
    if (idx === -1) return fail(config, 404, 'Producto no encontrado')
      ; (products[idx] as any).deleted = true
    return ok(config, { ok: true })
  }

  // Showtimes
  if (method === 'get' && urlPath === '/showtimes') {
    const movieId = getParam('movieId') as string | undefined
    const dateKey = (getParam('date') as string | undefined) ?? formatDateKey(new Date())
    const list = buildShowtimesForDate(dateKey)
    const filtered = movieId ? list.filter((s) => s.movieId === movieId) : list
    return ok(config, filtered)
  }
  if (urlPath.startsWith('/showtimes/') && method === 'get' && urlPath.endsWith('/seats')) {
    const id = urlPath.split('/')[2]
    const showtime = buildShowtimeById(id)
    if (!showtime) return fail(config, 404, 'Función no encontrada')
    return ok(config, { showtime, seats: buildSeats(id) })
  }
  if (urlPath.startsWith('/showtimes/') && method === 'get') {
    const id = urlPath.split('/')[2]
    const showtime = buildShowtimeById(id)
    if (!showtime) return fail(config, 404, 'Función no encontrada')
    return ok(config, showtime)
  }
  if (urlPath.startsWith('/showtimes/') && method === 'delete') {
    const id = urlPath.split('/')[2]
    deletedShowtimes.add(id)
    return ok(config, { ok: true })
  }

  // Rooms
  if (method === 'get' && urlPath === '/rooms') {
    return ok(config, rooms)
  }
  if (urlPath.startsWith('/rooms/') && method === 'patch') {
    const id = urlPath.split('/')[2]
    const body = parseJSON(config.data) ?? {}
    const roomIndex = rooms.findIndex((r) => r.id === id)
    if (roomIndex === -1) return fail(config, 404, 'Sala no encontrada')

    const updatedRoom = { ...rooms[roomIndex], ...body }
    rooms[roomIndex] = updatedRoom
    return ok(config, updatedRoom)
  }

  // Admin pricing rules
  if (urlPath === '/admin/pricing-rules' && method === 'get') {
    return ok(config, pricingRules)
  }
  if (urlPath.startsWith('/admin/pricing-rules/') && method === 'delete') {
    const id = urlPath.split('/')[3]
    pricingRules = pricingRules.filter((r) => r.id !== id)
    return ok(config, { ok: true })
  }

  // Auth
  if (urlPath === '/auth/login' && method === 'post') {
    const body = parseJSON(config.data) ?? {}
    const email = String(body.email ?? '')
    const role = email.includes('admin') ? 'ADMIN' : email.includes('staff') ? 'STAFF' : 'CLIENT'
    return ok(config, {
      user: { id: `u-${role.toLowerCase()}`, email, name: role === 'CLIENT' ? 'Cliente' : role, role },
      token: `mock-token:${role}`,
    })
  }
  if (urlPath === '/auth/register' && method === 'post') {
    const body = parseJSON(config.data) ?? {}
    const email = String(body.email ?? '')
    return ok(config, {
      user: { id: 'u-client', email, name: String(body.name ?? 'Cliente'), role: 'CLIENT' },
      token: 'mock-token:CLIENT',
    })
  }

  // Seat locks
  if (urlPath === '/orders/lock-seats' && method === 'post') {
    const body = parseJSON(config.data) ?? {}
    const showtimeId = String(body.showtimeId ?? '')
    const seatsReq = Array.isArray(body.seats) ? body.seats : []
    if (!showtimeId) return fail(config, 400, 'showtimeId requerido')
    if (seatsReq.length === 0) return fail(config, 400, 'Seleccioná al menos un asiento')

    const current = getSeatLock(showtimeId)
    const currentSet = current?.seats ?? new Set<LockKey>()

    const reqSet = new Set<LockKey>()
    for (const s of seatsReq) {
      const row = String(s.row ?? '')
      const seatNumber = Number(s.seatNumber)
      if (!row || !Number.isFinite(seatNumber)) continue
      reqSet.add(`${row}-${seatNumber}`)
    }
    for (const k of reqSet) {
      if (currentSet.has(k)) return fail(config, 409, 'Uno o más asientos ya están reservados')
    }

    const expiresAtMs = Date.now() + 15 * 60 * 1000
    seatLocks.set(showtimeId, { expiresAtMs, seats: reqSet })

    const locks = Array.from(reqSet).map((key) => {
      const [row, seatNumberStr] = key.split('-')
      return {
        id: `lock-${showtimeId}-${row}${seatNumberStr}`,
        showtimeId,
        row,
        seatNumber: Number(seatNumberStr),
        lockedUntil: new Date(expiresAtMs).toISOString(),
      }
    })

    return ok(config, { locks, expiresAt: new Date(expiresAtMs).toISOString() })
  }

  // Orders
  if (urlPath === '/orders' && method === 'post') {
    const body = parseJSON(config.data) ?? {}
    const items = (body.items ?? []) as OrderItemInput[]
    if (!Array.isArray(items) || items.length === 0) return fail(config, 400, 'Carrito vacío')
    const { subtotal, serviceFee, total } = computeTotals(items)
    const orderId = `ord_${Math.random().toString(36).slice(2, 10)}`
    const paymentId = `pay_${Math.random().toString(36).slice(2, 10)}`
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString()

    const order: Order = {
      id: orderId,
      status: 'PENDING',
      subtotal,
      serviceFee,
      total,
      expiresAt,
      items: items.map((i, idx) => {
        const isTicket = i.type === 'ticket'
        const unit = isTicket ? 5000 : products.find((p) => p.id === i.productId)?.price ?? 0
        const qty = i.quantity ?? 1
        return {
          id: `item_${orderId}_${idx}`,
          type: i.type,
          showtimeId: i.showtimeId ?? null,
          productId: i.productId ?? null,
          row: i.row ?? null,
          seatNumber: i.seatNumber ?? null,
          quantity: qty,
          unitPrice: unit,
          totalPrice: unit * qty,
        }
      }),
      payment: {
        id: paymentId,
        status: 'PENDING',
        method: 'mercadopago',
        qrCode: 'mock-qr',
        qrCodeBase64: null,
        expiresAt,
      },
    }
    orders.set(orderId, order)
    paymentsToOrder.set(paymentId, orderId)

    const resp: CreateOrderResponse = {
      order,
      payment: {
        id: paymentId,
        qrCode: 'mock-qr',
        qrCodeUrl: null,
        expiresAt,
      },
    }
    return ok(config, resp)
  }

  if (urlPath.startsWith('/orders/') && method === 'get') {
    const id = urlPath.split('/')[2]
    const order = orders.get(id)
    if (!order) return fail(config, 404, 'Orden no encontrada')
    const exp = order.expiresAt ? new Date(order.expiresAt).getTime() : null
    if (order.status === 'PENDING' && exp && Date.now() > exp) {
      const updated: Order = { ...order, status: 'EXPIRED', payment: order.payment ? { ...order.payment, status: 'CANCELLED' } : null }
      orders.set(id, updated)
      return ok(config, updated)
    }
    return ok(config, order)
  }

  // Payments webhook simulation
  if (urlPath === '/payments/mp/webhook' && method === 'post') {
    const body = parseJSON(config.data) ?? {}
    const paymentId = String(body.paymentId ?? '')
    const orderId = paymentsToOrder.get(paymentId) ?? paymentId
    const order = orders.get(orderId)
    if (!order) return ok(config, { ok: true })

    const updated: Order = {
      ...order,
      status: 'PAID',
      payment: order.payment ? { ...order.payment, status: 'APPROVED' } : order.payment,
    }
    orders.set(orderId, updated)
    return ok(config, { ok: true })
  }

  return fail(config, 404, `Mock: endpoint no implementado (${method.toUpperCase()} ${urlPath})`)
}

