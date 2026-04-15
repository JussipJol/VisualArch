import { Router } from 'express';
import { generateCode, getCode, getFile, downloadZip, getFullCode } from '../controllers/code.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { aiLimiter } from '../middleware/rateLimiter';

const router = Router({ mergeParams: true });

router.use(requireAuth);
router.post('/generate', aiLimiter, generateCode);
router.get('/', getCode);
router.get('/full', getFullCode);
router.get('/file', getFile);
router.get('/zip', downloadZip);

export default router;
