'use client';

import { motion } from 'framer-motion';
import { CodeBlock, InlineCode } from '@/components/docs';

export default function AIPage() {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <motion.div 
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-2 text-xs text-white/40">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          <span style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Advanced</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          AI Assistant
        </h1>
        <p className="text-base text-white/50 leading-relaxed max-w-xl">
          Use natural language to generate music code. Describe what you want, and the AI will write it for you.
        </p>
      </motion.div>

      {/* How It Works */}
      <Section title="How It Works">
        <p className="text-sm text-white/50 mb-4">
          The AI Assistant understands music production concepts and can generate Algorhythm code 
          from natural language descriptions.
        </p>
        <div className="grid sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.06]">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3">
              1
            </div>
            <h4 className="text-sm font-medium text-white/80 mb-1">Describe</h4>
            <p className="text-xs text-white/40">Tell the AI what kind of music you want to create</p>
          </div>
          <div className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.06]">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-3">
              2
            </div>
            <h4 className="text-sm font-medium text-white/80 mb-1">Generate</h4>
            <p className="text-xs text-white/40">AI writes the code using the DJ API</p>
          </div>
          <div className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.06]">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-3">
              3
            </div>
            <h4 className="text-sm font-medium text-white/80 mb-1">Refine</h4>
            <p className="text-xs text-white/40">Edit the code or ask for modifications</p>
          </div>
        </div>
      </Section>

      {/* Example Prompts */}
      <Section title="Example Prompts">
        <p className="text-sm text-white/50 mb-4">
          Here are some effective ways to prompt the AI:
        </p>
        <div className="space-y-3">
          <PromptExample 
            prompt="Create a house beat at 128 BPM with a four-on-the-floor kick pattern"
            description="Basic beat generation"
          />
          <PromptExample 
            prompt="Make something that sounds like Alan Walker - Faded"
            description="Song-style recreation"
          />
          <PromptExample 
            prompt="Add a filter sweep that builds up over 8 bars"
            description="Effect automation"
          />
          <PromptExample 
            prompt="Create a chord progression in A minor with piano and pad"
            description="Harmonic content"
          />
          <PromptExample 
            prompt="Make the drop more intense with a supersaw lead"
            description="Modifying existing code"
          />
          <PromptExample 
            prompt="Add trap-style hi-hat rolls"
            description="Genre-specific patterns"
          />
        </div>
      </Section>

      {/* Tips for Better Results */}
      <Section title="Tips for Better Results">
        <div className="grid sm:grid-cols-2 gap-3">
          <TipCard 
            title="Be Specific"
            tip="Include BPM, key, genre, and specific instruments you want"
            example="128 BPM house beat with punchy kick and offbeat hi-hats"
          />
          <TipCard 
            title="Reference Songs"
            tip="Mention specific songs or artists for style guidance"
            example="Something like Avicii Levels piano riff"
          />
          <TipCard 
            title="Describe Structure"
            tip="Specify intro, build, drop, breakdown sections"
            example="8 bar intro, 8 bar build, then drop with full drums"
          />
          <TipCard 
            title="Iterate"
            tip="Start simple, then ask for additions and modifications"
            example="Add a bass line → Make it more aggressive → Add delay"
          />
        </div>
      </Section>

      {/* What AI Can Do */}
      <Section title="What the AI Can Do">
        <div className="grid sm:grid-cols-2 gap-2">
          {[
            'Generate drum patterns (house, trap, dubstep, etc.)',
            'Create chord progressions and melodies',
            'Recreate styles of famous songs',
            'Add effects and automation',
            'Build complete track structures',
            'Explain music theory concepts',
            'Debug and fix code issues',
            'Suggest improvements to your code',
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-white/60">
              <span className="text-emerald-400">✓</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Limitations */}
      <Section title="Limitations">
        <div className="p-4 rounded-lg bg-rose-500/5 border border-rose-500/10">
          <ul className="text-sm text-white/50 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-rose-400 mt-0.5">•</span>
              <span>Cannot load or analyze audio files - only generates code</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-400 mt-0.5">•</span>
              <span>May not perfectly recreate complex songs on first try</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-400 mt-0.5">•</span>
              <span>Works best with clear, specific instructions</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-400 mt-0.5">•</span>
              <span>Generated code may need manual tweaking for best results</span>
            </li>
          </ul>
        </div>
      </Section>

      {/* Example Conversation */}
      <Section title="Example Conversation">
        <div className="space-y-4">
          <ChatBubble role="user">
            Create a chill lo-fi beat at 85 BPM
          </ChatBubble>
          <ChatBubble role="ai">
            Here&apos;s a lo-fi beat with jazzy chords and a relaxed groove:
          </ChatBubble>
          <CodeBlock filename="ai-generated.ts">{`dj.bpm = 85;

const chords = [
  ['D4', 'F#4', 'A4', 'C5'],  // Dmaj7
  ['G4', 'B4', 'D5', 'F5'],   // Gmaj7
];

let tick = 0;
let chordIndex = 0;

dj.loop('16n', (time) => {
  // Dusty kick
  if (tick % 8 === 0 || tick % 8 === 5) {
    dj.kick.triggerAttackRelease('C1', '8n', time);
  }
  
  // Snare on 2 and 4
  if (tick % 8 === 4) {
    dj.snare.triggerAttackRelease('C1', '8n', time);
  }
  
  // Piano chords
  if (tick % 32 === 0) {
    dj.piano.triggerAttackRelease(chords[chordIndex], '1m', time);
    chordIndex = (chordIndex + 1) % chords.length;
  }
  
  tick++;
});`}</CodeBlock>
          <ChatBubble role="user">
            Add some vinyl crackle feel and make the hi-hats more swung
          </ChatBubble>
          <ChatBubble role="ai">
            I&apos;ve added swing to the hi-hats and a subtle bitcrusher for that vinyl texture...
          </ChatBubble>
        </div>
      </Section>

      {/* Keyboard Shortcut */}
      <Section title="Quick Access">
        <p className="text-sm text-white/50 mb-4">
          Open the AI Assistant panel in the studio:
        </p>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <kbd className="px-2 py-1 bg-white/[0.06] border border-white/[0.1] rounded text-xs text-white/70" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              ⌘
            </kbd>
            <span className="text-white/30">+</span>
            <kbd className="px-2 py-1 bg-white/[0.06] border border-white/[0.1] rounded text-xs text-white/70" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              K
            </kbd>
          </div>
          <span className="text-sm text-white/40">or click the AI button in the toolbar</span>
        </div>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.section 
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-lg font-semibold text-white border-b border-white/[0.06] pb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        {title}
      </h2>
      {children}
    </motion.section>
  );
}

function PromptExample({ prompt, description }: { prompt: string; description: string }) {
  return (
    <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
      <p className="text-sm text-white/80 mb-1">&ldquo;{prompt}&rdquo;</p>
      <p className="text-xs text-white/40">{description}</p>
    </div>
  );
}

function TipCard({ title, tip, example }: { title: string; tip: string; example: string }) {
  return (
    <div className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.06]">
      <h4 className="text-sm font-medium text-emerald-400 mb-1">{title}</h4>
      <p className="text-xs text-white/50 mb-2">{tip}</p>
      <p className="text-xs text-white/30 italic">&ldquo;{example}&rdquo;</p>
    </div>
  );
}

function ChatBubble({ role, children }: { role: 'user' | 'ai'; children: React.ReactNode }) {
  const isUser = role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] p-3 rounded-lg text-sm ${
        isUser 
          ? 'bg-emerald-500/10 border border-emerald-500/20 text-white/80' 
          : 'bg-white/[0.03] border border-white/[0.06] text-white/60'
      }`}>
        {children}
      </div>
    </div>
  );
}
