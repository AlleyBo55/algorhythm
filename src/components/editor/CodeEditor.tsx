'use client';

import { memo, useCallback, useEffect, useRef, useState, useMemo } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';
import { editor } from 'monaco-editor';
import { motion, AnimatePresence } from 'framer-motion';
import { dj } from '@/engine/djapi';
import { audioEngine } from '@/engine/audio';
import { preloadSamplesFromCode, ALL_SAMPLES, getSamplesStatusFromCode, type SampleStatus } from '@/engine/sampleCache';
import { waitForSamplersLoaded } from '@/engine/instruments';
import { nativeAudio } from '@/engine/nativeAudio';
import { CompilationOverlay, PlaybackStartEffect, LiveIndicator, type CompilationPhase } from './CompilationOverlay';

type IStandaloneCodeEditor = editor.IStandaloneCodeEditor;

// Custom theme colors
const THEME_COLORS = {
  bg: '#08080a',
  bgLight: '#0d0d10',
  border: 'rgba(255,255,255,0.06)',
  accent: '#10b981',
  accentCyan: '#06b6d4',
  accentAmber: '#f59e0b',
};

export const CodeEditorPanel = memo(function CodeEditorPanel() {
  const [code, setCode] = useState(STARTER_CODE);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);
  const [compilePhase, setCompilePhase] = useState<CompilationPhase>('analyzing');
  const [compileProgress, setCompileProgress] = useState(0);
  const [compileMessage, setCompileMessage] = useState('');
  const [showPlaybackEffect, setShowPlaybackEffect] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cursorLine, setCursorLine] = useState(1);
  const [sampleStatuses, setSampleStatuses] = useState<SampleStatus[]>([]);
  const [showSamplePanel, setShowSamplePanel] = useState(false);
  const editorRef = useRef<IStandaloneCodeEditor | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse code for samples and check their status
  const checkSampleStatuses = useCallback(async (codeToCheck: string) => {
    try {
      const statuses = await getSamplesStatusFromCode(codeToCheck);
      // Filter to only show samples actually used in code
      const sampleRegex = /dj\.sample\s*\(\s*['"]([^'"]+)['"]/g;
      const usedSamples = new Set<string>();
      let match;
      while ((match = sampleRegex.exec(codeToCheck)) !== null) {
        usedSamples.add(match[1]);
      }
      // Show used samples + any with errors
      const relevant = statuses.filter(s => 
        usedSamples.has(s.path) || 
        usedSamples.has(s.path.replace('.mp3', '')) ||
        s.error
      );
      setSampleStatuses(relevant);
    } catch {
      // Ignore errors during status check
    }
  }, []);

  // Debounced sample status check
  useEffect(() => {
    const timer = setTimeout(() => {
      checkSampleStatuses(code);
    }, 500);
    return () => clearTimeout(timer);
  }, [code, checkSampleStatuses]);

  // Sample status summary
  const sampleSummary = useMemo(() => {
    const cached = sampleStatuses.filter(s => s.cached && !s.error).length;
    const needsDownload = sampleStatuses.filter(s => !s.cached && !s.error).length;
    const failed = sampleStatuses.filter(s => s.error).length;
    return { cached, needsDownload, failed, total: sampleStatuses.length };
  }, [sampleStatuses]);

  const handleEditorMount = useCallback((editor: IStandaloneCodeEditor, monaco: Monaco) => {
    editorRef.current = editor;
    setError(null);
    
    // Custom dark theme
    monaco.editor.defineTheme('algorhythm', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '4a5568', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'c678dd' },
        { token: 'string', foreground: '98c379' },
        { token: 'number', foreground: 'd19a66' },
        { token: 'type', foreground: 'e5c07b' },
        { token: 'function', foreground: '61afef' },
        { token: 'variable', foreground: 'e06c75' },
        { token: 'operator', foreground: '56b6c2' },
      ],
      colors: {
        'editor.background': THEME_COLORS.bg,
        'editor.foreground': '#abb2bf',
        'editor.lineHighlightBackground': '#ffffff08',
        'editor.selectionBackground': '#10b98130',
        'editorCursor.foreground': '#10b981',
        'editorLineNumber.foreground': '#ffffff15',
        'editorLineNumber.activeForeground': '#ffffff40',
        'editor.selectionHighlightBackground': '#10b98120',
        'editorIndentGuide.background': '#ffffff08',
        'editorIndentGuide.activeBackground': '#ffffff15',
      }
    });
    monaco.editor.setTheme('algorhythm');
    
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: false,
    });
    
    // Completions
    monaco.languages.registerCompletionItemProvider('typescript', {
      provideCompletionItems: () => ({
        suggestions: [
          { label: 'dj.bpm', kind: monaco.languages.CompletionItemKind.Property, insertText: 'dj.bpm = ${1:128};', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Set global BPM' },
          { label: 'dj.loop', kind: monaco.languages.CompletionItemKind.Function, insertText: "dj.loop('${1:16n}', (time) => {\n\t${2}\n});", insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, documentation: 'Create a timed loop' },
          { label: 'dj.kick', kind: monaco.languages.CompletionItemKind.Method, insertText: "dj.kick.triggerAttackRelease('${1:C1}', '${2:8n}', time);", insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet },
          { label: 'dj.snare', kind: monaco.languages.CompletionItemKind.Method, insertText: "dj.snare.triggerAttackRelease('${1:C1}', '${2:8n}', time);", insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet },
          { label: 'dj.hihat', kind: monaco.languages.CompletionItemKind.Method, insertText: "dj.hihat.triggerAttackRelease('${1:C1}', '${2:32n}', time);", insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet },
          { label: 'dj.fadedPiano', kind: monaco.languages.CompletionItemKind.Method, insertText: "dj.fadedPiano.triggerAttackRelease(['${1:C4}', '${2:E4}', '${3:G4}'], '${4:2n}', time);", insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet },
          { label: 'dj.supersaw', kind: monaco.languages.CompletionItemKind.Method, insertText: "dj.supersaw.triggerAttackRelease('${1:C4}', '${2:8n}', time);", insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet },
        ],
      }),
    });
    
    editor.addCommand(monaco.KeyMod.Shift | monaco.KeyCode.Enter, () => handleRun());
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => handleSave());
    editor.onDidChangeCursorPosition(e => setCursorLine(e.position.lineNumber));
    
    const saved = localStorage.getItem('algorhythm_code');
    if (saved) setCode(saved);
  }, []);

  const handleRun = useCallback(async () => {
    const currentCode = editorRef.current?.getValue() || code;
    try {
      setError(null); setIsCompiling(true); setCompileProgress(0);
      setCompilePhase('analyzing'); setCompileMessage('Initializing...'); setCompileProgress(5);
      await nativeAudio.init();
      const Tone = await import('tone');
      if (Tone.getContext().state !== 'running') await Tone.start();
      await Tone.getContext().resume();
      setCompileProgress(15);

      setCompilePhase('downloading'); setCompileMessage('Fetching samples...');
      const preloadResult = await preloadSamplesFromCode(currentCode, (p) => {
        setCompileProgress(15 + (p.loaded / Math.max(p.total, 1)) * 25);
        setCompileMessage(`Downloading ${p.loaded}/${p.total}`);
      });
      
      // Update sample statuses after preload
      await checkSampleStatuses(currentCode);
      
      // Show warning if some samples failed but continue
      if (preloadResult.failed.length > 0) {
        console.warn(`⚠️ ${preloadResult.failed.length} samples failed to load:`, preloadResult.failed.map(f => f.path));
      }

      setCompilePhase('loading'); setCompileMessage('Decoding audio...'); setCompileProgress(45);
      await nativeAudio.preDecodeAllSamples([...ALL_SAMPLES], (loaded, total) => {
        setCompileProgress(45 + (loaded / total) * 25);
        setCompileMessage(`Decoding ${loaded}/${total}`);
      });

      setCompileMessage('Loading synths...'); setCompileProgress(75);
      await waitForSamplersLoaded();

      setCompileMessage('Warming up...'); setCompileProgress(85);
      nativeAudio.playDrum('kick', { volume: -60 });
      nativeAudio.playDrum('snare', { volume: -60 });
      nativeAudio.playDrum('hihat', { volume: -60 });
      const inst = (await import('@/engine/instruments')).getInstruments();
      const warmupTime = Tone.now() + 0.05;
      try {
        inst.fadedPiano?.triggerAttackRelease('C4', '32n', warmupTime, 0.001);
        inst.fadedPluck?.triggerAttackRelease('C4', '32n', warmupTime, 0.001);
        inst.supersaw?.triggerAttackRelease(['C4'], '32n', warmupTime, 0.001);
      } catch {}
      await new Promise(r => setTimeout(r, 150));

      setCompilePhase('compiling'); setCompileMessage('Building...'); setCompileProgress(92);
      await new Promise(r => setTimeout(r, 80));

      setCompilePhase('running'); setCompileMessage('Starting...'); setCompileProgress(96);
      const { runner } = require('@/engine/runner');
      runner.execute(currentCode);

      setCompilePhase('success'); setCompileProgress(100); 
      setCompileMessage(preloadResult.failed.length > 0 
        ? `Playing (${preloadResult.failed.length} samples missing)` 
        : 'Playing');
      setTimeout(() => { setIsCompiling(false); setIsRunning(true); setShowPlaybackEffect(true); }, 400);
    } catch (err: any) {
      setCompilePhase('error'); setCompileMessage(err?.message || String(err)); setError(err?.message || String(err));
      setTimeout(() => setIsCompiling(false), 1200);
    }
  }, [code, checkSampleStatuses]);

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
    <div 
      ref={containerRef}
      className="h-full flex flex-col overflow-hidden relative group"
      style={{ background: THEME_COLORS.bg }}
    >
      {/* Ambient glow when running */}
      <AnimatePresence>
        {isRunning && (
          <motion.div 
            className="absolute inset-0 pointer-events-none z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div 
              className="absolute top-0 left-0 w-full h-32 opacity-30"
              style={{ 
                background: `radial-gradient(ellipse at top, ${THEME_COLORS.accent}20 0%, transparent 70%)`,
                animation: 'pulse 2s ease-in-out infinite'
              }} 
            />
            <div 
              className="absolute bottom-0 right-0 w-1/2 h-24 opacity-20"
              style={{ 
                background: `radial-gradient(ellipse at bottom right, ${THEME_COLORS.accentCyan}30 0%, transparent 70%)`
              }} 
            />
          </motion.div>
        )}
      </AnimatePresence>

      {isCompiling && <CompilationOverlay phase={compilePhase} progress={compileProgress} message={compileMessage} onClose={() => setIsCompiling(false)} />}
      {showPlaybackEffect && <PlaybackStartEffect onComplete={() => setShowPlaybackEffect(false)} />}
      
      {/* Header - Artsy minimal */}
      <div className="h-9 px-3 flex items-center justify-between border-b relative z-10" style={{ borderColor: THEME_COLORS.border }}>
        <div className="flex items-center gap-3">
          {/* File indicator */}
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-white/10" />
              <div className="w-2 h-2 rounded-full bg-white/10" />
              <div className="w-2 h-2 rounded-full bg-white/10" />
            </div>
            <span className="text-[10px] text-white/30 font-mono tracking-wide">main.ts</span>
          </div>
          
          {/* Separator */}
          <div className="w-px h-3 bg-white/[0.06]" />
          
          {/* Language badge */}
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/[0.03]">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            <span className="text-[9px] text-white/40">TypeScript</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {isRunning && <LiveIndicator />}
          
          {/* Sample Status Indicator */}
          {sampleSummary.total > 0 && (
            <div className="relative">
              <button
                onClick={() => setShowSamplePanel(!showSamplePanel)}
                className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/[0.03] hover:bg-white/[0.06] transition-colors"
              >
                {sampleSummary.failed > 0 ? (
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                ) : sampleSummary.needsDownload > 0 ? (
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                )}
                <span className="text-[9px] text-white/40">
                  {sampleSummary.cached}/{sampleSummary.total} samples
                </span>
              </button>
              
              {/* Sample Status Panel */}
              <AnimatePresence>
                {showSamplePanel && (
                  <>
                    <motion.div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowSamplePanel(false)}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    />
                    <motion.div
                      className="absolute top-full right-0 mt-2 w-56 rounded-lg overflow-hidden z-50"
                      style={{ 
                        background: 'rgba(13,13,16,0.98)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        boxShadow: '0 15px 40px -10px rgba(0,0,0,0.7)'
                      }}
                      initial={{ opacity: 0, y: -5, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -5, scale: 0.95 }}
                    >
                      <div className="p-2 border-b border-white/[0.06]">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-white/50 font-medium">Sample Status</span>
                          <div className="flex items-center gap-2 text-[8px]">
                            {sampleSummary.cached > 0 && (
                              <span className="text-emerald-400">✓ {sampleSummary.cached}</span>
                            )}
                            {sampleSummary.needsDownload > 0 && (
                              <span className="text-amber-400">↓ {sampleSummary.needsDownload}</span>
                            )}
                            {sampleSummary.failed > 0 && (
                              <span className="text-red-400">✗ {sampleSummary.failed}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="max-h-48 overflow-y-auto p-1.5 space-y-0.5">
                        {sampleStatuses.map((s) => (
                          <div 
                            key={s.path}
                            className="flex items-center gap-2 px-2 py-1 rounded text-[9px]"
                            style={{ background: s.error ? 'rgba(239,68,68,0.1)' : 'transparent' }}
                          >
                            {s.error ? (
                              <div className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                            ) : s.cached ? (
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                            ) : (
                              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                            )}
                            <span className={`truncate flex-1 font-mono ${s.error ? 'text-red-400' : 'text-white/50'}`}>
                              {s.path.replace('.mp3', '')}
                            </span>
                            {s.error && (
                              <span className="text-[8px] text-red-400/70 truncate max-w-20" title={s.error}>
                                missing
                              </span>
                            )}
                          </div>
                        ))}
                        {sampleStatuses.length === 0 && (
                          <div className="text-[9px] text-white/30 text-center py-2">
                            No samples in code
                          </div>
                        )}
                      </div>
                      <div className="p-2 border-t border-white/[0.06]">
                        <div className="text-[8px] text-white/30 space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span>Cached (instant)</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            <span>Needs download</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                            <span>Not found on CDN</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          )}
          
          <div className="flex items-center gap-1.5 text-[9px] text-white/20 font-mono">
            <span>Ln {cursorLine}</span>
          </div>
        </div>
      </div>
      
      {/* Editor with custom styling */}
      <div className="flex-1 min-h-0 relative z-10">
        {/* Running indicator line */}
        <AnimatePresence>
          {isRunning && (
            <motion.div 
              className="absolute top-0 left-0 right-0 h-px z-20"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              exit={{ scaleX: 0, opacity: 0 }}
              style={{ 
                background: `linear-gradient(90deg, transparent, ${THEME_COLORS.accent}, transparent)`,
                transformOrigin: 'left'
              }}
            />
          )}
        </AnimatePresence>
        
        <Editor 
          height="100%" 
          defaultLanguage="typescript" 
          value={code} 
          onChange={v => setCode(v || '')} 
          onMount={handleEditorMount} 
          theme="algorhythm"
          options={{ 
            fontSize: 13, 
            lineHeight: 22, 
            fontFamily: "'JetBrains Mono', 'Fira Code', 'SF Mono', monospace", 
            fontLigatures: true, 
            minimap: { enabled: false }, 
            scrollBeyondLastLine: false, 
            automaticLayout: true, 
            tabSize: 2, 
            wordWrap: 'on', 
            lineNumbers: 'on', 
            renderLineHighlight: 'line', 
            cursorBlinking: 'smooth', 
            cursorSmoothCaretAnimation: 'on', 
            smoothScrolling: true, 
            padding: { top: 20, bottom: 20 }, 
            scrollbar: { 
              verticalScrollbarSize: 6, 
              horizontalScrollbarSize: 6,
              useShadows: false
            },
            overviewRulerBorder: false,
            hideCursorInOverviewRuler: true,
            renderLineHighlightOnlyWhenFocus: false,
            guides: {
              indentation: true,
              bracketPairs: true
            }
          }} 
        />
      </div>
      
      {/* Error display */}
      <AnimatePresence>
        {error && !isCompiling && (
          <motion.div 
            className="px-3 py-2 flex items-center gap-2 border-t"
            style={{ borderColor: 'rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.05)' }}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <p className="text-[10px] text-red-400 font-mono truncate flex-1">{error}</p>
            <button onClick={() => setError(null)} className="text-red-400/50 hover:text-red-400 transition-colors">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Footer - Artsy controls */}
      <div className="h-11 px-3 flex items-center justify-between border-t relative z-10" style={{ borderColor: THEME_COLORS.border }}>
        <div className="flex items-center gap-2">
          {/* Run button - prominent, animated */}
          <motion.button 
            onClick={handleRun} 
            disabled={isRunning || isCompiling}
            className="relative overflow-hidden"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className={`h-7 px-4 rounded-lg font-medium text-[10px] flex items-center gap-1.5 transition-all ${
              isRunning || isCompiling 
                ? 'bg-white/[0.03] text-white/20 cursor-not-allowed' 
                : 'bg-emerald-500 text-black hover:bg-emerald-400'
            }`}>
              {isCompiling ? (
                <>
                  <motion.div 
                    className="w-2.5 h-2.5 border border-current border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                  <span>Compiling</span>
                </>
              ) : (
                <>
                  <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  <span>Run</span>
                </>
              )}
            </div>
          </motion.button>
          
          {/* Stop button */}
          <AnimatePresence>
            {isRunning && (
              <motion.button 
                onClick={handleStop}
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 'auto', opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="h-7 px-3 rounded-lg text-[10px] font-medium bg-white/[0.04] text-white/50 hover:bg-white/[0.08] hover:text-white/80 transition-all flex items-center gap-1.5 overflow-hidden"
              >
                <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="6" width="12" height="12" rx="1" />
                </svg>
                <span>Stop</span>
              </motion.button>
            )}
          </AnimatePresence>
          
          {/* Keyboard hint */}
          <div className="hidden sm:flex items-center gap-1 ml-2">
            <kbd className="px-1.5 py-0.5 rounded bg-white/[0.04] text-[8px] text-white/25 font-mono">⇧</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-white/[0.04] text-[8px] text-white/25 font-mono">↵</kbd>
          </div>
        </div>
        
        <TemplateSelector onSelect={setCode} />
      </div>
    </div>
  );
});

// Template selector with artsy dropdown
const TemplateSelector = memo(function TemplateSelector({ onSelect }: { onSelect: (code: string) => void }) {
  const [open, setOpen] = useState(false);
  const [templates, setTemplates] = useState<ReturnType<typeof import('@/data/templates').getTemplates>>([]);
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);

  useEffect(() => {
    import('@/data/templates').then(m => setTemplates(m.getTemplates()));
  }, []);

  const grouped = templates.reduce((acc, t) => {
    if (!acc[t.persona]) acc[t.persona] = [];
    acc[t.persona].push(t);
    return acc;
  }, {} as Record<string, typeof templates>);

  return (
    <div className="relative">
      <motion.button 
        onClick={() => setOpen(!open)} 
        className="h-7 px-3 rounded-lg text-[10px] text-white/40 hover:text-white/70 bg-white/[0.02] hover:bg-white/[0.05] transition-all flex items-center gap-2"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <span>Templates</span>
        <span className="text-[8px] text-emerald-400/80 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">{templates.length}</span>
      </motion.button>
      
      <AnimatePresence>
        {open && (
          <>
            <motion.div 
              className="fixed inset-0 z-40" 
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div 
              className="absolute bottom-full right-0 mb-2 w-64 rounded-xl overflow-hidden z-50"
              style={{ 
                background: 'rgba(13,13,16,0.98)',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8)'
              }}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              {/* Header */}
              <div className="p-3 border-b border-white/[0.06]">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-white/50 font-medium">Templates</span>
                  <span className="text-[9px] text-white/30">{templates.length} available</span>
                </div>
              </div>
              
              {/* Content */}
              <div className="max-h-[50vh] overflow-y-auto p-2 space-y-3">
                {/* Basics */}
                <TemplateGroup title="Basics">
                  <TemplateItem 
                    name="Starter" 
                    desc="Basic beat template"
                    onClick={() => { onSelect(STARTER_CODE); setOpen(false); }}
                    onHover={setHoveredTemplate}
                    isHovered={hoveredTemplate === 'Starter'}
                  />
                  <TemplateItem 
                    name="Four on the Floor" 
                    desc="Classic house pattern"
                    onClick={() => { onSelect(FOUR_ON_FLOOR); setOpen(false); }}
                    onHover={setHoveredTemplate}
                    isHovered={hoveredTemplate === 'Four on the Floor'}
                  />
                  <TemplateItem 
                    name="Breakbeat" 
                    desc="Syncopated drums"
                    onClick={() => { onSelect(BREAKBEAT); setOpen(false); }}
                    onHover={setHoveredTemplate}
                    isHovered={hoveredTemplate === 'Breakbeat'}
                  />
                </TemplateGroup>
                
                {/* By Artist */}
                {Object.entries(grouped).map(([artist, items]) => (
                  <TemplateGroup key={artist} title={artist} count={items.length}>
                    {items.map(t => (
                      <TemplateItem 
                        key={t.id} 
                        name={t.name}
                        desc={t.description || ''}
                        onClick={() => { onSelect(t.code); setOpen(false); }}
                        onHover={setHoveredTemplate}
                        isHovered={hoveredTemplate === t.name}
                      />
                    ))}
                  </TemplateGroup>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
});

const TemplateGroup = memo(function TemplateGroup({ 
  title, 
  count, 
  children 
}: { 
  title: string; 
  count?: number; 
  children: React.ReactNode 
}) {
  return (
    <div>
      <div className="flex items-center gap-2 px-2 py-1">
        <span className="text-[9px] text-white/30 uppercase tracking-wider">{title}</span>
        {count && <span className="text-[8px] text-white/20">({count})</span>}
      </div>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
});

const TemplateItem = memo(function TemplateItem({ 
  name, 
  desc,
  onClick, 
  onHover,
  isHovered
}: { 
  name: string; 
  desc?: string;
  onClick: () => void;
  onHover: (name: string | null) => void;
  isHovered: boolean;
}) {
  return (
    <motion.button 
      onClick={onClick}
      onMouseEnter={() => onHover(name)}
      onMouseLeave={() => onHover(null)}
      className="w-full px-2 py-1.5 text-left rounded-lg transition-all relative overflow-hidden"
      style={{ 
        background: isHovered ? 'rgba(16,185,129,0.08)' : 'transparent'
      }}
      whileHover={{ x: 4 }}
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-white/70">{name}</span>
        {isHovered && (
          <motion.svg 
            className="w-3 h-3 text-emerald-400"
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <path d="M9 5l7 7-7 7" />
          </motion.svg>
        )}
      </div>
      {desc && <p className="text-[9px] text-white/30 mt-0.5 truncate">{desc}</p>}
    </motion.button>
  );
});

// Starter templates
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

export default CodeEditorPanel;
