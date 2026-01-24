export default function AIPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-4">AI Assistant</h1>
        <p className="text-xl text-zinc-400">Intelligent code generation powered by Claude, ChatGPT, or Gemini.</p>
      </div>

      <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-2">✨ AI-Powered DJ Coding</h2>
        <p className="text-zinc-300">
          Get instant help creating beats, transitions, and effects. The AI understands the complete RhythmCode API.
        </p>
      </div>

      <section>
        <h2 className="text-2xl font-bold mb-4">Supported Providers</h2>
        <div className="grid gap-4">
          <Provider name="Claude" model="3.5 Sonnet" cost="~$0.003/req" url="https://console.anthropic.com" />
          <Provider name="ChatGPT" model="GPT-4 Turbo" cost="~$0.01/req" url="https://platform.openai.com" />
          <Provider name="Gemini" model="Gemini Pro" cost="Free tier" url="https://makersuite.google.com" />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Quick Setup</h2>
        <div className="space-y-3">
          <Step num={1}>Click ✨ sparkle button (bottom-right)</Step>
          <Step num={2}>Click ⚙️ settings</Step>
          <Step num={3}>Select provider & enter API key</Step>
          <Step num={4}>Click Save</Step>
        </div>
      </section>

      <section className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-4">🔒 Privacy & Security</h2>
        <div className="space-y-3">
          <Privacy icon="✅" title="Local Storage Only" desc="API keys in browser localStorage - never our servers" />
          <Privacy icon="✅" title="Direct API Calls" desc="Browser → AI provider directly - no middleman" />
          <Privacy icon="✅" title="Zero Tracking" desc="We don't collect or store credentials" />
          <Privacy icon="✅" title="Open Source" desc="Verify the code yourself" />
        </div>
        
        <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-sm text-zinc-300">
          <strong className="text-yellow-400">Why?</strong> We don't charge for AI. You pay providers directly with your own keys. Full control, privacy, and cost transparency.
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Example Usage</h2>
        <div className="space-y-4">
          <Example
            q="Create a trap beat at 140 BPM"
            code={`dj.bpm = 140;
let tick = 0;
dj.loop('16n', (time) => {
  if ([0, 6, 12].includes(tick % 16)) {
    dj.kick.triggerAttackRelease('C1', '8n', time);
  }
  tick++;
});`}
          />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Pro Tips</h2>
        <div className="space-y-2">
          <Tip bad="Make music" good="Create 128 BPM progressive house with build-up" />
          <Tip bad="Add effects" good="Add reverb and delay for spacey atmosphere" />
        </div>
      </section>

      <section className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-4">🔧 Custom Models (Coming Soon)</h2>
        <p className="text-sm text-zinc-300">
          HuggingFace, Ollama, LM Studio support coming. Want to contribute? Submit a PR!
        </p>
      </section>
    </div>
  );
}

function Provider({ name, model, cost, url }: { name: string; model: string; cost: string; url: string }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold">{name}</h3>
        <span className="text-xs text-zinc-500">{cost}</span>
      </div>
      <p className="text-sm text-zinc-400 mb-2">{model}</p>
      <a href={url} target="_blank" rel="noopener" className="text-xs text-blue-400 hover:underline">Get API Key →</a>
    </div>
  );
}

function Step({ num, children }: { num: number; children: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold shrink-0">{num}</div>
      <p className="text-zinc-300">{children}</p>
    </div>
  );
}

function Privacy({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="flex gap-3">
      <span className="text-xl">{icon}</span>
      <div>
        <h4 className="font-semibold text-sm">{title}</h4>
        <p className="text-xs text-zinc-400">{desc}</p>
      </div>
    </div>
  );
}

function Example({ q, code }: { q: string; code: string }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
      <p className="text-sm text-zinc-400 mb-2">You: {q}</p>
      <pre className="bg-zinc-950 border border-zinc-700 rounded p-3 text-xs text-blue-300 overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function Tip({ bad, good }: { bad: string; good: string }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-sm">
      <p className="text-red-400">❌ {bad}</p>
      <p className="text-green-400">✅ {good}</p>
    </div>
  );
}
