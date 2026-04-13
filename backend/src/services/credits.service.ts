import { v4 as uuidv4 } from 'uuid';
import { store } from '../models/store';
import { Transaction, TransactionType, PlanType } from '../types';

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
  deductCredits(userId: string, amount: number, meta: Record<string, unknown>): boolean {
    const user = store.findUserById(userId);
    if (!user || user.creditsBalance < amount) return false;

    const newBalance = user.creditsBalance - amount;
    user.creditsBalance = newBalance;
    user.updatedAt = new Date();
    store.saveUser(user);

    const tx: Transaction = {
      id: uuidv4(),
      userId,
      type: 'spend' as TransactionType,
      amount: -amount,
      balanceAfter: newBalance,
      meta,
      createdAt: new Date(),
    };
    store.addTransaction(userId, tx);
    return true;
  }

  addCredits(userId: string, amount: number, type: TransactionType, meta: Record<string, unknown>): boolean {
    const user = store.findUserById(userId);
    if (!user) return false;

    const newBalance = user.creditsBalance + amount;
    user.creditsBalance = newBalance;
    user.updatedAt = new Date();
    store.saveUser(user);

    const tx: Transaction = {
      id: uuidv4(),
      userId,
      type,
      amount,
      balanceAfter: newBalance,
      meta,
      createdAt: new Date(),
    };
    store.addTransaction(userId, tx);
    return true;
  }

  getBalance(userId: string): { balance: number; plan: PlanType; history: Transaction[] } {
    const user = store.findUserById(userId);
    if (!user) return { balance: 0, plan: 'free', history: [] };

    return {
      balance: user.creditsBalance,
      plan: user.plan,
      history: store.getTransactions(userId).slice(0, 50),
    };
  }

  calculateGenerationCost(nodeCount: number): number {
    if (nodeCount <= 5) return CREDITS_COSTS.GENERATE_SMALL;
    if (nodeCount <= 15) return CREDITS_COSTS.GENERATE_MEDIUM;
    return CREDITS_COSTS.GENERATE_LARGE;
  }

  resetMonthlyCredits(userId: string): void {
    const user = store.findUserById(userId);
    if (!user) return;

    const monthlyCredits = PLAN_CREDITS[user.plan];
    user.creditsBalance = monthlyCredits;
    user.creditsResetDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    store.saveUser(user);
  }
}

export const creditsService = new CreditsService();
