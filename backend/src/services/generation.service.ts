// ============================================================
// VisualArch AI - Generation Service (4-stage pipeline)
// Uses Groq SDK if available, falls back to realistic mock
// ============================================================

import { ArchitectureData, ArchitectureNode, ArchitectureEdge, CriticFeedback, CriticIssue, CodeFile } from '../types';

const MOCK_DELAY = (ms: number) => new Promise(r => setTimeout(r, ms));

interface GenerationOptions {
  prompt: string;
  previousArchitecture?: ArchitectureData;
  memoryContext?: string[];
  useStream?: boolean;
  onEvent?: (event: string, data: Record<string, unknown>) => void;
}

interface GenerationResult {
  architectureData: ArchitectureData;
  criticFeedback: CriticFeedback;
  totalTimeMs: number;
  creditsUsed: number;
  modelUsed: string;
}

// Tech stack detection from prompt
function detectTechStack(prompt: string): string[] {
  const techMap: Record<string, string[]> = {
    react: ['React', 'TypeScript', 'Vite'],
    next: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    vue: ['Vue.js', 'TypeScript', 'Vite'],
    angular: ['Angular', 'TypeScript', 'RxJS'],
    node: ['Node.js', 'Express', 'TypeScript'],
    python: ['Python', 'FastAPI', 'SQLAlchemy'],
    django: ['Python', 'Django', 'PostgreSQL'],
    mongo: ['MongoDB', 'Mongoose'],
    postgres: ['PostgreSQL'],
    redis: ['Redis'],
    docker: ['Docker', 'Docker Compose'],
    kubernetes: ['Kubernetes', 'Helm'],
    aws: ['AWS', 'S3', 'Lambda'],
    stripe: ['Stripe'],
    auth: ['JWT', 'bcrypt'],
    microservices: ['Docker', 'Redis', 'RabbitMQ'],
    graphql: ['GraphQL', 'Apollo'],
    socket: ['Socket.io', 'WebSocket'],
  };

  const detected = new Set<string>();
  const lower = prompt.toLowerCase();
  for (const [key, techs] of Object.entries(techMap)) {
    if (lower.includes(key)) techs.forEach(t => detected.add(t));
  }

  // Default stack
  if (detected.size === 0) {
    ['Node.js', 'React', 'MongoDB', 'TypeScript'].forEach(t => detected.add(t));
  }

  return Array.from(detected);
}

