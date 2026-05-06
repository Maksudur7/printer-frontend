'use client';

import { motion } from 'framer-motion';
import { 
  TrendingUp, Printer, Users, CreditCard, 
  ArrowUpRight, ArrowDownRight, MoreVertical, Search, Filter
} from 'lucide-react';

const STATS = [
  { label: 'Total Revenue', value: '৳42,850', trend: '+12.5%', isUp: true, icon: CreditCard, color: 'bg-blue-500' },
  { label: 'Active Kiosks', value: '24', trend: 'All Online', isUp: true, icon: Printer, color: 'bg-[var(--color-primary)]' },
  { label: 'Print Jobs', value: '1,284', trend: '+8.2%', isUp: true, icon: TrendingUp, color: 'bg-[var(--color-accent)]' },
  { label: 'Active Users', value: '842', trend: '-2.4%', isUp: false, icon: Users, color: 'bg-purple-500' },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {STATS.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card p-6 group hover:scale-[1.02] transition-transform"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.color}/20 rounded-2xl flex items-center justify-center`}>
                  <Icon className={`${stat.color.replace('bg-', 'text-')}`} size={24} />
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-black uppercase ${
                  stat.isUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {stat.isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {stat.trend}
                </div>
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black tracking-tighter leading-none">{stat.value}</h3>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Kiosk Status Table */}
        <div className="lg:col-span-2 glass-card p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
               <h2 className="text-2xl font-black uppercase tracking-tighter leading-none mb-1">Kiosk Fleet</h2>
               <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Live Device Monitoring</p>
            </div>
            <div className="flex items-center gap-3">
               <div className="relative hidden sm:block">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30" size={16} />
                  <input type="text" placeholder="Search devices..." className="bg-white/40 border border-white/60 rounded-xl py-2 pl-10 pr-4 text-[10px] font-bold uppercase outline-none focus:border-[var(--color-primary)] w-48" />
               </div>
               <button className="p-3 glass-panel hover:bg-white/40 transition-colors"><Filter size={16} /></button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/40">
                  <th className="pb-4 text-[10px] font-black uppercase tracking-widest opacity-40 px-2">ID</th>
                  <th className="pb-4 text-[10px] font-black uppercase tracking-widest opacity-40 px-2">Location</th>
                  <th className="pb-4 text-[10px] font-black uppercase tracking-widest opacity-40 px-2">Paper</th>
                  <th className="pb-4 text-[10px] font-black uppercase tracking-widest opacity-40 px-2">Ink</th>
                  <th className="pb-4 text-[10px] font-black uppercase tracking-widest opacity-40 px-2">Status</th>
                  <th className="pb-4 text-[10px] font-black uppercase tracking-widest opacity-40 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/20">
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="group hover:bg-white/10 transition-colors">
                    <td className="py-5 px-2 font-black text-xs">K-00{i}</td>
                    <td className="py-5 px-2">
                       <p className="text-xs font-black leading-none mb-1">Dhanmondi Lake</p>
                       <p className="text-[10px] font-bold opacity-40 leading-none">SECTOR-12, GATE-4</p>
                    </td>
                    <td className="py-5 px-2">
                       <div className="w-24 h-1.5 bg-white/40 rounded-full overflow-hidden">
                          <div className="h-full bg-[var(--color-primary)] w-[85%]" />
                       </div>
                    </td>
                    <td className="py-5 px-2">
                       <div className="w-24 h-1.5 bg-white/40 rounded-full overflow-hidden">
                          <div className="h-full bg-[var(--color-accent)] w-[62%]" />
                       </div>
                    </td>
                    <td className="py-5 px-2">
                       <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-[8px] font-black uppercase tracking-widest">Online</span>
                    </td>
                    <td className="py-5 px-2 text-right">
                       <button className="p-2 hover:bg-white/60 rounded-xl transition-colors"><MoreVertical size={16} className="opacity-30" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-card p-8">
           <h2 className="text-2xl font-black uppercase tracking-tighter leading-none mb-8">Recent Activity</h2>
           <div className="space-y-8 relative">
              <div className="absolute left-4 top-2 bottom-2 w-px bg-white/40" />
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex gap-4 relative">
                   <div className="w-8 h-8 rounded-full bg-white/80 border border-white shadow-sm flex items-center justify-center shrink-0 z-10">
                      <CreditCard size={14} className="text-[var(--color-primary)]" />
                   </div>
                   <div>
                      <p className="text-xs font-black leading-none mb-1 tracking-tight">Payment Received</p>
                      <p className="text-[10px] font-bold opacity-40 leading-relaxed uppercase">Order #ORD-12845 processed at K-004</p>
                      <p className="text-[8px] font-black text-[var(--color-primary)] uppercase tracking-widest mt-1">2 mins ago</p>
                   </div>
                </div>
              ))}
           </div>
           <button className="w-full mt-10 py-4 glass-panel font-black uppercase tracking-widest text-[10px] hover:bg-white/40 transition-colors">View All Logs</button>
        </div>
      </div>
    </div>
  );
}
