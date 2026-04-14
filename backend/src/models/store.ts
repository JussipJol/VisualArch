// ============================================================
// VisualArch AI - In-Memory Data Store (dev/test mode)
// In production, replace with MongoDB Atlas
// ============================================================

import {
  User, Workspace, ArchitectureHistory, ADR,
  Template, Transaction, Notification, Comment
} from '../types';

class InMemoryStore {
  users: Map<string, User> = new Map();
  workspaces: Map<string, Workspace> = new Map();
  history: Map<string, ArchitectureHistory[]> = new Map();
  adrs: Map<string, ADR> = new Map();
  templates: Map<string, Template> = new Map();
  transactions: Map<string, Transaction[]> = new Map();
  notifications: Map<string, Notification[]> = new Map();
  comments: Map<string, Comment[]> = new Map();

  // User operations
  findUserByEmail(email: string): User | undefined {
    for (const user of this.users.values()) {
      if (user.email === email) return user;
    }
    return undefined;
  }

  findUserById(id: string): User | undefined {
    return this.users.get(id);
  }

  saveUser(user: User): User {
    this.users.set(user.id, user);
    return user;
  }

  deleteUser(id: string): boolean {
    return this.users.delete(id);
  }

  // Workspace operations
  findWorkspacesByOwner(ownerId: string): Workspace[] {
    return Array.from(this.workspaces.values()).filter(
      ws => ws.ownerId === ownerId ||
        ws.collaborators.some(c => c.userId === ownerId)
    );
  }

  findWorkspaceById(id: string): Workspace | undefined {
    return this.workspaces.get(id);
  }

  saveWorkspace(ws: Workspace): Workspace {
    this.workspaces.set(ws.id, ws);
    return ws;
  }

  deleteWorkspace(id: string): boolean {
    this.history.delete(id);
    this.adrs.forEach((adr, adrId) => {
      if (adr.workspaceId === id) this.adrs.delete(adrId);
    });
    return this.workspaces.delete(id);
  }

  getPublicWorkspaces(): Workspace[] {
    return Array.from(this.workspaces.values()).filter(ws => ws.visibility === 'public');
  }

  // History operations
  addHistory(workspaceId: string, entry: ArchitectureHistory): void {
    const existing = this.history.get(workspaceId) ?? [];
    existing.push(entry);
    this.history.set(workspaceId, existing);
  }

  getHistory(workspaceId: string): ArchitectureHistory[] {
    return this.history.get(workspaceId) ?? [];
  }

  // ADR operations
  getADRsByWorkspace(workspaceId: string): ADR[] {
    return Array.from(this.adrs.values()).filter(a => a.workspaceId === workspaceId);
  }

  findADRById(id: string): ADR | undefined {
    return this.adrs.get(id);
  }

  saveADR(adr: ADR): ADR {
    this.adrs.set(adr.id, adr);
    return adr;
  }

  // Template operations
  getAllTemplates(): Template[] {
    return Array.from(this.templates.values()).filter(t => t.isPublic);
  }

  findTemplateById(id: string): Template | undefined {
    return this.templates.get(id);
  }

  saveTemplate(template: Template): Template {
    this.templates.set(template.id, template);
    return template;
  }

  // Transactions
  addTransaction(userId: string, tx: Transaction): void {
    const existing = this.transactions.get(userId) ?? [];
    existing.unshift(tx);
    this.transactions.set(userId, existing);
  }

  getTransactions(userId: string): Transaction[] {
    return this.transactions.get(userId) ?? [];
  }

  // Notifications
  addNotification(userId: string, notif: Notification): void {
    const existing = this.notifications.get(userId) ?? [];
    existing.unshift(notif);
    this.notifications.set(userId, existing);
  }

  getNotifications(userId: string): Notification[] {
    return this.notifications.get(userId) ?? [];
  }

  markAllNotificationsRead(userId: string): void {
    const notifs = this.getNotifications(userId);
    notifs.forEach(n => { n.read = true; });
    this.notifications.set(userId, notifs);
  }

  // Comments
  addComment(comment: Comment): Comment {
    const wsComments = this.comments.get(comment.workspaceId) ?? [];
    wsComments.push(comment);
    this.comments.set(comment.workspaceId, wsComments);
    return comment;
  }

  getCommentsByNode(workspaceId: string, nodeId: string): Comment[] {
    return (this.comments.get(workspaceId) ?? []).filter(c => c.nodeId === nodeId);
  }

  findCommentById(id: string): Comment | undefined {
    for (const comments of this.comments.values()) {
      const found = comments.find(c => c.id === id);
      if (found) return found;
    }
    return undefined;
  }
}

