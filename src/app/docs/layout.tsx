'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const NAV_SECTIONS = [
  {
    title: 'Getting Started',
    items: [
      { title: 'Introduction', href: '/docs', icon: '◈' },
      { title: 'Core Concepts', href: '/docs/concepts', icon: '◇' },
    ]
  },
  {
    title: 'API Reference',
    items: [
      { title: 'DJ API', href: '/docs/api', icon: '▣' },
      { title: 'Instruments', href: '/docs/instruments', icon: '▤' },
      { title: 'Effects', href: '/docs/effects', icon: '▥' },
    ]
  },
  {
    title: 'Guides',
    items: [
      { title: 'Techniques', href: '/docs/techniques', icon: '▦' },
      { title: 'Examples', href: '/docs/examples', icon: '▧' },
    ]
  },
  {
    title: 'Advanced',
    items: [
      { title: 'MIDI Setup', href: '/docs/midi', icon: '▨' },
      { title: 'AI Assistant', href: '/docs/ai', icon: '▩' },
    ]
  }
];

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Subtle ambient glow - matching landing page */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-emerald-500/[0.03] rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-cyan-500/[0.03] rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <motion.header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/[0.06]' : ''
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <motion.div 
              className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
            >
              <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="currentColor">
                <rect x="4" y="8" width="2" height="8" />
                <rect x="8" y="5" width="2" height="14" />
                <rect x="12" y="7" width="2" height="10" />
                <rect x="16" y="4" width="2" height="16" />
              </svg>
            </motion.div>
            <div className="flex items-baseline gap-2">
              <span className="font-semibold text-white/90 tracking-tight text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Algorhythm
              </span>
              <span className="text-[10px] text-white/30 font-medium tracking-wider">DOCS</span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            <Link 
              href="/studio"
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 hover:bg-emerald-500/20 transition-all"
            >
              <span style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Open Studio</span>
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
              </svg>
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-14 left-0 right-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/[0.06] lg:hidden"
        >
          <nav className="p-4 max-h-[70vh] overflow-y-auto">
            {NAV_SECTIONS.map((section) => (
              <div key={section.title} className="mb-4">
                <h3 className="text-[10px] font-medium text-white/30 uppercase tracking-[0.15em] mb-2 px-2">
                  {section.title}
                </h3>
                <div className="space-y-0.5">
                  {section.items.map((item) => {
                    const active = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
                          active
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'text-white/50 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <span className="text-xs opacity-50">{item.icon}</span>
                        <span style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{item.title}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </motion.div>
      )}

      <div className="relative z-10 flex pt-14">
        {/* Sidebar */}
        <aside className="hidden lg:block w-56 shrink-0 sticky top-14 h-[calc(100vh-56px)] overflow-y-auto border-r border-white/[0.06]">
          <nav className="p-4 space-y-6">
            {NAV_SECTIONS.map((section) => (
              <div key={section.title}>
                <h3 className="text-[10px] font-medium text-white/30 uppercase tracking-[0.15em] mb-2 px-2">
                  {section.title}
                </h3>
                <div className="space-y-0.5">
                  {section.items.map((item) => {
                    const active = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`group flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
                          active
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'text-white/50 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <span className="text-xs opacity-50">{item.icon}</span>
                        <span style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{item.title}</span>
                        {active && (
                          <motion.div 
                            className="ml-auto w-1 h-1 rounded-full bg-emerald-400"
                            layoutId="activeIndicator"
                          />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
