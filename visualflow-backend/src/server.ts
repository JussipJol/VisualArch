import './config/env'; // Must be first
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { connectDB, getDBStatus } from './config/database';
import routes from './routes';
import { errorHandler } from './middleware/error.middleware';
import { config } from './config/env';

const app = express();

// Security
app.use(helmet());
const allowedOrigins = [
  config.clientUrl,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
];
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. curl, Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origin ${origin} not allowed`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api', routes);

// Health check
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    database: getDBStatus() ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// Error handler (must be last)
app.use(errorHandler);

const start = async () => {
  // Сначала запускаем сервер — чтобы порт 3001 всегда был доступен
  app.listen(config.port, () => {
    console.log(`[SERVER] Running on http://localhost:${config.port}`);
    console.log(`[SERVER] Environment: ${config.nodeEnv}`);
  });

  // Потом пробуем подключиться к базе данных
  const connected = await connectDB();
  if (!connected) {
    console.warn('[SERVER] Запущен БЕЗ базы данных. Регистрация/Логин работать не будут.');
    console.warn('[SERVER] Исправьте доступ в MongoDB Atlas и перезапустите сервер.');
  }
};

start();
