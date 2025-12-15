import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth';

const router = Router();

// All routes require admin role
router.use(authenticate);
router.use(requireRole('ADMIN'));

// Pricing Rules
const pricingRuleSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  seatType: z.enum(['STANDARD', 'VIP']),
  basePrice: z.number().positive(),
  roomId: z.string().optional(),
  dayOfWeek: z.number().int().min(0).max(6).optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  isActive: z.boolean().default(true),
});

router.get('/pricing-rules', async (req, res, next) => {
  try {
    const rules = await prisma.pricingRule.findMany({
      include: { room: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(rules);
  } catch (error) {
    next(error);
  }
});

router.post('/pricing-rules', async (req: AuthRequest, res, next) => {
  try {
    const data = pricingRuleSchema.parse(req.body);
    const rule = await prisma.pricingRule.create({ data });
    res.status(201).json(rule);
  } catch (error) {
    next(error);
  }
});

router.put('/pricing-rules/:id', async (req: AuthRequest, res, next) => {
  try {
    const data = pricingRuleSchema.partial().parse(req.body);
    const rule = await prisma.pricingRule.update({
      where: { id: req.params.id },
      data,
    });
    res.json(rule);
  } catch (error) {
    next(error);
  }
});

router.delete('/pricing-rules/:id', async (req: AuthRequest, res, next) => {
  try {
    await prisma.pricingRule.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// Promotions
const promotionSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  productId: z.string().optional(),
  dayOfWeek: z.number().int().min(0).max(6).optional(),
  discount: z.number().positive(),
  isActive: z.boolean().default(true),
  validFrom: z.string().datetime().optional(),
  validUntil: z.string().datetime().optional(),
});

router.get('/promotions', async (req, res, next) => {
  try {
    const promotions = await prisma.promotion.findMany({
      include: { product: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(promotions);
  } catch (error) {
    next(error);
  }
});

router.post('/promotions', async (req: AuthRequest, res, next) => {
  try {
    const data = promotionSchema.parse(req.body);
    const promotion = await prisma.promotion.create({
      data: {
        ...data,
        validFrom: data.validFrom ? new Date(data.validFrom) : null,
        validUntil: data.validUntil ? new Date(data.validUntil) : null,
      },
    });
    res.status(201).json(promotion);
  } catch (error) {
    next(error);
  }
});

router.put('/promotions/:id', async (req: AuthRequest, res, next) => {
  try {
    const data = promotionSchema.partial().parse(req.body);
    const promotion = await prisma.promotion.update({
      where: { id: req.params.id },
      data: {
        ...data,
        validFrom: data.validFrom ? new Date(data.validFrom) : undefined,
        validUntil: data.validUntil ? new Date(data.validUntil) : undefined,
      },
    });
    res.json(promotion);
  } catch (error) {
    next(error);
  }
});

router.delete('/promotions/:id', async (req: AuthRequest, res, next) => {
  try {
    await prisma.promotion.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// Reports
router.get('/reports/sales', async (req: AuthRequest, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const where: any = {
      status: 'PAID',
    };

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate as string);
      if (endDate) where.createdAt.lte = new Date(endDate as string);
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            product: true,
            showtime: {
              include: {
                movie: true,
              },
            },
          },
        },
      },
    });

    const totalSales = orders.reduce((sum: number, order: any) => sum + order.total, 0);
    const totalTickets = orders.reduce(
      (sum: number, order: any) =>
        sum +
        order.items
          .filter((item: any) => item.type === 'ticket')
          .reduce((s: number, i: any) => s + i.quantity, 0),
      0
    );
    const totalProducts = orders.reduce(
      (sum: number, order: any) =>
        sum +
        order.items
          .filter((item: any) => item.type === 'product')
          .reduce((s: number, i: any) => s + i.quantity, 0),
      0
    );

    res.json({
      period: {
        start: startDate || null,
        end: endDate || null,
      },
      summary: {
        totalSales,
        totalOrders: orders.length,
        totalTickets,
        totalProducts,
      },
      orders,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/reports/occupancy', async (req: AuthRequest, res, next) => {
  try {
    const { showtimeId } = req.query;

    if (!showtimeId) {
      return res.status(400).json({ error: 'showtimeId is required' });
    }

    const showtime = await prisma.showtime.findUnique({
      where: { id: showtimeId as string },
      include: {
        room: true,
        orderItems: {
          where: {
            order: {
              status: 'PAID',
            },
          },
        },
      },
    });

    if (!showtime) {
      return res.status(404).json({ error: 'Showtime not found' });
    }

    const roomLayout = showtime.room.layout as any;
    const totalSeats = roomLayout.rows.reduce(
      (sum: number, row: any) => sum + row.seats.length,
      0
    );
    const occupiedSeats = showtime.orderItems.length;
    const occupancyRate = (occupiedSeats / totalSeats) * 100;

    res.json({
      showtime: {
        id: showtime.id,
        movie: showtime.movieId,
        room: showtime.room.name,
        startTime: showtime.startTime,
      },
      occupancy: {
        totalSeats,
        occupiedSeats,
        availableSeats: totalSeats - occupiedSeats,
        occupancyRate: Math.round(occupancyRate * 100) / 100,
      },
    });
  } catch (error) {
    next(error);
  }
});

export { router as adminRouter };

