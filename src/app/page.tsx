'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import {
  Upload, CreditCard, Printer, MapPin, Star, CheckCircle,
  ArrowRight, ChevronDown, Zap, Shield, Clock, Users,
  FileText, TrendingUp, HelpCircle, ChevronUp, Mail, Sparkles, Globe
} from 'lucide-react';
import { Kiosk } from "@/lib/types";
import { getAllKiosks } from "@/lib/api";
import SkeletonCard from "@/components/SkeletonCard";
import KioskCard from "@/components/KioskCard";

const stagger = {
  animate: { transition: { staggerChildren: 0.12 } }
};

const fadeUp = {
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
};

export default function HomePage() {
  const [kiosks, setKiosks] = useState<Kiosk[]>([]);
  const [loading, setLoading] = useState(true);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 80]);

  useEffect(() => {
    getAllKiosks().then(d => setKiosks(d.slice(0, 4))).catch(() => setKiosks([])).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen text-white bg-[#06060e]">
      {/* ── Hero ── */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center overflow-hidden z-10"
      >
        {/* Subtle grid lines */}
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

        <motion.div
          style={{ opacity: heroOpacity, y: heroY, width: '100%' }}
          className="relative z-20"
        >
          <div className="max-w-[1200px] mx-auto px-10 py-[120px]">
            <motion.div variants={stagger} initial="initial" animate="animate">
              {/* Badge */}
              <motion.div variants={fadeUp} className="mb-8">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#a78bfa1f] border border-[#a78bfa4d] text-[13px] text-[#c4b5fd] tracking-wider">
                  <span className="glow-dot" />
                  Next-Gen Printing Infrastructure
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                variants={fadeUp}
                className="font-serif-display text-[clamp(52px,8vw,96px)] leading-none tracking-[-0.03em] mb-7 max-w-[820px]"
              >
                <span className="gradient-text">Print the</span>
                <br />
                <span className="text-white/35 italic">Future.</span>
              </motion.h1>

              {/* Subheadline */}
              <motion.p
                variants={fadeUp}
                className="text-[clamp(17px,2vw,21px)] text-white/50 max-w-[560px] leading-relaxed mb-12 font-light"
              >
                The most advanced cloud-printing network in Bangladesh. Secure, instantaneous, and truly decentralized.
              </motion.p>

              {/* CTA buttons */}
              <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
                <Link 
                  href="/explore" 
                  className="inline-flex items-center gap-2.5 px-8 py-4 bg-white text-[#0a0a14] font-bold text-[15px] rounded-full transition-all hover:bg-[#a78bfa] hover:text-white"
                >
                  <MapPin size={16} />
                  Find a Kiosk
                </Link>
                <Link 
                  href="/about" 
                  className="inline-flex items-center gap-2.5 px-8 py-4 bg-transparent text-white/70 font-medium text-[15px] rounded-full border border-white/15 transition-all hover:border-white/40 hover:text-white"
                >
                  Learn More <ArrowRight size={16} />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
            className="w-[1px] h-[60px] bg-gradient-to-b from-transparent to-[#a78bfa99] mx-auto"
          />
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="relative z-10 border-y border-white/5">
        <div className="max-w-[1200px] mx-auto px-10">
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {[
              { value: "48K+", label: "Successful Prints" },
              { value: "99.9%", label: "System Uptime" },
              { value: "12m", label: "Avg. Collection" },
              { value: "24/7", label: "Smart Support" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className={`py-9 px-8 ${i < 3 ? 'lg:border-r border-white/5' : ''} ${i % 2 === 0 ? 'border-r lg:border-r-0' : ''}`}
              >
                <div className="text-[clamp(28px,3.5vw,44px)] font-bold tracking-[-0.03em] mb-1.5">
                  {stat.value}
                </div>
                <div className="text-[14px] text-white/40 uppercase tracking-widest">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Live Network ── */}
      <section className="py-[120px] px-10 relative z-10">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col lg:flex-row items-end justify-between gap-10 mb-20">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="max-w-[600px]"
            >
              <p className="text-[12px] text-[#a78bfa] uppercase tracking-[0.2em] mb-5">
                Real-time Grid
              </p>
              <h2 className="font-serif-display text-[clamp(36px,4vw,54px)] leading-[1.15] tracking-[-0.025em] mb-7">
                Live Kiosk Network
              </h2>
              <p className="text-[17px] text-white/50 leading-relaxed font-light">
                Our distributed terminal network is expanding across every major hub in Dhaka. Always within walking distance.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Link href="/explore" className="group flex items-center gap-4 text-sm font-bold text-white/60 hover:text-white transition-colors">
                VIEW FULL NETWORK <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[#a78bfa] transition-colors"><ArrowRight size={16} /></div>
              </Link>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
              : kiosks.length > 0
                ? kiosks.map((k, i) => (
                    <motion.div 
                      key={k.id}
                      initial={{ opacity: 0, y: 32 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                      viewport={{ once: true }}
                      className="hover-lift"
                    >
                      <KioskCard kiosk={k} />
                    </motion.div>
                  ))
                : (
                  <div className="col-span-full py-40 glass-card rounded-[48px] border-dashed border-white/10 flex flex-col items-center justify-center text-center px-6">
                    <Printer size={64} className="text-white/10 mb-8" />
                    <h3 className="text-3xl font-serif-display text-white mb-4">Grid Synchronizing</h3>
                    <p className="text-white/30 max-w-xs font-light">The live network map is currently updating. Please refresh in a moment.</p>
                  </div>
                )
            }
          </div>
        </div>
      </section>

      {/* ── Support Center ── */}
      <section className="py-[120px] px-10 relative z-10 bg-white/[0.01] border-y border-white/5">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-20">
            <p className="text-[12px] text-[#a78bfa] uppercase tracking-[0.2em] mb-4">
              Support Protocol
            </p>
            <h2 className="font-serif-display text-[clamp(32px,4vw,48px)] leading-[1.15] tracking-[-0.025em]">
              Frequently Asked Questions
            </h2>
          </div>
          
          <div className="max-w-[800px] mx-auto">
            <FAQList />
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mt-20 p-12 glass-card rounded-[40px] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#a78bfa0d] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 text-center md:text-left">
              <h3 className="font-serif-display text-3xl text-white mb-2">Need direct human support?</h3>
              <p className="text-white/40 font-light">Our engineering team is standing by 24/7 for technical assistance.</p>
            </div>
            <Link href="/contact" className="relative z-10 px-10 py-5 rounded-full bg-white text-[#0a0a14] text-[13px] font-black uppercase tracking-widest hover:bg-[#a78bfa] hover:text-white transition-all">
              Open Support Ticket
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section className="py-[120px] px-10 relative z-10">
        <div className="max-w-[1200px] mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="p-[80px_60px] rounded-[40px] bg-gradient-to-br from-[#a78bfa26] to-[#3b82f61a] border border-[#a78bfa40] text-center relative overflow-hidden"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] bg-[radial-gradient(ellipse,rgba(139,92,246,0.12),transparent_70%)] pointer-events-none" />
            
            <div className="relative z-10">
              <h2 className="font-serif-display text-[clamp(32px,5vw,60px)] leading-tight tracking-[-0.03em] mb-6 text-white">Stay in the Sync</h2>
              <p className="text-[17px] text-white/45 font-light mb-12 max-w-[560px] mx-auto">Get notified about new kiosk deployments and critical network updates directly.</p>
              
              <form className="flex flex-col sm:flex-row gap-4 max-w-[600px] mx-auto" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="email" 
                  placeholder="Enter secure email address" 
                  className="flex-1 bg-white/5 border border-white/10 rounded-full py-5 px-8 text-white placeholder:text-white/20 outline-none focus:border-[#a78bfa80] transition-all"
                />
                <button className="px-10 py-5 rounded-full bg-white text-[#0a0a14] font-black uppercase text-[13px] tracking-widest hover:bg-[#a78bfa] hover:text-white transition-all">
                  Subscribe
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function FAQList() {
  const [open, setOpen] = useState<number | null>(null);
  const faqs = [
    { q: 'Is a digital identity required for terminal access?', a: 'Negative. Our network supports public document processing without mandatory account creation. However, registered nodes benefit from cloud history and premium quotas.' },
    { q: 'Which data protocols are supported for file transfer?', a: 'Standard document containers including PDF, PNG, and JPG. For absolute format integrity across our terminal nodes, PDF is the recommended protocol.' },
    { q: 'What are the current transaction rates?', a: 'Our base utility rate is 5 BDT per standard monochromatic page. High-fidelity color processing rates are dynamic based on terminal location.' },
    { q: 'Which payment gateways are integrated?', a: 'We utilize a multi-channel secure gateway supporting bKash, Nagad, and all standard bank card protocols via SSLCommerz.' },
    { q: 'What is the data retention policy for uploaded assets?', a: 'All uploaded document buffers are encrypted at rest and automatically purged from our cloud environment within a 24-hour cycle.' },
  ];
  return (
    <div className="space-y-4">
      {faqs.map((f, i) => (
        <div key={i} className="glass-card overflow-hidden rounded-[24px]">
          <button 
            onClick={() => setOpen(open === i ? null : i)} 
            className="w-full flex items-center justify-between p-8 text-left hover:bg-white/[0.02] transition-all group"
          >
            <span className="text-[19px] font-bold text-white/80 group-hover:text-white flex items-center gap-6 transition-colors">
              <span className="text-[13px] font-serif-display text-[#a78bfa66]">0{i+1}</span>
              {f.q}
            </span>
            <motion.div 
              animate={{ rotate: open === i ? 180 : 0 }}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${open === i ? 'bg-white text-[#0a0a14]' : 'bg-white/5 text-white/20'}`}
            >
              <ChevronDown size={18} />
            </motion.div>
          </button>
          <AnimatePresence>
            {open === i && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }} 
                animate={{ height: 'auto', opacity: 1 }} 
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="px-8 pb-8 pt-0 ml-14 text-white/45 leading-relaxed text-[16px] font-light max-w-[700px]">
                  {f.a}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
