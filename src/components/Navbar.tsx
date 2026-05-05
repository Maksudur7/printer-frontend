'use client';

import Link from "next/link";
import { Printer } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="bg-[#468432] text-white py-4 px-6 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <Printer size={28} className="text-[#9AD872]" />
          <span className="text-xl font-bold font-outfit tracking-tight">
            PrintKiosk
          </span>
        </Link>

        <div className="flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="hover:text-[#9AD872] transition-colors">Home</Link>
          <Link href="/track" className="hover:text-[#9AD872] transition-colors">Track Order</Link>
        </div>
      </div>
    </nav>
  );
}
