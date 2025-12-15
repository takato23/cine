import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { jwtSecret, mockConfig } from '../config';
import {
  mockMovies,
  mockPricingRules,
  mockProducts,
  mockPromotions,
  mockRooms,
  mockShowtimes,
  mockUsers,
  MockMovie,
  MockPricingRule,
  MockProduct,
  MockPromotion,
  MockRoom,
  MockShowtime,
  MockUser,
  SeatType,
} from './data';
import type { UserRole } from './data';

const randomId = () => (typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : Math.random().toString(36).slice(2));

interface SeatLock {
  id: string;
  showtimeId: string;
  row: string;
  seatNumber: number;
  userId?: string;
  expiresAt: Date;
  orderId?: string;
}

export interface OrderItem {
  id: string;
  type: 'ticket' | 'product';
  showtimeId?: string;
  productId?: string;
  row?: string;
  seatNumber?: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  zone?: string;
}

export interface Payment {
  id: string;
  orderId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  qrCode: string;
  qrCodeBase64: string | null;
  expiresAt: Date;
}

export interface Order {
  id: string;
  userId?: string;
  status: 'PENDING' | 'PAID' | 'CANCELLED' | 'EXPIRED';
  subtotal: number;
  serviceFee: number;
  total: number;
  expiresAt: Date;
  createdAt: Date;
  channel: 'web' | 'mobile' | 'pos';
  items: OrderItem[];
  payment?: Payment;
}

const seatLocks: SeatLock[] = [];
const orders: Order[] = [];
const payments: Payment[] = [];

const findUser = (email: string) => mockUsers.find((u) => u.email === email);

const baseSeatPrice = (seatType: SeatType, ruleId?: string | null) => {
  const rule = mockPricingRules.find((r) => r.id === ruleId && r.seatType === seatType);
  if (rule) return rule.basePrice;
  return seatType === 'VIP' ? 7500 : 5000;
};

const applyPromotions = (items: OrderItem[], showtime?: MockShowtime) => {
  const now = new Date();
  const day = now.getDay();
  const promos: MockPromotion[] = mockPromotions;

  let discount = 0;

  // 2x1 martes sobre tickets
  if (promos.some((p) => p.type === 'TUESDAY_2X1' && (p.dayOfWeek ?? day) === day)) {
    const ticketItems = items.filter((i) => i.type === 'ticket');
    ticketItems.forEach((item) => {
      const freeQty = Math.floor(item.quantity / 2);
      discount += freeQty * item.unitPrice;
    });
  }

  // Descuento combo específico
  items.forEach((item) => {
    if (item.type === 'product' && item.productId) {
      const promo = promos.find((p) => p.productId === item.productId && p.type === 'COMBO');
      if (promo?.discount) {
        discount += item.totalPrice * promo.discount;
      }
    }
  });

  return { discount };
};

const cleanExpiredLocks = () => {
  const now = new Date();
  for (let i = seatLocks.length - 1; i >= 0; i--) {
    if (seatLocks[i].expiresAt.getTime() <= now.getTime()) {
      seatLocks.splice(i, 1);
    }
  }
};

const cleanExpiredOrders = () => {
  const now = new Date();
  orders.forEach((order) => {
    if (order.status === 'PENDING' && order.expiresAt.getTime() <= now.getTime()) {
      order.status = 'EXPIRED';
    }
  });
};

export const mockAuth = {
  register: (payload: { email: string; password: string; name?: string }) => {
    if (findUser(payload.email)) {
      throw new Error('Email ya registrado');
    }
    const user: MockUser = {
      id: randomId(),
      email: payload.email,
      password: payload.password,
      name: payload.name,
      role: 'CLIENT',
    };
    mockUsers.push(user);
    const token = jwt.sign({ userId: user.id, role: user.role }, jwtSecret, { expiresIn: '7d' });
    return { user: { id: user.id, email: user.email, name: user.name, role: user.role }, token };
  },
  login: (payload: { email: string; password: string }) => {
    const user = findUser(payload.email);
    if (!user || user.password !== payload.password) {
      throw new Error('Credenciales inválidas');
    }
    const token = jwt.sign({ userId: user.id, role: user.role }, jwtSecret, { expiresIn: '7d' });
    return { user: { id: user.id, email: user.email, name: user.name, role: user.role }, token };
  },
  me: (userId?: string) => {
    const user = mockUsers.find((u) => u.id === userId);
    if (!user) throw new Error('Usuario no encontrado');
    return { id: user.id, email: user.email, name: user.name, role: user.role };
  },
};

