'use client';

import { memo, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for learning and experimenting',
    features: ['10 genre templates', 'Basic DSP effects', 'Community support', 'Export to MP3', '1 project at a time'],
    cta: 'Get Started',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$19',
    period: '/month',
    description: 'For serious producers and performers',
    features: ['All 50+ templates', 'Full DSP suite', 'MIDI controller support', 'Export to WAV/FLAC', 'Unlimited projects', 'Priority support', 'Streaming integration'],
    cta: 'Start Free Trial',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For studios and organizations',
    features: ['Everything in Pro', 'Custom templates', 'Dedicated support', 'SLA guarantee', 'Team management', 'API access', 'White-label option'],
    cta: 'Contact Sales',
    highlighted: false,
  },
];

export const PricingSection = memo(function PricingSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} id="pricing" className="relative py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <SectionHeader isInView={isInView} />
        <PricingGrid isInView={isInView} />
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
      <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-medium mb-6">
        Pricing
      </span>
      <h2 className="text-4xl sm:text-5xl font-extralight text-white mb-6">
        Simple, <span className="font-medium text-emerald-400">transparent</span> pricing
      </h2>
      <p className="text-xl text-zinc-500 max-w-2xl mx-auto">
        Start free, upgrade when you're ready. No hidden fees. Cancel anytime.
      </p>
    </motion.div>
  );
});

const PricingGrid = memo(function PricingGrid({ isInView }: { isInView: boolean }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
      {PLANS.map((plan, index) => (
        <motion.div
          key={plan.name}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: index * 0.1 }}
        >
          <PricingCard {...plan} />
        </motion.div>
      ))}
    </div>
  );
});

interface PricingCardProps {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  highlighted: boolean;
}

const PricingCard = memo(function PricingCard({ name, price, period, description, features, cta, highlighted }: PricingCardProps) {
  return (
    <div className={`relative h-full ${highlighted ? 'lg:-mt-4 lg:mb-4' : ''}`}>
      {highlighted && (
        <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 opacity-50 blur-lg" />
      )}
      
      <div className={`relative h-full p-8 rounded-2xl border transition-all duration-300 ${
        highlighted ? 'bg-zinc-900 border-emerald-500/50' : 'bg-zinc-900/30 border-zinc-800/50 hover:border-zinc-700/50'
      }`}>
        {highlighted && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-black text-sm font-semibold">
            Most Popular
          </div>
        )}
        
        <div className="mb-6">
          <h3 className="text-xl font-medium text-white mb-2">{name}</h3>
          <p className="text-sm text-zinc-500">{description}</p>
        </div>
        
        <div className="mb-8">
          <span className="text-4xl font-semibold text-white">{price}</span>
          <span className="text-zinc-500">{period}</span>
        </div>
        
        <ul className="space-y-3 mb-8">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-3 text-sm text-zinc-300">
              <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 13l4 4L19 7" />
              </svg>
              {feature}
            </li>
          ))}
        </ul>
        
        <Link
          href="/studio"
          className={`block w-full py-3 rounded-full text-center font-medium transition-all duration-300 ${
            highlighted
              ? 'bg-gradient-to-r from-emerald-500 to-emerald-400 text-black hover:shadow-lg hover:shadow-emerald-500/25'
              : 'bg-white/5 text-white hover:bg-white/10 border border-zinc-700'
          }`}
        >
          {cta}
        </Link>
      </div>
    </div>
  );
});
