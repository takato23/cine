import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth';

const router = Router();

const movieSchema = z.object({
  title: z.string().min(1),
  originalTitle: z.string().optional(),
  synopsis: z.string().min(1),
  duration: z.number().int().positive(),
  genres: z.array(z.string()),
  rating: z.string().optional(),
  status: z.enum(['ESTRENO', 'CARTELERA', 'PROXIMAMENTE']),
  posterUrl: z.string().url().optional().or(z.literal('')),
  trailerUrl: z.string().url().optional().or(z.literal('')),
  releaseDate: z.string().datetime().optional(),
});

// Get all movies (public)
router.get('/', async (req, res, next) => {
  try {
    const { status } = req.query;

    const movies = await prisma.movie.findMany({
      where: status ? { status: status as any } : undefined,
      orderBy: { createdAt: 'desc' },
    });

    res.json(movies);
  } catch (error) {
    next(error);
  }
});

// Get movie by ID (public)
router.get('/:id', async (req, res, next) => {
  try {
    const movie = await prisma.movie.findUnique({
      where: { id: req.params.id },
      include: {
        showtimes: {
          where: {
            startTime: {
              gte: new Date(),
            },
          },
          orderBy: { startTime: 'asc' },
          include: {
            room: true,
          },
        },
      },
    });

    if (!movie) {
      throw new AppError('Movie not found', 404);
    }

    res.json(movie);
  } catch (error) {
    next(error);
  }
});

// Create movie (admin only)
router.post(
  '/',
  authenticate,
  requireRole('ADMIN'),
  async (req: AuthRequest, res, next) => {
    try {
      const data = movieSchema.parse(req.body);

      const movie = await prisma.movie.create({
        data: {
          ...data,
          releaseDate: data.releaseDate ? new Date(data.releaseDate) : null,
        },
      });

      res.status(201).json(movie);
    } catch (error) {
      next(error);
    }
  }
);

// Update movie (admin only)
router.put(
  '/:id',
  authenticate,
  requireRole('ADMIN'),
  async (req: AuthRequest, res, next) => {
    try {
      const data = movieSchema.partial().parse(req.body);

      const movie = await prisma.movie.update({
        where: { id: req.params.id },
        data: {
          ...data,
          releaseDate: data.releaseDate ? new Date(data.releaseDate) : undefined,
        },
      });

      res.json(movie);
    } catch (error) {
      next(error);
    }
  }
);

// Delete movie (admin only)
router.delete(
  '/:id',
  authenticate,
  requireRole('ADMIN'),
  async (req: AuthRequest, res, next) => {
    try {
      await prisma.movie.delete({
        where: { id: req.params.id },
      });

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

export { router as moviesRouter };

