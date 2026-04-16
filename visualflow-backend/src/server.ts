import './config/env'; // Must be first
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/database';
import routes from './routes';
import { errorHandler } from './middleware/error.middleware';
import { config } from './config/env';
<<<<<<< HEAD
=======
import passport from './config/passport';
>>>>>>> 48106fb (update project)

const app = express();

// Security
app.use(helmet());
<<<<<<< HEAD
=======
app.use(passport.initialize());
>>>>>>> 48106fb (update project)
const allowedOrigins = [
  config.clientUrl,
  'http://localhost:5173',
  'http://localhost:5174',
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
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler (must be last)
app.use(errorHandler);

const start = async () => {
  await connectDB();
  app.listen(config.port, () => {
    console.log(`[SERVER] Running on http://localhost:${config.port}`);
    console.log(`[SERVER] Environment: ${config.nodeEnv}`);
  });
};

start();
