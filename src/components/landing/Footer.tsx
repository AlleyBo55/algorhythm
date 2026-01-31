'use client';

import { memo } from 'react';
import Link from 'next/link';

const FOOTER_LINKS = {
  Product: ['Features', 'Pricing', 'Templates', 'Changelog'],
  Resources: ['Documentation', 'API Reference', 'Examples', 'Blog'],
  Company: ['About', 'Careers', 'Press', 'Contact'],
  Legal: ['Privacy', 'Terms', 'Cookies', 'Licenses'],
};

const SOCIAL_LINKS = [
  { name: 'twitter', icon: '𝕏' },
  { name: 'github', icon: '⌘' },
  { name: 'discord', icon: '💬' },
];

export const Footer = memo(function Footer() {
  return (
    <footer className="relative py-16 px-6 border-t border-zinc-800/50">
      <div className="max-w-7xl mx-auto">
        <FooterContent />
        <FooterBottom />
      </div>
    </footer>
  );
});

const FooterContent = memo(function FooterContent() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
      <BrandColumn />
      {Object.entries(FOOTER_LINKS).map(([category, links]) => (
        <LinkColumn key={category} category={category} links={links} />
      ))}
    </div>
  );
});

const BrandColumn = memo(function BrandColumn() {
  return (
    <div className="col-span-2 md:col-span-1">
      <Link href="/" className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 p-[1px]">
          <div className="w-full h-full rounded-[7px] bg-[#030303] flex items-center justify-center">
            <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" fill="currentColor" stroke="none" />
              <circle cx="18" cy="16" r="3" fill="currentColor" stroke="none" />
            </svg>
          </div>
        </div>
        <span className="text-lg font-light text-white">
          Algo<span className="font-semibold text-emerald-400">Rhythm</span>
        </span>
      </Link>
      <p className="text-sm text-zinc-500 mb-4">Where code meets sound.</p>
      <SocialLinks />
    </div>
  );
});

const SocialLinks = memo(function SocialLinks() {
  return (
    <div className="flex gap-4">
      {SOCIAL_LINKS.map((social) => (
        <a
          key={social.name}
          href="#"
          className="text-zinc-600 hover:text-white transition-colors"
        >
          <span className="sr-only">{social.name}</span>
          <div className="w-8 h-8 rounded-full bg-zinc-800/50 flex items-center justify-center hover:bg-zinc-700/50 transition-colors">
            {social.icon}
          </div>
        </a>
      ))}
    </div>
  );
});

const LinkColumn = memo(function LinkColumn({ category, links }: { category: string; links: string[] }) {
  return (
    <div>
      <h4 className="text-sm font-medium text-white mb-4">{category}</h4>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link}>
            <a href="#" className="text-sm text-zinc-500 hover:text-white transition-colors">
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
});

const FooterBottom = memo(function FooterBottom() {
  return (
    <div className="pt-8 border-t border-zinc-800/50 flex flex-col sm:flex-row justify-between items-center gap-4">
      <p className="text-sm text-zinc-600">© 2026 AlgoRhythm. All rights reserved.</p>
      <div className="flex items-center gap-4 text-sm text-zinc-600">
        <span>Made with 💚 for musicians who code</span>
      </div>
    </div>
  );
});
