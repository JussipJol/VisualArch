import { Router, Request, Response } from 'express';
import { authenticateJWT } from '../middleware/auth';
import { creditsService } from '../services/credits.service';
import { UserModel } from '../models/schemas/User.schema';
import { NotificationModel } from '../models/schemas/Notification.schema';

const creditsRouter = Router();
const notifRouter = Router();

// GET /api/credits/balance
creditsRouter.get('/balance', authenticateJWT, async (req: Request, res: Response) => {
  const { balance, plan, history } = await creditsService.getBalance(req.user!.userId);
  const user = await UserModel.findById(req.user!.userId);

  return res.json({
    data: {
      balance,
      plan,
      resetDate: user?.creditsResetDate,
      history,
    },
  });
});

// POST /api/credits/purchase - mock Stripe checkout
creditsRouter.post('/purchase', authenticateJWT, async (req: Request, res: Response) => {
  const { package: pkg } = req.body;

  const packages: Record<string, { credits: number; price: number }> = {
    starter: { credits: 500, price: 4.99 },
    growth: { credits: 1500, price: 12.99 },
    pro: { credits: 5000, price: 34.99 },
  };

  const selected = packages[pkg ?? 'starter'];
  if (!selected) return res.status(400).json({ error: 'Invalid package' });

  // In production: create Stripe checkout session
  // For demo: directly add credits
  await creditsService.addCredits(req.user!.userId, selected.credits, 'purchase', {
    package: pkg,
    price: selected.price,
    stripeSessionId: 'demo_' + Date.now(),
  });

  const user = await UserModel.findById(req.user!.userId);

  return res.json({
    data: {
      creditsAdded: selected.credits,
      newBalance: user?.creditsBalance,
      // In production: checkoutUrl: stripeSession.url
    },
  });
});

// GET /api/notifications
notifRouter.get('/', authenticateJWT, async (req: Request, res: Response) => {
  const page = parseInt(String(req.query.page ?? '1'));
  const limit = parseInt(String(req.query.limit ?? '20'));

  const skip = (page - 1) * limit;
  
  const [notifications, total, unreadCount] = await Promise.all([
    NotificationModel.find({ userId: req.user!.userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    NotificationModel.countDocuments({ userId: req.user!.userId }),
    NotificationModel.countDocuments({ userId: req.user!.userId, read: false })
  ]);

  return res.json({
    data: notifications,
    unreadCount,
    total,
    page,
    pages: Math.ceil(total / limit),
  });
});

// POST /api/notifications/read-all
notifRouter.post('/read-all', authenticateJWT, async (req: Request, res: Response) => {
  await NotificationModel.updateMany(
    { userId: req.user!.userId, read: false },
    { $set: { read: true } }
  );
  return res.json({ message: 'All notifications marked as read' });
});

export { creditsRouter, notifRouter };
