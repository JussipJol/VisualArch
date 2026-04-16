import { Router } from 'express';
import { generateDesign, getDesign } from '../controllers/design.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { aiLimiter } from '../middleware/rateLimiter';

const router = Router({ mergeParams: true });

router.use(requireAuth);
router.post('/generate', aiLimiter, generateDesign);
router.get('/', getDesign);

export default router;
