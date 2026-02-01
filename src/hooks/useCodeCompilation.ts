// Code Compilation Hook - Extracts compilation logic from CodeEditor component
import { useState, useCallback, useRef, useEffect } from 'react';
import { editor } from 'monaco-editor';
import { dj } from '@/engine/djapi';
import { audioEngine } from '@/engine/audio';
import { preloadSamplesFromCode, ALL_SAMPLES, type SampleLoadResult } from '@/engine/sampleCache';
import { waitForSamplersLoaded } from '@/engine/instruments';
import { nativeAudio } from '@/engine/nativeAudio';

export type CompilationPhase = 'analyzing' | 'downloading' | 'loading' | 'compiling' | 'running' | 'success' | 'error';

type IStandaloneCodeEditor = editor.IStandaloneCodeEditor;

const STORAGE_KEY = 'algorhythm_code';

export interface CompilationResult {
  success: boolean;
  failedSamples: SampleLoadResult[];
}

export function useCodeCompilation() {
  const [isRunning, setIsRunning] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);
  const [compilePhase, setCompilePhase] = useState<CompilationPhase>('analyzing');
  const [compileProgress, setCompileProgress] = useState(0);
  const [compileMessage, setCompileMessage] = useState('');
  const [showPlaybackEffect, setShowPlaybackEffect] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [failedSamples, setFailedSamples] = useState<SampleLoadResult[]>([]);
  const editorRef = useRef<IStandaloneCodeEditor | null>(null);

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const currentCode = editorRef.current?.getValue();
      if (currentCode) localStorage.setItem(STORAGE_KEY, currentCode);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const run = useCallback(async (code: string): Promise<CompilationResult> => {
    const currentCode = editorRef.current?.getValue() || code;
    try {
      setError(null);
      setFailedSamples([]);
      setIsCompiling(true);
      setCompileProgress(0);

      // Phase 1: Analyzing
      setCompilePhase('analyzing');
      setCompileMessage('Initializing audio engine...');
      setCompileProgress(5);
      await nativeAudio.init();
      const Tone = await import('tone');
      if (Tone.getContext().state !== 'running') await Tone.start();
      await Tone.getContext().resume();
      setCompileProgress(15);

      // Phase 2: Downloading
      setCompilePhase('downloading');
      setCompileMessage('Fetching samples from CDN...');
      const preloadResult = await preloadSamplesFromCode(currentCode, (p) => {
        setCompileProgress(15 + (p.loaded / Math.max(p.total, 1)) * 25);
        setCompileMessage(`Downloading ${p.loaded}/${p.total} samples...`);
      });
      
      // Track failed samples
      if (preloadResult.failed.length > 0) {
        setFailedSamples(preloadResult.failed);
        console.warn(`⚠️ ${preloadResult.failed.length} samples failed:`, preloadResult.failed.map(f => f.path));
      }

      // Phase 3: Loading
      setCompilePhase('loading');
      setCompileMessage('Decoding audio for instant playback...');
      setCompileProgress(45);
      await nativeAudio.preDecodeAllSamples([...ALL_SAMPLES], (loaded, total) => {
        setCompileProgress(45 + (loaded / total) * 25);
        setCompileMessage(`Decoding ${loaded}/${total} samples...`);
      });

      setCompileMessage('Loading synthesizers...');
      setCompileProgress(75);
      await waitForSamplersLoaded();

      // Warmup
      setCompileMessage('Warming up audio engine...');
      setCompileProgress(85);
      nativeAudio.playDrum('kick', { volume: -60 });
      nativeAudio.playDrum('snare', { volume: -60 });
      nativeAudio.playDrum('hihat', { volume: -60 });
      const inst = (await import('@/engine/instruments')).getInstruments();
      const warmupTime = Tone.now() + 0.05;
      try {
        inst.fadedPiano?.triggerAttackRelease('C4', '32n', warmupTime, 0.001);
        inst.fadedPluck?.triggerAttackRelease('C4', '32n', warmupTime, 0.001);
        inst.supersaw?.triggerAttackRelease(['C4'], '32n', warmupTime, 0.001);
        inst.pad?.triggerAttackRelease(['C4'], '32n', warmupTime, 0.001);
        inst.sub?.triggerAttackRelease('C2', '32n', warmupTime, 0.001);
      } catch {}
      await new Promise(r => setTimeout(r, 150));

      // Phase 4: Compiling
      setCompilePhase('compiling');
      setCompileMessage('Building audio graph...');
      setCompileProgress(92);
      await new Promise(r => setTimeout(r, 80));

      // Phase 5: Running
      setCompilePhase('running');
      setCompileMessage('Starting playback...');
      setCompileProgress(96);
      const { runner } = require('@/engine/runner');
      runner.execute(currentCode);

      // Success
      setCompilePhase('success');
      setCompileProgress(100);
      setCompileMessage(preloadResult.failed.length > 0 
        ? `Playing (${preloadResult.failed.length} samples missing)` 
        : 'Music is playing!');
      setTimeout(() => {
        setIsCompiling(false);
        setIsRunning(true);
        setShowPlaybackEffect(true);
      }, 500);
      
      return { success: true, failedSamples: preloadResult.failed };
    } catch (err: any) {
      setCompilePhase('error');
      setCompileMessage(err?.message || String(err));
      setError(err?.message || String(err));
      setTimeout(() => setIsCompiling(false), 1500);
      return { success: false, failedSamples: [] };
    }
  }, []);

  const stop = useCallback(() => {
    dj.stop();
    audioEngine.stop();
    setIsRunning(false);
  }, []);

  const save = useCallback((code: string) => {
    localStorage.setItem(STORAGE_KEY, editorRef.current?.getValue() || code);
  }, []);

  const loadSavedCode = useCallback((): string | null => {
    return localStorage.getItem(STORAGE_KEY);
  }, []);

  const dismissPlaybackEffect = useCallback(() => {
    setShowPlaybackEffect(false);
  }, []);

  const dismissCompilation = useCallback(() => {
    setIsCompiling(false);
  }, []);

  return {
    // State
    isRunning,
    isCompiling,
    compilePhase,
    compileProgress,
    compileMessage,
    showPlaybackEffect,
    error,
    failedSamples,
    editorRef,
    // Actions
    run,
    stop,
    save,
    loadSavedCode,
    dismissPlaybackEffect,
    dismissCompilation,
  };
}
