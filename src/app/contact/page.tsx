'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, Phone, MapPin, Send, 
  MessageSquare, Clock, ArrowRight,
  Loader2, CheckCircle
} from 'lucide-react';

const stagger = {
  animate: { transition: { staggerChildren: 0.12 } }
};

const fadeUp = {
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
};

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen text-white bg-[#06060e] py-[160px] px-10 relative overflow-hidden">
      {/* Ambient Grid Background */}
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

      <div className="max-w-[1200px] mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
          {/* Contact Info */}
          <div className="lg:col-span-5 space-y-16">
            <motion.div 
              variants={stagger}
              initial="initial"
              animate="animate"
            >
              <motion.div variants={fadeUp} className="mb-8">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#a78bfa1f] border border-[#a78bfa4d] text-[13px] text-[#c4b5fd] tracking-wider">
                  <span className="glow-dot" />
                  Connectivity Hub
                </span>
              </motion.div>

              <motion.h1 
                variants={fadeUp}
                className="font-serif-display text-[clamp(52px,8vw,96px)] leading-none tracking-[-0.03em] mb-10"
              >
                <span className="gradient-text">Open a</span>
                <br />
                <span className="text-white/35 italic">Channel.</span>
              </motion.h1>

              <motion.p 
                variants={fadeUp}
                className="text-[clamp(17px,2vw,21px)] text-white/50 max-w-[420px] leading-relaxed font-light"
              >
                Our engineering and support teams are distributed globally to ensure 24/7 terminal uptime.
              </motion.p>
            </motion.div>

            <div className="grid gap-6">
              {[
                { icon: Mail, title: 'Encrypted Mail', detail: 'support@printez.ai', sub: '2-hour response objective' },
                { icon: MessageSquare, title: 'Direct Bridge', detail: '+880 1700-000000', sub: 'Available Sat-Thu' },
                { icon: MapPin, title: 'Physical Node', detail: 'Banani Hub, Dhaka', sub: 'Regional Headquarters' },
              ].map((item, i) => (
                <motion.div 
                  key={item.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i, duration: 0.7 }}
                  viewport={{ once: true }}
                  className="glass-card flex items-center gap-8 p-8 rounded-[32px] border border-white/5 hover-lift group"
                >
                  <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-white/20 group-hover:text-[#a78bfa] group-hover:border-[#a78bfa33] transition-all duration-500">
                    <item.icon size={28} />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-1">{item.title}</h4>
                    <p className="text-[22px] font-bold text-white tracking-tight">{item.detail}</p>
                    <p className="text-[12px] text-white/20 mt-1 font-medium">{item.sub}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
              className="p-10 rounded-[32px] bg-white/[0.02] border border-white/5 backdrop-blur-3xl"
            >
              <div className="flex items-center gap-4 mb-6">
                <Clock size={24} className="text-[#a78bfa]" />
                <h3 className="text-xl font-bold text-white">Service Latency</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/40 font-medium">Critical Support</span>
                  <span className="text-white font-bold tracking-tight">~ 45 mins</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full w-[85%] bg-gradient-to-r from-[#a78bfa] to-[#60a5fa]" />
                </div>
                <p className="text-[12px] text-white/20 leading-relaxed font-medium">
                  We prioritize terminal hardware failures and payment processing inquiries.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 32 }} 
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
            className="lg:col-span-7"
          >
            <div className="glass-card p-12 md:p-16 rounded-[48px] border border-white/10 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#a78bfa0d] to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              
              <h2 className="font-serif-display text-4xl text-white mb-12 relative z-10">Broadcast Message</h2>

              {success ? (
                <div className="py-24 text-center relative z-10">
                  <div className="w-24 h-24 rounded-full bg-[#34d3991a] border border-[#34d39933] flex items-center justify-center mx-auto mb-10">
                    <CheckCircle size={48} className="text-[#34d399]" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-6">Transmission Received</h3>
                  <p className="text-white/30 text-lg font-light mb-12 max-w-[320px] mx-auto">Your inquiry has been successfully injected into our support grid.</p>
                  <button 
                    onClick={() => setSuccess(false)}
                    className="px-12 py-5 rounded-full bg-white text-[#0a0a14] text-[13px] font-black uppercase tracking-widest hover:bg-[#a78bfa] hover:text-white transition-all shadow-2xl"
                  >
                    New Transmission
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] px-2">First Identification</label>
                      <input type="text" required placeholder="Full Name" 
                        className="w-full bg-white/5 border border-white/10 rounded-[20px] py-5 px-8 text-white placeholder:text-white/10 outline-none focus:border-[#a78bfa80] focus:bg-white/[0.08] transition-all font-medium"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] px-2">Digital Signature</label>
                      <input type="email" required placeholder="Email Address" 
                        className="w-full bg-white/5 border border-white/10 rounded-[20px] py-5 px-8 text-white placeholder:text-white/10 outline-none focus:border-[#a78bfa80] focus:bg-white/[0.08] transition-all font-medium"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] px-2">Subject Protocol</label>
                    <select className="w-full bg-white/5 border border-white/10 rounded-[20px] py-5 px-8 text-white outline-none focus:border-[#a78bfa80] focus:bg-white/[0.08] transition-all font-medium appearance-none cursor-pointer">
                      <option className="bg-[#0a0a14]">Technical Support</option>
                      <option className="bg-[#0a0a14]">Payment Inquiry</option>
                      <option className="bg-[#0a0a14]">Kiosk Partnership</option>
                      <option className="bg-[#0a0a14]">Other</option>
                    </select>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] px-2">Message Payload</label>
                    <textarea rows={6} required placeholder="Detail your inquiry..." 
                      className="w-full bg-white/5 border border-white/10 rounded-[24px] py-6 px-8 text-white placeholder:text-white/10 outline-none focus:border-[#a78bfa80] focus:bg-white/[0.08] transition-all font-medium resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-6 rounded-full bg-white text-[#0a0a14] font-black text-[13px] uppercase tracking-[0.3em] hover:bg-[#a78bfa] hover:text-white transition-all flex items-center justify-center gap-4 group"
                  >
                    {loading ? <Loader2 size={24} className="animate-spin" /> : <><Send size={18} className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-500" /> Transmit Message</>}
                  </button>
                </form>
              )}
            </div>

            <div className="mt-12 text-center">
              <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.4em]">
                Secure End-to-End Encrypted Communication Channel
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
