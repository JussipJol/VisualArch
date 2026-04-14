import { ArchitectureData, ArchitectureNode, ArchitectureEdge, CriticFeedback, CriticIssue, CodeFile } from '../types';
import { groqAdapter } from './ai/groq.adapter';
import { generateCodeFiles, generateTestFiles } from './code-generator';
import { generateMockArchitecture, MOCK_DELAY } from './mock-engine';

interface GenerationOptions {
  prompt: string;
  previousArchitecture?: ArchitectureData;
  designState?: any;
  useStream?: boolean;
  onEvent?: (event: string, data: Record<string, unknown>) => void;
  signal?: AbortSignal;
}

interface GenerationResult {
  architectureData: ArchitectureData;
  criticFeedback: CriticFeedback;
  designState?: any;
  totalTimeMs: number;
  creditsUsed: number;
  modelUsed: string;
}

export class GenerationService {
  // ─── Main entry point ────────────────────────────────────────────────────────

  async generate(options: GenerationOptions): Promise<GenerationResult> {
    const startTime = Date.now();
    const { prompt, previousArchitecture, onEvent, signal } = options;

    if (!groqAdapter.isEnabled) {
      const mock = await generateMockArchitecture(prompt, previousArchitecture, onEvent, signal);
      return {
        ...mock,
        totalTimeMs: Date.now() - startTime,
      };
    }

    try {
      return await this.generateWithAI(options, startTime);
    } catch (error: any) {
      console.error('[AI Generation] Pipeline failed, falling back to mock:', error.message ?? error);
      onEvent?.('ai_fallback', { reason: error.message ?? 'AI request failed', model: 'mock-engine' });

      const mock = await generateMockArchitecture(prompt, previousArchitecture, onEvent, signal);
      return { ...mock, totalTimeMs: Date.now() - startTime };
    }
  }

  // ─── AI pipeline (4 stages) ──────────────────────────────────────────────────

  private async generateWithAI(options: GenerationOptions, startTime: number): Promise<GenerationResult> {
    const { prompt, previousArchitecture, designState, onEvent, signal } = options;

    // Stage 0 – memory
    onEvent?.('memory_retrieved', { count: 0, relevant_decisions: [] });

    // Stage 1 – planning
    onEvent?.('planning_start', { iteration: 1, memory_used: false });

    let planPrompt = `
      As a lead software architect, design a system architecture for: "${prompt}"
      Use a modern, production-ready tech stack (React, Node.js, etc. where applicable).
      Return 4-8 nodes for a clean, readable diagram.

      Return JSON:
      {
        "techStack": string[],
        "nodes": [{ "label": string, "layer": string, "description": string, "position": { "x": number, "y": number } }],
        "edges": [{ "sourceLabel": string, "targetLabel": string, "label": string }],
        "suggestedDesign": {
          "ROOT": {
            "type": { "resolvedName": "Container" },
            "isCanvas": true,
            "props": { "padding": "40px", "background": "#0D0E1A" },
            "displayName": "Container",
            "custom": {}, "parent": null, "hidden": false, "nodes": ["node-1"], "linkedNodes": {}
          },
          "node-1": {
             "type": { "resolvedName": "Hero" | "Section" | "Text" | "Button" | "Container" },
             "isCanvas": boolean,
             "props": object,
             "displayName": string,
             "parent": "ROOT",
             "nodes": string[],
             "custom": {}, "hidden": false, "linkedNodes": {}
          }
        }
      }

      MUST: only use "Container", "Hero", "Section", "Text", "Button" in resolvedName.
    `;

    if (designState) {
      const designContext = this.parseDesignState(designState);
      if (designContext) {
        planPrompt = `
          Visual Design Context from User Sketch:
          ${designContext}

          ${planPrompt}

          IMPORTANT: Prioritize components and relationships visible in the Visual Design Context.
        `;
      }
    }

    const plan = await groqAdapter.generateJson<{
      techStack: string[];
      nodes: any[];
      edges: any[];
      suggestedDesign?: any;
    }>(planPrompt, undefined, signal);

    const nodes: ArchitectureNode[] = plan.nodes.map((n: any, i: number) => ({
      ...n,
      id: `node-${i + 1}`,
      status: 'new' as const,
      files: [],
      testFiles: [],
    }));

    const edges: ArchitectureEdge[] = plan.edges.map((e: any, i: number) => {
      const source = nodes.find(n => n.label === e.sourceLabel);
      const target = nodes.find(n => n.label === e.targetLabel);
      return {
        id: `e-${i}`,
        source: source?.id ?? nodes[0]?.id ?? 'node-1',
        target: target?.id ?? nodes[1]?.id ?? 'node-2',
        label: e.label,
      };
    });

    onEvent?.('planning_done', { node_count: nodes.length, tech_stack: plan.techStack });

    // Stage 2 – code generation (parallel per node)
    onEvent?.('coding_start', { total: nodes.length });

    await Promise.all(nodes.map(async (node, i) => {
      if (signal?.aborted) return;
      onEvent?.('coding_node', { id: node.id, label: node.label, index: i + 1, total: nodes.length });

      try {
        const codePrompt = `
          Generate 2 production-ready files for the component: "${node.label}" (${node.description})
          System context: ${prompt}

          Return JSON: { "files": [{ "name": string, "path": string, "content": string, "language": string }] }
        `;
        const codeResult = await groqAdapter.generateJson<{ files: CodeFile[] }>(codePrompt, undefined, signal);
        node.files = codeResult.files ?? generateCodeFiles(node.label, node.layer);
      } catch {
        node.files = generateCodeFiles(node.label, node.layer);
      }

      node.testFiles = generateTestFiles(node.label);
      onEvent?.('node_done', { id: node.id, label: node.label, file_count: node.files.length });
    }));

    // Stage 3 – critique
    onEvent?.('critique_start', {});

    const criticPrompt = `
      Analyze this architecture for: "${prompt}"
      Tech Stack: ${plan.techStack.join(', ')}
      Components: ${nodes.map(n => `${n.label} (${n.layer})`).join(', ')}

      Check for: circular dependencies, missing auth, missing error handling,
      security holes, God Objects, tight coupling, missing observability.

      Return JSON:
      {
        "score": number (0-100),
        "issues": [{ "severity": "critical"|"warning"|"info", "title": string, "description": string, "suggestion": string }]
      }
    `;

    const criticResult = await groqAdapter.generateJson<{
      score: number;
      issues: CriticIssue[];
    }>(criticPrompt, undefined, signal);

    const criticFeedback: CriticFeedback = {
      score: Math.max(0, Math.min(100, criticResult.score)),
      issues: criticResult.issues ?? [],
      timestamp: new Date(),
    };

    onEvent?.('critique_done', { score: criticFeedback.score, issues_count: criticFeedback.issues.length });

    const architectureData: ArchitectureData = {
      nodes,
      edges,
      techStack: plan.techStack,
      layoutDirection: 'TB',
    };

    const creditsUsed = nodes.length * 10;
    const totalTimeMs = Date.now() - startTime;

    return { 
      architectureData, 
      criticFeedback, 
      designState: plan.suggestedDesign,
      totalTimeMs, 
      creditsUsed, 
      modelUsed: 'llama-3.3-70b-versatile' 
    };
  }

