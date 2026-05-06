'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, Printer, Users, CreditCard, 
  ArrowUpRight, ArrowDownRight, MoreVertical, Search, Filter,
  Loader2, AlertCircle, RefreshCw
} from 'lucide-react';
import { apiClient } from '@/lib/apiClient';

interface DashboardStats {
  revenue: { total: number; trend: string; isUp: boolean };
  kiosks: { active: number; total: number; trend: string; isUp: boolean };
  orders: { total: number; trend: string; isUp: boolean };
  users: { active: number; trend: string; isUp: boolean };
  recentOrders: any[];
  kioskFleet: any[];
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      // Fetching from the endpoint mentioned in documentation
      const res = await apiClient.get('/v1/kiosk/admin/stats');
      setStats(res.data);
    } catch (err: any) {
      console.error('Dashboard Fetch Error:', err);
      setError('Failed to load dashboard statistics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 60000); // Auto refresh
    return () => clearInterval(interval);
  }, []);

  if (loading && !stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 size={48} className="text-[var(--color-primary)] animate-spin" />
        <p className="text-sm font-black uppercase tracking-widest opacity-40">Synchronizing Fleet Data...</p>
      </div>
    );
  }

  const statCards = [
    { 
      label: 'Total Revenue', 
      value: `৳${stats?.revenue?.total.toLocaleString() || '0'}`, 
      trend: stats?.revenue?.trend || '0%', 
      isUp: stats?.revenue?.isUp ?? true, 
      icon: CreditCard, color: 'bg-blue-500' 
    },
    { 
      label: 'Active Kiosks', 
      value: `${stats?.kiosks?.active || 0}/${stats?.kiosks?.total || 0}`, 
      trend: stats?.kiosks?.trend || 'Stable', 
      isUp: stats?.kiosks?.isUp ?? true, 
      icon: Printer, color: 'bg-[var(--color-primary)]' 
    },
    { 
      label: 'Print Jobs', 
      value: stats?.orders?.total.toLocaleString() || '0', 
      trend: stats?.orders?.trend || '0%', 
      isUp: stats?.orders?.isUp ?? true, 
      icon: TrendingUp, color: 'bg-[var(--color-accent)]' 
    },
    { 
      label: 'Active Users', 
      value: stats?.users?.active.toLocaleString() || '0', 
      trend: stats?.users?.trend || '0%', 
      isUp: stats?.users?.isUp ?? true, 
      icon: Users, color: 'bg-purple-500' 
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">Command <span className="text-[var(--color-primary)]">Center</span></h1>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Real-time System Intelligence</p>
        </div>
        <button 
          onClick={fetchDashboardData}
          className="p-3 glass-panel hover:bg-white/40 transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          {loading ? 'Updating...' : 'Refresh Feed'}
        </button>
      </div>

      {/* Stats Grid */}
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
        {/* Kiosk Fleet Summary */}
        <div className="lg:col-span-2 glass-card p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
               <h2 className="text-2xl font-black uppercase tracking-tighter leading-none mb-1">Live Fleet</h2>
               <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Active Device Status</p>
            </div>
            <button onClick={() => window.location.href='/admin/kiosks'} className="text-[10px] font-black uppercase tracking-widest text-[var(--color-primary)] hover:underline">Manage All</button>
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
                {(stats?.kioskFleet || []).slice(0, 5).map((kiosk: any) => (
                  <tr key={kiosk.deviceId} className="group hover:bg-white/10 transition-colors">
                    <td className="py-5">
                       <p className="text-xs font-black leading-none mb-1">{kiosk.name}</p>
                       <p className="text-[10px] font-bold opacity-40">{kiosk.deviceId}</p>
                    </td>
                    <td className="py-5">
                       <div className="w-24 h-1.5 bg-white/40 rounded-full overflow-hidden">
                          <div className={`h-full ${kiosk.paperLevel < 20 ? 'bg-red-500' : 'bg-[var(--color-primary)]'}`} style={{ width: `${kiosk.paperLevel}%` }} />
                       </div>
                    </td>
                    <td className="py-5">
                       <div className="w-24 h-1.5 bg-white/40 rounded-full overflow-hidden">
                          <div className={`h-full ${kiosk.inkLevel < 20 ? 'bg-red-500' : 'bg-[var(--color-accent)]'}`} style={{ width: `${kiosk.inkLevel}%` }} />
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

        {/* Recent Activity */}
        <div className="glass-card p-8">
           <h2 className="text-2xl font-black uppercase tracking-tighter leading-none mb-8">Live Feed</h2>
           <div className="space-y-8 relative">
              <div className="absolute left-4 top-2 bottom-2 w-px bg-white/40" />
              {(stats?.recentOrders || []).map((order: any, i: number) => (
                <div key={i} className="flex gap-4 relative">
                   <div className="w-8 h-8 rounded-full bg-white/80 border border-white shadow-sm flex items-center justify-center shrink-0 z-10">
                      <CreditCard size={14} className="text-[var(--color-primary)]" />
                   </div>
                   <div>
                      <p className="text-xs font-black leading-none mb-1 tracking-tight">{order.type || 'Payment Received'}</p>
                      <p className="text-[10px] font-bold opacity-40 leading-relaxed uppercase">Order #{order.id.slice(-6)} · ৳{order.amount}</p>
                      <p className="text-[8px] font-black text-[var(--color-primary)] uppercase tracking-widest mt-1">{order.timeAgo || 'Just now'}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
