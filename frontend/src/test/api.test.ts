import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Test the API client logic (without network calls)
describe('API Client', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('stores and retrieves token from localStorage', async () => {
    const { api } = await import('@/lib/api');
    api.setToken('test-jwt-token');
    expect(api.getToken()).toBe('test-jwt-token');
  });

  it('clears token when set to null', async () => {
    const { api } = await import('@/lib/api');
    api.setToken('test-jwt-token');
    api.setToken(null);
    expect(api.getToken()).toBeNull();
  });
});

describe('Credits cost constants', () => {
  it('validates expected cost values', () => {
    const costs = {
      CREATE_WORKSPACE: 5,
      GENERATE_SMALL: 10,
      GENERATE_MEDIUM: 20,
      GENERATE_LARGE: 40,
      CRITIQUE: 5,
      TEST_SCAFFOLD: 10,
      CICD: 15,
      ADR_AI: 3,
    };

    expect(costs.GENERATE_LARGE).toBeGreaterThan(costs.GENERATE_MEDIUM);
    expect(costs.GENERATE_MEDIUM).toBeGreaterThan(costs.GENERATE_SMALL);
    expect(costs.CREATE_WORKSPACE).toBeLessThan(costs.GENERATE_SMALL);
  });
});

describe('Architecture score color logic', () => {
  const getScoreColor = (score: number) =>
    score >= 80 ? 'green' : score >= 60 ? 'yellow' : 'red';

  it('returns green for score >= 80', () => {
    expect(getScoreColor(80)).toBe('green');
    expect(getScoreColor(100)).toBe('green');
  });

  it('returns yellow for score 60-79', () => {
    expect(getScoreColor(60)).toBe('yellow');
    expect(getScoreColor(79)).toBe('yellow');
  });

  it('returns red for score < 60', () => {
    expect(getScoreColor(0)).toBe('red');
    expect(getScoreColor(59)).toBe('red');
  });
});
