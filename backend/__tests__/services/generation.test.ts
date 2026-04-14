import { describe, it, expect } from '@jest/globals';
import { PromptBuilders } from '../../src/services/prompt.builders';

/**
 * Golden Master Tests for AI Prompt Builders
 * These tests ensure that changes to the prompt logic are intentional
 * by using Jest snapshots.
 */
describe('GenerationService Prompt Builders (Golden Master)', () => {
  const mockArch = {
    nodes: [
      { id: 'node-1', label: 'API Gateway', layer: 'Gateway', description: 'Entry point', status: 'stable', position: { x: 0, y: 0 }, files: [] },
      { id: 'node-2', label: 'Auth Service', layer: 'Services', description: 'Auth logic', status: 'stable', position: { x: 100, y: 100 }, files: [] }
    ],
    edges: [{ id: 'e-1', source: 'node-1', target: 'node-2', label: 'auth' }],
    techStack: ['Node.js', 'Express'],
    layoutDirection: 'TB' as const
  };

  describe('Planning Prompt', () => {
    it('should match snapshot for basic prompt', () => {
      const prompt = PromptBuilders.buildPlanningPrompt('Build a simple todo app');
      expect(prompt).toMatchSnapshot();
    });

    it('should match snapshot with design context', () => {
      const prompt = PromptBuilders.buildPlanningPrompt('Build a shop', 'Visual Context: Navbar, Hero, Feature Grid');
      expect(prompt).toMatchSnapshot();
    });
  });

  describe('Coding Prompt', () => {
    it('should match snapshot for a specific node', () => {
      const prompt = PromptBuilders.buildCodingPrompt('OrderService', 'Handles order lifecycle', 'Ecommerce System');
      expect(prompt).toMatchSnapshot();
    });
  });

  describe('Critique Prompt', () => {
    it('should match snapshot for architecture review', () => {
      const prompt = PromptBuilders.buildCritiquePrompt(
        'Realtime Chat',
        ['Socket.io', 'Redis'],
        [{ label: 'Web Server' }, { label: 'PubSub' }]
      );
      expect(prompt).toMatchSnapshot();
    });
  });

  describe('Reconciliation Prompt', () => {
    it('should match snapshot for code changes', () => {
      const diffs = [
        '--- FILE: src/auth.ts ---\nDIFF SUMMARY:\n+ L10: import { jwt } from "jsonwebtoken";',
        '--- FILE: src/app.ts ---\nDIFF SUMMARY:\n- L5: const oldLine = 1;\n+ L5: const newLine = 2;'
      ];
      const prompt = PromptBuilders.buildReconciliationPrompt(mockArch, diffs);
      expect(prompt).toMatchSnapshot();
    });
  });
});
