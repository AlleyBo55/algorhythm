'use client';

import { memo, useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { WelcomeScene } from './WelcomeScene';

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen = memo(function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const [mounted, setMounted] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-[#030303] overflow-hidden">
      {/* WebGL Background */}
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 0, 6], fov: 50 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        >
          <Suspense fallback={null}>
            <WelcomeScene hovered={hovered} />
          </Suspense>
        </Canvas>
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-[#030303]/50 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#030303]/80 via-transparent to-[#030303]/80 pointer-events-none" />

      {/* Content */}
      <div className={`relative z-10 h-full flex flex-col items-center justify-center transition-all duration-1000 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
        <div className="w-full max-w-lg px-8">
          {/* Logo */}
          <div className={`flex justify-center mb-16 transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="relative group">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-emerald-500/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-400 via-emerald-500 to-cyan-500 p-[2px] shadow-2xl shadow-emerald-500/25">
                <div className="w-full h-full rounded-[14px] bg-[#030303] flex items-center justify-center">
                  <svg className="w-12 h-12 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18V5l12-2v13" />
                    <circle cx="6" cy="18" r="3" fill="currentColor" stroke="none" />
                    <circle cx="18" cy="16" r="3" fill="currentColor" stroke="none" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Title */}
          <div className={`text-center mb-16 transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <h1 className="text-6xl font-extralight tracking-tight text-white mb-4">
              Algo<span className="font-normal bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Rhythm</span>
            </h1>
            <p className="text-lg text-zinc-500 font-light tracking-wide">Live coding meets DJ performance</p>
          </div>

          {/* CTA Button */}
          <div className={`flex justify-center mb-12 transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <button
              onClick={onStart}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              className="group relative"
            >
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 opacity-70 blur-lg group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-center gap-3 px-10 py-4 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 text-black font-semibold text-lg shadow-xl shadow-emerald-500/30 group-hover:shadow-emerald-500/50 transition-all duration-300 group-active:scale-95">
                <span>Launch Studio</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          </div>

          {/* Feature Tags */}
          <div className={`flex flex-wrap justify-center gap-3 transition-all duration-700 delay-400 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {['50+ Templates', 'Real-time DSP', 'MIDI Support', 'Live Coding'].map((feature) => (
              <div key={feature} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-zinc-400 backdrop-blur-sm">
                {feature}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});
