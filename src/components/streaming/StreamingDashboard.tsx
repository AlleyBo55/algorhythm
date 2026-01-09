'use client';

import { useState, useEffect, memo } from 'react';
import { useStreamingStore } from '@/hooks/useStreamingState';
import {
  audioRouter,
  recordingEngine,
  themeManager,
  chatIntegration,
  commandParser,
  overlayRenderer,
} from '@/engine/streaming';
import type { ConnectionStatus } from '@/engine/streaming/types';

type TabId = 'audio' | 'recording' | 'theme' | 'chat' | 'overlay';

const Tab = memo(function Tab({ 
  label, 
  icon, 
  active, 
  onClick 
}: { 
  id: TabId;
  label: string; 
  icon: string; 
  active: boolean; 
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 px-3 py-2.5 text-xs font-medium transition-colors
        ${active 
          ? 'text-white bg-zinc-800' 
          : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'
        }
      `}
    >
      <span>{icon}</span>
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
});

const AudioRouterPanel = memo(function AudioRouterPanel() {
  const { audioRouter: state, setRouting } = useStreamingStore();
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

  useEffect(() => {
    audioRouter.getAvailableOutputs().then(setDevices);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-white">Audio Routing</h3>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={state.isRouting}
            onChange={(e) => setRouting(e.target.checked)}
            className="w-4 h-4 rounded border-zinc-700 bg-zinc-800 text-[#1db954] focus:ring-[#1db954] focus:ring-offset-0"
          />
          <span className="text-xs text-zinc-400">Enable</span>
        </label>
      </div>

      <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
        <h4 className="text-xs font-medium text-zinc-400 mb-2">Virtual Devices</h4>
        {state.virtualDevices.length > 0 ? (
          <ul className="space-y-1.5">
            {state.virtualDevices.map(device => (
              <li key={device.id} className="flex items-center gap-2 text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1db954]" />
                <span className="text-zinc-300">{device.name}</span>
                <span className="text-zinc-600">({device.type})</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-zinc-500">
            No virtual audio devices found
          </p>
        )}
      </div>

      <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
        <h4 className="text-xs font-medium text-zinc-400 mb-2">Output Device</h4>
        <select className="w-full p-2 text-xs rounded-md bg-zinc-800 border border-zinc-700 text-zinc-300 focus:border-[#1db954] focus:ring-0 focus:outline-none">
          {devices.map(device => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label || 'Default'}
            </option>
          ))}
        </select>
      </div>

      <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
        <h4 className="text-xs font-medium text-zinc-400 mb-3">Audio Levels</h4>
        <div className="space-y-2">
          {Array.from(state.channels.values()).map(channel => (
            <div key={channel.id} className="space-y-1">
              <div className="flex justify-between text-[10px]">
                <span className="text-zinc-400">{channel.name}</span>
                <span className={channel.meter.isClipping ? 'text-red-400' : channel.meter.isWarning ? 'text-amber-400' : 'text-zinc-500'}>
                  {channel.meter.current.toFixed(1)} dB
                </span>
              </div>
              <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all ${
                    channel.meter.isClipping ? 'bg-red-500' : 
                    channel.meter.isWarning ? 'bg-amber-500' : 'bg-[#1db954]'
                  }`}
                  style={{ width: `${Math.max(0, (channel.meter.current + 60) / 60 * 100)}%` }}
                />
              </div>
            </div>
          ))}
          {state.channels.size === 0 && (
            <p className="text-xs text-zinc-500">No audio channels active</p>
          )}
        </div>
      </div>
    </div>
  );
});

