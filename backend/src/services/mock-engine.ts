import { ArchitectureNode, ArchitectureEdge, ArchitectureData, CriticFeedback } from '../types';
import { generateCodeFiles, generateTestFiles } from './code-generator';
import { calculateArchitectureScore, generateCriticFeedback } from './architecture-scorer';

export const MOCK_DELAY = (ms: number) => new Promise(r => setTimeout(r, ms));

type OnEvent = (event: string, data: Record<string, unknown>) => void;

// ─── Tech stack detection ─────────────────────────────────────────────────────

export function detectTechStack(prompt: string): string[] {
  const techMap: Record<string, string[]> = {
    react:        ['React', 'TypeScript', 'Vite'],
    next:         ['Next.js', 'TypeScript', 'Tailwind CSS'],
    vue:          ['Vue.js', 'TypeScript', 'Vite'],
    angular:      ['Angular', 'TypeScript', 'RxJS'],
    node:         ['Node.js', 'Express', 'TypeScript'],
    python:       ['Python', 'FastAPI', 'SQLAlchemy'],
    django:       ['Python', 'Django', 'PostgreSQL'],
    mongo:        ['MongoDB', 'Mongoose'],
    postgres:     ['PostgreSQL'],
    redis:        ['Redis'],
    docker:       ['Docker', 'Docker Compose'],
    kubernetes:   ['Kubernetes', 'Helm'],
    aws:          ['AWS', 'S3', 'Lambda'],
    stripe:       ['Stripe'],
    auth:         ['JWT', 'bcrypt'],
    microservices:['Docker', 'Redis', 'RabbitMQ'],
    graphql:      ['GraphQL', 'Apollo'],
    socket:       ['Socket.io', 'WebSocket'],
  };

  const detected = new Set<string>();
  const lower = prompt.toLowerCase();
  for (const [key, techs] of Object.entries(techMap)) {
    if (lower.includes(key)) techs.forEach(t => detected.add(t));
  }

  if (detected.size === 0) {
    ['Node.js', 'React', 'MongoDB', 'TypeScript'].forEach(t => detected.add(t));
  }

  return Array.from(detected);
}

// ─── Node graph generation ────────────────────────────────────────────────────

function buildNodeTemplates(lower: string): Omit<ArchitectureNode, 'id'>[] {
  const isEcommerce    = lower.includes('ecommerce') || lower.includes('shop') || lower.includes('store');
  const isMicroservice = lower.includes('microservices') || lower.includes('micro service');
  const isRealtime     = lower.includes('real-time') || lower.includes('realtime') || lower.includes('chat') || lower.includes('socket');
  const isAuth         = lower.includes('auth') || lower.includes('login') || lower.includes('register');

  if (isEcommerce) {
    return [
      { label: 'API Gateway',          layer: 'Gateway',        description: 'Rate limiting, routing, auth middleware',      status: 'new', position: { x: 400, y: 80  }, files: [], testFiles: [] },
      { label: 'Auth Service',          layer: 'Services',       description: 'JWT + OAuth2, bcrypt password hashing',        status: 'new', position: { x: 100, y: 240 }, files: [], testFiles: [] },
      { label: 'Product Service',       layer: 'Services',       description: 'Product catalog, search, inventory',           status: 'new', position: { x: 300, y: 240 }, files: [], testFiles: [] },
      { label: 'Order Service',         layer: 'Services',       description: 'Order lifecycle, payment processing',          status: 'new', position: { x: 500, y: 240 }, files: [], testFiles: [] },
      { label: 'Notification Service',  layer: 'Services',       description: 'Email, SMS, push notifications',               status: 'new', position: { x: 700, y: 240 }, files: [], testFiles: [] },
      { label: 'MongoDB',               layer: 'Database',       description: 'Products, orders, users collections',          status: 'new', position: { x: 300, y: 420 }, files: [], testFiles: [] },
      { label: 'Redis Cache',           layer: 'Cache',          description: 'Session store, product cache, rate limits',    status: 'new', position: { x: 550, y: 420 }, files: [], testFiles: [] },
      { label: 'Message Queue',         layer: 'Infrastructure', description: 'Async event processing via RabbitMQ',          status: 'new', position: { x: 700, y: 420 }, files: [], testFiles: [] },
    ];
  }

  if (isMicroservice) {
    return [
      { label: 'API Gateway',         layer: 'Gateway',        description: 'Central entry, load balancing, auth',        status: 'new', position: { x: 400, y: 80  }, files: [], testFiles: [] },
      { label: 'User Service',        layer: 'Services',       description: 'User CRUD, profile management',              status: 'new', position: { x: 150, y: 240 }, files: [], testFiles: [] },
      { label: 'Core Service',        layer: 'Services',       description: 'Business logic, domain operations',          status: 'new', position: { x: 400, y: 240 }, files: [], testFiles: [] },
      { label: 'Analytics Service',   layer: 'Services',       description: 'Events, metrics, reporting',                 status: 'new', position: { x: 650, y: 240 }, files: [], testFiles: [] },
      { label: 'Service Discovery',   layer: 'Infrastructure', description: 'Consul/Eureka service registry',             status: 'new', position: { x: 150, y: 420 }, files: [], testFiles: [] },
      { label: 'Primary DB',          layer: 'Database',       description: 'PostgreSQL for transactional data',          status: 'new', position: { x: 400, y: 420 }, files: [], testFiles: [] },
      { label: 'Redis',               layer: 'Cache',          description: 'Distributed cache, pub/sub',                 status: 'new', position: { x: 650, y: 420 }, files: [], testFiles: [] },
    ];
  }

  if (isRealtime) {
    return [
      { label: 'Next.js Frontend',  layer: 'Frontend', description: 'React UI with real-time updates',          status: 'new', position: { x: 400, y: 80  }, files: [], testFiles: [] },
      { label: 'Express API',       layer: 'Backend',  description: 'REST + WebSocket server',                  status: 'new', position: { x: 200, y: 240 }, files: [], testFiles: [] },
      { label: 'Socket.io Server',  layer: 'Realtime', description: 'WebSocket rooms, presence, events',        status: 'new', position: { x: 550, y: 240 }, files: [], testFiles: [] },
      { label: 'Auth Module',       layer: 'Auth',     description: 'JWT tokens, session management',           status: 'new', position: { x: 100, y: 420 }, files: [], testFiles: [] },
      { label: 'MongoDB',           layer: 'Database', description: 'Messages, users, rooms',                   status: 'new', position: { x: 350, y: 420 }, files: [], testFiles: [] },
      { label: 'Redis Pub/Sub',     layer: 'Cache',    description: 'Horizontal scaling for WebSocket',         status: 'new', position: { x: 600, y: 420 }, files: [], testFiles: [] },
    ];
  }

  // Generic web app
  const base: Omit<ArchitectureNode, 'id'>[] = [
    { label: 'Frontend (React)', layer: 'Frontend',  description: 'SPA with responsive UI',                   status: 'new', position: { x: 400, y: 80  }, files: [], testFiles: [] },
    { label: 'API Server',       layer: 'Backend',   description: 'Express REST API with TypeScript',         status: 'new', position: { x: 400, y: 240 }, files: [], testFiles: [] },
    { label: 'Auth Module',      layer: 'Auth',      description: 'JWT + refresh tokens, RBAC',               status: 'new', position: { x: 100, y: 240 }, files: [], testFiles: [] },
    { label: 'Database',         layer: 'Database',  description: 'Primary data store (MongoDB/PostgreSQL)',   status: 'new', position: { x: 250, y: 420 }, files: [], testFiles: [] },
    { label: 'Redis Cache',      layer: 'Cache',     description: 'Session cache, rate limiting',              status: 'new', position: { x: 550, y: 420 }, files: [], testFiles: [] },
  ];

  if (isAuth) {
    base.push({
      label: 'Email Service', layer: 'Services', description: 'Transactional emails via Resend/SendGrid',
      status: 'new', position: { x: 700, y: 240 }, files: [], testFiles: [],
    });
  }

  return base;
}

