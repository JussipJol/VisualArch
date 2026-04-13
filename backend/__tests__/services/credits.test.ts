import { CreditsService, CREDITS_COSTS } from '../../src/services/credits.service';
import { store } from '../../src/models/store';
import { User } from '../../src/types';
import { v4 as uuidv4 } from 'uuid';

function createTestUser(creditsBalance = 100): User {
  const user: User = {
    id: uuidv4(),
    email: `test-${Date.now()}@example.com`,
    name: 'Test User',
    passwordHash: 'hash',
    plan: 'free',
    creditsBalance,
    creditsResetDate: new Date(),
    onboardingCompleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  store.saveUser(user);
  return user;
}

describe('CreditsService', () => {
  let service: CreditsService;

  beforeEach(() => {
    service = new CreditsService();
  });

  describe('deductCredits', () => {
    it('should deduct credits successfully', () => {
      const user = createTestUser(100);
      const result = service.deductCredits(user.id, 10, { action: 'test' });

      expect(result).toBe(true);
      expect(store.findUserById(user.id)?.creditsBalance).toBe(90);
    });

    it('should fail when insufficient credits', () => {
      const user = createTestUser(5);
      const result = service.deductCredits(user.id, 10, { action: 'test' });

      expect(result).toBe(false);
      expect(store.findUserById(user.id)?.creditsBalance).toBe(5); // unchanged
    });

    it('should create transaction record', () => {
      const user = createTestUser(100);
      service.deductCredits(user.id, 15, { action: 'generate' });

      const txs = store.getTransactions(user.id);
      expect(txs.length).toBe(1);
      expect(txs[0].amount).toBe(-15);
      expect(txs[0].type).toBe('spend');
      expect(txs[0].balanceAfter).toBe(85);
    });
  });

  describe('addCredits', () => {
    it('should add earned credits', () => {
      const user = createTestUser(50);
      service.addCredits(user.id, 20, 'earn', { reason: 'invite' });

      expect(store.findUserById(user.id)?.creditsBalance).toBe(70);
    });

    it('should create earn transaction', () => {
      const user = createTestUser(50);
      service.addCredits(user.id, 20, 'earn', { reason: 'invite' });

      const txs = store.getTransactions(user.id);
      expect(txs[0].type).toBe('earn');
      expect(txs[0].amount).toBe(20);
    });
  });

  describe('calculateGenerationCost', () => {
    it('should return small cost for ≤5 nodes', () => {
      expect(service.calculateGenerationCost(3)).toBe(CREDITS_COSTS.GENERATE_SMALL);
      expect(service.calculateGenerationCost(5)).toBe(CREDITS_COSTS.GENERATE_SMALL);
    });

    it('should return medium cost for 6-15 nodes', () => {
      expect(service.calculateGenerationCost(6)).toBe(CREDITS_COSTS.GENERATE_MEDIUM);
      expect(service.calculateGenerationCost(15)).toBe(CREDITS_COSTS.GENERATE_MEDIUM);
    });

    it('should return large cost for 16+ nodes', () => {
      expect(service.calculateGenerationCost(16)).toBe(CREDITS_COSTS.GENERATE_LARGE);
      expect(service.calculateGenerationCost(100)).toBe(CREDITS_COSTS.GENERATE_LARGE);
    });
  });

  describe('getBalance', () => {
    it('should return correct balance and history', () => {
      const user = createTestUser(200);
      service.deductCredits(user.id, 10, { action: 'test' });
      service.addCredits(user.id, 5, 'earn', { reason: 'viral' });

      const { balance, plan, history } = service.getBalance(user.id);
      expect(balance).toBe(195);
      expect(plan).toBe('free');
      expect(history.length).toBe(2);
    });

    it('should return zeros for non-existent user', () => {
      const { balance } = service.getBalance('non-existent');
      expect(balance).toBe(0);
    });
  });
});
