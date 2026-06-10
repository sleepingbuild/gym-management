import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      setAuth: (user, accessToken, refreshToken) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('refreshToken', refreshToken);
        }
        set({ user, accessToken, isAuthenticated: true });
      },

      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('refreshToken');
        }
        set({ user: null, accessToken: null, isAuthenticated: false });
      },
    }),
    {
      name: 'ironfit-auth',
      storage: createJSONStorage(() => localStorage),
      skipHydration: false,
    }
  )
);