import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { authenticateJWT } from '../middleware/auth';
import { JWTPayload } from '../types';
import { PLAN_CREDITS } from '../services/credits.service';
import { UserModel } from '../models/schemas/User.schema';
import { RefreshTokenModel } from '../models/schemas/RefreshToken.schema';

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
  console.error('❌ FATAL: JWT secrets not found in environment. Auth will fail.');
}

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many attempts, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

function generateAccessToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
}

function generateRefreshToken(): string {
  return crypto.randomBytes(64).toString('hex');
}

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// POST /api/auth/register
router.post('/register', authLimiter, async (req: Request, res: Response) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.errors[0].message });
    }

    const { email, password, name } = parsed.data;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = new UserModel({
      email,
      name,
      passwordHash,
      plan: 'free',
      creditsBalance: PLAN_CREDITS.free,
      onboardingCompleted: false,
    });

    await user.save();

    const refreshToken = generateRefreshToken();
    const tokenHash = hashToken(refreshToken);

    await new RefreshTokenModel({
      tokenHash,
      userId: user.id,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    }).save();

    const payload: JWTPayload = { userId: user.id, email: user.email, plan: user.plan };
    const accessToken = generateAccessToken(payload);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      accessToken,
      user: user.toJSON(),
    });
  } catch (error) {
    console.error('[Auth] Register error:', error);
    return res.status(500).json({ error: 'Registration failed' });
  }
});

// POST /api/auth/login
router.post('/login', authLimiter, async (req: Request, res: Response) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid email or password format' });
    }

    const { email, password } = parsed.data;
    const user = await UserModel.findOne({ email });

    if (!user) {
      await bcrypt.compare(password, '$2a$12$invalid.hash.to.prevent.timing.attacks');
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const passwordValid = await bcrypt.compare(password, user.passwordHash);
    if (!passwordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const refreshToken = generateRefreshToken();
    const tokenHash = hashToken(refreshToken);

    await new RefreshTokenModel({
      tokenHash,
      userId: user.id,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    }).save();

    const payload: JWTPayload = { userId: user.id, email: user.email, plan: user.plan };
    const accessToken = generateAccessToken(payload);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      accessToken,
      user: user.toJSON(),
    });
  } catch (error) {
    console.error('[Auth] Login error:', error);
    return res.status(500).json({ error: 'Login failed' });
  }
});

// POST /api/auth/refresh
router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ error: 'No refresh token' });
    }

    const tokenHash = hashToken(refreshToken);
    const savedToken = await RefreshTokenModel.findOne({ tokenHash });

    if (!savedToken || savedToken.expiresAt < new Date()) {
      return res.status(401).json({ error: 'Invalid or expired refresh token' });
    }

    const targetUser = await UserModel.findById(savedToken.userId);
    if (!targetUser) {
      return res.status(401).json({ error: 'User not found' });
    }

    await RefreshTokenModel.deleteOne({ _id: savedToken._id });

    const newRefreshToken = generateRefreshToken();
    const newTokenHash = hashToken(newRefreshToken);

    await new RefreshTokenModel({
      tokenHash: newTokenHash,
      userId: targetUser.id,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    }).save();

    const payload: JWTPayload = { userId: targetUser.id, email: targetUser.email, plan: targetUser.plan };
    const accessToken = generateAccessToken(payload);

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.json({ accessToken });
  } catch (error) {
    console.error('[Auth] Refresh error:', error);
    return res.status(500).json({ error: 'Token refresh failed' });
  }
});

// GET /api/auth/me
router.get('/me', authenticateJWT, async (req: Request, res: Response) => {
  const user = await UserModel.findById(req.user!.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  return res.json(user.toJSON());
});

// POST /api/auth/logout
router.post('/logout', authenticateJWT, async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;
  if (refreshToken) {
    const tokenHash = hashToken(refreshToken);
    await RefreshTokenModel.deleteOne({ tokenHash });
  }
  res.clearCookie('refreshToken');
  return res.json({ message: 'Logged out successfully' });
});

export default router;