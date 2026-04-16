import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.model';
import { config } from '../config/env';
import { AuthRequest } from '../types';

const signTokens = (userId: string, email: string) => {
  const accessToken = jwt.sign({ userId, email }, config.jwtSecret, { expiresIn: config.jwtExpiresIn } as jwt.SignOptions);
  const refreshToken = jwt.sign({ userId, email }, config.jwtRefreshSecret, { expiresIn: config.jwtRefreshExpiresIn } as jwt.SignOptions);
  return { accessToken, refreshToken };
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      res.status(400).json({ error: 'Email, password and name are required' });
      return;
    }
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      res.status(400).json({ error: 'Email already registered' });
      return;
    }
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ email: email.toLowerCase(), passwordHash, name });
    const { accessToken, refreshToken } = signTokens(user._id.toString(), user.email);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: config.nodeEnv === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      accessToken,
      user: { id: user._id, email: user.email, name: user.name, plan: user.plan },
    });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password required' });
      return;
    }
    const user = await User.findOne({ email: email.toLowerCase() });
    const isValidPassword = user?.passwordHash && await bcrypt.compare(password, user.passwordHash);
    if (!user || !isValidPassword) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }
    const { accessToken, refreshToken } = signTokens(user._id.toString(), user.email);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: config.nodeEnv === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      accessToken,
      user: { id: user._id, email: user.email, name: user.name, plan: user.plan },
    });
  } catch {
    res.status(500).json({ error: 'Login failed' });
  }
};

export const refresh = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) {
      res.status(401).json({ error: 'No refresh token' });
      return;
    }
    const decoded = jwt.verify(token, config.jwtRefreshSecret) as { userId: string; email: string };
    const { accessToken, refreshToken } = signTokens(decoded.userId, decoded.email);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: config.nodeEnv === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken });
  } catch {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
};

export const logout = (_req: Request, res: Response): void => {
  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out' });
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user!.userId).select('-passwordHash');
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json({ user: { id: user._id, email: user.email, name: user.name, plan: user.plan } });
  } catch {
    res.status(500).json({ error: 'Failed to get user' });
  }
};

export const oauthSuccess = (req: Request, res: Response): void => {
  const user = req.user as any;
  if (!user) {
    res.redirect(`${config.clientUrl}/login?error=OAuth failed`);
    return;
  }

  const { accessToken, refreshToken } = signTokens(user._id.toString(), user.email);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  // Redirect to frontend with accessToken
  res.redirect(`${config.clientUrl}/dashboard?token=${accessToken}`);
};
