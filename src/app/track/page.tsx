'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  CreditCard, ListOrdered, Printer, CheckCircle2, XCircle, Phone, MapPin, Loader2, FileText, Layout, Sparkles, ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { apiClient } from '@/lib/apiClient';
import type { Order, PrintStatus } from '@/lib/types';
import LoadingSpinner from '@/components/LoadingSpinner';

// ─── Step definitions ────────────────────────────────────
interface Step {
  key: PrintStatus | 'WAITING_FOR_PAYMENT';
  label: string;
  description: string;
  icon: React.ReactNode;
}

const STEPS: Step[] = [
  { key: 'WAITING_FOR_PAYMENT', label: 'Payment Received', description: 'Transaction verified successfully.', icon: <CreditCard size={20} /> },
  { key: 'QUEUED', label: 'Job Queued', description: 'Waiting for its turn in line.', icon: <ListOrdered size={20} /> },
  { key: 'PRINTING', label: 'Printing Document', description: 'The printer is working on your file.', icon: <Printer size={20} /> },
  { key: 'COMPLETED', label: 'Finished! ✅', description: 'Pick up your prints from the tray.', icon: <CheckCircle2 size={20} /> },
];

const STATUS_STEP_INDEX: Record<string, number> = {
  WAITING_FOR_PAYMENT: 0,
  QUEUED: 1,
  PRINTING: 2,
  COMPLETED: 3,
  FAILED: -1,
};

function TrackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('orderId') ?? '';

  const { data: order, isLoading, isError, error } = useQuery<Order>({
    queryKey: ['order', orderId],
    queryFn: async () => {
      const res = await apiClient.get<Order>(`/v1/order/${orderId}`);
      return res.data;
    },
    refetchInterval: (query) => {
      const s = (query.state.data as Order | undefined)?.printStatus;
      if (s === 'COMPLETED' || s === 'FAILED') return false;
      return 3000;
    },
    enabled: !!orderId,
  });

  if (!orderId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md mx-auto px-6 py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card w-full p-12 text-center">
          <div className="w-20 h-20 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="text-[var(--color-primary)]" size={40} />
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tighter mb-2">No Order Found</h2>
          <p className="text-sm font-bold opacity-50 mb-10 leading-relaxed">It seems you don't have an active print session right now.</p>
          <button className="btn-primary w-full py-5 text-lg" onClick={() => router.replace('/')}>Go to Home</button>
        </motion.div>
      </div>
    );
  }

  if (isLoading) return <LoadingSpinner fullPage message="Locating Your Print Job..." />;

  if (isError) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md mx-auto px-6 py-20">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card w-full p-12 text-center border-red-200">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <XCircle size={56} className="text-red-500" />
          </div>
          <h2 className="text-3xl font-black mb-4 text-red-700 uppercase tracking-tighter">Tracking Error</h2>
          <p className="text-sm text-red-600/70 mb-10 leading-relaxed font-bold">{(error as Error).message}</p>
          <button className="btn-secondary w-full py-5 !bg-red-200 !text-red-700" onClick={() => router.back()}>Return Back</button>
        </motion.div>
      </div>
    );
  }

  const status = order?.printStatus ?? 'WAITING_FOR_PAYMENT';
  const activeIndex = STATUS_STEP_INDEX[status] ?? 0;
  const isFailed = status === 'FAILED';
  const isCompleted = status === 'COMPLETED';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto px-6 py-12"
    >
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black tracking-tighter mb-3 uppercase">
          Track Your <span className="text-[var(--color-primary)]">Print</span>
        </h1>
        <div className="inline-flex items-center gap-2 glass-panel py-2 px-4">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">ORDER ID:</span>
          <span className="text-[10px] font-black text-[var(--color-primary)] tracking-widest">{orderId.slice(-12).toUpperCase()}</span>
        </div>
      </div>

      <div className="space-y-6">
        {/* Main Status Area */}
        <div className="glass-card p-10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-primary)]/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-[var(--color-accent)]/10 transition-colors" />

          <AnimatePresence mode="wait">
            {isFailed ? (
              <motion.div key="failed" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                <div className="w-24 h-24 bg-red-100 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                  <XCircle size={56} className="text-red-600" />
                </div>
                <h2 className="text-3xl font-black mb-3 text-red-700 uppercase tracking-tighter leading-none">Print Job Failed</h2>
                <p className="text-base text-red-600/70 mb-10 font-bold max-w-sm mx-auto">There was a technical issue at the station. Please reach out for a refund or assistance.</p>
                <a href="tel:+8801700000000" className="btn-primary w-full py-6 !bg-red-600 !shadow-red-600/30">
                  <Phone size={24} /> Contact Help Desk
                </a>
              </motion.div>
            ) : isCompleted ? (
              <motion.div key="completed" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="w-40 h-40 bg-gradient-to-br from-green-400 to-green-600 rounded-[3rem] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-green-500/30"
                >
                  <CheckCircle2 size={84} className="text-white drop-shadow-lg" />
                </motion.div>
                <h2 className="text-4xl font-black mb-4 text-green-700 uppercase tracking-tighter leading-none">Ready to Collect!</h2>
                <p className="text-lg text-green-700/80 font-bold mb-12 max-w-sm mx-auto">Success! Your document is waiting for you in the printer tray.</p>
                <button onClick={() => router.replace('/')} className="btn-primary w-full py-7 text-2xl !bg-green-600 !shadow-green-600/20">
                  Back to Home
                </button>
              </motion.div>
            ) : (
              <motion.div key="steps" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-0 relative pl-4">
                {/* Vertical Line Background */}
                <div className="absolute left-[20px] top-6 bottom-6 w-1 bg-white/40 rounded-full" />

                <div className="space-y-12 relative">
                  {STEPS.map((step, idx) => {
                    const isDone = idx < activeIndex;
                    const isActive = idx === activeIndex;

                    return (
                      <div key={step.key} className={`flex gap-8 items-start transition-opacity duration-500 ${!isDone && !isActive ? 'opacity-30' : 'opacity-100'}`}>
                        <div className="relative flex items-center justify-center shrink-0">
                          <motion.div
                            animate={isActive ? {
                              scale: [1, 1.15, 1],
                              boxShadow: ['0 0 0 0px var(--color-primary)', '0 0 0 12px rgba(70,132,50,0.1)', '0 0 0 0px var(--color-primary)']
                            } : {}}
                            transition={{ repeat: Infinity, duration: 2.5 }}
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center z-10 transition-all duration-700 shadow-xl ${isDone ? 'bg-green-500 text-white shadow-green-500/20' :
                                isActive ? 'bg-[var(--color-primary)] text-white shadow-[var(--color-primary)]/20' :
                                  'bg-white/80 text-[var(--color-text-dark)]/40'
                              }`}
                          >
                            {isDone ? <CheckCircle2 size={24} className="animate-pulse" /> : step.icon}
                          </motion.div>

                          {/* Connection line highlight */}
                          {isDone && (
                            <div className="absolute top-12 left-1/2 -translate-x-1/2 w-1 h-12 bg-green-500 z-0" />
                          )}
                        </div>

                        <div className="flex-1 pt-1">
                          <h3 className={`text-xl font-black tracking-tight mb-1 uppercase ${isDone ? 'text-green-600' : isActive ? 'text-[var(--color-primary)]' : 'text-gray-400'}`}>
                            {step.label}
                          </h3>
                          <p className={`text-xs font-bold leading-relaxed ${isActive ? 'text-[var(--color-text-dark)] opacity-70' : 'opacity-40'}`}>
                            {step.description}
                          </p>
                        </div>

                        {isActive && (
                          <div className="flex items-center gap-2 self-center bg-white/80 px-4 py-2 rounded-2xl shadow-sm border border-[var(--color-primary)]/20">
                            <Loader2 size={16} className="animate-spin text-[var(--color-primary)]" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-primary)]">Live</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Polling Indicator */}
        {!isCompleted && !isFailed && (
          <div className="flex items-center justify-center gap-3 py-4 glass-panel border-white/60">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse" />
              <div className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse delay-75" />
              <div className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse delay-150" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--color-primary)] opacity-60">Syncing Live Updates</p>
          </div>
        )}

        {/* Order Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {order && (
            <div className="glass-card p-6 flex items-center gap-5">
              <div className="w-16 h-16 bg-[var(--color-primary)]/10 rounded-2xl flex items-center justify-center shrink-0">
                <FileText size={32} className="text-[var(--color-primary)]" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">Document</p>
                <p className="text-base font-black truncate text-[var(--color-text-dark)] pr-2">{order.fileName}</p>
                <p className="text-xs font-bold opacity-60 uppercase">{order.pageCount} Pages • {order.isColor ? 'Color' : 'B&W'}</p>
              </div>
            </div>
          )}

          <div className="glass-card p-6 flex items-center gap-5">
            <div className="w-16 h-16 bg-[var(--color-accent)]/10 rounded-2xl flex items-center justify-center shrink-0">
              <ShieldCheck size={32} className="text-[var(--color-accent)]" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">Security</p>
              <p className="text-base font-black text-[var(--color-text-dark)] leading-tight">Encryption Active</p>
              <p className="text-xs font-bold opacity-60 uppercase">Doc ID: {orderId.slice(0, 8)}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={<LoadingSpinner fullPage />}>
      <TrackContent />
    </Suspense>
  );
}
