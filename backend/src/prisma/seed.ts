import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create rooms
  const roomRoja = await prisma.room.upsert({
    where: { name: 'Roja' },
    update: {},
    create: {
      name: 'Roja',
      capacity: 120,
      layout: {
        rows: [
          {
            letter: 'A',
            seats: Array.from({ length: 20 }, (_, i) => ({
              number: i + 1,
              type: 'STANDARD',
            })),
          },
          {
            letter: 'B',
            seats: Array.from({ length: 20 }, (_, i) => ({
              number: i + 1,
              type: 'STANDARD',
            })),
          },
          {
            letter: 'C',
            seats: Array.from({ length: 20 }, (_, i) => ({
              number: i + 1,
              type: 'STANDARD',
            })),
          },
          {
            letter: 'D',
            seats: Array.from({ length: 20 }, (_, i) => ({
              number: i + 1,
              type: 'STANDARD',
            })),
          },
          {
            letter: 'E',
            seats: Array.from({ length: 20 }, (_, i) => ({
              number: i + 1,
              type: 'VIP',
            })),
          },
          {
            letter: 'F',
            seats: Array.from({ length: 20 }, (_, i) => ({
              number: i + 1,
              type: 'VIP',
            })),
          },
        ],
      },
    },
  });

  const roomAmarilla = await prisma.room.upsert({
    where: { name: 'Amarilla' },
    update: {},
    create: {
      name: 'Amarilla',
      capacity: 100,
      layout: {
        rows: [
          {
            letter: 'A',
            seats: Array.from({ length: 18 }, (_, i) => ({
              number: i + 1,
              type: 'STANDARD',
            })),
          },
          {
            letter: 'B',
            seats: Array.from({ length: 18 }, (_, i) => ({
              number: i + 1,
              type: 'STANDARD',
            })),
          },
          {
            letter: 'C',
            seats: Array.from({ length: 18 }, (_, i) => ({
              number: i + 1,
              type: 'STANDARD',
            })),
          },
          {
            letter: 'D',
            seats: Array.from({ length: 18 }, (_, i) => ({
              number: i + 1,
              type: 'STANDARD',
            })),
          },
          {
            letter: 'E',
            seats: Array.from({ length: 14 }, (_, i) => ({
              number: i + 1,
              type: 'VIP',
            })),
          },
          {
            letter: 'F',
            seats: Array.from({ length: 14 }, (_, i) => ({
              number: i + 1,
              type: 'VIP',
            })),
          },
        ],
      },
    },
  });

  // Create pricing rules
  await prisma.pricingRule.createMany({
    data: [
      {
        name: 'Precio General',
        seatType: 'STANDARD',
        basePrice: 5000,
        isActive: true,
      },
      {
        name: 'Precio VIP',
        seatType: 'VIP',
        basePrice: 7500,
        isActive: true,
      },
    ],
  });

  // Create sample products
  await prisma.product.createMany({
    data: [
      {
        name: 'Pochoclos Chico',
        description: 'Balde pequeño de pochoclos',
        category: 'POCHOCLOS',
        price: 2500,
        isActive: true,
      },
      {
        name: 'Pochoclos Grande',
        description: 'Balde grande de pochoclos',
        category: 'POCHOCLOS',
        price: 4000,
        isActive: true,
      },
      {
        name: 'Coca-Cola',
        description: 'Regular o Sin Azúcar',
        category: 'BEBIDAS',
        price: 2500,
        isActive: true,
      },
      {
        name: 'Nachos con Queso',
        description: 'Con salsa cheddar caliente',
        category: 'SNACKS',
        price: 4500,
        isActive: true,
      },
      {
        name: 'Combo Pareja',
        description: '1 Balde de pochoclos + 2 Bebidas',
        category: 'COMBOS',
        price: 8000,
        isActive: true,
      },
    ],
  });

  // Create admin user
  const bcrypt = require('bcryptjs');
  const hashedPassword = await bcrypt.hash('admin123', 10);

  await prisma.user.upsert({
    where: { email: 'admin@cinemapergamino.com' },
    update: {},
    create: {
      email: 'admin@cinemapergamino.com',
      password: hashedPassword,
      name: 'Administrador',
      role: 'ADMIN',
    },
  });

  console.log('Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

