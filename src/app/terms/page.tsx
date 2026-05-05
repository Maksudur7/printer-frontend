'use client';

import React from 'react';
import { motion } from 'framer-motion';

const stagger = {
  animate: { transition: { staggerChildren: 0.12 } }
};

const fadeUp = {
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
};

export default function TermsPage() {
  const sections = [
    { title: '1. Acceptance of Terms', content: 'By accessing and using the PrintEZ service, you agree to be bound by these Terms of Service and all applicable laws and regulations.' },
    { title: '2. User Privacy', content: 'We take your privacy seriously. Uploaded documents are encrypted and automatically deleted from our servers within 24 hours of printing.' },
    { title: '3. Payment & Pricing', content: 'All payments are final. We use SSLCommerz for secure transactions. Prices are subject to change based on location and paper/ink costs.' },
    { title: '4. Service Availability', content: 'While we strive for 24/7 uptime, kiosk availability depends on the physical location and maintenance status. Status is shown in real-time on our platform.' },
    { title: '5. Prohibited Use', content: 'Users are prohibited from printing illegal, obscene, or copyright-infringing materials. We reserve the right to suspend access for violations.' },
    { title: '6. Limitation of Liability', content: 'PrintEZ is not responsible for any errors in the original document or mechanical failures at the kiosk level beyond providing a refund or reprint.' },
  ];

  return (
    <div className="min-h-screen text-white bg-[#06060e] py-[160px] px-10 relative overflow-hidden">
      {/* Ambient Grid Background */}
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

      <div className="max-w-[1200px] mx-auto relative z-10">
        <motion.div 
          variants={stagger}
          initial="initial"
          animate="animate"
          className="mb-20 text-center"
        >
          <motion.div variants={fadeUp} className="mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#a78bfa1f] border border-[#a78bfa4d] text-[13px] text-[#c4b5fd] tracking-wider">
              <span className="glow-dot" />
              Legal Framework
            </span>
          </motion.div>

          <motion.h1 
            variants={fadeUp}
            className="font-serif-display text-[clamp(52px,8vw,96px)] leading-none tracking-[-0.03em] mb-10"
          >
            <span className="gradient-text">Trust & Policy</span>
          </motion.h1>

          <motion.p 
            variants={fadeUp}
            className="text-white/20 uppercase tracking-[0.3em] text-[10px] font-black"
          >
            Document Version 4.1 — May 2024
          </motion.p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="glass-card p-12 md:p-20 rounded-[48px] border border-white/10 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />

          <div className="space-y-16 relative z-10">
            {sections.map((s, i) => (
              <div key={s.title} className="group">
                <div className="flex items-start gap-8">
                  <span className="text-[#a78bfa66] font-serif-display text-2xl mt-1 select-none">0{i+1}</span>
                  <div>
                    <h3 className="text-[24px] font-bold text-white mb-5 group-hover:text-[#a78bfa] transition-colors">{s.title.split('. ')[1]}</h3>
                    <p className="text-white/40 leading-relaxed text-[17px] font-light">{s.content}</p>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="pt-16 border-t border-white/5">
              <div className="p-10 rounded-[32px] bg-white/[0.02] border border-white/5">
                <h3 className="text-2xl font-bold text-white mb-4">Inquiries</h3>
                <p className="text-white/40 leading-relaxed text-[16px] font-light mb-8">
                  For clarifications regarding our digital protocols or data handling, please contact our transparency office.
                </p>
                <a 
                  href="mailto:legal@printez.com" 
                  className="inline-flex items-center gap-3 text-[#a78bfa] font-bold hover:text-white transition-all group"
                >
                  legal@printez.com
                  <div className="w-8 h-8 rounded-full border border-[#a78bfa33] flex items-center justify-center group-hover:border-white transition-colors">
                    <span className="text-sm">→</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mt-20 text-center text-white/20 text-[10px] tracking-[0.3em] font-black">
          © 2024 PRINTEZ TECHNOLOGIES — ALL RIGHTS RESERVED
        </div>
      </div>
    </div>
  );
}
