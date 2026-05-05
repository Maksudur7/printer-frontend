'use client';

import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: number;
  message?: string;
  fullPage?: boolean;
}

export default function LoadingSpinner({ size = 48, message, fullPage = false }: LoadingSpinnerProps) {
  const spinner = (
    <div className="flex flex-col items-center gap-6">
      <div className="relative">
        <motion.div
          className="rounded-full border-[6px] border-[var(--color-primary)]/10"
          style={{ width: size, height: size, borderTopColor: 'var(--color-accent)' }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
        />
        <motion.div
          className="absolute inset-0 rounded-full border-[2px] border-[var(--color-secondary)]/30"
          style={{ width: size, height: size }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
        />
      </div>
      {message && (
        <p className="text-[var(--color-primary)] font-black text-xs uppercase tracking-[0.2em] animate-pulse">
          {message}
        </p>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="flex-1 flex items-center justify-center w-full min-h-[400px]">
        {spinner}
      </div>
    );
  }

  return spinner;
}
