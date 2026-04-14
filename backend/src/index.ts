import 'dotenv/config';
import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

import authRouter from './routes/auth';
import workspacesRouter from './routes/workspaces';
import marketplaceRouter from './routes/marketplace';
import { creditsRouter, notifRouter } from './routes/credits';
import { initializeWebSocket } from './websocket/workspace.gateway';
import { connectDatabase } from './models/db';
import { seedDemoUser } from './models/seed';

const app = express();
const httpServer = http.createServer(app);

const FRONTEND_URL = process.env.FRONTEND_URL ?? 'http://localhost:3000';
const PORT = process.env.PORT ?? 3001;

// ── Security middleware ───────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ── Rate limiting ─────────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Too many auth attempts, please wait 15 minutes' },
});

const generateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { error: 'Too many generation requests per minute' },
});

app.use(globalLimiter);

// ── Request logging ────────────────────────────────────────────
app.use((req, _res, next) => {
  if (req.path !== '/api/health' && process.env.NODE_ENV !== 'test') {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  }
  next();
});

// ── Routes ────────────────────────────────────────────────────
app.use('/api/auth', authLimiter, authRouter);
app.use('/api/users', authLimiter, authRouter);
app.use('/api/workspaces', workspacesRouter);
// Apply generation rate limiting per-path (generate endpoints within workspacesRouter)
app.use('/api/workspaces/:id/generate', generateLimiter);
app.use('/api/templates', marketplaceRouter);
app.use('/api/credits', creditsRouter);
app.use('/api/notifications', notifRouter);

// ── Health check ──────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'healthy',
    version: '3.0.0',
    timestamp: new Date().toISOString(),
    services: {
      api: 'ok',
      db: process.env.MONGODB_URI ? 'mongodb-connected' : 'no-db-warning',
      ai: process.env.GROQ_API_KEY ? 'groq-connected' : 'mock-mode',
    },
  });
});

// ── 404 handler ───────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ── Global error handler ──────────────────────────────────────
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[Error]', err.message, err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// ── WebSocket ─────────────────────────────────────────────────
initializeWebSocket(httpServer, FRONTEND_URL);

// ── Start ─────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  connectDatabase().then(async () => {
    await seedDemoUser();
    httpServer.listen(PORT, () => {
      console.log(`\n🚀 VisualArch API v3.0 running on http://localhost:${PORT}`);
      console.log(`📡 WebSocket ready at ws://localhost:${PORT}/workspace`);
      console.log(`🤖 AI Mode: ${process.env.GROQ_API_KEY ? 'Groq (live)' : 'Mock (demo)'}`);
      console.log(`🗄️  DB Mode: ${process.env.MONGODB_URI ? 'MongoDB (Cloud)' : 'Persistent-Mock (local)'}\n`);
    });
  });
}

export { app, httpServer };
