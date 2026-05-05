'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowLeft, RefreshCcw } from 'lucide-react';
import Link from 'next/link';

function PaymentFailContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 flex items-center justify-center">
      <div className="max-w-md w-full text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }} 
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[var(--bg-card)] border border-[var(--border)] rounded-3xl p-10 shadow-2xl shadow-red-500/10"
        >
          <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={48} className="text-red-400" />
          </div>
          <h1 className="text-3xl font-extrabold text-[var(--text)] mb-3">Payment Failed</h1>
          <p className="text-[var(--text-muted)] text-sm mb-8">
            We couldn't process your payment. This could be due to insufficient funds, 
            network issues, or an expired session.
          </p>

          <div className="p-4 rounded-xl bg-white/5 border border-[var(--border)] mb-8 text-left">
            <p className="text-[10px] text-[var(--text-muted)] uppercase font-bold tracking-widest mb-1">Transaction ID</p>
            <p className="text-xs font-mono text-red-400 font-bold">#{orderId || 'TXN-FAILED-999'}</p>
          </div>

          <div className="space-y-3">
            <Link 
              href={`/order/${orderId}`} 
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-red-500/25"
            >
              <RefreshCcw size={18} /> Retry Payment
            </Link>
            <Link 
              href="/contact" 
              className="w-full block py-3 rounded-xl border border-[var(--border)] text-sm font-bold text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-white/5 transition-all"
            >
              Contact Support
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function PaymentFailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Loading...</div>}>
      <PaymentFailContent />
    </Suspense>
  );
}
