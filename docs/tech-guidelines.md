# Lineamientos Técnicos
## Cinema Pergamino - Webapp

**Versión:** 1.0  
**Última actualización:** 2024

---

## 1. Stack Tecnológico

### 1.1 Core

- **Framework:** Next.js 14+ (App Router)
- **Lenguaje:** TypeScript 5+
- **UI Framework:** React 18+
- **Estilos:** Tailwind CSS 3.4+
- **Iconos:** Lucide React

### 1.2 Gestión de Estado

- **Estado Global:** Zustand 4+
- **Estado del Servidor:** React Query (@tanstack/react-query) 5+
- **Formularios:** React Hook Form + Zod

### 1.3 HTTP Client

- **Cliente HTTP:** Axios
- **Interceptores:** Para autenticación y manejo de errores

### 1.4 Utilidades

- **Fechas:** date-fns
- **Validación:** Zod
- **Build Tool:** Next.js (Turbopack en desarrollo)

---

## 2. Estructura del Proyecto

### 2.1 Organización de Carpetas

```
frontend/
├── app/                    # App Router de Next.js
│   ├── (routes)/          # Rutas agrupadas
│   │   ├── cartelera/     # Página de cartelera
│   │   ├── pelicula/      # Detalle de película
│   │   ├── asientos/      # Selección de asientos
│   │   ├── confiteria/     # Catálogo de confitería
│   │   └── checkout/       # Resumen y pago
│   ├── api/               # API Routes (si aplica)
│   ├── layout.tsx         # Layout raíz
│   ├── page.tsx           # Página home (redirect)
│   ├── providers.tsx       # Providers de React Query, etc.
│   └── globals.css        # Estilos globales
├── components/            # Componentes reutilizables
│   ├── ui/               # Componentes base (Button, Card, etc.)
│   ├── features/         # Componentes de features específicos
│   │   ├── movies/       # Componentes relacionados a películas
│   │   ├── seats/        # Componentes de asientos
│   │   └── confiteria/   # Componentes de confitería
│   └── layout/           # Componentes de layout (Header, Nav, etc.)
├── lib/                  # Utilidades y configuraciones
│   ├── api.ts            # Cliente API (Axios)
│   ├── store.ts          # Stores de Zustand
│   ├── queries/          # React Query hooks
│   ├── utils/            # Funciones utilitarias
│   └── types/            # Tipos TypeScript compartidos
├── hooks/                # Custom hooks
├── public/               # Archivos estáticos
└── docs/                 # Documentación
```

### 2.2 Convenciones de Nombres

**Archivos y Carpetas:**
- Componentes: `PascalCase` (ej: `MovieCard.tsx`)
- Utilidades: `camelCase` (ej: `formatDate.ts`)
- Hooks: `use` + `PascalCase` (ej: `useMovies.ts`)
- Tipos: `PascalCase` (ej: `Movie.ts`)

**Componentes:**
- Un componente por archivo
- Nombre del archivo = nombre del componente
- Export default para componentes principales
- Export named para componentes auxiliares

**Rutas:**
- Rutas en minúsculas con guiones (ej: `/pelicula/[id]`)
- Rutas dinámicas con corchetes (ej: `[id]`, `[slug]`)

---

## 3. Next.js App Router

### 3.1 Estructura de Rutas

```typescript
// app/cartelera/page.tsx
export default function CarteleraPage() {
  // Server Component por defecto
}

// app/pelicula/[id]/page.tsx
export default async function PeliculaPage({ params }: { params: { id: string } }) {
  // Server Component con parámetros
}
```

### 3.2 Server Components vs Client Components

**Server Components (Default):**
- Fetching de datos
- Acceso directo a backend
- Sin JavaScript en el cliente
- No pueden usar hooks ni estado

**Client Components (`'use client'`):**
- Interactividad (onClick, useState, etc.)
- Hooks de React
- Estado del cliente
- Eventos del navegador

**Regla de Oro:**
> "Usa Server Components por defecto, Client Components solo cuando sea necesario"

### 3.3 Data Fetching

**Server Components:**
```typescript
// app/cartelera/page.tsx
async function getMovies() {
  const res = await fetch(`${API_URL}/movies`, {
    next: { revalidate: 60 } // ISR: revalidar cada 60 segundos
  })
  return res.json()
}

export default async function CarteleraPage() {
  const movies = await getMovies()
  return <MovieList movies={movies} />
}
```

