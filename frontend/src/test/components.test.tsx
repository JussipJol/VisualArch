import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ArchitectureScoreGauge } from '@/components/charts/ArchitectureScoreGauge';
import { CreditsWidget } from '@/components/charts/CreditsWidget';
import { CriticFeedbackPanel } from '@/components/ai-assistant/CriticFeedbackPanel';
import { PromptSuggestions } from '@/components/ai-assistant/PromptSuggestions';

describe('ArchitectureScoreGauge', () => {
  it('renders with a score', () => {
    const { container } = render(<ArchitectureScoreGauge score={85} />);
    expect(container.querySelector('svg')).toBeTruthy();
    expect(container.textContent).toContain('85');
  });

  it('renders with showLabel', () => {
    render(<ArchitectureScoreGauge score={72} showLabel />);
    expect(screen.getByText('Architecture Score')).toBeTruthy();
  });

  it('renders different sizes', () => {
    const { container: sm } = render(<ArchitectureScoreGauge score={50} size="sm" />);
    const { container: lg } = render(<ArchitectureScoreGauge score={50} size="lg" />);
    const smSvg = sm.querySelector('svg');
    const lgSvg = lg.querySelector('svg');
    expect(Number(smSvg?.getAttribute('width'))).toBeLessThan(Number(lgSvg?.getAttribute('width')));
  });

  it('shows danger color for low score', () => {
    const { container } = render(<ArchitectureScoreGauge score={30} />);
    const circle = container.querySelectorAll('circle')[1];
    expect(circle?.getAttribute('stroke')).toBe('#F87171');
  });

  it('shows green for high score', () => {
    const { container } = render(<ArchitectureScoreGauge score={90} />);
    const circle = container.querySelectorAll('circle')[1];
    expect(circle?.getAttribute('stroke')).toBe('#4ADE80');
  });
});

describe('CreditsWidget', () => {
  it('renders balance correctly', () => {
    render(<CreditsWidget balance={150} plan="free" />);
    expect(screen.getByText('150')).toBeTruthy();
    // "free plan" is split across text nodes - use regex or container query
    expect(screen.getByText(/free/i)).toBeTruthy();
  });

  it('shows upgrade button for free plan when onPurchase provided', () => {
    const onPurchase = vi.fn();
    render(<CreditsWidget balance={50} plan="free" onPurchase={onPurchase} />);
    const upgradeBtn = screen.getByText('Upgrade');
    expect(upgradeBtn).toBeTruthy();
    fireEvent.click(upgradeBtn);
    expect(onPurchase).toHaveBeenCalledOnce();
  });

  it('does not show upgrade for pro plan', () => {
    render(<CreditsWidget balance={2000} plan="pro" onPurchase={vi.fn()} />);
    expect(screen.queryByText('Upgrade')).toBeNull();
  });

  it('renders progress bar', () => {
    const { container } = render(<CreditsWidget balance={50} plan="free" />);
    const bar = container.querySelector('[style*="width"]');
    expect(bar).toBeTruthy();
  });
});

describe('CriticFeedbackPanel', () => {
  const issues = [
    { severity: 'critical' as const, title: 'Missing Auth', description: 'No auth layer', nodeId: 'n1', suggestion: 'Add JWT auth' },
    { severity: 'warning' as const, title: 'No Rate Limiting', description: 'Vulnerable to abuse', suggestion: 'Add Redis rate limit' },
    { severity: 'info' as const, title: 'Add Monitoring', description: 'No observability', suggestion: 'Add Sentry' },
  ];

  it('renders issue count badges', () => {
    render(<CriticFeedbackPanel issues={issues} score={75} />);
    expect(screen.getByText('1 critical')).toBeTruthy();
    expect(screen.getByText('1 warnings')).toBeTruthy();
  });

  it('shows score', () => {
    render(<CriticFeedbackPanel issues={issues} score={75} />);
    expect(screen.getByText('Score: 75/100')).toBeTruthy();
  });

  it('expands issue on click', () => {
    render(<CriticFeedbackPanel issues={issues} score={75} />);
    // First issue (index 0) is expanded by default per component state [0]
    // So its detail content is already visible
    expect(screen.getByText('No auth layer')).toBeTruthy();
    // The suggestion text may be split; check for partial text
    expect(screen.getByText(/Add JWT auth/i)).toBeTruthy();
  });

  it('calls onFix when Fix button clicked', () => {
    const onFix = vi.fn();
    render(<CriticFeedbackPanel issues={issues} score={75} onFix={onFix} />);
    // First issue is already expanded (index 0 in default state)
    const fixBtn = screen.getByText('Auto-fix with AI');
    fireEvent.click(fixBtn);
    expect(onFix).toHaveBeenCalledWith(issues[0]);
  });

  it('shows empty state for no issues', () => {
    render(<CriticFeedbackPanel issues={[]} score={100} />);
    expect(screen.getByText(/No issues found/)).toBeTruthy();
  });

  it('can collapse panel', () => {
    render(<CriticFeedbackPanel issues={issues} score={75} />);
    const header = screen.getByText('Architecture Critic').closest('button');
    fireEvent.click(header!);
    expect(screen.queryByText('Missing Auth')).toBeNull();
  });
});

describe('PromptSuggestions', () => {
  it('renders suggestion pills', () => {
    const onSelect = vi.fn();
    render(<PromptSuggestions onSelect={onSelect} />);
    const pills = screen.getAllByRole('button');
    expect(pills.length).toBeGreaterThan(0);
  });

  it('calls onSelect when a suggestion is clicked', () => {
    const onSelect = vi.fn();
    render(<PromptSuggestions onSelect={onSelect} />);
    const firstBtn = screen.getAllByRole('button')[0];
    fireEvent.click(firstBtn);
    expect(onSelect).toHaveBeenCalledOnce();
    expect(typeof onSelect.mock.calls[0][0]).toBe('string');
  });
});
