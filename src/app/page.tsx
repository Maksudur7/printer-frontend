'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Printer, MapPin, AlertTriangle, ArrowRight, QrCode, Wifi, ShieldCheck, Leaf, Sparkles } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';
import type { Kiosk } from '@/lib/types';
import StatusBadge from '@/components/StatusBadge';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useOrderStore } from '@/store/useOrderStore';

function LandingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const deviceId = searchParams.get('kiosk') || searchParams.get('deviceId');

  const [kiosk, setKiosk] = useState<Kiosk | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { setKioskId, setKioskDeviceId } = useOrderStore();

  useEffect(() => {
    if (!deviceId) return;
    setLoading(true);
    setError(null);
    apiClient
      .get<Kiosk>(`/v1/kiosk/${deviceId}`)
      .then((res) => {
        setKiosk(res.data);
        setKioskId(res.data.id);
        setKioskDeviceId(res.data.deviceId);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [deviceId, setKioskId, setKioskDeviceId]);

  /* ── No QR param ──────────────────────────────────────── */
  if (!deviceId) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg mx-auto px-6 py-12"
      >
        <div className="glass-card p-10 text-center relative overflow-hidden group border-white/80 shadow-2xl shadow-green-900/10">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-[var(--color-secondary)]/20 rounded-full blur-3xl group-hover:bg-[var(--color-accent)]/20 transition-colors duration-700" />
          
          <div className="w-28 h-28 rounded-[2.5rem] bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center mx-auto mb-8 relative shadow-xl shadow-green-900/20">
            <QrCode size={56} className="text-white" />
            <motion.div
              animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="absolute inset-[-10px] border-2 border-[var(--color-primary)]/30 rounded-[3rem]"
            />
          </div>

          <h1 className="text-4xl sm:text-5xl font-black mb-4 uppercase tracking-tighter leading-none">
            Scan to <br/><span className="text-[var(--color-accent)]">Print Now</span>
          </h1>
          
          <p className="text-[var(--color-text-dark)] opacity-70 text-lg leading-snug mb-10 font-bold max-w-xs mx-auto">
            Scan the QR code on any SmartPrint kiosk to start your experience.
          </p>

          <div className="grid grid-cols-2 gap-4 mb-2">
            <div className="glass-panel p-4 flex flex-col items-center gap-2">
              <ShieldCheck size={24} className="text-[var(--color-primary)]" />
              <span className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-dark)]/60">Secure Docs</span>
            </div>
            <div className="glass-panel p-4 flex flex-col items-center gap-2">
              <Sparkles size={24} className="text-[var(--color-accent)]" />
              <span className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-dark)]/60">Instant Pair</span>
            </div>
          </div>
          
          <div className="mt-8 flex items-center justify-center gap-2 text-[var(--color-primary)] font-black text-[10px] uppercase tracking-[0.3em] opacity-40">
            <Leaf size={14} /> Eco-Friendly Printing
          </div>
        </div>
      </motion.div>
    );
  }

  /* ── Loading ───────────────────────────────────────────── */
  if (loading) return <LoadingSpinner fullPage message="Connecting to Station..." />;

  /* ── API Error ─────────────────────────────────────────── */
  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md mx-auto px-6"
      >
        <div className="glass-card p-12 text-center border-red-200/60 shadow-red-500/10">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
            <AlertTriangle size={48} className="text-red-600" />
          </div>
          <h2 className="text-3xl font-black mb-4 text-red-700 uppercase tracking-tighter">
            Connection Lost
          </h2>
          <p className="text-sm text-red-600/80 mb-10 leading-relaxed font-bold">
            {error}
          </p>
          <button className="btn-primary w-full py-5 !bg-red-600 !shadow-red-600/30" onClick={() => window.location.reload()}>
            Reconnect Now
          </button>
        </div>
      </motion.div>
    );
  }

  /* ── Kiosk ONLINE ──────────────────────────────────────── */
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-lg mx-auto px-6 py-12"
    >
      <div className="glass-card p-12 text-center relative group overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-primary)]" />
        
        <motion.div
          className="w-36 h-36 rounded-[3rem] bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center mx-auto mb-10 shadow-3xl shadow-[var(--color-primary)]/30 relative"
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
        >
          <Printer size={72} className="text-white drop-shadow-2xl" />
          <div className="absolute -top-3 -right-3 w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-xl">
            <div className="w-4 h-4 bg-green-500 rounded-full animate-ping absolute" />
            <div className="w-4 h-4 bg-green-500 rounded-full relative" />
          </div>
        </motion.div>

        <div className="mb-6">
          <StatusBadge status="ONLINE" />
        </div>

        <h1 className="text-5xl font-black mb-4 uppercase tracking-tighter leading-none">
          Ready to <br/><span className="text-[var(--color-primary)]">Print!</span>
        </h1>

        {kiosk && (
          <div className="mb-12 glass-panel py-4 px-6 inline-block">
            <p className="text-2xl font-black text-[var(--color-text-dark)] mb-1 tracking-tight">{kiosk.name}</p>
            <div className="flex items-center justify-center gap-2 text-[var(--color-text-dark)] opacity-50 text-xs font-bold uppercase tracking-widest">
              <MapPin size={14} /> <span>{kiosk.location}</span>
            </div>
          </div>
        )}

        <motion.button
          className="btn-primary w-full py-7 text-2xl"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            if (deviceId) {
              router.push(`/upload?kiosk=${deviceId}`);
            } else {
              router.push('/');
            }
          }}
        >
          <span>Start Printing</span>
          <ArrowRight size={32} />
        </motion.button>

        <div className="mt-12 flex items-center justify-center gap-6 opacity-30">
           <Wifi size={20} />
           <ShieldCheck size={20} />
           <Leaf size={20} />
        </div>
      </div>
    </motion.div>
  );
}

export default function LandingPage() {
  return (
    <Suspense fallback={<LoadingSpinner fullPage />}>
      <AnimatePresence mode="wait">
        <LandingContent />
      </AnimatePresence>
    </Suspense>
  );
}
