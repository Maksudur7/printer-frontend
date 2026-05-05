'use client';

import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { 
  Printer, FileText, CreditCard, TrendingUp, 
  Clock, CheckCircle, AlertCircle, ShoppingBag
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();
  if (!user) return null;

  const isAdmin = user.role === 'ADMIN';

  const stats = isAdmin ? [
    { label: 'Total Revenue', value: 'BDT 45,200', change: '+12.5%', icon: CreditCard, color: 'text-green-400' },
    { label: 'Total Orders', value: '1,284', change: '+8.2%', icon: FileText, color: 'text-indigo-400' },
    { label: 'Active Kiosks', value: '32/48', change: '4 offline', icon: Printer, color: 'text-cyan-400' },
    { label: 'Paper Level', value: '78%', change: 'Normal', icon: ShoppingBag, color: 'text-yellow-400' },
  ] : [
    { label: 'Total Spent', value: 'BDT 1,450', change: '12 orders', icon: CreditCard, color: 'text-green-400' },
    { label: 'Pages Printed', value: '290', change: 'High quality', icon: FileText, color: 'text-indigo-400' },
    { label: 'Last Print', value: '2h ago', change: 'Library-01', icon: Clock, color: 'text-cyan-400' },
    { label: 'Reward Points', value: '145', change: 'Silver tier', icon: TrendingUp, color: 'text-yellow-400' },
  ];

  const recentOrders = [
    { id: 'ORD-101', item: 'Thesis_Final.pdf', status: 'Completed', amount: 'BDT 245', date: '2024-05-01' },
    { id: 'ORD-102', item: 'Receipt.png', status: 'Printing', amount: 'BDT 15', date: '2024-05-02' },
    { id: 'ORD-103', item: 'Report_Draft.docx', status: 'Pending', amount: 'BDT 120', date: '2024-05-03' },
    { id: 'ORD-104', item: 'Photo_01.jpg', status: 'Failed', amount: 'BDT 50', date: '2024-05-04' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">Hello, {user.name.split(' ')[0]}!</h1>
          <p className="text-[var(--text-muted)] text-sm">Here's what's happening with your printing today.</p>
        </div>
        <Link 
          href="/explore" 
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-indigo-500/20 text-center"
        >
          New Print Job
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <motion.div 
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] hover:border-indigo-500/30 transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl bg-white/5 ${s.color}`}>
                <s.icon size={20} />
              </div>
              <span className={`text-xs font-bold ${s.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                {s.change}
              </span>
            </div>
            <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">{s.label}</p>
            <p className="text-2xl font-extrabold text-[var(--text)] mt-1">{s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activity Chart Mockup */}
        <div className="lg:col-span-2 p-6 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)]">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-lg font-bold text-[var(--text)]">Printing Activity</h2>
            <select className="bg-white/5 border border-[var(--border)] rounded-lg text-xs p-1 text-[var(--text-muted)]">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
            </select>
          </div>
          
          <div className="h-48 flex items-end justify-between gap-2 px-2">
            {[45, 78, 52, 91, 63, 85, 42].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <div 
                  className="w-full bg-indigo-500/20 rounded-t-lg relative group-hover:bg-indigo-500/40 transition-all cursor-pointer"
                  style={{ height: `${h}%` }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {h}
                  </div>
                </div>
                <span className="text-[10px] text-[var(--text-muted)] uppercase font-bold">Day {i+1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)]">
          <h2 className="text-lg font-bold text-[var(--text)] mb-6">Quick Settings</h2>
          <div className="space-y-4">
            <button className="w-full flex items-center gap-3 p-3 rounded-xl border border-[var(--border)] hover:bg-white/5 transition-all text-left">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400">
                <CheckCircle size={18} />
              </div>
              <div>
                <p className="text-sm font-bold text-[var(--text)]">Auto-Payment</p>
                <p className="text-xs text-[var(--text-muted)]">Enabled for all kiosks</p>
              </div>
            </button>
            <button className="w-full flex items-center gap-3 p-3 rounded-xl border border-[var(--border)] hover:bg-white/5 transition-all text-left">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                <Clock size={18} />
              </div>
              <div>
                <p className="text-sm font-bold text-[var(--text)]">Print History</p>
                <p className="text-xs text-[var(--text-muted)]">Download full CSV report</p>
              </div>
            </button>
            <button className="w-full flex items-center gap-3 p-3 rounded-xl border border-[var(--border)] hover:bg-white/5 transition-all text-left">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400">
                <AlertCircle size={18} />
              </div>
              <div>
                <p className="text-sm font-bold text-[var(--text)]">Support</p>
                <p className="text-xs text-[var(--text-muted)]">Talk to a live agent</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-[var(--text)]">Recent Activities</h2>
          <Link href="/dashboard/orders" className="text-xs font-bold text-indigo-400 hover:text-indigo-300">View All</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="pb-3 text-xs font-bold text-[var(--text-muted)] uppercase">Order ID</th>
                <th className="pb-3 text-xs font-bold text-[var(--text-muted)] uppercase">Item Name</th>
                <th className="pb-3 text-xs font-bold text-[var(--text-muted)] uppercase text-center">Status</th>
                <th className="pb-3 text-xs font-bold text-[var(--text-muted)] uppercase text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {recentOrders.map(order => (
                <tr key={order.id} className="group hover:bg-white/5 transition-colors">
                  <td className="py-4 text-xs font-mono font-bold text-indigo-400">{order.id}</td>
                  <td className="py-4 text-sm font-medium text-[var(--text)]">{order.item}</td>
                  <td className="py-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                      order.status === 'Completed' ? 'bg-green-500/10 text-green-400' :
                      order.status === 'Printing' ? 'bg-indigo-500/10 text-indigo-400' :
                      order.status === 'Failed' ? 'bg-red-500/10 text-red-400' : 'bg-yellow-500/10 text-yellow-500'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 text-right text-sm font-bold text-[var(--text)]">{order.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
