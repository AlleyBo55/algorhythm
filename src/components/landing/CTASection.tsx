'use client';

import { memo, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';

const TRUST_BADGES = [
  'No credit card required',
  'Free forever plan',
  'Cancel anytime',
];

export const CTASection = memo(function CTASection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-32 px-6 overflow-hidden">
      <BackgroundEffects />
      <CTAContent isInView={isInView} />
    </section>
  );
});

const BackgroundEffects = memo(function BackgroundEffects() {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-950/10 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.1)_0%,transparent_70%)] pointer-events-none" />
    </>
  );
});

const CTAContent = memo(function CTAContent({ isInView }: { isInView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
      className="max-w-4xl mx-auto text-center"
    >
      <h2 className="text-4xl sm:text-5xl md:text-6xl font-extralight text-white mb-6 leading-tight">
        Ready to <span className="font-medium bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">revolutionize</span> your sound?
      </h2>
      <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
        Join 10,000+ producers who've already discovered the future of music creation.
        Start free, no credit card required.
      </p>
      
      <CTAButtons />
      <TrustBadges />
    </motion.div>
  );
});

const CTAButtons = memo(function CTAButtons() {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
      <Link href="/studio" className="group relative">
        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-500 opacity-70 blur-lg group-hover:opacity-100 transition-all duration-500" />
        <div className="relative flex items-center gap-3 px-10 py-5 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 text-black font-semibold text-lg shadow-2xl shadow-emerald-500/25 group-hover:shadow-emerald-500/40 transition-all duration-300 group-active:scale-95">
          <span>Launch Studio Now</span>
          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </Link>
      
      <Link href="/docs" className="flex items-center gap-2 px-8 py-5 text-zinc-400 hover:text-white transition-colors">
        <span>Read the docs</span>
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
        </svg>
      </Link>
    </div>
  );
});

const TrustBadges = memo(function TrustBadges() {
  return (
    <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-zinc-600">
      {TRUST_BADGES.map((badge) => (
        <div key={badge} className="flex items-center gap-2">
          <svg className="w-4 h-4 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 13l4 4L19 7" />
          </svg>
          <span>{badge}</span>
        </div>
      ))}
    </div>
  );
});
