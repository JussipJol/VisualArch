import { Router, Request, Response } from 'express';
import { authenticateJWT } from '../middleware/auth';
import { UserModel } from '../models/schemas/User.schema';
import { RefreshTokenModel } from '../models/schemas/RefreshToken.schema';

const router = Router();

// PATCH /api/users/me
router.patch('/me', authenticateJWT, async (req: Request, res: Response) => {
  const { name, avatarUrl } = req.body;
  const update: Record<string, any> = {};
  if (name) update.name = name;
  if (avatarUrl) update.avatarUrl = avatarUrl;

  const user = await UserModel.findByIdAndUpdate(
    req.user!.userId,
    { $set: update },
    { new: true }
  );

  if (!user) return res.status(404).json({ error: 'User not found' });
  return res.json(user.toJSON());
});

// DELETE /api/users/me (GDPR)
router.delete('/me', authenticateJWT, async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  await UserModel.findByIdAndDelete(userId);
  await RefreshTokenModel.deleteMany({ userId });
  res.clearCookie('refreshToken');
  return res.json({ message: 'Account deleted successfully' });
});

export default router;