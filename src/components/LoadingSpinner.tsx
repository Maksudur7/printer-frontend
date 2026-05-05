'use client';

import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: number;
  message?: string;
  fullPage?: boolean;
}

export default function LoadingSpinner({ size = 48, message, fullPage = false }: LoadingSpinnerProps) {
  const spinner = (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        className="rounded-full border-4 border-[#9ad872]"
        style={{
          width: size,
          height: size,
          borderTopColor: '#ffa02e',
        }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}
      />
      {message && <p className="text-[#468432] font-medium text-sm">{message}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        {spinner}
      </div>
    );
  }

  return spinner;
}
