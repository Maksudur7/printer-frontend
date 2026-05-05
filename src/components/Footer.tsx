import Link from 'next/link';
import { Printer, Mail, Phone, MapPin, ArrowRight, Twitter, Facebook, Instagram, Github, Send } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative bg-[#06060e] pt-32 pb-16 border-t border-white/5 overflow-hidden">
      {/* Ambient background glow */}
      <div aria-hidden className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-purple-500/5 blur-[120px] rounded-full -z-10" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          {/* Brand & Newsletter */}
          <div className="lg:col-span-2 space-y-10">
            <div className="space-y-6">
              <Link href="/" className="flex items-center gap-4 group w-fit">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#a78bfa] to-[#60a5fa] flex items-center justify-center shadow-2xl group-hover:rotate-12 transition-transform duration-500">
                  <Printer size={28} className="text-white" />
                </div>
                <span className="text-3xl font-black tracking-tighter text-white group-hover:text-[#a78bfa] transition-colors">PrintEZ</span>
              </Link>
              <p className="text-xl text-white/40 leading-relaxed max-w-md font-light">
                Engineering the future of public infrastructure in Bangladesh. Fast, secure, and decentralized.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#a78bfa]">Stay Connected</h4>
              <form className="flex gap-2 max-w-sm">
                <div className="relative flex-1">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                  <input 
                    type="email" 
                    placeholder="Enter email" 
                    className="w-full bg-white/5 border border-white/10 rounded-full py-3.5 pl-12 pr-4 text-sm text-white placeholder:text-white/10 outline-none focus:border-[#a78bfa]/50 transition-all"
                  />
                </div>
                <button className="w-12 h-12 rounded-full bg-white text-[#0a0a14] flex items-center justify-center hover:bg-[#a78bfa] hover:text-white transition-all shadow-lg">
                  <Send size={18} />
                </button>
              </form>
            </div>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 gap-12 lg:col-span-2">
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-10">Ecosystem</h4>
              <ul className="space-y-4">
                {[
                  { href: '/', label: 'Global Home' },
                  { href: '/explore', label: 'Explore Network' },
                  { href: '/about', label: 'Company' },
                  { href: '/blog', label: 'Intelligence' },
                  { href: '/contact', label: 'Support' },
                ].map(l => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-sm text-white/40 hover:text-white transition-colors font-bold flex items-center gap-2 group">
                      {l.label}
                      <ArrowRight size={12} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-10">Contact Hub</h4>
              <div className="space-y-6">
                {[
                  { icon: Mail, text: 'support@printez.ai', href: 'mailto:support@printez.ai' },
                  { icon: Phone, text: '+880 1700-000000', href: 'tel:+8801700000000' },
                  { icon: MapPin, text: 'Gulshan, Dhaka', href: '#' },
                ].map(c => (
                  <a key={c.text} href={c.href} className="flex items-center gap-4 text-white/40 hover:text-white transition-all group">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-white/20 group-hover:text-[#a78bfa] group-hover:border-[#a78bfa]/30 transition-all">
                      <c.icon size={16} />
                    </div>
                    <span className="text-xs font-bold tracking-tight">{c.text}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.2em]">
              © {new Date().getFullYear()} PrintEZ Technologies
            </p>
            <div className="flex gap-8">
              <Link href="/terms" className="text-[10px] text-white/20 hover:text-white transition-colors font-black uppercase tracking-[0.2em]">Privacy</Link>
              <Link href="/terms" className="text-[10px] text-white/20 hover:text-white transition-colors font-black uppercase tracking-[0.2em]">Terms</Link>
            </div>
          </div>

          <div className="flex gap-4">
            {[
              { icon: Twitter, href: '#', label: 'Twitter' },
              { icon: Github, href: '#', label: 'GitHub' },
              { icon: Instagram, href: '#', label: 'Instagram' },
              { icon: Facebook, href: '#', label: 'Facebook' },
            ].map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label}
                className="w-11 h-11 flex items-center justify-center rounded-full bg-white/5 border border-white/5 text-white/20 hover:text-white hover:border-white/20 hover:bg-white/10 transition-all">
                <s.icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
