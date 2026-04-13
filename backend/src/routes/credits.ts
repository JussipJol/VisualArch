import { Router, Request, Response } from 'express';
import { store } from '../models/store';
import { authenticateJWT } from '../middleware/auth';
import { creditsService } from '../services/credits.service';

const creditsRouter = Router();
const notifRouter = Router();

// GET /api/credits/balance
creditsRouter.get('/balance', authenticateJWT, (req: Request, res: Response) => {
  const { balance, plan, history } = creditsService.getBalance(req.user!.userId);
  const user = store.findUserById(req.user!.userId);

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
  creditsService.addCredits(req.user!.userId, selected.credits, 'purchase', {
    package: pkg,
    price: selected.price,
    stripeSessionId: 'demo_' + Date.now(),
  });

  return res.json({
    data: {
      creditsAdded: selected.credits,
      newBalance: store.findUserById(req.user!.userId)?.creditsBalance,
      // In production: checkoutUrl: stripeSession.url
    },
  });
});

// GET /api/notifications
notifRouter.get('/', authenticateJWT, (req: Request, res: Response) => {
  const page = parseInt(String(req.query.page ?? '1'));
  const limit = parseInt(String(req.query.limit ?? '20'));

  const notifications = store.getNotifications(req.user!.userId);
  const start = (page - 1) * limit;
  const paginated = notifications.slice(start, start + limit);
  const unreadCount = notifications.filter(n => !n.read).length;

  return res.json({
    data: paginated,
    unreadCount,
    total: notifications.length,
    page,
    pages: Math.ceil(notifications.length / limit),
  });
});

// POST /api/notifications/read-all
notifRouter.post('/read-all', authenticateJWT, (req: Request, res: Response) => {
  store.markAllNotificationsRead(req.user!.userId);
  return res.json({ message: 'All notifications marked as read' });
});

export { creditsRouter, notifRouter };
