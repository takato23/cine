import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth';

const router = Router();

const showtimeSchema = z.object({
  movieId: z.string(),
  roomId: z.string(),
  startTime: z.string().datetime(),
  format: z.enum(['TWO_D', 'THREE_D', 'IMAX']).default('TWO_D'),
  language: z.string().default('es'),
  subtitles: z.string().optional(),
  pricingRuleId: z.string().optional(),
});

// Get showtimes (public)
router.get('/', async (req, res, next) => {
  try {
    const { movieId, roomId, date } = req.query;

    const where: any = {};

    if (movieId) where.movieId = movieId as string;
    if (roomId) where.roomId = roomId as string;
    if (date) {
      const startDate = new Date(date as string);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);

      where.startTime = {
        gte: startDate,
        lt: endDate,
      };
    } else {
      where.startTime = { gte: new Date() };
    }

    const showtimes = await prisma.showtime.findMany({
      where,
      include: {
        movie: true,
        room: true,
        pricingRule: true,
      },
      orderBy: { startTime: 'asc' },
    });

    res.json(showtimes);
  } catch (error) {
    next(error);
  }
});

// Get showtime by ID (public)
router.get('/:id', async (req, res, next) => {
  try {
    const showtime = await prisma.showtime.findUnique({
      where: { id: req.params.id },
      include: {
        movie: true,
        room: true,
        pricingRule: true,
      },
    });

    if (!showtime) {
      throw new AppError('Showtime not found', 404);
    }

    res.json(showtime);
  } catch (error) {
    next(error);
  }
});

// Get showtime by ID with seat availability
router.get('/:id/seats', async (req, res, next) => {
  try {
    const showtime = await prisma.showtime.findUnique({
      where: { id: req.params.id },
      include: {
        movie: true,
        room: true,
        pricingRule: true,
        seatLocks: {
          where: {
            lockedUntil: { gt: new Date() },
          },
        },
        orderItems: {
          where: {
            order: {
              status: { in: ['PAID', 'PENDING'] },
            },
          },
        },
      },
    });

    if (!showtime) {
      throw new AppError('Showtime not found', 404);
    }

    const roomLayout = showtime.room.layout as any;
    const occupiedSeats = new Set(
      showtime.orderItems
        .filter((item: any) => item.row && item.seatNumber)
        .map((item: any) => `${item.row}-${item.seatNumber}`)
    );
    const lockedSeats = new Set(
      showtime.seatLocks.map((lock: any) => `${lock.row}-${lock.seatNumber}`)
    );

    const seats = roomLayout.rows.map((row: any) => ({
      letter: row.letter,
      seats: row.seats.map((seat: any) => ({
        number: seat.number,
        type: seat.type,
        available: !occupiedSeats.has(`${row.letter}-${seat.number}`),
        locked: lockedSeats.has(`${row.letter}-${seat.number}`),
      })),
    }));

    res.json({
      showtime: {
        id: showtime.id,
        movie: showtime.movie,
        room: showtime.room,
        startTime: showtime.startTime,
        format: showtime.format,
        language: showtime.language,
        subtitles: showtime.subtitles,
        pricingRule: showtime.pricingRule,
      },
      seats,
    });
  } catch (error) {
    next(error);
  }
});

// Create showtime (admin only)
router.post(
  '/',
  authenticate,
  requireRole('ADMIN'),
  async (req: AuthRequest, res, next) => {
    try {
      const data = showtimeSchema.parse(req.body);

      const showtime = await prisma.showtime.create({
        data: {
          ...data,
          startTime: new Date(data.startTime),
        },
        include: {
          movie: true,
          room: true,
        },
      });

      res.status(201).json(showtime);
    } catch (error) {
      next(error);
    }
  }
);

// Update showtime (admin only)
router.put(
  '/:id',
  authenticate,
  requireRole('ADMIN'),
  async (req: AuthRequest, res, next) => {
    try {
      const data = showtimeSchema.partial().parse(req.body);

      const showtime = await prisma.showtime.update({
        where: { id: req.params.id },
        data: {
          ...data,
          startTime: data.startTime ? new Date(data.startTime) : undefined,
        },
        include: {
          movie: true,
          room: true,
        },
      });

      res.json(showtime);
    } catch (error) {
      next(error);
    }
  }
);

// Delete showtime (admin only)
router.delete(
  '/:id',
  authenticate,
  requireRole('ADMIN'),
  async (req: AuthRequest, res, next) => {
    try {
      await prisma.showtime.delete({
        where: { id: req.params.id },
      });

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

export { router as showtimesRouter };

