import { Request, Response } from 'express';
import axios from 'axios';
import { User } from '../models/User.model';
import { config } from '../config/env';
import jwt from 'jsonwebtoken';

const signTokens = (userId: string, email: string) => {
  const accessToken = jwt.sign({ userId, email }, config.jwtSecret, { expiresIn: config.jwtExpiresIn } as jwt.SignOptions);
  const refreshToken = jwt.sign({ userId, email }, config.jwtRefreshSecret, { expiresIn: config.jwtRefreshExpiresIn } as jwt.SignOptions);
  return { accessToken, refreshToken };
};

const setRefreshCookie = (res: Response, token: string) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

// ─── GITHUB ──────────────────────────────────────────

export const redirectToGitHub = (_req: Request, res: Response) => {
  const params = new URLSearchParams({
    client_id: config.githubClientId,
    redirect_uri: `${config.backendUrl}/api/auth/github/callback`,
    scope: 'read:user user:email',
  });
  res.redirect(`https://github.com/login/oauth/authorize?${params}`);
};

export const githubCallback = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code } = req.query;
    if (!code) { res.redirect(`${config.clientUrl}/login?error=no_code`); return; }

    // 1. Обменять code на access_token
    const tokenRes = await axios.post(
      'https://github.com/login/oauth/access_token',
      { client_id: config.githubClientId, client_secret: config.githubClientSecret, code },
      { headers: { Accept: 'application/json' } }
    );
    const githubToken = tokenRes.data.access_token;
    if (!githubToken) { res.redirect(`${config.clientUrl}/login?error=no_token`); return; }

    // 2. Получить профиль
    const profileRes = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${githubToken}` },
    });
    const profile = profileRes.data;

    // 3. Получить email (может быть приватным)
    let email = profile.email;
    if (!email) {
      const emailsRes = await axios.get('https://api.github.com/user/emails', {
        headers: { Authorization: `Bearer ${githubToken}` },
      });
      const primary = emailsRes.data.find((e: any) => e.primary && e.verified);
      email = primary?.email;
    }
    if (!email) { res.redirect(`${config.clientUrl}/login?error=no_email`); return; }

    // 4. Найти или создать юзера
    let user = await User.findOne({ oauthProvider: 'github', oauthId: String(profile.id) });
    if (!user) {
      user = await User.findOne({ email: email.toLowerCase() });
      if (user) {
        user.oauthProvider = 'github';
        user.oauthId = String(profile.id);
        user.avatar = profile.avatar_url || null;
        await user.save();
      } else {
        user = await User.create({
          email: email.toLowerCase(),
          name: profile.name || profile.login,
          passwordHash: null,
          oauthProvider: 'github',
          oauthId: String(profile.id),
          avatar: profile.avatar_url || null,
        });
      }
    }

    // 5. Выдать токены и редиректнуть
    const { accessToken, refreshToken } = signTokens(user._id.toString(), user.email);
    setRefreshCookie(res, refreshToken);
    res.redirect(`${config.clientUrl}/oauth/callback?token=${accessToken}`);
  } catch (err) {
    console.error('GitHub OAuth error:', err);
    res.redirect(`${config.clientUrl}/login?error=github_failed`);
  }
};

// ─── GOOGLE ──────────────────────────────────────────

export const redirectToGoogle = (_req: Request, res: Response) => {
  const params = new URLSearchParams({
    client_id: config.googleClientId,
    redirect_uri: `${config.backendUrl}/api/auth/google/callback`,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
  });
  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
};

export const googleCallback = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code } = req.query;
    if (!code) { res.redirect(`${config.clientUrl}/login?error=no_code`); return; }

    // 1. Обменять code на токен
    const tokenRes = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: config.googleClientId,
      client_secret: config.googleClientSecret,
      redirect_uri: `${config.backendUrl}/api/auth/google/callback`,
      grant_type: 'authorization_code',
      code,
    });
    const googleToken = tokenRes.data.access_token;

    // 2. Получить профиль
    const profileRes = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${googleToken}` },
    });
    const profile = profileRes.data;
    if (!profile.email) { res.redirect(`${config.clientUrl}/login?error=no_email`); return; }

    // 3. Найти или создать юзера
    let user = await User.findOne({ oauthProvider: 'google', oauthId: String(profile.id) });
    if (!user) {
      user = await User.findOne({ email: profile.email.toLowerCase() });
      if (user) {
        user.oauthProvider = 'google';
        user.oauthId = String(profile.id);
        user.avatar = profile.picture || null;
        await user.save();
      } else {
        user = await User.create({
          email: profile.email.toLowerCase(),
          name: profile.name,
          passwordHash: null,
          oauthProvider: 'google',
          oauthId: String(profile.id),
          avatar: profile.picture || null,
        });
      }
    }

    const { accessToken, refreshToken } = signTokens(user._id.toString(), user.email);
    setRefreshCookie(res, refreshToken);
    res.redirect(`${config.clientUrl}/oauth/callback?token=${accessToken}`);
  } catch (err) {
    console.error('Google OAuth error:', err);
    res.redirect(`${config.clientUrl}/login?error=google_failed`);
  }
};

// ─── DISCORD ─────────────────────────────────────────

export const redirectToDiscord = (_req: Request, res: Response) => {
  const params = new URLSearchParams({
    client_id: config.discordClientId,
    redirect_uri: `${config.backendUrl}/api/auth/discord/callback`,
    response_type: 'code',
    scope: 'identify email',
  });
  res.redirect(`https://discord.com/api/oauth2/authorize?${params}`);
};

export const discordCallback = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code } = req.query;
    if (!code) { res.redirect(`${config.clientUrl}/login?error=no_code`); return; }

    // 1. Обменять code на токен
    const tokenRes = await axios.post(
      'https://discord.com/api/oauth2/token',
      new URLSearchParams({
        client_id: config.discordClientId,
        client_secret: config.discordClientSecret,
        grant_type: 'authorization_code',
        code: String(code),
        redirect_uri: `${config.backendUrl}/api/auth/discord/callback`,
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    const discordToken = tokenRes.data.access_token;

    // 2. Получить профиль
    const profileRes = await axios.get('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${discordToken}` },
    });
    const profile = profileRes.data;
    if (!profile.email) { res.redirect(`${config.clientUrl}/login?error=no_email`); return; }

    // 3. Найти или создать юзера
    let user = await User.findOne({ oauthProvider: 'discord', oauthId: String(profile.id) });
    if (!user) {
      user = await User.findOne({ email: profile.email.toLowerCase() });
      if (user) {
        user.oauthProvider = 'discord';
        user.oauthId = String(profile.id);
        user.avatar = profile.avatar ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png` : null;
        await user.save();
      } else {
        user = await User.create({
          email: profile.email.toLowerCase(),
          name: profile.global_name || profile.username,
          passwordHash: null,
          oauthProvider: 'discord',
          oauthId: String(profile.id),
          avatar: profile.avatar ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png` : null,
        });
      }
    }

    const { accessToken, refreshToken } = signTokens(user._id.toString(), user.email);
    setRefreshCookie(res, refreshToken);
    res.redirect(`${config.clientUrl}/oauth/callback?token=${accessToken}`);
  } catch (err) {
    console.error('Discord OAuth error:', err);
    res.redirect(`${config.clientUrl}/login?error=discord_failed`);
  }
};