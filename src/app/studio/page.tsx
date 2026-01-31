'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { WelcomeScreen } from '@/components/studio-welcome';
import { useStudioState } from '@/hooks';

const Studio = dynamic(() => import('@/components/Studio'), { ssr: false });
const LoadingScreen = dynamic(() => import('@/components/LoadingScreen'), { ssr: false });

export default function StudioPage() {
  const { state, handleStart, handleLoadingComplete } = useStudioState();

  if (state === 'welcome') {
    return <WelcomeScreen onStart={handleStart} />;
  }

  if (state === 'loading') {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Studio />
    </Suspense>
  );
}

function LoadingFallback() {
  return (
    <div className="fixed inset-0 bg-[#030303] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
    </div>
  );
}
