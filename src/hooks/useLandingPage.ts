import { useState, useEffect, useRef, useMemo, useCallback } from 'react';

// Section color themes - each section has completely different world
export const SECTION_THEMES = {
  hero: {
    primary: '#1db954',      // Spotify green
    secondary: '#22d3ee',    // Cyan
    accent: '#a855f7',       // Purple
    bg: '#0a0a0a',           // Near black
    text: '#ffffff',
    textMuted: '#a1a1aa',
    name: 'hero',
    index: 0,
  },
  code: {
    primary: '#c084fc',      // Light purple
    secondary: '#67e8f9',    // Light cyan
    accent: '#4ade80',       // Light green
    bg: '#1e1b4b',           // Deep indigo
    text: '#e0e7ff',
    textMuted: '#a5b4fc',
    name: 'code',
    index: 1,
  },
  features: {
    primary: '#38bdf8',      // Sky blue
    secondary: '#a78bfa',    // Violet
    accent: '#34d399',       // Emerald
    bg: '#0c1222',           // Deep navy
    text: '#e2e8f0',
    textMuted: '#94a3b8',
    name: 'features',
    index: 2,
  },
  cta: {
    primary: '#a78bfa',      // Violet
    secondary: '#67e8f9',    // Cyan
    accent: '#f472b6',       // Pink
    bg: '#0f0a1e',           // Deep purple-black
    text: '#f5f3ff',
    textMuted: '#c4b5fd',
    name: 'cta',
    index: 3,
  },
} as const;

export type SectionTheme = typeof SECTION_THEMES[keyof typeof SECTION_THEMES];

const THEMES_ARRAY = [SECTION_THEMES.hero, SECTION_THEMES.code, SECTION_THEMES.features, SECTION_THEMES.cta];

// Scroll config - tuned for trackpad sensitivity
const SCROLL_THRESHOLD = 80; // Accumulated delta needed to trigger
const SCROLL_COOLDOWN = 1000; // ms to wait after section change
const SCROLL_RESET_DELAY = 150; // ms of no scrolling to reset accumulator

export function useLandingPage() {
  const [mounted, setMounted] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Scroll state refs (not state to avoid re-renders)
  const accumulatedDelta = useRef(0);
  const lastWheelTime = useRef(0);
  const cooldownUntil = useRef(0);
  const resetTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Navigate to section with cooldown
  const navigateToSection = useCallback((index: number) => {
    if (index < 0 || index > 3 || index === currentSection || isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentSection(index);
    cooldownUntil.current = Date.now() + SCROLL_COOLDOWN;
    accumulatedDelta.current = 0;
    
    setTimeout(() => setIsTransitioning(false), 800);
  }, [currentSection, isTransitioning]);

  // Handle scroll/wheel with accumulated delta approach
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    
    const now = Date.now();
    
    // Still in cooldown after last section change
    if (now < cooldownUntil.current || isTransitioning) {
      accumulatedDelta.current = 0;
      return;
    }
    
    // Reset accumulator if there was a pause in scrolling
    if (now - lastWheelTime.current > SCROLL_RESET_DELAY) {
      accumulatedDelta.current = 0;
    }
    lastWheelTime.current = now;
    
    // Clear any pending reset
    if (resetTimeout.current) {
      clearTimeout(resetTimeout.current);
    }
    
    // Schedule reset if user stops scrolling
    resetTimeout.current = setTimeout(() => {
      accumulatedDelta.current = 0;
    }, SCROLL_RESET_DELAY);
    
    // Accumulate delta (normalize for trackpad vs mouse wheel)
    // Trackpad typically sends small deltas, mouse wheel sends larger ones
    const delta = Math.abs(e.deltaY) > 50 ? Math.sign(e.deltaY) * 50 : e.deltaY;
    accumulatedDelta.current += delta;
    
    // Check if we've accumulated enough to trigger
    if (Math.abs(accumulatedDelta.current) >= SCROLL_THRESHOLD) {
      const direction = accumulatedDelta.current > 0 ? 1 : -1;
      navigateToSection(currentSection + direction);
    }
  }, [currentSection, isTransitioning, navigateToSection]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (isTransitioning) return;
    
    let direction = 0;
    if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
      direction = 1;
      e.preventDefault();
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      direction = -1;
      e.preventDefault();
    }
    
    if (direction !== 0) {
      navigateToSection(currentSection + direction);
    }
  }, [currentSection, isTransitioning, navigateToSection]);

  // Navigate to specific section (for dots)
  const goToSection = useCallback((index: number) => {
    navigateToSection(index);
  }, [navigateToSection]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      if (resetTimeout.current) clearTimeout(resetTimeout.current);
    };
  }, [handleWheel, handleKeyDown]);

  const theme = useMemo(() => THEMES_ARRAY[currentSection], [currentSection]);

  return {
    mounted,
    containerRef,
    currentSection,
    theme,
    isTransitioning,
    goToSection,
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
