// AI Chat Hook - Extracts chat logic from AIAssistant component
import { useState, useCallback, useRef, useEffect } from 'react';

type Provider = 'claude' | 'openai' | 'gemini';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AIConfig {
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
} as const;

const SYSTEM_PROMPT = `You are an expert DJ and music producer AI assistant. Help users create music using JavaScript/TypeScript code.

Core API:
- dj.bpm = 128 (set tempo)
- dj.loop('16n', (time) => {}) (create loop)
- dj.kick/snare/hihat.triggerAttackRelease('C1', '8n', time)
- dj.synth/bass/pad.triggerAttackRelease(note, duration, time)

Generate working, production-ready code with comments.`;

const STORAGE_KEY = 'algorhythm_ai_config';

interface UseAIChatOptions {
  getCurrentCode?: () => string;
}

export function useAIChat({ getCurrentCode }: UseAIChatOptions = {}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<AIConfig | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load config from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setConfig(JSON.parse(saved));
      } catch {}
    }
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const saveConfig = useCallback((newConfig: AIConfig) => {
    setConfig(newConfig);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig));
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

  const extractCode = useCallback((content: string): string | null => {
    const match = content.match(/```(?:typescript|javascript)?\n([\s\S]*?)```/);
    return match ? match[1].trim() : null;
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    // State
    messages,
    input,
    loading,
    config,
    showSettings,
    messagesEndRef,
    // Actions
    setInput,
    setShowSettings,
    saveConfig,
    sendMessage,
    extractCode,
    clearMessages,
    // Constants
    MODELS,
  };
}

async function callAI(config: AIConfig, messages: Message[]): Promise<string> {
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

export type { Provider, Message, AIConfig };
export { MODELS };
