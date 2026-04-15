import { Router } from 'express';
import { generateDataset, getData, downloadData } from '../controllers/data.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { aiLimiter } from '../middleware/rateLimiter';

const router = Router({ mergeParams: true });

router.use(requireAuth);
router.post('/generate', aiLimiter, generateDataset);
router.get('/', getData);
router.get('/download', downloadData);

export default router;
