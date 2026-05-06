'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, CheckCircle, XCircle, ShieldAlert, 
  Search, Loader2, ArrowRight, UserCheck, Mail
} from 'lucide-react';
import { apiClient } from '@/lib/apiClient';
import { useAuthStore } from '@/store/useAuthStore';

interface AdminRequest {
  id: string;
  name: string;
  email: string;
  isApproved: boolean;
  createdAt: string;
}

export default function AdminUsersPage() {
  const { user: currentUser } = useAuthStore();
  const [requests, setRequests] = useState<AdminRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchRequests = async () => {
    try {
      const res = await apiClient.get('/v1/auth/pending-admins');
      setRequests(res.data);
    } catch (err) {
      console.error('Failed to fetch requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (id: string, approve: boolean) => {
    setActionLoading(id);
    try {
      await apiClient.post(`/v1/auth/approve-admin/${id}`, { approve });
      setRequests(requests.filter(r => r.id !== id));
    } catch (err) {
      console.error('Action failed:', err);
    } finally {
      setActionLoading(null);
    }
  };

  if (currentUser?.role !== 'SUPER_ADMIN') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
         <div className="w-24 h-24 bg-red-100 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-inner">
            <ShieldAlert size={56} className="text-red-500" />
         </div>
         <h1 className="text-4xl font-black uppercase tracking-tighter mb-4 text-red-700">Access Restricted</h1>
         <p className="text-sm font-bold opacity-60 max-w-sm mx-auto leading-relaxed uppercase tracking-widest">
            This sector is reserved for Super Administrators only. Please return to the main dashboard.
         </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="glass-card p-10 flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-br from-[var(--color-primary)]/5 to-transparent">
         <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">Admin <span className="text-[var(--color-primary)]">Requests</span></h1>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Security Clearance Queue</p>
         </div>
         <div className="flex items-center gap-4 bg-white/60 p-4 rounded-3xl border border-white/80">
            <div className="w-12 h-12 bg-[var(--color-primary)] rounded-2xl flex items-center justify-center shadow-lg">
               <Users className="text-white" size={24} />
            </div>
            <div>
               <p className="text-2xl font-black leading-none">{requests.length}</p>
               <p className="text-[10px] font-black uppercase opacity-40">Pending Review</p>
            </div>
         </div>
      </div>

      <div className="glass-card overflow-hidden">
         <div className="p-8 border-b border-white/60 flex items-center justify-between bg-white/20">
            <div className="relative w-full max-w-md">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={18} />
               <input type="text" placeholder="Search by name or email..." className="w-full bg-white/80 border border-white/60 rounded-2xl py-4 pl-12 pr-6 text-xs font-black uppercase tracking-widest outline-none focus:border-[var(--color-primary)] transition-all" />
            </div>
         </div>

         <div className="p-4">
            <AnimatePresence mode="popLayout">
               {loading ? (
                 <div className="p-20 text-center space-y-4">
                    <Loader2 className="animate-spin text-[var(--color-primary)] mx-auto" size={48} />
                    <p className="text-xs font-black uppercase tracking-widest opacity-40">Loading Requests...</p>
                 </div>
               ) : requests.length === 0 ? (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-20 text-center space-y-6">
                    <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto shadow-inner">
                       <UserCheck size={48} className="text-green-500" />
                    </div>
                    <div>
                       <h2 className="text-2xl font-black uppercase tracking-tighter mb-2">Queue Empty</h2>
                       <p className="text-xs font-black opacity-40 uppercase tracking-widest">All administrative requests have been processed.</p>
                    </div>
                 </motion.div>
               ) : (
                 <div className="grid grid-cols-1 gap-4">
                    {requests.map((req, idx) => (
                      <motion.div
                        key={req.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: idx * 0.05 }}
                        className="glass-panel p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:bg-white/40 transition-colors"
                      >
                         <div className="flex items-center gap-5 w-full">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-white/60 shrink-0">
                               <Users size={24} className="text-[var(--color-primary)]" />
                            </div>
                            <div className="min-w-0">
                               <h3 className="text-xl font-black truncate text-[var(--color-text-dark)] leading-none mb-2">{req.name}</h3>
                               <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                                  <div className="flex items-center gap-1.5 text-[var(--color-text-dark)] opacity-50 text-[10px] font-black uppercase tracking-widest">
                                     <Mail size={12} /> {req.email}
                                  </div>
                                  <div className="flex items-center gap-1.5 text-[var(--color-text-dark)] opacity-50 text-[10px] font-black uppercase tracking-widest">
                                     <Clock size={12} /> Joined {new Date(req.createdAt).toLocaleDateString()}
                                  </div>
                               </div>
                            </div>
                         </div>

                         <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
                            <button
                              onClick={() => handleAction(req.id, false)}
                              disabled={!!actionLoading}
                              className="flex-1 md:flex-none p-4 rounded-2xl bg-red-100 text-red-600 hover:bg-red-200 transition-colors flex items-center justify-center gap-2 font-black uppercase text-[10px] tracking-widest"
                            >
                               <XCircle size={18} /> Reject
                            </button>
                            <button
                              onClick={() => handleAction(req.id, true)}
                              disabled={!!actionLoading}
                              className="flex-1 md:flex-none p-4 px-8 rounded-2xl bg-[var(--color-primary)] text-white hover:scale-105 transition-all flex items-center justify-center gap-2 font-black uppercase text-[10px] tracking-widest shadow-lg shadow-green-900/20"
                            >
                               {actionLoading === req.id ? <Loader2 className="animate-spin" size={18} /> : <><CheckCircle size={18} /> Approve Account</>}
                            </button>
                         </div>
                      </motion.div>
                    ))}
                 </div>
               )}
            </AnimatePresence>
         </div>
      </div>
    </div>
  );
}
