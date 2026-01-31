import { useState, useEffect, useRef } from 'react';
import { useScroll } from 'framer-motion';

export function useLandingPage() {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });

  useEffect(() => {
    setMounted(true);
  }, []);

  return {
    mounted,
    containerRef,
    scrollYProgress,
  };
}

export function useNavigation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { scrolled };
}