**Client Components con React Query:**
```typescript
// lib/queries/movies.ts
export function useMovies() {
  return useQuery({
    queryKey: ['movies'],
    queryFn: () => api.get('/movies').then(res => res.data),
    staleTime: 60 * 1000, // 1 minuto
  })
}
```

### 3.4 Rendering Strategies

**Static Site Generation (SSG):**
- Para contenido estático o semi-estático
- `generateStaticParams` para rutas dinámicas

**Incremental Static Regeneration (ISR):**
- Para contenido que cambia periódicamente
- `next: { revalidate: 60 }` en fetch

**Server-Side Rendering (SSR):**
- Para contenido dinámico por request
- Sin `revalidate` en fetch

**Client-Side Rendering (CSR):**
- Para contenido altamente interactivo
- Con React Query en Client Components

---

## 4. Gestión de Estado

### 4.1 Zustand para Estado Global

**Store de Autenticación:**
```typescript
// lib/store/auth.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  user: User | null
  token: string | null
  setAuth: (user: User, token: string) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => set({ user, token }),
      clearAuth: () => set({ user: null, token: null }),
    }),
    { name: 'auth-storage' }
  )
)
```

**Store de Carrito:**
```typescript
// lib/store/cart.ts
interface CartItem {
  id: string
  type: 'ticket' | 'product'
  // ... otros campos
}

interface CartState {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  clearCart: () => void
  total: () => number
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  removeItem: (id) => set((state) => ({ items: state.items.filter(i => i.id !== id) })),
  clearCart: () => set({ items: [] }),
  total: () => get().items.reduce((sum, item) => sum + item.price, 0),
}))
```

### 4.2 React Query para Estado del Servidor

**Configuración:**
```typescript
// app/providers.tsx
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minuto
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
```

**Custom Hooks:**
```typescript
// lib/queries/movies.ts
export function useMovies() {
  return useQuery({
    queryKey: ['movies'],
    queryFn: () => api.get('/movies').then(res => res.data),
  })
}

export function useMovie(id: string) {
  return useQuery({
    queryKey: ['movies', id],
    queryFn: () => api.get(`/movies/${id}`).then(res => res.data),
    enabled: !!id,
  })
}

export function useShowtimes(movieId: string, date: string) {
  return useQuery({
    queryKey: ['showtimes', movieId, date],
    queryFn: () => api.get(`/showtimes`, { params: { movieId, date } }).then(res => res.data),
    enabled: !!movieId && !!date,
  })
}
```

**Mutations:**
```typescript
// lib/queries/orders.ts
export function useCreateOrder() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (orderData: CreateOrderData) => 
      api.post('/orders', orderData).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })
}
```

---

## 5. Cliente API

### 5.1 Configuración de Axios

```typescript
// lib/api.ts
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos
})

// Interceptor de requests: agregar token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// Interceptor de responses: manejo de errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirigir a login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)
```

### 5.2 Tipos de Endpoints

```typescript
// lib/api/movies.ts
export const moviesApi = {
  getAll: () => api.get<Movie[]>('/movies'),
  getById: (id: string) => api.get<Movie>(`/movies/${id}`),
  getShowtimes: (movieId: string, date: string) => 
    api.get<Showtime[]>(`/movies/${movieId}/showtimes`, { params: { date } }),
}

// lib/api/seats.ts
export const seatsApi = {
  getByShowtime: (showtimeId: string) => 
    api.get<Seat[]>(`/showtimes/${showtimeId}/seats`),
  reserve: (showtimeId: string, seatIds: string[]) => 
    api.post(`/showtimes/${showtimeId}/seats/reserve`, { seatIds }),
}

// lib/api/products.ts
export const productsApi = {
  getAll: () => api.get<Product[]>('/products'),
  getByCategory: (category: string) => 
    api.get<Product[]>(`/products?category=${category}`),
}

// lib/api/orders.ts
export const ordersApi = {
  create: (orderData: CreateOrderData) => 
    api.post<Order>('/orders', orderData),
  getById: (id: string) => api.get<Order>(`/orders/${id}`),
}
```

---

## 6. Tipos TypeScript

### 6.1 Tipos Compartidos

