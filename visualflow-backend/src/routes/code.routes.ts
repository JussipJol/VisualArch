import { Router } from 'express';
<<<<<<< HEAD
import { generateCode, getCode, getFile, downloadZip, getFullCode } from '../controllers/code.controller';
=======
import { generateCode, getCode, getFile, downloadZip, getFullCode, updateFile } from '../controllers/code.controller';
>>>>>>> 48106fb (update project)
import { requireAuth } from '../middleware/auth.middleware';
import { aiLimiter } from '../middleware/rateLimiter';

const router = Router({ mergeParams: true });

router.use(requireAuth);
router.post('/generate', aiLimiter, generateCode);
router.get('/', getCode);
router.get('/full', getFullCode);
router.get('/file', getFile);
<<<<<<< HEAD
=======
router.put('/file', updateFile);
>>>>>>> 48106fb (update project)
router.get('/zip', downloadZip);

export default router;
