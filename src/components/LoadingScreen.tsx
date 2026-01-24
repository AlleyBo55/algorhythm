'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Activity, Cpu, Database, Wifi } from 'lucide-react';

const BOOT_SEQUENCE = [
    "Initializing Kernel...",
    "Loading Audio Engine (Tone.js)...",
    "Calibrating DSP Modules...",
    "Mounting File System...",
    "Connecting to Neural Network...",
    "Synthesizing Basslines...",
    "Ready."
];

export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
    const [progress, setProgress] = useState(0);
    const [bootText, setBootText] = useState(BOOT_SEQUENCE[0]);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        // Simulate loading
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsComplete(true);
                    setTimeout(onComplete, 800); // Wait a bit before unmounting
                    return 100;
                }
                // Random incremental
                return prev + Math.random() * 2 + 1;
            });
        }, 50);

        return () => clearInterval(interval);
    }, [onComplete]);

    // Update text based on progress
    useEffect(() => {
        const index = Math.min(
            Math.floor((progress / 100) * BOOT_SEQUENCE.length),
            BOOT_SEQUENCE.length - 1
        );
        setBootText(BOOT_SEQUENCE[index]);
    }, [progress]);

    return (
        <AnimatePresence>
            {!isComplete && (
                <motion.div
                    className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center font-mono text-zinc-400"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
                >
                    {/* Hexagon/Tech Background (CSS only for perf) */}
                    <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
                        <div className="absolute top-[20%] left-[20%] w-64 h-64 border border-indigo-500/30 rounded-full animate-pulse-soft" />
                        <div className="absolute bottom-[20%] right-[20%] w-96 h-96 border border-purple-500/30 rounded-full animate-pulse-soft" style={{ animationDelay: '1s' }} />
                    </div>

                    <div className="relative z-10 w-80">
                        {/* Logo / Header */}
                        <div className="flex items-center justify-center gap-3 mb-8">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                className="p-3 bg-white/5 rounded-xl border border-white/10"
                            >
                                <Cpu className="w-8 h-8 text-indigo-400" />
                            </motion.div>
                            <h1 className="text-2xl font-bold text-white tracking-widest uppercase">
                                Algo<span className="text-indigo-500">Rhythm</span>
                            </h1>
                        </div>

                        {/* Progress Bar */}
                        <div className="h-1 bg-zinc-800 rounded-full overflow-hidden mb-2">
                            <motion.div
                                className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 box-shadow-[0_0_20px_rgba(99,102,241,0.5)]"
                                style={{ width: `${progress}%` }}
                            />
                        </div>

                        {/* Stats Row */}
                        <div className="flex justify-between text-[10px] text-zinc-500 mb-8 uppercase tracking-wider">
                            <span className="flex items-center gap-1"><Activity className="w-3 h-3" /> Memory: OK</span>
                            <span className="flex items-center gap-1"><Wifi className="w-3 h-3" /> Net: OK</span>
                            <span>{Math.round(progress)}%</span>
                        </div>

                        {/* Scrolling Terminal Text */}
                        <div className="h-8 overflow-hidden text-xs text-indigo-300/80 text-center font-mono relative">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={bootText}
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -20, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {'>'} {bootText}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
