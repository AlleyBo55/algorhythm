'use client';

import { useState, useRef, useEffect, memo, useCallback } from 'react';

type Provider = 'claude' | 'openai' | 'gemini';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Config {
  provider: Provider;
  model: string;
  apiKey: string;
}

const MODELS = {
  claude: [
    { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet' },
    { id: 'claude-3-5-haiku-20241022', name: 'Claude 3.5 Haiku' },
  ],
  openai: [
    { id: 'gpt-4-turbo-preview', name: 'GPT-4 Turbo' },
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
  ],
  gemini: [
    { id: 'gemini-pro', name: 'Gemini Pro' },
  ],
};

const SYSTEM_PROMPT = `You are an expert DJ and music producer AI assistant. Help users create music using JavaScript/TypeScript code.

Core API:
- dj.bpm = 128 (set tempo)
- dj.loop('16n', (time) => {}) (create loop)
- dj.kick/snare/hihat.triggerAttackRelease('C1', '8n', time)
- dj.synth/bass/pad.triggerAttackRelease(note, duration, time)

Generate working, production-ready code with comments.`;

interface AIAssistantProps {
  onCodeInsert: (code: string) => void;
  getCurrentCode?: () => string;
}

export const AIAssistant = memo(function AIAssistant({ onCodeInsert, getCurrentCode }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<Config | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('algorhythm_ai_config');
    if (saved) {
      try { setConfig(JSON.parse(saved)); } catch {}
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const saveConfig = useCallback((newConfig: Config) => {
    setConfig(newConfig);
    localStorage.setItem('algorhythm_ai_config', JSON.stringify(newConfig));
    setShowSettings(false);
  }, []);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || !config || loading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const context = getCurrentCode ? `Current code:\n\`\`\`\n${getCurrentCode()}\n\`\`\`\n\n` : '';
      const response = await callAI(config, [...messages, { role: 'user', content: context + input }]);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Error: ${error instanceof Error ? error.message : 'Failed'}`
      }]);
    } finally {
      setLoading(false);
    }
  }, [input, config, loading, messages, getCurrentCode]);

  const extractCode = useCallback((content: string) => {
    const match = content.match(/```(?:typescript|javascript)?\n([\s\S]*?)```/);
    if (match) onCodeInsert(match[1].trim());
  }, [onCodeInsert]);

  return (
    <div className="h-full flex flex-col rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden">
      {/* Header */}
      <div className="h-12 px-4 flex items-center justify-between border-b border-zinc-800/50">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-purple-500/20 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-purple-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-sm font-medium text-white">AI Assistant</span>
        </div>
        <button
          onClick={() => setShowSettings(true)}
          className="w-8 h-8 flex items-center justify-center text-zinc-500 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
          </svg>
        </button>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal
          config={config}
          onSave={saveConfig}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
        {!config && (
          <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <p className="text-sm text-amber-400 mb-2">Setup Required</p>
            <p className="text-xs text-zinc-400 mb-3">Configure your AI provider to start.</p>
            <button
              onClick={() => setShowSettings(true)}
              className="text-xs text-amber-400 hover:text-amber-300 underline"
            >
              Open Settings
            </button>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-xl px-4 py-3 ${
              msg.role === 'user'
                ? 'bg-[#1db954] text-black'
                : 'bg-zinc-800 text-zinc-200'
            }`}>
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              {msg.role === 'assistant' && msg.content.includes('```') && (
                <button
                  onClick={() => extractCode(msg.content)}
                  className="mt-2 w-full py-1.5 text-xs font-medium bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                >
                  Insert Code
                </button>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-zinc-800 rounded-xl px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-zinc-800/50">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder={config ? "Ask AI..." : "Configure AI first"}
            disabled={!config || loading}
            className="flex-1 h-10 px-4 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-600 disabled:opacity-50"
          />
          <button
            onClick={sendMessage}
            disabled={!config || !input.trim() || loading}
            className="h-10 w-10 flex items-center justify-center bg-[#1db954] hover:bg-[#1ed760] disabled:bg-zinc-800 disabled:text-zinc-600 text-black rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
});

const SettingsModal = memo(function SettingsModal({
  config,
  onSave,
  onClose,
}: {
  config: Config | null;
  onSave: (config: Config) => void;
  onClose: () => void;
}) {
  const [provider, setProvider] = useState<Provider>(config?.provider || 'claude');
  const [model, setModel] = useState(config?.model || MODELS.claude[0].id);
  const [apiKey, setApiKey] = useState(config?.apiKey || '');

  const handleProviderChange = (p: Provider) => {
    setProvider(p);
    setModel(MODELS[p][0].id);
  };

  return (
    <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-xl p-5 animate-scale-in">
        <h3 className="text-lg font-semibold text-white mb-4">AI Settings</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-2">Provider</label>
            <select
              value={provider}
              onChange={e => handleProviderChange(e.target.value as Provider)}
              className="w-full h-10 px-3 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white focus:outline-none focus:border-zinc-600"
            >
              <option value="claude">Claude (Anthropic)</option>
              <option value="openai">ChatGPT (OpenAI)</option>
              <option value="gemini">Gemini (Google)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-2">Model</label>
            <select
              value={model}
              onChange={e => setModel(e.target.value)}
              className="w-full h-10 px-3 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white focus:outline-none focus:border-zinc-600"
            >
              {MODELS[provider].map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-2">API Key</label>
            <input
              type="password"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="w-full h-10 px-3 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-600"
            />
          </div>

          <p className="text-[10px] text-zinc-500">
            Your API key is stored locally. We never send it to our servers.
          </p>

          <div className="flex gap-2 pt-2">
            <button
              onClick={() => onSave({ provider, model, apiKey })}
              disabled={!apiKey.trim()}
              className="flex-1 h-10 bg-[#1db954] hover:bg-[#1ed760] disabled:bg-zinc-800 disabled:text-zinc-500 text-black font-medium rounded-lg transition-colors"
            >
              Save
            </button>
            <button
              onClick={onClose}
              className="h-10 px-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

async function callAI(config: Config, messages: Message[]): Promise<string> {
  const { provider, model, apiKey } = config;

  if (provider === 'claude') {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model,
        max_tokens: 2000,
        system: SYSTEM_PROMPT,
        messages: messages.map(m => ({ role: m.role, content: m.content })),
      }),
    });
    if (!res.ok) throw new Error(`Claude API error: ${res.statusText}`);
    const data = await res.json();
    return data.content[0].text;
  }

  if (provider === 'openai') {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
        max_tokens: 2000,
      }),
    });
    if (!res.ok) throw new Error(`OpenAI API error: ${res.statusText}`);
    const data = await res.json();
    return data.choices[0].message.content;
  }

  if (provider === 'gemini') {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
          ...messages.map(m => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.content }],
          })),
        ],
        generationConfig: { maxOutputTokens: 2000 },
      }),
    });
    if (!res.ok) throw new Error(`Gemini API error: ${res.statusText}`);
    const data = await res.json();
    return data.candidates[0].content.parts[0].text;
  }

  throw new Error('Unknown provider');
}

export default AIAssistant;
