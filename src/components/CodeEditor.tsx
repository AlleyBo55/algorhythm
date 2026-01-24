'use client';

import { memo, useCallback, useEffect, useRef, useState } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';
import { editor } from 'monaco-editor';
import { dj } from '@/engine/djapi';
import { AIAssistant } from './AIAssistant';
import { Play, Square, Save, FolderOpen, Undo, Redo, Settings, Code2, Search, FileText } from 'lucide-react';

type IStandaloneCodeEditor = editor.IStandaloneCodeEditor;

export const CodeEditorPanel = memo(function CodeEditorPanel() {
  const [code, setCode] = useState(getStarterCode());
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState(14);
  const [showSettings, setShowSettings] = useState(false);
  const [theme, setTheme] = useState<'vs-dark' | 'light'>('vs-dark');
  const [minimap, setMinimap] = useState(true);
  const editorRef = useRef<IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);

  const handleEditorDidMount = useCallback((editor: IStandaloneCodeEditor, monaco: Monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Register custom language features for Algorhythm
    monaco.languages.registerCompletionItemProvider('typescript', {
      provideCompletionItems: (model: any, position: any) => {
        const suggestions: any[] = [
          // DJ API completions
          {
            label: 'dj.bpm',
            kind: monaco.languages.CompletionItemKind.Property,
            insertText: 'dj.bpm = ${1:128};',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Set global BPM (beats per minute)'
          },
          {
            label: 'dj.loop',
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: 'dj.loop(\'${1:16n}\', (time) => {\n\t${2}\n});',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Create a timed loop'
          },
          {
            label: 'dj.deck.A.load',
            kind: monaco.languages.CompletionItemKind.Method,
            insertText: 'await dj.deck.A.load(\'${1:/audio/track.mp3}\');',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Load audio file into deck A'
          },
          {
            label: 'dj.deck.A.play',
            kind: monaco.languages.CompletionItemKind.Method,
            insertText: 'dj.deck.A.play();',
            documentation: 'Start playing deck A'
          },
          {
            label: 'dj.kick.triggerAttackRelease',
            kind: monaco.languages.CompletionItemKind.Method,
            insertText: 'dj.kick.triggerAttackRelease(\'${1:C1}\', \'${2:8n}\', time);',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Trigger kick drum'
          },
          {
            label: 'dj.effects.reverb.set',
            kind: monaco.languages.CompletionItemKind.Method,
            insertText: 'dj.effects.reverb.set({ wet: ${1:0.3}, decay: ${2:2.5} });',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: 'Configure reverb effect'
          },
        ];
        return { suggestions };
      }
    });

    // Add keyboard shortcuts
    editor.addCommand(monaco.KeyMod.Shift | monaco.KeyCode.Enter, () => {
      handleRunAndNotify();
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      handleSave();
    });

    // Load saved code
    const saved = localStorage.getItem('algorhythm_saved_code');
    if (saved && saved !== getStarterCode()) {
      setCode(saved);
    }
  }, []);

  const handleRun = useCallback(() => {
    const currentCode = editorRef.current?.getValue() || code;
    try {
      setError(null);
      const { runner } = require('@/engine/runner');
      runner.execute(currentCode);
      setIsRunning(true);
    } catch (err: any) {
      setError(err?.message || String(err));
    }
  }, [code]);

  // Toast State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'warning' } | null>(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Extended Run Handler
  const handleRunAndNotify = useCallback(() => {
    handleRun();
    if (!error) {
      // Simple heuristic: check if any deck has a track
      const hasTrack = dj.deck.A.duration > 0 || dj.deck.B.duration > 0;
      if (hasTrack) {
        setToast({ message: 'Code Executed Successfully', type: 'success' });
      } else {
        setToast({ message: 'Code Ran (Warning: No tracks loaded)', type: 'warning' });
      }
    }
  }, [handleRun, error]);

  const handleStop = useCallback(() => {
    dj.stop();
    setIsRunning(false);
  }, []);

  const handleSave = useCallback(() => {
    const currentCode = editorRef.current?.getValue() || code;
    localStorage.setItem('algorhythm_saved_code', currentCode);
    localStorage.setItem('algorhythm_saved_timestamp', Date.now().toString());
  }, [code]);

  const handleLoad = useCallback(() => {
    const saved = localStorage.getItem('algorhythm_saved_code');
    if (saved) {
      setCode(saved);
    }
  }, []);

  const handleFormat = useCallback(() => {
    editorRef.current?.getAction('editor.action.formatDocument')?.run();
  }, []);

  const handleFind = useCallback(() => {
    editorRef.current?.getAction('actions.find')?.run();
  }, []);

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const currentCode = editorRef.current?.getValue();
      if (currentCode) {
        localStorage.setItem('algorhythm_saved_code', currentCode);
      }
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full bg-black/40 backdrop-blur-xl rounded-xl border border-white/5 overflow-hidden shadow-2xl">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-2 border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-3 px-2">
          <div className="p-1.5 rounded-md bg-blue-500/10 text-blue-400">
            <Code2 className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold tracking-wider text-white/80 uppercase">Editor</span>
        </div>

        <div className="flex items-center gap-1">
          <ToolbarButton onClick={() => editorRef.current?.trigger('keyboard', 'undo', null)} icon={Undo} tooltip="Undo" />
          <ToolbarButton onClick={() => editorRef.current?.trigger('keyboard', 'redo', null)} icon={Redo} tooltip="Redo" />
          <div className="w-px h-4 bg-white/10 mx-1" />
          <ToolbarButton onClick={handleFind} icon={Search} tooltip="Find" />
          <ToolbarButton onClick={handleFormat} icon={FileText} tooltip="Format" />
          <div className="w-px h-4 bg-white/10 mx-1" />
          <ToolbarButton onClick={handleSave} icon={Save} tooltip="Save" />
          <ToolbarButton onClick={handleLoad} icon={FolderOpen} tooltip="Load" />
          <ToolbarButton onClick={() => setShowSettings(!showSettings)} icon={Settings} tooltip="Settings" />
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="p-4 border-b border-white/5 bg-black/60 space-y-4 animate-accordion-down">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-wider text-muted-foreground">Font Size</label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="10"
                max="24"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="flex-1 h-1 bg-white/10 rounded-full appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
              />
              <span className="text-xs font-mono w-8 text-right text-white">{fontSize}px</span>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-wider text-muted-foreground">Theme</label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value as 'vs-dark' | 'light')}
              className="w-full bg-white/5 border border-white/10 rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-primary/50"
            >
              <option value="vs-dark">Dark Pro</option>
              <option value="light">Light (Why?)</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={minimap}
              onChange={(e) => setMinimap(e.target.checked)}
              className="rounded border-white/20 bg-white/5 text-primary focus:ring-primary/20"
            />
            <label className="text-xs text-white">Show Minimap</label>
          </div>
        </div>
      )}

      {/* Monaco Editor Wrapper */}
      <div className="flex-1 relative bg-[#1e1e1e]/50 backdrop-blur-sm">
        <Editor
          height="100%"
          defaultLanguage="typescript"
          value={code}
          onChange={(value) => setCode(value || '')}
          onMount={handleEditorDidMount}
          theme={theme}
          options={{
            fontSize,
            minimap: { enabled: minimap },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            fontLigatures: true,
            wordWrap: 'on',
            lineNumbers: 'on',
            renderLineHighlight: 'all', // 'line' | 'gutter' | 'none' | 'all'
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            smoothScrolling: true,
            folding: true,
            padding: { top: 16, bottom: 16 },
            roundedSelection: true,
            contextmenu: true,

            // Visual tweaks to blend better
            guides: {
              bracketPairs: true,
              indentation: true,
            },
            suggest: {
              showKeywords: true,
              showSnippets: true,
            },
            quickSuggestions: {
              other: true,
              comments: false,
              strings: true,
            },
            parameterHints: { enabled: true },
            formatOnPaste: true,
            formatOnType: true,
          }}
        />
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className={`absolute top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full border backdrop-blur-md shadow-xl z-50 animate-slide-up flex items-center gap-2 ${toast.type === 'success'
          ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
          : 'bg-amber-500/20 border-amber-500/50 text-amber-300'
          }`}>
          <div className={`w-2 h-2 rounded-full ${toast.type === 'success' ? 'bg-emerald-400' : 'bg-amber-400'} animate-pulse`} />
          <span className="text-xs font-medium">{toast.message}</span>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="p-3 bg-red-500/10 border-t border-red-500/20 backdrop-blur-md animate-slide-up">
          <div className="flex items-start gap-2">
            <span className="text-red-400 font-bold">⚠</span>
            <p className="text-red-300 text-xs font-mono break-all">{error}</p>
          </div>
        </div>
      )}

      {/* Bottom Control Bar */}
      <div className="flex items-center justify-between p-3 border-t border-white/5 bg-black/40 backdrop-blur-md">
        <div className="flex gap-2">
          <button
            onClick={handleRunAndNotify}
            disabled={isRunning}
            className={`
                group relative flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all duration-300
                ${isRunning
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white shadow-lg shadow-emerald-900/20 hover:shadow-emerald-900/40 hover:scale-[1.02] active:scale-[0.98]'}
            `}
          >
            {isRunning ? (
              <>
                <div className="w-2 h-2 rounded-full bg-zinc-500" />
                Running...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                Run Code
                <span className="hidden opacity-50 text-[10px] font-normal group-hover:inline ml-1">(Shift+Enter)</span>
              </>
            )}
          </button>

          <button
            onClick={handleStop}
            disabled={!isRunning}
            className={`
                flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${!isRunning
                ? 'bg-transparent text-zinc-600 cursor-not-allowed'
                : 'bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 border border-red-500/20'}
            `}
          >
            <Square className="w-3 h-3 fill-current" />
            Stop
          </button>
        </div>

        <div className="flex items-center gap-4 text-[10px] font-mono text-zinc-500">
          {isRunning ? <span className="text-emerald-400 animate-pulse">● LIVE</span> : <span>○ READY</span>}
          <div className="h-3 w-px bg-zinc-800" />
          <span>Ln {editorRef.current?.getPosition()?.lineNumber || 1}, Col {editorRef.current?.getPosition()?.column || 1}</span>
        </div>
      </div>

      <TemplateSelector onSelect={setCode} />

      <AIAssistant
        onCodeInsert={(newCode) => setCode(newCode)}
        getCurrentCode={() => editorRef.current?.getValue() || code}
      />
    </div>
  );
});

