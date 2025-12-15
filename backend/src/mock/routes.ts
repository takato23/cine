import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { jwtSecret } from '../config';
import { mockAuth, mockCatalog, mockOrders, mockReports, mockSeats } from './mockService';

type UserRole = 'ADMIN' | 'STAFF' | 'CLIENT';

const router = Router();

const authenticate = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No autorizado (mock)' });
  try {
    const decoded = jwt.verify(token, jwtSecret) as { userId: string; role: UserRole };
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido (mock)' });
  }
};

const requireRole = (...roles: UserRole[]) => (req: any, res: any, next: any) => {
  if (!req.userRole || !roles.includes(req.userRole)) {
    return res.status(403).json({ error: 'Sin permisos' });
  }
  next();
};

// Health
router.get('/health/mock', (_req, res) => {
  res.json({ status: 'ok', mode: 'mock', timestamp: new Date().toISOString() });
});

// Auth
router.post('/auth/register', (req, res) => {
  try {
    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
      name: z.string().optional(),
    });
    const data = schema.parse(req.body);
    const result = mockAuth.register(data);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Error de registro' });
  }
});

router.post('/auth/login', (req, res) => {
  try {
    const schema = z.object({
      email: z.string().email(),
      password: z.string(),
    });
    const data = schema.parse(req.body);
    const result = mockAuth.login(data);
    res.json(result);
  } catch (err: any) {
    res.status(401).json({ error: err.message || 'Credenciales inválidas' });
  }
});

router.get('/auth/me', authenticate, (req: any, res) => {
  try {
    const user = mockAuth.me(req.userId);
    res.json(user);
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
});

// Catálogo público
router.get('/movies', (req, res) => {
  const { status } = req.query;
  const movies = mockCatalog.movies(status as string | undefined);
  res.json(movies);
});

router.get('/movies/:id', (req, res) => {
  const movie = mockCatalog.movieById(req.params.id);
  if (!movie) return res.status(404).json({ error: 'Película no encontrada' });
  const showtimes = mockCatalog.showtimes({ movieId: movie.id });
  res.json({ ...movie, showtimes });
});

router.get('/showtimes', (req, res) => {
  const { movieId, roomId, date } = req.query;
  const showtimes = mockCatalog.showtimes({
    movieId: movieId as string | undefined,
    roomId: roomId as string | undefined,
    date: date as string | undefined,
  });
  res.json(showtimes);
});

router.get('/showtimes/:id', (req, res) => {
  const showtime = mockCatalog.showtimeById(req.params.id);
  if (!showtime) return res.status(404).json({ error: 'Función no encontrada' });
  res.json(showtime);
});

router.get('/showtimes/:id/seats', (req, res) => {
  try {
    const data = mockSeats.availability(req.params.id);
    if (!data) return res.status(404).json({ error: 'Función no encontrada' });
    res.json(data);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/rooms', (_req, res) => {
  res.json(mockCatalog.rooms());
});

// PATCH room (admin only) - supports seatingMode toggle
router.patch('/rooms/:id', authenticate, requireRole('ADMIN'), (req, res) => {
  const rooms = mockCatalog.rooms();
  const room = rooms.find(r => r.id === req.params.id);
  if (!room) return res.status(404).json({ error: 'Room not found' });

  // Merge updates (persisting in memory for the session)
  Object.assign(room, req.body);

  res.json(room);
});

router.get('/promos', (_req, res) => {
  res.json(mockCatalog.promotions());
});

// Productos / Confitería
router.get('/products', (req, res) => {
  const { category, active } = req.query;
  const products = mockCatalog.products({
    category: category as string | undefined,
    active: active === undefined ? true : active === 'true',
  });
  res.json(products);
});

router.get('/products/:id', (req, res) => {
  const product = mockCatalog.products({}).find((p) => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
  res.json(product);
});

// Locks de asientos
router.post('/orders/lock-seats', authenticate, (req: any, res) => {
  try {
    const schema = z.object({
      showtimeId: z.string(),
      seats: z.array(
        z.object({
          row: z.string(),
          seatNumber: z.number().int().positive(),
        })
      ),
    });
    const data = schema.parse(req.body);
    const result = mockOrders.lockSeats(data.showtimeId, data.seats, req.userId);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Orden y checkout
router.post('/orders', authenticate, (req: any, res) => {
  try {
    const schema = z.object({
      items: z.array(
        z.object({
          type: z.enum(['ticket', 'product']),
          showtimeId: z.string().optional(),
          productId: z.string().optional(),
          row: z.string().optional(),
          seatNumber: z.number().int().positive().optional(),
          quantity: z.number().int().positive().optional(),
        })
      ),
      channel: z.enum(['web', 'mobile', 'pos']).optional(),
    });
    const data = schema.parse(req.body);
    const { order, payment } = mockOrders.createOrder(req.userId, data);
    res.status(201).json({
      order,
      payment: {
        id: payment.id,
        qrCode: payment.qrCodeBase64,
        qrCodeUrl: payment.qrCode,
        expiresAt: payment.expiresAt,
      },
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/orders/:id', authenticate, (req: any, res) => {
  try {
    const order = mockOrders.getOrder(req.params.id, req.userId, req.userRole);
    res.json(order);
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
});

router.get('/orders/user/me', authenticate, (req: any, res) => {
  const data = mockOrders.listUserOrders(req.userId);
  res.json(data);
});

// POS atajos
router.get('/pos/showtimes', authenticate, requireRole('STAFF', 'ADMIN'), (req, res) => {
  const { date } = req.query;
  const showtimes = mockCatalog.showtimes({ date: date as string | undefined });
  res.json(showtimes);
});

router.post('/pos/orders', authenticate, requireRole('STAFF', 'ADMIN'), (req: any, res) => {
  try {
    const schema = z.object({
      items: z.array(
        z.object({
          type: z.enum(['ticket', 'product']),
          showtimeId: z.string().optional(),
          productId: z.string().optional(),
          row: z.string().optional(),
          seatNumber: z.number().int().positive().optional(),
          quantity: z.number().int().positive().optional(),
        })
      ),
    });
    const data = schema.parse(req.body);
    const { order, payment } = mockOrders.createOrder(req.userId, { ...data, channel: 'pos' });
    res.status(201).json({
      order,
      payment: {
        id: payment.id,
        qrCode: payment.qrCodeBase64,
        qrCodeUrl: payment.qrCode,
        expiresAt: payment.expiresAt,
      },
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Admin (lectura)
router.get('/admin/pricing-rules', authenticate, requireRole('ADMIN'), (_req, res) => {
  res.json(mockCatalog.showtimes({}).map((s) => s.pricingRule).filter(Boolean));
});

router.get('/admin/reports/sales', authenticate, requireRole('ADMIN'), (_req, res) => {
  res.json(mockReports.sales());
});

router.get('/admin/reports/occupancy', authenticate, requireRole('ADMIN'), (req, res) => {
  const { showtimeId } = req.query;
  if (!showtimeId) return res.status(400).json({ error: 'showtimeId requerido' });
  try {
    const data = mockReports.occupancy(showtimeId as string);
    res.json(data);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Pagos (mock)
router.post('/payments/mp/webhook', (req, res) => {
  const { paymentId } = req.body;
  if (!paymentId) return res.status(400).json({ error: 'paymentId requerido' });
  try {
    const payment = mockOrders.simulateWebhook(paymentId);
    res.json({ ok: true, payment });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export { router as mockRouter };
