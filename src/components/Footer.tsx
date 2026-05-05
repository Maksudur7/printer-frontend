'use client';

import { Printer, Phone, Mail, MapPin, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full text-white mt-auto pt-12 pb-safe border-t border-white/10" style={{ backgroundColor: 'var(--color-primary)' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <Printer size={18} className="text-white" />
              </div>
              <span
                className="text-2xl font-black tracking-tighter"
                style={{ fontFamily: 'var(--font-outfit)' }}
              >
                PrintKiosk
              </span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed max-w-sm">
              The next generation of self-service printing. Smart, fast, and secure document printing at your nearest kiosk station.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-white/40">Connect</h3>
            <ul className="space-y-3">
              <li>
                <a href="tel:+8801700000000" className="flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors">
                  <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center"><Phone size={12} /></div>
                  <span className="font-bold">+880 1700-000000</span>
                </a>
              </li>
              <li>
                <a href="mailto:support@printkiosk.com" className="flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors">
                  <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center"><Mail size={12} /></div>
                  <span className="font-bold">support@printkiosk.com</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-white/40">Location</h3>
            <div className="flex items-start gap-2 text-sm text-white/80">
              <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center mt-0.5"><MapPin size={12} /></div>
              <p className="font-bold leading-tight">Dhaka, Bangladesh<br /><span className="text-[10px] font-black opacity-50">Headquarters</span></p>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/80">
              <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center"><Globe size={12} /></div>
              <span className="font-bold">24/7 Availability</span>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 pb-8">
          <p className="text-[10px] font-black uppercase tracking-widest text-white/30">
            © {new Date().getFullYear()} PrintKiosk • Built for speed
          </p>
          <div className="flex items-center gap-6">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/30 cursor-pointer hover:text-white transition-colors">Terms</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-white/30 cursor-pointer hover:text-white transition-colors">Privacy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
