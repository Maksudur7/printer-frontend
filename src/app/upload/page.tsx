'use client';

import { Suspense, useCallback, useState, useRef, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UploadCloud, FileText, X, Plus, Minus, Loader2, ArrowRight, Printer,
  Layers, RotateCcw, AlertCircle, Info, QrCode,
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
        // Images are always 1 page
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

      const res = await apiClient.post('/v1/order', fd, {
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
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex-1 flex items-center justify-center w-full px-4 py-16"
      >
        <div className="glass-card p-10 text-center max-w-sm w-full relative overflow-hidden">
          {/* Top accent line */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent" />

          {/* Icon */}
          <div className="w-24 h-24 rounded-[2rem] bg-[var(--color-accent)]/10 flex items-center justify-center mx-auto mb-6 relative">
            <QrCode size={48} className="text-[var(--color-accent)]" />
            <motion.div
              animate={{ opacity: [0, 0.6, 0], scale: [1, 1.3, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 border-4 border-[var(--color-accent)]/30 rounded-[2rem]"
            />
          </div>

          <h2 className="text-2xl font-black uppercase tracking-tighter mb-3">
            Scan <span className="text-[var(--color-accent)]">Required</span>
          </h2>
          <p className="text-[var(--color-text-dark)] opacity-60 text-sm leading-relaxed mb-8 font-medium">
            You must scan the QR code on the kiosk first before uploading your document.
          </p>

          {/* Countdown hint */}
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-[var(--color-text-dark)] opacity-40 uppercase tracking-widest mb-6">
            <Loader2 size={14} className="animate-spin" />
            Redirecting to Home...
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.replace('/')}
            className="btn-accent w-full py-4 font-black text-sm uppercase tracking-widest"
          >
            Go to Home
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="flex-1 flex flex-col items-center justify-start w-full max-w-2xl mx-auto px-4 py-8"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2" style={{ fontFamily: 'var(--font-outfit)', color: 'var(--color-primary)' }}>
          Print Your Document
        </h1>
        <p className="text-sm text-[var(--color-text-dark)] opacity-70">
          Upload, configure, and print in seconds.
        </p>
      </div>

      <div className="w-full space-y-6">
        {/* Drag & Drop Zone */}
        <motion.div
          layout
          className={`glass-card p-10 border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center gap-4 ${
            dragging ? 'border-[var(--color-accent)] bg-white/50 scale-[1.02]' : 'border-white/40 hover:border-white/60'
          }`}
          onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef} type="file" className="hidden"
            accept={ACCEPTED.join(',')}
            onChange={(e) => { const f = e.target.files?.[0]; if (f) processFile(f); }}
          />

          <AnimatePresence mode="wait">
            {isParsing ? (
              <motion.div key="parsing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-3">
                <Loader2 className="animate-spin text-[var(--color-primary)]" size={40} />
                <p className="text-sm font-medium text-[var(--color-primary)]">Analyzing pages...</p>
              </motion.div>
            ) : file ? (
              <motion.div key="file" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-4 w-full">
                <div className="w-14 h-14 bg-[var(--color-secondary)]/20 rounded-xl flex items-center justify-center shrink-0">
                  <FileText className="text-[var(--color-primary)]" size={32} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[var(--color-text-dark)] truncate">{file.name}</p>
                  <p className="text-xs text-[var(--color-text-dark)] opacity-60">
                    {(file.size / 1024 / 1024).toFixed(2)} MB • {pageCount} {pageCount === 1 ? 'Page' : 'Pages'}
                  </p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); setFile(null); setPageCount(0); }}
                  className="p-2 hover:bg-red-100 rounded-full transition-colors"
                >
                  <X className="text-red-500" size={20} />
                </button>
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-3 text-center">
                <div className="w-16 h-16 bg-white/40 rounded-full flex items-center justify-center shadow-inner">
                  <UploadCloud className="text-[var(--color-primary)]" size={32} />
                </div>
                <div>
                  <p className="font-bold text-[var(--color-text-dark)]">Click or drag file here</p>
                  <p className="text-xs text-[var(--color-text-dark)] opacity-50">PDF, JPG, PNG (Max 50MB)</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {fileError && (
          <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-xl border border-red-100">
            <AlertCircle size={16} />
            <p className="text-xs font-medium">{fileError}</p>
          </motion.div>
        )}

        {/* Print Settings Card */}
        <div className="glass-card p-6 space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--color-primary)] opacity-80">Print Options</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Copies */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-[var(--color-text-dark)]/60">Number of Copies</label>
              <div className="flex items-center gap-4 bg-white/40 p-2 rounded-xl border border-white/50">
                <button 
                  onClick={() => setCopyCount(Math.max(1, copyCount - 1))}
                  className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm hover:scale-105 active:scale-95 transition-all"
                >
                  <Minus size={18} />
                </button>
                <span className="flex-1 text-center font-bold text-xl">{copyCount}</span>
                <button 
                  onClick={() => setCopyCount(Math.min(50, copyCount + 1))}
                  className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm hover:scale-105 active:scale-95 transition-all"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>

            {/* Color Mode */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-[var(--color-text-dark)]/60">Color Mode</label>
              <div className="flex p-1 bg-white/40 rounded-xl border border-white/50">
                <button
                  onClick={() => setIsColor(false)}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${!isColor ? 'bg-[var(--color-primary)] text-white shadow-md' : 'text-[var(--color-text-dark)]/60 hover:bg-white/40'}`}
                >
                  B&W (৳2)
                </button>
                <button
                  onClick={() => setIsColor(true)}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${isColor ? 'bg-[var(--color-accent)] text-white shadow-md' : 'text-[var(--color-text-dark)]/60 hover:bg-white/40'}`}
                >
                  Color (৳5)
                </button>
              </div>
            </div>

            {/* Duplex Printing */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-[var(--color-text-dark)]/60">Sides</label>
              <div className="flex items-center justify-between bg-white/40 p-3 rounded-xl border border-white/50">
                <div className="flex items-center gap-2">
                  <Layers size={18} className="text-[var(--color-primary)]" />
                  <span className="text-sm font-bold">{isDuplex ? 'Double Sided' : 'Single Sided'}</span>
                </div>
                <button
                  onClick={() => setIsDuplex(!isDuplex)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${isDuplex ? 'bg-[var(--color-primary)]' : 'bg-gray-300'}`}
                >
                  <motion.div
                    animate={{ x: isDuplex ? 24 : 2 }}
                    className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                  />
                </button>
              </div>
            </div>

            {/* Orientation */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-[var(--color-text-dark)]/60">Orientation</label>
              <div className="flex items-center justify-between bg-white/40 p-3 rounded-xl border border-white/50">
                <div className="flex items-center gap-2">
                  <RotateCcw size={18} className="text-[var(--color-primary)]" />
                  <span className="text-sm font-bold">{orientation === 'PORTRAIT' ? 'Portrait' : 'Landscape'}</span>
                </div>
                <button
                  onClick={() => setOrientation(orientation === 'PORTRAIT' ? 'LANDSCAPE' : 'PORTRAIT')}
                  className="p-2 hover:bg-white rounded-lg transition-all"
                >
                  <RotateCcw size={16} className={orientation === 'LANDSCAPE' ? 'rotate-90 transition-transform' : 'transition-transform'} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info Card */}
        <div className="glass-card p-6 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--color-primary)] opacity-80">Contact Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="email" placeholder="Email Address" value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/50 rounded-xl border border-white/60 focus:border-[var(--color-primary)] outline-none text-sm transition-all"
            />
            <input
              type="tel" placeholder="Phone Number" value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 bg-white/50 rounded-xl border border-white/60 focus:border-[var(--color-primary)] outline-none text-sm transition-all"
            />
          </div>
        </div>

        {/* Price & Action Card */}
        <div className="glass-card p-6 bg-gradient-to-br from-white/40 to-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-xs font-bold text-[var(--color-primary)] opacity-60 uppercase tracking-tighter">Total Price</p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-[var(--color-primary)]">৳{total}</span>
                <span className="text-xs font-bold opacity-40">BDT</span>
              </div>
              {isDuplex && (
                <div className="flex items-center gap-1.5 mt-1 text-[var(--color-primary)]">
                  <Info size={12} />
                  <p className="text-[10px] font-bold">Duplex printing saves paper!</p>
                </div>
              )}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={handleSubmit}
              disabled={!file || uploading || pageCount === 0}
              className="px-8 py-4 bg-[var(--color-accent)] text-white font-black rounded-2xl shadow-xl shadow-[var(--color-accent)]/30 disabled:opacity-50 disabled:grayscale transition-all flex items-center gap-2"
            >
              {uploading ? <Loader2 className="animate-spin" size={20} /> : <><Printer size={20} /> Print Now <ArrowRight size={20} /></>}
            </motion.button>
          </div>
          
          {/* Background Decoration */}
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[var(--color-accent)]/5 rounded-full blur-3xl" />
        </div>

        {uploadError && (
          <p className="text-center text-xs font-bold text-red-600 bg-red-50 py-2 rounded-lg">{uploadError}</p>
        )}
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