export const mockCatalog = {
  movies: (status?: string) =>
    status ? mockMovies.filter((m) => m.status === status) : mockMovies,
  movieById: (id: string) => mockMovies.find((m) => m.id === id),
  rooms: () => mockRooms,
  products: (params?: { category?: string; active?: boolean }) =>
    mockProducts.filter((p) => (params?.category ? p.category === params.category : true)).filter((p) => (params?.active ? p.isActive !== false : true)),
  promotions: () => mockPromotions,
  showtimes: (filters: { movieId?: string; roomId?: string; date?: string }) => {
    let data = mockShowtimes;
    if (filters.movieId) data = data.filter((s) => s.movieId === filters.movieId);
    if (filters.roomId) data = data.filter((s) => s.roomId === filters.roomId);
    if (filters.date) {
      const startDate = new Date(filters.date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
      data = data.filter((s) => {
        const date = new Date(s.startTime);
        return date >= startDate && date < endDate;
      });
    }
    return data.map((s) => ({
      ...s,
      movie: mockMovies.find((m) => m.id === s.movieId),
      room: mockRooms.find((r) => r.id === s.roomId),
      pricingRule: mockPricingRules.find((p) => p.id === s.pricingRuleId),
    }));
  },
  showtimeById: (id: string) =>
    mockShowtimes
      .map((s) => ({
        ...s,
        movie: mockMovies.find((m) => m.id === s.movieId),
        room: mockRooms.find((r) => r.id === s.roomId),
        pricingRule: mockPricingRules.find((p) => p.id === s.pricingRuleId),
      }))
      .find((s) => s.id === id),
};

const seatKey = (row: string, num: number) => `${row}-${num}`;

const seatAvailability = (showtimeId: string) => {
  cleanExpiredLocks();
  cleanExpiredOrders();

  const showtime = mockCatalog.showtimeById(showtimeId);
  if (!showtime) return null;
  const room = showtime.room as MockRoom;

  const occupied = new Set<string>();
  orders
    .filter((o) => ['PAID', 'PENDING'].includes(o.status))
    .forEach((o) => {
      o.items
        .filter((i) => i.type === 'ticket' && i.showtimeId === showtimeId && i.row && i.seatNumber)
        .forEach((i) => occupied.add(seatKey(i.row!, i.seatNumber!)));
    });

  const locked = new Set<string>();
  seatLocks
    .filter((l) => l.showtimeId === showtimeId)
    .forEach((l) => locked.add(seatKey(l.row, l.seatNumber)));

  const seats = room.layout.rows.map((row) => ({
    letter: row.letter,
    seats: row.seats.map((seat) => ({
      number: seat.number,
      type: seat.type,
      available: !occupied.has(seatKey(row.letter, seat.number)),
      locked: locked.has(seatKey(row.letter, seat.number)),
    })),
  }));

  return { showtime, seats };
};

export const mockOrders = {
  lockSeats: (showtimeId: string, seats: { row: string; seatNumber: number }[], userId?: string) => {
    const availability = seatAvailability(showtimeId);
    if (!availability) throw new Error('Función no encontrada');

    const roomSeats = new Set(
      availability.seats.flatMap((r) => r.seats.map((s) => seatKey(r.letter, s.number)))
    );

    seats.forEach((s) => {
      const key = seatKey(s.row, s.seatNumber);
      if (!roomSeats.has(key)) throw new Error(`Asiento inválido ${key}`);
    });

    const now = Date.now();
    const lockedSet = new Set(
      seatLocks.filter((l) => l.expiresAt.getTime() > now).map((l) => seatKey(l.row, l.seatNumber))
    );
    const occupiedSet = new Set(
      orders
        .filter((o) => ['PAID', 'PENDING'].includes(o.status))
        .flatMap((o) =>
          o.items
            .filter((i) => i.type === 'ticket' && i.showtimeId === showtimeId && i.row && i.seatNumber)
            .map((i) => seatKey(i.row!, i.seatNumber!))
        )
    );

    for (const seat of seats) {
      const key = seatKey(seat.row, seat.seatNumber);
      if (lockedSet.has(key) || occupiedSet.has(key)) {
        throw new Error(`Asiento ${key} no disponible`);
      }
    }

    const expiresAt = new Date(Date.now() + mockConfig.seatLockTtlMs);
    const created = seats.map((seat) => {
      const lock: SeatLock = {
        id: randomId(),
        showtimeId,
        row: seat.row,
        seatNumber: seat.seatNumber,
        userId,
        expiresAt,
      };
      seatLocks.push(lock);
      return lock;
    });

    return { locks: created, expiresAt };
  },

  createOrder: (userId: string | undefined, payload: { items: { type: 'ticket' | 'product'; showtimeId?: string; productId?: string; row?: string; seatNumber?: number; quantity?: number; }[]; channel?: 'web' | 'mobile' | 'pos'; }) => {
    const items: OrderItem[] = [];
    let subtotal = 0;

    payload.items.forEach((item) => {
      const quantity = item.quantity ?? 1;
      if (item.type === 'ticket') {
        if (!item.showtimeId || !item.row || !item.seatNumber) {
          throw new Error('Ticket requiere showtimeId, row y seatNumber');
        }
        const showtime = mockCatalog.showtimeById(item.showtimeId);
        if (!showtime) throw new Error('Función no encontrada');
        const room = showtime.room as MockRoom;
        const row = room.layout.rows.find((r) => r.letter === item.row);
        const seat = row?.seats.find((s) => s.number === item.seatNumber);
        if (!row || !seat) throw new Error('Asiento inválido');

        // validar lock existente (permitir si es del mismo usuario)
        const key = seatKey(item.row, item.seatNumber);
        const existingLock = seatLocks.find(
          (l) =>
            l.showtimeId === item.showtimeId &&
            l.row === item.row &&
            l.seatNumber === item.seatNumber &&
            l.expiresAt.getTime() > Date.now()
        );
        // Si hay lock de otro usuario, rechazar
        if (existingLock && existingLock.userId && existingLock.userId !== userId) {
          throw new Error(`Asiento ${key} está siendo reservado por otro usuario`);
        }
        // Si está ocupado en una orden, rechazar
        const isTaken = orders.some((o) =>
          ['PAID', 'PENDING'].includes(o.status) &&
          o.items.some(
            (i) =>
              i.type === 'ticket' &&
              i.showtimeId === item.showtimeId &&
              i.row === item.row &&
              i.seatNumber === item.seatNumber
          )
        );
        if (isTaken) throw new Error(`Asiento ${key} no disponible`);

        const seatRulePrice = baseSeatPrice(seat.type, showtime.pricingRuleId);
        const zone =
          room.layout.zones.find((z) => z.rows.includes(item.row!))?.name ?? 'STANDARD';
        const unitPrice = seatRulePrice;
        const totalPrice = unitPrice * quantity;
        subtotal += totalPrice;
        items.push({
          id: randomId(),
          type: 'ticket',
          showtimeId: item.showtimeId,
          row: item.row,
          seatNumber: item.seatNumber,
          quantity,
          unitPrice,
          totalPrice,
          zone,
        });
      } else {
        if (!item.productId) throw new Error('ProductId requerido');
        const product = mockProducts.find((p) => p.id === item.productId);
        if (!product) throw new Error('Producto no encontrado');
        if (typeof product.stock === 'number' && product.stock < quantity) {
          throw new Error('Stock insuficiente');
        }
        const totalPrice = product.price * quantity;
        subtotal += totalPrice;
        items.push({
          id: randomId(),
          type: 'product',
          productId: item.productId,
          quantity,
          unitPrice: product.price,
          totalPrice,
        });
      }
    });

    const pricingShowtime = payload.items.find((i) => i.type === 'ticket')?.showtimeId
      ? mockCatalog.showtimeById(payload.items.find((i) => i.type === 'ticket')!.showtimeId!)
      : undefined;
    const { discount } = applyPromotions(items, pricingShowtime as MockShowtime | undefined);
    const subtotalAfterDiscount = Math.max(0, subtotal - discount);
    const serviceFee = Number((subtotalAfterDiscount * mockConfig.serviceFeeRate).toFixed(2));
    const total = subtotalAfterDiscount + serviceFee;
    const expiresAt = new Date(Date.now() + mockConfig.orderTtlMs);

    const order: Order = {
      id: randomId(),
      userId,
      status: 'PENDING',
      subtotal: subtotalAfterDiscount,
      serviceFee,
      total,
      expiresAt,
      createdAt: new Date(),
      channel: payload.channel || 'web',
      items,
    };
    orders.push(order);

    // Consumir locks del usuario para estos asientos
    const ticketItems = payload.items.filter((i) => i.type === 'ticket');
    for (let i = seatLocks.length - 1; i >= 0; i--) {
      const lock = seatLocks[i];
      if (lock.userId === userId && lock.expiresAt.getTime() > Date.now()) {
        const matchesItem = ticketItems.some(
          (item) =>
            item.showtimeId === lock.showtimeId &&
            item.row === lock.row &&
            item.seatNumber === lock.seatNumber
        );
        if (matchesItem) {
          // Asociar lock con orden y eliminarlo (consumido)
          lock.orderId = order.id;
          seatLocks.splice(i, 1);
        }
      }
    }

    const payment: Payment = {
      id: `pay-${order.id}`,
      orderId: order.id,
      status: 'PENDING',
      qrCode: `https://mock.mercadopago.com/qr/${order.id}`,
      qrCodeBase64: null,
      expiresAt,
    };
    payments.push(payment);
    order.payment = payment;

    return { order, payment };
  },

  getOrder: (id: string, requesterId?: string, role?: UserRole) => {
    const order = orders.find((o) => o.id === id);
    if (!order) throw new Error('Orden no encontrada');
    if (order.userId && requesterId && order.userId !== requesterId && role !== 'ADMIN') {
      throw new Error('No autorizado');
    }
    return order;
  },

  listUserOrders: (userId?: string) =>
    orders
      .filter((o) => !userId || o.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),

  simulateWebhook: (paymentId: string) => {
    const payment = payments.find((p) => p.id === paymentId || p.orderId === paymentId);
    if (!payment) throw new Error('Pago no encontrado');
    payment.status = 'APPROVED';
    const order = orders.find((o) => o.id === payment.orderId);
    if (order) {
      order.status = 'PAID';
      // liberamos locks del orden
      for (let i = seatLocks.length - 1; i >= 0; i--) {
        if (seatLocks[i].orderId === order.id) {
          seatLocks.splice(i, 1);
        }
      }
    }
    return payment;
  },
};

export const mockReports = {
  sales: () => {
    const paidOrders = orders.filter((o) => o.status === 'PAID');
    const totalSales = paidOrders.reduce((sum, o) => sum + o.total, 0);
    const totalOrders = paidOrders.length;
    const totalTickets = paidOrders.reduce(
      (sum, o) => sum + o.items.filter((i) => i.type === 'ticket').reduce((s, i) => s + i.quantity, 0),
      0
    );
    const totalProducts = paidOrders.reduce(
      (sum, o) => sum + o.items.filter((i) => i.type === 'product').reduce((s, i) => s + i.quantity, 0),
      0
    );
    return {
      summary: { totalSales, totalOrders, totalTickets, totalProducts },
      orders: paidOrders,
    };
  },
  occupancy: (showtimeId: string) => {
    const availability = seatAvailability(showtimeId);
    if (!availability) throw new Error('Función no encontrada');
    const totalSeats = availability.seats.reduce(
      (sum, row) => sum + row.seats.length,
      0
    );
    const occupied = orders
      .filter((o) => o.status === 'PAID')
      .flatMap((o) =>
        o.items.filter((i) => i.type === 'ticket' && i.showtimeId === showtimeId)
      ).length;
    return {
      showtime: {
        id: availability.showtime.id,
        movie: availability.showtime.movie,
        room: availability.showtime.room,
        startTime: availability.showtime.startTime,
      },
      occupancy: {
        totalSeats,
        occupiedSeats: occupied,
        availableSeats: totalSeats - occupied,
        occupancyRate: Math.round((occupied / totalSeats) * 10000) / 100,
      },
    };
  },
};

export const mockSeats = {
  availability: seatAvailability,
};
