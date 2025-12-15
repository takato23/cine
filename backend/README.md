# Backend API - Cinema Pergamino

API REST para el sistema de gestión de cine.

## Instalación

```bash
npm install
```

## Configuración

1. Copia `env.example` a `.env` y configura las variables:

```bash
cp env.example .env
```

2. Configura la base de datos PostgreSQL y actualiza `DATABASE_URL`

3. Ejecuta las migraciones:

```bash
npm run db:migrate
npm run db:generate
```

4. (Opcional) Ejecuta el seed para datos iniciales:

```bash
npm run db:seed
```

## Desarrollo

```bash
npm run dev
```

El servidor se ejecutará en `http://localhost:3001`

## Endpoints Principales

### Autenticación
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Usuario actual

### Películas
- `GET /api/movies` - Listar películas
- `GET /api/movies/:id` - Obtener película
- `POST /api/movies` - Crear película (admin)
- `PUT /api/movies/:id` - Actualizar película (admin)
- `DELETE /api/movies/:id` - Eliminar película (admin)

### Funciones
- `GET /api/showtimes` - Listar funciones
- `GET /api/showtimes/:id/seats` - Obtener disponibilidad de asientos
- `POST /api/showtimes` - Crear función (admin)
- `PUT /api/showtimes/:id` - Actualizar función (admin)
- `DELETE /api/showtimes/:id` - Eliminar función (admin)

### Salas
- `GET /api/rooms` - Listar salas
- `GET /api/rooms/:id` - Obtener sala
- `POST /api/rooms` - Crear sala (admin)
- `PUT /api/rooms/:id` - Actualizar sala (admin)
- `DELETE /api/rooms/:id` - Eliminar sala (admin)

### Productos
- `GET /api/products` - Listar productos
- `GET /api/products/:id` - Obtener producto
- `POST /api/products` - Crear producto (admin)
- `PUT /api/products/:id` - Actualizar producto (admin)
- `DELETE /api/products/:id` - Eliminar producto (admin)

### Órdenes
- `POST /api/orders/lock-seats` - Bloquear asientos temporalmente
- `POST /api/orders` - Crear orden
- `GET /api/orders/:id` - Obtener orden
- `GET /api/orders/user/me` - Mis órdenes

### Admin
- `GET /api/admin/pricing-rules` - Reglas de precios
- `POST /api/admin/pricing-rules` - Crear regla de precio
- `GET /api/admin/promotions` - Promociones
- `POST /api/admin/promotions` - Crear promoción
- `GET /api/admin/reports/sales` - Reporte de ventas
- `GET /api/admin/reports/occupancy` - Reporte de ocupación

### Pagos
- `POST /api/payments/webhook` - Webhook de Mercado Pago

## Estructura

```
src/
  ├── index.ts              # Entry point
  ├── lib/                  # Utilidades
  │   ├── prisma.ts
  │   └── redis.ts
  ├── middleware/           # Middlewares
  │   ├── auth.ts
  │   └── errorHandler.ts
  ├── routes/               # Rutas
  │   ├── auth.ts
  │   ├── movies.ts
  │   ├── showtimes.ts
  │   ├── rooms.ts
  │   ├── products.ts
  │   ├── orders.ts
  │   ├── admin.ts
  │   └── payments.ts
  ├── services/             # Servicios
  │   └── mercadopago.ts
  └── prisma/
      └── seed.ts
```

