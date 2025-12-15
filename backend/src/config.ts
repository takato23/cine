export const isMockMode = process.env.USE_MOCKS !== 'false';

export const jwtSecret = process.env.JWT_SECRET || 'mock-secret';

export const mockConfig = {
  seatLockTtlMs: 7 * 60 * 1000, // 7 minutos para mantener reserva de asiento
  orderTtlMs: 15 * 60 * 1000, // 15 minutos para completar el checkout
  serviceFeeRate: 0.05,
};
