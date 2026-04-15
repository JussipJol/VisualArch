// ─── Module: Canvas Routes ────────────────────────────────────────────────────

import { Router } from 'express';
import { generateCanvas, saveCanvas, getCanvas, getCanvasHistory } from './canvas.controller';
import { requireAuth } from '../../middleware/auth.middleware';
import { aiLimiter } from '../../middleware/rateLimiter';

const router = Router({ mergeParams: true });

router.use(requireAuth);
router.post('/generate', aiLimiter, generateCanvas);
router.put('/', saveCanvas);
router.get('/', getCanvas);
router.get('/history', getCanvasHistory);

export default router;
