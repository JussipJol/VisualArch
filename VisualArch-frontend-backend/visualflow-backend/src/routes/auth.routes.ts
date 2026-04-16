import { Router } from 'express';
import { register, login, refresh, logout, getMe, oauthSuccess } from '../controllers/auth.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { authLimiter } from '../middleware/rateLimiter';
import { registerValidation, handleValidationErrors } from '../middleware/validate';
import passport from 'passport';

const router = Router();

router.post('/register', authLimiter, registerValidation, handleValidationErrors, register);
router.post('/login', authLimiter, login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', requireAuth, getMe);

// ── OAuth Routes ────────────────────────────────────────────────────────────

// GitHub
router.get('/github', passport.authenticate('github', { scope: ['user:email'], session: false }));
router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/login?error=github_failed', session: false }), oauthSuccess);

// Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login?error=google_failed', session: false }), oauthSuccess);

// Discord
router.get('/discord', passport.authenticate('discord', { session: false }));
router.get('/discord/callback', passport.authenticate('discord', { failureRedirect: '/login?error=discord_failed', session: false }), oauthSuccess);

export default router;
