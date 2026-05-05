export default function Footer() {
  return (
    <footer className="bg-[#468432] text-white py-8 px-6 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <h3 className="text-xl font-bold font-outfit text-white mb-1">PrintKiosk</h3>
          <p className="text-[#9AD872] text-sm font-medium">Smart Printing Solutions</p>
        </div>
        
        <div className="text-sm text-white/80 text-center">
          © {new Date().getFullYear()} PrintKiosk. All rights reserved.
          <p className="mt-1">pb-safe padding applied for mobile devices</p>
        </div>

        <div className="flex gap-4 text-sm font-semibold">
          <span className="text-[#9AD872]">Support:</span>
          <a href="tel:+880123456789" className="hover:underline">+880 1234 56789</a>
        </div>
      </div>
      <div className="pb-[env(safe-area-inset-bottom)]" />
    </footer>
  );
}