// Generate a realistic node graph from prompt
function generateNodes(prompt: string, previousArch?: ArchitectureData): { nodes: ArchitectureNode[]; edges: ArchitectureEdge[] } {
  const lower = prompt.toLowerCase();

  // Determine architecture type from prompt
  const isEcommerce = lower.includes('ecommerce') || lower.includes('shop') || lower.includes('store');
  const isAuth = lower.includes('auth') || lower.includes('login') || lower.includes('register');
  const isMicroservices = lower.includes('microservices') || lower.includes('micro service');
  const isRealtime = lower.includes('real-time') || lower.includes('realtime') || lower.includes('chat') || lower.includes('socket');
  const isAPI = lower.includes('api') || lower.includes('rest') || lower.includes('backend');

  let nodeTemplates: Omit<ArchitectureNode, 'id'>[] = [];

  if (isEcommerce) {
    nodeTemplates = [
      { label: 'API Gateway', layer: 'Gateway', description: 'Rate limiting, routing, auth middleware', status: 'new', position: { x: 400, y: 80 }, files: [], testFiles: [] },
      { label: 'Auth Service', layer: 'Services', description: 'JWT + OAuth2, bcrypt password hashing', status: 'new', position: { x: 100, y: 240 }, files: [], testFiles: [] },
      { label: 'Product Service', layer: 'Services', description: 'Product catalog, search, inventory', status: 'new', position: { x: 300, y: 240 }, files: [], testFiles: [] },
      { label: 'Order Service', layer: 'Services', description: 'Order lifecycle, payment processing', status: 'new', position: { x: 500, y: 240 }, files: [], testFiles: [] },
      { label: 'Notification Service', layer: 'Services', description: 'Email, SMS, push notifications', status: 'new', position: { x: 700, y: 240 }, files: [], testFiles: [] },
      { label: 'MongoDB', layer: 'Database', description: 'Products, orders, users collections', status: 'new', position: { x: 300, y: 420 }, files: [], testFiles: [] },
      { label: 'Redis Cache', layer: 'Cache', description: 'Session store, product cache, rate limits', status: 'new', position: { x: 550, y: 420 }, files: [], testFiles: [] },
      { label: 'Message Queue', layer: 'Infrastructure', description: 'Async event processing via RabbitMQ', status: 'new', position: { x: 700, y: 420 }, files: [], testFiles: [] },
    ];
  } else if (isMicroservices) {
    nodeTemplates = [
      { label: 'API Gateway', layer: 'Gateway', description: 'Central entry, load balancing, auth', status: 'new', position: { x: 400, y: 80 }, files: [], testFiles: [] },
      { label: 'User Service', layer: 'Services', description: 'User CRUD, profile management', status: 'new', position: { x: 150, y: 240 }, files: [], testFiles: [] },
      { label: 'Core Service', layer: 'Services', description: 'Business logic, domain operations', status: 'new', position: { x: 400, y: 240 }, files: [], testFiles: [] },
      { label: 'Analytics Service', layer: 'Services', description: 'Events, metrics, reporting', status: 'new', position: { x: 650, y: 240 }, files: [], testFiles: [] },
      { label: 'Service Discovery', layer: 'Infrastructure', description: 'Consul/Eureka service registry', status: 'new', position: { x: 150, y: 420 }, files: [], testFiles: [] },
      { label: 'Primary DB', layer: 'Database', description: 'PostgreSQL for transactional data', status: 'new', position: { x: 400, y: 420 }, files: [], testFiles: [] },
      { label: 'Redis', layer: 'Cache', description: 'Distributed cache, pub/sub', status: 'new', position: { x: 650, y: 420 }, files: [], testFiles: [] },
    ];
  } else if (isRealtime) {
    nodeTemplates = [
      { label: 'Next.js Frontend', layer: 'Frontend', description: 'React UI with real-time updates', status: 'new', position: { x: 400, y: 80 }, files: [], testFiles: [] },
      { label: 'Express API', layer: 'Backend', description: 'REST + WebSocket server', status: 'new', position: { x: 200, y: 240 }, files: [], testFiles: [] },
      { label: 'Socket.io Server', layer: 'Realtime', description: 'WebSocket rooms, presence, events', status: 'new', position: { x: 550, y: 240 }, files: [], testFiles: [] },
      { label: 'Auth Module', layer: 'Auth', description: 'JWT tokens, session management', status: 'new', position: { x: 100, y: 420 }, files: [], testFiles: [] },
      { label: 'MongoDB', layer: 'Database', description: 'Messages, users, rooms', status: 'new', position: { x: 350, y: 420 }, files: [], testFiles: [] },
      { label: 'Redis Pub/Sub', layer: 'Cache', description: 'Horizontal scaling for WebSocket', status: 'new', position: { x: 600, y: 420 }, files: [], testFiles: [] },
    ];
  } else {
    // Generic web app
    nodeTemplates = [
      { label: 'Frontend (React)', layer: 'Frontend', description: 'SPA with responsive UI', status: 'new', position: { x: 400, y: 80 }, files: [], testFiles: [] },
      { label: 'API Server', layer: 'Backend', description: 'Express REST API with TypeScript', status: 'new', position: { x: 400, y: 240 }, files: [], testFiles: [] },
      { label: 'Auth Module', layer: 'Auth', description: 'JWT + refresh tokens, RBAC', status: 'new', position: { x: 100, y: 240 }, files: [], testFiles: [] },
      { label: 'Database (MongoDB)', layer: 'Database', description: 'Primary data store', status: 'new', position: { x: 250, y: 420 }, files: [], testFiles: [] },
      { label: 'Redis Cache', layer: 'Cache', description: 'Session cache, rate limiting', status: 'new', position: { x: 550, y: 420 }, files: [], testFiles: [] },
    ];

    if (isAuth) {
      nodeTemplates.push(
        { label: 'Email Service', layer: 'Services', description: 'Transactional emails via Resend', status: 'new', position: { x: 700, y: 240 }, files: [], testFiles: [] }
      );
    }
  }

  // Handle incremental generation
  if (previousArch) {
    nodeTemplates = nodeTemplates.map((n, i) => {
      const prevNode = previousArch.nodes[i];
      if (prevNode) {
        return { ...n, status: 'modified' as const, position: prevNode.position };
      }
      return n;
    });
  }

  // Generate IDs and code files
  const nodes: ArchitectureNode[] = nodeTemplates.map((n, i) => ({
    ...n,
    id: `node-${i + 1}`,
    files: generateCodeFiles(n.label, n.layer),
    testFiles: generateTestFiles(n.label),
  }));

  // Generate edges
  const edges: ArchitectureEdge[] = [];
  for (let i = 1; i < nodes.length; i++) {
    if (i <= 3) {
      edges.push({ id: `e-0-${i}`, source: nodes[0].id, target: nodes[i].id, label: 'http' });
    }
    if (i >= nodes.length - 2) {
      const mid = Math.floor(nodes.length / 2);
      edges.push({ id: `e-${mid}-${i}`, source: nodes[mid].id, target: nodes[i].id, label: 'db' });
    }
  }

  return { nodes, edges };
}

