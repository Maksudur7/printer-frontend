'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Printer, Mail, Lock, User, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Simulate registration
    setTimeout(() => {
      alert('Registration successful! Please login with your demo credentials.');
      router.push('/login');
    }, 1500);
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 flex items-center justify-center relative overflow-hidden">
      {/* Page-specific ambient orb for focus */}
      <div 
        aria-hidden 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none opacity-30"
        style={{
          background: 'radial-gradient(circle, rgba(167,139,250,0.2) 0%, transparent 70%)',
          filter: 'blur(60px)',
          zIndex: 0
        }}
      />

      <motion.div 
        initial={{ opacity: 0, y: 32 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="glass-card rounded-[48px] p-10 md:p-14 shadow-2xl relative overflow-hidden border border-white/10">
          {/* Inner glow effect */}
          <div aria-hidden style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(circle at 50% 0%, rgba(167,139,250,0.1), transparent 70%)',
            pointerEvents: 'none'
          }} />

          <div className="text-center mb-10 relative z-10">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="w-20 h-20 rounded-[24px] bg-white/5 flex items-center justify-center mx-auto mb-8 border border-white/10 shadow-inner"
            >
              <Printer size={40} className="text-[#a78bfa]" strokeWidth={1.5} />
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl font-serif-display mb-4 tracking-tight">
              <span className="gradient-text">Create Account</span>
            </h1>
            <p className="text-white/40 font-light text-lg">Join the future of city-wide printing.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] px-4">Full Name</label>
              <div className="relative group">
                <User size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#a78bfa] transition-colors" />
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-white/5 border border-white/10 rounded-full py-4 pl-14 pr-6 text-white placeholder:text-white/10 outline-none focus:border-[#a78bfa]/50 focus:bg-white/[0.08] transition-all duration-300"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] px-4">Email Address</label>
              <div className="relative group">
                <Mail size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#a78bfa] transition-colors" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-full py-4 pl-14 pr-6 text-white placeholder:text-white/10 outline-none focus:border-[#a78bfa]/50 focus:bg-white/[0.08] transition-all duration-300"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] px-4">Password</label>
              <div className="relative group">
                <Lock size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#a78bfa] transition-colors" />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-full py-4 pl-14 pr-6 text-white placeholder:text-white/10 outline-none focus:border-[#a78bfa]/50 focus:bg-white/[0.08] transition-all duration-300"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 px-4 text-[11px] text-white/30">
              <input type="checkbox" required className="accent-[#a78bfa] w-4 h-4 rounded border-white/10 bg-white/5" />
              <span>I agree to the <Link href="/terms" className="text-[#a78bfa] font-bold">Terms</Link> and <Link href="/terms" className="text-[#a78bfa] font-bold">Privacy Policy</Link></span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 rounded-full bg-white text-[#0a0a14] font-bold text-base cursor-pointer flex items-center justify-center gap-3 transition-all duration-300 hover:bg-[#a78bfa] hover:text-white hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_30px_rgba(167,139,250,0.2)] hover:shadow-[0_0_40px_rgba(167,139,250,0.4)] mt-4"
            >
              {loading ? <Loader2 size={24} className="animate-spin" /> : <>Create Account <ArrowRight size={20} /></>}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-white/5 text-center relative z-10">
            <p className="text-sm text-white/30">
              Already have an account? <Link href="/login" className="text-[#a78bfa] font-bold hover:text-white transition-colors">Sign In</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
