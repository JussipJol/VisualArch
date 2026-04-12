import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { connectDB, disconnectDB } from "./config/db";
import authRouter from "./routes/auth";
import workspacesRouter from "./routes/workspaces";
import projectsRouter from "./routes/projects";
import generateRouter from "./routes/generate";

// ── Validate required env variables ──────────────────────────
const REQUIRED_ENV = ["MONGODB_URI", "JWT_SECRET", "GROQ_API_KEY"];
for (const key of REQUIRED_ENV) {
  if (!process.env[key]) {
    console.error(`❌ Missing required env variable: ${key}`);
    process.exit(1);
  }
}

const app = express();
const PORT = Number(process.env.PORT) || 4000;

// ── Security headers ─────────────────────────────────────────
app.use(helmet());

// ── Rate limiting ────────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,                 // 300 requests per window per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later" },
});
app.use(globalLimiter);

// Auth-specific stricter limiter
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,                  // 20 auth attempts per 15 min
  message: { error: "Too many authentication attempts, try again later" },
});

// Generate-specific limiter (expensive AI calls)
const generateLimiter = rateLimit({
  windowMs: 60 * 1000,      // 1 minute
  max: 5,                   // 5 generations per minute
  message: { error: "Too many generation requests, please wait" },
});

// ── Body parsing ─────────────────────────────────────────────
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Internal-Secret"],
  })
);

// ── Routes ───────────────────────────────────────────────────
app.use("/api/auth", authLimiter, authRouter);
app.use("/api/workspaces", workspacesRouter);
app.use("/api/workspaces", generateLimiter, generateRouter);
app.use("/api/projects", projectsRouter);


// ── Health check ─────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── Global error handler ─────────────────────────────────────
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error("⚠ Unhandled error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
);

// ── Start ────────────────────────────────────────────────────
let server: ReturnType<typeof app.listen>;

async function bootstrap() {
  try {
    await connectDB();
    server = app.listen(PORT, () => {
      console.log(`\n🚀 VA-Backend running → http://localhost:${PORT}`);
      console.log(`   Health check     → http://localhost:${PORT}/api/health\n`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
}

// ── Graceful shutdown ────────────────────────────────────────
async function shutdown(signal: string) {
  console.log(`\n🛑 ${signal} received — shutting down gracefully...`);
  if (server) {
    server.close(() => {
      console.log("✓ HTTP server closed");
    });
  }
  await disconnectDB();
  process.exit(0);
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

bootstrap();
