import { Router } from 'express';
import { register, login, refresh, logout, getMe } from '../controllers/auth.controller';
import {
  redirectToGitHub, githubCallback,
  redirectToGoogle, googleCallback,
  redirectToDiscord, discordCallback,
} from '../controllers/oauth.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { authLimiter } from '../middleware/rateLimiter';
import { registerValidation, handleValidationErrors } from '../middleware/validate';

const router = Router();

router.post('/register', authLimiter, registerValidation, handleValidationErrors, register);
router.post('/login', authLimiter, login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', requireAuth, getMe);

router.get('/github', redirectToGitHub);
router.get('/github/callback', githubCallback);

router.get('/google', redirectToGoogle);
router.get('/google/callback', googleCallback);

router.get('/discord', redirectToDiscord);
router.get('/discord/callback', discordCallback);

export default router;