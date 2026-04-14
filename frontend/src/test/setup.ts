import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), back: vi.fn(), replace: vi.fn() }),
  useParams: () => ({ id: 'test-workspace-id' }),
  usePathname: () => '/dashboard',
}));

// Mock fetch
global.fetch = vi.fn();
