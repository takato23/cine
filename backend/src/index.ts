import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authRouter } from './routes/auth';
import { moviesRouter } from './routes/movies';
import { showtimesRouter } from './routes/showtimes';
import { roomsRouter } from './routes/rooms';
import { ordersRouter } from './routes/orders';
import { productsRouter } from './routes/products';
import { adminRouter } from './routes/admin';
import { paymentsRouter } from './routes/payments';
import { errorHandler } from './middleware/errorHandler';
import { isMockMode } from './config';
import { mockRouter } from './mock/routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes (mock-first)
if (isMockMode) {
  console.log('⚙️  API en modo MOCK (sin DB/MP).');
  app.use('/api', mockRouter);
} else {
  app.use('/api/auth', authRouter);
  app.use('/api/movies', moviesRouter);
  app.use('/api/showtimes', showtimesRouter);
  app.use('/api/rooms', roomsRouter);
  app.use('/api/orders', ordersRouter);
  app.use('/api/products', productsRouter);
  app.use('/api/admin', adminRouter);
  app.use('/api/payments', paymentsRouter);
}

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

