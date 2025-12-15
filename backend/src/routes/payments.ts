import { Router } from 'express';
import { handleWebhook } from '../services/mercadopago';

const router = Router();

// Mercado Pago webhook
router.post('/webhook', async (req, res) => {
  try {
    const { type, data } = req.body;

    if (type === 'payment') {
      const paymentId = data.id;
      await handleWebhook(paymentId);
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).send('Error processing webhook');
  }
});

export { router as paymentsRouter };

