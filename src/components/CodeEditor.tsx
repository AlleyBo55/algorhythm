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

    // Register custom language features for RhythmCode
    monaco.languages.registerCompletionItemProvider('typescript', {
      provideCompletionItems: (model, position) => {
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
      handleRun();
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      handleSave();
    });

    // Load saved code
    const saved = localStorage.getItem('rhythmcode_saved_code');
    if (saved && saved !== getStarterCode()) {
      setCode(saved);
    }
  }, []);

  const handleRun = useCallback(() => {
    const currentCode = editorRef.current?.getValue() || code;
    try {
      setError(null);
      const fn = new Function('dj', currentCode);
      fn(dj);
      setIsRunning(true);
    } catch (err) {
      setError((err as Error).message);
    }
  }, [code]);

  const handleStop = useCallback(() => {
    dj.stop();
    setIsRunning(false);
  }, []);

  const handleSave = useCallback(() => {
    const currentCode = editorRef.current?.getValue() || code;
    localStorage.setItem('rhythmcode_saved_code', currentCode);
    localStorage.setItem('rhythmcode_saved_timestamp', Date.now().toString());
  }, [code]);

  const handleLoad = useCallback(() => {
    const saved = localStorage.getItem('rhythmcode_saved_code');
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
        localStorage.setItem('rhythmcode_saved_code', currentCode);
      }
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="code-editor bg-zinc-900 rounded-xl border border-zinc-800 flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Code2 className="w-5 h-5 text-blue-400" />
          <h3 className="text-sm font-bold text-white">Code Editor</h3>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => editorRef.current?.trigger('keyboard', 'undo', null)}
            className="p-2 hover:bg-zinc-800 rounded transition-colors"
            title="Undo (Ctrl+Z)"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            onClick={() => editorRef.current?.trigger('keyboard', 'redo', null)}
            className="p-2 hover:bg-zinc-800 rounded transition-colors"
            title="Redo (Ctrl+Y)"
          >
            <Redo className="w-4 h-4" />
          </button>
          <button
            onClick={handleFind}
            className="p-2 hover:bg-zinc-800 rounded transition-colors"
            title="Find (Ctrl+F)"
          >
            <Search className="w-4 h-4" />
          </button>
          <button
            onClick={handleFormat}
            className="p-2 hover:bg-zinc-800 rounded transition-colors"
            title="Format Code"
          >
            <FileText className="w-4 h-4" />
          </button>
          <button
            onClick={handleSave}
            className="p-2 hover:bg-zinc-800 rounded transition-colors"
            title="Save (Ctrl+S)"
          >
            <Save className="w-4 h-4" />
          </button>
          <button
            onClick={handleLoad}
            className="p-2 hover:bg-zinc-800 rounded transition-colors"
            title="Load Saved"
          >
            <FolderOpen className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-zinc-800 rounded transition-colors"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="p-3 border-b border-zinc-800 bg-zinc-950 space-y-3">
          <div className="flex items-center gap-4">
            <label className="text-xs text-zinc-400 w-20">Font Size:</label>
            <input
              type="range"
              min="10"
              max="24"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="flex-1"
            />
            <span className="text-xs text-zinc-400 w-12">{fontSize}px</span>
          </div>
          <div className="flex items-center gap-4">
            <label className="text-xs text-zinc-400 w-20">Theme:</label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value as 'vs-dark' | 'light')}
              className="flex-1 bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-xs"
            >
              <option value="vs-dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </div>
          <div className="flex items-center gap-4">
            <label className="text-xs text-zinc-400 w-20">Minimap:</label>
            <input
              type="checkbox"
              checked={minimap}
              onChange={(e) => setMinimap(e.target.checked)}
              className="w-4 h-4"
            />
          </div>
        </div>
      )}

      {/* Monaco Editor */}
      <div className="flex-1 relative">
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
            wordWrap: 'on',
            lineNumbers: 'on',
            renderLineHighlight: 'all',
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            smoothScrolling: true,
            folding: true,
            foldingStrategy: 'indentation',
            showFoldingControls: 'always',
            bracketPairColorization: { enabled: true },
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

      {/* Error Display */}
      {error && (
        <div className="p-3 bg-red-900/20 border-t border-red-900/50">
          <p className="text-red-400 text-xs font-mono">{error}</p>
        </div>
      )}

      {/* Control Bar */}
      <div className="flex items-center justify-between p-3 border-t border-zinc-800">
        <div className="flex gap-2">
          <button
            onClick={handleRun}
            disabled={isRunning}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-zinc-700 text-white rounded-lg transition-colors font-medium text-sm flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            Run (Shift+Enter)
          </button>
          <button
            onClick={handleStop}
            disabled={!isRunning}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-zinc-700 text-white rounded-lg transition-colors font-medium text-sm flex items-center gap-2"
          >
            <Square className="w-4 h-4" />
            Stop
          </button>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-xs text-zinc-500">
            {isRunning && <span className="text-green-400">● Running</span>}
            {!isRunning && <span>Ready</span>}
          </div>
          <div className="text-xs text-zinc-500">
            Line {editorRef.current?.getPosition()?.lineNumber || 1}, Col {editorRef.current?.getPosition()?.column || 1}
          </div>
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
  return `// RhythmCode - Live DJ Performance
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
