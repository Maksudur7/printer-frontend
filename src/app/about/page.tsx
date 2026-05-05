"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ShieldCheck, Zap, Globe, Printer, ArrowRight, MapPin } from 'lucide-react';

const AboutPage = () => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 80]);

  const stagger = {
    animate: { transition: { staggerChildren: 0.12 } }
  };

  const fadeUp = {
    initial: { opacity: 0, y: 32 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
  };

  const features = [
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Instant Access",
      description: "No accounts. No queues. Scan once and your document prints in under 30 seconds.",
      accent: "#a78bfa"
    },
    {
      icon: <ShieldCheck className="w-5 h-5" />,
      title: "Secure & Private",
      description: "End-to-end encryption on every upload. Files are permanently purged every 24 hours.",
      accent: "#34d399"
    },
    {
      icon: <Globe className="w-5 h-5" />,
      title: "City-Wide Network",
      description: "A growing web of Smart Kiosks across Dhaka — always within walking distance.",
      accent: "#60a5fa"
    }
  ];

  const stats = [
    { value: "500+", label: "Kiosks by 2027" },
    { value: "24hr", label: "Auto file purge" },
    { value: "< 30s", label: "Print time" },
    { value: "64-bit", label: "Encryption" },
  ];

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
                  Redefining Public Infrastructure in Bangladesh
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
                <span className="gradient-text">Print Anything.</span>
                <br />
                <span style={{ color: 'rgba(255,255,255,0.35)', fontStyle: 'italic' }}>From Anywhere.</span>
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
                We are building a city-wide network of Smart Kiosks — making high-quality printing as effortless as sending a message.
              </motion.p>

              {/* CTA buttons */}
              <motion.div variants={fadeUp} style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <button style={{
                  display: 'inline-flex', alignItems: 'center', gap: 10,
                  padding: '14px 28px',
                  background: 'white', color: '#0a0a14',
                  fontWeight: 700, fontSize: 15, borderRadius: 100,
                  border: 'none', cursor: 'pointer',
                  transition: 'all 0.25s ease'
                }}
                  onMouseOver={e => { e.currentTarget.style.background = '#a78bfa'; e.currentTarget.style.color = 'white'; }}
                  onMouseOut={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#0a0a14'; }}
                >
                  <MapPin size={16} />
                  Find a Kiosk
                </button>
                <button style={{
                  display: 'inline-flex', alignItems: 'center', gap: 10,
                  padding: '14px 28px',
                  background: 'transparent', color: 'rgba(255,255,255,0.7)',
                  fontWeight: 500, fontSize: 15, borderRadius: 100,
                  border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer',
                  transition: 'all 0.25s ease'
                }}
                  onMouseOver={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'; e.currentTarget.style.color = 'white'; }}
                  onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
                >
                  Learn More <ArrowRight size={16} />
                </button>
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
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                style={{
                  padding: '36px 32px',
                  borderRight: i < stats.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none'
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

      {/* ── Mission ── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '120px 40px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>

            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
            >
              <p style={{ fontSize: 12, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 20 }}>
                Our Mission
              </p>
              <h2 style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: 'clamp(36px, 4vw, 54px)',
                lineHeight: 1.15,
                letterSpacing: '-0.025em',
                marginBottom: 28
              }}>
                Bridging the gap between{' '}
                <em style={{ color: 'rgba(255,255,255,0.4)' }}>your phone</em>{' '}
                and paper.
              </h2>
              <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, marginBottom: 36, fontWeight: 300 }}>
                At <strong style={{ color: 'white', fontWeight: 600 }}>Printer Project</strong>, we noticed a critical gap — the physical document. Whether it&apos;s an admit card, a contract, or a creative portfolio, getting something on paper shouldn&apos;t require a whole expedition.
              </p>

              <div className="glass-card" style={{ padding: 28, borderRadius: 16 }}>
                <div style={{ fontSize: 13, color: '#a78bfa', marginBottom: 12, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  2027 Goal
                </div>
                <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, fontStyle: 'italic' }}>
                  &ldquo;Deploy 500+ Smart Kiosks across Bangladesh, creating a seamless cloud-to-paper experience for every citizen.&rdquo;
                </p>
              </div>
            </motion.div>

            {/* Visual block */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
              style={{ position: 'relative' }}
            >
              <div className="glass-card" style={{
                borderRadius: 32,
                padding: 60,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                aspectRatio: '1',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {/* Inner glow */}
                <div aria-hidden style={{
                  position: 'absolute', inset: 0,
                  background: 'radial-gradient(circle at 50% 50%, rgba(139,92,246,0.15), transparent 70%)',
                  pointerEvents: 'none'
                }} />

                {/* Rotating ring */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  style={{
                    position: 'absolute',
                    width: '80%', height: '80%',
                    border: '1px dashed rgba(167,139,250,0.2)',
                    borderRadius: '50%'
                  }}
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                  style={{
                    position: 'absolute',
                    width: '60%', height: '60%',
                    border: '1px dashed rgba(96,165,250,0.15)',
                    borderRadius: '50%'
                  }}
                />

                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ position: 'relative', zIndex: 2 }}
                >
                  <Printer size={80} color="rgba(167,139,250,0.8)" strokeWidth={1.2} />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
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
            style={{ marginBottom: 72, maxWidth: 560 }}
          >
            <p style={{ fontSize: 12, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 16 }}>
              Why Choose Us
            </p>
            <h2 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 'clamp(32px, 4vw, 48px)',
              lineHeight: 1.15,
              letterSpacing: '-0.025em'
            }}>
              Built for the modern Dhaka.
            </h2>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {features.map((feature, i) => (
              <motion.div
                key={i}
                className="glass-card hover-lift"
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true }}
                style={{
                  borderRadius: 24, padding: 36,
                  position: 'relative', overflow: 'hidden'
                }}
              >
                {/* Accent glow top */}
                <div aria-hidden style={{
                  position: 'absolute', top: -30, right: -30,
                  width: 120, height: 120,
                  background: `radial-gradient(circle, ${feature.accent}20, transparent 70%)`,
                  pointerEvents: 'none'
                }} />

                <div style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: 44, height: 44, borderRadius: 12,
                  background: `${feature.accent}18`,
                  border: `1px solid ${feature.accent}30`,
                  color: feature.accent,
                  marginBottom: 24
                }}>
                  {feature.icon}
                </div>

                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, letterSpacing: '-0.01em' }}>
                  {feature.title}
                </h3>
                <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', lineHeight: 1.75, fontWeight: 300 }}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tech stack ── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '80px 40px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 32 }}>
            Powered by modern technology
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px 36px' }}>
            {['Next.js 16', 'Tailwind v4', 'SSLCommerz', 'Framer Motion', 'TypeScript'].map((tech, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: i * 0.08 }}
                viewport={{ once: true }}
                style={{
                  fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em',
                  color: 'rgba(255,255,255,0.2)',
                  transition: 'color 0.3s ease',
                  cursor: 'default'
                }}
                onMouseOver={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.85)'; }}
                onMouseOut={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.2)'; }}
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
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
                Ready to print something amazing?
              </h2>
              <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.45)', marginBottom: 48, fontWeight: 300 }}>
                Find your nearest kiosk and get started in seconds.
              </p>
              <button
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 12,
                  padding: '16px 36px',
                  background: 'white', color: '#0a0a14',
                  fontWeight: 700, fontSize: 16, borderRadius: 100,
                  border: 'none', cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.22,1,0.36,1)',
                  boxShadow: '0 0 40px rgba(167,139,250,0.3)'
                }}
                onMouseOver={e => {
                  e.currentTarget.style.background = '#a78bfa';
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.transform = 'scale(1.04)';
                  e.currentTarget.style.boxShadow = '0 0 60px rgba(167,139,250,0.6)';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.color = '#0a0a14';
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 0 40px rgba(167,139,250,0.3)';
                }}
              >
                <MapPin size={18} />
                Find a Kiosk Nearby
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;