  // ─── CI/CD config generation ─────────────────────────────────────────────────

  async generateCICDConfig(workspaceId: string, techStack: string[], platform: string): Promise<string> {
    if (!groqAdapter.isEnabled) {
      await MOCK_DELAY(600);
      return this.mockCICDConfig(techStack, platform);
    }

    const prompt = `
      Generate a professional CI/CD configuration (YAML) for:
      Tech Stack: ${techStack.join(', ')}
      Target Platform: ${platform}

      Include build, test, lint, and deployment steps.
      Return ONLY valid YAML — no markdown fences.
    `;

    return groqAdapter.generateText(prompt);
  }

  private mockCICDConfig(techStack: string[], platform: string): string {
    const hasNode = techStack.some(t => t.toLowerCase().includes('node') || t.toLowerCase().includes('next'));
    const hasPython = techStack.some(t => t.toLowerCase().includes('python'));

    if (platform === 'github-actions') {
      return `name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup ${hasNode ? 'Node.js' : hasPython ? 'Python' : 'Environment'}
        uses: ${hasNode ? 'actions/setup-node@v4' : 'actions/setup-python@v5'}
        with:
          ${hasNode ? "node-version: '20'\n          cache: 'npm'" : "python-version: '3.12'"}
      - name: Install dependencies
        run: ${hasNode ? 'npm ci' : 'pip install -r requirements.txt'}
      - name: Run tests
        run: ${hasNode ? 'npm test' : 'pytest'}
      - name: Build
        run: ${hasNode ? 'npm run build' : 'echo "Build step"'}

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to ${platform}
        run: echo "Deploy to ${platform}"
        env:
          DEPLOY_TOKEN: \${{ secrets.DEPLOY_TOKEN }}
`;
    }

    return `# CI/CD for ${platform}
# Tech Stack: ${techStack.join(', ')}

build:
  - ${hasNode ? 'npm check && npm run build' : 'pip install -r requirements.txt'}

test:
  - ${hasNode ? 'npm test' : 'pytest'}

deploy:
  platform: ${platform}
  branch: main
`;
  }

  // ─── ADR generation ───────────────────────────────────────────────────────────

