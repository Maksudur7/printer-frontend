'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight, Tag, Search } from 'lucide-react';
import Link from 'next/link';

const stagger = {
  animate: { transition: { staggerChildren: 0.12 } }
};

const fadeUp = {
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
};

export default function BlogPage() {
  const posts = [
    {
      id: 1,
      title: 'How to Print Documents Directly from Your Phone',
      excerpt: 'Learn the easiest way to use PrintEZ kiosks using just your mobile browser and bKash.',
      author: 'Maksudur Rahman',
      date: 'May 1, 2024',
      tag: 'Tutorial',
      img: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 2,
      title: 'Top 10 Kiosk Locations in Dhaka for Students',
      excerpt: 'We have mapped out the best and most accessible kiosks near major university campuses.',
      author: 'Sarah Ahmed',
      date: 'April 28, 2024',
      tag: 'Guide',
      img: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 3,
      title: 'PrintEZ Security: How We Keep Your Files Safe',
      excerpt: 'A deep dive into our 24-hour auto-deletion policy and end-to-end file encryption.',
      author: 'Tanvir Hasan',
      date: 'April 25, 2024',
      tag: 'Security',
      img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800'
    }
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
          className="mb-20"
        >
          <motion.div variants={fadeUp} className="mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#a78bfa1f] border border-[#a78bfa4d] text-[13px] text-[#c4b5fd] tracking-wider">
              <span className="glow-dot" />
              Intelligence & Insights
            </span>
          </motion.div>

          <motion.h1 
            variants={fadeUp}
            className="font-serif-display text-[clamp(52px,8vw,96px)] leading-none tracking-[-0.03em] mb-10"
          >
            <span className="gradient-text">The Printing</span>
            <br />
            <span className="text-white/35 italic">Revolution.</span>
          </motion.h1>

          <motion.p 
            variants={fadeUp}
            className="text-[clamp(17px,2vw,21px)] text-white/50 max-w-[600px] leading-relaxed font-light"
          >
            Exploring the intersection of physical media and digital efficiency. Stay updated with the latest from PrintEZ.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, i) => (
            <motion.article 
              key={post.id}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
              className="glass-card hover-lift flex flex-col rounded-[32px] overflow-hidden group"
            >
              <div className="h-64 overflow-hidden relative">
                <img 
                  src={post.img} 
                  alt={post.title} 
                  className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#06060e] via-transparent to-transparent opacity-80" />
                <div className="absolute top-6 left-6">
                  <span className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-[10px] font-bold uppercase tracking-widest text-white">
                    {post.tag}
                  </span>
                </div>
              </div>
              
              <div className="p-10 flex flex-col flex-1 relative">
                <div className="flex items-center gap-3 mb-6 text-[11px] text-white/30 uppercase tracking-[0.2em] font-bold">
                  <Calendar size={14} className="text-[#a78bfa]" /> {post.date}
                </div>
                
                <h3 className="text-[22px] font-bold text-white mb-5 group-hover:text-[#a78bfa] transition-colors leading-[1.3] tracking-tight">
                  {post.title}
                </h3>
                
                <p className="text-[15px] text-white/40 leading-relaxed mb-10 line-clamp-3 font-light">
                  {post.excerpt}
                </p>
                
                <div className="mt-auto pt-8 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-white/60 font-medium">
                    <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold text-[#a78bfa] group-hover:border-[#a78bfa33] transition-colors">
                      {post.author.charAt(0)}
                    </div>
                    <div>
                      <div className="text-white font-bold tracking-tight">{post.author}</div>
                      <div className="text-[10px] text-white/20 uppercase tracking-widest mt-0.5">Contributor</div>
                    </div>
                  </div>
                  
                  <Link href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 group-hover:text-[#a78bfa] group-hover:border-[#a78bfa40] group-hover:translate-x-1 transition-all duration-300">
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-[120px] p-16 rounded-[40px] glass-card border border-[#a78bfa40] relative overflow-hidden text-center"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#a78bfa1a] to-transparent pointer-events-none" />
          <h2 className="font-serif-display text-[clamp(32px,4vw,48px)] leading-none tracking-tight mb-6 relative z-10">Stay in the Loop</h2>
          <p className="text-white/45 mb-10 max-w-md mx-auto relative z-10 font-light">Get the latest guides and kiosk updates delivered to your inbox.</p>
          <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-4 relative z-10">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 bg-white/5 border border-white/10 rounded-full px-8 py-4 outline-none focus:border-[#a78bfa80] transition-all text-white"
            />
            <button className="bg-white text-[#0a0a14] font-black uppercase text-[13px] tracking-widest px-10 py-4 rounded-full hover:bg-[#a78bfa] hover:text-white transition-all">Join</button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
