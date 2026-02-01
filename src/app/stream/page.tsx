'use client';

import { useState, useEffect, memo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

type Tab = 'connect' | 'audio' | 'overlay' | 'chat';

function MobileRestriction() {
  return (
    <div className="fixed inset-0 bg-[#0a0a0a] flex items-center justify-center p-6">
      <motion.div 
        className="max-w-sm text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div 
          className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          <svg className="w-10 h-10 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
        </motion.div>

        <h1 
          className="text-2xl font-semibold text-white mb-3"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Desktop Required
        </h1>

        <p className="text-white/50 text-sm leading-relaxed mb-8">
          Streaming configuration requires a desktop browser. 
          Connect to Twitch, YouTube, and configure audio routing from your computer.
        </p>

        <Link href="/">
          <motion.div
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/[0.05] border border-white/[0.08] text-white/70 text-sm font-medium hover:bg-white/[0.08] hover:text-white transition-colors cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Home
          </motion.div>
        </Link>
      </motion.div>
    </div>
  );
}

export default function StreamPage() {
  const [activeTab, setActiveTab] = useState<Tab>('connect');
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isMobile === null) {
    return (
      <div className="fixed inset-0 bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (isMobile) {
    return <MobileRestriction />;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] select-none">
      {/* Header */}
      <header className="h-10 border-b border-white/[0.06] px-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
            <div className="w-5 h-5 rounded bg-emerald-500/20 flex items-center justify-center">
              <svg className="w-3 h-3 text-emerald-400" viewBox="0 0 24 24" fill="currentColor">
                <rect x="4" y="8" width="2" height="8" />
                <rect x="8" y="5" width="2" height="14" />
                <rect x="12" y="7" width="2" height="10" />
                <rect x="16" y="4" width="2" height="16" />
              </svg>
            </div>
            <span className="text-[11px] font-medium tracking-tight">Algorhythm</span>
          </Link>
          <div className="h-3 w-px bg-white/[0.06]" />
          <span className="text-[9px] text-white/30">Streaming</span>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge connected={false} />
          <Link href="/studio" className="h-6 px-2 rounded bg-white/[0.03] text-[9px] text-white/50 hover:text-white/70 hover:bg-white/[0.05] transition-colors flex items-center">
            Back to Studio
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-5">
          {/* Nav */}
          <div className="col-span-3">
            <h1 className="text-base font-medium text-white mb-0.5">Stream Setup</h1>
            <p className="text-[10px] text-white/30 mb-4">Configure streaming</p>
            <nav className="space-y-0.5">
              {[
                { id: 'connect' as Tab, label: 'Connections' },
                { id: 'audio' as Tab, label: 'Audio' },
                { id: 'overlay' as Tab, label: 'Overlay' },
                { id: 'chat' as Tab, label: 'Chat' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-left text-[10px] transition-colors ${
                    activeTab === tab.id ? 'bg-white/[0.03] text-white' : 'text-white/35 hover:text-white/60'
                  }`}
                >
                  <span>{tab.label}</span>
                  {activeTab === tab.id && <div className="w-1 h-1 rounded-full bg-emerald-400" />}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="col-span-9">
            {activeTab === 'connect' && <ConnectionsPanel />}
            {activeTab === 'audio' && <AudioPanel />}
            {activeTab === 'overlay' && <OverlayPanel />}
            {activeTab === 'chat' && <ChatPanel />}
          </div>
        </div>
      </main>
    </div>
  );
}

const StatusBadge = memo(function StatusBadge({ connected }: { connected: boolean }) {
  return (
    <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] ${connected ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/[0.03] text-white/30'}`}>
      <div className={`w-1 h-1 rounded-full ${connected ? 'bg-emerald-400 animate-pulse' : 'bg-white/25'}`} />
      {connected ? 'Live' : 'Offline'}
    </div>
  );
});

const Card = memo(function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`p-3 rounded bg-white/[0.02] border border-white/[0.04] ${className}`}>{children}</div>;
});

const SectionTitle = memo(function SectionTitle({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="mb-3">
      <h3 className="text-[11px] font-medium text-white">{title}</h3>
      <p className="text-[9px] text-white/30 mt-0.5">{desc}</p>
    </div>
  );
});

const ConnectionsPanel = memo(function ConnectionsPanel() {
  return (
    <div className="space-y-5">
      <SectionTitle title="Platform Connections" desc="Connect to streaming platforms" />
      <div className="space-y-1.5">
        <PlatformCard name="Twitch" desc="Stream with chat integration" color="#9146ff" />
        <PlatformCard name="YouTube" desc="Go live with analytics" color="#ff0000" />
        <PlatformCard name="OBS Studio" desc="Virtual audio routing" color="#ffffff" />
      </div>
      
      <SectionTitle title="Stream Settings" desc="Configure broadcast" />
      <Card>
        <div className="space-y-3">
          <Field label="Stream Title" placeholder="Live Coding Session" />
          <div className="grid grid-cols-2 gap-2">
            <Select label="Quality" options={['1080p 60fps', '1080p 30fps', '720p 60fps']} />
            <Select label="Bitrate" options={['6000 kbps', '4500 kbps', '3000 kbps']} />
          </div>
        </div>
      </Card>
    </div>
  );
});

