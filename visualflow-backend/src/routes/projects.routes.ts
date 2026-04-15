import { Router } from 'express';
import { getProjects, createProject, getProject, updateProject, patchProject, deleteProject } from '../controllers/projects.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.use(requireAuth);
router.get('/', getProjects);
router.post('/', createProject);
router.get('/:id', getProject);
router.put('/:id', updateProject);
router.patch('/:id', patchProject);
router.delete('/:id', deleteProject);

export default router;
