'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getAllKiosks } from '@/lib/api';
import { Kiosk } from '@/lib/types';
import { 
  Plus, Search, MoreVertical, Cpu, 
  MapPin, CheckCircle, AlertCircle, XCircle,
  Loader2, RefreshCw
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function ManageKiosksPage() {
  const { user } = useAuth();
  const [kiosks, setKiosks] = useState<Kiosk[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (user?.role !== 'ADMIN') return;
    refreshData();
  }, [user]);

  const refreshData = () => {
    setLoading(true);
    getAllKiosks()
      .then(setKiosks)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  if (user?.role !== 'ADMIN') {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle size={48} className="text-red-400 mb-4" />
        <h2 className="text-xl font-bold text-[var(--text)]">Access Denied</h2>
        <p className="text-[var(--text-muted)]">You do not have permission to view this page.</p>
      </div>
    );
  }

  const filtered = kiosks.filter(k => 
    k.name.toLowerCase().includes(search.toLowerCase()) || 
    k.deviceId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">Manage Kiosks</h1>
          <p className="text-[var(--text-muted)] text-sm">Monitor and configure printing hardware.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={refreshData} className="p-2.5 rounded-xl border border-[var(--border)] bg-white/5 text-[var(--text-muted)] hover:text-indigo-400">
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-indigo-500/20">
            <Plus size={18} /> Add Kiosk
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
        <input 
          type="text" 
          placeholder="Search kiosks by name or device ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] text-sm text-[var(--text)] focus:outline-none focus:border-indigo-500/50 transition-all"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          [...Array(6)].map((_, i) => (
            <div key={i} className="h-48 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] animate-pulse" />
          ))
        ) : filtered.length === 0 ? (
          <div className="col-span-full py-20 text-center text-[var(--text-muted)]">
            No kiosks found.
          </div>
        ) : (
          filtered.map((kiosk) => (
            <motion.div 
              key={kiosk.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] hover:border-indigo-500/30 transition-all relative group"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-indigo-400">
                  <Cpu size={24} />
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${kiosk.status === 'ONLINE' ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${kiosk.status === 'ONLINE' ? 'text-green-400' : 'text-red-400'}`}>
                    {kiosk.status}
                  </span>
                  <button className="ml-2 text-[var(--text-muted)] hover:text-[var(--text)]">
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-[var(--text)]">{kiosk.name}</h3>
                  <p className="flex items-center gap-1 text-xs text-[var(--text-muted)] mt-1">
                    <MapPin size={10} /> {kiosk.location || 'No location set'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-bold uppercase text-[var(--text-muted)]">
                      <span>Paper</span>
                      <span className={kiosk.paperLevel < 20 ? 'text-red-400' : 'text-indigo-400'}>{kiosk.paperLevel}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500" style={{ width: `${kiosk.paperLevel}%` }} />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-bold uppercase text-[var(--text-muted)]">
                      <span>Ink</span>
                      <span className={kiosk.inkLevel < 20 ? 'text-red-400' : 'text-cyan-400'}>{kiosk.inkLevel}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-500" style={{ width: `${kiosk.inkLevel}%` }} />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[var(--border)] flex justify-between items-center">
                  <p className="text-[10px] text-[var(--text-muted)] font-mono uppercase">ID: {kiosk.deviceId}</p>
                  <button className="text-[10px] font-bold text-indigo-400 hover:underline">Configuration</button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