const ToolbarButton = ({ onClick, icon: Icon, tooltip }: { onClick: () => void, icon: any, tooltip: string }) => (
  <button
    onClick={onClick}
    className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-md transition-colors relative group"
    title={tooltip}
  >
    <Icon className="w-4 h-4" />
  </button>
)


const TemplateSelector = memo(function TemplateSelector({
  onSelect
}: {
  onSelect: (code: string) => void
}) {
  const templates = [
    { name: 'Starter', code: getStarterCode() },
    { name: 'Alan Walker', code: getAlanWalkerTemplate() },
    { name: 'Marshmello', code: getMarshmelloTemplate() },
    { name: 'Deadmau5', code: getDeadmau5Template() },
  ];

  return (
    <div className="p-3 border-t border-zinc-800">
      <label className="text-xs text-zinc-400 mb-2 block">Quick Templates</label>
      <div className="flex gap-2 flex-wrap">
        {templates.map((t) => (
          <button
            key={t.name}
            onClick={() => onSelect(t.code)}
            className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs rounded-lg transition-colors"
          >
            {t.name}
          </button>
        ))}
      </div>
    </div>
  );
});

function getStarterCode(): string {
  return `// Algorhythm - Live DJ Performance
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
}

function getAlanWalkerTemplate(): string {
  return `// Alan Walker - Faded Style
// Melodic future bass with emotional chords

dj.bpm = 90;

const chords = [
  ['F#3', 'A3', 'C#4'], // F#m
  ['D3', 'F#3', 'A3'],  // D
  ['A3', 'C#4', 'E4'],  // A
  ['E3', 'G#3', 'B3']   // E
];

const melody = ['C#5', 'B4', 'A4', 'F#4', 'E4', 'F#4', 'A4', 'B4'];

let tick = 0;

dj.loop('16n', (time) => {
  const bar = Math.floor(tick / 16);
  const beat = tick % 16;
  
  // Signature pluck melody
  if (tick % 2 === 0) {
    const note = melody[(tick / 2) % 8];
    dj.synth.triggerAttackRelease(note, '8n', time);
  }
  
  // Emotional chord progression
  if (beat === 0) {
    const chord = chords[bar % 4];
    dj.pad.triggerAttackRelease(chord, '1m', time);
  }
  
  // Kick pattern (drop)
  if (bar >= 8 && tick % 4 === 0) {
    dj.kick.triggerAttackRelease('C1', '8n', time);
  }
  
  tick++;
});`;
}

function getMarshmelloTemplate(): string {
  return `// Marshmello - Alone Style
// Bouncy future bass

dj.bpm = 140;

const bassline = ['E2', 'E2', 'C#2', 'A1', 'B1', 'B1', 'G#1', 'E1'];
let tick = 0;

dj.loop('16n', (time) => {
  const bar = Math.floor(tick / 16);
  
  // Kick pattern
  if (tick % 8 === 0 || tick % 8 === 6) {
    dj.kick.triggerAttackRelease('C1', '8n', time);
  }
  
  // Bouncy bassline
  if (bar >= 8 && tick % 2 === 0) {
    const note = bassline[(tick / 2) % 8];
    dj.bass.triggerAttackRelease(note, '16n', time);
  }
  
  // Hi-hat rolls
  if (tick % 2 === 1) {
    dj.hihat.triggerAttackRelease('C1', '32n', time);
  }
  
  tick++;
});`;
}

function getDeadmau5Template(): string {
  return `// Deadmau5 - Strobe Style
// Progressive house with long builds

dj.bpm = 128;

const progression = [
  ['F#3', 'A3', 'C#4'], // F#m
  ['D3', 'F#3', 'A3'],  // D
  ['A3', 'C#4', 'E4'],  // A
  ['E3', 'G#3', 'B3']   // E
];

let tick = 0;

dj.loop('16n', (time) => {
  const bar = Math.floor(tick / 16);
  const beat = tick % 16;
  
  // Minimal kick (only after build)
  if (bar >= 16 && tick % 4 === 0) {
    dj.kick.triggerAttackRelease('C1', '8n', time);
  }
  
  // Emotional chord progression
  if (beat === 0) {
    const chord = progression[bar % 4];
    dj.pad.triggerAttackRelease(chord, '2m', time);
  }
  
  // Signature arp (builds slowly)
  if (bar >= 8 && tick % 2 === 0) {
    const notes = ['F#4', 'A4', 'C#5', 'E5'];
    const note = notes[(tick / 2) % 4];
    dj.synth.triggerAttackRelease(note, '16n', time);
  }
  
  tick++;
});`;
}