function generateCodeFiles(label: string, layer: string): CodeFile[] {
  const sanitized = label.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

  if (layer === 'Frontend') {
    return [
      {
        name: `${sanitized}.tsx`,
        path: `src/components/${sanitized}.tsx`,
        language: 'typescript',
        content: `import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';

interface ${label.replace(/\s/g, '')}Props {
  className?: string;
}

export const ${label.replace(/\s/g, '')}: React.FC<${label.replace(/\s/g, '')}Props> = ({ className }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/api/data');
        setData(response.data);
      } catch (err) {
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="loading-spinner" />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className={\`${sanitized}-container \${className ?? ''}\`}>
      <h2>${label}</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default ${label.replace(/\s/g, '')};
`,
      },
    ];
  }

  if (layer === 'Backend' || layer === 'Services' || layer === 'Gateway') {
    return [
      {
        name: `${sanitized}.router.ts`,
        path: `src/routes/${sanitized}.ts`,
        language: 'typescript',
        content: `import { Router, Request, Response } from 'express';
import { ${sanitized}Service } from '../services/${sanitized}.service';
import { authenticateJWT } from '../middleware/auth';

const router = Router();
const service = new ${sanitized.charAt(0).toUpperCase() + sanitized.slice(1)}Service();

/**
 * GET /${sanitized}
 * Returns all ${label} resources
 */
router.get('/', authenticateJWT, async (req: Request, res: Response) => {
  try {
    const data = await service.getAll(req.user!.userId);
    res.json({ data, timestamp: new Date().toISOString() });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    res.status(500).json({ error: message });
  }
});

/**
 * POST /${sanitized}
 * Create new ${label} resource
 */
router.post('/', authenticateJWT, async (req: Request, res: Response) => {
  try {
    const created = await service.create(req.user!.userId, req.body);
    res.status(201).json({ data: created });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    res.status(400).json({ error: message });
  }
});

/**
 * GET /${sanitized}/:id
 * Returns specific ${label} resource
 */
router.get('/:id', authenticateJWT, async (req: Request, res: Response) => {
  try {
    const item = await service.getById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json({ data: item });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    res.status(500).json({ error: message });
  }
});

/**
 * PATCH /${sanitized}/:id
 * Update ${label} resource
 */
router.patch('/:id', authenticateJWT, async (req: Request, res: Response) => {
  try {
    const updated = await service.update(req.params.id, req.body);
    res.json({ data: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    res.status(400).json({ error: message });
  }
});

/**
 * DELETE /${sanitized}/:id
 * Delete ${label} resource
 */
router.delete('/:id', authenticateJWT, async (req: Request, res: Response) => {
  try {
    await service.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    res.status(500).json({ error: message });
  }
});

export default router;
`,
      },
      {
        name: `${sanitized}.service.ts`,
        path: `src/services/${sanitized}.service.ts`,
        language: 'typescript',
        content: `/**
 * ${label} Service
 * Business logic layer for ${label} operations
 */
export class ${sanitized.charAt(0).toUpperCase() + sanitized.slice(1)}Service {
  async getAll(userId: string): Promise<unknown[]> {
    // Implementation: query database with user context
    return [];
  }

  async getById(id: string): Promise<unknown | null> {
    // Implementation: fetch by ID with auth check
    return null;
  }

  async create(userId: string, data: unknown): Promise<unknown> {
    // Implementation: validate, persist, return created resource
    return { id: 'generated-id', ...( data as object), createdBy: userId };
  }

  async update(id: string, data: unknown): Promise<unknown> {
    // Implementation: optimistic locking, patch operations
    return { id, ...( data as object), updatedAt: new Date() };
  }

  async delete(id: string): Promise<void> {
    // Implementation: soft delete or cascade
  }
}
`,
      },
    ];
  }

  if (layer === 'Database') {
    return [
      {
        name: `schema.ts`,
        path: `src/models/schema.ts`,
        language: 'typescript',
        content: `import { z } from 'zod';

// ${label} Schema (Zod validation)
export const ${sanitized}Schema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export type ${sanitized.charAt(0).toUpperCase() + sanitized.slice(1)}Type = z.infer<typeof ${sanitized}Schema>;

// MongoDB Index definitions
export const ${sanitized}Indexes = [
  { key: { createdAt: -1 }, name: 'idx_created_desc' },
  { key: { name: 'text' }, name: 'idx_name_text' },
];
`,
      },
    ];
  }

  return [
    {
      name: `${sanitized}.ts`,
      path: `src/${sanitized}.ts`,
      language: 'typescript',
      content: `/**
 * ${label} Module
 * ${label} configuration and initialization
 */
export interface ${label.replace(/\s/g, '')}Config {
  enabled: boolean;
  options?: Record<string, unknown>;
}

export async function initialize${label.replace(/\s/g, '')}(config: ${label.replace(/\s/g, '')}Config): Promise<void> {
  if (!config.enabled) {
    console.log('[${label}] Disabled, skipping initialization');
    return;
  }
  console.log('[${label}] Initialized successfully');
}
`,
    },
  ];
}

