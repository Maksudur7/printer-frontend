'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Copy, Palette, Loader2, AlertTriangle, ArrowLeft, CreditCard, Layers, RotateCcw, Printer } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';
import type { Order, PaymentMethod, PaymentInitiateResponse } from '@/lib/types';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useOrderStore } from '@/store/useOrderStore';

interface PaymentOption {
  method: PaymentMethod;
  label: string;
  description: string;
  color: string;
  textColor: string;
  icon: string;
  logoColor: string;
}

const PAYMENT_OPTIONS: PaymentOption[] = [
  { method: 'BKASH',      label: 'bKash',      description: 'Mobile Wallet', color: '#fdf2f8', textColor: '#9d174d', logoColor: '#d946ef', icon: '💳' },
  { method: 'NAGAD',      label: 'Nagad',      description: 'Digital Wallet', color: '#fff7ed', textColor: '#9a3412', logoColor: '#f97316', icon: '🔶' },
  { method: 'SSLCOMMERZ', label: 'Cards/Bank', description: 'Visa/MasterCard', color: '#eff6ff', textColor: '#1e40af', logoColor: '#3b82f6', icon: '🏦' },
  { method: 'CASH',       label: 'Cash',       description: 'Pay at Machine', color: '#f0fdf4', textColor: '#166534', logoColor: '#22c55e', icon: '💵' },
];

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('orderId') ?? useOrderStore.getState().orderId ?? '';

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState<PaymentMethod | null>(null);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState('');

  useEffect(() => {
    if (!orderId) { router.replace('/'); return; }
    apiClient.get<Order>(`/v1/order/${orderId}`)
      .then((res) => setOrder(res.data))
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [orderId, router]);

  const handlePay = async () => {
    if (!selected) { setPayError('Please select a payment method.'); return; }
    setPaying(true); setPayError('');

    try {
      if (selected === 'CASH') {
        router.push(`/track?orderId=${orderId}`);
        return;
      }

      const res = await apiClient.post<PaymentInitiateResponse>('/v1/payments/initiate', {
        orderId,
        method: selected,
      });

      if (res.data.paymentUrl) {
        window.location.href = res.data.paymentUrl;
      } else {
        router.push(`/track?orderId=${orderId}`);
      }
    } catch (e: unknown) {
      setPayError(e instanceof Error ? e.message : 'Payment initiation failed.');
    } finally {
      setPaying(false);
    }
  };

  if (loading) return <LoadingSpinner fullPage message="Finalizing Bill..." />;

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md mx-auto px-4">
        <div className="glass-card w-full p-12 text-center">
          <AlertTriangle size={64} className="text-red-500 mx-auto mb-6" />
          <h2 className="text-2xl font-black mb-4 text-red-700" style={{ fontFamily: 'var(--font-outfit)' }}>
            Order Expired
          </h2>
          <p className="text-sm text-[var(--color-text-dark)] opacity-60 mb-8">{error}</p>
          <button className="btn-secondary w-full py-4" onClick={() => router.replace('/')}>
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="flex-1 flex flex-col items-center justify-start w-full max-w-2xl mx-auto px-4 py-8"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black tracking-tight mb-2" style={{ fontFamily: 'var(--font-outfit)', color: 'var(--color-primary)' }}>
          Order Summary
        </h1>
        <p className="text-sm text-[var(--color-text-dark)] opacity-70">Review details and complete payment.</p>
      </div>

      <div className="w-full space-y-6">
        {/* Bill Details */}
        <div className="glass-card p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-primary)]/5 rounded-full -mr-16 -mt-16 blur-3xl" />
          
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-[var(--color-primary)]/10 rounded-2xl flex items-center justify-center">
              <Printer className="text-[var(--color-primary)]" size={32} />
            </div>
            <div>
              <p className="text-xs font-black text-[var(--color-primary)] opacity-60 uppercase tracking-widest">Document Information</p>
              <h2 className="text-xl font-black text-[var(--color-text-dark)] truncate max-w-[240px]">{order?.fileName}</h2>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-y-6 gap-x-12 border-t border-white/40 pt-8">
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-tighter opacity-40">Pages & Copies</p>
              <div className="flex items-center gap-2 font-bold">
                <FileText size={14} className="text-[var(--color-primary)]" />
                <span>{order?.pageCount} Pages × {order?.copyCount} Copies</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-tighter opacity-40">Color Mode</p>
              <div className="flex items-center gap-2 font-bold">
                <Palette size={14} className="text-[var(--color-primary)]" />
                <span>{order?.isColor ? 'Full Color' : 'Black & White'}</span>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-white/40 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-tighter opacity-40">Total Bill Amount</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-[var(--color-accent)]">৳{order?.totalAmount}</span>
                <span className="text-sm font-bold opacity-40">BDT</span>
              </div>
            </div>
            <div className="px-4 py-2 bg-[var(--color-secondary)]/20 rounded-full text-[var(--color-primary)] text-[10px] font-black uppercase tracking-widest">
              Price Verified
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="glass-card p-8">
          <h2 className="text-sm font-black uppercase tracking-widest text-[var(--color-primary)] mb-6">Select Payment Method</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PAYMENT_OPTIONS.map((opt) => (
              <motion.button
                key={opt.method}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => setSelected(opt.method)}
                className={`p-5 rounded-2xl border-2 text-left transition-all relative overflow-hidden ${
                  selected === opt.method 
                    ? 'border-[var(--color-accent)] ring-4 ring-[var(--color-accent)]/10' 
                    : 'border-white/40 hover:border-white/80'
                }`}
                style={{ backgroundColor: opt.color }}
              >
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <span className="text-3xl">{opt.icon}</span>
                  {selected === opt.method && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-6 h-6 bg-[var(--color-accent)] rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </motion.div>
                  )}
                </div>
                <div className="relative z-10">
                  <p className="font-black text-base" style={{ color: opt.textColor }}>{opt.label}</p>
                  <p className="text-[10px] font-bold opacity-60" style={{ color: opt.textColor }}>{opt.description}</p>
                </div>
                {/* Decorative blob */}
                <div className="absolute -right-4 -bottom-4 w-12 h-12 rounded-full opacity-20 blur-xl" style={{ backgroundColor: opt.logoColor }} />
              </motion.button>
            ))}
          </div>

          <AnimatePresence>
            {selected === 'CASH' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="mt-6 p-4 bg-green-50 rounded-xl border border-green-100 flex gap-3 items-start overflow-hidden"
              >
                <AlertTriangle size={20} className="text-green-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-green-800">Cash Payment Instruction</p>
                  <p className="text-[10px] text-green-700 leading-normal mt-1">
                    Please click "Confirm & Track" below and then insert your cash into the kiosk machine's collector.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {payError && (
          <p className="text-center text-xs font-bold text-red-600 bg-red-50 py-2 rounded-lg">{payError}</p>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={handlePay}
          disabled={paying || !selected}
          className="w-full py-5 bg-[var(--color-accent)] text-white text-xl font-black rounded-2xl shadow-2xl shadow-[var(--color-accent)]/30 flex items-center justify-center gap-3 disabled:opacity-50 transition-all"
        >
          {paying ? (
            <Loader2 className="animate-spin" size={24} />
          ) : (
            <>
              <CreditCard size={24} /> 
              {selected === 'CASH' ? 'Confirm & Track' : 'Pay & Print Now'}
            </>
          )}
        </motion.button>
        
        <button onClick={() => router.back()} className="w-full py-3 text-xs font-bold text-[var(--color-primary)] opacity-60 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <ArrowLeft size={14} /> Back to settings
        </button>
      </div>
    </motion.div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<LoadingSpinner fullPage />}>
      <CheckoutContent />
    </Suspense>
  );
}
