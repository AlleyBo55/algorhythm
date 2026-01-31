'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useNavigation } from '@/hooks/useLandingPage';

interface NavigationProps {
  mounted: boolean;
}

export const Navigation = memo(function Navigation({ mounted }: NavigationProps) {
  const { scrolled } = useNavigation();

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={mounted ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#030303]/80 backdrop-blur-xl border-b border-white/5' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Logo />
        <NavLinks />
        <NavCTA />
      </div>
    </motion.nav>
  );
});

const Logo = memo(function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3 group">
      <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 p-[1.5px]">
        <div className="w-full h-full rounded-[10px] bg-[#030303] flex items-center justify-center">
          <svg className="w-5 h-5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" fill="currentColor" stroke="none" />
            <circle cx="18" cy="16" r="3" fill="currentColor" stroke="none" />
          </svg>
        </div>
      </div>
      <span className="text-xl font-light text-white tracking-tight">
        Algo<span className="font-semibold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Rhythm</span>
      </span>
    </Link>
  );
});

const NavLinks = memo(function NavLinks() {
  const links = ['Features', 'Pricing', 'Docs', 'Community'];

  return (
    <div className="hidden md:flex items-center gap-8">
      {links.map((item) => (
        <Link
          key={item}
          href={item === 'Docs' ? '/docs' : `#${item.toLowerCase()}`}
          className="text-sm text-zinc-400 hover:text-white transition-colors duration-200"
        >
          {item}
        </Link>
      ))}
    </div>
  );
});

const NavCTA = memo(function NavCTA() {
  return (
    <div className="flex items-center gap-4">
      <Link href="/studio" className="hidden sm:block text-sm text-zinc-400 hover:text-white transition-colors">
        Sign In
      </Link>
      <Link
        href="/studio"
        className="px-5 py-2.5 rounded-full bg-white text-black text-sm font-medium hover:bg-zinc-200 transition-colors"
      >
        Launch Studio
      </Link>
    </div>
  );
});
