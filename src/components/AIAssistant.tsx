'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Settings, X, AlertCircle } from 'lucide-react';

type AIProvider = 'claude' | 'openai' | 'gemini';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AIConfig {
  provider: AIProvider;
  model: string;
  apiKey: string;
}

const MODELS = {
  claude: [
    { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet (Latest)', recommended: true },
    { id: 'claude-3-5-haiku-20241022', name: 'Claude 3.5 Haiku (Fast)' },
    { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus (Most Capable)' },
    { id: 'claude-3-sonnet-20240229', name: 'Claude 3 Sonnet' },
    { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku' },
  ],
  openai: [
    { id: 'gpt-4-turbo-preview', name: 'GPT-4 Turbo (Latest)', recommended: true },
    { id: 'gpt-4', name: 'GPT-4' },
    { id: 'gpt-4-32k', name: 'GPT-4 32K' },
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo (Fast)' },
    { id: 'gpt-3.5-turbo-16k', name: 'GPT-3.5 Turbo 16K' },
  ],
  gemini: [
    { id: 'gemini-pro', name: 'Gemini Pro', recommended: true },
    { id: 'gemini-pro-vision', name: 'Gemini Pro Vision' },
    { id: 'gemini-ultra', name: 'Gemini Ultra (Coming Soon)', disabled: true },
  ],
};

const SYSTEM_PROMPT = `You are an expert DJ and music producer AI assistant for Algorhythm. Help users create, mix, and perform music using JavaScript/TypeScript code.

## Core API
- dj.engine.initialize() / start() / stop()
- dj.deck.A/B/C/D.load() / play() / pause() / seek() / setVolume() / setBPM() / sync()
- dj.deck.A.eq.setHigh/Mid/Low() - EQ control (-∞ to +12dB)
- dj.deck.A.loop.set/enable/disable/double/halve()
- dj.deck.A.cue.set/jump() - Hot cues
- dj.mixer.setCrossfader() / setChannelVolume() / setMasterVolume()
- dj.effects.reverb/delay/filter/distortion/phaser/chorus/bitcrusher.set()
- dj.loop('16n', (time) => {}) - Timed loops
- dj.kick/snare/hihat/synth/bass.triggerAttackRelease()

## Time Notation
'4n' = quarter note, '8n' = eighth, '16n' = sixteenth, '1m' = measure

## Best Practices
- Always use time parameter in loops
- Use tick counters for patterns
- Apply effects gradually
- Preload tracks before use

Generate working, production-ready code with comments.`;

export function AIAssistant({ onCodeInsert, getCurrentCode }: {
  onCodeInsert: (code: string) => void;
  getCurrentCode?: () => string;
}) {
  const [showSettings, setShowSettings] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [config, setConfig] = useState<AIConfig | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('algorhythm_ai_config');
    if (saved) {
      try {
        setConfig(JSON.parse(saved));
      } catch { }
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const saveConfig = (newConfig: AIConfig) => {
    setConfig(newConfig);
    localStorage.setItem('algorhythm_ai_config', JSON.stringify(newConfig));
    setShowSettings(false);
  };

  const sendMessage = async () => {
    if (!input.trim() || !config || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const contextMessage = `Current code context:\n\`\`\`typescript\n${getCurrentCode ? getCurrentCode() : ''}\n\`\`\``;
      const response = await callAI(config, [...messages, { role: 'user', content: contextMessage + '\n\n' + input }]);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Error: ${error instanceof Error ? error.message : 'Failed to get response'}`
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const extractAndInsertCode = (content: string) => {
    const codeMatch = content.match(/```(?:typescript|javascript)?\n([\s\S]*?)```/);
    if (codeMatch) {
      onCodeInsert(codeMatch[1].trim());
    }
  };

  return (
    <div className="flex-1 min-h-[200px] max-h-[600px] bg-black/20 backdrop-blur-xl rounded-xl border border-white/5 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-white/5 bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-500/20 rounded-lg">
            <Sparkles className="w-3 h-3 text-indigo-400" />
          </div>
          <div>
            <span className="font-bold text-xs">AI Assistant</span>
            <span className="text-[9px] text-muted-foreground uppercase tracking-wider block">{config?.model || 'Offline'}</span>
          </div>
        </div>
        <button
          onClick={() => setShowSettings(true)}
          className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-muted-foreground hover:text-white"
        >
          <Settings className="w-3 h-3" />
        </button>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal
          currentConfig={config}
          onSave={saveConfig}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 scroll-smooth text-sm">
        {!config && (
          <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-5 text-sm backdrop-blur-sm">
            <div className="flex gap-3">
              <div className="p-2 bg-yellow-500/20 rounded-full h-fit">
                <AlertCircle className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <p className="font-bold text-yellow-400 mb-1">Setup Required</p>
                <p className="text-zinc-300 leading-relaxed">Configure your AI provider to start generating code.</p>
                <button
                  onClick={() => setShowSettings(true)}
                  className="mt-3 text-xs font-bold uppercase tracking-wider text-yellow-500 hover:text-yellow-400 border-b border-yellow-500/30 hover:border-yellow-400"
                >
                  Open Settings →
                </button>
              </div>
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
            <div className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${msg.role === 'user'
              ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-br-none shadow-indigo-900/20'
              : 'bg-white/5 border border-white/5 text-zinc-100 rounded-bl-none'
              }`}>
              <div className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</div>
              {msg.role === 'assistant' && msg.content.includes('```') && (
                <button
                  onClick={() => extractAndInsertCode(msg.content)}
                  className="mt-3 w-full py-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-2 group"
                >
                  <Sparkles className="w-3 h-3 text-indigo-400 group-hover:text-indigo-300" />
                  Insert Code
                </button>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/5 rounded-2xl rounded-bl-none p-4 w-16 flex items-center justify-center">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-2 border-t border-white/5 bg-black/40 backdrop-blur-md">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder={config ? "Ask AI..." : "Configure AI first..."}
            disabled={!config || isLoading}
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-3 pr-10 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all disabled:opacity-50"
          />
          <button
            onClick={sendMessage}
            disabled={!config || !input.trim() || isLoading}
            className="absolute right-1.5 top-1.5 p-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded transition-colors disabled:opacity-0 disabled:scale-90 transform duration-200"
          >
            <Send className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

function SettingsModal({ currentConfig, onSave, onClose }: {
  currentConfig: AIConfig | null;
  onSave: (config: AIConfig) => void;
  onClose: () => void;
}) {
  const [provider, setProvider] = useState<AIProvider>(currentConfig?.provider || 'claude');
  const [model, setModel] = useState(currentConfig?.model || MODELS.claude[0].id);
  const [apiKey, setApiKey] = useState(currentConfig?.apiKey || '');

  const handleProviderChange = (newProvider: AIProvider) => {
    setProvider(newProvider);
    setModel(MODELS[newProvider][0].id);
  };

  const availableModels = MODELS[provider];

  return (
    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-10">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 w-full max-w-md">
        <h3 className="text-lg font-bold mb-4">AI Configuration</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Provider</label>
            <select
              value={provider}
              onChange={(e) => handleProviderChange(e.target.value as AIProvider)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="claude">Claude (Anthropic)</option>
              <option value="openai">ChatGPT (OpenAI)</option>
              <option value="gemini">Gemini (Google)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Model</label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
            >
              {availableModels.map((m) => (
                <option key={m.id} value={m.id} disabled={(m as any).disabled}>
                  {m.name} {m.recommended ? '⭐' : ''}
                </option>
              ))}
            </select>
            <p className="text-xs text-zinc-500 mt-1">
              {availableModels.find(m => m.id === model)?.recommended && '⭐ Recommended for best results'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">API Key</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-xs">
            <p className="font-semibold text-blue-400 mb-1">🔒 Privacy Notice</p>
            <p className="text-zinc-300 mb-2">
              Your API key is stored locally in your browser's localStorage. We never send it to our servers or collect any credentials.
            </p>
            <p className="text-zinc-400">
              You pay for your own API usage. We don't charge for tokens. Custom model connectors (HuggingFace, etc.) coming soon - PRs welcome!
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onSave({ provider, model, apiKey })}
              disabled={!apiKey.trim()}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg px-4 py-2 text-sm font-medium transition-colors"
            >
              Save
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

async function callAI(config: AIConfig, messages: Message[]): Promise<string> {
  const { provider, model, apiKey } = config;

  if (provider === 'claude') {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model,
        max_tokens: 2000,
        system: SYSTEM_PROMPT,
        messages: messages.map(m => ({ role: m.role, content: m.content }))
      })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error?.message || `Claude API error: ${response.statusText}`);
    }
    const data = await response.json();
    return data.content[0].text;
  }

  if (provider === 'openai') {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages
        ],
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error?.message || `OpenAI API error: ${response.statusText}`);
    }
    const data = await response.json();
    return data.choices[0].message.content;
  }

  if (provider === 'gemini') {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
          ...messages.map(m => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.content }]
          }))
        ],
        generationConfig: { maxOutputTokens: 2000 }
      })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error?.message || `Gemini API error: ${response.statusText}`);
    }
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  }

  throw new Error('Unknown provider');
}
