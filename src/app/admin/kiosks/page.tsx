'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Printer, Plus, Search, RefreshCw, Signal, SignalLow, AlertTriangle, 
  Settings2, Activity, MapPin, Battery, Cpu, Loader2, X, Download, QrCode, Trash2
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
  qrCodeUrl: string; // Backend generated QR code
}

export default function KiosksPage() {
  const [kiosks, setKiosks] = useState<Kiosk[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  
  // Registration Form State
  const [newName, setNewName] = useState('');
  const [newDeviceId, setNewDeviceId] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [regLoading, setRegLoading] = useState(false);

  const fetchKiosks = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/v1/kiosk/admin/stats');
      setKiosks(res.data.devices || res.data.kioskFleet || []);
    } catch (err) {
      console.error('Failed to fetch kiosks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKiosks();
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegLoading(true);
    try {
      await apiClient.post('/v1/kiosk/register', {
        name: newName,
        deviceId: newDeviceId,
        location: newLocation
      });
      setShowModal(false);
      setNewName('');
      setNewDeviceId('');
      setNewLocation('');
      fetchKiosks();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Registration failed');
    } finally {
      setRegLoading(false);
    }
  };

  const handleDelete = async (deviceId: string) => {
    if (!confirm('Are you sure you want to delete this kiosk? This action cannot be undone.')) return;
    
    try {
      await apiClient.post(`/v1/kiosk/admin/delete/${deviceId}`);
      fetchKiosks();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  const downloadQR = async (qrDataUrl: string, deviceId: string) => {
    if (!qrDataUrl) return;
    try {
      const response = await fetch(qrDataUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `kiosk-${deviceId}-qr.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download QR code:', err);
      // Fallback: open in new tab if direct download fails
      window.open(qrDataUrl, '_blank');
    }
  };

  const filteredKiosks = kiosks.filter(k => 
    (k.name || '').toLowerCase().includes(search.toLowerCase()) || 
    (k.deviceId || '').toLowerCase().includes(search.toLowerCase())
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
           <button onClick={() => setShowModal(true)} className="btn-primary px-8 py-4 flex items-center gap-2 shadow-xl shadow-green-900/10">
              <Plus size={20} /> Register New
           </button>
        </div>
      </div>

      {/* Kiosk Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="glass-card p-8 h-80 animate-pulse bg-white/20 flex flex-col justify-center items-center">
               <Loader2 className="animate-spin text-[var(--color-primary)] mb-4" size={32} />
               <p className="text-[10px] font-black uppercase opacity-40">Scanning Network...</p>
            </div>
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
              className="glass-card p-8 hover:scale-[1.02] transition-all group relative overflow-hidden"
            >
              <div className="flex items-start justify-between mb-8">
                 <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-white/60">
                       <Printer size={28} className="text-[var(--color-primary)]" />
                    </div>
                    <div>
                       <h3 className="text-xl font-black uppercase tracking-tighter leading-none mb-1">{kiosk.name || 'Device'}</h3>
                       <p className="text-[10px] font-black uppercase tracking-widest opacity-40">{kiosk.deviceId}</p>
                    </div>
                 </div>
                 <div className={`px-4 py-1.5 rounded-full flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-white ${getStatusColor(kiosk.status)} shadow-lg`}>
                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    {kiosk.status || 'OFFLINE'}
                 </div>
              </div>

              {/* QR Code Section (Using Backend Data URL) */}
              <div className="mb-8 flex items-center gap-6 p-4 bg-white/40 rounded-3xl border border-white/60 group-hover:bg-white/60 transition-colors">
                 <div className="bg-white p-2 rounded-xl shadow-inner shrink-0">
                    {kiosk.qrCodeUrl ? (
                      <img 
                        src={kiosk.qrCodeUrl} 
                        alt="Kiosk QR"
                        className="w-16 h-16"
                      />
                    ) : (
                      <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-lg">
                        <QrCode className="opacity-20" size={24} />
                      </div>
                    )}
                 </div>
                 <div className="flex-1">
                    <p className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-2">Device QR</p>
                    <button 
                      onClick={() => downloadQR(kiosk.qrCodeUrl, kiosk.deviceId)}
                      className="flex items-center gap-2 text-[10px] font-black uppercase text-[var(--color-primary)] hover:underline"
                    >
                       <Download size={14} /> Download
                    </button>
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
                     <MapPin size={12} /> {kiosk.location || 'Unknown Location'}
                  </div>
                  <div className="flex items-center gap-2">
                     <button className="p-2.5 rounded-xl hover:bg-gray-100 transition-all text-gray-500">
                        <Settings2 size={16} />
                     </button>
                     <button 
                       onClick={() => handleDelete(kiosk.deviceId)}
                       className="p-2.5 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all text-gray-400"
                     >
                        <Trash2 size={16} />
                     </button>
                  </div>
               </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Registration Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setShowModal(false)}
               className="absolute inset-0 bg-black/40 backdrop-blur-md"
             />
             <motion.div 
               initial={{ scale: 0.9, opacity: 0, y: 20 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               exit={{ scale: 0.9, opacity: 0, y: 20 }}
               className="relative bg-white/80 backdrop-blur-3xl rounded-[3rem] p-10 max-w-lg w-full shadow-2xl border border-white"
             >
                <button onClick={() => setShowModal(false)} className="absolute top-8 right-8 p-3 hover:bg-black/5 rounded-2xl transition-colors">
                   <X size={24} />
                </button>

                <div className="mb-10">
                   <div className="w-16 h-16 bg-[var(--color-primary)] rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-green-900/20">
                      <Printer className="text-white" size={32} />
                   </div>
                   <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">New <span className="text-[var(--color-primary)]">Kiosk</span></h2>
                   <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Register a device to the smart fleet</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Kiosk Name</label>
                      <input 
                        type="text" 
                        required 
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="e.g. Dhaka University Library" 
                        className="input-field" 
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Device Serial ID</label>
                      <input 
                        type="text" 
                        required 
                        value={newDeviceId}
                        onChange={(e) => setNewDeviceId(e.target.value)}
                        placeholder="e.g. KSK-2024-001" 
                        className="input-field" 
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Location Details</label>
                      <input 
                        type="text" 
                        required 
                        value={newLocation}
                        onChange={(e) => setNewLocation(e.target.value)}
                        placeholder="e.g. Sector-4, Ground Floor" 
                        className="input-field" 
                      />
                   </div>

                   <button 
                     type="submit" 
                     disabled={regLoading}
                     className="btn-primary w-full py-5 text-lg shadow-xl shadow-green-900/10 flex items-center justify-center gap-3"
                   >
                      {regLoading ? <Loader2 className="animate-spin" size={24} /> : <><Plus size={20} /> Register Device</>}
                   </button>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
