import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/lib/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isApproved: boolean;
  
  setAuth: (user: User, token: string) => void;
  setApproved: (status: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isApproved: false,

      setAuth: (user, token) => set({ 
        user, 
        token, 
        isApproved: user.role === 'ADMIN' ? (user as any).isApproved : true 
      }),
      
      setApproved: (isApproved) => set({ isApproved }),
      
      logout: () => set({ user: null, token: null, isApproved: false }),
    }),
    {
      name: 'printer-auth-store',
    }
  )
);
