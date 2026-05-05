'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Printer } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full shadow-xl" style={{ backgroundColor: 'var(--color-primary)' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/">
          <motion.div
            className="flex items-center gap-3 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center shadow-inner">
              <Printer size={22} className="text-white" />
            </div>
            <span
              className="text-white text-2xl font-black tracking-tighter"
              style={{ fontFamily: 'var(--font-outfit)' }}
            >
              PrintKiosk
            </span>
          </motion.div>
        </Link>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end leading-none">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/50">Service Status</span>
            <span className="text-xs font-bold text-white">Active</span>
          </div>
          <div className="relative">
            <div className="w-3 h-3 rounded-full bg-[var(--color-secondary)] shadow-lg shadow-[var(--color-secondary)]/50" />
            <motion.div 
              animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.5, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 bg-[var(--color-secondary)] rounded-full"
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
