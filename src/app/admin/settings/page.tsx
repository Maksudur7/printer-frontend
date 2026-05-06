'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, Save, Shield, Bell, CreditCard, 
  Database, Globe, Clock, Smartphone, Zap, RefreshCw, Loader2
} from 'lucide-react';
import { apiClient } from '@/lib/apiClient';

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  // Settings State
  const [bwPrice, setBwPrice] = useState('2');
  const [colorPrice, setColorPrice] = useState('5');
  const [paperThreshold, setPaperThreshold] = useState('5');

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    setFetching(true);
    try {
      const res = await apiClient.get('/v1/config');
      setBwPrice(res.data.bwPrice.toString());
      setColorPrice(res.data.colorPrice.toString());
      setPaperThreshold(res.data.paperThreshold.toString());
    } catch (err) {
      console.error('Failed to fetch config:', err);
    } finally {
      setFetching(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await apiClient.post('/v1/config', {
        bwPrice,
        colorPrice,
        paperThreshold
      });
      alert('Configurations saved successfully!');
    } catch (err) {
      console.error('Failed to save config:', err);
      alert('Failed to save settings.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
         <Loader2 className="animate-spin text-[var(--color-primary)] mb-4" size={40} />
         <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Loading System Config...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex items-center justify-between">
         <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter">System <span className="text-[var(--color-primary)]">Settings</span></h1>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Configure Fleet Parameters & Global Rules</p>
         </div>
         <button onClick={fetchConfig} className="p-4 glass-panel hover:bg-white/40 transition-all">
            <RefreshCw size={20} className={fetching ? 'animate-spin' : ''} />
         </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Navigation Tabs */}
        <div className="space-y-2">
           {[
             { icon: Zap, label: 'General', active: true },
             { icon: CreditCard, label: 'Pricing & Payments', active: false },
             { icon: Shield, label: 'Security & Auth', active: false },
             { icon: Bell, label: 'Notifications', active: false },
             { icon: Globe, label: 'API Configuration', active: false },
           ].map((tab) => (
             <button 
               key={tab.label}
               className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all ${
                 tab.active ? 'bg-white shadow-xl shadow-green-900/5 text-[var(--color-primary)]' : 'opacity-40 hover:opacity-100 text-gray-600'
               }`}
             >
               <tab.icon size={18} />
               {tab.label}
             </button>
           ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-2 space-y-6">
           <div className="glass-card p-8 space-y-8">
              {/* Pricing Section */}
              <div className="space-y-6">
                 <h2 className="text-xl font-black uppercase tracking-tighter flex items-center gap-3">
                    <CreditCard className="text-[var(--color-primary)]" size={24} />
                    Pricing Configuration
                 </h2>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">B&W Page Price (BDT)</label>
                       <input 
                         type="number" 
                         value={bwPrice}
                         onChange={(e) => setBwPrice(e.target.value)}
                         className="input-field" 
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Color Page Price (BDT)</label>
                       <input 
                         type="number" 
                         value={colorPrice}
                         onChange={(e) => setColorPrice(e.target.value)}
                         className="input-field" 
                       />
                    </div>
                 </div>
              </div>

              <hr className="border-white/60" />

              {/* Security Section */}
              <div className="space-y-6">
                 <h2 className="text-xl font-black uppercase tracking-tighter flex items-center gap-3">
                    <Shield className="text-[var(--color-primary)]" size={24} />
                    Auto-OFF Logic
                 </h2>
                 <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 glass-panel">
                       <div>
                          <p className="text-xs font-black uppercase tracking-tight">Paper Threshold</p>
                          <p className="text-[10px] opacity-40 font-bold">Auto-OFF when paper level is below this %</p>
                       </div>
                       <input 
                          type="number" 
                          value={paperThreshold}
                          onChange={(e) => setPaperThreshold(e.target.value)}
                          className="w-20 bg-white/60 border-none rounded-xl p-3 text-center font-black" 
                       />
                    </div>
                    <div className="flex items-center justify-between p-4 glass-panel opacity-50">
                       <div>
                          <p className="text-xs font-black uppercase tracking-tight">System Heartbeat</p>
                          <p className="text-[10px] opacity-40 font-bold">Mark offline if no signal for (minutes)</p>
                       </div>
                       <input type="number" defaultValue="10" disabled className="w-20 bg-white/20 border-none rounded-xl p-3 text-center font-black" />
                    </div>
                 </div>
              </div>

              <div className="pt-4">
                 <button 
                   onClick={handleSave}
                   disabled={loading}
                   className="btn-primary w-full py-5 flex items-center justify-center gap-3 shadow-xl shadow-green-900/10"
                 >
                    {loading ? <RefreshCw className="animate-spin" /> : <><Save size={20} /> Save Configurations</>}
                 </button>
              </div>
           </div>

           <div className="p-6 glass-card border-orange-200/50 flex items-start gap-4">
              <ShieldAlert className="text-orange-500 shrink-0" size={24} />
              <div>
                 <p className="text-xs font-black uppercase tracking-tight text-orange-700">Warning: Global Override</p>
                 <p className="text-[10px] font-bold opacity-60 leading-relaxed uppercase mt-1">
                    Changing these values will immediately affect all printing kiosks in the fleet. Please ensure the pricing is updated in compliance with local regulations.
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function ShieldAlert(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="M12 8v4" />
      <path d="M12 16h.01" />
    </svg>
  );
}
