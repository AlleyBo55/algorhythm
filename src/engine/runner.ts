import { audioEngine } from './audio';
import { getInstruments } from './instruments';
import { createPresets, PresetMap } from './presets';
import { sampleManager, SamplePlayOptions } from './samples';
import { dj as djAPI } from './djapi';
import * as Tone from 'tone';

import { PatternParser } from './patternParser';

// Structured error type for IDE-like error display
export interface CompileError {
    message: string;
    line?: number;
    column?: number;
    codeLine?: string;
    codeContext?: { lineNumber: number; code: string; isError: boolean }[];
}

// Type definition for the DJ API available to the user
interface DJContext {
    bpm: number;
    // Drums
    kick: Tone.Sampler;
    snare: Tone.Sampler;
    hihat: Tone.Sampler;
    clap: Tone.Sampler;
    tom: Tone.Sampler;
    // Bass & Leads
    bass: Tone.Sampler;
    lead: Tone.PolySynth;
    // Synths
    pad: Tone.PolySynth;
    arp: Tone.MonoSynth;
    pluck: Tone.Sampler;
    fm: Tone.PolySynth;
    strings: Tone.Sampler;
    piano: Tone.Sampler;
    sub: Tone.MonoSynth;

    // Semantic Instruments
    flute: Tone.PolySynth;
    trumpet: Tone.PolySynth;
    violin: Tone.PolySynth;
    cymbal: Tone.Sampler;
    bass808: Tone.MembraneSynth;

    // Decks
    deck?: {
        A: any;
        B: any;
        C: any;
        D: any;
    };

    // Deck Aliases
    A: any;
    B: any;
    C: any;
    D: any;

    // Presets
    preset: PresetMap;
    // Utils
    play: (sampleName: string, options?: SamplePlayOptions) => void;
    loop: (interval: string, callback: (time: number) => void) => void;
    rhythm: (pattern: string, sounds: Record<string, (time: number) => void>) => void;
    sidechain: (duration: string | number) => void;
    stop: () => void;
}

export class Runner {
    private cleanupFns: (() => void)[] = [];

    constructor() { }

