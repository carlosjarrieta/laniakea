import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
  id: number;
  email: string;
  name: string;
  role: 'advertiser' | 'superadmin';
  timezone: string;
  locale: string;
  theme_color?: string;
  has_account?: boolean;
  has_active_plan?: boolean;
  account_role?: 'member' | 'admin' | 'owner';
  plan?: {
    name: string;
    features: Record<string, any>;
  };
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
      updateUser: (userData) => set((state) => ({ 
        user: state.user ? { ...state.user, ...userData } : null 
      })),
    }),
    {
      name: 'laniakea-auth',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
