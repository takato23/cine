# Frontend - Cinema Pergamino

Aplicación web cliente y panel administrativo construida con Next.js 14.

## Características

- **Interfaz Premium**: Diseño moderno y limpio con Tailwind CSS
- **Cliente**: Cartelera, selección de asientos, confitería, checkout
- **Panel Admin**: Gestión completa de películas, funciones, precios, productos
- **POS**: Sistema de punto de venta para vendedores
- **Responsive**: Optimizado para desktop y mobile

## Instalación

```bash
npm install
```

## Configuración

1. Copia `env.example` a `.env.local`:

```bash
cp env.example .env.local
```

2. Configura la URL de la API:

```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Desarrollo

```bash
npm run dev
```

La aplicación se ejecutará en `http://localhost:3000`

## Estructura

```
app/
  ├── cartelera/          # Página principal con cartelera
  ├── confiteria/         # Catálogo de productos
  ├── pos/                # Sistema POS para vendedores
  ├── admin/              # Panel de administración
  └── login/              # Autenticación

components/
  ├── Navigation.tsx      # Barra de navegación
  ├── MovieCard.tsx       # Tarjeta de película
  └── FeaturedMovie.tsx  # Película destacada

lib/
  ├── api.ts              # Cliente API
  └── store.ts            # Estado global (Zustand)
```

## Tecnologías

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- TanStack Query
- Zustand
- Axios

