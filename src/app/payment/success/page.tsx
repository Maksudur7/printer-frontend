'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('orderId') ?? searchParams.get('order_id') ?? '';
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (!orderId) { router.replace('/'); return; }
    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) { clearInterval(interval); router.push(`/track?orderId=${orderId}`); return 0; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [orderId, router]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md mx-auto px-4">
      <div className="glass-card w-full p-12 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-green-400" />
        
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 180, damping: 14 }}
          className="mb-8 flex justify-center"
        >
          <div className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center shadow-inner">
            <CheckCircle size={64} className="text-green-500" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="text-3xl font-black mb-4 tracking-tight"
          style={{ fontFamily: 'var(--font-outfit)', color: 'var(--color-primary)' }}
        >
          Payment Successful!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="text-[var(--color-text-dark)] opacity-60 text-sm leading-relaxed mb-8"
        >
          Your payment has been confirmed. Redirecting to order tracking in{' '}
          <span className="font-black text-[var(--color-accent)]">{countdown}s</span>…
        </motion.p>

        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[var(--color-secondary)]"
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: 3, ease: 'linear' }}
          />
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<LoadingSpinner fullPage />}>
      <SuccessContent />
    </Suspense>
  );
}
