'use client';

import { Sparkles } from 'lucide-react';

const SUGGESTIONS = [
  'Build a microservices e-commerce platform with React, Node.js, and MongoDB',
  'Create a real-time chat app with Socket.io, Redis Pub/Sub, and PostgreSQL',
  'Design a SaaS dashboard with Next.js, auth, billing via Stripe, and analytics',
  'Build a REST API backend with Express, JWT auth, rate limiting, and caching',
];

interface Props {
  onSelect: (prompt: string) => void;
}

export function PromptSuggestions({ onSelect }: Props) {
  return (
    <div className="mb-3">
      <div className="flex items-center gap-1.5 mb-2 text-xs text-text-secondary">
        <Sparkles className="w-3.5 h-3.5 text-accent" />
        <span>Try one of these:</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {SUGGESTIONS.map((s, i) => (
          <button
            key={i}
            onClick={() => onSelect(s)}
            className="px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-xs text-accent hover:bg-accent/20 transition-colors truncate max-w-xs"
          >
            {s.length > 60 ? s.slice(0, 60) + '…' : s}
          </button>
        ))}
      </div>
    </div>
  );
}
