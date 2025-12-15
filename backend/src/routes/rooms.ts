import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth';

const router = Router();

const roomSchema = z.object({
  name: z.string(),
  capacity: z.number().int().positive(),
  layout: z.any().default({}), // JSON structure - default to empty object
  seatingMode: z.enum(['ASSIGNED', 'GENERAL']).optional(),
});

// Get all rooms (public)
router.get('/', async (req, res, next) => {
  try {
    const rooms = await prisma.room.findMany({
      orderBy: { name: 'asc' },
    });

    res.json(rooms);
  } catch (error) {
    next(error);
  }
});

// Get room by ID (public)
router.get('/:id', async (req, res, next) => {
  try {
    const room = await prisma.room.findUnique({
      where: { id: req.params.id },
    });

    if (!room) {
      throw new AppError('Room not found', 404);
    }

    res.json(room);
  } catch (error) {
    next(error);
  }
});

// Create room (admin only)
router.post(
  '/',
  authenticate,
  requireRole('ADMIN'),
  async (req: AuthRequest, res, next) => {
    try {
      const data = roomSchema.parse(req.body);

      const room = await prisma.room.create({
        data,
      });

      res.status(201).json(room);
    } catch (error) {
      next(error);
    }
  }
);

// Update room (admin only) - supports PATCH
router.patch(
  '/:id',
  authenticate,
  requireRole('ADMIN'),
  async (req: AuthRequest, res, next) => {
    try {
      const data = roomSchema.partial().parse(req.body);

      const room = await prisma.room.update({
        where: { id: req.params.id },
        data,
      });

      res.json(room);
    } catch (error) {
      next(error);
    }
  }
);

// Delete room (admin only)
router.delete(
  '/:id',
  authenticate,
  requireRole('ADMIN'),
  async (req: AuthRequest, res, next) => {
    try {
      await prisma.room.delete({
        where: { id: req.params.id },
      });

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

export { router as roomsRouter };
