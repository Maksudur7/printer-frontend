'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Printer, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const fadeUp = {
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
};

export default function LoginPage() {
  const router = useRouter();
  const { login, loginAsDemo } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
      setLoading(false);
    }
  };

  const handleDemo = (role: 'USER' | 'ADMIN') => {
    loginAsDemo(role);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen text-white bg-[#06060e] flex items-center justify-center py-[120px] px-10 relative overflow-hidden">
      {/* Ambient Grid Background */}
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

      <motion.div 
        variants={fadeUp}
        initial="initial"
        animate="animate"
        className="w-full max-w-[540px] relative z-10"
      >
        <div className="glass-card rounded-[40px] p-10 md:p-14 border border-white/10 relative overflow-hidden">
          {/* Inner glow effect */}
          <div aria-hidden style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(circle at 50% 0%, rgba(167,139,250,0.1), transparent 70%)',
            pointerEvents: 'none'
          }} />

          <div className="text-center mb-12 relative z-10">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="w-20 h-20 rounded-[24px] bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-8"
            >
              <Printer size={40} className="text-[#a78bfa]" strokeWidth={1.5} />
            </motion.div>
            
            <h1 className="font-serif-display text-[clamp(32px,4vw,48px)] leading-none tracking-tight mb-4 text-white">
              <span className="gradient-text">Welcome Back</span>
            </h1>
            <p className="text-white/40 font-light text-[17px]">Sign in to your digital printing hub.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] px-4">Email Address</label>
              <div className="relative group">
                <Mail size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#a78bfa] transition-colors" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-full py-5 pl-16 pr-8 text-white placeholder:text-white/10 outline-none focus:border-[#a78bfa80] focus:bg-white/[0.08] transition-all duration-300"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center px-4">
                <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Password</label>
                <Link href="#" className="text-[10px] uppercase tracking-widest text-[#a78bfa] hover:text-white transition-colors font-black">Forgot?</Link>
              </div>
              <div className="relative group">
                <Lock size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#a78bfa] transition-colors" />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-full py-5 pl-16 pr-8 text-white placeholder:text-white/10 outline-none focus:border-[#a78bfa80] focus:bg-white/[0.08] transition-all duration-300"
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 rounded-[20px] bg-red-500/5 border border-red-500/20 text-red-400 text-[13px] text-center font-medium"
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 rounded-full bg-white text-[#0a0a14] font-black text-[15px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all duration-300 hover:bg-[#a78bfa] hover:text-white disabled:opacity-50 shadow-[0_0_40px_rgba(255,255,255,0.05)] hover:shadow-[0_0_50px_rgba(167,139,250,0.3)] mt-4"
            >
              {loading ? <Loader2 size={24} className="animate-spin" /> : <>Sign In <ArrowRight size={20} /></>}
            </button>
          </form>

          <div className="relative my-12 text-center z-10">
            <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-b border-white/5" />
            <span className="relative bg-[#0b0b14] px-4 text-[10px] text-white/20 uppercase font-black tracking-[0.3em]">Quick Access</span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-12 relative z-10">
            <button 
              onClick={() => handleDemo('USER')}
              className="py-4 rounded-full bg-white/5 border border-white/10 text-white text-[12px] font-black uppercase tracking-widest hover:bg-white/10 transition-all cursor-pointer"
            >
              User Demo
            </button>
            <button 
              onClick={() => handleDemo('ADMIN')}
              className="py-4 rounded-full bg-[#a78bfa1a] border border-[#a78bfa4d] text-[#a78bfa] text-[12px] font-black uppercase tracking-widest hover:bg-[#a78bfa26] transition-all cursor-pointer"
            >
              Admin Demo
            </button>
          </div>

          <p className="text-center text-[14px] text-white/30 relative z-10 font-light">
            New to PrintEZ? <Link href="/register" className="text-[#a78bfa] font-black hover:text-white transition-colors ml-1">Create Account</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