```typescript
// lib/types/movie.ts
export interface Movie {
  id: string
  title: string
  duration: number
  genres: string[]
  rating?: string
  posterUrl?: string
  backdropUrl?: string
  synopsis: string
  director: string
  language: string
  status: 'EN_CARTELERA' | 'PROXIMAMENTE'
  releaseDate?: string
}

// lib/types/showtime.ts
export interface Showtime {
  id: string
  movieId: string
  roomId: string
  roomName: string
  format: '2D' | '3D' | 'IMAX'
  language: string
  startTime: string
  endTime: string
  price: number
}

// lib/types/seat.ts
export interface Seat {
  id: string
  row: string
  number: number
  type: 'STANDARD' | 'VIP'
  status: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED'
}

// lib/types/product.ts
export interface Product {
  id: string
  name: string
  description: string
  price: number
  imageUrl?: string
  category: 'COMBO' | 'BEBIDA' | 'POCHOCLO' | 'SNACK'
  isPromo?: boolean
}

// lib/types/order.ts
export interface Order {
  id: string
  userId: string
  showtimeId: string
  seats: Seat[]
  products: OrderProduct[]
  total: number
  status: 'PENDING' | 'PAID' | 'CANCELLED'
  paymentId?: string
  expiresAt: string
}
```

### 6.2 Tipos de Utilidad

```typescript
// lib/types/common.ts
export type Status = 'idle' | 'loading' | 'success' | 'error'

export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}
```

---

## 7. Componentes

### 7.1 Estructura de Componentes

```typescript
// components/ui/Button.tsx
'use client'

import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'rounded-md font-semibold transition-all duration-fast',
          {
            'bg-primary-500 text-white hover:bg-primary-600': variant === 'primary',
            'bg-transparent border-2 border-primary-500 text-primary-500': variant === 'secondary',
            'bg-transparent text-neutral-300': variant === 'tertiary',
            'px-4 py-2 text-sm': size === 'sm',
            'px-6 py-3 text-base': size === 'md',
            'px-8 py-4 text-lg': size === 'lg',
          },
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'
```

### 7.2 Utilidad `cn` (Class Names)

```typescript
// lib/utils.ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### 7.3 Componentes de Features

```typescript
// components/features/movies/MovieCard.tsx
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Star } from 'lucide-react'
import { Movie } from '@/lib/types/movie'

interface MovieCardProps {
  movie: Movie
}

export function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link href={`/pelicula/${movie.id}`}>
      <div className="group bg-bg-secondary rounded-lg overflow-hidden shadow-md hover:shadow-lg hover:scale-105 transition-all duration-normal">
        {/* Contenido */}
      </div>
    </Link>
  )
}
```

---

## 8. Configuración de Tailwind

### 8.1 Configuración Completa

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class', // O 'media' según preferencia
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef2f2',
          // ... resto de la paleta
          500: '#d7123a',
          // ...
        },
        secondary: {
          // ... paleta secundaria
          500: '#f5b400',
        },
        neutral: {
          // ... paleta neutra
        },
        success: '#2ecc71',
        warning: '#f39c12',
        error: '#e74c3c',
        info: '#3498db',
        'bg-primary': '#14090b',
        'bg-secondary': '#2a1b1f',
        'bg-tertiary': '#0d0809',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'sm': '0.25rem',
        'md': '0.5rem',
        'lg': '0.75rem',
        'xl': '1rem',
      },
      transitionDuration: {
        'fast': '120ms',
        'normal': '200ms',
        'slow': '300ms',
      },
      // ... más configuraciones (ver animation-guidelines.md)
    },
  },
  plugins: [],
}
```

### 8.2 Estilos Globales

```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Variables CSS si es necesario */
  }
  
  body {
    @apply bg-bg-primary text-neutral-50 antialiased;
  }
}

@layer components {
  /* Componentes reutilizables con @apply */
}

@layer utilities {
  /* Utilidades personalizadas */
}
```

---

## 9. Accesibilidad

### 9.1 ARIA Labels

```typescript
// Ejemplo: Botón sin texto visible
<button aria-label="Agregar al carrito">
  <ShoppingCart className="w-5 h-5" />
</button>

// Ejemplo: Estado de asiento
<button
  aria-label={`Asiento ${row}${number}, ${type === 'VIP' ? 'VIP' : 'General'}, ${status === 'AVAILABLE' ? 'disponible' : 'ocupado'}`}
  aria-pressed={selected}
  aria-disabled={status !== 'AVAILABLE'}
>
  {/* Icono de asiento */}
</button>
```

### 9.2 Navegación por Teclado

```typescript
// Ejemplo: Manejo de teclado en asientos
const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    handleSelect()
  }
}

<button
  onKeyDown={handleKeyDown}
  tabIndex={status === 'AVAILABLE' ? 0 : -1}
>
  {/* Contenido */}
</button>
```