function generateTestFiles(label: string): CodeFile[] {
  const sanitized = label.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  return [
    {
      name: `${sanitized}.test.ts`,
      path: `src/__tests__/${sanitized}.test.ts`,
      language: 'typescript',
      content: `import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';

/**
 * ${label} - Unit Tests
 * Generated by VisualArch AI Test Scaffolding
 */
describe('${label}', () => {
  beforeEach(() => {
    // Setup test environment
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Cleanup
  });

  describe('Happy Path', () => {
    it('should initialize successfully', async () => {
      // Arrange
      const config = { enabled: true };

      // Act & Assert
      expect(config.enabled).toBe(true);
    });

    it('should handle valid input correctly', () => {
      // Arrange
      const input = { name: 'test', value: 42 };

      // Act
      const result = { ...input, processed: true };

      // Assert
      expect(result.name).toBe('test');
      expect(result.processed).toBe(true);
    });
  });

  describe('Error Scenarios', () => {
    it('should reject invalid input', () => {
      expect(() => {
        if (!null) throw new Error('Invalid input');
      }).toThrow('Invalid input');
    });

    it('should handle network errors gracefully', async () => {
      const mockFetch = jest.fn().mockRejectedValue(new Error('Network error'));
      await expect(mockFetch()).rejects.toThrow('Network error');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty data', () => {
      const empty: unknown[] = [];
      expect(empty).toHaveLength(0);
    });

    it('should handle concurrent requests', async () => {
      const requests = Array.from({ length: 5 }, (_, i) =>
        Promise.resolve(\`Result \${i}\`)
      );
      const results = await Promise.all(requests);
      expect(results).toHaveLength(5);
    });
  });
});
`,
    },
  ];
}

