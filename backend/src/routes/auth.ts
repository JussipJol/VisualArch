import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { store } from '../models/store';
import { authenticateJWT } from '../middleware/auth';
import { User, JWTPayload } from '../types';
import { PLAN_CREDITS } from '../services/credits.service';

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET ?? 'visualarch_jwt_secret_dev_2025';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET ?? 'visualarch_refresh_secret_dev_2025';

function generateAccessToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
}

function generateRefreshToken(): string {
  return crypto.randomBytes(64).toString('hex');
}

// Validation schemas
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
router.post('/register', async (req: Request, res: Response) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.errors[0].message });
    }

    const { email, password, name } = parsed.data;

    if (store.findUserByEmail(email)) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const refreshToken = generateRefreshToken();
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

    const user: User = {
      id: uuidv4(),
      email,
      name,
      passwordHash,
      plan: 'free',
      creditsBalance: PLAN_CREDITS.free,
      creditsResetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      refreshTokenHash,
      onboardingCompleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    store.saveUser(user);

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
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        plan: user.plan,
        creditsBalance: user.creditsBalance,
        onboardingCompleted: user.onboardingCompleted,
      },
    });
  } catch (error) {
    console.error('[Auth] Register error:', error);
    return res.status(500).json({ error: 'Registration failed' });
  }
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid email or password format' });
    }

    const { email, password } = parsed.data;
    const user = store.findUserByEmail(email);

    if (!user) {
      // Prevent timing attacks by still running bcrypt
      await bcrypt.compare(password, '$2a$12$invalid.hash.to.prevent.timing.attacks');
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const passwordValid = await bcrypt.compare(password, user.passwordHash);
    if (!passwordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const refreshToken = generateRefreshToken();
    user.refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    user.updatedAt = new Date();
    store.saveUser(user);

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
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        plan: user.plan,
        creditsBalance: user.creditsBalance,
        onboardingCompleted: user.onboardingCompleted,
      },
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

    // Find user with matching refresh token
    let targetUser: User | undefined;
    for (const user of store.users.values()) {
      if (user.refreshTokenHash) {
        const valid = await bcrypt.compare(refreshToken, user.refreshTokenHash);
        if (valid) { targetUser = user; break; }
      }
    }

    if (!targetUser) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    // Token rotation
    const newRefreshToken = generateRefreshToken();
    targetUser.refreshTokenHash = await bcrypt.hash(newRefreshToken, 10);
    targetUser.updatedAt = new Date();
    store.saveUser(targetUser);

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
router.get('/me', authenticateJWT, (req: Request, res: Response) => {
  const user = store.findUserById(req.user!.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  return res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    plan: user.plan,
    creditsBalance: user.creditsBalance,
    creditsResetDate: user.creditsResetDate,
    avatarUrl: user.avatarUrl,
    onboardingCompleted: user.onboardingCompleted,
  });
});

// POST /api/auth/logout
router.post('/logout', authenticateJWT, (req: Request, res: Response) => {
  const user = store.findUserById(req.user!.userId);
  if (user) {
    user.refreshTokenHash = undefined;
    store.saveUser(user);
  }

  res.clearCookie('refreshToken');
  return res.json({ message: 'Logged out successfully' });
});

// PATCH /api/users/me
router.patch('/users/me', authenticateJWT, async (req: Request, res: Response) => {
  const user = store.findUserById(req.user!.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const { name, avatarUrl } = req.body;
  if (name) user.name = name;
  if (avatarUrl) user.avatarUrl = avatarUrl;
  user.updatedAt = new Date();
  store.saveUser(user);

  return res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    avatarUrl: user.avatarUrl,
  });
});

// DELETE /api/users/me (GDPR)
router.delete('/users/me', authenticateJWT, (req: Request, res: Response) => {
  const userId = req.user!.userId;
  store.deleteUser(userId);
  res.clearCookie('refreshToken');
  return res.json({ message: 'Account deletion queued. Data will be removed within 30 days.' });
});

export default router;
