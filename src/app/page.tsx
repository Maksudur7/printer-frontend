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
    <div
      className="min-h-screen text-white"
      style={{
        background: '#06060e',
        fontFamily: "'DM Sans', 'Inter', system-ui, sans-serif",
      }}
    >
      {/* ── Global styles ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700;0,9..40,900&family=DM+Serif+Display:ital@0;1&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .glass-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
        }

        .noise-bg::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          opacity: 0.4;
        }

        .gradient-text {
          background: linear-gradient(135deg, #fff 30%, #a78bfa 65%, #60a5fa 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hover-lift {
          transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.3s ease;
        }
        .hover-lift:hover {
          transform: translateY(-6px);
        }

        .glow-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #a78bfa;
          box-shadow: 0 0 12px 4px rgba(167, 139, 250, 0.5);
          display: inline-block;
        }
      `}</style>

      {/* ── Ambient background orbs ── */}
      <div aria-hidden style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
        <div style={{
          position: 'absolute', top: '-10%', left: '-5%',
          width: 600, height: 600,
          background: 'radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)',
          filter: 'blur(40px)'
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', right: '-10%',
          width: 500, height: 500,
          background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)',
          filter: 'blur(40px)'
        }} />
        <div style={{
          position: 'absolute', top: '50%', left: '40%',
          width: 400, height: 400,
          background: 'radial-gradient(circle, rgba(52,211,153,0.08) 0%, transparent 70%)',
          filter: 'blur(60px)'
        }} />
      </div>

      {/* ── Hero ── */}
      <section
        ref={heroRef}
        className="noise-bg"
        style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden', zIndex: 1 }}
      >
        {/* Subtle grid lines */}
        <div aria-hidden style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          pointerEvents: 'none'
        }} />

        <motion.div
          style={{ opacity: heroOpacity, y: heroY, position: 'relative', zIndex: 2, width: '100%' }}
        >
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '120px 40px 80px' }}>
            <motion.div variants={stagger} initial="initial" animate="animate">
              {/* Badge */}
              <motion.div variants={fadeUp} style={{ marginBottom: 32 }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '6px 16px', borderRadius: 100,
                  background: 'rgba(167,139,250,0.12)',
                  border: '1px solid rgba(167,139,250,0.3)',
                  fontSize: 13, color: '#c4b5fd', letterSpacing: '0.04em'
                }}>
                  <span className="glow-dot" />
                  Next-Gen Printing Infrastructure
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                variants={fadeUp}
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: 'clamp(52px, 8vw, 96px)',
                  lineHeight: 1.0,
                  letterSpacing: '-0.03em',
                  marginBottom: 28,
                  maxWidth: 820
                }}
              >
                <span className="gradient-text">Print the</span>
                <br />
                <span style={{ color: 'rgba(255,255,255,0.35)', fontStyle: 'italic' }}>Future.</span>
              </motion.h1>

              {/* Subheadline */}
              <motion.p
                variants={fadeUp}
                style={{
                  fontSize: 'clamp(17px, 2vw, 21px)',
                  color: 'rgba(255,255,255,0.5)',
                  maxWidth: 560,
                  lineHeight: 1.7,
                  marginBottom: 48,
                  fontWeight: 300
                }}
              >
                The most advanced cloud-printing network in Bangladesh. Secure, instantaneous, and truly decentralized.
              </motion.p>

              {/* CTA buttons */}
              <motion.div variants={fadeUp} style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <Link href="/explore" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 10,
                  padding: '14px 28px',
                  background: 'white', color: '#0a0a14',
                  fontWeight: 700, fontSize: 15, borderRadius: 100,
                  border: 'none', cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  textDecoration: 'none'
                }}
                  onMouseOver={e => { e.currentTarget.style.background = '#a78bfa'; e.currentTarget.style.color = 'white'; }}
                  onMouseOut={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#0a0a14'; }}
                >
                  <MapPin size={16} />
                  Find a Kiosk
                </Link>
                <Link href="/about" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 10,
                  padding: '14px 28px',
                  background: 'transparent', color: 'rgba(255,255,255,0.7)',
                  fontWeight: 500, fontSize: 15, borderRadius: 100,
                  border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  textDecoration: 'none'
                }}
                  onMouseOver={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'; e.currentTarget.style.color = 'white'; }}
                  onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
                >
                  Learn More <ArrowRight size={16} />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <div style={{ position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)', zIndex: 2 }}>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
            style={{
              width: 1, height: 60,
              background: 'linear-gradient(to bottom, transparent, rgba(167,139,250,0.6))',
              margin: '0 auto'
            }}
          />
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section style={{ position: 'relative', zIndex: 1, borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
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
                style={{
                  padding: '36px 32px',
                  borderRight: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none'
                }}
              >
                <div style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 6 }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Live Network ── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '120px 40px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 40, alignItems: 'end', marginBottom: 80 }}>
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
            >
              <p style={{ fontSize: 12, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 20 }}>
                Real-time Grid
              </p>
              <h2 style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: 'clamp(36px, 4vw, 54px)',
                lineHeight: 1.15,
                letterSpacing: '-0.025em',
                marginBottom: 28
              }}>
                Live Kiosk Network
              </h2>
              <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, fontWeight: 300, maxWidth: 600 }}>
                Our distributed terminal network is expanding across every major hub in Dhaka. Always within walking distance.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
            >
              <Link href="/explore" style={{
                display: 'inline-flex', alignItems: 'center', gap: 12,
                color: 'rgba(255,255,255,0.6)', fontSize: 14, fontWeight: 700, textDecoration: 'none', transition: 'color 0.3s ease'
              }}
              onMouseOver={e => e.currentTarget.style.color = 'white'}
              onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
              >
                VIEW FULL NETWORK
                <div style={{
                  width: 40, height: 40, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'border-color 0.3s ease'
                }}>
                  <ArrowRight size={16} />
                </div>
              </Link>
            </motion.div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
              : kiosks.length > 0
                ? kiosks.map((k, i) => (
                    <motion.div 
                      key={k.id}
                      className="hover-lift"
                      initial={{ opacity: 0, y: 32 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                      viewport={{ once: true }}
                    >
                      <KioskCard kiosk={k} />
                    </motion.div>
                  ))
                : (
                  <div className="glass-card" style={{ gridColumn: '1 / -1', padding: 80, borderRadius: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                    <Printer size={64} color="rgba(255,255,255,0.1)" style={{ marginBottom: 24 }} />
                    <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 32, marginBottom: 16 }}>Grid Synchronizing</h3>
                    <p style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 300, maxWidth: 320 }}>The live network map is currently updating. Please refresh in a moment.</p>
                  </div>
                )
            }
          </div>
        </div>
      </section>

      {/* ── Support Center ── */}
      <section style={{
        position: 'relative', zIndex: 1,
        padding: '100px 40px',
        background: 'rgba(255,255,255,0.015)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        borderBottom: '1px solid rgba(255,255,255,0.05)'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ marginBottom: 72, textAlign: 'center' }}
          >
            <p style={{ fontSize: 12, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 16 }}>
              Support Protocol
            </p>
            <h2 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 'clamp(32px, 4vw, 48px)',
              lineHeight: 1.15,
              letterSpacing: '-0.025em'
            }}>
              Frequently Asked Questions
            </h2>
          </motion.div>

          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <FAQList />
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
            className="glass-card"
            style={{
              marginTop: 80, padding: 48, borderRadius: 32, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 40, flexWrap: 'wrap'
            }}
          >
            <div>
              <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, marginBottom: 8 }}>Need direct human support?</h3>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 300 }}>Our engineering team is standing by 24/7 for technical assistance.</p>
            </div>
            <Link href="/contact" style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              padding: '14px 28px',
              background: 'white', color: '#0a0a14',
              fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.05em', borderRadius: 100,
              textDecoration: 'none', transition: 'all 0.25s ease'
            }}
            onMouseOver={e => { e.currentTarget.style.background = '#a78bfa'; e.currentTarget.style.color = 'white'; }}
            onMouseOut={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#0a0a14'; }}
            >
              Open Support Ticket
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '40px 40px 120px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
            style={{
              borderRadius: 40, padding: '80px 60px',
              background: 'linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(59,130,246,0.1) 100%)',
              border: '1px solid rgba(167,139,250,0.25)',
              textAlign: 'center', position: 'relative', overflow: 'hidden'
            }}
          >
            {/* Decorative orb */}
            <div aria-hidden style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400, height: 300,
              background: 'radial-gradient(ellipse, rgba(139,92,246,0.12), transparent 70%)',
              pointerEvents: 'none'
            }} />

            <div style={{ position: 'relative', zIndex: 2 }}>
              <h2 style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: 'clamp(32px, 5vw, 60px)',
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
                marginBottom: 20
              }}>
                Stay in the Sync
              </h2>
              <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.45)', marginBottom: 48, fontWeight: 300, maxWidth: 560, margin: '0 auto 48px' }}>
                Get notified about new kiosk deployments and critical network updates directly.
              </p>
              
              <form style={{ display: 'flex', gap: 16, maxWidth: 600, margin: '0 auto', flexWrap: 'wrap' }} onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="email" 
                  placeholder="Enter secure email address" 
                  style={{
                    flex: 1, minWidth: 260,
                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 100, padding: '16px 32px', color: 'white', outline: 'none'
                  }}
                />
                <button
                  style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    padding: '16px 36px',
                    background: 'white', color: '#0a0a14',
                    fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.05em', borderRadius: 100,
                    border: 'none', cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={e => { e.currentTarget.style.background = '#a78bfa'; e.currentTarget.style.color = 'white'; }}
                  onMouseOut={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#0a0a14'; }}
                >
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {faqs.map((f, i) => (
        <div key={i} className="glass-card" style={{ overflow: 'hidden', borderRadius: 24 }}>
          <button 
            onClick={() => setOpen(open === i ? null : i)} 
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: 32, textAlign: 'left', background: 'transparent', border: 'none', cursor: 'pointer'
            }}
          >
            <span style={{ fontSize: 19, fontWeight: 700, color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', gap: 24 }}>
              <span style={{ fontSize: 13, fontFamily: "'DM Serif Display', serif", color: 'rgba(167,139,250,0.4)' }}>0{i+1}</span>
              {f.q}
            </span>
            <motion.div 
              animate={{ rotate: open === i ? 180 : 0 }}
              style={{
                width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: open === i ? 'white' : 'rgba(255,255,255,0.05)',
                color: open === i ? '#0a0a14' : 'rgba(255,255,255,0.2)',
                transition: 'all 0.3s ease'
              }}
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
                style={{ overflow: 'hidden' }}
              >
                <div style={{ padding: '0 32px 32px', marginLeft: 56, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, fontSize: 16, fontWeight: 300, maxWidth: 700 }}>
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
