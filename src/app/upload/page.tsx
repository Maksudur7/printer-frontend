'use client';

import { Suspense, useCallback, useState, useRef, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UploadCloud, FileText, X, Plus, Minus, Loader2, ArrowRight, Printer,
  Layers, RotateCcw, AlertCircle, Info, QrCode, Mail, Phone, Palette, Layout
} from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { apiClient } from '@/lib/apiClient';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useOrderStore } from '@/store/useOrderStore';

const ACCEPTED = ['.pdf', '.jpg', '.jpeg', '.png'];
const COLOR_RATE = 5;
const BW_RATE = 2;

function UploadContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const deviceId = searchParams.get('kiosk') || searchParams.get('deviceId') || '';

  const store = useOrderStore();

  const setKioskId = store.setKioskId;

  useEffect(() => {
    if (deviceId) {
      setKioskId(deviceId);
    }
  }, [deviceId, setKioskId]);

  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [copyCount, setCopyCount] = useState(1);
  const [isColor, setIsColor] = useState(false);
  const [isDuplex, setIsDuplex] = useState(false);
  const [orientation, setOrientation] = useState<'PORTRAIT' | 'LANDSCAPE'>('PORTRAIT');
  
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  
  const [dragging, setDragging] = useState(false);
  const [fileError, setFileError] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  
  const inputRef = useRef<HTMLInputElement>(null);

  // Price Calculation
  const total = pageCount * copyCount * (isColor ? COLOR_RATE : BW_RATE);

  /* ── Auto Page Detection ────────────────────────────── */
  const processFile = useCallback(async (f: File) => {
    const ext = '.' + f.name.split('.').pop()?.toLowerCase();
    if (!ACCEPTED.includes(ext)) {
      setFileError(`Invalid file type. Accepted: ${ACCEPTED.join(', ')}`);
      return;
    }
    if (f.size > 50 * 1024 * 1024) {
      setFileError('File too large. Maximum size is 50 MB.');
      return;
    }

    setFileError('');
    setFile(f);
    setIsParsing(true);

    try {
      if (ext === '.pdf') {
        const arrayBuffer = await f.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
        setPageCount(pdfDoc.getPageCount());
      } else {
        setPageCount(1);
      }
    } catch (err) {
      console.error('Error parsing file:', err);
      setFileError('Failed to parse file. Please try a different document.');
      setFile(null);
    } finally {
      setIsParsing(false);
    }
  }, []);

  /* ── Drag & Drop ─────────────────────────────────────── */
  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) processFile(f);
  };

  /* ── Submit ──────────────────────────────────────────── */
  const handleSubmit = async () => {
    if (!file) { setFileError('Please select a file to upload.'); return; }
    if (pageCount === 0) { setFileError('Wait for page count detection.'); return; }
    if (!email || !phone) { setUploadError('Email and phone are required.'); return; }

    setUploading(true);
    setUploadError('');

    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('kioskId', store.kioskId ?? '');
      fd.append('copyCount', String(copyCount));
      fd.append('isColor', String(isColor));
      fd.append('isDuplex', String(isDuplex));
      fd.append('orientation', orientation);
      fd.append('userEmail', email);
      fd.append('userPhone', phone);

      const res = await apiClient.post('/v1/order/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const order = res.data;
      store.setOrderId(order.id);
      store.setFileInfo(file.name, pageCount);
      store.setSettings(copyCount, isColor);
      store.setTotalAmount(total);
      store.setUserContact(email, phone);

      router.push(`/checkout?orderId=${order.id}`);
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  /* ── Redirect if no kiosk (scan required) ───────────── */
  useEffect(() => {
    if (!deviceId) {
      const timer = setTimeout(() => router.replace('/'), 3000);
      return () => clearTimeout(timer);
    }
  }, [deviceId, router]);

  /* ── No Kiosk / Not Scanned ──────────────────────────── */
  if (!deviceId) {
    return (
      <div className="flex-1 flex items-center justify-center w-full px-6 py-16">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-10 text-center max-w-sm w-full relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)]" />
          <div className="w-24 h-24 rounded-[2rem] bg-[var(--color-accent)]/10 flex items-center justify-center mx-auto mb-6 relative">
            <QrCode size={48} className="text-[var(--color-accent)]" />
            <div className="absolute inset-0 border-4 border-[var(--color-accent)]/20 rounded-[2rem] animate-ping" />
          </div>
          <h2 className="text-3xl font-black uppercase mb-3">Scan Required</h2>
          <p className="text-sm opacity-70 mb-8 font-bold leading-relaxed">
            Please scan the QR code on the kiosk first to start your session.
          </p>
          <div className="flex items-center justify-center gap-2 text-xs font-black text-[var(--color-primary)] animate-pulse">
            <Loader2 size={16} className="animate-spin" /> Redirecting...
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-3xl mx-auto px-6 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">Configure <span className="text-[var(--color-accent)]">Print</span></h1>
        <p className="text-sm font-bold opacity-60">Complete your details to start the printing process.</p>
      </div>

      <div className="space-y-6">
        {/* File Dropzone */}
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}
          className={`glass-card p-12 border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center gap-4 ${
            dragging ? 'border-[var(--color-accent)] scale-[1.02] bg-white/60' : 'border-white/40 hover:border-white/80'
          }`}
        >
          <input ref={inputRef} type="file" className="hidden" accept={ACCEPTED.join(',')} onChange={(e) => { const f = e.target.files?.[0]; if (f) processFile(f); }} />
          <AnimatePresence mode="wait">
            {isParsing ? (
              <motion.div key="parsing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-4">
                <Loader2 className="animate-spin text-[var(--color-primary)]" size={48} />
                <p className="font-black uppercase tracking-widest text-xs text-[var(--color-primary)]">Reading pages...</p>
              </motion.div>
            ) : file ? (
              <motion.div key="file" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-6 w-full">
                <div className="w-20 h-20 bg-[var(--color-primary)]/10 rounded-3xl flex items-center justify-center shrink-0 shadow-inner">
                  <FileText className="text-[var(--color-primary)]" size={40} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xl font-black text-[var(--color-text-dark)] truncate mb-1">{file.name}</p>
                  <p className="text-xs font-bold text-[var(--color-text-dark)]/50 uppercase tracking-widest">
                    {(file.size / 1024 / 1024).toFixed(2)} MB • {pageCount} {pageCount === 1 ? 'Page' : 'Pages'}
                  </p>
                </div>
                <button onClick={(e) => { e.stopPropagation(); setFile(null); setPageCount(0); }} className="w-12 h-12 flex items-center justify-center bg-red-100 rounded-2xl text-red-600 hover:bg-red-200 transition-colors">
                  <X size={24} />
                </button>
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                <div className="w-20 h-20 bg-white/60 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <UploadCloud className="text-[var(--color-primary)]" size={40} />
                </div>
                <p className="text-xl font-black text-[var(--color-text-dark)] mb-1">Click or Drag to Upload</p>
                <p className="text-xs font-bold text-[var(--color-text-dark)]/40 uppercase tracking-widest">PDF, JPG, PNG (Max 50MB)</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {fileError && <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-2xl border border-red-100 text-sm font-bold"><AlertCircle size={20} />{fileError}</div>}

        {/* Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card p-6 space-y-6">
             <div className="flex items-center gap-3 border-b border-white/40 pb-4">
                <Palette size={20} className="text-[var(--color-primary)]" />
                <h3 className="text-sm font-black uppercase tracking-widest">Appearance</h3>
             </div>
             
             {/* Color Toggle */}
             <div className="flex p-1 bg-white/40 rounded-2xl border border-white/60">
                <button onClick={() => setIsColor(false)} className={`flex-1 py-3 text-xs font-black rounded-xl transition-all ${!isColor ? 'bg-[var(--color-primary)] text-white shadow-lg' : 'text-[var(--color-text-dark)]/60 hover:bg-white/40'}`}>B&W (৳2)</button>
                <button onClick={() => setIsColor(true)} className={`flex-1 py-3 text-xs font-black rounded-xl transition-all ${isColor ? 'bg-[var(--color-accent)] text-white shadow-lg' : 'text-[var(--color-text-dark)]/60 hover:bg-white/40'}`}>COLOR (৳5)</button>
             </div>

             {/* Orientation Toggle */}
             <div className="flex items-center justify-between glass-panel p-4">
                <div className="flex items-center gap-3">
                  <RotateCcw size={18} className="text-[var(--color-primary)]" />
                  <span className="text-sm font-bold uppercase tracking-tight">{orientation}</span>
                </div>
                <button onClick={() => setOrientation(orientation === 'PORTRAIT' ? 'LANDSCAPE' : 'PORTRAIT')} className="w-10 h-10 flex items-center justify-center bg-white/80 rounded-xl hover:rotate-90 transition-all duration-500 shadow-sm"><RotateCcw size={18} /></button>
             </div>
          </div>

          <div className="glass-card p-6 space-y-6">
             <div className="flex items-center gap-3 border-b border-white/40 pb-4">
                <Layout size={20} className="text-[var(--color-primary)]" />
                <h3 className="text-sm font-black uppercase tracking-widest">Layout</h3>
             </div>

             {/* Copy Stepper */}
             <div className="flex items-center justify-between glass-panel p-2">
                <button onClick={() => setCopyCount(Math.max(1, copyCount - 1))} className="w-12 h-12 flex items-center justify-center bg-white/80 rounded-xl shadow-sm hover:scale-105 transition-transform"><Minus size={20} /></button>
                <div className="text-center">
                  <p className="text-xs font-black text-[var(--color-primary)]/40 uppercase">Copies</p>
                  <p className="text-2xl font-black">{copyCount}</p>
                </div>
                <button onClick={() => setCopyCount(Math.min(50, copyCount + 1))} className="w-12 h-12 flex items-center justify-center bg-white/80 rounded-xl shadow-sm hover:scale-105 transition-transform"><Plus size={20} /></button>
             </div>

             {/* Duplex Toggle */}
             <div className="flex items-center justify-between glass-panel p-4">
                <div className="flex items-center gap-3">
                  <Layers size={18} className="text-[var(--color-primary)]" />
                  <span className="text-sm font-bold uppercase tracking-tight">{isDuplex ? 'Double Sided' : 'Single Sided'}</span>
                </div>
                <button onClick={() => setIsDuplex(!isDuplex)} className={`w-12 h-6 rounded-full transition-colors relative ${isDuplex ? 'bg-[var(--color-primary)]' : 'bg-white/60'}`}><motion.div animate={{ x: isDuplex ? 26 : 2 }} className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md" /></button>
             </div>
          </div>
        </div>

        {/* User Info */}
        <div className="glass-card p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-primary)]" size={18} />
                <input type="email" placeholder="e.g. john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field !pl-12" />
              </div>
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 ml-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-primary)]" size={18} />
                <input type="tel" placeholder="e.g. 01700000000" value={phone} onChange={(e) => setPhone(e.target.value)} className="input-field !pl-12" />
              </div>
           </div>
        </div>

        {/* Action Bar */}
        <div className="glass-card p-8 bg-gradient-to-r from-white/60 to-white/20">
           <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                 <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-1">Estimated Total</p>
                 <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-[var(--color-primary)] tracking-tighter">৳{total}</span>
                    <span className="text-sm font-black opacity-30 uppercase tracking-widest">BDT</span>
                 </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={handleSubmit} disabled={!file || uploading || pageCount === 0}
                className="btn-primary !py-6 !px-12 text-xl w-full md:w-auto shadow-2xl shadow-orange-500/30"
              >
                {uploading ? <Loader2 className="animate-spin" size={24} /> : <><Printer size={24} /> Pay & Print <ArrowRight size={24} /></>}
              </motion.button>
           </div>
           {uploadError && <p className="mt-6 text-center text-xs font-black text-red-600 bg-red-50 py-3 rounded-xl">{uploadError}</p>}
        </div>
      </div>
    </motion.div>
  );
}

export default function UploadPage() {
  return (
    <Suspense fallback={<LoadingSpinner fullPage />}>
      <UploadContent />
    </Suspense>
  );
}