  async generateADR(
    _workspaceId: string,
    nodeLabel: string,
    context: string
  ): Promise<{ title: string; decision: string; consequences: string; alternatives: string[] }> {
    if (!groqAdapter.isEnabled) {
      await MOCK_DELAY(500);
      return {
        title: `Decision: ${nodeLabel} Implementation Pattern`,
        decision: `We decided to implement ${nodeLabel} using the proposed approach based on: ${context || 'team standards and scalability requirements'}.`,
        consequences: `Positive: improved maintainability and clearer interfaces. Negative: additional initial setup time.`,
        alternatives: [
          `Alternative A: Monolithic approach — simpler but harder to scale`,
          `Alternative B: Third-party managed service — faster but vendor lock-in`,
        ],
      };
    }

    const prompt = `
      Create an Architecture Decision Record (ADR) for the component: "${nodeLabel}"
      Context: "${context}"

      Return JSON: { "title": string, "decision": string, "consequences": string, "alternatives": string[] }
    `;

    return groqAdapter.generateJson(prompt, undefined, undefined);
  }

  // ─── Design Finalization (Ultra Iteration) ──────────────────────────────────

  async finalizeDesign(
    workspaceId: string,
    currentArch: ArchitectureData,
    designState: any
  ): Promise<{ architectureData: ArchitectureData; summary: string }> {
    const parsedDesign = typeof designState === 'string' ? JSON.parse(designState) : designState;
    const designContext = this.parseDesignState(parsedDesign);

    const prompt = `
      You are the VisualArch L99 ULTRA Coder.
      The user has visually refined their frontend design using a drag-and-drop tool.
      
      Visual Design State (Logical Structure):
      ${designContext}

      Current System Architecture:
      ${JSON.stringify(currentArch, null, 2)}

      TASKS:
      1. Analyze the delta between the original architecture and the new visual layout.
      2. Refactor existing code files to match the UI sections, props, and styling defined in the design state.
      3. Ensure "Frontend" components correctly call "Backend" APIs.
      4. Upgrade ALL generated code to "Production Grade" (Tailwind, Lucide, State management).

      Return JSON:
      {
        "architectureData": { ...updated nodes with HIGH FIDELITY code in files[]... },
        "summary": "AI summary of design-to-code transformations"
      }
      
      KEEP NODE IDs STABLE. Return FULL code for affected files.
    `;

    const result = await groqAdapter.generateJson<{ architectureData: ArchitectureData; summary: string }>(
      prompt,
      undefined,
      undefined
    );

    return result;
  }

  // ─── Architecture reconciliation ─────────────────────────────────────────────

  async reconcileArchitecture(
    originalArch: ArchitectureData,
    modifiedFiles: { path: string; content: string }[]
  ): Promise<{ architectureData: ArchitectureData; report: string }> {
    if (!groqAdapter.isEnabled) {
      await MOCK_DELAY(800);
      return {
        architectureData: originalArch,
        report: 'Mock sync complete. No architectural changes detected in the modified files.',
      };
    }

    const prompt = `
      You are an Architectural Reconciliation Engine.

      Current Architecture:
      ${JSON.stringify(originalArch, null, 2)}

      Modified files:
      ${modifiedFiles.map(f => `--- ${f.path} ---\n${f.content}`).join('\n\n')}

      Analyse if the code changes imply graph changes:
      - New service dependency → new Edge
      - New component/database → new Node
      - Refactored layer → update Node metadata

      Return JSON:
      {
        "architectureData": { ...updated graph... },
        "report": "Human-readable summary of what changed"
      }

      Keep existing node IDs stable.
    `;

    return groqAdapter.generateJson<{ architectureData: ArchitectureData; report: string }>(prompt, undefined, undefined);
  }

  // ─── Private helpers ──────────────────────────────────────────────────────────

  private parseDesignState(designState: any): string | null {
    const state = typeof designState === 'string' ? JSON.parse(designState) : designState;
    if (!state || typeof state !== 'object') return null;

    try {
      // Craft.js state is usually a map of nodes
      const nodes = Object.values(state) as any[];
      const blocks = nodes
        .filter(node => node.type && node.type.resolvedName !== 'Container')
        .map((node, idx) => {
          const name = node.type.resolvedName;
          const props = node.props || {};
          
          let detail = '';
          if (name === 'Hero')    detail = `: "${props.title}" - ${props.subtitle}`;
          if (name === 'Text')    detail = `: "${String(props.text).substring(0, 40)}..."`;
          if (name === 'Button')  detail = `: label "${props.text}"`;
          if (name === 'Section') detail = `: title "${props.title}"`;
          
          const styles = [];
          if (props.background) styles.push(`bg: ${props.background}`);
          if (props.padding)    styles.push(`pad: ${props.padding}`);
          
          return `${idx + 1}. [${name}]${detail}${styles.length ? ` {${styles.join(', ')}}` : ''}`;
        });

      return blocks.length > 0
        ? `Craft.js UI Layout:\n${blocks.join('\n')}`
        : 'Empty design canvas';
    } catch (err) {
      console.error('[GenerationService] Failed to parse Craft state:', err);
      return null;
    }
  }
}

export const generationService = new GenerationService();
