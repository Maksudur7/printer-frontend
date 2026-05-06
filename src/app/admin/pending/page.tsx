'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Clock, ShieldCheck, LogOut, RefreshCw, Loader2, Sparkles } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';
import { useAuthStore } from '@/store/useAuthStore';

export default function AdminPendingPage() {
  const { user, logout, setApproved } = useAuthStore();
  const [checking, setChecking] = useState(false);
  const router = useRouter();

  const checkStatus = async () => {
    if (!user) return;
    setChecking(true);
    try {
      const res = await apiClient.get(`/v1/auth/me`);
      const updatedUser = res.data;
      
      if (updatedUser.isApproved) {
        setApproved(true);
        router.push('/admin/dashboard');
      }
    } catch (err) {
      console.error('Failed to check status:', err);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(checkStatus, 10000); // Check every 10s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 relative overflow-hidden bg-[var(--color-background)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,var(--color-secondary)_0%,transparent_70%)] opacity-20" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-card p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent" />
          
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
            className="w-32 h-32 border-4 border-dashed border-[var(--color-primary)]/20 rounded-[3rem] flex items-center justify-center mx-auto mb-10 relative"
          >
            <div className="w-24 h-24 bg-white/60 rounded-[2rem] flex items-center justify-center shadow-inner">
               <Clock size={48} className="text-[var(--color-primary)] animate-pulse" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-lg border border-white">
               <Loader2 size={20} className="text-[var(--color-primary)] animate-spin" />
            </div>
          </motion.div>

          <h1 className="text-4xl font-black uppercase tracking-tighter mb-4">Approval <span className="text-[var(--color-primary)]">Pending</span></h1>
          
          <div className="space-y-4 mb-10">
            <p className="text-sm font-bold text-[var(--color-text-dark)] opacity-70 leading-relaxed">
              Hello, <span className="text-[var(--color-primary)]">{user?.name}</span>. Your account is currently being reviewed by our security team.
            </p>
            <div className="glass-panel py-3 px-4 inline-flex items-center gap-2">
               <ShieldCheck size={16} className="text-[var(--color-primary)]" />
               <span className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-dark)] opacity-60">Status: Manual Review</span>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={checkStatus}
              disabled={checking}
              className="btn-primary w-full py-5 text-lg"
            >
              {checking ? <Loader2 className="animate-spin" size={24} /> : <><RefreshCw size={20} /> Check Status Now</>}
            </button>
            
            <button
              onClick={() => { logout(); router.push('/admin/login'); }}
              className="btn-ghost w-full py-4 text-xs font-black uppercase tracking-widest text-red-600 hover:text-red-700"
            >
              <LogOut size={18} /> Log Out Session
            </button>
          </div>

          <div className="mt-12 flex items-center justify-center gap-2 opacity-20">
             <Sparkles size={16} />
             <span className="text-[8px] font-black uppercase tracking-[0.5em]">Eco-Tech Security Engine</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
