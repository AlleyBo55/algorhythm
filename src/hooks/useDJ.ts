import { useState, useEffect, useCallback } from 'react';
import { runner, CompileError } from '@/engine/runner';
import { audioEngine } from '@/engine/audio';
// We need to import Tone to check Transport state if we want reactive state
import * as Tone from 'tone';

// Re-export for consumers
export type { CompileError } from '@/engine/runner';

export function useDJ() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [bpm, setBpm] = useState(120);
    const [isReady, setIsReady] = useState(false);
    const [error, setError] = useState<CompileError | null>(null);

    const [isInitializing, setIsInitializing] = useState(false);
    const [initError, setInitError] = useState<string | null>(null);

    // Initialize engine on mount (or on user gesture, we will handle that in UI)
    const initEngine = useCallback(async () => {
        if (isInitializing) return;
        setIsInitializing(true);
        setInitError(null);

        try {
            await audioEngine.init();
            setIsReady(true);
        } catch (err) {
            console.error('Failed to initialize audio engine:', err);
            setInitError(String(err));
        } finally {
            setIsInitializing(false);
        }
    }, [isInitializing]);

    const togglePlay = useCallback(() => {
        if (Tone.Transport.state === 'started') {
            audioEngine.stop();
            setIsPlaying(false);
        } else {
            audioEngine.start();
            setIsPlaying(true);
        }
    }, []);

    const stop = useCallback(() => {
        audioEngine.stop();
        setIsPlaying(false);
    }, []);

    const runCode = useCallback((code: string) => {
        // Clear previous error
        setError(null);

        try {
            // Execute the code to schedule loops
            runner.execute(code);

            // Auto-start if not already playing
            if (Tone.Transport.state !== 'started') {
                audioEngine.start();
                setIsPlaying(true);
            }
        } catch (e: unknown) {
            // Check if it's a structured CompileError
            if (e && typeof e === 'object' && 'message' in e) {
                setError(e as CompileError);
            } else {
                // Fallback for unexpected errors
                setError({ message: String(e) });
            }
            console.error('Code execution error:', e);
        }
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const updateBpm = useCallback((newBpm: number) => {
        audioEngine.setBpm(newBpm);
        setBpm(newBpm);
    }, []);

    // Sync BPM from transport periodically or on change?
    // Tone.Transport doesn't emit events for all changes, so setting it is the source of truth for now.

    return {
        initEngine,
        isReady,
        isInitializing,
        initError,
        isPlaying,
        bpm,
        togglePlay,
        stop,
        runCode,
        updateBpm,
        error,
        clearError
    };
}