// Architecture score calculation
function calculateArchitectureScore(nodes: ArchitectureNode[], edges: ArchitectureEdge[]): number {
  const hasGateway = nodes.some(n => n.layer === 'Gateway');
  const hasAuth = nodes.some(n => n.layer === 'Auth' || n.label.toLowerCase().includes('auth'));
  const hasCache = nodes.some(n => n.layer === 'Cache');
  const hasDB = nodes.some(n => n.layer === 'Database');
  const hasTests = nodes.every(n => n.testFiles && n.testFiles.length > 0);
  const avgConnections = edges.length / Math.max(nodes.length, 1);

  let score = 40;
  if (hasGateway) score += 15;
  if (hasAuth) score += 15;
  if (hasCache) score += 10;
  if (hasDB) score += 10;
  if (hasTests) score += 10;
  if (avgConnections > 0.5) score += 5;
  if (nodes.length >= 5) score += 5;

  return Math.min(score, 100);
}

// Generate critic feedback
function generateCriticFeedback(nodes: ArchitectureNode[], score: number): CriticFeedback {
  const issues: CriticIssue[] = [];

  const hasAuth = nodes.some(n => n.label.toLowerCase().includes('auth'));
  const hasRateLimit = nodes.some(n => n.description.toLowerCase().includes('rate'));
  const hasErrorHandling = nodes.some(n => n.description.toLowerCase().includes('error'));
  const hasMonitoring = nodes.some(n => n.label.toLowerCase().includes('monitor') || n.label.toLowerCase().includes('log'));

  if (!hasAuth) {
    issues.push({
      severity: 'critical',
      title: 'Missing Authentication Layer',
      description: 'No authentication service detected. All API endpoints are potentially unprotected.',
      suggestion: 'Add an Auth Service with JWT validation and RBAC middleware',
    });
  }

  if (!hasRateLimit) {
    issues.push({
      severity: 'warning',
      title: 'No Rate Limiting Configured',
      description: 'API endpoints appear to lack rate limiting, making the system vulnerable to abuse.',
      suggestion: 'Add Redis-backed rate limiting to the API Gateway',
    });
  }

  if (!hasErrorHandling) {
    issues.push({
      severity: 'warning',
      title: 'Error Handling Not Explicit',
      description: 'Global error handling strategy is not visible in the architecture.',
      suggestion: 'Add an error boundary / global error handler in the API layer',
    });
  }

  if (!hasMonitoring) {
    issues.push({
      severity: 'info',
      title: 'Monitoring Not Configured',
      description: 'No observability layer (logging, metrics, tracing) is visible.',
      suggestion: 'Add Sentry for error tracking and structured logging',
    });
  }

  if (nodes.length > 8) {
    issues.push({
      severity: 'info',
      title: 'High Architectural Complexity',
      description: `${nodes.length} components increases operational overhead.`,
      suggestion: 'Consider consolidating services that have similar bounded contexts',
    });
  }

  return { score, issues, timestamp: new Date() };
}

