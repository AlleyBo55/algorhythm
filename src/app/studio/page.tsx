'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { WelcomeScreen } from '@/components/studio-welcome';
import { LoadingScreen } from '@/components/LoadingScreen';
import { audioEngine } from '@/engine/audio';
import { dj } from '@/engine/djapi';

const Studio = dynamic(() => import('@/components/Studio'), { ssr: false });

function MobileRestriction() {
  return (
    <div className="fixed inset-0 bg-[#030303] flex items-center justify-center p-6">
      <motion.div 
        className="max-w-sm text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div 
          className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          <svg className="w-10 h-10 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="5" y="2" width="14" height="20" rx="2" />
            <line x1="12" y1="18" x2="12" y2="18.01" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </motion.div>

        <h1 className="text-2xl font-semibold text-white mb-3">Desktop Required</h1>
        <p className="text-white/50 text-sm leading-relaxed mb-8">
          Algorhythm Studio requires a desktop browser for the full experience.
        </p>

        <Link href="/">
          <motion.div
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/[0.05] border border-white/[0.08] text-white/70 text-sm font-medium hover:bg-white/[0.08] transition-colors cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Home
          </motion.div>
        </Link>
      </motion.div>
    </div>
  );
}

export default function StudioPage() {
  const [state, setState] = useState<'welcome' | 'loading' | 'ready'>('welcome');
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Check mobile on mount only
  useEffect(() => {
    setIsMobile(window.innerWidth < 1024);
    setMounted(true);
    
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleStart = useCallback(() => {
    setState('loading');
  }, []);

  const handleLoadComplete = useCallback(async () => {
    // Initialize audio engine after samples are loaded
    try {
      await audioEngine.init();
      dj.init();
    } catch (error) {
      console.error('Failed to initialize audio:', error);
    }
    setState('ready');
  }, []);

  // Don't render anything until mounted (avoids hydration mismatch)
  if (!mounted) return null;

  if (isMobile) return <MobileRestriction />;

  if (state === 'welcome') {
    return <WelcomeScreen onStart={handleStart} />;
  }

  if (state === 'loading') {
    return <LoadingScreen onComplete={handleLoadComplete} />;
  }

  return <Studio />;
}
