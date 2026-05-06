'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Printer, Users, Settings, LogOut, 
  Menu, X, Bell, User as UserIcon, ShieldCheck, Leaf
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

const MENU_ITEMS = [
  { icon: LayoutDashboard, label: 'Overview', href: '/admin/dashboard' },
  { icon: Printer, label: 'Kiosks', href: '/admin/kiosks' },
  { icon: Users, label: 'User Mgmt', href: '/admin/users' },
  { icon: Settings, label: 'Settings', href: '/admin/settings' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isAuthPage = pathname?.startsWith('/admin/login') || pathname?.startsWith('/admin/register');

  useEffect(() => {
    if (!mounted) return;
    if (isAuthPage) return;

    if (!user) {
      router.push('/admin/login');
    } else if (user.role === 'ADMIN' && !user.isApproved && pathname !== '/admin/pending') {
      router.push('/admin/pending');
    }
  }, [user, router, pathname, isAuthPage, mounted]);

  if (!mounted) return null;

  if (isAuthPage) {
    return <>{children}</>;
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex bg-[#FDF6B2]/30">
      {/* Sidebar */}
      <aside className="w-72 hidden lg:flex flex-col border-r border-white/60 glass-card !rounded-none !bg-white/20 backdrop-blur-2xl sticky top-0 h-screen">
        <div className="p-8 border-b border-white/60">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-[var(--color-primary)] rounded-2xl flex items-center justify-center shadow-lg shadow-green-900/20">
                <Printer className="text-white" size={24} />
             </div>
             <div>
                <h2 className="text-xl font-black uppercase tracking-tighter leading-none">Smart<span className="text-[var(--color-primary)]">Print</span></h2>
                <p className="text-[8px] font-black uppercase tracking-[0.3em] opacity-40">Command Center</p>
             </div>
          </div>
        </div>

        <nav className="flex-1 p-6 space-y-2">
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 font-black uppercase tracking-widest text-[10px] ${
                  isActive 
                    ? 'bg-[var(--color-primary)] text-white shadow-xl shadow-green-900/10 scale-[1.02]' 
                    : 'text-[var(--color-text-dark)] opacity-50 hover:bg-white/40 hover:opacity-100'
                }`}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-6">
           <button
             onClick={() => { logout(); router.push('/admin/login'); }}
             className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-red-600 font-black uppercase tracking-widest text-[10px] hover:bg-red-50 transition-all"
           >
             <LogOut size={18} />
             Sign Out
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-24 px-8 flex items-center justify-between border-b border-white/60 glass-card !rounded-none !bg-white/10 sticky top-0 z-40">
           <div className="flex items-center gap-4">
              <button className="lg:hidden p-3 glass-panel"><Menu size={20} /></button>
              <h1 className="text-2xl font-black uppercase tracking-tighter">
                {MENU_ITEMS.find(i => i.href === pathname)?.label || 'Admin'}
              </h1>
           </div>

           <div className="flex items-center gap-6">
              <div className="hidden sm:flex items-center gap-3 px-4 py-2 glass-panel">
                 <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                 <span className="text-[10px] font-black uppercase tracking-widest opacity-60">System Online</span>
              </div>
              
              <button className="p-3 glass-panel relative">
                 <Bell size={20} />
                 <div className="absolute top-3 right-3 w-2 h-2 bg-[var(--color-accent)] rounded-full border-2 border-white" />
              </button>

              <div className="flex items-center gap-4 pl-6 border-l border-white/60">
                 <div className="text-right hidden sm:block">
                    <p className="text-xs font-black uppercase tracking-tighter leading-none mb-1">{user.name}</p>
                    <p className="text-[8px] font-black uppercase tracking-widest text-[var(--color-primary)] opacity-60">{user.role}</p>
                 </div>
                 <div className="w-12 h-12 bg-[var(--color-secondary)]/20 rounded-2xl flex items-center justify-center border border-white/60">
                    <UserIcon size={24} className="text-[var(--color-primary)]" />
                 </div>
              </div>
           </div>
        </header>

        <div className="p-8">
           {children}
        </div>
      </main>
    </div>
  );
}
