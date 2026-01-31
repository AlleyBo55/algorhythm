'use client';

import { memo, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const FEATURES = [
  {
    icon: <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />,
    title: 'Live Coding Engine',
    description: 'Write JavaScript that generates music in real-time. Hot-reload without stopping playback.',
    gradient: 'from-emerald-500 to-cyan-500',
    tag: 'Core',
  },
  {
    icon: <path d="M9 19V6l12-2v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />,
    title: '50+ Genre Templates',
    description: 'From EDM drops to lo-fi beats. Professional templates crafted by Grammy-winning producers.',
    gradient: 'from-violet-500 to-fuchsia-500',
    tag: 'Templates',
  },
  {
    icon: <path d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />,
    title: 'Studio-Grade DSP',
    description: 'Professional effects: reverb, delay, compression, EQ. All controllable via code.',
    gradient: 'from-orange-500 to-red-500',
    tag: 'Effects',
  },
  {
    icon: <path d="M13 10V3L4 14h7v7l9-11h-7z" />,
    title: 'Sub-Millisecond Latency',
    description: 'Web Audio API with AudioWorklet processing. Professional-grade timing precision.',
    gradient: 'from-cyan-500 to-blue-500',
    tag: 'Performance',
  },
  {
    icon: <path d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />,
    title: 'Full MIDI Support',
    description: 'Connect any hardware controller. Map knobs, faders, and pads to any parameter.',
    gradient: 'from-pink-500 to-rose-500',
    tag: 'Hardware',
  },
  {
    icon: <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />,
    title: 'Stream Integration',
    description: 'Built-in OBS integration, Twitch chat commands, and overlay system.',
    gradient: 'from-emerald-500 to-teal-500',
    tag: 'Streaming',
  },
];

export const FeaturesSection = memo(function FeaturesSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} id="features" className="relative py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <SectionHeader isInView={isInView} />
        <FeaturesGrid isInView={isInView} />
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
      className="text-center mb-20"
    >
      <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-medium mb-6">
        Features
      </span>
      <h2 className="text-4xl sm:text-5xl md:text-6xl font-extralight text-white mb-6">
        Built for <span className="font-medium text-emerald-400">Professionals</span>
      </h2>
      <p className="text-xl text-zinc-500 max-w-2xl mx-auto">
        Every feature designed with input from touring DJs, Grammy-winning producers, and audio engineers.
      </p>
    </motion.div>
  );
});


const FeaturesGrid = memo(function FeaturesGrid({ isInView }: { isInView: boolean }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {FEATURES.map((feature, index) => (
        <motion.div
          key={feature.title}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: index * 0.1 }}
        >
          <FeatureCard {...feature} />
        </motion.div>
      ))}
    </div>
  );
});

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
  tag: string;
}

const FeatureCard = memo(function FeatureCard({ icon, title, description, gradient, tag }: FeatureCardProps) {
  return (
    <div className="group relative h-full">
      <div className={`absolute -inset-px rounded-2xl bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500`} />
      
      <div className="relative h-full p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 backdrop-blur-sm hover:border-zinc-700/50 transition-all duration-300">
        <div className="flex items-start justify-between mb-6">
          <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${gradient} bg-opacity-10 text-white`}>
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              {icon}
            </svg>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-white/5 text-xs text-zinc-500 font-medium">
            {tag}
          </span>
        </div>
        
        <h3 className="text-xl font-medium text-white mb-3">{title}</h3>
        <p className="text-zinc-400 leading-relaxed">{description}</p>
      </div>
    </div>
  );
});
