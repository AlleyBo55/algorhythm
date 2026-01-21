'use client';

import { memo, useCallback, useEffect, useRef, useState } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';
import { editor } from 'monaco-editor';
import { dj } from '@/engine/djapi';
import { audioEngine } from '@/engine/audio';
import { preloadSamplesFromCode, ALL_SAMPLES } from '@/engine/sampleCache';
import { waitForSamplersLoaded } from '@/engine/instruments';
import { nativeAudio } from '@/engine/nativeAudio';
import { cn } from '../ui/Button';
import { CompilationOverlay, PlaybackStartEffect, LiveIndicator, type CompilationPhase } from './CompilationOverlay';

type IStandaloneCodeEditor = editor.IStandaloneCodeEditor;

export const CodeEditorPanel = memo(function CodeEditorPanel() {
  const [code, setCode] = useState(STARTER_CODE);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);
  const [compilePhase, setCompilePhase] = useState<CompilationPhase>('analyzing');
  const [compileProgress, setCompileProgress] = useState(0);
  const [compileMessage, setCompileMessage] = useState('');
  const [showPlaybackEffect, setShowPlaybackEffect] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const editorRef = useRef<IStandaloneCodeEditor | null>(null);

  const handleEditorMount = useCallback((editor: IStandaloneCodeEditor, monaco: Monaco) => {
    editorRef.current = editor;
    monaco.languages.registerCompletionItemProvider('typescript', {
      provideCompletionItems: () => ({
        suggestions: [
          { label: 'dj.bpm', kind: monaco.languages.CompletionItemKind.Property, insertText: 'dj.bpm = ${1:128};', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Set global BPM' },
          { label: 'dj.loop', kind: monaco.languages.CompletionItemKind.Function, insertText: "dj.loop('${1:16n}', (time) => {\n\t${2}\n});", insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Create a timed loop' },
          { label: 'dj.kick', kind: monaco.languages.CompletionItemKind.Method, insertText: "dj.kick.triggerAttackRelease('${1:C1}', '${2:8n}', time);", insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Trigger kick drum' },
          { label: 'dj.sample', kind: monaco.languages.CompletionItemKind.Method, insertText: "dj.sample('${1:drums/kick-1}', { time });", insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Play a sample from CDN' },
        ],
      }),
    });
    editor.addCommand(monaco.KeyMod.Shift | monaco.KeyCode.Enter, () => handleRun());
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => handleSave());
    const saved = localStorage.getItem('algorhythm_code');
    if (saved) setCode(saved);
  }, []);

  const handleRun = useCallback(async () => {
    const currentCode = editorRef.current?.getValue() || code;
    try {
      setError(null); setIsCompiling(true); setCompileProgress(0);
      setCompilePhase('analyzing'); setCompileMessage('Initializing audio engine...'); setCompileProgress(5);
      await nativeAudio.init();
      const Tone = await import('tone');
      if (Tone.getContext().state !== 'running') await Tone.start();
      await Tone.getContext().resume();
      setCompileProgress(15);

      setCompilePhase('downloading'); setCompileMessage('Fetching samples from CDN...');
      await preloadSamplesFromCode(currentCode, (p) => {
        setCompileProgress(15 + (p.loaded / Math.max(p.total, 1)) * 25);
        setCompileMessage(`Downloading ${p.loaded}/${p.total} samples...`);
      });

      setCompilePhase('loading'); setCompileMessage('Decoding audio for instant playback...'); setCompileProgress(45);
      await nativeAudio.preDecodeAllSamples([...ALL_SAMPLES], (loaded, total) => {
        setCompileProgress(45 + (loaded / total) * 25);
        setCompileMessage(`Decoding ${loaded}/${total} samples...`);
      });

      setCompileMessage('Loading synthesizers...'); setCompileProgress(75);
      await waitForSamplersLoaded();

      setCompileMessage('Warming up audio engine...'); setCompileProgress(85);
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

      setCompilePhase('compiling'); setCompileMessage('Building audio graph...'); setCompileProgress(92);
      await new Promise(r => setTimeout(r, 80));

      setCompilePhase('running'); setCompileMessage('Starting playback...'); setCompileProgress(96);
      const { runner } = require('@/engine/runner');
      runner.execute(currentCode);

      setCompilePhase('success'); setCompileProgress(100); setCompileMessage('Music is playing!');
      setTimeout(() => { setIsCompiling(false); setIsRunning(true); setShowPlaybackEffect(true); }, 500);
    } catch (err: any) {
      setCompilePhase('error'); setCompileMessage(err?.message || String(err)); setError(err?.message || String(err));
      setTimeout(() => setIsCompiling(false), 1500);
    }
  }, [code]);

  const handleStop = useCallback(() => { dj.stop(); audioEngine.stop(); setIsRunning(false); }, []);
  const handleSave = useCallback(() => { localStorage.setItem('algorhythm_code', editorRef.current?.getValue() || code); }, [code]);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentCode = editorRef.current?.getValue();
      if (currentCode) localStorage.setItem('algorhythm_code', currentCode);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full flex flex-col rounded-2xl bg-zinc-900/50 border border-zinc-800/50 overflow-hidden relative backdrop-blur-sm">
      {isCompiling && <CompilationOverlay phase={compilePhase} progress={compileProgress} message={compileMessage} onClose={() => setIsCompiling(false)} />}
      {showPlaybackEffect && <PlaybackStartEffect onComplete={() => setShowPlaybackEffect(false)} />}
      <div className="h-14 px-5 flex items-center justify-between border-b border-zinc-800/50 bg-zinc-900/30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 18l6-6-6-6M8 6l-6 6 6 6" /></svg>
          </div>
          <div><span className="text-sm font-medium text-white">Code Editor</span><span className="text-[10px] text-zinc-500 ml-2 font-mono">TypeScript</span></div>
        </div>
        <div className="flex items-center gap-3">
          {isRunning && <LiveIndicator />}
          <span className="text-[10px] text-zinc-600 font-mono px-2 py-1 rounded bg-zinc-800/50">Ln {editorRef.current?.getPosition()?.lineNumber || 1}</span>
        </div>
      </div>
      <div className="flex-1 min-h-0 relative">
        {isRunning && (
          <div className="absolute inset-0 pointer-events-none z-10">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
            <div className="absolute top-0 bottom-0 left-0 w-px bg-gradient-to-b from-transparent via-emerald-500/30 to-transparent" />
            <div className="absolute top-0 bottom-0 right-0 w-px bg-gradient-to-b from-transparent via-emerald-500/30 to-transparent" />
          </div>
        )}
        <Editor height="100%" defaultLanguage="typescript" value={code} onChange={v => setCode(v || '')} onMount={handleEditorMount} theme="vs-dark"
          options={{ fontSize: 13, fontFamily: "'JetBrains Mono', 'Fira Code', 'SF Mono', monospace", fontLigatures: true, minimap: { enabled: false }, scrollBeyondLastLine: false, automaticLayout: true, tabSize: 2, wordWrap: 'on', lineNumbers: 'on', renderLineHighlight: 'line', cursorBlinking: 'smooth', cursorSmoothCaretAnimation: 'on', smoothScrolling: true, padding: { top: 20, bottom: 20 }, scrollbar: { verticalScrollbarSize: 8, horizontalScrollbarSize: 8 } }} />
      </div>
      {error && !isCompiling && (
        <div className="px-5 py-4 bg-red-500/10 border-t border-red-500/20 flex items-start gap-3">
          <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-3 h-3 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </div>
          <div><p className="text-xs font-medium text-red-400 mb-1">Compilation Error</p><p className="text-xs text-red-300/80 font-mono">{error}</p></div>
        </div>
      )}
      <div className="h-16 px-5 flex items-center justify-between border-t border-zinc-800/50 bg-zinc-950/50">
        <div className="flex items-center gap-3">
          <button onClick={handleRun} disabled={isRunning || isCompiling} className={cn("h-10 px-6 rounded-xl font-medium text-sm flex items-center gap-2.5 transition-all duration-200", isRunning || isCompiling ? "bg-zinc-800 text-zinc-500 cursor-not-allowed" : "bg-gradient-to-r from-emerald-500 to-emerald-400 text-black hover:from-emerald-400 hover:to-emerald-300 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 active:scale-95")}>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
            {isCompiling ? 'Compiling...' : 'Run'}
          </button>
          {isRunning && <button onClick={handleStop} className="h-10 px-5 rounded-xl text-sm font-medium bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white transition-all duration-200 flex items-center gap-2"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="1" /></svg>Stop</button>}
          <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-zinc-600"><kbd className="px-1.5 py-0.5 rounded bg-zinc-800 font-mono">⇧</kbd><span>+</span><kbd className="px-1.5 py-0.5 rounded bg-zinc-800 font-mono">↵</kbd></div>
        </div>
        <TemplateSelector onSelect={setCode} />
      </div>
    </div>
  );
});

const TemplateSelector = memo(function TemplateSelector({ onSelect }: { onSelect: (code: string) => void }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [templates, setTemplates] = useState<ReturnType<typeof import('@/data/templates').getTemplates>>([]);
  const [genres, setGenres] = useState<string[]>([]);

  useEffect(() => {
    const loadTemplates = async () => {
      const { getTemplates } = await import('@/data/templates');
      const { getAllGenres } = await import('@/data/library');
      setTemplates(getTemplates());
      setGenres(getAllGenres());
    };
    loadTemplates();
  }, []);

  const filteredTemplates = templates.filter(t => {
    const matchesSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.persona.toLowerCase().includes(search.toLowerCase());
    const matchesGenre = !selectedGenre || t.description.toLowerCase().includes(selectedGenre.toLowerCase());
    return matchesSearch && matchesGenre;
  });

  const groupedByArtist = filteredTemplates.reduce((acc, t) => {
    if (!acc[t.persona]) acc[t.persona] = [];
    acc[t.persona].push(t);
    return acc;
  }, {} as Record<string, typeof templates>);

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="h-10 px-4 rounded-xl text-sm text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-all duration-200 flex items-center gap-2 border border-transparent hover:border-zinc-700/50">
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
        <span className="hidden sm:inline">Templates</span>
        <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-medium">{templates.length}</span>
        <svg className={cn("w-4 h-4 transition-transform duration-200", open && "rotate-180")} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute bottom-full right-0 mb-2 w-96 max-h-[75vh] rounded-2xl bg-zinc-900/95 border border-zinc-700/50 shadow-2xl shadow-black/50 z-50 animate-fade-up flex flex-col backdrop-blur-xl overflow-hidden">
            <div className="p-4 border-b border-zinc-800/50">
              <div className="flex items-center justify-between mb-3"><h3 className="text-sm font-medium text-white">Template Library</h3><span className="text-[10px] text-zinc-500">{templates.length} templates</span></div>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
                <input type="text" placeholder="Search by name or artist..." value={search} onChange={e => setSearch(e.target.value)} className="w-full h-10 pl-10 pr-4 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all" />
              </div>
            </div>
            <div className="px-4 py-3 border-b border-zinc-800/50 flex gap-2 overflow-x-auto scrollbar-hide">
              <button onClick={() => setSelectedGenre(null)} className={cn("px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all duration-200", !selectedGenre ? "bg-emerald-500 text-black" : "bg-zinc-800/50 text-zinc-400 hover:text-white hover:bg-zinc-700/50")}>All Genres</button>
              {genres.slice(0, 6).map(genre => (<button key={genre} onClick={() => setSelectedGenre(selectedGenre === genre ? null : genre)} className={cn("px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all duration-200", selectedGenre === genre ? "bg-emerald-500 text-black" : "bg-zinc-800/50 text-zinc-400 hover:text-white hover:bg-zinc-700/50")}>{genre}</button>))}
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-4">
              <div><div className="px-2 py-1.5 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Getting Started</div>
                <div className="space-y-1">
                  <TemplateItem name="Starter" subtitle="Basic beat pattern" onClick={() => { onSelect(STARTER_CODE); setOpen(false); }} />
                  <TemplateItem name="Four on the Floor" subtitle="Classic house rhythm" onClick={() => { onSelect(FOUR_ON_FLOOR); setOpen(false); }} />
                  <TemplateItem name="Breakbeat" subtitle="Syncopated drums" onClick={() => { onSelect(BREAKBEAT); setOpen(false); }} />
                </div>
              </div>
              {Object.entries(groupedByArtist).map(([artist, artistTemplates]) => (
                <div key={artist}><div className="px-2 py-1.5 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-2"><span>{artist}</span><span className="text-emerald-500/60">({artistTemplates.length})</span></div>
                  <div className="space-y-1">{artistTemplates.map(t => (<TemplateItem key={t.id} name={t.name} subtitle={t.description} onClick={() => { onSelect(t.code); setOpen(false); }} />))}</div>
                </div>
              ))}
              {filteredTemplates.length === 0 && search && (<div className="px-4 py-12 text-center"><div className="text-3xl mb-3">🔍</div><p className="text-sm text-zinc-400">No templates found for "{search}"</p></div>)}
            </div>
          </div>
        </>
      )}
    </div>
  );
});

