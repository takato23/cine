# Backend v1 (propuesta) — SeatLock + Orders + MP + Auditoría

Objetivo: soportar el flujo premium web (asientos → confitería → checkout) con timer real, re-lock/extend, órdenes idempotentes y webhooks de Mercado Pago, sin reventar el stack actual (Express + Prisma + MP + Redis opcional).

## 1) Modelos mínimos (Prisma / DB)

### `SeatLock`
- `id` (uuid)
- `showtimeId`
- `userId` (nullable si se permite guest) / `sessionId` (string)
- `status` (`ACTIVE` | `EXPIRED` | `RELEASED`)
- `expiresAt` (datetime, index)
- `createdAt`, `updatedAt`

### `SeatLockSeat`
- `id` (uuid)
- `seatLockId`
- `row` (string)
- `seatNumber` (int)
- `lockedUntil` (datetime) — normalmente == `SeatLock.expiresAt`
- `unique(showtimeId, row, seatNumber)` para evitar doble lock

### `Order`
- `id` (uuid)
- `userId` (nullable para guest) / `sessionId`
- `status` (`PENDING` | `PAID` | `CANCELLED` | `EXPIRED`)
- `expiresAt` (datetime, index) — vencimiento de pago / checkout
- `subtotal`, `serviceFee`, `total`
- `seatLockId` (nullable) — referencia al lock usado
- `idempotencyKey` (string, unique por canal+user/session)
- `channel` (`web` | `pos` | `mobile`)
- `createdAt`, `updatedAt`

### `OrderItem`
- `id`
- `orderId`
- `type` (`ticket` | `product`)
- `showtimeId` (nullable)
- `row`, `seatNumber` (nullable)
- `productId` (nullable)
- `quantity`
- `unitPrice`, `totalPrice`

### `Payment` (Mercado Pago)
- `id` (uuid) — interno
- `provider` (`mercadopago`)
- `providerPaymentId` (string, unique) — id real MP
- `orderId` (unique)
- `status` (`PENDING` | `APPROVED` | `REJECTED` | `CANCELLED`)
- `qrCode` (text nullable) / `qrCodeUrl` (text nullable)
- `expiresAt` (datetime nullable)
- `raw` (json nullable) — payload de MP útil para debug
- `createdAt`, `updatedAt`

### `WebhookEvent` (idempotencia webhooks)
- `id` (uuid)
- `provider` (`mercadopago`)
- `eventId` / `topic+resourceId` (unique) — depende de MP
- `payload` (json)
- `processedAt` (datetime nullable)
- `createdAt`

### `AuditLog` (auditoría v1)
- `id` (uuid)
- `actorUserId` (nullable)
- `actorRole` (string nullable)
- `action` (string) — ej: `ORDER_CREATE`, `SEATLOCK_REFRESH`, `PAYMENT_APPROVED`
- `entityType` (string), `entityId` (string)
- `metadata` (json)
- `createdAt`

## 2) Endpoints (contratos recomendados)

### Seat locks

**POST** `/orders/lock-seats`
- Request:
  - `showtimeId`
  - `seats: [{ row, seatNumber }]`
  - (opcional) `extendExisting: boolean`
- Response (mantener compatible):
  - `expiresAt`
  - `locks: [{ id, showtimeId, row, seatNumber, lockedUntil }]`

**POST** `/orders/lock-seats/refresh`
- Request:
  - `showtimeId`
  - `seats: [{ row, seatNumber }]`
- Response:
  - mismo shape que lock (renueva `expiresAt`)
- Reglas:
  - solo permite refresh si el lock pertenece al `userId/sessionId`
  - si ya expiró → 409 con mensaje claro (para re-lock UI)

**POST** `/orders/lock-seats/release`
- Request:
  - `showtimeId`
  - `seats: [{ row, seatNumber }]` (o `seatLockId`)
- Response: `{ ok: true }`
- Uso: liberar explícitamente al cancelar/volver atrás (nice-to-have v1).

**GET** `/showtimes/:id/seats`
- Response:
  - `seats[].seats[].available`
  - `seats[].seats[].locked`
  - (opcional v1.1) `lockedByMe: boolean` para UX más clara.

### Orders (idempotencia + estado)

**POST** `/orders`
- Headers:
  - `Idempotency-Key: <uuid>` (recomendado)
- Request:
  - `items: OrderItemInput[]`
  - `channel: 'web'|'pos'|'mobile'`
  - (opcional) `seatLockId`
- Response:
  - `{ order, payment }` (mantener shape actual)
- Reglas:
  - Si se repite `Idempotency-Key` → devolver misma orden (200) sin duplicar.
  - Si hay tickets: validar lock activo y que incluya esos asientos.
  - `expiresAt`: vencimiento de la orden/pago (para timer checkout real).

**GET** `/orders/:id`
- Response:
  - `order` con `expiresAt`, `payment.status` y `payment.expiresAt`.

### Webhooks Mercado Pago

**POST** `/payments/mp/webhook`
- Request:
  - payload MP (topic, id, etc.)
- Reglas:
  - Registrar `WebhookEvent` primero (unique) → idempotencia.
  - Resolver `providerPaymentId` → `Payment` → `Order`.
  - Transicionar `Order.status` y `Payment.status`.
  - Auditar cambios (AuditLog).

## 3) Comportamiento del timer (v1)

- `SeatLock.expiresAt` es la fuente de verdad (server).
- Cliente muestra countdown usando `expiresAt`:
  - warning a 60s
  - al expirar: UI “expiró” + botón “reintentar” (re-lock / refresh).
- Estrategia recomendada:
  - refresh permitido si faltan < X minutos y el usuario sigue activo (anti-abuso).
  - TTL en Redis (si existe) y reconciliación en DB.

## 4) Cambios mínimos para v1 (sin romper)

- Mantener `POST /orders/lock-seats` y `POST /orders` tal como están, pero:
  - asegurar que ambos devuelvan `expiresAt` consistente
  - implementar `Idempotency-Key` en `POST /orders`
  - agregar `/orders/lock-seats/refresh` (o `PATCH /seat-locks/:id`)
  - persistir `SeatLock` y `SeatLockSeat` (DB) + invalidación por expiración.
- Implementar dedupe de webhooks con `WebhookEvent`.
- Agregar `AuditLog` para trazabilidad mínima.

