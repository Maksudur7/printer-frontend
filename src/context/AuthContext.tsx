'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/lib/types';

// Demo credentials
export const DEMO_USER: User = {
  id: 'user-demo-001',
  name: 'Maksudur Rahman',
  email: 'user@printez.com',
  role: 'USER',
  avatar: undefined,
};

export const DEMO_ADMIN: User = {
  id: 'admin-demo-001',
  name: 'Admin Rahman',
  email: 'admin@printez.com',
  role: 'ADMIN',
  avatar: undefined,
};

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  loginAsDemo: (role?: 'USER' | 'ADMIN') => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('printer_user');
    if (stored) setUser(JSON.parse(stored));
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 800));
    if (email === DEMO_ADMIN.email && password === 'admin123') {
      setUser(DEMO_ADMIN);
      localStorage.setItem('printer_user', JSON.stringify(DEMO_ADMIN));
    } else if (email === DEMO_USER.email && password === 'user123') {
      setUser(DEMO_USER);
      localStorage.setItem('printer_user', JSON.stringify(DEMO_USER));
    } else {
      throw new Error('Invalid email or password');
    }
    setIsLoading(false);
  };

  const loginAsDemo = (role: 'USER' | 'ADMIN' = 'USER') => {
    const u = role === 'ADMIN' ? DEMO_ADMIN : DEMO_USER;
    setUser(u);
    localStorage.setItem('printer_user', JSON.stringify(u));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('printer_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, loginAsDemo, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