function buildEdges(nodes: ArchitectureNode[]): ArchitectureEdge[] {
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
  return edges;
}

// ─── Main mock generation (with realistic SSE events) ─────────────────────────

export interface MockGenerationResult {
  architectureData: ArchitectureData;
  criticFeedback: CriticFeedback;
  creditsUsed: number;
  modelUsed: string;
}

export async function generateMockArchitecture(
  prompt: string,
  previousArch: ArchitectureData | undefined,
  onEvent?: OnEvent,
  signal?: AbortSignal
): Promise<MockGenerationResult> {

  const emit = (event: string, data: Record<string, unknown>) => {
    if (signal?.aborted) return;
    onEvent?.(event, data);
  };

  // Stage 0 – memory
  emit('memory_retrieved', { count: 0, relevant_decisions: [] });
  await MOCK_DELAY(300);

  // Stage 1 – planning
  emit('planning_start', { iteration: 1, memory_used: false });
  await MOCK_DELAY(600);

  const techStack = detectTechStack(prompt);
  const lower = prompt.toLowerCase();
  let templates = buildNodeTemplates(lower);

  // Preserve positions from previous run
  if (previousArch) {
    templates = templates.map((n, i) => {
      const prev = previousArch.nodes[i];
      return prev ? { ...n, status: 'modified' as const, position: prev.position } : n;
    });
  }

  const nodes: ArchitectureNode[] = templates.map((n, i) => ({
    ...n,
    id: `node-${i + 1}`,
    files: generateCodeFiles(n.label, n.layer),
    testFiles: generateTestFiles(n.label),
  }));

  const edges = buildEdges(nodes);

  emit('planning_done', { node_count: nodes.length, tech_stack: techStack });
  await MOCK_DELAY(400);

  // Stage 2 – coding (per node)
  emit('coding_start', { total: nodes.length });
  for (let i = 0; i < nodes.length; i++) {
    if (signal?.aborted) break;
    emit('coding_node', {
      id: nodes[i].id,
      label: nodes[i].label,
      index: i + 1,
      total: nodes.length,
    });
    await MOCK_DELAY(200);
    emit('node_done', { id: nodes[i].id, label: nodes[i].label, file_count: nodes[i].files?.length ?? 0 });
  }

  // Stage 3 – critique
  emit('critique_start', {});
  await MOCK_DELAY(400);

  const score = calculateArchitectureScore(nodes, edges);
  const criticFeedback = generateCriticFeedback(nodes, score);

  emit('critique_done', { score: criticFeedback.score, issues_count: criticFeedback.issues.length });

  const architectureData: ArchitectureData = { nodes, edges, techStack, layoutDirection: 'TB' };
  const creditsUsed = nodes.length * 2; // lower cost in mock mode

  return { architectureData, criticFeedback, creditsUsed, modelUsed: 'mock-engine' };
}
