'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Printer, Plus, Search, RefreshCw, Signal, SignalLow, AlertTriangle, 
  Settings2, Activity, MapPin, Battery, Cpu
} from 'lucide-react';
import { apiClient } from '@/lib/apiClient';

interface Kiosk {
  deviceId: string;
  name: string;
  location: string;
  status: 'ONLINE' | 'OFFLINE' | 'MAINTENANCE' | 'OUT_OF_PAPER' | 'OUT_OF_INK' | 'SYSTEM_ERROR';
  paperLevel: number;
  inkLevel: number;
  lastHeartbeat: string;
}

export default function KiosksPage() {
  const [kiosks, setKiosks] = useState<Kiosk[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchKiosks = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/v1/kiosk/admin/stats');
      setKiosks(res.data.devices || []);
    } catch (err) {
      console.error('Failed to fetch kiosks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKiosks();
  }, []);

  const filteredKiosks = kiosks.filter(k => 
    k.name.toLowerCase().includes(search.toLowerCase()) || 
    k.deviceId.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ONLINE': return 'bg-green-500';
      case 'OFFLINE': return 'bg-gray-400';
      case 'MAINTENANCE': return 'bg-yellow-500';
      default: return 'bg-red-500';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-4xl font-black uppercase tracking-tighter">Kiosk <span className="text-[var(--color-primary)]">Fleet</span></h1>
           <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Device Management & Monitoring</p>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={18} />
              <input 
                type="text" 
                placeholder="Search device..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-white/60 border border-white/80 rounded-2xl py-4 pl-12 pr-6 text-xs font-black uppercase tracking-widest outline-none focus:border-[var(--color-primary)] transition-all min-w-[280px]" 
              />
           </div>
           <button 
             onClick={fetchKiosks}
             className="p-4 glass-panel hover:bg-[var(--color-primary)] hover:text-white transition-all"
           >
              <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
           </button>
           <button className="btn-primary px-8 py-4 flex items-center gap-2">
              <Plus size={20} /> Register New
           </button>
        </div>
      </div>

      {/* Kiosk Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="glass-card p-8 h-64 animate-pulse bg-white/20" />
          ))
        ) : filteredKiosks.length === 0 ? (
          <div className="col-span-full py-20 text-center glass-card">
             <Printer size={48} className="mx-auto mb-4 opacity-20" />
             <p className="text-xs font-black uppercase tracking-widest opacity-40">No devices found matching your search</p>
          </div>
        ) : (
          filteredKiosks.map((kiosk) => (
            <motion.div 
              key={kiosk.deviceId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-8 hover:scale-[1.02] transition-all group"
            >
              <div className="flex items-start justify-between mb-8">
                 <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-white/60">
                       <Printer size={28} className="text-[var(--color-primary)]" />
                    </div>
                    <div>
                       <h3 className="text-xl font-black uppercase tracking-tighter leading-none mb-1">{kiosk.name}</h3>
                       <p className="text-[10px] font-black uppercase tracking-widest opacity-40">{kiosk.deviceId}</p>
                    </div>
                 </div>
                 <div className={`px-4 py-1.5 rounded-full flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-white ${getStatusColor(kiosk.status)} shadow-lg`}>
                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    {kiosk.status}
                 </div>
              </div>

              <div className="space-y-6">
                 {/* Paper Level */}
                 <div className="space-y-2">
                    <div className="flex justify-between text-[8px] font-black uppercase tracking-widest">
                       <span className="opacity-50">Paper Supply</span>
                       <span className={kiosk.paperLevel < 20 ? 'text-red-500' : 'text-[var(--color-primary)]'}>{kiosk.paperLevel}%</span>
                    </div>
                    <div className="h-2 bg-white/40 rounded-full overflow-hidden">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${kiosk.paperLevel}%` }}
                         className={`h-full rounded-full ${kiosk.paperLevel < 20 ? 'bg-red-500' : 'bg-green-500'}`} 
                       />
                    </div>
                 </div>

                 {/* Ink Level */}
                 <div className="space-y-2">
                    <div className="flex justify-between text-[8px] font-black uppercase tracking-widest">
                       <span className="opacity-50">Ink Capacity</span>
                       <span className={kiosk.inkLevel < 20 ? 'text-red-500' : 'text-blue-500'}>{kiosk.inkLevel}%</span>
                    </div>
                    <div className="h-2 bg-white/40 rounded-full overflow-hidden">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${kiosk.inkLevel}%` }}
                         className={`h-full rounded-full ${kiosk.inkLevel < 20 ? 'bg-red-500' : 'bg-blue-500'}`} 
                       />
                    </div>
                 </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/60 flex items-center justify-between">
                 <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest opacity-40">
                    <MapPin size={12} /> {kiosk.location}
                 </div>
                 <button className="p-2.5 rounded-xl hover:bg-[var(--color-primary)] hover:text-white transition-all text-gray-500">
                    <Settings2 size={16} />
                 </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
