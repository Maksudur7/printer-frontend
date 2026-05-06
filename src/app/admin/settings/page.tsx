'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, Save, Shield, Bell, CreditCard, 
  Database, Globe, Clock, Smartphone, Zap, RefreshCw
} from 'lucide-react';

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
         <h1 className="text-4xl font-black uppercase tracking-tighter">System <span className="text-[var(--color-primary)]">Settings</span></h1>
         <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Configure Fleet Parameters & Global Rules</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Navigation Tabs (Simulated) */}
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
                 tab.active ? 'bg-white shadow-xl shadow-green-900/5 text-[var(--color-primary)]' : 'opacity-40 hover:opacity-100'
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
                       <input type="number" defaultValue="2" className="input-field" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Color Page Price (BDT)</label>
                       <input type="number" defaultValue="5" className="input-field" />
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
                       <input type="number" defaultValue="5" className="w-20 bg-white/60 border-none rounded-xl p-3 text-center font-black" />
                    </div>
                    <div className="flex items-center justify-between p-4 glass-panel">
                       <div>
                          <p className="text-xs font-black uppercase tracking-tight">System Heartbeat</p>
                          <p className="text-[10px] opacity-40 font-bold">Mark offline if no signal for (minutes)</p>
                       </div>
                       <input type="number" defaultValue="10" className="w-20 bg-white/60 border-none rounded-xl p-3 text-center font-black" />
                    </div>
                 </div>
              </div>

              <div className="pt-4">
                 <button 
                   onClick={handleSave}
                   className="btn-primary w-full py-5 flex items-center justify-center gap-3"
                 >
                    {loading ? <RefreshCw className="animate-spin" /> : <><Save size={20} /> Save Configurations</>}
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