### 9.3 Contraste y Colores

- Verificar contraste mínimo WCAG AA (4.5:1)
- No depender solo del color para transmitir información
- Usar iconos y texto además de color

---

## 10. Performance

### 10.1 Optimización de Imágenes

```typescript
// Usar Next.js Image component
import Image from 'next/image'

<Image
  src={movie.posterUrl}
  alt={movie.title}
  width={180}
  height={270}
  className="object-cover"
  loading="lazy"
  placeholder="blur"
/>
```

### 10.2 Code Splitting

```typescript
// Dynamic imports para componentes pesados
import dynamic from 'next/dynamic'

const SeatMap = dynamic(() => import('@/components/features/seats/SeatMap'), {
  loading: () => <SeatMapSkeleton />,
  ssr: false, // Si requiere APIs del navegador
})
```

### 10.3 Memoización

```typescript
// useMemo para cálculos costosos
const total = useMemo(() => {
  return items.reduce((sum, item) => sum + item.price, 0)
}, [items])

// useCallback para funciones pasadas como props
const handleSelect = useCallback((id: string) => {
  // lógica
}, [dependencies])
```

### 10.4 React Query Optimizations

```typescript
// Prefetching
queryClient.prefetchQuery({
  queryKey: ['movies'],
  queryFn: () => moviesApi.getAll(),
})

// Optimistic Updates
useMutation({
  mutationFn: updateSeat,
  onMutate: async (newSeat) => {
    await queryClient.cancelQueries({ queryKey: ['seats'] })
    const previous = queryClient.getQueryData(['seats'])
    queryClient.setQueryData(['seats'], (old) => [...old, newSeat])
    return { previous }
  },
  onError: (err, newSeat, context) => {
    queryClient.setQueryData(['seats'], context.previous)
  },
})
```

---

## 11. Manejo de Errores

### 11.1 Error Boundaries

```typescript
// app/error.tsx
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2>Algo salió mal</h2>
      <button onClick={reset}>Intentar de nuevo</button>
    </div>
  )
}
```

### 11.2 Estados de Error en React Query

```typescript
const { data, error, isLoading } = useMovies()

if (error) {
  return <ErrorState message="Error al cargar películas" />
}
```

### 11.3 Validación con Zod

```typescript
// lib/validations/order.ts
import { z } from 'zod'

export const createOrderSchema = z.object({
  showtimeId: z.string().min(1),
  seatIds: z.array(z.string()).min(1),
  products: z.array(z.object({
    productId: z.string(),
    quantity: z.number().min(1),
  })).optional(),
})

export type CreateOrderData = z.infer<typeof createOrderSchema>
```

---

## 12. Testing (Futuro)

### 12.1 Estrategia de Testing

- **Unit Tests:** Utilidades y funciones puras
- **Component Tests:** Componentes UI con React Testing Library
- **Integration Tests:** Flujos completos de usuario
- **E2E Tests:** Flujos críticos con Playwright o Cypress

### 12.2 Estructura de Tests

```
__tests__/
├── unit/
├── components/
├── integration/
└── e2e/
```

---

## 13. Variables de Entorno

### 13.1 Archivo `.env.local`

```bash
# API
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Mercado Pago
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=your_public_key

# Feature Flags
NEXT_PUBLIC_ENABLE_CONFITERIA=true
NEXT_PUBLIC_ENABLE_VIP_SEATS=true
```

### 13.2 Uso en Código

```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
```

---

## 14. Scripts y Comandos

### 14.1 package.json

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  }
}
```

---

## 15. Recursos Adicionales

- [Next.js Documentation](https://nextjs.org/docs)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## 16. Checklist de Implementación

### Setup Inicial
- [ ] Configurar Next.js con TypeScript
- [ ] Configurar Tailwind CSS
- [ ] Configurar React Query
- [ ] Configurar Zustand
- [ ] Configurar cliente API (Axios)
- [ ] Configurar estructura de carpetas

### Desarrollo
- [ ] Implementar componentes UI base
- [ ] Implementar páginas principales
- [ ] Implementar gestión de estado
- [ ] Implementar data fetching
- [ ] Implementar manejo de errores
- [ ] Implementar accesibilidad
- [ ] Optimizar performance

### Testing y Deploy
- [ ] Testing (unit, integration, e2e)
- [ ] Optimización de build
- [ ] Configuración de CI/CD
- [ ] Deploy a producción

