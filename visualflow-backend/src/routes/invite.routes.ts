import { Router } from 'express';
import { generateInviteLink, acceptInvite, getCollaborators } from '../controllers/invite.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router({ mergeParams: true });

router.use(requireAuth);

// Generate an invite link for a specific project (owner only)
router.post('/projects/:id/invite', generateInviteLink);

// Accept an invite and join a project
router.post('/invite/join', acceptInvite);

// List collaborators of a project
router.get('/projects/:id/collaborators', getCollaborators);

export default router;
