'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Printer, MapPin, AlertTriangle, ArrowRight, QrCode, Wifi, ShieldCheck } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';
import type { Kiosk } from '@/lib/types';
import StatusBadge from '@/components/StatusBadge';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useOrderStore } from '@/store/useOrderStore';

function LandingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const deviceId = searchParams.get('kiosk');

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
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md mx-auto px-4 py-12"
      >
        <div className="glass-card p-10 text-center relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent opacity-30 group-hover:opacity-100 transition-opacity" />
          
          <div className="w-24 h-24 rounded-[2rem] bg-[var(--color-accent)]/10 flex items-center justify-center mx-auto mb-8 relative">
            <QrCode size={48} className="text-[var(--color-accent)]" />
            <motion.div
              animate={{ opacity: [0, 0.5, 0], scale: [1, 1.3, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 border-4 border-[var(--color-accent)]/20 rounded-[2rem]"
            />
          </div>

          <h1 className="text-4xl font-black mb-4 uppercase tracking-tighter">
            Scan to <span className="text-[var(--color-accent)]">Print</span>
          </h1>
          <p className="text-[var(--color-text-dark)] opacity-60 text-lg leading-snug mb-10 font-medium">
            Scan the QR code on the kiosk screen to begin your seamless printing experience.
          </p>

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-center gap-3 px-5 py-3 bg-[var(--color-primary)]/5 rounded-2xl text-[var(--color-primary)] text-xs font-black uppercase tracking-widest">
              <ShieldCheck size={18} /> Secure Cloud Processing
            </div>
            <div className="flex items-center justify-center gap-3 px-5 py-3 bg-[var(--color-primary)]/5 rounded-2xl text-[var(--color-primary)] text-xs font-black uppercase tracking-widest">
              <Wifi size={18} /> Instant Kiosk Pairing
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  /* ── Loading ───────────────────────────────────────────── */
  if (loading) return <LoadingSpinner fullPage message="Locating Kiosk..." />;

  /* ── API Error ─────────────────────────────────────────── */
  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md mx-auto px-4"
      >
        <div className="glass-card p-10 text-center border-red-200/50">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle size={40} className="text-red-600" />
          </div>
          <h2 className="text-2xl font-black mb-3 text-red-700 uppercase tracking-tight">
            Connection Error
          </h2>
          <p className="text-sm text-red-600/70 mb-10 leading-relaxed font-medium">
            {error}
          </p>
          <button className="btn-accent w-full py-5 shadow-xl shadow-orange-500/20" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </motion.div>
    );
  }

  /* ── Kiosk unavailable ─────────────────────────────────── */
  if (kiosk && kiosk.status !== 'ONLINE') {
    const reasons: Record<string, string> = {
      OFFLINE: 'Kiosk is currently offline.',
      MAINTENANCE: 'Undergoing routine maintenance.',
      OUT_OF_PAPER: 'Temporarily out of paper.',
    };
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md mx-auto px-4"
      >
        <div className="glass-card p-10 text-center">
          <div className="w-24 h-24 bg-orange-500/10 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
            <AlertTriangle size={48} className="text-orange-500" />
          </div>
          <div className="mb-4">
            <StatusBadge status={kiosk.status} />
          </div>
          <h2 className="text-3xl font-black mb-3 uppercase tracking-tighter">
            {kiosk.name}
          </h2>
          <p className="text-[var(--color-text-dark)] opacity-60 text-lg mb-10 leading-snug font-medium">
            {reasons[kiosk.status]} <br/> 
            <span className="text-sm opacity-50 mt-2 block">Please find another station at <strong>{kiosk.location}</strong></span>
          </p>
          <div className="flex items-center justify-center gap-2 text-[var(--color-primary)] font-bold text-xs uppercase tracking-widest bg-[var(--color-primary)]/5 py-3 rounded-xl">
            <MapPin size={16} /> <span>{kiosk.location}</span>
          </div>
        </div>
      </motion.div>
    );
  }

  /* ── Kiosk ONLINE ──────────────────────────────────────── */
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-md mx-auto px-4 py-12"
    >
      <div className="glass-card p-12 text-center relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-secondary)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        
        <motion.div
          className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center mx-auto mb-10 shadow-3xl shadow-[var(--color-primary)]/30 relative"
          animate={{ y: [0, -12, 0], rotate: [0, 2, 0, -2, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
        >
          <Printer size={64} className="text-white drop-shadow-lg" />
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          </div>
        </motion.div>

        <div className="mb-6">
          <StatusBadge status="ONLINE" />
        </div>

        <h1 className="text-5xl font-black mb-3 uppercase tracking-tighter leading-none">
          Ready to <br/><span className="text-[var(--color-primary)]">Print!</span>
        </h1>

        {kiosk && (
          <div className="mb-12">
            <p className="text-2xl font-bold text-[var(--color-text-dark)] mb-2 tracking-tight">{kiosk.name}</p>
            <div className="flex items-center justify-center gap-1.5 text-[var(--color-text-dark)] opacity-40 text-sm font-bold uppercase tracking-widest">
              <MapPin size={16} /> <span>{kiosk.location}</span>
            </div>
          </div>
        )}

        <motion.button
          className="btn-accent w-full py-6 text-2xl font-black uppercase tracking-tighter flex items-center justify-center gap-4 shadow-3xl shadow-orange-500/40 relative overflow-hidden group/btn"
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
          <span className="relative z-10">Start Printing</span>
          <ArrowRight size={32} className="relative z-10 group-hover/btn:translate-x-2 transition-transform" />
          <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-500" />
        </motion.button>

        <p className="text-[10px] uppercase font-black tracking-[0.3em] text-[var(--color-text-dark)] opacity-20 mt-10">
          Powered by SmartPrint Engine v4.0
        </p>
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
