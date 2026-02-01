import { useState, useEffect, useRef, useMemo, useCallback } from 'react';

// Fusion palette: Japanese brutalism + Anthropic warmth + Apple clarity
// Each section has a distinct, bold background with complementary accents
export const SECTION_THEMES = {
  hero: {
    primary: '#FF6B35',      // Warm coral-orange (Anthropic warmth)
    secondary: '#1a1a2e',    // Deep navy
    accent: '#FFE66D',       // Bright yellow
    bg: '#0D0D0D',           // Near black - dramatic
    text: '#FAFAFA',
    textMuted: 'rgba(250,250,250,0.6)',
    name: 'hero',
    index: 0,
  },
  code: {
    primary: '#00D9FF',      // Electric cyan
    secondary: '#FF6B35',    // Coral
    accent: '#A855F7',       // Purple
    bg: '#0A1628',           // Deep blue-black
    text: '#FAFAFA',
    textMuted: 'rgba(250,250,250,0.6)',
    name: 'code',
    index: 1,
  },
  features: {
    primary: '#A855F7',      // Vibrant purple
    secondary: '#00D9FF',    // Cyan
    accent: '#FF6B35',       // Coral
    bg: '#1A0A28',           // Deep purple-black
    text: '#FAFAFA',
    textMuted: 'rgba(250,250,250,0.6)',
    name: 'features',
    index: 2,
  },
  cta: {
    primary: '#10B981',      // Emerald green
    secondary: '#FFE66D',    // Yellow
    accent: '#FF6B35',       // Coral
    bg: '#0A1A14',           // Deep green-black
    text: '#FAFAFA',
    textMuted: 'rgba(250,250,250,0.6)',
    name: 'cta',
    index: 3,
  },
} as const;

export type SectionTheme = typeof SECTION_THEMES[keyof typeof SECTION_THEMES];

const THEMES_ARRAY = [SECTION_THEMES.hero, SECTION_THEMES.code, SECTION_THEMES.features, SECTION_THEMES.cta];

// Scroll config
const SCROLL_THRESHOLD = 80;
const SCROLL_COOLDOWN = 1000;
const SCROLL_RESET_DELAY = 150;

export function useLandingPage() {
  const [mounted, setMounted] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const accumulatedDelta = useRef(0);
  const lastWheelTime = useRef(0);
  const cooldownUntil = useRef(0);
  const resetTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navigateToSection = useCallback((index: number) => {
    if (index < 0 || index > 3 || index === currentSection || isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentSection(index);
    cooldownUntil.current = Date.now() + SCROLL_COOLDOWN;
    accumulatedDelta.current = 0;
    
    setTimeout(() => setIsTransitioning(false), 800);
  }, [currentSection, isTransitioning]);

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    
    const now = Date.now();
    
    if (now < cooldownUntil.current || isTransitioning) {
      accumulatedDelta.current = 0;
      return;
    }
    
    if (now - lastWheelTime.current > SCROLL_RESET_DELAY) {
      accumulatedDelta.current = 0;
    }
    lastWheelTime.current = now;
    
    if (resetTimeout.current) {
      clearTimeout(resetTimeout.current);
    }
    
    resetTimeout.current = setTimeout(() => {
      accumulatedDelta.current = 0;
    }, SCROLL_RESET_DELAY);
    
    const delta = Math.abs(e.deltaY) > 50 ? Math.sign(e.deltaY) * 50 : e.deltaY;
    accumulatedDelta.current += delta;
    
    if (Math.abs(accumulatedDelta.current) >= SCROLL_THRESHOLD) {
      const direction = accumulatedDelta.current > 0 ? 1 : -1;
      navigateToSection(currentSection + direction);
    }
  }, [currentSection, isTransitioning, navigateToSection]);

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
