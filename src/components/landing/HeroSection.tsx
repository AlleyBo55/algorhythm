'use client';

import { memo, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';

interface HeroSectionProps {
  mounted: boolean;
}

export const HeroSection = memo(function HeroSection({ mounted }: HeroSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20 overflow-hidden">
      <GradientOverlays />
      <HeroContent mounted={mounted} isInView={isInView} />
      <ScrollIndicator mounted={mounted} />
    </section>
  );
});

const GradientOverlays = memo(function GradientOverlays() {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#030303]/20 to-[#030303] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#030303_70%)] pointer-events-none" />
    </>
  );
});

const HeroContent = memo(function HeroContent({ mounted, isInView }: { mounted: boolean; isInView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative z-10 text-center max-w-5xl mx-auto"
    >
      <StatusBadge mounted={mounted} />
      <Headline mounted={mounted} />
      <Subheadline mounted={mounted} />
      <CTAButtons mounted={mounted} />
      <QuickStats mounted={mounted} />
    </motion.div>
  );
});

const StatusBadge = memo(function StatusBadge({ mounted }: { mounted: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={mounted ? { opacity: 1, scale: 1 } : {}}
      transition={{ delay: 0.3, duration: 0.6 }}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8"
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
      </span>
      <span className="text-sm text-zinc-400 font-medium tracking-wide">Trusted by 10,000+ producers worldwide</span>
    </motion.div>
  );
});

const Headline = memo(function Headline({ mounted }: { mounted: boolean }) {
  return (
    <motion.h1
      initial={{ opacity: 0, y: 30 }}
      animate={mounted ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.4, duration: 1 }}
      className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extralight tracking-tight text-white mb-8 leading-[1.1]"
    >
      <span className="block">Write Code.</span>
      <span className="block mt-2">
        <span className="font-medium bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
          Create Music.
        </span>
      </span>
      <span className="block mt-2">Perform Live.</span>
    </motion.h1>
  );
});


const Subheadline = memo(function Subheadline({ mounted }: { mounted: boolean }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={mounted ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.6, duration: 0.8 }}
      className="text-xl sm:text-2xl text-zinc-400 font-light max-w-2xl mx-auto mb-12 leading-relaxed"
    >
      The professional live-coding DAW for DJs, producers, and audio engineers.
      <span className="text-zinc-500"> Real-time synthesis. Zero latency. Infinite possibilities.</span>
    </motion.p>
  );
});

const CTAButtons = memo(function CTAButtons({ mounted }: { mounted: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={mounted ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.8, duration: 0.8 }}
      className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
    >
      <Link href="/studio" className="group relative">
        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-500 opacity-70 blur-lg group-hover:opacity-100 transition-all duration-500" />
        <div className="relative flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 text-black font-semibold text-lg shadow-2xl shadow-emerald-500/25 group-hover:shadow-emerald-500/40 transition-all duration-300 group-active:scale-95">
          <span>Start Creating — Free</span>
          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </Link>

      <Link href="#demo" className="group flex items-center gap-3 px-8 py-4 rounded-full border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white font-medium transition-all duration-300 hover:bg-white/5">
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z" />
        </svg>
        <span>Watch Demo</span>
      </Link>
    </motion.div>
  );
});

const STATS = [
  { value: '50+', label: 'Genre Templates' },
  { value: '<1ms', label: 'Latency' },
  { value: '100+', label: 'DSP Effects' },
  { value: '24/7', label: 'Live Support' },
];

const QuickStats = memo(function QuickStats({ mounted }: { mounted: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={mounted ? { opacity: 1 } : {}}
      transition={{ delay: 1, duration: 0.8 }}
      className="flex flex-wrap justify-center gap-8 sm:gap-12"
    >
      {STATS.map((stat) => (
        <div key={stat.label} className="text-center">
          <div className="text-2xl sm:text-3xl font-semibold text-white">{stat.value}</div>
          <div className="text-sm text-zinc-500">{stat.label}</div>
        </div>
      ))}
    </motion.div>
  );
});

const ScrollIndicator = memo(function ScrollIndicator({ mounted }: { mounted: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={mounted ? { opacity: 1 } : {}}
      transition={{ delay: 1.5, duration: 1 }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2"
    >
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="flex flex-col items-center gap-2 text-zinc-600"
      >
        <span className="text-xs tracking-widest uppercase">Explore</span>
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </motion.div>
    </motion.div>
  );
});