const RecordingPanel = memo(function RecordingPanel() {
  const { recording, addMarker } = useStreamingStore();
  const [isRecording, setIsRecording] = useState(false);

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    return `${hours.toString().padStart(2, '0')}:${(minutes % 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  const handleStartStop = async () => {
    if (isRecording) {
      await recordingEngine.stop();
      setIsRecording(false);
    } else {
      await recordingEngine.start();
      setIsRecording(true);
    }
  };

  const handleAddMarker = () => {
    const marker = recordingEngine.addMarker();
    addMarker(marker);
  };

  const handleDownload = () => {
    recordingEngine.downloadRecording('dj-session');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-white">Recording</h3>
        <div className={`flex items-center gap-2 ${isRecording ? 'text-red-400' : 'text-zinc-500'}`}>
          <span className={`w-2 h-2 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-zinc-600'}`} />
          <span className="text-xs">{isRecording ? 'Recording' : 'Stopped'}</span>
        </div>
      </div>

      <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800 text-center">
        <div className="text-3xl font-mono font-semibold text-white tabular-nums">
          {formatDuration(recording.duration)}
        </div>
        <div className="text-xs text-zinc-500 mt-1">
          {(recording.fileSize / 1024 / 1024).toFixed(2)} MB
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleStartStop}
          className={`flex-1 py-2.5 rounded-lg text-xs font-medium transition-colors ${
            isRecording 
              ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30' 
              : 'bg-[#1db954] text-black hover:bg-[#1ed760]'
          }`}
        >
          {isRecording ? '⏹ Stop' : '⏺ Record'}
        </button>
        <button
          onClick={handleAddMarker}
          disabled={!isRecording}
          className="px-3 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          🏷️
        </button>
        <button
          onClick={handleDownload}
          disabled={recording.duration === 0}
          className="px-3 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          ⬇️
        </button>
      </div>

      <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
        <h4 className="text-xs font-medium text-zinc-400 mb-2">Markers ({recording.markers.length})</h4>
        {recording.markers.length > 0 ? (
          <ul className="space-y-1.5 max-h-32 overflow-y-auto scrollbar-thin">
            {recording.markers.map(marker => (
              <li key={marker.id} className="flex items-center justify-between text-xs">
                <span className="font-mono text-zinc-300 tabular-nums">{formatDuration(marker.timestamp)}</span>
                <span className="text-zinc-500">{marker.label || 'Marker'}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-zinc-500">No markers yet</p>
        )}
      </div>
    </div>
  );
});

const ThemePanel = memo(function ThemePanel() {
  const { theme, setTheme, setLayout, setTransparentMode } = useStreamingStore();
  const themes = themeManager.getAvailableThemes();
  const layouts = themeManager.getAvailableLayouts();

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-white">Visual Theme</h3>

      <div className="grid grid-cols-2 gap-2">
        {themes.map(t => (
          <button
            key={t.id}
            onClick={() => {
              themeManager.setTheme(t.id);
              setTheme(t.id);
            }}
            className={`p-3 rounded-lg border transition-colors ${
              theme.currentTheme === t.id 
                ? 'border-[#1db954] bg-zinc-800' 
                : 'border-zinc-800 bg-zinc-900 hover:border-zinc-700'
            }`}
          >
            <div 
              className="w-full h-6 rounded mb-2"
              style={{ backgroundColor: t.colors.primary }}
            />
            <span className="text-xs font-medium text-zinc-300">{t.name}</span>
          </button>
        ))}
      </div>

      <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
        <h4 className="text-xs font-medium text-zinc-400 mb-2">Stream Layout</h4>
        <div className="flex gap-1.5">
          {layouts.map(l => (
            <button
              key={l.id}
              onClick={() => {
                themeManager.setLayout(l.id);
                setLayout(l.id);
              }}
              className={`flex-1 py-1.5 px-2 rounded text-[10px] font-medium transition-colors ${
                theme.currentLayout === l.id
                  ? 'bg-[#1db954] text-black'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
            >
              {l.aspectRatio}
            </button>
          ))}
        </div>
      </div>

      <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-medium text-zinc-400">Chroma Key</h4>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={theme.transparentMode}
              onChange={(e) => {
                if (e.target.checked) {
                  themeManager.enableTransparentMode();
                  setTransparentMode(true, '#00FF00');
                } else {
                  themeManager.disableTransparentMode();
                  setTransparentMode(false);
                }
              }}
              className="w-3.5 h-3.5 rounded border-zinc-700 bg-zinc-800 text-[#1db954] focus:ring-[#1db954] focus:ring-offset-0"
            />
            <span className="text-[10px] text-zinc-400">Enable</span>
          </label>
        </div>
        {theme.transparentMode && (
          <div className="flex gap-1.5">
            {(['#00FF00', '#0000FF', '#FF00FF'] as const).map(color => (
              <button
                key={color}
                onClick={() => {
                  themeManager.enableTransparentMode(color);
                  setTransparentMode(true, color);
                }}
                className={`w-8 h-8 rounded border-2 transition-colors ${
                  theme.chromaKeyColor === color ? 'border-white' : 'border-transparent'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
        <h4 className="text-xs font-medium text-zinc-400 mb-2">OBS Browser Source</h4>
        <div className="flex gap-1.5">
          <input
            type="text"
            readOnly
            value={themeManager.getStreamViewUrl()}
            className="flex-1 p-2 text-[10px] rounded-md bg-zinc-800 border border-zinc-700 text-zinc-400 font-mono"
          />
          <button
            onClick={() => navigator.clipboard.writeText(themeManager.getStreamViewUrl())}
            className="px-2.5 py-2 rounded-md bg-[#1db954] text-black text-[10px] font-medium hover:bg-[#1ed760] transition-colors"
          >
            Copy
          </button>
        </div>
      </div>
    </div>
  );
});

const ChatPanel = memo(function ChatPanel() {
  const { chat, setTwitchChannel } = useStreamingStore();
  const [channel, setChannel] = useState('');
  const [commands] = useState(commandParser.getAllCommands());

  const handleConnect = async () => {
    if (!channel) return;
    try {
      await chatIntegration.connectTwitch({ channel, anonymous: true });
      setTwitchChannel(channel);
    } catch (error) {
      console.error('Failed to connect:', error);
    }
  };

  const handleDisconnect = () => {
    chatIntegration.disconnect('twitch');
    setTwitchChannel(null);
  };

  const getStatusColor = (status: ConnectionStatus) => {
    switch (status) {
      case 'connected': return 'bg-[#1db954]';
      case 'connecting': return 'bg-amber-500 animate-pulse';
      case 'reconnecting': return 'bg-amber-500 animate-pulse';
      case 'error': return 'bg-red-500';
      default: return 'bg-zinc-600';
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-white">Chat Integration</h3>

      <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
        <div className="flex items-center gap-2 mb-2">
          <span className={`w-1.5 h-1.5 rounded-full ${getStatusColor(chat.twitchStatus)}`} />
          <h4 className="text-xs font-medium text-zinc-300">Twitch</h4>
          <span className="text-[10px] text-zinc-500">({chat.twitchStatus})</span>
        </div>
        
        {chat.twitchStatus === 'connected' ? (
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400">#{chat.twitchChannel}</span>
            <button
              onClick={handleDisconnect}
              className="px-2 py-1 rounded text-[10px] bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <div className="flex gap-1.5">
            <input
              type="text"
              placeholder="Channel name"
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
              className="flex-1 p-2 text-xs rounded-md bg-zinc-800 border border-zinc-700 text-zinc-300 placeholder:text-zinc-600 focus:border-[#1db954] focus:ring-0 focus:outline-none"
            />
            <button
              onClick={handleConnect}
              disabled={!channel || chat.twitchStatus === 'connecting'}
              className="px-3 py-2 rounded-md bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium disabled:opacity-40 transition-colors"
            >
              Connect
            </button>
          </div>
        )}
      </div>

      <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
        <h4 className="text-xs font-medium text-zinc-400 mb-2">Commands</h4>
        <div className="space-y-1 max-h-40 overflow-y-auto scrollbar-thin">
          {commands.map(cmd => (
            <div key={cmd.name} className="flex items-center justify-between py-1.5 border-b border-zinc-800 last:border-0">
              <div>
                <span className="font-mono text-xs text-[#1db954]">!{cmd.name}</span>
                <p className="text-[10px] text-zinc-500">{cmd.description}</p>
              </div>
              <input
                type="checkbox"
                checked={cmd.enabled}
                onChange={(e) => commandParser.setCommandEnabled(cmd.name, e.target.checked)}
                className="w-3.5 h-3.5 rounded border-zinc-700 bg-zinc-800 text-[#1db954] focus:ring-[#1db954] focus:ring-offset-0"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
        <h4 className="text-xs font-medium text-zinc-400 mb-2">Global Cooldown</h4>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min="0"
            max="30"
            step="1"
            defaultValue={5}
            onChange={(e) => commandParser.getCooldownManager().setGlobalCooldown(parseInt(e.target.value) * 1000)}
            className="flex-1"
          />
          <span className="text-xs font-mono text-zinc-400 w-8">5s</span>
        </div>
      </div>
    </div>
  );
});

const OverlayPanel = memo(function OverlayPanel() {
  const { setVisualizerConfig } = useStreamingStore();
  const components = overlayRenderer.getAllComponents();
  const visualizerConfig = overlayRenderer.getVisualizerConfig();

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-white">Overlay Components</h3>

      <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
        <h4 className="text-xs font-medium text-zinc-400 mb-2">Visible Components</h4>
        <div className="space-y-1">
          {components.map(comp => (
            <label key={comp.id} className="flex items-center justify-between py-1.5 cursor-pointer">
              <span className="text-xs text-zinc-300 capitalize">{comp.type.replace('-', ' ')}</span>
              <input
                type="checkbox"
                checked={comp.visible}
                onChange={() => overlayRenderer.toggleComponent(comp.id)}
                className="w-3.5 h-3.5 rounded border-zinc-700 bg-zinc-800 text-[#1db954] focus:ring-[#1db954] focus:ring-offset-0"
              />
            </label>
          ))}
        </div>
      </div>

      <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800">
        <h4 className="text-xs font-medium text-zinc-400 mb-3">Visualizer</h4>
        
        <div className="space-y-3">
          <div>
            <label className="text-[10px] text-zinc-500 mb-1 block">Type</label>
            <select
              value={visualizerConfig.type}
              onChange={(e) => {
                overlayRenderer.setVisualizerConfig({ type: e.target.value as 'frequency-bars' | 'waveform' | 'circular-spectrum' });
                setVisualizerConfig({ type: e.target.value as 'frequency-bars' | 'waveform' | 'circular-spectrum' });
              }}
              className="w-full p-2 text-xs rounded-md bg-zinc-800 border border-zinc-700 text-zinc-300 focus:border-[#1db954] focus:ring-0 focus:outline-none"
            >
              <option value="frequency-bars">Frequency Bars</option>
              <option value="waveform">Waveform</option>
              <option value="circular-spectrum">Circular Spectrum</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] text-zinc-500 mb-1 block">
              Intensity: {visualizerConfig.intensity}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={visualizerConfig.intensity}
              onChange={(e) => {
                overlayRenderer.setVisualizerConfig({ intensity: parseInt(e.target.value) });
                setVisualizerConfig({ intensity: parseInt(e.target.value) });
              }}
              className="w-full"
            />
          </div>

          <div>
            <label className="text-[10px] text-zinc-500 mb-1 block">Colors</label>
            <div className="flex gap-1.5">
              {visualizerConfig.colors.map((color, i) => (
                <input
                  key={i}
                  type="color"
                  value={color}
                  onChange={(e) => {
                    const newColors = [...visualizerConfig.colors];
                    newColors[i] = e.target.value;
                    overlayRenderer.setVisualizerConfig({ colors: newColors });
                    setVisualizerConfig({ colors: newColors });
                  }}
                  className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => overlayRenderer.resetLayout()}
        className="w-full py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-400 transition-colors"
      >
        Reset to Defaults
      </button>
    </div>
  );
});

export const StreamingDashboard = memo(function StreamingDashboard() {
  const [activeTab, setActiveTab] = useState<TabId>('audio');
  const [isOpen, setIsOpen] = useState(true);

  const tabs: { id: TabId; label: string; icon: string }[] = [
    { id: 'audio', label: 'Audio', icon: '🔊' },
    { id: 'recording', label: 'Record', icon: '⏺' },
    { id: 'theme', label: 'Theme', icon: '🎨' },
    { id: 'chat', label: 'Chat', icon: '💬' },
    { id: 'overlay', label: 'Overlay', icon: '🖼️' },
  ];

  const renderPanel = () => {
    switch (activeTab) {
      case 'audio': return <AudioRouterPanel />;
      case 'recording': return <RecordingPanel />;
      case 'theme': return <ThemePanel />;
      case 'chat': return <ChatPanel />;
      case 'overlay': return <OverlayPanel />;
    }
  };

  return (
    <div className={`
      fixed right-0 top-0 h-full bg-black border-l border-zinc-800
      transition-all duration-200 z-50
      ${isOpen ? 'w-80' : 'w-10'}
    `}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -left-8 top-4 w-6 h-6 rounded-l-md bg-zinc-900 border border-zinc-800 border-r-0 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors"
      >
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {isOpen ? <path d="M9 18l6-6-6-6" /> : <path d="M15 18l-6-6 6-6" />}
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="h-12 flex items-center px-4 border-b border-zinc-800">
            <h2 className="text-sm font-semibold text-white">Streaming</h2>
          </div>

          <div className="flex border-b border-zinc-800">
            {tabs.map(tab => (
              <Tab
                key={tab.id}
                {...tab}
                active={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
              />
            ))}
          </div>

          <div className="p-3 overflow-y-auto h-[calc(100%-104px)] scrollbar-thin">
            {renderPanel()}
          </div>
        </>
      )}
    </div>
  );
});

export default StreamingDashboard;
