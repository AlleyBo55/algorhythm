'use client';

import { memo, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const LOGOS = [
  { name: 'Yamaha', icon: '🎹' },
  { name: 'Ableton', icon: '🎛️' },
  { name: 'Native Instruments', icon: '🎚️' },
  { name: 'Splice', icon: '🔊' },
  { name: 'Beatport', icon: '💿' },
  { name: 'SoundCloud', icon: '☁️' },
];

export const TrustedBySection = memo(function TrustedBySection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section ref={ref} className="relative py-16 px-6 border-y border-white/5">
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto"
      >
        <p className="text-center text-sm text-zinc-600 uppercase tracking-widest mb-8">
          Trusted by industry leaders
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12 md:gap-16">
          {LOGOS.map((logo, i) => (
            <motion.div
              key={logo.name}
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="flex items-center gap-2 text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              <span className="text-2xl">{logo.icon}</span>
              <span className="text-lg font-light tracking-wide">{logo.name}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
});