const AudioPanel = memo(function AudioPanel() {
  return (
    <div className="space-y-5">
      <SectionTitle title="Audio Routing" desc="Configure audio output" />
      <Card>
        <div className="space-y-3">
          <Select label="Output Device" options={['System Default', 'Virtual Audio Cable', 'BlackHole 2ch']} />
          <div className="space-y-1.5">
            <span className="text-[8px] text-white/30 uppercase">Levels</span>
            <Meter label="Master" level={75} />
            <Meter label="Deck A" level={60} />
            <Meter label="Deck B" level={45} />
          </div>
        </div>
      </Card>
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] text-white">Virtual Audio Device</p>
            <p className="text-[9px] text-white/30">Route to OBS</p>
          </div>
          <Toggle />
        </div>
      </Card>
    </div>
  );
});

const OverlayPanel = memo(function OverlayPanel() {
  return (
    <div className="space-y-5">
      <SectionTitle title="Stream Overlay" desc="Customize visuals" />
      <Card>
        <div className="space-y-3">
          <Select label="Theme" options={['Minimal Dark', 'Neon Glow', 'Classic DJ']} />
          <div className="space-y-1">
            <span className="text-[8px] text-white/30 uppercase">Components</span>
            {['Now Playing', 'Waveform', 'BPM Display', 'Visualizer'].map(item => (
              <div key={item} className="flex items-center justify-between py-1">
                <span className="text-[10px] text-white/50">{item}</span>
                <Toggle defaultChecked />
              </div>
            ))}
          </div>
        </div>
      </Card>
      <Card>
        <p className="text-[9px] text-white/30 mb-1.5">Browser Source URL</p>
        <div className="flex gap-1.5">
          <input readOnly value="http://localhost:3000/overlay" className="flex-1 h-7 px-2 bg-white/[0.03] border border-white/[0.06] rounded text-[9px] text-white/40 font-mono" />
          <button className="h-7 px-2.5 rounded bg-emerald-500 text-[9px] font-medium text-black">Copy</button>
        </div>
      </Card>
    </div>
  );
});

const ChatPanel = memo(function ChatPanel() {
  return (
    <div className="space-y-5">
      <SectionTitle title="Chat Integration" desc="Viewer interaction" />
      <Card>
        <div className="space-y-3">
          <Field label="Twitch Channel" placeholder="your_channel" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-white">Chat Commands</p>
              <p className="text-[9px] text-white/30">Allow viewers to trigger effects</p>
            </div>
            <Toggle defaultChecked />
          </div>
        </div>
      </Card>
      <SectionTitle title="Commands" desc="Available commands" />
      <Card>
        <div className="space-y-1">
          {[
            { cmd: '!bpm', desc: 'Show BPM' },
            { cmd: '!track', desc: 'Now playing' },
            { cmd: '!reverb', desc: 'Toggle reverb' },
            { cmd: '!drop', desc: 'Drop effect' },
          ].map(item => (
            <div key={item.cmd} className="flex items-center justify-between py-1 border-b border-white/[0.03] last:border-0">
              <div className="flex items-center gap-1.5">
                <code className="px-1 py-0.5 rounded bg-emerald-500/10 text-[9px] text-emerald-400 font-mono">{item.cmd}</code>
                <span className="text-[9px] text-white/35">{item.desc}</span>
              </div>
              <Toggle defaultChecked />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
});

const PlatformCard = memo(function PlatformCard({ name, desc, color }: { name: string; desc: string; color: string }) {
  return (
    <button className="w-full p-2.5 rounded bg-white/[0.02] border border-white/[0.04] text-left flex items-center gap-2.5 hover:border-white/[0.08] transition-colors group">
      <div className="w-7 h-7 rounded flex items-center justify-center" style={{ backgroundColor: `${color}10` }}>
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-white">{name}</p>
        <p className="text-[8px] text-white/30">{desc}</p>
      </div>
      <span className="text-[9px] text-white/20 group-hover:text-white/40 transition-colors">Connect →</span>
    </button>
  );
});

const Field = memo(function Field({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <div className="space-y-1">
      <label className="text-[8px] text-white/30 uppercase">{label}</label>
      <input placeholder={placeholder} className="w-full h-7 px-2 bg-white/[0.03] border border-white/[0.06] rounded text-[10px] text-white placeholder:text-white/15 focus:outline-none focus:border-emerald-500/30 transition-colors" />
    </div>
  );
});

const Select = memo(function Select({ label, options }: { label: string; options: string[] }) {
  return (
    <div className="space-y-1">
      <label className="text-[8px] text-white/30 uppercase">{label}</label>
      <select className="w-full h-7 px-2 bg-white/[0.03] border border-white/[0.06] rounded text-[10px] text-white focus:outline-none focus:border-emerald-500/30 transition-colors appearance-none cursor-pointer">
        {options.map(opt => <option key={opt} value={opt} className="bg-[#111]">{opt}</option>)}
      </select>
    </div>
  );
});

const Meter = memo(function Meter({ label, level }: { label: string; level: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[9px] text-white/30 w-12">{label}</span>
      <div className="flex-1 h-1 bg-white/[0.04] rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${level}%`, backgroundColor: level > 80 ? '#ef4444' : '#10b981' }} />
      </div>
      <span className="text-[8px] text-white/20 w-5 text-right font-mono">{level}%</span>
    </div>
  );
});

const Toggle = memo(function Toggle({ defaultChecked = false }: { defaultChecked?: boolean }) {
  const [on, setOn] = useState(defaultChecked);
  return (
    <button onClick={() => setOn(!on)} className={`relative w-7 h-4 rounded-full transition-colors ${on ? 'bg-emerald-500' : 'bg-white/[0.08]'}`}>
      <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-all ${on ? 'left-3.5' : 'left-0.5'}`} />
    </button>
  );
});
