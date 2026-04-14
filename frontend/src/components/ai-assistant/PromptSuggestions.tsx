'use client';

import { Sparkles } from 'lucide-react';

const SUGGESTIONS = [
  'Build a microservices e-commerce platform with React, Node.js, and MongoDB',
  'Create a real-time chat app with Socket.io, Redis Pub/Sub, and PostgreSQL',
  'Design a SaaS dashboard with Next.js, JWT auth, Stripe billing, and analytics',
  'Build a REST API backend with Express, rate limiting, Redis cache, and RBAC',
  'Create a social platform with Next.js, GraphQL, and real-time notifications',
  'Design a CI/CD-ready monorepo with Docker, Kubernetes, and GitHub Actions',
];

interface Props {
  onSelect: (prompt: string) => void;
}

export function PromptSuggestions({ onSelect }: Props) {
  return (
    <div className="mb-3">
      <div className="flex items-center gap-1.5 mb-2 text-xs text-text-secondary">
        <Sparkles className="w-3.5 h-3.5 text-accent" />
        <span>Start with a template prompt:</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {SUGGESTIONS.map((s, i) => (
          <button
            key={i}
            onClick={() => onSelect(s)}
            className="px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-xs text-accent hover:bg-accent/20 transition-colors"
            title={s}
          >
            {s.length > 55 ? `${s.slice(0, 55)}…` : s}
          </button>
        ))}
      </div>
    </div>
  );
}
