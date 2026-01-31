'use client';

import { memo, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const TESTIMONIALS = [
  {
    quote: "AlgoRhythm changed how I approach live performances. The ability to code my drops in real-time is game-changing.",
    author: "Alan Walker",
    role: "DJ & Producer",
    avatar: "🎧",
    gradient: 'from-cyan-500 to-blue-500',
  },
  {
    quote: "Finally, a tool that bridges the gap between programming and music production. This is the future.",
    author: "deadmau5",
    role: "Electronic Artist",
    avatar: "🐭",
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    quote: "The latency is incredible. I can perform live sets with the same precision as my studio productions.",
    author: "Marshmello",
    role: "DJ & Producer",
    avatar: "🍡",
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    quote: "As someone who started in programming, AlgoRhythm feels like coming home. Code and music, finally united.",
    author: "Mike Shinoda",
    role: "Linkin Park",
    avatar: "🎤",
    gradient: 'from-violet-500 to-purple-500',
  },
];

export const TestimonialsSection = memo(function TestimonialsSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-32 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-950/5 to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto">
        <SectionHeader isInView={isInView} />
        <TestimonialsGrid isInView={isInView} />
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
      <span className="inline-block px-4 py-1.5 rounded-full bg-violet-500/10 text-violet-400 text-sm font-medium mb-6">
        Testimonials
      </span>
      <h2 className="text-4xl sm:text-5xl font-extralight text-white mb-6">
        Loved by <span className="font-medium text-violet-400">Artists</span>
      </h2>
      <p className="text-xl text-zinc-500 max-w-2xl mx-auto">
        Join thousands of producers and DJs who've transformed their creative workflow.
      </p>
    </motion.div>
  );
});

const TestimonialsGrid = memo(function TestimonialsGrid({ isInView }: { isInView: boolean }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {TESTIMONIALS.map((testimonial, index) => (
        <motion.div
          key={testimonial.author}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: index * 0.1 }}
        >
          <TestimonialCard {...testimonial} />
        </motion.div>
      ))}
    </div>
  );
});

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  avatar: string;
  gradient: string;
}

const TestimonialCard = memo(function TestimonialCard({ quote, author, role, avatar, gradient }: TestimonialCardProps) {
  return (
    <div className="group relative h-full">
      <div className={`absolute -inset-px rounded-2xl bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-10 blur-xl transition-all duration-500`} />
      <div className="relative h-full p-8 rounded-2xl bg-zinc-900/30 border border-zinc-800/50 backdrop-blur-sm hover:border-zinc-700/50 transition-all duration-300">
        <QuoteIcon />
        <p className="text-lg text-zinc-300 mb-8 leading-relaxed">{quote}</p>
        <AuthorInfo author={author} role={role} avatar={avatar} />
      </div>
    </div>
  );
});

const QuoteIcon = memo(function QuoteIcon() {
  return (
    <svg className="w-10 h-10 text-zinc-700 mb-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
    </svg>
  );
});

const AuthorInfo = memo(function AuthorInfo({ author, role, avatar }: { author: string; role: string; avatar: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-2xl">
        {avatar}
      </div>
      <div>
        <div className="font-medium text-white">{author}</div>
        <div className="text-sm text-zinc-500">{role}</div>
      </div>
    </div>
  );
});
