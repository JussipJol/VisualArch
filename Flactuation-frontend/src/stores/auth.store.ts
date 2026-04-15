import { create } from 'zustand';
import { api } from '../api/client';

interface User {
  id: string;
  email: string;
  name: string;
  plan: 'free' | 'pro';
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('accessToken'),
  loading: false,

  login: async (email, password) => {
    set({ loading: true });
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('accessToken', data.accessToken);
      set({ user: data.user, token: data.accessToken, loading: false });
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },

  register: async (email, password, name) => {
    set({ loading: true });
    try {
      const { data } = await api.post('/auth/register', { email, password, name });
      localStorage.setItem('accessToken', data.accessToken);
      set({ user: data.user, token: data.accessToken, loading: false });
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },

  logout: async () => {
    await api.post('/auth/logout').catch(() => {});
    localStorage.removeItem('accessToken');
    set({ user: null, token: null });
  },

  hydrate: async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;
    try {
      const { data } = await api.get('/auth/me');
      set({ user: data.user, token });
    } catch {
      localStorage.removeItem('accessToken');
      set({ user: null, token: null });
    }
  },
}));
