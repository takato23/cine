// Import dinámico para evitar fallo cuando no está disponible el SDK
// Nota: el paquete recomendado por Mercado Pago para Node es `mercadopago`.
// Mantenemos require dinámico para que el backend pueda correr sin MP en modo mock/dev.
let mpPreferenceClient: any = null;
let mpPaymentClient: any = null;

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const mp = require('mercadopago');
  const MercadoPagoConfig = mp.MercadoPagoConfig;
  const Preference = mp.Preference;
  const Payment = mp.Payment;

  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (accessToken && MercadoPagoConfig && Preference) {
    const client = new MercadoPagoConfig({
      accessToken,
      options: { timeout: 5000 },
    });
    mpPreferenceClient = new Preference(client);
    mpPaymentClient = Payment ? new Payment(client) : null;
  } else {
    console.warn('Mercado Pago no configurado (falta token o SDK).');
  }
} catch (_err) {
  console.warn('Mercado Pago SDK no disponible, se usará modo mock/disabled.');
}

import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';

export const createPaymentPreference = async (order: any) => {
  if (!mpPreferenceClient) {
    throw new AppError('Payment service not configured', 500);
  }

  const frontendUrl = (process.env.FRONTEND_URL || 'http://localhost:3000').replace(/\/$/, '');
  const backendUrl = (process.env.BACKEND_URL || 'http://localhost:3001').replace(/\/$/, '');
  const expiresAt = order.expiresAt ? new Date(order.expiresAt) : new Date(Date.now() + 15 * 60 * 1000);

  const firstTicket = order.items?.find((i: any) => i.type === 'ticket' && i.showtime?.movieId);
  const movieId = firstTicket?.showtime?.movieId;
  const checkoutReturnUrl = movieId
    ? `${frontendUrl}/pelicula/${movieId}/checkout?orderId=${order.id}`
    : `${frontendUrl}/checkout?orderId=${order.id}`;

  const items = order.items.map((item: any) => {
    if (item.type === 'ticket') {
      return {
        title: `${item.showtime.movie.title} - ${item.showtime.room.name} - ${item.row}${item.seatNumber}`,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        currency_id: 'ARS',
      };
    } else {
      return {
        title: item.product.name,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        currency_id: 'ARS',
      };
    }
  });

  // Add service fee
  items.push({
    title: 'Cargo por servicio',
    quantity: 1,
    unit_price: order.serviceFee,
    currency_id: 'ARS',
  });

  try {
    const mpPreference = await mpPreferenceClient.create({
      body: {
        items,
        back_urls: {
          success: checkoutReturnUrl,
          failure: checkoutReturnUrl,
          pending: checkoutReturnUrl,
        },
        auto_return: 'approved',
        expires: true,
        expiration_date_from: new Date().toISOString(),
        expiration_date_to: expiresAt.toISOString(),
        external_reference: order.id,
        notification_url: `${backendUrl}/api/payments/webhook`,
      },
    });

    const mpPreferenceId = (mpPreference?.id ?? mpPreference?.body?.id)?.toString?.() ?? null;
    const initPoint = mpPreference?.init_point ?? mpPreference?.body?.init_point ?? null;
    const qrCodeBase64 = mpPreference?.qr_code_base64 ?? mpPreference?.body?.qr_code_base64 ?? null;

    if (!mpPreferenceId || !initPoint) {
      throw new Error('Respuesta inválida al crear preferencia de Mercado Pago');
    }

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        orderId: order.id,
        mpPreferenceId: mpPreferenceId,
        qrCode: initPoint,
        qrCodeBase64: qrCodeBase64,
        expiresAt: expiresAt,
        method: 'mercadopago',
      },
    });

    return payment;
  } catch (error: any) {
    console.error('MercadoPago error:', error);
    throw new AppError('Failed to create payment preference', 500);
  }
};

export const handleWebhook = async (paymentId: string) => {
  if (!mpPaymentClient) {
    throw new AppError('Payment service not configured', 500);
  }

  const mpPaymentId = Number(paymentId);
  if (!Number.isFinite(mpPaymentId)) {
    throw new AppError('Invalid paymentId', 400);
  }

  // Verificar el estado real consultando a Mercado Pago
  const mpPayment = await mpPaymentClient.get({ id: mpPaymentId });
  const mpStatus: string | undefined = mpPayment?.status;
  const externalRef: string | undefined = mpPayment?.external_reference;
  const preferenceId: string | null =
    mpPayment?.preference_id !== undefined && mpPayment?.preference_id !== null
      ? String(mpPayment.preference_id)
      : null;

  const payment = await prisma.payment.findFirst({
    where: {
      OR: [
        { mpPaymentId: String(mpPaymentId) },
        ...(preferenceId ? [{ mpPreferenceId: preferenceId }] : []),
        ...(externalRef ? [{ orderId: externalRef }] : []),
      ],
    },
    include: { order: true },
  });

  if (!payment) {
    throw new AppError('Payment not found', 404);
  }

  const normalizedStatus =
    mpStatus === 'approved'
      ? 'APPROVED'
      : mpStatus === 'rejected'
        ? 'REJECTED'
        : mpStatus === 'cancelled'
          ? 'CANCELLED'
          : 'PENDING';

  // Update payment status
  await prisma.payment.update({
    where: { id: payment.id },
    data: {
      status: normalizedStatus,
      mpPaymentId: String(mpPaymentId),
    },
  });

  // Update order status
  if (normalizedStatus === 'APPROVED') {
    await prisma.order.update({
      where: { id: payment.orderId },
      data: { status: 'PAID' },
    });
  } else if (normalizedStatus === 'REJECTED' || normalizedStatus === 'CANCELLED') {
    await prisma.order.update({
      where: { id: payment.orderId },
      data: { status: 'CANCELLED' },
    });
  }

  // Release seat locks asociados a la orden (solo si se aprobó el pago)
  if (normalizedStatus === 'APPROVED') {
    await prisma.seatLock.deleteMany({
      where: {
        orderId: payment.orderId,
      },
    });
  }

  return payment;
};

