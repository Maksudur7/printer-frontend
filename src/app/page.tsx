'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Printer, MapPin, AlertTriangle, ArrowRight, QrCode } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';
import type { Kiosk } from '@/lib/types';
import StatusBadge from '@/components/StatusBadge';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useOrderStore } from '@/store/useOrderStore';

const pageVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

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
      <motion.div variants={pageVariants} initial="hidden" animate="visible"
        className="flex-1 flex flex-col items-center justify-center w-full max-w-md mx-auto my-10 px-4"
      >
        <div className="glass-card w-full p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent opacity-50" />

          <div className="w-24 h-24 rounded-3xl bg-[var(--color-accent)]/10 flex items-center justify-center mx-auto mb-8 relative">
            <QrCode size={48} className="text-[var(--color-accent)]" />
            <motion.div
              animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 border-2 border-[var(--color-accent)] rounded-3xl"
            />
          </div>

          <h1 className="text-3xl font-black mb-4 tracking-tight" style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-outfit)' }}>
            Scan to Print
          </h1>
          <p className="text-[var(--color-text-dark)] opacity-70 text-base leading-relaxed mb-8">
            Please scan the QR code displayed on the physical kiosk to start your printing session.
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)]/10 rounded-full text-[var(--color-primary)] text-xs font-bold uppercase tracking-widest">
            <Printer size={14} /> Ready at all stations
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
      <motion.div variants={pageVariants} initial="hidden" animate="visible"
        className="flex-1 flex flex-col items-center justify-center w-full max-w-md mx-auto px-4"
      >
        <div className="glass-card w-full p-10 text-center border-red-200">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle size={40} className="text-red-500" />
          </div>
          <h2 className="text-2xl font-bold mb-3 text-red-700" style={{ fontFamily: 'var(--font-outfit)' }}>
            Connection Error
          </h2>
          <p className="text-sm text-red-600/80 mb-8 leading-relaxed">{error}</p>
          <button className="btn-accent w-full py-4 text-lg" onClick={() => window.location.reload()}>
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
      <motion.div variants={pageVariants} initial="hidden" animate="visible"
        className="flex-1 flex flex-col items-center justify-center w-full max-w-md mx-auto px-4"
      >
        <div className="glass-card w-full p-10 text-center">
          <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle size={48} className="text-orange-500" />
          </div>
          <div className="mb-4">
            <StatusBadge status={kiosk.status} />
          </div>
          <h2 className="text-2xl font-black mb-2" style={{ fontFamily: 'var(--font-outfit)', color: 'var(--color-primary)' }}>
            {kiosk.name}
          </h2>
          <p className="text-[var(--color-text-dark)] opacity-70 text-sm mb-8 leading-relaxed">
            {reasons[kiosk.status]} Please try another kiosk at <strong>{kiosk.location}</strong>.
          </p>
          <div className="flex items-center justify-center gap-2 text-[var(--color-text-dark)] opacity-40 text-xs">
            <MapPin size={14} /> <span>{kiosk.location}</span>
          </div>
        </div>
      </motion.div>
    );
  }

  /* ── Kiosk ONLINE ──────────────────────────────────────── */
  return (
    <motion.div variants={pageVariants} initial="hidden" animate="visible"
      className="flex-1 flex flex-col items-center justify-center w-full max-w-md mx-auto px-4 py-12"
    >
      <div className="glass-card w-full p-12 text-center relative">
        <motion.div
          className="w-28 h-28 rounded-[2rem] bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-[var(--color-primary)]/20"
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        >
          <Printer size={56} className="text-white" />
        </motion.div>

        <div className="mb-4">
          <StatusBadge status="ONLINE" />
        </div>

        <h1 className="text-4xl font-black mb-2 tracking-tight" style={{ fontFamily: 'var(--font-outfit)', color: 'var(--color-primary)' }}>
          Ready to Print!
        </h1>

        {kiosk && (
          <div className="mb-10">
            <p className="text-xl font-bold text-[var(--color-text-dark)] mb-1">{kiosk.name}</p>
            <div className="flex items-center justify-center gap-1.5 text-[var(--color-text-dark)] opacity-50 text-sm">
              <MapPin size={14} /> <span>{kiosk.location}</span>
            </div>
          </div>
        )}

        <motion.button
          className="btn-accent w-full py-5 text-xl font-black flex items-center justify-center gap-3 shadow-2xl shadow-[var(--color-accent)]/40"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push(`/upload?kiosk=${deviceId}`)}
        >
          Start Now <ArrowRight size={24} />
        </motion.button>

        <p className="text-[10px] uppercase font-black tracking-widest text-[var(--color-text-dark)] opacity-30 mt-8">
          Self-Checkout Printing System
        </p>
      </div>
    </motion.div>
  );
}

export default function LandingPage() {
  return (
    <Suspense fallback={<LoadingSpinner fullPage />}>
      <AnimatePresence>
        <LandingContent />
      </AnimatePresence>
    </Suspense>
  );
}
