'use client';

import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { User, Mail, Camera, Shield, ShieldCheck, MapPin, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProfilePage() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  
  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--text)]">Profile Settings</h1>
        <button 
          onClick={() => setEditing(!editing)}
          className="px-4 py-2 rounded-xl border border-[var(--border)] text-sm font-bold text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-white/5 transition-all"
        >
          {editing ? 'Save Changes' : 'Edit Profile'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Role */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-cyan-500/5 -z-10" />
            <div className="relative inline-block">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white text-4xl font-extrabold mx-auto mb-4 border-4 border-white/5 shadow-2xl">
                {user.name.charAt(0)}
              </div>
              <button className="absolute bottom-4 right-0 p-2 rounded-full bg-[var(--bg-card)] border border-[var(--border)] text-indigo-400 hover:scale-110 transition-transform">
                <Camera size={16} />
              </button>
            </div>
            <h3 className="text-xl font-bold text-[var(--text)]">{user.name}</h3>
            <p className="text-sm text-[var(--text-muted)] mb-4">{user.email}</p>
            
            <div className="flex items-center justify-center gap-2 py-1.5 px-3 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 w-fit mx-auto">
              {user.role === 'ADMIN' ? <ShieldCheck size={14} /> : <User size={14} />}
              <span className="text-xs font-bold uppercase tracking-wider">{user.role} Account</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)]">
            <h4 className="text-sm font-bold text-[var(--text)] mb-4 uppercase tracking-widest opacity-50">Security</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--text-muted)] font-medium">Password</span>
                <button className="text-xs text-indigo-400 font-bold hover:underline">Change</button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--text-muted)] font-medium">2FA Auth</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-500/10 text-red-400 font-bold">OFF</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)]">
            <h4 className="text-sm font-bold text-[var(--text)] mb-6 uppercase tracking-widest opacity-50">Personal Information</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[var(--text-muted)] uppercase">Full Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                  <input 
                    type="text" 
                    disabled={!editing}
                    defaultValue={user.name}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--border)] bg-white/5 text-sm text-[var(--text)] focus:outline-none focus:border-indigo-500/50 transition-all"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[var(--text-muted)] uppercase">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                  <input 
                    type="email" 
                    disabled
                    defaultValue={user.email}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--border)] bg-white/5 text-sm text-[var(--text-muted)] cursor-not-allowed"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[var(--text-muted)] uppercase">Phone Number</label>
                <input 
                  type="text" 
                  disabled={!editing}
                  defaultValue="+880 1700-000000"
                  className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-white/5 text-sm text-[var(--text)] focus:outline-none focus:border-indigo-500/50 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[var(--text-muted)] uppercase">Location</label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                  <input 
                    type="text" 
                    disabled={!editing}
                    defaultValue="Dhaka, Bangladesh"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--border)] bg-white/5 text-sm text-[var(--text)] focus:outline-none focus:border-indigo-500/50 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)]">
            <h4 className="text-sm font-bold text-[var(--text)] mb-6 uppercase tracking-widest opacity-50">Preferences</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl border border-[var(--border)] bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                    <Globe size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[var(--text)]">Language</p>
                    <p className="text-xs text-[var(--text-muted)]">Set your preferred system language</p>
                  </div>
                </div>
                <select className="bg-transparent border border-[var(--border)] rounded-lg text-xs p-1.5 text-[var(--text)]">
                  <option>English (US)</option>
                  <option>Bengali</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-xl border border-[var(--border)] bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[var(--text)]">Email Notifications</p>
                    <p className="text-xs text-[var(--text-muted)]">Receive order updates via email</p>
                  </div>
                </div>
                <div className="relative w-10 h-5 bg-indigo-500 rounded-full cursor-pointer">
                  <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
