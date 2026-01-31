// Theme Manager - Visual Themes & Layouts for Streaming
// Patterns: Spotify (design system), Netflix (adaptive UI), TikTok (platform layouts)

import type {
  Theme,
  ThemeId,
  Layout,
  LayoutId,
  ChromaKeyColor,
  ComponentPosition,
} from './types';

// Type for saved preferences
interface ThemePreferences {
  currentTheme: ThemeId;
  currentLayout: LayoutId;
  transparentMode: boolean;
  chromaKeyColor: ChromaKeyColor | null;
  customLayouts: [string, Layout][];
}
import { saveToLocalStorage, loadFromLocalStorage, STORAGE_KEYS } from './storage';

// ============================================================================
// THEME DEFINITIONS (Spotify pattern: cohesive design system)
// ============================================================================

const THEMES: Record<ThemeId, Theme> = {
  dark: {
    id: 'dark',
    name: 'Dark Mode',
    colors: {
      background: '#0a0a0f',
      surface: '#141420',
      primary: '#00ff88',
      secondary: '#00ccff',
      accent: '#ff00ff',
      text: '#ffffff',
      textMuted: '#888899',
    },
    fonts: {
      heading: "'Space Grotesk', sans-serif",
      body: "'Inter', sans-serif",
      mono: "'JetBrains Mono', monospace",
    },
    effects: {
      glow: true,
      blur: true,
      gradients: true,
    },
  },
  neon: {
    id: 'neon',
    name: 'Neon Nights',
    colors: {
      background: '#0d001a',
      surface: '#1a0033',
      primary: '#ff00ff',
      secondary: '#00ffff',
      accent: '#ffff00',
      text: '#ffffff',
      textMuted: '#aa88cc',
    },
    fonts: {
      heading: "'Orbitron', sans-serif",
      body: "'Rajdhani', sans-serif",
      mono: "'Share Tech Mono', monospace",
    },
    effects: {
      glow: true,
      blur: true,
      gradients: true,
    },
  },
  minimal: {
    id: 'minimal',
    name: 'Minimal Clean',
    colors: {
      background: '#fafafa',
      surface: '#ffffff',
      primary: '#000000',
      secondary: '#333333',
      accent: '#0066ff',
      text: '#000000',
      textMuted: '#666666',
    },
    fonts: {
      heading: "'Helvetica Neue', sans-serif",
      body: "'SF Pro Text', sans-serif",
      mono: "'SF Mono', monospace",
    },
    effects: {
      glow: false,
      blur: false,
      gradients: false,
    },
  },
  retro: {
    id: 'retro',
    name: 'Retro Wave',
    colors: {
      background: '#1a1a2e',
      surface: '#16213e',
      primary: '#e94560',
      secondary: '#0f3460',
      accent: '#ffc107',
      text: '#eaeaea',
      textMuted: '#8888aa',
    },
    fonts: {
      heading: "'Press Start 2P', cursive",
      body: "'VT323', monospace",
      mono: "'Courier Prime', monospace",
    },
    effects: {
      glow: true,
      blur: false,
      gradients: true,
    },
  },
};

// ============================================================================
// LAYOUT DEFINITIONS (TikTok pattern: platform-specific layouts)
// ============================================================================

const DEFAULT_COMPONENT_POSITIONS: Record<string, ComponentPosition> = {
  'now-playing': { x: 20, y: 20, width: 300, height: 80, visible: true },
  'bpm-display': { x: 20, y: 110, width: 120, height: 60, visible: true },
  'waveform': { x: 0, y: 0, width: 100, height: 100, visible: true }, // % based
  'time-elapsed': { x: 20, y: 180, width: 150, height: 40, visible: true },
  'visualizer': { x: 0, y: 50, width: 100, height: 50, visible: true }, // % based
  'chat-notification': { x: 80, y: 10, width: 300, height: 200, visible: true },
};

