import * as monaco from 'monaco-editor';

export interface EditorConfig {
  theme: 'vs-dark' | 'vs-light';
  fontSize: number;
  minimap: boolean;
  lineNumbers: boolean;
}

export class LiveCodeEditor {
  private editor: monaco.editor.IStandaloneCodeEditor | null = null;
  private container: HTMLElement;
  private onExecute?: (code: string) => void;

  constructor(container: HTMLElement, config: Partial<EditorConfig> = {}) {
    this.container = container;
    this.initialize(config);
  }

  private initialize(config: Partial<EditorConfig>): void {
    // Monaco editor configuration
    this.editor = monaco.editor.create(this.container, {
      value: this.getStarterCode(),
      language: 'typescript',
      theme: config.theme || 'vs-dark',
      fontSize: config.fontSize || 14,
      minimap: { enabled: config.minimap ?? true },
      lineNumbers: config.lineNumbers ? 'on' : 'off',
      automaticLayout: true,
      scrollBeyondLastLine: false,
      wordWrap: 'on',
      tabSize: 2,
      quickSuggestions: true,
      suggestOnTriggerCharacters: true
    });

    // Add DJ API type definitions
    this.addTypeDefinitions();

    // Keyboard shortcuts
    this.editor.addCommand(
      monaco.KeyMod.Shift | monaco.KeyCode.Enter,
      () => this.execute()
    );

    this.editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
      () => this.save()
    );
  }

  private addTypeDefinitions(): void {
    const djApiTypes = `
      declare const dj: {
        deck: {
          A: Deck;
          B: Deck;
          C: Deck;
          D: Deck;
        };
        bpm: number;
        loop(interval: string, callback: (time: number) => void): void;
        sync: BeatSync;
        mixer: Mixer;
        record: RecordingEngine;
        midi: MIDIController;
      };

      interface Deck {
        play(): void;
        pause(): void;
        stop(): void;
        volume: number;
        eq: { low: number; mid: number; high: number };
        filter: { cutoff: number; resonance: number };
        effects: EffectsRack;
        vinyl: VinylMode;
        spectrum: SpectrumAnalyzer;
      }
    `;

    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      djApiTypes,
      'dj-api.d.ts'
    );
  }

  private getStarterCode(): string {
    return `// Algorhythm - Live DJ Performance
// Press SHIFT+ENTER to run

dj.bpm = 128;

let tick = 0;

dj.loop('16n', (time) => {
  const bar = Math.floor(tick / 16);
  
  // Your code here
  
  tick++;
});
`;
  }

  execute(): void {
    if (!this.editor) return;
    
    const code = this.editor.getValue();
    
    try {
      this.onExecute?.(code);
      this.clearErrors();
    } catch (error) {
      this.showError(error as Error);
    }
  }

  private showError(error: Error): void {
    if (!this.editor) return;

    const model = this.editor.getModel();
    if (!model) return;

    monaco.editor.setModelMarkers(model, 'owner', [{
      severity: monaco.MarkerSeverity.Error,
      message: error.message,
      startLineNumber: 1,
      startColumn: 1,
      endLineNumber: 1,
      endColumn: 1
    }]);
  }

  private clearErrors(): void {
    if (!this.editor) return;
    const model = this.editor.getModel();
    if (model) {
      monaco.editor.setModelMarkers(model, 'owner', []);
    }
  }

  private save(): void {
    if (!this.editor) return;
    const code = this.editor.getValue();
    localStorage.setItem('algorhythm_session', code);
    console.log('💾 Code saved');
  }

  load(): void {
    const saved = localStorage.getItem('algorhythm_session');
    if (saved && this.editor) {
      this.editor.setValue(saved);
      console.log('📂 Code loaded');
    }
  }

  setOnExecute(callback: (code: string) => void): void {
    this.onExecute = callback;
  }

  getValue(): string {
    return this.editor?.getValue() || '';
  }

  setValue(code: string): void {
    this.editor?.setValue(code);
  }

  dispose(): void {
    this.editor?.dispose();
  }
}
