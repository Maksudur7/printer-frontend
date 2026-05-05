'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { getKiosk, createOrder } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Kiosk } from '@/lib/types';
import {
  Printer, MapPin, Droplets, FileText, Upload, AlertCircle,
  CheckCircle, Loader2, ArrowLeft, Info, Cpu
} from 'lucide-react';
import Link from 'next/link';

export default function KioskDetailPage() {
  const { deviceId } = useParams<{ deviceId: string }>();
  const router = useRouter();
  const [kiosk, setKiosk] = useState<Kiosk | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form state
  const [file, setFile] = useState<File | null>(null);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [pageCount, setPageCount] = useState(1);
  const [copyCount, setCopyCount] = useState(1);
  const [isColor, setIsColor] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const [formError, setFormError] = useState('');
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    if (user) {
      setEmail(user.email || '');
      setPhone('+880 1700-000000'); // Mock phone for demo user
    }
  }, [user]);

  const PRICE_PER_PAGE = 5;
  const total = pageCount * copyCount * PRICE_PER_PAGE;

  useEffect(() => {
    getKiosk(deviceId)
      .then(setKiosk)
      .catch(() => setError('Kiosk not found or offline.'))
      .finally(() => setLoading(false));
  }, [deviceId]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) validateAndSetFile(f);
  };

  const validateAndSetFile = (f: File) => {
    const allowed = ['application/pdf', 'image/png', 'image/jpeg'];
    if (!allowed.includes(f.type)) { setFormError('Only PDF, PNG, or JPG files are allowed.'); return; }
    if (f.size > 20 * 1024 * 1024) { setFormError('File size must be less than 20MB.'); return; }
    setFormError('');
    setFile(f);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) { setFormError('Please select a file to print.'); return; }
    if (pageCount < 1) { setFormError('Page count must be at least 1.'); return; }
    if (copyCount < 1) { setFormError('Copy count must be at least 1.'); return; }

    setSubmitting(true);
    setFormError('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('kioskId', deviceId);
      fd.append('userEmail', email);
      fd.append('userPhone', phone);
      fd.append('pageCount', String(pageCount));
      fd.append('copyCount', String(copyCount));
      fd.append('isColor', String(isColor));
      const order = await createOrder(fd);
      router.push(`/order/${order.id}`);
    } catch (e: any) {
      setFormError(e.message || 'Failed to create order. Please try again.');
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 size={32} className="animate-spin text-indigo-400" />
    </div>
  );

  if (error || !kiosk) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center">
      <AlertCircle size={40} className="text-red-400" />
      <p className="text-[var(--text)] font-semibold text-xl">{error || 'Kiosk not found'}</p>
      <Link href="/explore" className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors">
        <ArrowLeft size={16} /> Back to Explore
      </Link>
    </div>
  );

  const statusColor = {
    ONLINE: 'text-green-400 bg-green-400/10',
    OFFLINE: 'text-slate-400 bg-slate-400/10',
    MAINTENANCE: 'text-yellow-400 bg-yellow-400/10',
    OUT_OF_PAPER: 'text-red-400 bg-red-400/10',
  }[kiosk.status];

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Back */}
        <Link href="/explore" className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text)] transition-colors mb-8">
          <ArrowLeft size={15} /> Back to Explore
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Kiosk Details */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            {/* Kiosk Card */}
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 flex items-center justify-center relative">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 border border-indigo-500/20 flex items-center justify-center">
                  <Cpu size={44} className="text-indigo-400" />
                </div>
                <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                  {kiosk.status.replace('_', ' ')}
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <h1 className="text-2xl font-bold text-[var(--text)]">{kiosk.name}</h1>
                  {kiosk.location && (
                    <p className="flex items-center gap-1.5 text-sm text-[var(--text-muted)] mt-1">
                      <MapPin size={13} /> {kiosk.location}
                    </p>
                  )}
                </div>

                {/* Levels */}
                <div className="space-y-3">
                  {[
                    { label: 'Paper Level', value: kiosk.paperLevel, icon: FileText, color: 'from-indigo-500 to-cyan-500' },
                    { label: 'Ink Level', value: kiosk.inkLevel, icon: Droplets, color: 'from-purple-500 to-pink-500' },
                  ].map(l => (
                    <div key={l.label}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="flex items-center gap-1 text-[var(--text-muted)]"><l.icon size={11} />{l.label}</span>
                        <span className="text-[var(--text)] font-medium">{l.value}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                        <div className={`h-full rounded-full bg-gradient-to-r ${l.color}`} style={{ width: `${l.value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Specs */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  {[
                    { label: 'Device ID', value: kiosk.deviceId },
                    { label: 'Price/Page', value: 'BDT 5.00' },
                    { label: 'Max File Size', value: '20 MB' },
                    { label: 'Formats', value: 'PDF, PNG, JPG' },
                  ].map(s => (
                    <div key={s.label} className="p-3 rounded-xl bg-white/5">
                      <p className="text-xs text-[var(--text-muted)]">{s.label}</p>
                      <p className="text-sm font-medium text-[var(--text)] mt-0.5 truncate">{s.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Info box */}
            <div className="flex gap-3 p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/15">
              <Info size={16} className="text-indigo-400 shrink-0 mt-0.5" />
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                No login required. Upload your file, configure settings, and pay online. Your print will be ready at this kiosk immediately after payment.
              </p>
            </div>
          </motion.div>

          {/* Right: Upload Form */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6">
              <h2 className="text-xl font-bold text-[var(--text)] mb-6 flex items-center gap-2">
                <Upload size={20} className="text-indigo-400" /> Upload & Print
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Contact Info (Public/Guest) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[var(--text-muted)] uppercase px-1">Your Email</label>
                    <input 
                      type="email" 
                      placeholder="email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-white/5 text-sm text-[var(--text)] focus:outline-none focus:border-indigo-500/50 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[var(--text-muted)] uppercase px-1">Your Phone</label>
                    <input 
                      type="text" 
                      placeholder="017XXXXXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-white/5 text-sm text-[var(--text)] focus:outline-none focus:border-indigo-500/50 transition-all"
                    />
                  </div>
                </div>

                {/* File Drop Zone */}
                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-2">Document File *</label>
                  <div
                    onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                      dragOver ? 'border-indigo-500 bg-indigo-500/5' : 'border-[var(--border)] hover:border-indigo-500/40'
                    } ${file ? 'bg-green-500/5 border-green-500/40' : ''}`}
                    onClick={() => document.getElementById('file-input')?.click()}
                  >
                    <input
                      id="file-input"
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      className="hidden"
                      onChange={e => e.target.files?.[0] && validateAndSetFile(e.target.files[0])}
                    />
                    {file ? (
                      <div className="flex flex-col items-center gap-2">
                        <CheckCircle size={28} className="text-green-400" />
                        <p className="text-sm font-medium text-[var(--text)]">{file.name}</p>
                        <p className="text-xs text-[var(--text-muted)]">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        <button type="button" onClick={e => { e.stopPropagation(); setFile(null); }}
                          className="text-xs text-red-400 hover:text-red-300 transition-colors mt-1">Remove file</button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <Upload size={28} className="text-[var(--text-muted)]" />
                        <p className="text-sm font-medium text-[var(--text)]">Drag & drop or click to upload</p>
                        <p className="text-xs text-[var(--text-muted)]">PDF, PNG, JPG up to 20MB</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Settings Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text)] mb-2">Page Count *</label>
                    <input
                      id="page-count"
                      type="number" min={1} max={500}
                      value={pageCount}
                      onChange={e => setPageCount(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-white/5 text-[var(--text)] focus:outline-none focus:border-indigo-500/50 transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text)] mb-2">Copies *</label>
                    <input
                      id="copy-count"
                      type="number" min={1} max={100}
                      value={copyCount}
                      onChange={e => setCopyCount(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-white/5 text-[var(--text)] focus:outline-none focus:border-indigo-500/50 transition-colors text-sm"
                    />
                  </div>
                </div>

                {/* Color toggle */}
                <div className="flex items-center justify-between p-4 rounded-xl border border-[var(--border)] bg-white/5">
                  <div>
                    <p className="text-sm font-medium text-[var(--text)]">Color Printing</p>
                    <p className="text-xs text-[var(--text-muted)]">Black & white by default</p>
                  </div>
                  <button
                    type="button"
                    id="color-toggle"
                    onClick={() => setIsColor(v => !v)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${isColor ? 'bg-gradient-to-r from-indigo-500 to-cyan-500' : 'bg-white/20'}`}
                  >
                    <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${isColor ? 'left-6.5' : 'left-0.5'}`} />
                  </button>
                </div>

                {/* Price Summary */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-500/10 to-cyan-500/5 border border-indigo-500/15">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-[var(--text-muted)]">{pageCount} pages × {copyCount} copies × BDT 5</span>
                    <span className="text-[var(--text)] font-medium">BDT {total}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold pt-2 border-t border-indigo-500/15">
                    <span className="text-[var(--text)]">Total</span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">BDT {total}</span>
                  </div>
                </div>

                {/* Error */}
                {formError && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    <AlertCircle size={15} /> {formError}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  id="submit-order"
                  disabled={submitting || kiosk.status !== 'ONLINE'}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-semibold text-sm hover:opacity-90 transition-all shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <><Loader2 size={16} className="animate-spin" /> Creating Order...</>
                  ) : kiosk.status !== 'ONLINE' ? (
                    'Kiosk Not Available'
                  ) : (
                    <><Printer size={16} /> Continue to Payment</>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
