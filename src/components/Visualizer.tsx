'use client';
import { useEffect, useRef, useState } from 'react';
import * as Tone from 'tone';

type VisualizerMode = 'noise' | 'void' | 'matrix';

export default function Visualizer() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const analyserRef = useRef<Tone.Analyser | null>(null);
    const rafRef = useRef<number>(0);
    const [mode, setMode] = useState<VisualizerMode>('void');
    const frameRef = useRef(0);

    // Matrix drops state
    const dropsRef = useRef<number[]>([]);

    useEffect(() => {
        analyserRef.current = new Tone.Analyser('fft', 64);
        Tone.Destination.connect(analyserRef.current);

        const draw = () => {
            const canvas = canvasRef.current;
            const analyser = analyserRef.current;
            if (!canvas || !analyser) return;

            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            const values = analyser.getValue() as Float32Array;
            const width = canvas.width;
            const height = canvas.height;
            frameRef.current++;

            // Energy calculation
            let totalEnergy = 0;
            values.forEach(v => { totalEnergy += Math.max(0, (v as number) + 100); });
            const avgEnergy = totalEnergy / values.length / 100; // 0.0 to 1.0 approx

            // Clear heavy
            ctx.fillStyle = mode === 'noise' ? '#000' : 'rgba(0, 0, 0, 0.2)';
            ctx.fillRect(0, 0, width, height);

            if (mode === 'noise') {
                drawNoise(ctx, width, height, avgEnergy);
            } else if (mode === 'void') {
                drawVoid(ctx, values, width, height, avgEnergy);
            } else {
                drawMatrix(ctx, values, width, height, avgEnergy);
            }

            // Scanline Glitch
            if (Math.random() > 0.9 + (0.1 - avgEnergy * 0.1)) {
                const y = Math.random() * height;
                const h = Math.random() * 20;
                const offset = (Math.random() - 0.5) * 20;
                try {
                    const imageData = ctx.getImageData(0, y, width, h);
                    ctx.putImageData(imageData, offset, y);
                } catch (e) { /* ignore out of bounds */ }
            }

            rafRef.current = requestAnimationFrame(draw);
        };

        const drawNoise = (ctx: CanvasRenderingContext2D, width: number, height: number, energy: number) => {
            // High Contrast grainy lines based on volume
            const bars = 32;
            const bW = width / bars;

            ctx.fillStyle = '#CCFF00'; // Acid Green

            for (let i = 0; i < bars; i++) {
                if (Math.random() > 0.5) continue;

                const h = Math.random() * height * energy * 2;
                const x = i * bW;
                const y = (height - h) / 2;

                ctx.fillRect(x, y, bW - 2, h);

                // Random noise pixels
                if (energy > 0.3) {
                    for (let k = 0; k < 5; k++) {
                        ctx.fillRect(x + Math.random() * bW, Math.random() * height, 2, 2);
                    }
                }
            }
        };

        const drawVoid = (ctx: CanvasRenderingContext2D, values: Float32Array, width: number, height: number, energy: number) => {
            const cx = width / 2;
            const cy = height / 2;
            const radius = 30 + energy * 60;

            ctx.beginPath();
            // Distorted circle
            for (let i = 0; i <= Math.PI * 2; i += 0.1) {
                const noise = (Math.random() - 0.5) * energy * 20;
                const r = radius + noise;
                const x = cx + Math.cos(i) * r;
                const y = cy + Math.sin(i) * r;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();

            ctx.strokeStyle = '#F0F0F0';
            ctx.lineWidth = 2;
            ctx.stroke();

            if (energy > 0.6) {
                ctx.beginPath();
                ctx.arc(cx, cy, radius * 0.5, 0, Math.PI * 2);
                ctx.fillStyle = '#CCFF00';
                ctx.fill();
            }
        };

        const drawMatrix = (ctx: CanvasRenderingContext2D, values: Float32Array, width: number, height: number, energy: number) => {
            const fontSize = 14;
            const columns = Math.floor(width / fontSize);

            if (dropsRef.current.length !== columns) {
                dropsRef.current = new Array(columns).fill(1);
            }

            ctx.font = '14px monospace';

            for (let i = 0; i < columns; i++) {
                // Japanese Katakana characters
                const char = String.fromCharCode(0x30A0 + Math.random() * 96);

                const x = i * fontSize;
                const y = dropsRef.current[i] * fontSize;

                // Energy affects brightness/color
                const isLoud = values[i % values.length] > -30;

                ctx.fillStyle = isLoud ? '#CCFF00' : '#0F3300';
                if (Math.random() > 0.98) ctx.fillStyle = '#FFF';

                ctx.fillText(char, x, y);

                if (y > height && Math.random() > 0.975) {
                    dropsRef.current[i] = 0;
                }
                dropsRef.current[i]++;
            }
        };

        draw();
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            analyserRef.current?.dispose();
        };
    }, [mode]);

    return (
        <div className="relative w-full h-full brutalist-box overflow-hidden">
            <canvas
                ref={canvasRef}
                width={400}
                height={200}
                className="w-full h-full opacity-80"
            />

            {/* Mode Selectors */}
            <div className="absolute top-0 right-0 p-2 flex flex-col gap-1 items-end z-10">
                {(['noise', 'void', 'matrix'] as VisualizerMode[]).map((m) => (
                    <button
                        key={m}
                        onClick={() => setMode(m)}
                        className={`text-[10px] uppercase font-bold tracking-widest px-1 py-0.5 border ${mode === m
                                ? 'bg-[#CCFF00] text-black border-[#CCFF00]'
                                : 'text-[#555] border-transparent hover:text-[#CCFF00]'
                            }`}
                    >
                        {m}
                    </button>
                ))}
            </div>

            {/* Decorative */}
            <div className="absolute bottom-2 left-2 text-[8px] text-[#333] font-mono leading-none">
                SYSTEM_VISUALIZER<br />
                FFT_SIZE: 64<br />
                RENDER: CANVAS_2D
            </div>
        </div>
    );
}
