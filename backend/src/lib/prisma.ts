import { PrismaClient } from '@prisma/client';
import { isMockMode } from '../config';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// En modo mock evitamos inicializar Prisma para no requerir DATABASE_URL
export const prisma: PrismaClient =
  isMockMode
    ? ({} as PrismaClient)
    : globalForPrisma.prisma ??
      new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
      });

if (!isMockMode && process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

