import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { UserModel } from './schemas/User.schema';
import { PLAN_CREDITS } from '../services/credits.service';

/**
 * Seeds a demo user if none exists.
 * Only runs in development / when MongoDB is connected.
 */
export async function seedDemoUser(): Promise<void> {
  // Skip if no DB connection
  if (mongoose.connection.readyState !== 1) return;

  const DEMO_EMAIL = 'demo@visualarch.ai';

  const existing = await UserModel.findOne({ email: DEMO_EMAIL }).lean();
  if (existing) return; // already seeded

  const passwordHash = await bcrypt.hash('demo123456', 12);

  await UserModel.create({
    email: DEMO_EMAIL,
    name: 'Demo User',
    passwordHash,
    plan: 'pro',
    creditsBalance: PLAN_CREDITS.pro,
    onboardingCompleted: true,
  });

  console.log('✅ Demo user seeded: demo@visualarch.ai / demo123456');
}
