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

    // Decks (optional in base, provided by API)
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
        const inst = getInstruments();
        const presets = createPresets(inst);

        // Define local base context (Instruments + Presets + Utils)
        // We omit A, B, C, D and deck here to avoid prototype collisions or premature evaluation
        const djLocal: any = {
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
                        if (time < now - 0.1) return;
                        const safeTime = Math.max(time, lastTime + 0.001);
                        lastTime = safeTime;
                        callback(safeTime);
                    } catch (e: unknown) {
                        const msg = e instanceof Error ? e.message : String(e);
                        if (!msg.includes('time')) console.error('Runtime error in loop:', e);
                    }
                }, interval);
                this.cleanupFns.push(() => Tone.Transport.clear(id));
            },

            rhythm: (pattern: string, sounds: Record<string, (time: number) => void>) => {
                const events = PatternParser.parse(pattern);
                const id = Tone.Transport.scheduleRepeat((time) => {
                    const cycleDuration = Tone.Time('1m').toSeconds();
                    events.forEach(event => {
                        const triggerTime = time + (event.time * cycleDuration);
                        const soundFn = sounds[event.value];
                        if (soundFn) soundFn(triggerTime);
                    });
                }, '1m');
                this.cleanupFns.push(() => Tone.Transport.clear(id));
            },

            sidechain: (duration: string | number) => {
                const now = Tone.now();
                const bus = inst.sidechain;
                bus.gain.cancelScheduledValues(now);
                bus.gain.setValueAtTime(0, now);
                bus.gain.rampTo(1, duration, now);
            },

            stop: () => {
                audioEngine.stop();
            }
        };

        // 3. Execute Code safely
        try {
            // merge existing dj context with new djAPI AND preserve getters (like .deck)
            // Using Object.assign(Object.create(djAPI), dj) fails if proto has same-named getters.
            // Solution: use djLocal as the base and set djAPI as the prototype.
            const enhancedDJ: any = { ...djLocal };
            Object.setPrototypeOf(enhancedDJ, djAPI);

            // Now safely define aliases that depend on djAPI.deck
            // These getters will correctly resolve 'this' to enhancedDJ
            Object.defineProperties(enhancedDJ, {
                A: { get: function () { return this.deck?.A; }, enumerable: true },
                B: { get: function () { return this.deck?.B; }, enumerable: true },
                C: { get: function () { return this.deck?.C; }, enumerable: true },
                D: { get: function () { return this.deck?.D; }, enumerable: true }
            });

            // Expose aliases as top-level arguments for the user's function
            const runFn = new Function('dj', 'A', 'B', 'C', 'D', code);
            runFn(enhancedDJ, enhancedDJ.A, enhancedDJ.B, enhancedDJ.C, enhancedDJ.D);
            console.log('✅ Code executed successfully');
        } catch (e: unknown) {
            const error = e instanceof Error ? e : new Error(String(e));
            const lines = code.split('\n');
            let errorLine: number | undefined;
            if (error.stack) {
                const lineMatch = error.stack.match(/<anonymous>:(\d+):(\d+)/);
                if (lineMatch) errorLine = parseInt(lineMatch[1], 10) - 2;
            }
            const compileError: CompileError = {
                message: error.message,
                line: errorLine,
                codeContext: errorLine ? this.getCodeContext(lines, errorLine) : undefined
            };
            throw compileError;
        }
    }

    public cleanup() {
        this.cleanupFns.forEach(fn => fn());
        this.cleanupFns = [];
    }

    private getCodeContext(lines: string[], errorLine: number, contextSize: number = 2) {
        const result: { lineNumber: number; code: string; isError: boolean }[] = [];
        const start = Math.max(1, errorLine - contextSize);
        const end = Math.min(lines.length, errorLine + contextSize);
        for (let i = start; i <= end; i++) {
            result.push({ lineNumber: i, code: lines[i - 1], isError: i === errorLine });
        }
        return result;
    }
}

export const runner = new Runner();