const LAYOUTS: Record<LayoutId, Layout> = {
  'landscape-16-9': {
    id: 'landscape-16-9',
    name: 'Landscape (16:9)',
    aspectRatio: '16:9',
    width: 1920,
    height: 1080,
    componentPositions: new Map(Object.entries({
      ...DEFAULT_COMPONENT_POSITIONS,
      'now-playing': { x: 40, y: 40, width: 400, height: 100, visible: true },
      'visualizer': { x: 0, y: 60, width: 100, height: 40, visible: true },
    })),
  },
  'vertical-9-16': {
    id: 'vertical-9-16',
    name: 'Vertical (9:16)',
    aspectRatio: '9:16',
    width: 1080,
    height: 1920,
    componentPositions: new Map(Object.entries({
      ...DEFAULT_COMPONENT_POSITIONS,
      'now-playing': { x: 20, y: 100, width: 100, height: 80, visible: true }, // % width
      'visualizer': { x: 0, y: 40, width: 100, height: 30, visible: true },
      'bpm-display': { x: 40, y: 85, width: 20, height: 5, visible: true },
    })),
  },
  'square-1-1': {
    id: 'square-1-1',
    name: 'Square (1:1)',
    aspectRatio: '1:1',
    width: 1080,
    height: 1080,
    componentPositions: new Map(Object.entries({
      ...DEFAULT_COMPONENT_POSITIONS,
      'now-playing': { x: 10, y: 10, width: 80, height: 10, visible: true },
      'visualizer': { x: 0, y: 30, width: 100, height: 40, visible: true },
    })),
  },
};

// ============================================================================
// THEME MANAGER CLASS
// ============================================================================

export class ThemeManager {
  private currentTheme: ThemeId = 'dark';
  private currentLayout: LayoutId = 'landscape-16-9';
  private transparentMode: boolean = false;
  private chromaKeyColor: ChromaKeyColor | null = null;
  private customLayouts: Map<string, Layout> = new Map();
  private subscribers: Set<() => void> = new Set();

  constructor() {
    this.loadPreferences();
  }

  // ==========================================================================
  // THEME MANAGEMENT
  // ==========================================================================

  getTheme(id: ThemeId): Theme {
    return THEMES[id];
  }

  setTheme(id: ThemeId): void {
    if (!THEMES[id]) {
      throw new Error(`Theme ${id} not found`);
    }
    this.currentTheme = id;
    this.applyTheme(THEMES[id]);
    this.savePreferences();
    this.notifySubscribers();
  }

  getCurrentTheme(): Theme {
    return THEMES[this.currentTheme];
  }

  getAvailableThemes(): Theme[] {
    return Object.values(THEMES);
  }

  private applyTheme(theme: Theme): void {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    
    // Apply CSS variables
    root.style.setProperty('--theme-background', theme.colors.background);
    root.style.setProperty('--theme-surface', theme.colors.surface);
    root.style.setProperty('--theme-primary', theme.colors.primary);
    root.style.setProperty('--theme-secondary', theme.colors.secondary);
    root.style.setProperty('--theme-accent', theme.colors.accent);
    root.style.setProperty('--theme-text', theme.colors.text);
    root.style.setProperty('--theme-text-muted', theme.colors.textMuted);
    
    root.style.setProperty('--font-heading', theme.fonts.heading);
    root.style.setProperty('--font-body', theme.fonts.body);
    root.style.setProperty('--font-mono', theme.fonts.mono);

    // Apply effect classes
    document.body.classList.toggle('theme-glow', theme.effects.glow);
    document.body.classList.toggle('theme-blur', theme.effects.blur);
    document.body.classList.toggle('theme-gradients', theme.effects.gradients);

    console.log(`[ThemeManager] Applied theme: ${theme.name}`);
  }

  // ==========================================================================
  // LAYOUT MANAGEMENT
  // ==========================================================================

  getLayout(id: LayoutId): Layout {
    return LAYOUTS[id];
  }

  setLayout(id: LayoutId): void {
    if (!LAYOUTS[id]) {
      throw new Error(`Layout ${id} not found`);
    }
    this.currentLayout = id;
    this.savePreferences();
    this.notifySubscribers();
    console.log(`[ThemeManager] Applied layout: ${LAYOUTS[id].name}`);
  }

  getCurrentLayout(): Layout {
    return LAYOUTS[this.currentLayout];
  }

  getAvailableLayouts(): Layout[] {
    return [...Object.values(LAYOUTS), ...this.customLayouts.values()];
  }

  saveCustomLayout(name: string, layout: Omit<Layout, 'id'>): void {
    const id = `custom-${name.toLowerCase().replace(/\s+/g, '-')}` as LayoutId;
    const customLayout: Layout = {
      ...layout,
      id,
    };
    this.customLayouts.set(name, customLayout);
    this.savePreferences();
    console.log(`[ThemeManager] Saved custom layout: ${name}`);
  }

