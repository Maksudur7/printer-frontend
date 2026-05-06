'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShieldPlus, Mail, Lock, User, Loader2, ArrowRight, Info } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';

export default function AdminRegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await apiClient.post('/v1/auth/register', { 
        name, 
        email, 
        password,
        role: 'ADMIN' // Explicitly requesting admin role
      });
      setSuccess(true);
      setTimeout(() => router.push('/admin/login'), 5000);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-12 text-center max-w-md w-full">
          <div className="w-24 h-24 bg-green-100 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
             <ShieldPlus size={56} className="text-green-600" />
          </div>
          <h2 className="text-3xl font-black uppercase tracking-tighter mb-4 text-green-700">Request Sent!</h2>
          <p className="text-sm font-bold opacity-70 mb-10 leading-relaxed">
            Your administrative access request has been received. <br/>
            <strong>Note:</strong> A Super Admin must approve your account before you can log in.
          </p>
          <div className="flex items-center justify-center gap-3 text-xs font-black text-green-600 bg-green-50 py-4 rounded-2xl animate-pulse">
            <Loader2 size={18} className="animate-spin" /> Redirecting to Login...
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
         <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[var(--color-secondary)]/10 rounded-full blur-[120px]" />
         <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--color-primary)]/10 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-secondary)] rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-orange-900/20">
            <ShieldPlus size={40} className="text-white" />
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">Join the <span className="text-[var(--color-accent)]">Fleet</span></h1>
          <p className="text-sm font-bold opacity-50 uppercase tracking-widest">Admin Registration</p>
        </div>

        <div className="glass-card p-10">
          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-primary)]" size={18} />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field !pl-12"
                  placeholder="Manager Name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-1">Work Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-primary)]" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field !pl-12"
                  placeholder="name@smartprint.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-1">Secure Password</label>
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

            <div className="bg-white/40 p-4 rounded-2xl border border-white/60 flex gap-3">
               <Info size={20} className="text-[var(--color-primary)] shrink-0" />
               <p className="text-[10px] font-bold opacity-60 leading-relaxed uppercase tracking-tighter">
                 By registering, you request access to the management dashboard. Account approval takes 24-48 hours.
               </p>
            </div>

            {error && (
              <p className="text-xs font-bold text-red-600 bg-red-50 p-3 rounded-xl border border-red-100 text-center">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-5 text-lg shadow-2xl shadow-orange-900/20"
            >
              {loading ? <Loader2 className="animate-spin" size={24} /> : <><ShieldPlus size={20} /> Request Access <ArrowRight size={20} /></>}
            </button>
          </form>

          <div className="mt-8 text-center">
             <button onClick={() => router.push('/admin/login')} className="text-xs font-black text-[var(--color-text-dark)] opacity-40 hover:opacity-100 transition-opacity">
                Already have an account? Log In
             </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
