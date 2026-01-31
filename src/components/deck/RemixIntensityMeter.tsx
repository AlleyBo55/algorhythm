'use client';

import { useEffect, useState } from 'react';
import { Card } from '../ui/Card';

interface RemixIntensityMeterProps {
  intensity: number; // 0-1
}

export function RemixIntensityMeter({ intensity }: RemixIntensityMeterProps) {
  const [displayIntensity, setDisplayIntensity] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayIntensity(prev => {
        const diff = intensity - prev;
        if (Math.abs(diff) < 0.01) return intensity;
        return prev + diff * 0.1;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [intensity]);

  const percentage = Math.round(displayIntensity * 100);
  const color = displayIntensity < 0.3 ? 'bg-blue-500' : 
                displayIntensity < 0.7 ? 'bg-purple-500' : 
                'bg-pink-500';

  return (
    <Card variant="elevated" className="p-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
            Remix Intensity
          </span>
          <span className="text-lg font-bold text-white">{percentage}%</span>
        </div>
        <div className="h-2 bg-black/40 rounded-full overflow-hidden">
          <div className={`h-full ${color} transition-all duration-300 ease-out`} style={{ width: `${percentage}%` }} />
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>Original</span>
          <span>Remix</span>
        </div>
        <div className="flex items-center gap-2 pt-1">
          <div className={`w-2 h-2 rounded-full ${
            displayIntensity < 0.1 ? 'bg-blue-400' :
            displayIntensity < 0.5 ? 'bg-purple-400 animate-pulse' :
            'bg-pink-400 animate-pulse'
          }`} />
          <span className="text-xs text-muted-foreground">
            {displayIntensity < 0.1 ? 'Original Track' :
             displayIntensity < 0.5 ? 'Building...' :
             displayIntensity < 0.9 ? 'Blending' : 'Full Remix'}
          </span>
        </div>
      </div>
    </Card>
  );
}
