import { ArchitectureNode, ArchitectureEdge, CriticFeedback, CriticIssue } from '../types';

/**
 * Calculates a completeness / quality score (0-100) for an architecture graph.
 */
export function calculateArchitectureScore(
  nodes: ArchitectureNode[],
  edges: ArchitectureEdge[]
): number {
  const hasGateway = nodes.some(n => n.layer === 'Gateway');
  const hasAuth    = nodes.some(n => n.layer === 'Auth' || n.label.toLowerCase().includes('auth'));
  const hasCache   = nodes.some(n => n.layer === 'Cache');
  const hasDB      = nodes.some(n => n.layer === 'Database');
  const hasTests   = nodes.every(n => n.testFiles && n.testFiles.length > 0);
  const avgConnections = edges.length / Math.max(nodes.length, 1);

  let score = 40;
  if (hasGateway) score += 15;
  if (hasAuth)    score += 15;
  if (hasCache)   score += 10;
  if (hasDB)      score += 10;
  if (hasTests)   score += 10;
  if (avgConnections > 0.5) score += 5;
  if (nodes.length >= 5)    score += 5;

  return Math.min(score, 100);
}

/**
 * Runs the static architecture critic — returns issues categorised by severity.
 */
export function generateCriticFeedback(
  nodes: ArchitectureNode[],
  score: number
): CriticFeedback {
  const issues: CriticIssue[] = [];

  const hasAuth        = nodes.some(n => n.label.toLowerCase().includes('auth'));
  const hasRateLimit   = nodes.some(n => n.description.toLowerCase().includes('rate'));
  const hasMonitoring  = nodes.some(n =>
    n.label.toLowerCase().includes('monitor') || n.label.toLowerCase().includes('log')
  );

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

  if (!hasMonitoring) {
    issues.push({
      severity: 'info',
      title: 'Monitoring Not Configured',
      description: 'No observability layer (logging, metrics, tracing) is visible.',
      suggestion: 'Add Sentry for error tracking and structured logging with Winston/Pino',
    });
  }

  // Detect God Objects — nodes with too many responsibilities
  const godObjects = nodes.filter(n => {
    const text = `${n.label} ${n.description}`.toLowerCase();
    const keywords = ['auth', 'cache', 'db', 'email', 'queue', 'gateway', 'log'];
    return keywords.filter(k => text.includes(k)).length >= 3;
  });
  if (godObjects.length > 0) {
    issues.push({
      severity: 'warning',
      title: 'Potential God Object',
      description: `"${godObjects[0].label}" appears to handle too many responsibilities.`,
      suggestion: 'Split this component into smaller, single-responsibility services',
    });
  }

  if (nodes.length > 8) {
    issues.push({
      severity: 'info',
      title: 'High Architectural Complexity',
      description: `${nodes.length} components increases operational overhead.`,
      suggestion: 'Consider consolidating services that share the same bounded context',
    });
  }

  return { score, issues, timestamp: new Date() };
}
