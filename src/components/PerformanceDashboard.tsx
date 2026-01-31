'use client';

import { memo, useState, useEffect } from 'react';
import { performanceMonitor, PerformanceMetrics } from '@/lib/performanceMonitor';
import { cn } from './ui/Button';

export const PerformanceDashboard = memo(function PerformanceDashboard() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    renderTime: 0,
    cpuUsage: 0,
    memoryUsage: 0,
    audioLatency: 0,
  });
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(performanceMonitor.getMetrics());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const healthy = performanceMonitor.isHealthy();

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setExpanded(!expanded)}
        className={cn(
          "flex items-center gap-2 h-8 px-3 rounded-full text-xs font-medium transition-colors",
          healthy 
            ? "bg-[#1db954]/10 text-[#1db954] border border-[#1db954]/20" 
            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
        )}
      >
        <div className={cn(
          "w-1.5 h-1.5 rounded-full",
          healthy ? "bg-[#1db954]" : "bg-amber-400 animate-pulse"
        )} />
        {metrics.fps} FPS
      </button>

      {expanded && (
        <div className="absolute bottom-full right-0 mb-2 w-48 p-3 rounded-xl bg-zinc-900 border border-zinc-800 shadow-xl animate-fade-up">
          <div className="space-y-3">
            <Metric label="FPS" value={metrics.fps} target={60} />
            <Metric label="Render" value={metrics.renderTime} unit="ms" target={16} inverse />
            <Metric label="CPU" value={metrics.cpuUsage} unit="%" target={30} inverse />
            <Metric label="Memory" value={metrics.memoryUsage} unit="MB" target={500} inverse />
            <Metric label="Latency" value={metrics.audioLatency} unit="ms" target={15} inverse />
          </div>
        </div>
      )}
    </div>
  );
});

const Metric = memo(function Metric({
  label,
  value,
  unit = '',
  target,
  inverse = false,
}: {
  label: string;
  value: number;
  unit?: string;
  target: number;
  inverse?: boolean;
}) {
  const good = inverse ? value <= target : value >= target;

  return (
    <div className="flex items-center justify-between">
      <span className="text-[10px] text-zinc-500 uppercase">{label}</span>
      <span className={cn(
        "text-xs font-mono tabular-nums",
        good ? "text-[#1db954]" : "text-amber-400"
      )}>
        {value}{unit}
      </span>
    </div>
  );
});

export default PerformanceDashboard;
