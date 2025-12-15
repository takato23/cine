import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth';

const router = Router();

const productSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  category: z.enum(['POCHOCLOS', 'BEBIDAS', 'SNACKS', 'COMBOS']),
  price: z.number().positive(),
  imageUrl: z.string().url().optional().or(z.literal('')),
  stock: z.number().int().positive().optional(),
  isActive: z.boolean().default(true),
  variations: z.any().optional(),
});

// Get all products (public)
router.get('/', async (req, res, next) => {
  try {
    const { category, active } = req.query;

    const products = await prisma.product.findMany({
      where: {
        ...(category && { category: category as any }),
        ...(active !== undefined && { isActive: active === 'true' }),
      },
      orderBy: { name: 'asc' },
    });

    // Apply promotions
    const productsWithPromos = await Promise.all(
      products.map(async (product: any) => {
        const today = new Date();
        const dayOfWeek = today.getDay();

        const promotion = await prisma.promotion.findFirst({
          where: {
            productId: product.id,
            isActive: true,
            AND: [
              {
                OR: [{ dayOfWeek: null }, { dayOfWeek }],
              },
              {
                OR: [{ validFrom: null }, { validFrom: { lte: today } }],
              },
              {
                OR: [{ validUntil: null }, { validUntil: { gte: today } }],
              },
            ],
          },
        });

        return {
          ...product,
          promotion: promotion ? {
            name: promotion.name,
            description: promotion.description,
            discount: promotion.discount,
          } : null,
        };
      })
    );

    res.json(productsWithPromos);
  } catch (error) {
    next(error);
  }
});

// Get product by ID (public)
router.get('/:id', async (req, res, next) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
    });

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
});

// Create product (admin only)
router.post(
  '/',
  authenticate,
  requireRole('ADMIN'),
  async (req: AuthRequest, res, next) => {
    try {
      const data = productSchema.parse(req.body);

      const product = await prisma.product.create({
        data,
      });

      res.status(201).json(product);
    } catch (error) {
      next(error);
    }
  }
);

// Update product (admin only)
router.put(
  '/:id',
  authenticate,
  requireRole('ADMIN'),
  async (req: AuthRequest, res, next) => {
    try {
      const data = productSchema.partial().parse(req.body);

      const product = await prisma.product.update({
        where: { id: req.params.id },
        data,
      });

      res.json(product);
    } catch (error) {
      next(error);
    }
  }
);

// Delete product (admin only)
router.delete(
  '/:id',
  authenticate,
  requireRole('ADMIN'),
  async (req: AuthRequest, res, next) => {
    try {
      await prisma.product.delete({
        where: { id: req.params.id },
      });

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

export { router as productsRouter };

