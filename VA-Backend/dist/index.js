"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const db_1 = require("./config/db");
const auth_1 = __importDefault(require("./routes/auth"));
const workspaces_1 = __importDefault(require("./routes/workspaces"));
const projects_1 = __importDefault(require("./routes/projects"));
const generate_1 = __importDefault(require("./routes/generate"));
// ── Validate required env variables ──────────────────────────
const REQUIRED_ENV = ["MONGODB_URI", "JWT_SECRET", "GROQ_API_KEY"];
for (const key of REQUIRED_ENV) {
    if (!process.env[key]) {
        console.error(`❌ Missing required env variable: ${key}`);
        process.exit(1);
    }
}
const app = (0, express_1.default)();
const PORT = Number(process.env.PORT) || 4000;
// ── Security headers ─────────────────────────────────────────
app.use((0, helmet_1.default)());
// ── Rate limiting ────────────────────────────────────────────
const globalLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 300, // 300 requests per window per IP
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many requests, please try again later" },
});
app.use(globalLimiter);
// Auth-specific stricter limiter
const authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 20, // 20 auth attempts per 15 min
    message: { error: "Too many authentication attempts, try again later" },
});
// Generate-specific limiter (expensive AI calls)
const generateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000, // 1 minute
    max: 5, // 5 generations per minute
    message: { error: "Too many generation requests, please wait" },
});
// ── Body parsing ─────────────────────────────────────────────
app.use(express_1.default.json({ limit: "2mb" }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Internal-Secret"],
}));
// ── Routes ───────────────────────────────────────────────────
app.use("/api/auth", authLimiter, auth_1.default);
app.use("/api/workspaces", workspaces_1.default);
app.use("/api/workspaces", generateLimiter, generate_1.default);
app.use("/api/projects", projects_1.default);
// ── Health check ─────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});
// ── Global error handler ─────────────────────────────────────
app.use((err, _req, res, _next) => {
    console.error("⚠ Unhandled error:", err.message);
    res.status(500).json({ error: "Internal server error" });
});
// ── Start ────────────────────────────────────────────────────
let server;
async function bootstrap() {
    try {
        await (0, db_1.connectDB)();
        server = app.listen(PORT, () => {
            console.log(`\n🚀 VA-Backend running → http://localhost:${PORT}`);
            console.log(`   Health check     → http://localhost:${PORT}/api/health\n`);
        });
    }
    catch (err) {
        console.error("❌ Failed to start server:", err);
        process.exit(1);
    }
}
// ── Graceful shutdown ────────────────────────────────────────
async function shutdown(signal) {
    console.log(`\n🛑 ${signal} received — shutting down gracefully...`);
    if (server) {
        server.close(() => {
            console.log("✓ HTTP server closed");
        });
    }
    await (0, db_1.disconnectDB)();
    process.exit(0);
}
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
bootstrap();
