'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Shield, Mail, Lock, Loader2, ArrowRight, Sparkles } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';
import { useAuthStore } from '@/store/useAuthStore';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await apiClient.post('/v1/auth/login', { email, password });
      const { user, token } = res.data;

      if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
        throw new Error('Access denied. Admin only.');
      }

      setAuth(user, token);

      if (user.role === 'ADMIN' && !user.isApproved) {
        router.push('/admin/pending');
      } else {
        router.push('/admin/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--color-primary)]/10 rounded-full blur-[120px]" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[var(--color-accent)]/10 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-green-900/20">
            <Shield size={40} className="text-white" />
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">Admin <span className="text-[var(--color-primary)]">Portal</span></h1>
          <p className="text-sm font-bold opacity-50 uppercase tracking-widest">Secure Access Only</p>
        </div>

        <div className="glass-card p-10">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-primary)]" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field !pl-12"
                  placeholder="admin@smartprint.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-primary)]" size={18} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field !pl-12"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs font-bold text-red-600 bg-red-50 p-3 rounded-xl border border-red-100 text-center">
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-5 text-lg shadow-2xl shadow-green-900/20"
            >
              {loading ? <Loader2 className="animate-spin" size={24} /> : <><Sparkles size={20} /> Authorize Session <ArrowRight size={20} /></>}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-white/40 text-center">
            <p className="text-xs font-bold opacity-40 mb-4">New admin joining the fleet?</p>
            <button
              onClick={() => router.push('/admin/register')}
              className="text-[var(--color-primary)] font-black uppercase tracking-widest text-xs hover:underline underline-offset-4"
            >
              Request Administrative Access
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
