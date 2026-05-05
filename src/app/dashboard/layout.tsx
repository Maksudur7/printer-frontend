'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  LayoutDashboard, Printer, FileText, 
  CreditCard, User, Settings, LogOut,
  ChevronLeft, ChevronRight, Menu, X,
  Shield, BarChart3, Users
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const menuItems = [
    { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, roles: ['USER', 'ADMIN'] },
    { href: '/dashboard/orders', label: 'My Orders', icon: FileText, roles: ['USER'] },
    { href: '/dashboard/all-orders', label: 'All Orders', icon: FileText, roles: ['ADMIN'] },
    { href: '/dashboard/kiosks', label: 'Manage Kiosks', icon: Printer, roles: ['ADMIN'] },
    { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3, roles: ['ADMIN'] },
    { href: '/dashboard/users', label: 'Users', icon: Users, roles: ['ADMIN'] },
    { href: '/dashboard/payments', label: 'Payments', icon: CreditCard, roles: ['USER', 'ADMIN'] },
    { href: '/dashboard/profile', label: 'Profile', icon: User, roles: ['USER', 'ADMIN'] },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings, roles: ['USER', 'ADMIN'] },
  ].filter(item => item.roles.includes(user.role));

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[var(--bg-card)] border-r border-[var(--border)]">
      {/* Sidebar Header */}
      <div className={`h-16 flex items-center px-6 border-b border-[var(--border)] ${collapsed ? 'justify-center px-0' : 'justify-between'}`}>
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
              <Printer size={18} className="text-white" />
            </div>
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">PrintEZ</span>
          </Link>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
            <Printer size={18} className="text-white" />
          </div>
        )}
      </div>

      {/* User Info */}
      <div className={`p-4 border-b border-[var(--border)] bg-white/5 ${collapsed ? 'text-center' : ''}`}>
        <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-bold shrink-0">
            {user.name.charAt(0)}
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-sm font-bold text-[var(--text)] truncate">{user.name}</p>
              <p className="text-xs text-[var(--text-muted)] truncate">{user.email}</p>
            </div>
          )}
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
        {menuItems.map(item => {
          const active = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${
                active 
                  ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' 
                  : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-white/5 border border-transparent'
              } ${collapsed ? 'justify-center px-0' : ''}`}
              title={collapsed ? item.label : ''}
            >
              <item.icon size={20} className={active ? 'text-indigo-400' : 'group-hover:text-indigo-400'} />
              {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
              {!collapsed && item.roles.includes('ADMIN') && item.label === 'Manage Kiosks' && (
                <Shield size={12} className="ml-auto text-yellow-500/50" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-[var(--border)] space-y-2">
        <button 
          onClick={logout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-all ${collapsed ? 'justify-center' : ''}`}
        >
          <LogOut size={20} />
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-white/5 transition-all justify-center border border-[var(--border)]"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[var(--bg)] pt-16">
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:block fixed top-16 bottom-0 left-0 transition-all duration-300 z-40 ${collapsed ? 'w-20' : 'w-64'}`}>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 pt-16"
          >
            <motion.div 
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              onClick={e => e.stopPropagation()}
              className="w-72 h-full"
            >
              <SidebarContent />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${collapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        {/* Mobile Header */}
        <div className="lg:hidden h-14 bg-[var(--bg-card)] border-b border-[var(--border)] flex items-center px-4 sticky top-16 z-30">
          <button onClick={() => setMobileOpen(true)} className="p-2 text-[var(--text-muted)] hover:text-[var(--text)]">
            <Menu size={24} />
          </button>
          <span className="ml-4 font-bold text-[var(--text)]">Dashboard</span>
        </div>

        <div className="p-4 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
