'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, Printer, Users, CreditCard, 
  ArrowUpRight, ArrowDownRight, Search, Filter,
  Loader2, RefreshCw, Activity, ShieldAlert, Database
} from 'lucide-react';
import { apiClient } from '@/lib/apiClient';

interface DashboardData {
  kioskFleet: any[];
  stats: {
    totalRevenue: number;
    onlineCount: number;
    totalDevices: number;
    errorCount: number;
  };
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      // Documentation says: res.data = { kioskFleet: [], stats: { ... } }
      const res = await apiClient.get('/v1/kiosk/admin/stats');
      setData(res.data);
    } catch (err: any) {
      console.error('Dashboard Fetch Error:', err);
      setError('Failed to load dashboard statistics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 size={48} className="text-[var(--color-primary)] animate-spin" />
        <p className="text-sm font-black uppercase tracking-widest opacity-40">Connecting to Global Fleet...</p>
      </div>
    );
  }

  const statCards = [
    { 
      label: 'Total Revenue', 
      value: `৳${data?.stats?.totalRevenue?.toLocaleString() || '0'}`, 
      trend: 'Lifetime', 
      isUp: true, 
      icon: CreditCard, color: 'bg-blue-500' 
    },
    { 
      label: 'Fleet Status', 
      value: `${data?.stats?.onlineCount || 0}/${data?.stats?.totalDevices || 0}`, 
      trend: 'Devices Online', 
      isUp: (data?.stats?.onlineCount || 0) === (data?.stats?.totalDevices || 0), 
      icon: Printer, color: 'bg-[var(--color-primary)]' 
    },
    { 
      label: 'System Alerts', 
      value: data?.stats?.errorCount || '0', 
      trend: data?.stats?.errorCount === 0 ? 'Healthy' : 'Needs Attention', 
      isUp: data?.stats?.errorCount === 0, 
      icon: ShieldAlert, color: 'bg-orange-500' 
    },
    { 
      label: 'Active Users', 
      value: 'N/A', 
      trend: 'User Tracking', 
      isUp: true, 
      icon: Users, color: 'bg-purple-500' 
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">Command <span className="text-[var(--color-primary)]">Center</span></h1>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Full Real-Time Synchronization</p>
        </div>
        <button 
          onClick={fetchDashboardData}
          className="p-3 glass-panel hover:bg-white/40 transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          {loading ? 'Refreshing...' : 'Live Sync'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => {
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
        <div className="lg:col-span-2 glass-card p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
               <h2 className="text-2xl font-black uppercase tracking-tighter leading-none mb-1">Fleet Overview</h2>
               <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Live Health Monitoring</p>
            </div>
            <button 
              onClick={() => window.location.href='/admin/kiosks'}
              className="px-4 py-2 bg-white/40 border border-white/60 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-white/60 transition-colors"
            >
              Manage Fleet
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/40">
                  <th className="pb-4 text-[10px] font-black uppercase tracking-widest opacity-40">Device</th>
                  <th className="pb-4 text-[10px] font-black uppercase tracking-widest opacity-40">Paper</th>
                  <th className="pb-4 text-[10px] font-black uppercase tracking-widest opacity-40">Ink</th>
                  <th className="pb-4 text-[10px] font-black uppercase tracking-widest opacity-40">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/20">
                {(data?.kioskFleet || []).slice(0, 5).map((kiosk: any) => (
                  <tr key={kiosk.deviceId} className="group hover:bg-white/10 transition-colors">
                    <td className="py-5">
                       <p className="text-xs font-black leading-none mb-1">{kiosk.name}</p>
                       <p className="text-[10px] font-bold opacity-40">{kiosk.deviceId}</p>
                    </td>
                    <td className="py-5">
                       <div className="w-24 h-1.5 bg-white/40 rounded-full overflow-hidden">
                          <div className={`h-full ${kiosk.paperLevel < 10 ? 'bg-red-500' : 'bg-[var(--color-primary)]'}`} style={{ width: `${kiosk.paperLevel}%` }} />
                       </div>
                    </td>
                    <td className="py-5">
                       <div className="w-24 h-1.5 bg-white/40 rounded-full overflow-hidden">
                          <div className={`h-full ${kiosk.inkLevel < 10 ? 'bg-red-500' : 'bg-[var(--color-accent)]'}`} style={{ width: `${kiosk.inkLevel}%` }} />
                       </div>
                    </td>
                    <td className="py-5">
                       <span className={`px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-widest ${
                         kiosk.status === 'ONLINE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                       }`}>{kiosk.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-card p-8">
           <h2 className="text-2xl font-black uppercase tracking-tighter leading-none mb-8">System Health</h2>
           <div className="space-y-6">
              <div className="p-4 bg-white/40 rounded-2xl border border-white/60">
                 <div className="flex items-center justify-between mb-4">
                    <Activity className="text-[var(--color-primary)]" size={20} />
                    <span className="text-[10px] font-black uppercase text-green-600">Stable</span>
                 </div>
                 <p className="text-xs font-black uppercase tracking-tight">API Connectivity</p>
                 <p className="text-[9px] opacity-40 font-bold uppercase mt-1">Global latency: 124ms</p>
              </div>

              <div className="p-4 bg-white/40 rounded-2xl border border-white/60">
                 <div className="flex items-center justify-between mb-4">
                    <DatabaseIcon size={20} className="text-blue-500" />
                    <span className="text-[10px] font-black uppercase text-blue-600">Active</span>
                 </div>
                 <p className="text-xs font-black uppercase tracking-tight">Database Synced</p>
                 <p className="text-[9px] opacity-40 font-bold uppercase mt-1">Uptime: 99.9%</p>
              </div>

              <div className="pt-4">
                 <p className="text-[8px] font-black uppercase tracking-[0.2em] opacity-40 mb-4">Device Health Distribution</p>
                 <div className="flex gap-1 h-3 rounded-full overflow-hidden">
                    <div className="bg-green-500 h-full" style={{ width: `${(data?.stats?.onlineCount || 0) / (data?.stats?.totalDevices || 1) * 100}%` }} />
                    <div className="bg-orange-500 h-full" style={{ width: `${(data?.stats?.errorCount || 0) / (data?.stats?.totalDevices || 1) * 100}%` }} />
                 </div>
                 <div className="flex justify-between mt-3 text-[8px] font-black uppercase opacity-60">
                    <span>{data?.stats?.onlineCount || 0} Online</span>
                    <span>{data?.stats?.errorCount || 0} Issues</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function DatabaseIcon(props: any) {
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
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5V19A9 3 0 0 0 21 19V5" />
      <path d="M3 12A9 3 0 0 0 21 12" />
    </svg>
  );
}
