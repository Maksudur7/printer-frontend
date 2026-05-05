'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { XCircle, RefreshCw, Home } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';

function FailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('orderId') ?? searchParams.get('order_id') ?? '';

  return (
    <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md mx-auto px-4">
      <div className="glass-card w-full p-12 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-red-400" />
        
        <motion.div
          initial={{ scale: 0, rotate: -15 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 16 }}
          className="mb-8 flex justify-center"
        >
          <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center shadow-inner">
            <XCircle size={64} className="text-red-500" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="text-3xl font-black mb-4 tracking-tight text-red-700"
          style={{ fontFamily: 'var(--font-outfit)' }}
        >
          Payment Failed
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="text-[var(--color-text-dark)] opacity-60 text-sm leading-relaxed mb-10"
        >
          We couldn&apos;t process your payment. This could be due to a network error or a cancelled transaction.
        </motion.p>

        <div className="space-y-3">
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="btn-accent w-full py-4 flex items-center justify-center gap-2 font-black text-lg"
            onClick={() => router.push(orderId ? `/checkout?orderId=${orderId}` : '/checkout')}
          >
            <RefreshCw size={20} /> Try Again
          </motion.button>
          
          <button
            className="w-full py-3 text-xs font-black uppercase tracking-widest text-[var(--color-primary)] opacity-40 hover:opacity-100 transition-opacity flex items-center justify-center gap-2"
            onClick={() => router.replace('/')}
          >
            <Home size={14} /> Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PaymentFailPage() {
  return (
    <Suspense fallback={<LoadingSpinner fullPage />}>
      <FailContent />
    </Suspense>
  );
}