// Singleton store instance
export const store = new InMemoryStore();

// Seed demo templates on startup
export function seedDemoData(): void {
  const demoTemplate: Template = {
    id: 'template-001',
    title: 'Microservices E-commerce Platform',
    description: 'Production-ready microservices architecture with API Gateway, Auth, Product, Order services',
    category: 'E-commerce',
    techStack: ['Node.js', 'React', 'MongoDB', 'Redis', 'Docker'],
    architectureData: {
      nodes: [
        { id: 'n1', label: 'API Gateway', layer: 'Gateway', description: 'Route and auth requests', status: 'stable', position: { x: 400, y: 50 }, files: [], testFiles: [] },
        { id: 'n2', label: 'Auth Service', layer: 'Services', description: 'JWT auth, OAuth', status: 'stable', position: { x: 100, y: 200 }, files: [], testFiles: [] },
        { id: 'n3', label: 'Product Service', layer: 'Services', description: 'Product catalog CRUD', status: 'stable', position: { x: 300, y: 200 }, files: [], testFiles: [] },
        { id: 'n4', label: 'Order Service', layer: 'Services', description: 'Order processing', status: 'stable', position: { x: 500, y: 200 }, files: [], testFiles: [] },
        { id: 'n5', label: 'MongoDB', layer: 'Database', description: 'Primary database', status: 'stable', position: { x: 300, y: 380 }, files: [], testFiles: [] },
        { id: 'n6', label: 'Redis Cache', layer: 'Cache', description: 'Session and product cache', status: 'stable', position: { x: 550, y: 380 }, files: [], testFiles: [] },
      ],
      edges: [
        { id: 'e1', source: 'n1', target: 'n2', label: 'auth' },
        { id: 'e2', source: 'n1', target: 'n3', label: 'products' },
        { id: 'e3', source: 'n1', target: 'n4', label: 'orders' },
        { id: 'e4', source: 'n3', target: 'n5', label: 'db' },
        { id: 'e5', source: 'n4', target: 'n5', label: 'db' },
        { id: 'e6', source: 'n3', target: 'n6', label: 'cache' },
      ],
      techStack: ['Node.js', 'React', 'MongoDB', 'Redis'],
      layoutDirection: 'TB',
    },
    authorId: 'system',
    authorName: 'VisualArch Team',
    isPremium: false,
    price: 0,
    useCount: 1247,
    rating: 4.8,
    isPublic: true,
    createdAt: new Date('2025-01-15'),
  };

  const demoTemplate2: Template = {
    id: 'template-002',
    title: 'Next.js SaaS Starter',
    description: 'Full-stack SaaS with auth, billing, dashboard, and AI integration',
    category: 'SaaS',
    techStack: ['Next.js', 'TypeScript', 'PostgreSQL', 'Stripe'],
    architectureData: {
      nodes: [
        { id: 'n1', label: 'Next.js Frontend', layer: 'Frontend', description: 'App Router + Server Components', status: 'stable', position: { x: 300, y: 50 }, files: [], testFiles: [] },
        { id: 'n2', label: 'API Routes', layer: 'Backend', description: 'Next.js API routes', status: 'stable', position: { x: 300, y: 200 }, files: [], testFiles: [] },
        { id: 'n3', label: 'Auth (NextAuth)', layer: 'Auth', description: 'OAuth + credentials', status: 'stable', position: { x: 100, y: 200 }, files: [], testFiles: [] },
        { id: 'n4', label: 'Stripe Billing', layer: 'Payments', description: 'Subscriptions + webhooks', status: 'stable', position: { x: 500, y: 200 }, files: [], testFiles: [] },
        { id: 'n5', label: 'PostgreSQL', layer: 'Database', description: 'Primary database', status: 'stable', position: { x: 300, y: 380 }, files: [], testFiles: [] },
      ],
      edges: [
        { id: 'e1', source: 'n1', target: 'n2' },
        { id: 'e2', source: 'n2', target: 'n3' },
        { id: 'e3', source: 'n2', target: 'n4' },
        { id: 'e4', source: 'n2', target: 'n5' },
      ],
      techStack: ['Next.js', 'TypeScript', 'PostgreSQL', 'Stripe'],
      layoutDirection: 'TB',
    },
    authorId: 'system',
    authorName: 'VisualArch Team',
    isPremium: true,
    price: 20,
    useCount: 892,
    rating: 4.9,
    isPublic: true,
    createdAt: new Date('2025-02-10'),
  };

  store.saveTemplate(demoTemplate);
  store.saveTemplate(demoTemplate2);
}
