'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getAllKiosks } from '@/lib/api';
import { Kiosk, KioskStatus } from '@/lib/types';
import KioskCard from '@/components/KioskCard';
import SkeletonCard from '@/components/SkeletonCard';
import { Search, Filter, SortAsc, Printer, ChevronDown } from 'lucide-react';

const statusOptions: { value: '' | KioskStatus; label: string }[] = [
  { value: '', label: 'All Status' },
  { value: 'ONLINE', label: 'Online' },
  { value: 'OFFLINE', label: 'Offline' },
  { value: 'MAINTENANCE', label: 'Maintenance' },
  { value: 'OUT_OF_PAPER', label: 'Out of Paper' },
];

const sortOptions = [
  { value: 'name_asc', label: 'Name A→Z' },
  { value: 'name_desc', label: 'Name Z→A' },
  { value: 'paper_desc', label: 'Paper Level ↑' },
  { value: 'ink_desc', label: 'Ink Level ↑' },
];

const PAGE_SIZE = 8;

const stagger = {
  animate: { transition: { staggerChildren: 0.12 } }
};

const fadeUp = {
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
};

export default function ExplorePage() {
  const [all, setAll] = useState<Kiosk[]>([]);
  const [filtered, setFiltered] = useState<Kiosk[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'' | KioskStatus>('');
  const [sort, setSort] = useState('name_asc');
  const [page, setPage] = useState(1);

  useEffect(() => {
    getAllKiosks().then(d => { setAll(d); setFiltered(d); }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = [...all];
    if (search) result = result.filter(k => k.name.toLowerCase().includes(search.toLowerCase()) || k.location?.toLowerCase().includes(search.toLowerCase()));
    if (status) result = result.filter(k => k.status === status);
    result.sort((a, b) => {
      if (sort === 'name_asc') return a.name.localeCompare(b.name);
      if (sort === 'name_desc') return b.name.localeCompare(a.name);
      if (sort === 'paper_desc') return b.paperLevel - a.paperLevel;
      if (sort === 'ink_desc') return b.inkLevel - a.inkLevel;
      return 0;
    });
    setFiltered(result);
    setPage(1);
  }, [search, status, sort, all]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="min-h-screen text-white bg-[#06060e] py-[160px] px-10 relative overflow-hidden">
      {/* Ambient Grid Background */}
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

      <div className="max-w-[1200px] mx-auto relative z-10">
        <motion.div 
          variants={stagger}
          initial="initial"
          animate="animate"
          className="mb-20"
        >
          <motion.div variants={fadeUp} className="mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#a78bfa1f] border border-[#a78bfa4d] text-[13px] text-[#c4b5fd] tracking-wider">
              <span className="glow-dot" />
              Global Terminal Map
            </span>
          </motion.div>

          <motion.h1 
            variants={fadeUp}
            className="font-serif-display text-[clamp(52px,8vw,96px)] leading-none tracking-[-0.03em] mb-10"
          >
            <span className="gradient-text">Find a Hub.</span>
            <br />
            <span className="text-white/35 italic">Process Anywhere.</span>
          </motion.h1>

          <motion.p 
            variants={fadeUp}
            className="text-[clamp(17px,2vw,21px)] text-white/50 max-w-[600px] leading-relaxed font-light"
          >
            Instant decentralized access to high-fidelity document processing across major Bangladesh hubs.
          </motion.p>
        </motion.div>

        {/* High-Tech Filters Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.2, duration: 0.8 }}
          className="flex flex-col xl:flex-row gap-6 mb-12 p-6 rounded-[40px] bg-white/[0.02] border border-white/5 backdrop-blur-3xl"
        >
          {/* Search Input */}
          <div className="relative flex-1 group">
            <Search size={18} className="absolute left-8 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#a78bfa] transition-colors" />
            <input
              type="text"
              placeholder="Search terminal ID, hub name or street..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/5 rounded-[24px] py-5 pl-20 pr-8 text-white placeholder:text-white/10 outline-none focus:bg-white/[0.06] focus:border-[#a78bfa33] transition-all duration-500 font-medium"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-6">
            <div className="relative group min-w-[200px]">
              <div className="absolute left-8 top-1/2 -translate-y-1/2 flex items-center gap-3 text-white/20 group-focus-within:text-[#a78bfa] transition-colors">
                <Filter size={16} />
                <span className="h-4 w-[1px] bg-white/10" />
              </div>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as '' | KioskStatus)}
                className="w-full bg-white/[0.03] border border-white/5 rounded-[24px] py-5 pl-24 pr-12 text-white outline-none appearance-none cursor-pointer focus:bg-white/[0.06] focus:border-[#a78bfa33] transition-all duration-500 font-bold text-[12px] uppercase tracking-widest"
              >
                {statusOptions.map(o => <option key={o.value} value={o.value} className="bg-[#0a0a14]">{o.label}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-8 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none group-hover:text-white transition-colors" />
            </div>

            <div className="relative group min-w-[200px]">
              <div className="absolute left-8 top-1/2 -translate-y-1/2 flex items-center gap-3 text-white/20 group-focus-within:text-[#a78bfa] transition-colors">
                <SortAsc size={16} />
                <span className="h-4 w-[1px] bg-white/10" />
              </div>
              <select
                value={sort}
                onChange={e => setSort(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/5 rounded-[24px] py-5 pl-24 pr-12 text-white outline-none appearance-none cursor-pointer focus:bg-white/[0.06] focus:border-[#a78bfa33] transition-all duration-500 font-bold text-[12px] uppercase tracking-widest"
              >
                {sortOptions.map(o => <option key={o.value} value={o.value} className="bg-[#0a0a14]">{o.label}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-8 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none group-hover:text-white transition-colors" />
            </div>
          </div>
        </motion.div>

        {/* Results Metadata */}
        {!loading && (
          <div className="flex items-center justify-between mb-10 px-4">
            <div className="flex items-center gap-3">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34d399] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#34d399]"></span>
              </span>
              <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-black">
                DATABASE SYNC: <span className="text-white">ACTIVE</span> — <span className="text-white/60">{filtered.length} NODES DISCOVERED</span>
              </p>
            </div>
          </div>
        )}

        {/* Kiosks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : paginated.length > 0
              ? paginated.map((k, i) => (
                  <motion.div 
                    key={k.id} 
                    initial={{ opacity: 0, y: 32 }} 
                    whileInView={{ opacity: 1, y: 0 }} 
                    transition={{ delay: i * 0.05, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    viewport={{ once: true }}
                    className="hover-lift"
                  >
                    <KioskCard kiosk={k} />
                  </motion.div>
                ))
              : (
                <div className="col-span-full py-40 glass-card rounded-[40px] border-dashed border-white/10 flex flex-col items-center justify-center text-center px-10">
                  <div className="w-24 h-24 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center mb-8">
                    <Printer size={48} className="text-white/10" />
                  </div>
                  <h3 className="text-3xl font-serif-display text-white mb-4">No Terminal Nodes Found</h3>
                  <p className="text-white/30 max-w-sm font-light mb-10">Your current filter configuration returned zero results from our active grid.</p>
                  <button 
                    onClick={() => { setSearch(''); setStatus(''); }}
                    className="px-10 py-4 rounded-full bg-white text-[#0a0a14] text-[12px] font-black uppercase tracking-widest hover:bg-[#a78bfa] hover:text-white transition-all shadow-2xl"
                  >
                    Synchronize Grid
                  </button>
                </div>
              )
          }
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-10 mt-20">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))} 
              disabled={page === 1}
              className="px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white text-[10px] font-black tracking-[0.2em] uppercase hover:bg-white/10 disabled:opacity-10 disabled:cursor-not-allowed transition-all"
            >
              PREV
            </button>
            
            <div className="flex gap-3">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button 
                  key={p} 
                  onClick={() => setPage(p)}
                  className={`w-12 h-12 rounded-full font-black text-[12px] transition-all duration-500 flex items-center justify-center ${
                    p === page 
                    ? 'bg-white text-[#0a0a14] shadow-[0_0_30px_rgba(255,255,255,0.1)]' 
                    : 'bg-white/5 border border-white/10 text-white/30 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {p < 10 ? `0${p}` : p}
                </button>
              ))}
            </div>

            <button 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
              disabled={page === totalPages}
              className="px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white text-[10px] font-black tracking-[0.2em] uppercase hover:bg-white/10 disabled:opacity-10 disabled:cursor-not-allowed transition-all"
            >
              NEXT
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
