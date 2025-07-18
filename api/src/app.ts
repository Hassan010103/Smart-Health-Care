import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import healthRouter from './routes/health';
import authRouter from './routes/auth';
import usersRouter from './routes/users';
import doctorsRouter from './routes/doctors';
import appointmentsRouter from './routes/appointments';
import treatmentsRouter from './routes/treatments';
import paymentsRouter from './routes/payments';
import chatRouter from './routes/chat';
import aiRouter from './routes/ai';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());

// Global logging middleware for all requests
app.use((req, res, next) => {
  console.log('[REQUEST]', req.method, req.originalUrl, 'Auth:', req.headers.authorization);
  next();
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Smart Health Care API is running.' });
});

app.use('/api/auth', authRouter);
app.use('/api/health', healthRouter);
app.use('/api/users', usersRouter);
app.use('/api/doctors', doctorsRouter);
app.use('/api/appointments', appointmentsRouter);
app.use('/api/treatments', treatmentsRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/chat', chatRouter);
app.use('/api/ai', aiRouter);

export default app; 