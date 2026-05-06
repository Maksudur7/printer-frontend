'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
   Users, CheckCircle, XCircle, ShieldAlert,
   Search, Loader2, ArrowRight, UserCheck, Mail,
   Clock, Trash2, ShieldCheck, UserX, RefreshCw
} from 'lucide-react';
import { apiClient } from '@/lib/apiClient';
import { useAuthStore } from '@/store/useAuthStore';

interface AdminUser {
   id: string;
   name: string;
   email: string;
   isApproved: boolean;
   createdAt: string;
}

export default function AdminUsersPage() {
   const { user: currentUser } = useAuthStore();
   const [users, setUsers] = useState<AdminUser[]>([]);
   const [loading, setLoading] = useState(true);
   const [actionLoading, setActionLoading] = useState<string | null>(null);
   const [search, setSearch] = useState('');

   const fetchUsers = async () => {
      setLoading(true);
      try {
         const res = await apiClient.get('/v1/auth/all-admins');
         setUsers(res.data);
      } catch (err) {
         console.error('Failed to fetch users:', err);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchUsers();
   }, []);

   const handleApprove = async (id: string) => {
      setActionLoading(id);
      try {
         await apiClient.post(`/v1/auth/approve-admin/${id}`, { approve: true });
         setUsers(users.map(u => u.id === id ? { ...u, isApproved: true } : u));
      } catch (err) {
         console.error('Approval failed:', err);
      } finally {
         setActionLoading(null);
      }
   };

   const handleDelete = async (id: string) => {
      if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
      setActionLoading(id);
      try {
         await apiClient.post(`/v1/auth/delete-user/${id}`);
         setUsers(users.filter(u => u.id !== id));
      } catch (err) {
         console.error('Delete failed:', err);
      } finally {
         setActionLoading(null);
      }
   };

   const filteredUsers = users.filter(u => 
      u.name.toLowerCase().includes(search.toLowerCase()) || 
      u.email.toLowerCase().includes(search.toLowerCase())
   );

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
         <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
               <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">User <span className="text-[var(--color-primary)]">Management</span></h1>
               <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Manage Security Clearance & Access</p>
            </div>
            <div className="flex items-center gap-4">
               <div className="relative w-full max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={18} />
                  <input 
                     type="text" 
                     placeholder="Search users..." 
                     value={search}
                     onChange={(e) => setSearch(e.target.value)}
                     className="w-full bg-white/60 border border-white/80 rounded-2xl py-4 pl-12 pr-6 text-xs font-black uppercase tracking-widest outline-none focus:border-[var(--color-primary)] transition-all min-w-[300px]" 
                  />
               </div>
               <button onClick={fetchUsers} className="p-4 glass-panel hover:bg-white/60 transition-all">
                  <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
               </button>
            </div>
         </div>

         <div className="grid grid-cols-1 gap-6">
            <AnimatePresence mode="popLayout">
               {loading ? (
                  Array(3).fill(0).map((_, i) => (
                     <div key={i} className="glass-card p-10 h-32 animate-pulse bg-white/20" />
                  ))
               ) : filteredUsers.length === 0 ? (
                  <div className="glass-card p-20 text-center opacity-40">
                     <Users size={48} className="mx-auto mb-4" />
                     <p className="text-xs font-black uppercase tracking-widest">No users found</p>
                  </div>
               ) : (
                  filteredUsers.map((u, idx) => (
                     <motion.div
                        key={u.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="glass-card p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:bg-white/40 transition-colors group"
                     >
                        <div className="flex items-center gap-5 flex-1">
                           <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm border border-white/60 shrink-0 ${u.isApproved ? 'bg-green-50' : 'bg-orange-50'}`}>
                              {u.isApproved ? <ShieldCheck className="text-green-600" size={28} /> : <ShieldAlert className="text-orange-600" size={28} />}
                           </div>
                           <div className="min-w-0">
                              <div className="flex items-center gap-3 mb-1">
                                 <h3 className="text-xl font-black truncate text-[var(--color-text-dark)] leading-none">{u.name}</h3>
                                 <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest ${u.isApproved ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                    {u.isApproved ? 'Approved' : 'Pending'}
                                 </span>
                              </div>
                              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                                 <div className="flex items-center gap-1.5 text-[var(--color-text-dark)] opacity-50 text-[10px] font-black uppercase tracking-widest">
                                    <Mail size={12} /> {u.email}
                                 </div>
                                 <div className="flex items-center gap-1.5 text-[var(--color-text-dark)] opacity-50 text-[10px] font-black uppercase tracking-widest">
                                    <Clock size={12} /> Registered {new Date(u.createdAt).toLocaleDateString()}
                                 </div>
                              </div>
                           </div>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                           {!u.isApproved && (
                              <button
                                 onClick={() => handleApprove(u.id)}
                                 disabled={!!actionLoading}
                                 className="flex-1 md:flex-none px-6 py-4 rounded-2xl bg-[var(--color-primary)] text-white font-black uppercase text-[9px] tracking-widest hover:scale-105 transition-all shadow-lg shadow-green-900/10 flex items-center justify-center gap-2"
                              >
                                 {actionLoading === u.id ? <Loader2 size={16} className="animate-spin" /> : <><CheckCircle size={16} /> Approve</>}
                              </button>
                           )}
                           <button
                              onClick={() => handleDelete(u.id)}
                              disabled={!!actionLoading}
                              className="p-4 rounded-2xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2 font-black uppercase text-[9px] tracking-widest"
                              title="Delete User"
                           >
                              {actionLoading === u.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={18} />}
                           </button>
                        </div>
                     </motion.div>
                  ))
               )}
            </AnimatePresence>
         </div>
      </div>
   );
}
