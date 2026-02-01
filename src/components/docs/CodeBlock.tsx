'use client';

import { useState } from 'react';

interface CodeBlockProps {
  children: string;
  language?: 'typescript' | 'javascript' | 'bash';
  filename?: string;
  showLineNumbers?: boolean;
}

// Token types for syntax highlighting
type TokenType = 
  | 'keyword' 
  | 'string' 
  | 'number' 
  | 'comment' 
  | 'function' 
  | 'property' 
  | 'operator' 
  | 'punctuation'
  | 'type'
  | 'variable'
  | 'plain';

interface Token {
  type: TokenType;
  value: string;
}

// Color scheme matching professional code editors
const TOKEN_COLORS: Record<TokenType, string> = {
  keyword: '#c678dd',      // Purple - const, let, if, return, async, await
  string: '#98c379',       // Green - strings
  number: '#d19a66',       // Orange - numbers
  comment: '#5c6370',      // Gray - comments
  function: '#61afef',     // Blue - function names
  property: '#e5c07b',     // Yellow - object properties
  operator: '#56b6c2',     // Cyan - operators
  punctuation: '#abb2bf',  // Light gray - brackets, semicolons
  type: '#e06c75',         // Red - types
  variable: '#e06c75',     // Red - dj, this
  plain: '#abb2bf',        // Default text
};

// Keywords for TypeScript/JavaScript
const KEYWORDS = new Set([
  'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while',
  'do', 'switch', 'case', 'break', 'continue', 'new', 'this', 'class',
  'extends', 'import', 'export', 'from', 'default', 'async', 'await',
  'try', 'catch', 'finally', 'throw', 'typeof', 'instanceof', 'in', 'of',
  'true', 'false', 'null', 'undefined', 'void', 'get', 'set'
]);

const TYPES = new Set([
  'string', 'number', 'boolean', 'object', 'any', 'void', 'never',
  'unknown', 'Array', 'Promise', 'Map', 'Set', 'Record'
]);

function tokenize(code: string): Token[][] {
  const lines = code.split('\n');
  return lines.map(line => tokenizeLine(line));
}

function tokenizeLine(line: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < line.length) {
    // Skip whitespace
    if (/\s/.test(line[i])) {
      let ws = '';
      while (i < line.length && /\s/.test(line[i])) {
        ws += line[i];
        i++;
      }
      tokens.push({ type: 'plain', value: ws });
      continue;
    }

    // Comments
    if (line.slice(i, i + 2) === '//') {
      tokens.push({ type: 'comment', value: line.slice(i) });
      break;
    }

    // Strings (single or double quotes)
    if (line[i] === '"' || line[i] === "'" || line[i] === '`') {
      const quote = line[i];
      let str = quote;
      i++;
      while (i < line.length && line[i] !== quote) {
        if (line[i] === '\\' && i + 1 < line.length) {
          str += line[i] + line[i + 1];
          i += 2;
        } else {
          str += line[i];
          i++;
        }
      }
      if (i < line.length) {
        str += line[i];
        i++;
      }
      tokens.push({ type: 'string', value: str });
      continue;
    }

    // Numbers
    if (/\d/.test(line[i]) || (line[i] === '.' && /\d/.test(line[i + 1] || ''))) {
      let num = '';
      while (i < line.length && /[\d.xXa-fA-F]/.test(line[i])) {
        num += line[i];
        i++;
      }
      tokens.push({ type: 'number', value: num });
      continue;
    }

    // Identifiers and keywords
    if (/[a-zA-Z_$]/.test(line[i])) {
      let ident = '';
      while (i < line.length && /[a-zA-Z0-9_$]/.test(line[i])) {
        ident += line[i];
        i++;
      }

      // Check what comes after
      const nextNonSpace = line.slice(i).match(/^\s*(.)/)?.[1];

      if (KEYWORDS.has(ident)) {
        tokens.push({ type: 'keyword', value: ident });
      } else if (TYPES.has(ident)) {
        tokens.push({ type: 'type', value: ident });
      } else if (ident === 'dj' || ident === 'Tone') {
        tokens.push({ type: 'variable', value: ident });
      } else if (nextNonSpace === '(') {
        tokens.push({ type: 'function', value: ident });
      } else if (tokens.length > 0 && tokens[tokens.length - 1].value === '.') {
        tokens.push({ type: 'property', value: ident });
      } else {
        tokens.push({ type: 'plain', value: ident });
      }
      continue;
    }

    // Operators
    if (/[+\-*/%=<>!&|^~?:]/.test(line[i])) {
      let op = line[i];
      i++;
      // Handle multi-char operators
      while (i < line.length && /[+\-*/%=<>!&|^~?:]/.test(line[i])) {
        op += line[i];
        i++;
      }
      tokens.push({ type: 'operator', value: op });
      continue;
    }

    // Punctuation
    if (/[{}[\]();,.]/.test(line[i])) {
      tokens.push({ type: 'punctuation', value: line[i] });
      i++;
      continue;
    }

    // Anything else
    tokens.push({ type: 'plain', value: line[i] });
    i++;
  }

  return tokens;
}

export function CodeBlock({ children, language = 'typescript', filename, showLineNumbers = true }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const code = children.trim();
  const tokenizedLines = tokenize(code);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative rounded-lg overflow-hidden border border-white/[0.08] bg-[#0d0d0d]">
      {/* Header */}
      {filename && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-white/[0.06] bg-white/[0.02]">
          <span className="text-xs text-white/40 font-mono">{filename}</span>
          <span className="text-[10px] text-white/20 uppercase tracking-wider">{language}</span>
        </div>
      )}

      {/* Copy button */}
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-1.5 rounded-md bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100"
        title="Copy code"
      >
        {copied ? (
          <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        )}
      </button>

      {/* Code content */}
      <div className="overflow-x-auto">
        <pre className="p-4 text-sm leading-relaxed" style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}>
          <code>
            {tokenizedLines.map((lineTokens, lineIndex) => (
              <div key={lineIndex} className="flex">
                {showLineNumbers && (
                  <span className="select-none w-8 pr-4 text-right text-white/20 text-xs">
                    {lineIndex + 1}
                  </span>
                )}
                <span>
                  {lineTokens.map((token, tokenIndex) => (
                    <span
                      key={tokenIndex}
                      style={{ color: TOKEN_COLORS[token.type] }}
                    >
                      {token.value}
                    </span>
                  ))}
                </span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}

// Inline code component
export function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code 
      className="px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/[0.08] text-emerald-400 text-sm"
      style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}
    >
      {children}
    </code>
  );
}
