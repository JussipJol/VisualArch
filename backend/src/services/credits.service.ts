import { v4 as uuidv4 } from 'uuid';
import { Transaction, TransactionType, PlanType } from '../types';
import { UserModel } from '../models/schemas/User.schema';
import { TransactionModel } from '../models/schemas/Transaction.schema';

export const CREDITS_COSTS = {
  CREATE_WORKSPACE: 5,
  GENERATE_SMALL: 10,  // up to 5 nodes
  GENERATE_MEDIUM: 20, // 6-15 nodes
  GENERATE_LARGE: 40,  // 16+ nodes
  CRITIQUE: 5,
  TEST_SCAFFOLD: 10,
  CICD: 15,
  ADR_AI: 3,
  PREMIUM_TEMPLATE_MIN: 5,
  PREMIUM_TEMPLATE_MAX: 50,
  SYNC_RECONCILE: 20,
} as const;

export const CREDITS_EARN = {
  INVITE_COLLABORATOR: 20,
  PUBLISH_TEMPLATE_USE: 10,
  SHARE_WORKSPACE: 20,
} as const;

export const PLAN_CREDITS: Record<PlanType, number> = {
  free: 100,
  pro: 2000,
  team: 10000,
  enterprise: 999999,
};

export class CreditsService {
  async deductCredits(userId: string, amount: number, meta: Record<string, unknown>): Promise<boolean> {
    // Atomic update: only deduct if current balance >= amount
    const user = await UserModel.findOneAndUpdate(
      { _id: userId, creditsBalance: { $gte: amount } },
      { $inc: { creditsBalance: -amount } },
      { new: true }
    );

    if (!user) return false;

    const tx = new TransactionModel({
      userId,
      type: 'spend',
      amount: -amount,
      balanceAfter: user.creditsBalance,
      meta,
    });
    
    await tx.save();
    return true;
  }

  async addCredits(userId: string, amount: number, type: TransactionType, meta: Record<string, unknown>): Promise<boolean> {
    const user = await UserModel.findByIdAndUpdate(
      userId,
      { $inc: { creditsBalance: amount } },
      { new: true }
    );

    if (!user) return false;

    const tx = new TransactionModel({
      userId,
      type,
      amount,
      balanceAfter: user.creditsBalance,
      meta,
    });
    
    await tx.save();
    return true;
  }

  async getBalance(userId: string): Promise<{ balance: number; plan: PlanType; history: any[] }> {
    const user = await UserModel.findById(userId);
    if (!user) return { balance: 0, plan: 'free', history: [] };

    const history = await TransactionModel.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50);

    return {
      balance: user.creditsBalance,
      plan: user.plan,
      history,
    };
  }

  calculateGenerationCost(nodeCount: number): number {
    if (nodeCount <= 5) return CREDITS_COSTS.GENERATE_SMALL;
    if (nodeCount <= 15) return CREDITS_COSTS.GENERATE_MEDIUM;
    return CREDITS_COSTS.GENERATE_LARGE;
  }

  async resetMonthlyCredits(userId: string): Promise<void> {
    const user = await UserModel.findById(userId);
    if (!user) return;

    const monthlyCredits = PLAN_CREDITS[user.plan];
    await UserModel.findByIdAndUpdate(userId, {
      $set: {
        creditsBalance: monthlyCredits,
        creditsResetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }
    });
  }
}

export const creditsService = new CreditsService();