  deleteCustomLayout(name: string): void {
    this.customLayouts.delete(name);
    this.savePreferences();
  }

  // ==========================================================================
  // TRANSPARENT/CHROMA KEY MODE (OBS pattern)
  // ==========================================================================

  enableTransparentMode(color: ChromaKeyColor = '#00FF00'): void {
    this.transparentMode = true;
    this.chromaKeyColor = color;
    this.applyTransparentMode();
    this.notifySubscribers();
    console.log(`[ThemeManager] Transparent mode enabled with color: ${color}`);
  }

  disableTransparentMode(): void {
    this.transparentMode = false;
    this.chromaKeyColor = null;
    this.removeTransparentMode();
    this.notifySubscribers();
    console.log('[ThemeManager] Transparent mode disabled');
  }

  isTransparentMode(): boolean {
    return this.transparentMode;
  }

  getChromaKeyColor(): ChromaKeyColor | null {
    return this.chromaKeyColor;
  }

  private applyTransparentMode(): void {
    if (typeof document === 'undefined') return;

    document.body.classList.add('transparent-mode');
    if (this.chromaKeyColor) {
      document.documentElement.style.setProperty('--chroma-key-color', this.chromaKeyColor);
      document.body.style.backgroundColor = this.chromaKeyColor;
    }
  }

  private removeTransparentMode(): void {
    if (typeof document === 'undefined') return;

    document.body.classList.remove('transparent-mode');
    document.body.style.backgroundColor = '';
    this.applyTheme(this.getCurrentTheme());
  }

  // ==========================================================================
  // STREAM VIEW URL (OBS Browser Source)
  // ==========================================================================

  getStreamViewUrl(): string {
    if (typeof window === 'undefined') return '';
    
    const baseUrl = window.location.origin;
    const params = new URLSearchParams({
      theme: this.currentTheme,
      layout: this.currentLayout,
      transparent: this.transparentMode ? '1' : '0',
      chroma: this.chromaKeyColor || '',
    });
    
    return `${baseUrl}/stream?${params.toString()}`;
  }

  // ==========================================================================
  // PERSISTENCE
  // ==========================================================================

  savePreferences(): void {
    saveToLocalStorage(STORAGE_KEYS.THEME_PREFERENCES, {
      currentTheme: this.currentTheme,
      currentLayout: this.currentLayout,
      transparentMode: this.transparentMode,
      chromaKeyColor: this.chromaKeyColor,
      customLayouts: Array.from(this.customLayouts.entries()),
    });
  }

  loadPreferences(): void {
    const saved = loadFromLocalStorage<ThemePreferences | null>(STORAGE_KEYS.THEME_PREFERENCES, null);
    if (saved) {
      this.currentTheme = saved.currentTheme || 'dark';
      this.currentLayout = saved.currentLayout || 'landscape-16-9';
      this.transparentMode = saved.transparentMode || false;
      this.chromaKeyColor = saved.chromaKeyColor || null;
      
      if (saved.customLayouts) {
        this.customLayouts = new Map(saved.customLayouts);
      }

      // Apply loaded theme
      if (typeof document !== 'undefined') {
        this.applyTheme(THEMES[this.currentTheme]);
        if (this.transparentMode) {
          this.applyTransparentMode();
        }
      }
    }
  }

  // ==========================================================================
  // SUBSCRIPTIONS
  // ==========================================================================

  subscribe(callback: () => void): () => void {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  private notifySubscribers(): void {
    for (const callback of this.subscribers) {
      callback();
    }
  }

  // ==========================================================================
  // UTILITY
  // ==========================================================================

  getContrastColor(backgroundColor: string): string {
    // Calculate luminance and return appropriate text color
    const hex = backgroundColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#ffffff';
  }

  // Check WCAG AA contrast ratio
  hasAdequateContrast(foreground: string, background: string): boolean {
    const getLuminance = (hex: string): number => {
      const rgb = hex.replace('#', '').match(/.{2}/g)!.map(x => {
        const c = parseInt(x, 16) / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
    };

    const l1 = getLuminance(foreground);
    const l2 = getLuminance(background);
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    
    return ratio >= 4.5; // WCAG AA standard
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

export const themeManager = new ThemeManager();
