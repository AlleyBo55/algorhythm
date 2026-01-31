'use client';

import { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import type { SectionTheme } from '@/hooks/useLandingPage';

interface NavigationProps {
  mounted: boolean;
  theme: SectionTheme;
  goToSection: (index: number) => void;
}

export const Navigation = memo(function Navigation({ mounted, theme, goToSection }: NavigationProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={mounted ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50"
        style={{ backgroundColor: `${theme.bg}95` }}
      >
        <div className="backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <Logo theme={theme} goToSection={goToSection} />
            <NavLinks theme={theme} goToSection={goToSection} />
            <div className="flex items-center gap-3">
              <NavCTA theme={theme} />
              <MobileMenuButton open={mobileOpen} setOpen={setMobileOpen} theme={theme} />
            </div>
          </div>
        </div>
      </motion.nav>

      <MobileMenu open={mobileOpen} setOpen={setMobileOpen} theme={theme} goToSection={goToSection} />
    </>
  );
});

const Logo = memo(function Logo({ theme, goToSection }: { theme: SectionTheme; goToSection: (index: number) => void }) {
  return (
    <button onClick={() => goToSection(0)} className="flex items-center gap-2.5 group">
      <motion.div 
        className="relative w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform"
        animate={{ backgroundColor: theme.primary }}
        transition={{ duration: 0.5 }}
      >
        <WaveformIcon theme={theme} />
      </motion.div>
      <div className="flex flex-col text-left">
        <span className="text-lg font-bold tracking-tight" style={{ color: theme.text }}>
          AlgoRhythm
        </span>
        <span className="text-[10px] tracking-widest uppercase -mt-0.5" style={{ color: theme.textMuted }}>
          Code × Sound
        </span>
      </div>
    </button>
  );
});

const WaveformIcon = memo(function WaveformIcon({ theme }: { theme: SectionTheme }) {
  return (
    <svg className="w-5 h-5" style={{ color: theme.bg }} viewBox="0 0 24 24" fill="currentColor">
      <rect x="2" y="10" width="2" height="4" rx="1" />
      <rect x="6" y="7" width="2" height="10" rx="1" />
      <rect x="10" y="4" width="2" height="16" rx="1" />
      <rect x="14" y="8" width="2" height="8" rx="1" />
      <rect x="18" y="6" width="2" height="12" rx="1" />
      <rect x="22" y="9" width="2" height="6" rx="1" />
    </svg>
  );
});

const NavLinks = memo(function NavLinks({ theme, goToSection }: { theme: SectionTheme; goToSection: (index: number) => void }) {
  const links = [
    { label: 'Code', section: 1 },
    { label: 'Features', section: 2 },
    { label: 'Docs', href: '/docs' },
  ];

  return (
    <div className="hidden md:flex items-center gap-1">
      {links.map((item) => (
        item.href ? (
          <Link
            key={item.label}
            href={item.href}
            className="px-4 py-2 text-sm transition-colors rounded-lg hover:opacity-80"
            style={{ color: theme.textMuted }}
          >
            {item.label}
          </Link>
        ) : (
          <button
            key={item.label}
            onClick={() => goToSection(item.section!)}
            className="px-4 py-2 text-sm transition-colors rounded-lg hover:opacity-80"
            style={{ color: theme.textMuted }}
          >
            {item.label}
          </button>
        )
      ))}
    </div>
  );
});

const NavCTA = memo(function NavCTA({ theme }: { theme: SectionTheme }) {
  return (
    <div className="hidden sm:flex items-center gap-3">
      <Link
        href="/studio"
        className="group px-5 py-2.5 rounded-full transition-transform hover:scale-105"
        style={{ backgroundColor: theme.primary }}
      >
        <span className="text-sm font-semibold flex items-center gap-2" style={{ color: theme.bg }}>
          Open Studio
          <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </span>
      </Link>
    </div>
  );
});

const MobileMenuButton = memo(function MobileMenuButton({ 
  open, 
  setOpen,
  theme,
}: { 
  open: boolean; 
  setOpen: (open: boolean) => void;
  theme: SectionTheme;
}) {
  return (
    <button
      onClick={() => setOpen(!open)}
      className="md:hidden p-2 rounded-lg transition-colors"
      style={{ color: theme.textMuted }}
      aria-label="Toggle menu"
    >
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        {open ? (
          <path d="M6 18L18 6M6 6l12 12" />
        ) : (
          <path d="M4 6h16M4 12h16M4 18h16" />
        )}
      </svg>
    </button>
  );
});

const MobileMenu = memo(function MobileMenu({ 
  open, 
  setOpen,
  theme,
  goToSection,
}: { 
  open: boolean; 
  setOpen: (open: boolean) => void;
  theme: SectionTheme;
  goToSection: (index: number) => void;
}) {
  const links = [
    { label: 'Code', section: 1 },
    { label: 'Features', section: 2 },
    { label: 'Docs', href: '/docs' },
  ];

  const handleClick = (section?: number) => {
    if (section !== undefined) {
      goToSection(section);
    }
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="fixed inset-x-0 top-[72px] z-40 md:hidden"
        >
          <div 
            className="mx-4 p-4 rounded-2xl"
            style={{ 
              backgroundColor: theme.bg, 
              border: `1px solid ${theme.primary}30`,
            }}
          >
            <div className="flex flex-col gap-2">
              {links.map((item) => (
                item.href ? (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="px-4 py-3 rounded-xl transition-colors"
                    style={{ color: theme.text }}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <button
                    key={item.label}
                    onClick={() => handleClick(item.section)}
                    className="px-4 py-3 rounded-xl transition-colors text-left"
                    style={{ color: theme.text }}
                  >
                    {item.label}
                  </button>
                )
              ))}
              <div className="h-px my-2" style={{ backgroundColor: `${theme.primary}30` }} />
              <Link
                href="/studio"
                onClick={() => setOpen(false)}
                className="px-4 py-3 text-center rounded-xl font-semibold"
                style={{ backgroundColor: theme.primary, color: theme.bg }}
              >
                Open Studio
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});
