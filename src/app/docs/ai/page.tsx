export default function AIPage() {
  return (
    <div className="space-y-12">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-white">AI Assistant</h1>
        <p className="text-lg text-zinc-400">
          Generate music code with AI assistance.
        </p>
      </div>

      {/* Setup */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-white">Setup</h2>
        <p className="text-zinc-400">
          The AI Assistant supports multiple providers. You'll need an API key from one of:
        </p>
        
        <div className="grid gap-3">
          <ProviderCard
            name="Claude (Anthropic)"
            description="Recommended for music generation"
            link="https://console.anthropic.com"
          />
          <ProviderCard
            name="ChatGPT (OpenAI)"
            description="GPT-4 Turbo available"
            link="https://platform.openai.com"
          />
          <ProviderCard
            name="Gemini (Google)"
            description="Google's latest AI"
            link="https://makersuite.google.com"
          />
        </div>

        <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
          <p className="text-sm text-zinc-400">
            Your API key is stored locally in your browser. We never send it to our servers.
          </p>
        </div>
      </section>

      {/* Usage */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-white">Usage Tips</h2>
        
        <div className="space-y-4">
          <Tip title="Be Specific">
            Instead of "make a beat", try "create a 128 BPM house beat with a four-on-the-floor kick pattern"
          </Tip>
          <Tip title="Reference Styles">
            Mention artists or genres: "create a Daft Punk style disco beat" or "make a trap hi-hat pattern"
          </Tip>
          <Tip title="Iterate">
            Start simple and ask for modifications: "add a snare on beats 2 and 4" or "make the hi-hats faster"
          </Tip>
          <Tip title="Use Context">
            The AI can see your current code. Ask it to "add a bassline to this" or "make the drop more intense"
          </Tip>
        </div>
      </section>

      {/* Examples */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-white">Example Prompts</h2>
        
        <div className="space-y-3">
          <ExamplePrompt>Create a minimal techno beat at 130 BPM with a driving kick and subtle hi-hats</ExamplePrompt>
          <ExamplePrompt>Make a dubstep wobble bass pattern with filter automation</ExamplePrompt>
          <ExamplePrompt>Generate a lo-fi hip hop beat with jazzy chords and vinyl crackle</ExamplePrompt>
          <ExamplePrompt>Create a build-up that leads into a drop after 8 bars</ExamplePrompt>
        </div>
      </section>
    </div>
  );
}

function ProviderCard({
  name,
  description,
  link,
}: {
  name: string;
  description: string;
  link: string;
}) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors flex items-center justify-between group"
    >
      <div>
        <h3 className="font-medium text-white">{name}</h3>
        <p className="text-sm text-zinc-500">{description}</p>
      </div>
      <svg className="w-5 h-5 text-zinc-600 group-hover:text-zinc-400 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
      </svg>
    </a>
  );
}

function Tip({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
      <h3 className="font-medium text-white mb-1">{title}</h3>
      <p className="text-sm text-zinc-400">{children}</p>
    </div>
  );
}

function ExamplePrompt({ children }: { children: string }) {
  return (
    <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-zinc-300">
      "{children}"
    </div>
  );
}
