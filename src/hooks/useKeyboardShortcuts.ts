// Keyboard Shortcuts Hook
// Phase 3: Accessibility and power user support

import { useEffect, useCallback } from 'react';
import { useAudioStore } from './useAudioState';

interface ShortcutHandlers {
  onPlayPause?: () => void;
  onStop?: () => void;
  onSeekForward?: () => void;
  onSeekBackward?: () => void;
  onLoadDeck?: (deckNum: number) => void;
  onCrossfaderLeft?: () => void;
  onCrossfaderRight?: () => void;
  onCrossfaderCenter?: () => void;
}

export function useKeyboardShortcuts(handlers: ShortcutHandlers = {}) {
  const updateMixer = useAudioStore((state) => state.updateMixer);
  
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Ignore if typing in input
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return;
    }
    
    switch (e.code) {
      // Space: Play/Pause
      case 'Space':
        e.preventDefault();
        handlers.onPlayPause?.();
        break;
      
      // Escape: Stop
      case 'Escape':
        handlers.onStop?.();
        break;
      
      // Arrow keys: Seek
      case 'ArrowLeft':
        if (e.shiftKey) {
          // Shift+Left: Crossfader to A
          updateMixer({ crossfader: -1 });
          handlers.onCrossfaderLeft?.();
        } else {
          handlers.onSeekBackward?.();
        }
        break;
      
      case 'ArrowRight':
        if (e.shiftKey) {
          // Shift+Right: Crossfader to B
          updateMixer({ crossfader: 1 });
          handlers.onCrossfaderRight?.();
        } else {
          handlers.onSeekForward?.();
        }
        break;
      
      // C: Center crossfader
      case 'KeyC':
        if (!e.metaKey && !e.ctrlKey) {
          updateMixer({ crossfader: 0 });
          handlers.onCrossfaderCenter?.();
        }
        break;
      
      // Number keys: Load deck
      case 'Digit1':
      case 'Digit2':
      case 'Digit3':
      case 'Digit4':
        if (!e.metaKey && !e.ctrlKey) {
          const deckNum = parseInt(e.code.slice(-1));
          handlers.onLoadDeck?.(deckNum);
        }
        break;
    }
  }, [handlers, updateMixer]);
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

// Shortcut reference for help display
export const KEYBOARD_SHORTCUTS = [
  { key: 'Space', action: 'Play/Pause' },
  { key: 'Escape', action: 'Stop' },
  { key: '←/→', action: 'Seek backward/forward' },
  { key: 'Shift+←', action: 'Crossfader to Deck A' },
  { key: 'Shift+→', action: 'Crossfader to Deck B' },
  { key: 'C', action: 'Center crossfader' },
  { key: '1-4', action: 'Select deck' },
] as const;
