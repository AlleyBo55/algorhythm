'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function StreamPage() {
  const [connected, setConnected] = useState(false);

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="h-14 border-b border-zinc-900 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#1db954] flex items-center justify-center">
              <svg className="w-4 h-4 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 18V5l12-2v13" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="18" cy="16" r="3" />
              </svg>
            </div>
            <span className="font-semibold text-white">Algorhythm</span>
          </Link>
          <span className="text-zinc-600">/</span>
          <span className="text-zinc-400">Stream</span>
        </div>

        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
            connected 
              ? 'bg-[#1db954]/10 text-[#1db954]' 
              : 'bg-zinc-800 text-zinc-500'
          }`}>
            <div className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-[#1db954]' : 'bg-zinc-600'}`} />
            {connected ? 'Live' : 'Offline'}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="space-y-8">
          {/* Hero */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-white">Streaming Dashboard</h1>
            <p className="text-zinc-400">
              Connect to Twitch, YouTube, or OBS to stream your live coding sessions.
            </p>
          </div>

          {/* Connection Cards */}
          <div className="grid gap-4">
            <ConnectionCard
              name="Twitch"
              description="Stream to Twitch with chat integration"
              icon={<TwitchIcon />}
              color="purple"
            />
            <ConnectionCard
              name="YouTube"
              description="Go live on YouTube"
              icon={<YouTubeIcon />}
              color="red"
            />
            <ConnectionCard
              name="OBS Studio"
              description="Connect via virtual audio cable"
              icon={<OBSIcon />}
              color="zinc"
            />
          </div>

          {/* Settings */}
          <div className="p-6 rounded-xl bg-zinc-900 border border-zinc-800 space-y-4">
            <h2 className="text-lg font-semibold text-white">Stream Settings</h2>
            
            <div className="grid gap-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Stream Title</label>
                <input
                  type="text"
                  placeholder="Live Coding Session"
                  className="w-full h-10 px-4 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-600"
                />
              </div>
              
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Audio Output</label>
                <select className="w-full h-10 px-4 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white focus:outline-none focus:border-zinc-600">
                  <option>System Default</option>
                  <option>Virtual Audio Cable</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function ConnectionCard({
  name,
  description,
  icon,
  color,
}: {
  name: string;
  description: string;
  icon: React.ReactNode;
  color: 'purple' | 'red' | 'zinc';
}) {
  const colors = {
    purple: 'hover:border-purple-500/50',
    red: 'hover:border-red-500/50',
    zinc: 'hover:border-zinc-600',
  };

  return (
    <button className={`w-full p-5 rounded-xl bg-zinc-900 border border-zinc-800 ${colors[color]} transition-colors text-left flex items-center gap-4`}>
      <div className="w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="font-medium text-white">{name}</h3>
        <p className="text-sm text-zinc-500">{description}</p>
      </div>
      <svg className="w-5 h-5 text-zinc-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 18l6-6-6-6" />
      </svg>
    </button>
  );
}

function TwitchIcon() {
  return (
    <svg className="w-6 h-6 text-purple-400" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z"/>
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg className="w-6 h-6 text-red-500" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

function OBSIcon() {
  return (
    <svg className="w-6 h-6 text-zinc-400" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 24C5.383 24 0 18.617 0 12S5.383 0 12 0s12 5.383 12 12-5.383 12-12 12zm0-22.5C6.21 1.5 1.5 6.21 1.5 12S6.21 22.5 12 22.5 22.5 17.79 22.5 12 17.79 1.5 12 1.5zm0 18a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13z"/>
    </svg>
  );
}