const TemplateItem = memo(function TemplateItem({ name, subtitle, onClick }: { name: string; subtitle?: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-full px-3 py-2.5 text-left hover:bg-zinc-800/50 rounded-xl transition-all duration-200 group border border-transparent hover:border-zinc-700/30">
      <div className="flex items-center justify-between">
        <div><div className="text-sm text-zinc-200 group-hover:text-white font-medium">{name}</div>{subtitle && <div className="text-[11px] text-zinc-500 mt-0.5">{subtitle}</div>}</div>
        <svg className="w-4 h-4 text-zinc-600 group-hover:text-emerald-400 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
      </div>
    </button>
  );
});

const STARTER_CODE = `// Algorhythm - Live DJ Performance
// Press Shift+Enter to run

dj.bpm = 128;
let tick = 0;

dj.loop('16n', (time) => {
  const bar = Math.floor(tick / 16);
  
  // Kick on every beat
  if (tick % 4 === 0) {
    dj.kick.triggerAttackRelease('C1', '8n', time);
  }
  
  // Hi-hat on offbeats
  if (tick % 2 === 1) {
    dj.hihat.triggerAttackRelease('C1', '32n', time);
  }
  
  tick++;
});`;

const FOUR_ON_FLOOR = `// Four on the Floor
dj.bpm = 126;
let tick = 0;

dj.loop('16n', (time) => {
  if (tick % 4 === 0) dj.kick.triggerAttackRelease('C1', '8n', time);
  if (tick % 8 === 4) dj.snare.triggerAttackRelease('C1', '8n', time);
  dj.hihat.triggerAttackRelease('C1', '32n', time);
  tick++;
});`;

const BREAKBEAT = `// Breakbeat Pattern
dj.bpm = 140;
let tick = 0;

dj.loop('16n', (time) => {
  const pattern = tick % 16;
  if ([0, 6, 10].includes(pattern)) dj.kick.triggerAttackRelease('C1', '8n', time);
  if ([4, 12].includes(pattern)) dj.snare.triggerAttackRelease('C1', '8n', time);
  if (tick % 2 === 0) dj.hihat.triggerAttackRelease('C1', '32n', time);
  tick++;
});`;
