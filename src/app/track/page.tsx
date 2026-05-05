'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  CreditCard, ListOrdered, Printer, CheckCircle2, XCircle, Phone, ArrowRight, MapPin, Loader2, FileText
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
  { key: 'WAITING_FOR_PAYMENT', label: 'Payment Received', description: 'Transaction verified successfully.',   icon: <CreditCard size={20} /> },
  { key: 'QUEUED',              label: 'Job Queued',        description: 'Waiting for its turn in line.',      icon: <ListOrdered size={20} /> },
  { key: 'PRINTING',            label: 'Printing Document', description: 'The printer is working on your file.',icon: <Printer size={20} /> },
  { key: 'COMPLETED',           label: 'Finished! ✅',       description: 'Pick up your prints from the tray.', icon: <CheckCircle2 size={20} /> },
];

const STATUS_STEP_INDEX: Record<string, number> = {
  WAITING_FOR_PAYMENT: 0,
  QUEUED:              1,
  PRINTING:            2,
  COMPLETED:           3,
  FAILED:              -1,
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
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md mx-auto px-4">
        <div className="glass-card w-full p-12 text-center">
          <p className="text-[var(--color-text-dark)] opacity-60 mb-8 font-bold">No Order ID found.</p>
          <button className="btn-accent w-full py-4" onClick={() => router.replace('/')}>Go Home</button>
        </div>
      </div>
    );
  }

  if (isLoading) return <LoadingSpinner fullPage message="Connecting to Printer..." />;

  if (isError) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md mx-auto px-4">
        <div className="glass-card w-full p-12 text-center border-red-200">
          <XCircle size={64} className="text-red-500 mx-auto mb-6" />
          <h2 className="text-2xl font-black mb-4 text-red-700" style={{ fontFamily: 'var(--font-outfit)' }}>Tracking Error</h2>
          <p className="text-sm text-red-600/70 mb-8">{(error as Error).message}</p>
          <button className="btn-secondary w-full py-4" onClick={() => router.back()}>Go Back</button>
        </div>
      </div>
    );
  }

  const status = order?.printStatus ?? 'WAITING_FOR_PAYMENT';
  const activeIndex = STATUS_STEP_INDEX[status] ?? 0;
  const isFailed = status === 'FAILED';
  const isCompleted = status === 'COMPLETED';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="flex-1 flex flex-col items-center justify-start w-full max-w-2xl mx-auto px-4 py-8"
    >
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-black tracking-tight mb-2" style={{ fontFamily: 'var(--font-outfit)', color: 'var(--color-primary)' }}>
          Track Your Print
        </h1>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/40 rounded-full border border-white/60">
          <span className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-dark)] opacity-40">ID:</span>
          <span className="text-[10px] font-black text-[var(--color-primary)]">{orderId.slice(-8).toUpperCase()}</span>
        </div>
      </div>

      <div className="w-full space-y-6">
        {/* Stepper Card */}
        <div className="glass-card p-10 relative overflow-hidden">
          <AnimatePresence mode="wait">
            {isFailed ? (
              <motion.div key="failed" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <XCircle size={56} className="text-red-500" />
                </div>
                <h2 className="text-2xl font-black mb-2 text-red-700" style={{ fontFamily: 'var(--font-outfit)' }}>Print Job Failed</h2>
                <p className="text-sm text-red-600/70 mb-8">Something went wrong with the machine. Please contact support immediately.</p>
                <a href="tel:+8801700000000" className="btn-accent w-full py-4 flex items-center justify-center gap-2">
                  <Phone size={20} /> Call Support Now
                </a>
              </motion.div>
            ) : isCompleted ? (
              <motion.div key="completed" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                <motion.div 
                  animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-32 h-32 bg-green-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-green-100"
                >
                  <CheckCircle2 size={72} className="text-green-500" />
                </motion.div>
                <h2 className="text-3xl font-black mb-4 text-green-800" style={{ fontFamily: 'var(--font-outfit)' }}>Ready to Collect!</h2>
                <p className="text-base text-green-700 font-bold mb-10 leading-relaxed">
                  Your document has been printed successfully. Please collect it from the tray.
                </p>
                <button onClick={() => router.replace('/')} className="btn-accent w-full py-5 text-xl font-black">
                  Done, Thank You!
                </button>
              </motion.div>
            ) : (
              <motion.div key="steps" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-0 relative">
                {/* Vertical Line Background */}
                <div className="absolute left-[20px] top-4 bottom-4 w-1 bg-white/40 rounded-full" />
                
                <div className="space-y-10 relative">
                  {STEPS.map((step, idx) => {
                    const isDone = idx < activeIndex;
                    const isActive = idx === activeIndex;
                    
                    return (
                      <div key={step.key} className="flex gap-6 items-start">
                        <div className="relative flex items-center justify-center shrink-0">
                          <motion.div
                            animate={isActive ? { scale: [1, 1.2, 1], boxShadow: ['0 0 0 0px var(--color-primary)', '0 0 0 10px rgba(70,132,50,0.1)', '0 0 0 0px var(--color-primary)'] } : {}}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all ${
                              isDone ? 'bg-green-500 text-white' : isActive ? 'bg-[var(--color-primary)] text-white' : 'bg-white/60 text-gray-400'
                            }`}
                          >
                            {isDone ? <CheckCircle2 size={20} /> : step.icon}
                          </motion.div>
                          
                          {/* Active pulsing ring */}
                          {isActive && (
                            <motion.div 
                              initial={{ scale: 0.8, opacity: 0.5 }}
                              animate={{ scale: 1.5, opacity: 0 }}
                              transition={{ repeat: Infinity, duration: 1.5 }}
                              className="absolute w-10 h-10 rounded-full border-4 border-[var(--color-primary)] z-0"
                            />
                          )}
                        </div>
                        
                        <div className="flex-1 pt-1">
                          <h3 className={`text-base font-black tracking-tight ${isDone ? 'text-green-600' : isActive ? 'text-[var(--color-primary)]' : 'text-gray-400'}`}>
                            {step.label}
                          </h3>
                          <p className={`text-[10px] font-bold ${isActive ? 'text-[var(--color-text-dark)] opacity-60' : 'opacity-40'}`}>
                            {step.description}
                          </p>
                        </div>
                        
                        {isActive && (
                          <div className="flex items-center gap-1.5 self-center bg-[var(--color-primary)]/10 px-3 py-1.5 rounded-full">
                            <Loader2 size={12} className="animate-spin text-[var(--color-primary)]" />
                            <span className="text-[8px] font-black uppercase text-[var(--color-primary)]">In Progress</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!isCompleted && !isFailed && (
            <div className="mt-12 flex items-center justify-center gap-3 bg-white/40 py-3 rounded-2xl border border-white/60">
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] animate-bounce" style={{ animationDelay: '0s' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-primary)]">Polling live updates</p>
            </div>
          )}
        </div>

        {/* Order Info Card */}
        {order && (
          <div className="glass-card p-6 grid grid-cols-2 gap-6 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-10 bg-white/40" />
            
            <div className="space-y-1">
              <p className="text-[9px] font-black uppercase tracking-tighter opacity-40">Printing File</p>
              <div className="flex items-center gap-2">
                <FileText size={14} className="text-[var(--color-primary)]" />
                <p className="text-xs font-bold truncate pr-4">{order.fileName}</p>
              </div>
            </div>
            
            <div className="space-y-1 pl-4 text-right">
              <p className="text-[9px] font-black uppercase tracking-tighter opacity-40">Configuration</p>
              <p className="text-xs font-bold text-[var(--color-primary)]">
                {order.pageCount} Pages • {order.isColor ? 'Color' : 'B&W'}
              </p>
            </div>
          </div>
        )}
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
