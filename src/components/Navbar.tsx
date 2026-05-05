'use client';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { usePathname } from 'next/navigation';
import {
  Printer, Menu, X, Sun, Moon, ChevronDown,
  User, LayoutDashboard, LogOut, Settings,
  Sparkles, ArrowRight
} from 'lucide-react';

const publicLinks = [
  { href: '/', label: 'Home' },
  { href: '/explore', label: 'Explore' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

const authLinks = [
  { href: '/', label: 'Home' },
  { href: '/explore', label: 'Explore' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // Handle click outside for profile dropdown
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  const links = user ? authLinks : publicLinks;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-6 md:pt-8 pointer-events-none">
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={`w-full max-w-[1200px] h-[80px] flex items-center justify-between p-[5px] px-6 rounded-full pointer-events-auto transition-all duration-500 border ${scrolled
          ? 'bg-[#06060e]/80 backdrop-blur-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.4)] border-white/10'
          : 'bg-transparent border-transparent'
          }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#a78bfa] to-[#60a5fa] flex items-center justify-center shadow-[0_0_20px_rgba(167,139,250,0.3)] group-hover:rotate-12 group-hover:scale-105 transition-all duration-300">
            <Printer size={20} className="text-white" strokeWidth={2} />
          </div>
          <span className="text-[22px] font-serif-display tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70 group-hover:from-[#a78bfa] group-hover:to-[#60a5fa] transition-all">
            PrintEZ
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-10">
          {mounted && links.map(l => {
            const isActive = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`relative py-2 text-[14px] font-bold uppercase tracking-widest transition-all group overflow-hidden ${isActive ? 'text-white' : 'text-white/40 hover:text-white'
                  }`}
              >
                <span className="relative z-10">{l.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#a78bfa] rounded-full"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="w-10 h-10 hidden sm:flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/40 hover:text-[#a78bfa] hover:bg-white/10 transition-all cursor-pointer"
          >
            {mounted && (theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />)}
          </button>

          {mounted && user ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(v => !v)}
                className="flex items-center gap-3 p-[8px] md:pr-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#a78bfa] to-[#60a5fa] flex items-center justify-center text-xs font-black text-white shadow-lg">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden md:block text-[11px] font-black text-white/80 uppercase tracking-widest">
                  {user.name.split(' ')[0]}
                </span>
                <ChevronDown
                  size={14}
                  className={`text-white/20 transition-transform duration-300 hidden md:block ${profileOpen ? 'rotate-180' : ''}`}
                />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute right-0 mt-4 w-64 rounded-[24px] bg-[#0b0b14]/90 backdrop-blur-3xl border border-white/10 shadow-2xl p-3 z-[60]"
                  >
                    {/* User info */}
                    <div className="px-5 py-4 mb-2 bg-white/5 rounded-[16px] border border-white/5">
                      <p className="text-[13px] font-black text-white uppercase tracking-tight">{user.name}</p>
                      <p className="text-[11px] text-white/30 truncate mt-0.5">{user.email}</p>
                      <div className="mt-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#a78bfa]/10 text-[9px] w-fit text-[#a78bfa] font-black uppercase tracking-[0.2em] border border-[#a78bfa]/20">
                        <Sparkles size={10} />
                        {user.role}
                      </div>
                    </div>

                    {/* Menu items */}
                    <div className="space-y-1 p-1">
                      {[
                        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
                        { href: '/dashboard/profile', label: 'Profile', icon: User },
                        { href: '/dashboard/settings', label: 'Settings', icon: Settings },
                      ].map(item => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-4 px-4 py-[8px] rounded-[12px] text-xs font-bold text-white/40 hover:text-white hover:bg-white/5 transition-all"
                        >
                          <item.icon size={16} />
                          {item.label}
                        </Link>
                      ))}

                      <div className="h-px bg-white/5 my-2 mx-4" />

                      <button
                         onClick={() => { logout(); setProfileOpen(false); }}
                        className="w-full flex items-center gap-4 px-4 py-[8px] rounded-[12px] text-xs font-bold text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                      >
                        <LogOut size={16} />
                        Logout Session
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : mounted ? (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="hidden sm:block px-6 py-[8px] rounded-full text-[13px] font-bold text-white/40 hover:text-white transition-all uppercase tracking-widest"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="px-6 py-[8px] rounded-full bg-white text-[#0a0a14] text-[12px] font-black uppercase tracking-[0.05em] hover:bg-[#a78bfa] hover:text-white transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(167,139,250,0.4)]"
              >
                Join Network
              </Link>
            </div>
          ) : null}

          {/* Mobile hamburger */}
          <button
            aria-label="Toggle mobile menu"
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            onClick={() => setMobileOpen(v => !v)}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={mobileOpen ? 'close' : 'open'}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-md md:hidden pointer-events-auto"
              onClick={() => setMobileOpen(false)}
            />

            {/* Menu panel */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.97 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="absolute top-20 left-4 right-4 md:hidden bg-[#06060e]/95 backdrop-blur-[24px] rounded-[32px] p-6 shadow-2xl border border-white/10 z-[100] pointer-events-auto"
            >
              <div className="space-y-1">
                {mounted && links.map((l, i) => (
                  <motion.div
                    key={l.href}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                  >
                    <Link
                      href={l.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center justify-between px-6 py-4 rounded-2xl text-[17px] font-black tracking-tight transition-all ${pathname === l.href
                        ? 'bg-white/10 text-white'
                        : 'text-white/40 hover:text-white hover:bg-white/5'
                        }`}
                    >
                      {l.label}
                      <ArrowRight
                        size={16}
                        className={`transition-opacity ${pathname === l.href ? 'opacity-100 text-[#a78bfa]' : 'opacity-20'}`}
                      />
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-white/5 flex flex-col gap-3">
                {mounted && user ? (
                  <button
                    onClick={() => { logout(); setMobileOpen(false); }}
                    className="w-full py-4 rounded-full text-xs font-black text-red-400 bg-red-500/5 border border-red-500/10 hover:bg-red-500/10 transition-all uppercase tracking-widest cursor-pointer"
                  >
                    End Session
                  </button>
                ) : mounted ? (
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      href="/login"
                      onClick={() => setMobileOpen(false)}
                      className="py-4 rounded-full text-xs font-black text-center border border-white/10 text-white/40 hover:text-white hover:border-white/20 uppercase tracking-widest transition-all"
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMobileOpen(false)}
                      className="py-4 rounded-full text-[11px] font-black text-center bg-white text-[#0a0a14] hover:bg-[#a78bfa] hover:text-white uppercase tracking-widest transition-all"
                    >
                      Sign Up
                    </Link>
                  </div>
                ) : null}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}