'use client';

import { Zap } from 'lucide-react';

interface Props {
  balance: number;
  plan: string;
  onPurchase?: () => void;
}

const PLAN_MAX: Record<string, number> = {
  free: 100,
  pro: 2000,
  team: 10000,
  enterprise: 99999,
};

export function CreditsWidget({ balance, plan, onPurchase }: Props) {
  const max = PLAN_MAX[plan] ?? 100;
  const pct = Math.min((balance / max) * 100, 100);
  const color =
    pct > 50 ? '#4ADE80' :
    pct > 20 ? '#FACC15' : '#F87171';

  return (
    <div className="p-3 rounded-xl bg-surface-2 border border-white/5">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-xs text-text-secondary">
          <Zap className="w-3 h-3 text-accent" />
          <span>Credits</span>
        </div>
        <span className="text-xs font-semibold text-text-primary">{balance.toLocaleString()}</span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 rounded-full bg-surface overflow-hidden mb-2">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: color, boxShadow: `0 0 6px ${color}60` }}
        />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-text-secondary capitalize">{plan} plan</span>
        {plan === 'free' && onPurchase && (
          <button onClick={onPurchase} className="text-xs text-accent hover:underline">
            Upgrade
          </button>
        )}
      </div>
    </div>
  );
}