    public execute(code: string) {
        // Debug: Log the code being executed
        console.log('Executing code:', code);

        // 1. Cleanup previous run
        this.cleanup();

        // 2. Prepare Sandbox Context
        // Lazy load instruments here
        const inst = getInstruments();
        const presets = createPresets(inst);

        const dj: DJContext = {
            get bpm() { return Tone.Transport.bpm.value; },
            set bpm(v: number) { audioEngine.setBpm(v); },

            // Drums
            kick: inst.kick,
            snare: inst.snare,
            hihat: inst.hihat,
            clap: inst.clap,
            tom: inst.tom,
            // Bass & Leads
            bass: inst.bass,
            lead: inst.lead,
            // Synths
            pad: inst.pad,
            arp: inst.arp,
            pluck: inst.pluck,
            fm: inst.fm,
            strings: inst.strings,
            piano: inst.piano,
            sub: inst.sub,

            // Semantic Instruments
            flute: inst.flute,
            trumpet: inst.trumpet,
            violin: inst.violin,
            cymbal: inst.cymbal,
            bass808: inst.bass808,
            // Presets
            preset: presets,

            play: (name: string, options?: SamplePlayOptions) => {
                sampleManager.play(name, options);
            },

            loop: (interval: string, callback: (time: number) => void) => {
                let lastTime = 0;
                const id = Tone.Transport.scheduleRepeat((time) => {
                    try {
                        const now = Tone.context.currentTime;
                        // Skip if event is more than 100ms late to avoid "catch up" stacking
                        if (time < now - 0.1) {
                            return;
                        }

                        // Add tiny offset to prevent "start time must be greater" errors
                        const safeTime = Math.max(time, lastTime + 0.001);
                        lastTime = safeTime;

                        callback(safeTime);
                    } catch (e: unknown) {
                        // Suppress common Tone.js timing errors that don't affect playback
                        const msg = e instanceof Error ? e.message : String(e);
                        const isTimingError =
                            msg.includes('Start time must be strictly greater') ||
                            msg.includes('time must be greater than or equal') ||
                            msg.includes('scheduled time');
                        if (!isTimingError) {
                            console.error('Runtime error in loop:', e);
                        }
                    }
                }, interval);

                this.cleanupFns.push(() => Tone.Transport.clear(id));
            },

            rhythm: (pattern: string, sounds: Record<string, (time: number) => void>) => {
                // Parse the Tidal-like pattern once
                const events = PatternParser.parse(pattern);

                // Create a 1-measure loop to trigger these events
                // This mimics a "Cycle" in Tidal
                const id = Tone.Transport.scheduleRepeat((time) => {
                    // Current 1m duration in seconds
                    const cycleDuration = Tone.Time('1m').toSeconds();

                    events.forEach(event => {
                        const triggerTime = time + (event.time * cycleDuration);
                        const soundFn = sounds[event.value];

                        if (soundFn) {
                            // Schedule the trigger relative to the start of the measure
                            // We use Tone.Draw or just direct call? 
                            // Direct call is risky if not scheduled. 
                            // Better to pass the precise triggerTime to the callback
                            soundFn(triggerTime);
                        }
                    });
                }, '1m');

                this.cleanupFns.push(() => Tone.Transport.clear(id));
            },

            // EDM Sidechain effect (Volume Ducking)
            sidechain: (duration: string | number) => {
                const now = Tone.now();
                const bus = inst.sidechain; // This is a Tone.Gain
                // Duck volume to 0 immediately
                bus.gain.cancelScheduledValues(now);
                bus.gain.setValueAtTime(0, now);
                // Ramp back up to 1 over duration
                bus.gain.rampTo(1, duration, now);
            },

            stop: () => {
                audioEngine.stop();
            },

            // Deck Aliases
            get A() { return dj.deck!.A; },
            get B() { return dj.deck!.B; },
            get C() { return dj.deck!.C; },
            get D() { return dj.deck!.D; }
        };

        // 3. Execute Code safely
        try {
            // merge existing dj context with new djAPI AND preserve getters (like .deck)
            // spreading { ...djAPI } fails for getters on the prototype.
            // Solution: Use djAPI as the prototype.
            const enhancedDJ = Object.create(djAPI);
            Object.assign(enhancedDJ, dj);

            // Expose aliases as top-level arguments for the user's function
            // This allows using A.play() instead of dj.A.play()
            const runFn = new Function('dj', 'A', 'B', 'C', 'D', code);
            runFn(enhancedDJ, enhancedDJ.A, enhancedDJ.B, enhancedDJ.C, enhancedDJ.D);
            console.log('✅ Code executed successfully');
        } catch (e: unknown) {
            const error = e instanceof Error ? e : new Error(String(e));
            const lines = code.split('\n');

            // Try to extract line number from stack trace
            // Format varies: "at Function (<anonymous>:LINE:COL)" or "eval at ... (<anonymous>:LINE:COL)"
            let errorLine: number | undefined;
            let errorColumn: number | undefined;

            if (error.stack) {
                // Match patterns like ":2:10)" or "anonymous>:5:1)"
                const lineMatch = error.stack.match(/<anonymous>:(\d+):(\d+)/);
                if (lineMatch) {
                    // Subtract 2 because Function() adds wrapper lines
                    errorLine = parseInt(lineMatch[1], 10) - 2;
                    errorColumn = parseInt(lineMatch[2], 10);
                    // Clamp to valid range
                    if (errorLine < 1) errorLine = 1;
                    if (errorLine > lines.length) errorLine = lines.length;
                }
            }

            // Log code with line numbers for debugging
            console.error('=== CODE WITH LINE NUMBERS ===');
            lines.forEach((line, i) => {
                const marker = (i + 1 === errorLine) ? '>>> ' : '    ';
                console.log(`${marker}${i + 1}: ${line}`);
            });
            console.error('=== ERROR ===', error.message);

            // Create structured error
            const compileError: CompileError = {
                message: error.message,
                line: errorLine,
                column: errorColumn,
                codeLine: errorLine ? lines[errorLine - 1] : undefined,
                codeContext: errorLine ? this.getCodeContext(lines, errorLine) : undefined
            };

            throw compileError;
        }
    }

    public cleanup() {
        this.cleanupFns.forEach(fn => fn());
        this.cleanupFns = [];
    }

    // Helper to get surrounding code context for error display
    private getCodeContext(lines: string[], errorLine: number, contextSize: number = 2) {
        const result: { lineNumber: number; code: string; isError: boolean }[] = [];
        const start = Math.max(1, errorLine - contextSize);
        const end = Math.min(lines.length, errorLine + contextSize);

        for (let i = start; i <= end; i++) {
            result.push({
                lineNumber: i,
                code: lines[i - 1],
                isError: i === errorLine
            });
        }
        return result;
    }
}

export const runner = new Runner();
