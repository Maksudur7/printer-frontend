'use client';
import { Kiosk } from '@/lib/types';
import Link from 'next/link';
import { MapPin, Cpu, Droplets, FileText, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const statusConfig = {
  ONLINE:       { label: 'Active',        color: 'text-success',  dot: 'bg-success', glow: 'shadow-success/20' },
  OFFLINE:      { label: 'Offline',       color: 'text-slate-400',  dot: 'bg-slate-400', glow: 'shadow-slate-400/20' },
  MAINTENANCE:  { label: 'Maintenance',   color: 'text-warning', dot: 'bg-warning', glow: 'shadow-warning/20' },
  OUT_OF_PAPER: { label: 'Paper Out',  color: 'text-danger',    dot: 'bg-danger', glow: 'shadow-danger/20' },
};

export default function KioskCard({ kiosk }: { kiosk: Kiosk }) {
  const status = statusConfig[kiosk.status] ?? statusConfig.OFFLINE;
  const isAvailable = kiosk.status === 'ONLINE';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass-card hover-lift group relative flex flex-col rounded-[32px] overflow-hidden h-full"
    >
      {/* Top Banner Area */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1590234796091-a98a13408427?auto=format&fit=crop&q=80&w=400" 
          alt={kiosk.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#06060e] to-transparent opacity-60" />
        
        <div className={`absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#06060e]/60 backdrop-blur-md border border-white/10 shadow-lg`}>
          <span className={`w-2 h-2 rounded-full ${status.dot} ${isAvailable ? 'animate-pulse' : ''}`} />
          <span className={`text-[10px] font-black uppercase tracking-widest ${status.color}`}>{status.label}</span>
        </div>
      </div>

      <div className="flex flex-col flex-1 p-8">
        {/* Title & Location */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-[#a78bfa] transition-colors leading-tight">
            {kiosk.name}
          </h3>
          {kiosk.location && (
            <div className="flex items-center gap-2 text-sm text-white/40 font-medium">
              <MapPin size={14} className="text-[#a78bfa]" />
              {kiosk.location}
            </div>
          )}
        </div>

        {/* Status Indicators */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/40 flex items-center gap-1">
                <FileText size={10} /> Paper
              </span>
              <span className="text-xs font-bold text-white">{kiosk.paperLevel}%</span>
            </div>
            <div className="h-1 rounded-full bg-white/10 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: `${kiosk.paperLevel}%` }}
                className="h-full bg-[#a78bfa]" 
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/40 flex items-center gap-1">
                <Droplets size={10} /> Ink
              </span>
              <span className="text-xs font-bold text-white">{kiosk.inkLevel}%</span>
            </div>
            <div className="h-1 rounded-full bg-white/10 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: `${kiosk.inkLevel}%` }}
                className="h-full bg-[#60a5fa]" 
              />
            </div>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between gap-4">
          <div className="text-[10px] font-mono text-white/20">
            #{kiosk.deviceId.slice(0, 8)}
          </div>
          <Link
            href={`/kiosk/${kiosk.deviceId}`}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '10px 20px', borderRadius: 100,
              background: isAvailable ? 'white' : 'rgba(255,255,255,0.05)',
              color: isAvailable ? '#0a0a14' : 'rgba(255,255,255,0.2)',
              fontWeight: 700, fontSize: 13, border: 'none', cursor: isAvailable ? 'pointer' : 'not-allowed',
              pointerEvents: isAvailable ? 'auto' : 'none',
              transition: 'all 0.3s ease'
            }}
          >
            {isAvailable ? 'Start Printing' : 'Unavailable'}
            {isAvailable && <ArrowRight size={16} />}
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
