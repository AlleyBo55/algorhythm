'use client';

import { memo, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import type { SectionTheme } from '@/hooks/useLandingPage';

interface NavigationProps {
  mounted: boolean;
  theme: SectionTheme;
  goToSection: (index: number) => void;
}

// Magnetic nav link
const MagneticNavLink = memo(function MagneticNavLink({ 
  children, 
  onClick,
  href,
}: { 
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
}) {
  const linkRef = useRef<HTMLDivElement | HTMLButtonElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = linkRef.current;
    if (!el) return;
    
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
  };

  const handleMouseLeave = () => {
    const el = linkRef.current;
    if (el) {
      el.style.transform = 'translate(0, 0)';
    }
  };

  const className = "relative text-sm text-white/50 hover:text-white transition-all duration-300 py-2 px-1 cursor-pointer";

  if (href) {
    return (
      <Link href={href}>
        <motion.div
          ref={linkRef as React.RefObject<HTMLDivElement>}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className={className}
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {children}
          <motion.div 
            className="absolute bottom-0 left-0 right-0 h-[1px] bg-white origin-left scale-x-0 group-hover:scale-x-100 transition-transform"
          />
        </motion.div>
      </Link>
    );
  }

  return (
    <motion.button
      ref={linkRef as React.RefObject<HTMLButtonElement>}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
    >
      {children}
    </motion.button>
  );
});

export const Navigation = memo(function Navigation({ mounted, theme, goToSection }: NavigationProps) {
  if (!mounted) return null;

  return (
    <motion.header
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="backdrop-blur-2xl bg-black/10 border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-5">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 sm:gap-4 group">
              <motion.div 
                className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center overflow-hidden"
                animate={{ backgroundColor: `${theme.primary}15` }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                {/* Animated gradient background */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    background: `linear-gradient(135deg, ${theme.primary}30 0%, ${theme.accent}20 100%)`,
                  }}
                />
                <svg className="w-4 h-4 sm:w-5 sm:h-5 relative" style={{ color: theme.primary }} viewBox="0 0 24 24" fill="currentColor">
                  <rect x="4" y="8" width="2" height="8" />
                  <rect x="8" y="5" width="2" height="14" />
                  <rect x="12" y="7" width="2" height="10" />
                  <rect x="16" y="4" width="2" height="16" />
                </svg>
              </motion.div>
              <motion.span 
                className="text-sm sm:text-base font-semibold text-white/70 group-hover:text-white transition-colors tracking-tight"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Algorhythm
              </motion.span>
            </Link>

            {/* Nav links - hidden on mobile */}
            <nav className="hidden md:flex items-center gap-10">
              {[
                { label: 'Code', section: 1 },
                { label: 'Features', section: 2 },
                { label: 'Docs', href: '/docs' },
              ].map((item) => (
                item.href ? (
                  <MagneticNavLink key={item.label} href={item.href}>
                    {item.label}
                  </MagneticNavLink>
                ) : (
                  <MagneticNavLink key={item.label} onClick={() => goToSection(item.section!)}>
                    {item.label}
                  </MagneticNavLink>
                )
              ))}
            </nav>

            {/* CTA */}
            <Link href="/studio" className="hidden sm:block">
              <motion.button
                className="group relative px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-semibold text-black overflow-hidden"
                animate={{ backgroundColor: theme.primary }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {/* Hover gradient */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.accent} 100%)`,
                  }}
                />
                <span className="relative flex items-center gap-2">
                  Open Studio
                  <motion.svg 
                    className="w-3 h-3 sm:w-4 sm:h-4" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2.5"
                    initial={{ x: 0 }}
                    whileHover={{ x: 3 }}
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </motion.svg>
                </span>
              </motion.button>
            </Link>

            {/* Mobile menu button */}
            <Link 
              href="/studio" 
              className="sm:hidden p-2 rounded-lg"
              style={{ backgroundColor: `${theme.primary}20` }}
            >
              <svg className="w-5 h-5" style={{ color: theme.primary }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </motion.header>
  );
});
