'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { getOrder, initPayment } from '@/lib/api';
import { Order } from '@/lib/types';
import { 
  FileText, CheckCircle, Clock, AlertCircle, 
  ArrowLeft, CreditCard, Loader2, Download
} from 'lucide-react';
import Link from 'next/link';

export default function OrderSummaryPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    getOrder(orderId)
      .then(setOrder)
      .catch(() => setError('Order not found'))
      .finally(() => setLoading(false));
  }, [orderId]);

  const handlePayment = async () => {
    setPaying(true);
    try {
      const response = await initPayment(orderId);
      if (response.url) {
        window.location.href = response.url;
      } else {
        throw new Error('Payment initialization failed');
      }
    } catch (err: any) {
      alert(err.message || 'Payment failed to start');
      setPaying(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 size={32} className="animate-spin text-indigo-400" />
    </div>
  );

  if (error || !order) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center">
      <AlertCircle size={40} className="text-red-400" />
      <p className="text-[var(--text)] font-semibold text-xl">{error || 'Order not found'}</p>
      <Link href="/explore" className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors">
        <ArrowLeft size={16} /> Back to Explore
      </Link>
    </div>
  );

  const statusColors = {
    PENDING: 'text-yellow-400 bg-yellow-400/10',
    COMPLETED: 'text-green-400 bg-green-400/10',
    FAILED: 'text-red-400 bg-red-400/10',
    WAITING_FOR_PAYMENT: 'text-yellow-400 bg-yellow-400/10',
    QUEUED: 'text-blue-400 bg-blue-400/10',
    PRINTING: 'text-indigo-400 bg-indigo-400/10',
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-10">
            <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-indigo-400" />
            </div>
            <h1 className="text-3xl font-bold text-[var(--text)]">Order Summary</h1>
            <p className="text-[var(--text-muted)]">Please review your order and complete the payment.</p>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden shadow-xl">
            <div className="p-6 border-b border-[var(--border)] bg-white/5">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-semibold">Order ID</p>
                  <p className="text-sm font-mono text-[var(--text)]">{order.id}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.paymentStatus]}`}>
                  {order.paymentStatus}
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* File Info */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-[var(--border)]">
                <div className="w-12 h-12 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0">
                  <FileText size={24} className="text-indigo-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[var(--text)] truncate">{order.fileName}</p>
                  <p className="text-xs text-[var(--text-muted)]">{order.pageCount} Pages • {order.copyCount} Copies</p>
                  {order.fileUrl && (
                    <a href={order.fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 mt-1">
                      <Download size={12} /> Preview File
                    </a>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-[var(--text)]">BDT {order.totalAmount}</p>
                  <p className="text-[10px] text-[var(--text-muted)]">{order.isColor ? 'Color' : 'B&W'}</p>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-[var(--text-muted)]">Kiosk ID</p>
                  <p className="text-sm font-medium text-[var(--text)]">{order.kioskId}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-[var(--text-muted)]">Print Status</p>
                  <p className={`text-sm font-medium ${statusColors[order.printStatus] || 'text-[var(--text)]'}`}>{order.printStatus.replace(/_/g, ' ')}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-[var(--text-muted)]">Created At</p>
                  <p className="text-sm font-medium text-[var(--text)]">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-[var(--text-muted)]">Order Number</p>
                  <p className="text-sm font-medium text-[var(--text)]">#{order.orderNumber}</p>
                </div>
              </div>

              <div className="pt-6 border-t border-[var(--border)]">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-bold text-[var(--text)]">Total Amount</span>
                  <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">BDT {order.totalAmount}</span>
                </div>

                {order.paymentStatus === 'PENDING' ? (
                  <button
                    onClick={handlePayment}
                    disabled={paying}
                    className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-bold text-lg hover:opacity-90 transition-all shadow-xl shadow-indigo-500/30 disabled:opacity-50"
                  >
                    {paying ? (
                      <><Loader2 size={24} className="animate-spin" /> Processing...</>
                    ) : (
                      <><CreditCard size={24} /> Pay with SSLCommerz</>
                    )}
                  </button>
                ) : (
                  <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-center font-semibold">
                    Payment {order.paymentStatus}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center gap-4">
            <Link href="/explore" className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors flex items-center gap-1">
              <ArrowLeft size={14} /> Back to Kiosks
            </Link>
            <span className="text-[var(--border)]">|</span>
            <Link href="/contact" className="text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors flex items-center gap-1">
              <Clock size={14} /> Need Help?
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
