'use client';

import { memo, useState, useEffect, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { motion, AnimatePresence } from 'framer-motion';
import { WelcomeScene } from './WelcomeScene';

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen = memo(function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const [mounted, setMounted] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    // Simulate loading
    const interval = setInterval(() => {
      setLoadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setMounted(true), 300);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isMobile) return;
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isMobile]);

  // Keyboard handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && mounted) onStart();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mounted, onStart]);

  return (
    <div className="fixed inset-0 bg-[#030303] overflow-hidden">
      {/* Grain texture */}
      <div 
        className="absolute inset-0 z-50 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* 3D Scene */}
      {!isMobile && (
        <div className="absolute inset-0">
          <Canvas
            camera={{ position: [0, 0, 8], fov: 45 }}
            dpr={[1, 2]}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          >
            <Suspense fallback={null}>
              <WelcomeScene hovered={hovered} mousePosition={mousePosition} />
            </Suspense>
          </Canvas>
        </div>
      )}

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030303] via-transparent to-[#030303] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#030303_70%)] pointer-events-none" />
      
      {/* Animated accent lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 left-0 w-full h-px"
          style={{ background: 'linear-gradient(90deg, transparent, #10b981, transparent)' }}
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-full h-px"
          style={{ background: 'linear-gradient(90deg, transparent, #06b6d4, transparent)' }}
          animate={{ x: ['100%', '-100%'] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {/* Loading state */}
      <AnimatePresence>
        {!mounted && (
          <motion.div 
            className="absolute inset-0 z-40 flex items-center justify-center bg-[#030303]"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex flex-col items-center gap-8">
              {/* Loading logo */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative"
              >
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-400 p-[2px]">
                  <div className="w-full h-full rounded-[14px] bg-[#030303] flex items-center justify-center">
                    <motion.svg 
                      className="w-10 h-10 text-emerald-400" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="1.5"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                    >
                      <path d="M9 18V5l12-2v13" />
                      <circle cx="6" cy="18" r="3" fill="currentColor" stroke="none" />
                      <circle cx="18" cy="16" r="3" fill="currentColor" stroke="none" />
                    </motion.svg>
                  </div>
                </div>
              </motion.div>
              
              {/* Progress bar */}
              <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(loadProgress, 100)}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              
              <span className="text-xs text-white/30 font-mono tracking-wider">
                {Math.min(Math.round(loadProgress), 100)}%
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <AnimatePresence>
        {mounted && (
          <motion.div 
            className="relative z-10 h-full flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {/* Top bar */}
            <motion.header 
              className="h-16 px-6 md:px-12 flex items-center justify-between"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-400 p-[1.5px]">
                  <div className="w-full h-full rounded-[6px] bg-[#030303] flex items-center justify-center">
                    <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 18V5l12-2v13M6 21a3 3 0 100-6 3 3 0 000 6zM18 19a3 3 0 100-6 3 3 0 000 6z" />
                    </svg>
                  </div>
                </div>
                <span className="text-sm font-medium text-white/80 tracking-tight">Algorhythm</span>
              </div>
              
              <div className="flex items-center gap-6">
                <a href="/docs" className="text-xs text-white/40 hover:text-white/70 transition-colors">Docs</a>
                <div className="hidden md:flex items-center gap-2 text-xs text-white/30">
                  <kbd className="px-2 py-1 rounded bg-white/5 border border-white/10 font-mono">⏎</kbd>
                  <span>to start</span>
                </div>
              </div>
            </motion.header>

            {/* Center content */}
            <div className="flex-1 flex items-center justify-center px-6">
              <div className="max-w-3xl w-full">
                {/* Badge */}
                <motion.div
                  className="flex justify-center mb-8"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    <span className="text-xs text-white/50">v2.0 — Now with AI Assistant</span>
                  </div>
                </motion.div>

                {/* Title */}
                <motion.div 
                  className="text-center mb-6"
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                >
                  <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-extralight tracking-tighter text-white leading-none">
                    <span className="block">Algo</span>
                    <span className="block font-medium bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                      Rhythm
                    </span>
                  </h1>
                </motion.div>

                {/* Subtitle */}
                <motion.p 
                  className="text-center text-lg md:text-xl text-white/40 font-light mb-12 max-w-lg mx-auto"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                >
                  Where code becomes music. Live coding meets professional DJ performance.
                </motion.p>

                {/* CTA */}
                <motion.div 
                  className="flex justify-center mb-16"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                >
                  <LaunchButton onStart={onStart} onHoverChange={setHovered} />
                </motion.div>

                {/* Features grid */}
                <motion.div 
                  className="grid grid-cols-2 md:grid-cols-5 gap-3"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                >
                  {[
                    { icon: '🎹', label: '50+ Templates' },
                    { icon: '⚡', label: 'Real-time DSP' },
                    { icon: '🎛️', label: 'MIDI Support' },
                    { icon: '💻', label: 'Live Coding' },
                    { icon: '🤖', label: 'AI Assistant' },
                  ].map((feature, i) => (
                    <motion.div
                      key={feature.label}
                      className="group relative px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-emerald-500/30 transition-all cursor-default"
                      whileHover={{ y: -2, backgroundColor: 'rgba(16,185,129,0.05)' }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + i * 0.05 }}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">{feature.icon}</span>
                        <span className="text-xs text-white/50 group-hover:text-white/70 transition-colors">{feature.label}</span>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>

            {/* Bottom bar */}
            <motion.footer 
              className="h-16 px-6 md:px-12 flex items-center justify-between text-xs text-white/20"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.6 }}
            >
              <span>© 2026 Algorhythm</span>
              <div className="flex items-center gap-6">
                <span className="hidden md:inline">Built for creators</span>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Ready</span>
                </div>
              </div>
            </motion.footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

// Launch button component
const LaunchButton = memo(function LaunchButton({ 
  onStart, 
  onHoverChange 
}: { 
  onStart: () => void;
  onHoverChange: (hovered: boolean) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleHover = (hovered: boolean) => {
    setIsHovered(hovered);
    onHoverChange(hovered);
  };

  return (
    <motion.button
      ref={buttonRef}
      onClick={onStart}
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
      className="group relative"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Glow effect */}
      <motion.div 
        className="absolute -inset-4 rounded-2xl blur-2xl"
        style={{ background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)' }}
        animate={{ opacity: isHovered ? 0.4 : 0.15 }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Button */}
      <div className="relative flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-semibold text-base shadow-2xl shadow-emerald-500/20">
        {/* Shimmer */}
        <div className="absolute inset-0 rounded-xl overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -skew-x-12"
            animate={{ x: ['-200%', '200%'] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
          />
        </div>
        
        <span className="relative">Launch Studio</span>
        
        <motion.svg 
          className="relative w-5 h-5" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5"
          animate={{ x: isHovered ? 4 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </motion.svg>
      </div>
    </motion.button>
  );
});

export default WelcomeScreen;
