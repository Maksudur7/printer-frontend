export default function Footer() {
  return (
    <footer className="bg-[#468432] text-white py-12 px-6 mt-auto w-full border-t border-white/10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-center md:text-left">
          <h3 className="text-2xl font-black font-outfit text-white mb-1 uppercase tracking-tighter">PrintKiosk</h3>
          <p className="text-[#9AD872] text-xs font-black uppercase tracking-widest opacity-80">Smart Self-Service Printing</p>
        </div>
        
        <div className="text-sm text-white/60 text-center font-medium">
          © {new Date().getFullYear()} PrintKiosk. All rights reserved.
          <p className="mt-2 text-[10px] uppercase tracking-widest opacity-40">Designed for ultimate stability</p>
        </div>

        <div className="flex flex-col items-center md:items-end gap-1">
          <div className="flex gap-2 text-sm font-bold">
            <span className="text-[#9AD872]">Support:</span>
            <a href="tel:+880123456789" className="hover:text-[#9AD872] transition-colors font-outfit tracking-wide">+880 1234 56789</a>
          </div>
          <p className="text-[10px] text-white/30 uppercase font-black">24/7 Monitoring</p>
        </div>
      </div>
      <div className="pb-[env(safe-area-inset-bottom)]" />
    </footer>
  );
}
