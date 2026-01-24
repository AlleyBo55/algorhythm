import { Info } from 'lucide-react';
import { useState } from 'react';

export const HelpGuide = () => {
    const [isOpen, setIsOpen] = useState(false);

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed top-4 right-4 z-50 flex items-center gap-2 px-3 py-2 bg-black/80 backdrop-blur border border-white/10 rounded-full text-xs font-mono text-white/70 hover:text-white hover:border-white/30 transition-all"
            >
                <Info size={14} />
                <span>GUIDE</span>
            </button>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-[#0a0a0a] border border-white/10 rounded-lg max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                        <h2 className="text-xl font-bold font-mono tracking-tighter">Running System Manual</h2>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="px-2 py-1 hover:bg-white/10 rounded text-xs text-white/50 hover:text-white transition-colors"
                        >
                            [CLOSE]
                        </button>
                    </div>

                    <div className="space-y-4 font-mono text-sm">
                        <section className="space-y-2">
                            <h3 className="text-emerald-400 font-bold uppercase text-xs tracking-widest">01 // Workflow</h3>
                            <div className="bg-white/5 p-3 rounded border border-white/5 space-y-2 text-white/70">
                                <p>1. <span className="text-white">Start</span>: "make a synthwave song with intro"</p>
                                <p>2. <span className="text-white">Extend</span>: "add a verse with bass"</p>
                                <p>3. <span className="text-white">Evolve</span>: "add a chorus with energetic chords"</p>
                                <p className="text-xs pt-2 text-white/40 italic">
                                    * The AI reads your existing code and adds new sections chronologically.
                                </p>
                            </div>
                        </section>

                        <section className="space-y-2">
                            <h3 className="text-blue-400 font-bold uppercase text-xs tracking-widest">02 // Styles & Presets</h3>
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    { name: 'Stranger Things', desc: 'Dark pulsing 80s arps' },
                                    { name: 'Mandalorian', desc: 'Cinematic western, flute' },
                                    { name: 'Anime OST', desc: 'Emotional piano & strings' },
                                    { name: 'Anime Battle', desc: 'Fast intense action' },
                                    { name: 'Alan Walker', desc: 'Ethereal EDM faded style' },
                                    { name: 'Synthwave', desc: 'Retro neon 80s drive' },
                                    { name: 'Lofi', desc: 'Chill dusty beats' },
                                    { name: 'Traps', desc: 'Heavy 808s and hihat rolls' },
                                ].map(style => (
                                    <div key={style.name} className="bg-white/5 p-2 rounded border border-white/5 hover:border-white/20 transition-colors">
                                        <div className="text-white font-bold">{style.name}</div>
                                        <div className="text-white/40 text-xs">{style.desc}</div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="space-y-2">
                            <h3 className="text-purple-400 font-bold uppercase text-xs tracking-widest">03 // Structure Control</h3>
                            <div className="bg-white/5 p-3 rounded border border-white/5 text-white/70 space-y-1">
                                <p>Keywords to use for song structure:</p>
                                <div className="flex gap-2 pt-1">
                                    {['Intro', 'Verse', 'Chorus', 'Bridge', 'Drop', 'Outro'].map(k => (
                                        <span key={k} className="bg-purple-500/20 text-purple-200 px-2 py-0.5 rounded text-xs border border-purple-500/30">
                                            {k}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};
