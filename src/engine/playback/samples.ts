import * as Tone from 'tone';

export interface SamplePlayOptions {
    rate?: number;
    offset?: number;
    duration?: number | string;
}

export class SampleManager {
    private static instance: SampleManager;
    private samples: Map<string, Tone.Player> = new Map();

    private constructor() { }

    public static getInstance(): SampleManager {
        if (!SampleManager.instance) {
            SampleManager.instance = new SampleManager();
        }
        return SampleManager.instance;
    }

    public async loadSample(name: string, url: string | File): Promise<void> {
        return new Promise((resolve, reject) => {
            let bufferUrl: string;

            if (url instanceof File) {
                bufferUrl = URL.createObjectURL(url);
            } else {
                bufferUrl = url;
            }

            const buffer = new Tone.Buffer(
                bufferUrl,
                () => {
                    const player = new Tone.Player(buffer).toDestination();
                    this.samples.set(name, player);
                    resolve();
                },
                (e) => {
                    reject(e);
                }
            );
        });
    }

    public play(name: string, options?: SamplePlayOptions) {
        const player = this.samples.get(name);
        if (player) {
            if (player.state === 'started') {
                player.stop();
            }

            if (options?.rate) {
                player.playbackRate = options.rate;
            } else {
                player.playbackRate = 1; // reset
            }

            player.start(undefined, options?.offset, options?.duration);
        } else {
            console.warn(`Sample '${name}' not found.`);
        }
    }

    public getSampleNames(): string[] {
        return Array.from(this.samples.keys());
    }
}

export const sampleManager = SampleManager.getInstance();
