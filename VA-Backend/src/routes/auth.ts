import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { getDB } from "../config/db";
import { requireAuth, AuthRequest } from "../middleware/auth";
import {
  RegisterInputSchema,
  LoginInputSchema,
  OAuthInputSchema,
} from "../schemas/architecture.schema";

const router = Router();

function generateUserId(): string {
  return crypto.randomBytes(12).toString("hex");
}

function signToken(userId: string, email: string): string {
  return jwt.sign(
    { userId, email },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );
}

function sanitizeUser(user: Record<string, unknown>) {
  const { password_hash, _id, ...safe } = user;
  return safe;
}

// ── POST /api/auth/register ──────────────────────────────────
router.post("/register", async (req: Request, res: Response) => {
  try {
    const parsed = RegisterInputSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        error: "Ошибка валидации",
        details: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const { email, username, password, type, company_details } = parsed.data;

    const db = getDB();
    const users = db.collection("users");

    // Check uniqueness
    const existingEmail = await users.findOne({ email });
    if (existingEmail) {
      res.status(409).json({ error: "Этот email уже зарегистрирован" });
      return;
    }

    const existingUsername = await users.findOne({ username: username.toLowerCase() });
    if (existingUsername) {
      res.status(409).json({ error: "Этот username уже занят" });
      return;
    }

    // Hash password (cost 12 for security)
    const password_hash = await bcrypt.hash(password, 12);

    const user_id = generateUserId();
    const accountType = type === "company" ? "company" : "individual";

    const newUser = {
      user_id,
      email,
      username: username.toLowerCase().trim(),
      password_hash,
      type: accountType,
      company_details:
        accountType === "company" && company_details
          ? {
            name: company_details.name || "",
            website: company_details.website || "",
          }
          : null,
      has_workspace: false,
      created_at: new Date().toISOString(),
    };

    await users.insertOne(newUser);

    const token = signToken(user_id, newUser.email);

    res.status(201).json({
      token,
      user: sanitizeUser(newUser as Record<string, unknown>),
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Ошибка сервера при регистрации" });
  }
});

// ── POST /api/auth/login ─────────────────────────────────────
router.post("/login", async (req: Request, res: Response) => {
  try {
    const parsed = LoginInputSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Email и password обязательны" });
      return;
    }

    const { email, password } = parsed.data;

    const db = getDB();
    const users = db.collection("users");

    const user = await users.findOne({ email });
    if (!user) {
      res.status(401).json({ error: "Неверный email или пароль" });
      return;
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      res.status(401).json({ error: "Неверный email или пароль" });
      return;
    }

    const token = signToken(user.user_id, user.email);

    res.json({
      token,
      user: sanitizeUser(user as Record<string, unknown>),
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Ошибка сервера при входе" });
  }
});

// ── GET /api/auth/me ─────────────────────────────────────────
router.get("/me", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const db = getDB();
    const users = db.collection("users");

    const user = await users.findOne({ user_id: req.user!.userId });
    if (!user) {
      res.status(404).json({ error: "Пользователь не найден" });
      return;
    }

    res.json({ user: sanitizeUser(user as Record<string, unknown>) });
  } catch (err) {
    console.error("Me error:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// ── POST /api/auth/oauth ─────────────────────────────────────
// Called server-side by NextAuth jwt() callback after OAuth sign-in.
// Protected with internal shared secret to prevent direct abuse.
router.post("/oauth", async (req: Request, res: Response) => {
  try {
    // ── Verify internal secret ──────────────────────────────
    const internalSecret = req.headers["x-internal-secret"];
    const expectedSecret = process.env.INTERNAL_API_SECRET;

    if (!expectedSecret || internalSecret !== expectedSecret) {
      res.status(403).json({ error: "Forbidden: invalid internal secret" });
      return;
    }

    const parsed = OAuthInputSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "email and provider are required" });
      return;
    }

    const { email, name, provider } = parsed.data;

    const db = getDB();
    const users = db.collection("users");

    // Try to find existing user by email
    let user = await users.findOne({ email });

    if (!user) {
      // Generate a username from email
      const base = email
        .split("@")[0]
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "_")
        .replace(/_+/g, "_")
        .replace(/^_|_$/g, "")
        .slice(0, 25) || "user";

      // Ensure username is unique (handles race condition via unique index + retry)
      let username = base;
      let attempt = 0;
      const maxAttempts = 10;

      while (attempt < maxAttempts) {
        try {
          const user_id = generateUserId();
          const newUser = {
            user_id,
            email,
            username,
            password_hash: null,           // OAuth — no password
            type: "individual",
            company_details: null,
            display_name: name || username,
            has_workspace: false,
            oauth_providers: [provider],
            created_at: new Date().toISOString(),
          };

          await users.insertOne(newUser);
          user = newUser as any;
          break;
        } catch (insertErr: unknown) {
          // Duplicate key error on username — retry with suffix
          if (
            insertErr &&
            typeof insertErr === "object" &&
            "code" in insertErr &&
            (insertErr as { code: number }).code === 11000
          ) {
            username = `${base}${++attempt}`;
          } else {
            throw insertErr;
          }
        }
      }

      if (!user) {
        res.status(500).json({ error: "Could not create unique username" });
        return;
      }
    } else {
      // Add provider to list if not already there
      await users.updateOne(
        { email: user.email },
        { $addToSet: { oauth_providers: provider } }
      );
    }

    const token = signToken(user.user_id, user.email);
    res.json({ token, user: sanitizeUser(user as Record<string, unknown>) });
  } catch (err) {
    console.error("OAuth login error:", err);
    res.status(500).json({ error: "Ошибка сервера при OAuth входе" });
  }
});

export default router;
