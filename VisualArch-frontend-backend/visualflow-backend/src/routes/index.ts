import { Router } from 'express';
import authRoutes from './auth.routes';
import projectRoutes from './projects.routes';
import inviteRoutes from './invite.routes';
// ── Feature modules ──────────────────────────────────────────────────────────
import canvasRoutes from '../modules/canvas/canvas.routes';
import designRoutes from '../modules/design/design.routes';
import dataRoutes from '../modules/data/data.routes';
import codeRoutes from '../modules/ide/code.routes';
import { requireAuth } from '../middleware/auth.middleware';
import { ProjectMemory } from '../models/ProjectMemory.model';

const router = Router();

router.use('/auth', authRoutes);
router.use('/projects', projectRoutes);
router.use('/', inviteRoutes);
router.use('/projects/:id/canvas', canvasRoutes);
router.use('/projects/:id/design', designRoutes);
router.use('/projects/:id/data', dataRoutes);
router.use('/projects/:id/code', codeRoutes);

// Memory route
router.get('/projects/:id/memory', requireAuth, async (req, res) => {
  try {
    const memory = await ProjectMemory.findOne({ projectId: req.params.id });
    res.json({ memory });
  } catch {
    res.status(500).json({ error: 'Failed to fetch memory' });
  }
});

export default router;
