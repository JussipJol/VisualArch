// ─── Module: Canvas AI Prompts ───────────────────────────────────────────────

export const CANVAS_SYSTEM_PROMPT = `You are a Principal Systems Architect.
Design production-grade, symmetrical, and accurate system architectures.

CRITICAL: Return ONLY strict valid JSON. 
LAYOUT RULE: Always set "x": 0 and "y": 0 for all nodes. The system will handle the professional layout.

{
  "nodes": [
    {
      "id": "unique_id",
      "type": "client|cdn|gateway|auth|service|worker|cache|queue|database|storage|monitoring|external",
      "label": "Name",
      "tech": "Technology",
      "description": "Responsibility",
      "responsibilities": ["..."],
      "endpoints": ["..."],
      "dependencies": ["ids..."],
      "scale": "horizontal",
      "replicas": 2,
      "status": "new",
      "x": 0,
      "y": 0
    }
  ],
  "edges": [
    {
      "id": "edge_id",
      "source": "src_id",
      "target": "dst_id",
      "type": "sync|async",
      "label": "Protocol",
      "dataFlow": "..."
    }
  ],
  "stack": { "frontend": "...", "backend": "...", "database": "...", "infrastructure": "..." },
  "architecture_notes": "..."
}`;

// ─── Multi-Tiered Auto-Layout ───────────────────────────────────────────────

const TYPE_TO_TIER: Record<string, number> = {
  client: 0, 
  cdn: 1, external: 1,
  gateway: 2,
  auth: 3, service: 3,
  worker: 4,
  cache: 5, queue: 5,
  database: 6, storage: 6,
  monitoring: 7,
};

const TIER_Y: Record<number, number> = {
  0: 60,   // Clients
  1: 220,  // CDN/External
  2: 380,  // Gateway
  3: 540,  // Services (Core)
  4: 700,  // Workers
  5: 860,  // Cache/Queue
  6: 1020, // DB/Storage
  7: 1180, // Monitoring
};

export function autoLayout<T extends { id: string; x: number; y: number; type: string; dependencies?: string[] }>(
  nodes: T[],
  mode: 'standard' | 'tree' | 'spider' = 'standard'
): T[] {
  const centerX = 800;
  const centerY = 600;

  if (mode === 'spider') {
    // ── Radial Spider Layout ──
    const radiusStep = 250;
    const tierMap: Record<number, T[]> = {};
    nodes.forEach(node => {
      const tier = TYPE_TO_TIER[node.type] ?? 3;
      if (!tierMap[tier]) tierMap[tier] = [];
      tierMap[tier].push(node);
    });

    return nodes.map(node => {
      if (node.x !== 0 || node.y !== 0) return node;
      const tier = TYPE_TO_TIER[node.type] ?? 3;
      const tierNodes = tierMap[tier];
      const index = tierNodes.indexOf(node);
      const angle = (index / tierNodes.length) * 2 * Math.PI + (tier * 0.5);
      const r = (tier + 1) * radiusStep;
      return {
        ...node,
        x: centerX + Math.cos(angle) * r,
        y: centerY + Math.sin(angle) * r,
      };
    });
  }

  if (mode === 'tree') {
    // ── Hierarchical Tree Layout ──
    const tierMap: Record<number, T[]> = {};
    nodes.forEach(node => {
      const tier = TYPE_TO_TIER[node.type] ?? 3;
      if (!tierMap[tier]) tierMap[tier] = [];
      tierMap[tier].push(node);
    });

    const spacingX = 280;
    const spacingY = 200;

    return nodes.map(node => {
      if (node.x !== 0 || node.y !== 0) return node;
      const tier = TYPE_TO_TIER[node.type] ?? 3;
      const tierNodes = tierMap[tier];
      const index = tierNodes.indexOf(node);
      const totalWidth = (tierNodes.length - 1) * spacingX;
      return {
        ...node,
        x: centerX - (totalWidth / 2) + (index * spacingX),
        y: 100 + tier * spacingY,
      };
    });
  }

  // ── Standard Multi-Tiered Layout ──
  const tierMap: Record<number, T[]> = {};
  nodes.forEach(node => {
    const tier = TYPE_TO_TIER[node.type] ?? 3;
    if (!tierMap[tier]) tierMap[tier] = [];
    tierMap[tier].push(node);
  });

  const spacingX = 320;

  return nodes.map(node => {
    if (node.x !== 0 || node.y !== 0) return node;

    const tier = TYPE_TO_TIER[node.type] ?? 3;
    const tierNodes = tierMap[tier];
    const index = tierNodes.indexOf(node);

    const totalTierWidth = (tierNodes.length - 1) * spacingX;
    const x = centerX - (totalTierWidth / 2) + (index * spacingX);
    const y = TIER_Y[tier] ?? 400;

    return { ...node, x, y };
  });
}

// ─── Update prompt ─────────────────────────────────────────────────────────────

export const CANVAS_UPDATE_PROMPT = (currentArchitecture: string, userRequest: string) =>
  `EXISTING ARCHITECTURE:
${currentArchitecture}

USER REQUEST: "${userRequest}"

INSTRUCTIONS:
1. Analyze what the user is asking to add, change, or remove
2. Keep ALL existing nodes unless the user explicitly asks to remove them
3. For each new capability mentioned: add the correct node type(s) with FULL detail
4. Update "dependencies" arrays on all nodes affected by new connections
5. Add new edges for all new connections (with protocol labels and dataFlow)
6. If new nodes cause layout crowding, shift existing nodes to maintain tier structure
7. Every new node needs: 3+ responsibilities, 2+ endpoints, dependencies list
8. Return the COMPLETE JSON with ALL nodes and ALL edges (not just the changes)`;
