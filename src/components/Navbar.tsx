'use client';

import Link from "next/link";
import { Printer } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="bg-[#468432] text-white py-5 px-6 sticky top-0 z-50 shadow-lg w-full">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-all hover:scale-105 active:scale-95">
          <Printer size={32} className="text-[#9AD872]" />
          <span className="text-2xl font-black font-outfit tracking-tighter uppercase">
            PrintKiosk
          </span>
        </Link>

        <div className="flex items-center gap-8 text-sm font-bold uppercase tracking-widest">
          <Link href="/" className="hover:text-[#9AD872] transition-colors">Home</Link>
          <Link href="/track" className="hover:text-[#9AD872] transition-colors">Track Order</Link>
        </div>
      </div>
    </nav>
  );
}
