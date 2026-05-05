'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Printer, FileText } from 'lucide-react';
import Link from 'next/link';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 flex items-center justify-center">
      <div className="max-w-md w-full text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }} 
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[var(--bg-card)] border border-[var(--border)] rounded-3xl p-10 shadow-2xl shadow-green-500/10"
        >
          <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={48} className="text-green-400" />
          </div>
          <h1 className="text-3xl font-extrabold text-[var(--text)] mb-3">Payment Success!</h1>
          <p className="text-[var(--text-muted)] text-sm mb-8">
            Your payment was successful and your order is now in the print queue.
            Walk to the kiosk to collect your documents.
          </p>

          <div className="p-4 rounded-xl bg-white/5 border border-[var(--border)] mb-8 text-left">
            <p className="text-[10px] text-[var(--text-muted)] uppercase font-bold tracking-widest mb-1">Order Details</p>
            <p className="text-xs font-mono text-indigo-400 font-bold mb-2">ID: {orderId || 'TXN-12345678'}</p>
            <div className="flex items-center gap-2 text-xs text-[var(--text)]">
              <Printer size={12} className="text-indigo-400" />
              <span>Proceeding to Printing...</span>
            </div>
          </div>

          <div className="space-y-3">
            <Link 
              href="/dashboard/orders" 
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-indigo-500/25"
            >
              Track in Dashboard <ArrowRight size={18} />
            </Link>
            <Link 
              href="/" 
              className="w-full block py-3 rounded-xl border border-[var(--border)] text-sm font-bold text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-white/5 transition-all"
            >
              Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Loading...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
