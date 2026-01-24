import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'RhythmCode - Code-Based DJ Platform',
  description: 'Professional DJ platform where code meets creativity. Mix, remix, and perform with the power of programming.',
  keywords: ['DJ', 'music', 'code', 'remix', 'electronic music', 'live coding'],
  authors: [{ name: 'RhythmCode Team' }],
  openGraph: {
    title: 'RhythmCode - Code-Based DJ Platform',
    description: 'Professional DJ platform where code meets creativity',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RhythmCode',
    description: 'Code-Based DJ Platform',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
