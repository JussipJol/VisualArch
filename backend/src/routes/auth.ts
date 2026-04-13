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
import { UserModel } from '../models/schemas/User.schema';
import { RefreshTokenModel } from '../models/schemas/RefreshToken.schema';

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET ?? 'visualarch_jwt_secret_dev_2025';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET ?? 'visualarch_refresh_secret_dev_2025';

function generateAccessToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
}

function generateRefreshToken(): string {
  return crypto.randomBytes(64).toString('hex');
}

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
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
router.post('/login', async (req: Request, res: Response) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid email or password format' });
    }

    const { email, password } = parsed.data;
    const user = await UserModel.findOne({ email });

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

    // Token rotation: delete old, create new
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

// PATCH /api/users/me
router.patch('/users/me', authenticateJWT, async (req: Request, res: Response) => {
  const { name, avatarUrl } = req.body;
  const update: Record<string, any> = {};
  if (name) update.name = name;
  if (avatarUrl) update.avatarUrl = avatarUrl;

  const user = await UserModel.findByIdAndUpdate(
    req.user!.userId,
    { $set: update },
    { new: true }
  );

  if (!user) return res.status(404).json({ error: 'User not found' });

  return res.json(user.toJSON());
});

// DELETE /api/users/me (GDPR)
router.delete('/users/me', authenticateJWT, async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  await UserModel.findByIdAndDelete(userId);
  await RefreshTokenModel.deleteMany({ userId });
  res.clearCookie('refreshToken');
  return res.json({ message: 'Account deleted successfully' });
});

export default router;
