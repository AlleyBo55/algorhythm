'use client';

import { memo, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const TECH_STACK = [
  { name: 'Web Audio API', description: 'Native browser audio', icon: '🔊' },
  { name: 'AudioWorklet', description: 'Real-time DSP', icon: '⚡' },
  { name: 'Tone.js', description: 'Synthesis engine', icon: '🎹' },
  { name: 'WebGL', description: 'GPU visualizations', icon: '🎨' },
  { name: 'WebMIDI', description: 'Hardware support', icon: '🎛️' },
  { name: 'WebRTC', description: 'Low-latency streaming', icon: '📡' },
];

const PERFORMANCE_STATS = [
  { value: '< 1ms', label: 'Audio Latency', detail: 'AudioWorklet processing' },
  { value: '60 FPS', label: 'Visualizations', detail: 'WebGL accelerated' },
  { value: '44.1kHz', label: 'Sample Rate', detail: 'CD quality audio' },
  { value: '32-bit', label: 'Float Processing', detail: 'Studio precision' },
];

export const TechStackSection = memo(function TechStackSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <SectionHeader isInView={isInView} />
        <TechGrid isInView={isInView} />
        <PerformanceStats isInView={isInView} />
      </div>
    </section>
  );
});

const SectionHeader = memo(function SectionHeader({ isInView }: { isInView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
      className="text-center mb-16"
    >
      <span className="inline-block px-4 py-1.5 rounded-full bg-cyan-500/10 text-cyan-400 text-sm font-medium mb-6">
        Technology
      </span>
      <h2 className="text-4xl sm:text-5xl font-extralight text-white mb-6">
        Powered by <span className="font-medium text-cyan-400">Modern Web</span>
      </h2>
      <p className="text-xl text-zinc-500 max-w-2xl mx-auto">
        Built on cutting-edge web technologies. No plugins. No downloads. Just open your browser.
      </p>
    </motion.div>
  );
});

const TechGrid = memo(function TechGrid({ isInView }: { isInView: boolean }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {TECH_STACK.map((tech, index) => (
        <motion.div
          key={tech.name}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: index * 0.05 }}
          className="group p-6 rounded-xl bg-zinc-900/30 border border-zinc-800/50 hover:border-zinc-700/50 transition-all duration-300 text-center"
        >
          <div className="text-3xl mb-3">{tech.icon}</div>
          <div className="font-medium text-white text-sm mb-1">{tech.name}</div>
          <div className="text-xs text-zinc-500">{tech.description}</div>
        </motion.div>
      ))}
    </div>
  );
});

const PerformanceStats = memo(function PerformanceStats({ isInView }: { isInView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-zinc-900/50 to-zinc-800/30 border border-zinc-800/50"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {PERFORMANCE_STATS.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="text-3xl font-semibold text-white mb-1">{stat.value}</div>
            <div className="text-sm text-zinc-400 mb-1">{stat.label}</div>
            <div className="text-xs text-zinc-600">{stat.detail}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
});
