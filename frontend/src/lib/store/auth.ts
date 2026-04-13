import { create } from 'zustand';
import { api } from '@/lib/api';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  plan: 'free' | 'pro' | 'team' | 'enterprise';
  creditsBalance: number;
  creditsResetDate?: string;
  avatarUrl?: string;
  onboardingCompleted: boolean;
}

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
  updateCredits: (delta: number) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post<{ accessToken: string; user: AuthUser }>('/api/auth/login', { email, password });
      api.setToken(res.accessToken);
      set({ user: res.user, loading: false });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Login failed', loading: false });
    }
  },

  register: async (email, password, name) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post<{ accessToken: string; user: AuthUser }>('/api/auth/register', { email, password, name });
      api.setToken(res.accessToken);
      set({ user: res.user, loading: false });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Registration failed', loading: false });
    }
  },

  logout: async () => {
    try {
      await api.post('/api/auth/logout');
    } catch { /* silent */ }
    api.setToken(null);
    set({ user: null });
  },

  fetchMe: async () => {
    const token = api.getToken();
    if (!token) return;
    set({ loading: true });
    try {
      const user = await api.get<AuthUser>('/api/auth/me');
      set({ user, loading: false });
    } catch {
      api.setToken(null);
      set({ user: null, loading: false });
    }
  },

  updateCredits: (delta) => {
    const { user } = get();
    if (user) set({ user: { ...user, creditsBalance: user.creditsBalance + delta } });
  },

  clearError: () => set({ error: null }),
}));