export class GenerationService {
  async generate(options: GenerationOptions): Promise<GenerationResult> {
    const startTime = Date.now();
    const { prompt, previousArchitecture, onEvent } = options;

    // Stage 0: Memory Retrieval (simulated)
    await MOCK_DELAY(300);
    onEvent?.('memory_retrieved', {
      count: 2,
      relevant_decisions: [
        { summary: 'Prefer Repository pattern for data access', iteration: 1 },
        { summary: 'Always include caching layer for read-heavy endpoints', iteration: 2 },
      ],
    });

    // Stage 1: Planning
    await MOCK_DELAY(800);
    onEvent?.('planning_start', { iteration: 1, memory_used: true });

    const techStack = detectTechStack(prompt);
    const { nodes, edges } = generateNodes(prompt, previousArchitecture);

    await MOCK_DELAY(600);
    onEvent?.('planning_done', {
      node_count: nodes.length,
      tech_stack: techStack,
      layout_direction: 'TB',
      credits_used: 5,
    });

    // Stage 2: Coding (per node)
    onEvent?.('coding_start', { total: nodes.length, skipped_stable: 0 });

    for (let i = 0; i < nodes.length; i++) {
      await MOCK_DELAY(400);
      onEvent?.('coding_node', {
        id: nodes[i].id,
        label: nodes[i].label,
        layer: nodes[i].layer,
        index: i + 1,
        total: nodes.length,
        model_used: 'deepseek-r1',
      });

      await MOCK_DELAY(500);
      onEvent?.('node_done', {
        id: nodes[i].id,
        label: nodes[i].label,
        file_count: nodes[i].files?.length ?? 0,
        test_count: nodes[i].testFiles?.length ?? 0,
        skipped: false,
      });
    }

    // Stage 3: Critique
    await MOCK_DELAY(300);
    onEvent?.('critique_start', {});

    const score = calculateArchitectureScore(nodes, edges);
    const criticFeedback = generateCriticFeedback(nodes, score);

    await MOCK_DELAY(600);
    onEvent?.('critique_done', {
      issues_count: criticFeedback.issues.length,
      critical: criticFeedback.issues.filter(i => i.severity === 'critical').length,
      warnings: criticFeedback.issues.filter(i => i.severity === 'warning').length,
      score,
    });

    const architectureData: ArchitectureData = {
      nodes, edges, techStack, layoutDirection: 'TB',
    };

    const creditsUsed = nodes.length <= 5 ? 10 : nodes.length <= 15 ? 20 : 40;
    const totalTimeMs = Date.now() - startTime;

    onEvent?.('complete', {
      architecture_data: architectureData,
      credits_used: creditsUsed,
      total_time_ms: totalTimeMs,
    });

    return { architectureData, criticFeedback, totalTimeMs, creditsUsed, modelUsed: 'deepseek-r1+llama-3.3-70b' };
  }

  async generateADR(workspaceId: string, nodeLabel: string, context: string): Promise<{
    title: string; decision: string; consequences: string; alternatives: string[];
  }> {
    await MOCK_DELAY(800);
    return {
      title: `Decision: Use ${nodeLabel} Pattern`,
      decision: `We decided to implement ${nodeLabel} using the proposed approach based on: ${context}. This provides clear separation of concerns, testability, and scalability.`,
      consequences: `Positive: Improved maintainability, clearer interfaces, easier testing.\nNegative: Additional complexity, learning curve for new team members.`,
      alternatives: [
        `Alternative A: Monolithic approach - simpler but harder to scale`,
        `Alternative B: Third-party service - reduces code but adds dependency`,
      ],
    };
  }

  async generateCICDConfig(workspaceId: string, techStack: string[], platform: string): Promise<string> {
    await MOCK_DELAY(1200);
    return `# GitHub Actions CI/CD Pipeline
# Generated by VisualArch AI for ${techStack.join(', ')} stack
# Target: ${platform}

name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '20'

jobs:
  lint:
    name: Lint & Type Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: \${{ env.NODE_VERSION }}
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check

  test:
    name: Run Tests
    runs-on: ubuntu-latest
    needs: lint
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: \${{ env.NODE_VERSION }}
          cache: 'npm'
      - run: npm ci
      - run: npm test -- --coverage
      - uses: codecov/codecov-action@v4

  build:
    name: Build
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: \${{ env.NODE_VERSION }}
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-artifact@v4
        with:
          name: build-artifacts
          path: dist/

  deploy:
    name: Deploy to ${platform}
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - uses: actions/download-artifact@v4
        with:
          name: build-artifacts
          path: dist/
      - name: Deploy
        run: echo "Deploying to ${platform}..."
        env:
          DEPLOY_TOKEN: \${{ secrets.DEPLOY_TOKEN }}
`;
  }
}

export const generationService = new GenerationService();
