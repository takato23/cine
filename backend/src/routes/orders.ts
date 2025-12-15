import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { authenticate, AuthRequest } from '../middleware/auth';
import { createPaymentPreference } from '../services/mercadopago';
import { getRedisClient } from '../lib/redis';

const router = Router();

const orderItemSchema = z.object({
  type: z.enum(['ticket', 'product']),
  showtimeId: z.string().optional(),
  productId: z.string().optional(),
  row: z.string().optional(),
  seatNumber: z.number().optional(),
  quantity: z.number().int().positive().default(1),
});

const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1),
});

// Lock seats temporarily
router.post('/lock-seats', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const { showtimeId, seats } = req.body; // seats: [{ row, seatNumber }]

    if (!showtimeId || !Array.isArray(seats) || seats.length === 0) {
      throw new AppError('Invalid request', 400);
    }

    const showtime = await prisma.showtime.findUnique({
      where: { id: showtimeId },
      include: {
        orderItems: {
          where: {
            order: {
              status: { in: ['PAID', 'PENDING'] },
            },
          },
        },
        seatLocks: {
          where: {
            lockedUntil: { gt: new Date() },
          },
        },
      },
    });

    if (!showtime) {
      throw new AppError('Showtime not found', 404);
    }

    const occupiedSeats = new Set(
      showtime.orderItems
        .filter((item: any) => item.row && item.seatNumber)
        .map((item: any) => `${item.row}-${item.seatNumber}`)
    );

    const lockedSeats = new Set(
      showtime.seatLocks.map((lock: any) => `${lock.row}-${lock.seatNumber}`)
    );

    // Check if seats are available
    for (const seat of seats) {
      const seatKey = `${seat.row}-${seat.seatNumber}`;
      if (occupiedSeats.has(seatKey) || lockedSeats.has(seatKey)) {
        throw new AppError(`Seat ${seat.row}${seat.seatNumber} is not available`, 400);
      }
    }

    // Lock seats for 15 minutes (alineado con expiración típica de checkout)
    const lockedUntil = new Date(Date.now() + 15 * 60 * 1000);

    const locks = await Promise.all(
      seats.map((seat) =>
        prisma.seatLock.create({
          data: {
            showtimeId,
            row: seat.row,
            seatNumber: seat.seatNumber,
            lockedUntil,
          },
        })
      )
    );

    // Store in Redis for cleanup
    const redis = await getRedisClient();
    for (const lock of locks) {
      await redis.setEx(
        `seat-lock:${showtimeId}:${lock.row}:${lock.seatNumber}`,
        900,
        lock.id
      );
    }

    res.json({ locks, expiresAt: lockedUntil });
  } catch (error) {
    next(error);
  }
});

// Create order
router.post('/', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const data = createOrderSchema.parse(req.body);
    const userId = req.userId!;

    // Calculate totals
    let subtotal = 0;
    const orderItemsData: any[] = [];

    for (const item of data.items) {
      if (item.type === 'ticket') {
        if (!item.showtimeId || !item.row || !item.seatNumber) {
          throw new AppError('Ticket items require showtimeId, row, and seatNumber', 400);
        }

        const showtime = await prisma.showtime.findUnique({
          where: { id: item.showtimeId },
          include: {
            pricingRule: true,
            room: true,
          },
        });

        if (!showtime) {
          throw new AppError('Showtime not found', 404);
        }

        // Check seat availability
        const existingOrder = await prisma.orderItem.findFirst({
          where: {
            showtimeId: item.showtimeId,
            row: item.row,
            seatNumber: item.seatNumber,
            order: {
              status: { in: ['PAID', 'PENDING'] },
            },
          },
        });

        if (existingOrder) {
          throw new AppError(`Seat ${item.row}${item.seatNumber} is already taken`, 400);
        }

        // Calculate price
        const roomLayout = showtime.room.layout as any;
        const seat = roomLayout.rows
          .find((r: any) => r.letter === item.row)
          ?.seats.find((s: any) => s.number === item.seatNumber);

        if (!seat) {
          throw new AppError('Invalid seat', 400);
        }

        let price = showtime.pricingRule?.basePrice || 5000; // default price
        if (seat.type === 'VIP') {
          price *= 1.5; // VIP premium
        }

        const itemTotal = price * item.quantity;
        subtotal += itemTotal;

        orderItemsData.push({
          type: 'ticket',
          showtimeId: item.showtimeId,
          row: item.row,
          seatNumber: item.seatNumber,
          quantity: item.quantity,
          unitPrice: price,
          totalPrice: itemTotal,
        });
      } else if (item.type === 'product') {
        if (!item.productId) {
          throw new AppError('Product items require productId', 400);
        }

        const product = await prisma.product.findUnique({
          where: { id: item.productId },
        });

        if (!product || !product.isActive) {
          throw new AppError('Product not found or inactive', 404);
        }

        if (product.stock !== null && product.stock < item.quantity) {
          throw new AppError('Insufficient stock', 400);
        }

        const itemTotal = product.price * item.quantity;
        subtotal += itemTotal;

        orderItemsData.push({
          type: 'product',
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: product.price,
          totalPrice: itemTotal,
        });
      }
    }

    const serviceFee = subtotal * 0.05; // 5% service fee
    const total = subtotal + serviceFee;

    // Create order
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    const order = await prisma.order.create({
      data: {
        userId,
        subtotal,
        serviceFee,
        total,
        expiresAt,
        status: 'PENDING',
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: {
          include: {
            showtime: {
              include: {
                movie: true,
                room: true,
              },
            },
            product: true,
          },
        },
      },
    });

    // Create payment preference
    const payment = await createPaymentPreference(order);

    // Asociar locks a la orden (si existían) para limpieza posterior
    const ticketItems = order.items.filter((item: any) => item.type === 'ticket' && item.showtimeId && item.row && item.seatNumber);
    await Promise.all(
      ticketItems.map((item: any) =>
        prisma.seatLock.updateMany({
          where: {
            orderId: null,
            showtimeId: item.showtimeId!,
            row: item.row!,
            seatNumber: item.seatNumber!,
            lockedUntil: { gt: new Date() },
          },
          data: { orderId: order.id },
        })
      )
    );

    res.status(201).json({
      order,
      payment: {
        id: payment.id,
        qrCode: payment.qrCodeBase64,
        qrCodeUrl: payment.qrCode,
        expiresAt: payment.expiresAt,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get order by ID
router.get('/:id', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: {
        items: {
          include: {
            showtime: {
              include: {
                movie: true,
                room: true,
              },
            },
            product: true,
          },
        },
        payment: true,
      },
    });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    // Check ownership (unless admin)
    if (order.userId !== req.userId && req.userRole !== 'ADMIN') {
      throw new AppError('Forbidden', 403);
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
});

// Get user orders
router.get('/user/me', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.userId },
      include: {
        items: {
          include: {
            showtime: {
              include: {
                movie: true,
                room: true,
              },
            },
            product: true,
          },
        },
        payment: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(orders);
  } catch (error) {
    next(error);
  }
});

export { router as ordersRouter };

