'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Book, Code, Zap, Music, Gamepad2, Sparkles, Home } from 'lucide-react';

const sections = [
  { title: 'Getting Started', href: '/docs', icon: Home },
  { title: 'Core Concepts', href: '/docs/concepts', icon: Book },
  { title: 'API Reference', href: '/docs/api', icon: Code },
  { title: 'DJ Techniques', href: '/docs/techniques', icon: Music },
  { title: 'Effects Guide', href: '/docs/effects', icon: Zap },
  { title: 'MIDI Setup', href: '/docs/midi', icon: Gamepad2 },
  { title: 'AI Assistant', href: '/docs/ai', icon: Sparkles },
  { title: 'Examples', href: '/docs/examples', icon: Sparkles },
];

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <Link href="/" className="flex items-center gap-3 w-fit">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🎧</span>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                RhythmCode Docs
              </h1>
            </div>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="flex gap-8">
          <aside className="w-64 shrink-0">
            <nav className="sticky top-24 space-y-1">
              {sections.map((section) => {
                const Icon = section.icon;
                const isActive = pathname === section.href;
                return (
                  <Link
                    key={section.href}
                    href={section.href}
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{section.title}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>

          <main className="flex-1 max-w-4xl">
            <div className="prose prose-invert prose-blue max-w-none">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
