'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getAllOrders } from '@/lib/api';
import { Order } from '@/lib/types';
import { 
  Search, Filter, Loader2, FileText, 
  Download, Eye, MoreVertical, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filtered, setFiltered] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('ALL');
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    getAllOrders()
      .then(data => {
        // If not admin, only show user's orders (mocked for now)
        const displayData = isAdmin ? data : data.slice(0, 15);
        setOrders(displayData);
        setFiltered(displayData);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isAdmin]);

  useEffect(() => {
    let result = orders.filter(o => 
      o.id.toLowerCase().includes(search.toLowerCase()) || 
      o.fileName?.toLowerCase().includes(search.toLowerCase())
    );
    if (status !== 'ALL') {
      result = result.filter(o => o.paymentStatus === status);
    }
    setFiltered(result);
    setPage(1);
  }, [search, status, orders]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const getStatusStyle = (s: string) => {
    switch(s) {
      case 'COMPLETED': return 'bg-green-500/10 text-green-400';
      case 'PENDING': return 'bg-yellow-500/10 text-yellow-500';
      case 'FAILED': return 'bg-red-500/10 text-red-400';
      default: return 'bg-indigo-500/10 text-indigo-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">{isAdmin ? 'All Orders' : 'My Printing History'}</h1>
          <p className="text-[var(--text-muted)] text-sm">Manage and track your print orders.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-[var(--border)] text-sm font-bold text-[var(--text)] hover:bg-white/10 transition-all">
          <Download size={16} /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input 
            type="text" 
            placeholder="Search by Order ID or File Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--border)] bg-white/5 text-sm text-[var(--text)] focus:outline-none focus:border-indigo-500/50 transition-all"
          />
        </div>
        <div className="flex gap-2">
          <select 
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-[var(--border)] bg-white/5 text-sm text-[var(--text)] focus:outline-none focus:border-indigo-500/50 transition-all min-w-[140px]"
          >
            <option value="ALL">All Payments</option>
            <option value="COMPLETED">Completed</option>
            <option value="PENDING">Pending</option>
            <option value="FAILED">Failed</option>
          </select>
          <button className="p-2.5 rounded-xl border border-[var(--border)] bg-white/5 text-[var(--text-muted)] hover:text-indigo-400">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 border-b border-[var(--border)]">
                <th className="px-6 py-4 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Order Detail</th>
                <th className="px-6 py-4 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Config</th>
                <th className="px-6 py-4 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider text-center">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <Loader2 size={32} className="animate-spin text-indigo-400 mx-auto" />
                  </td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-[var(--text-muted)]">
                    No orders found matching your criteria.
                  </td>
                </tr>
              ) : (
                paginated.map((order) => (
                  <tr key={order.id} className="group hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0">
                          <FileText size={20} className="text-indigo-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-[var(--text)] truncate max-w-[200px]">{order.fileName || 'Document'}</p>
                          <p className="text-[10px] font-mono text-[var(--text-muted)] mt-0.5">#{order.id.slice(0, 8)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-[var(--text)] font-medium">{order.pageCount} Pages • {order.copyCount} Copies</p>
                      <p className="text-[10px] text-[var(--text-muted)] mt-0.5">{order.isColor ? 'Color' : 'B&W'} • Kiosk: {order.kioskId}</p>
                      {(order.userEmail || order.userPhone) && (
                        <p className="text-[9px] text-indigo-400/70 mt-1 truncate max-w-[150px]">
                          {order.userEmail || order.userPhone}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-[var(--text)]">BDT {order.totalAmount}</p>
                      <p className="text-[10px] text-[var(--text-muted)]">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(order.paymentStatus)}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/order/${order.id}`} className="p-2 rounded-lg hover:bg-indigo-500/10 text-indigo-400 transition-all" title="View Order">
                          <Eye size={18} />
                        </Link>
                        <button className="p-2 rounded-lg hover:bg-white/10 text-[var(--text-muted)] transition-all">
                          <MoreVertical size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-[var(--border)] flex items-center justify-between">
            <p className="text-xs text-[var(--text-muted)] font-medium">
              Showing <span className="text-[var(--text)]">{(page - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="text-[var(--text)]">{Math.min(page * ITEMS_PER_PAGE, filtered.length)}</span> of <span className="text-[var(--text)]">{filtered.length}</span> results
            </p>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={18} />
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button 
                  key={i} 
                  onClick={() => setPage(i + 1)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                    page === i + 1 
                      ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' 
                      : 'border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)]'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
