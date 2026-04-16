import { Router } from 'express';
<<<<<<< HEAD
import { getProjects, createProject, getProject, updateProject, deleteProject } from '../controllers/projects.controller';
=======
import { getProjects, createProject, getProject, updateProject, patchProject, deleteProject } from '../controllers/projects.controller';
>>>>>>> 48106fb (update project)
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.use(requireAuth);
router.get('/', getProjects);
router.post('/', createProject);
router.get('/:id', getProject);
router.put('/:id', updateProject);
<<<<<<< HEAD
=======
router.patch('/:id', patchProject);
>>>>>>> 48106fb (update project)
router.delete('/:id', deleteProject);

export default router;
