import Groq from "groq-sdk";
import {
  ArchitectureSchema,
  NodeCodeSchema,
  type Architecture,
  type ArchNode,
  type NodeCode,
} from "../schemas/architecture.schema";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const PRIMARY_MODEL = "llama-3.3-70b-versatile";
const FALLBACK_MODEL = "llama-3.1-8b-instant";

// ── Timeout helper ──────────────────────────────────────────
function createTimeout(ms: number): { signal: AbortSignal; clear: () => void } {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return {
    signal: controller.signal,
    clear: () => clearTimeout(timer),
  };
}

// ── Retry with exponential backoff ──────────────────────────
async function withRetry<T>(
  fn: (model: string) => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  let lastError: Error | null = null;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn(PRIMARY_MODEL);
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      console.warn(`[AI] Attempt ${i + 1}/${maxRetries} failed: ${lastError.message}`);
      if (i < maxRetries - 1) {
        const delay = Math.min(1000 * Math.pow(2, i), 8000);
        await new Promise((r) => setTimeout(r, delay));
      }
    }
  }

  console.warn(`[AI] Primary model failed, trying fallback: ${FALLBACK_MODEL}`);
  try {
    return await fn(FALLBACK_MODEL);
  } catch (err) {
    throw lastError || new Error("All AI attempts failed");
  }
}

// ── Sanitize user input ─────────────────────────────────────
function sanitizePrompt(input: string): string {
  return input
    .replace(/ignore\s+(all\s+)?(previous|above|prior)\s+(instructions?|prompts?|rules?)/gi, "[filtered]")
    .replace(/system\s*:/gi, "[filtered]")
    .replace(/```/g, "")
    .slice(0, 5000);
}

// ══════════════════════════════════════════════════════════════
// Call 1: The Planner — generates architecture graph
// ══════════════════════════════════════════════════════════════
export async function planArchitecture(
  userPrompt: string,
  contextTheme: string,
  iteration: number = 1,
  previousArchitecture?: {
    nodes: { id: string; data: { label: string; layer: string } }[];
    edges: { source: string; target: string }[];
  }
): Promise<Architecture> {
  const sanitizedPrompt = sanitizePrompt(userPrompt);

  const previousContext = previousArchitecture
    ? `\n\nPrevious architecture (iteration ${iteration - 1}):\nNodes: ${previousArchitecture.nodes.map((n) => `${n.id}: ${n.data.label} [${n.data.layer}]`).join(", ")}\nEdges: ${previousArchitecture.edges.map((e) => `${e.source} → ${e.target}`).join(", ")}\n\nBuild upon, refine, and improve this architecture based on the new request. Keep working components and add/modify as needed.`
    : "";

  const systemMessage = `You are an ELITE enterprise software architect creating production-grade, highly scalable system designs.

CRITICAL RULES:
1. Return ONLY valid JSON \u2014 no markdown, no explanation, no text outside JSON.
2. Layer names are DYNAMIC \u2014 analyze the user's prompt and create meaningful domain-driven layers (e.g., API Gateways, Service Meshes, Microservices, Databases, Caching, Event Buses).
   Examples:
   - "billing-domain", "auth-domain", "realtime-websocket", "message-broker", "time-series-db".
3. BUILD HUGE ARCHITECTURES: Generate between 10 and 60 nodes based on project complexity. Break down monoliths into microservices, add caching (Redis/Memcached), queues (Kafka/RabbitMQ), discrete databases (Postgres/Mongo) per service.
4. Position object should just be {"x": 0, "y": 0} \u2014 the frontend will auto-layout using Dagre. Do not guess coordinates.
5. tech_stack: list the actual frameworks/libraries/databases the architecture would use.
6. file_tree: list ALL file paths across ALL nodes.
7. Edges represent data flow. You MUST specify 'type' for edges:
   - "sync" for REST/GraphQL/gRPC
   - "async" for message queues/events
   - "db" for database connections
   - "streaming" for websockets/WebRTC
8. Choose 'layout_direction' based on the architecture pattern:
   - "LR" (Baseline/Flow) \u2014 perfect for linear microservices, data pipelines, standard integrations.
   - "TB" (Tree) \u2014 perfect for hierarchical strict topologies (e.g. Gateway -> Services -> DBs).
   - "Planetary" (Orbit) \u2014 perfect for star topologies where a central hub, message broker, or event bus sits in the center with satellite services orbiting it.
9. full_context_summary: 3-4 sentences summarizing the entire architecture.`;

  const userMessage = `Project Context: \${contextTheme || "General software project"}
User Request: \${sanitizedPrompt}
Iteration: \${iteration}\${previousContext}

Return this exact JSON shape:
{
  "nodes": [
    {
      "id": "node-1",
      "type": "taskNode",
      "position": { "x": 0, "y": 0 },
      "data": {
        "label": "Component Name",
        "description": "What this component does \u2014 1 sentence",
        "layer": "domain-specific-layer-name"
      }
    }
  ],
  "edges": [
    {
      "id": "edge-1-2",
      "source": "node-1",
      "target": "node-2",
      "label": "REST API",
      "type": "sync",
      "animated": true
    }
  ],
  "layout_direction": "Planetary",
  "tech_stack": ["Next.js 14", "PostgreSQL", "Redis", "Kafka", "Docker"],
  "file_tree": ["src/app/page.tsx", "src/services/billing.ts"],
  "full_context_summary": "Detailed summary...",
  "iteration": \${iteration}
}`;

  return withRetry(async (model) => {
    const timeout = createTimeout(45000);
    try {
      const completion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: systemMessage },
          { role: "user", content: userMessage },
        ],
        model,
        temperature: 0.3,
        max_tokens: 4096,
        response_format: { type: "json_object" },
      });

      const text = completion.choices[0]?.message?.content || "{}";
      let parsed: unknown;
      try {
        parsed = JSON.parse(text);
      } catch {
        throw new Error(`Groq Call 1 returned invalid JSON: ${text.slice(0, 200)}`);
      }

      const validated = ArchitectureSchema.parse(parsed);
      return validated;
    } finally {
      timeout.clear();
    }
  });
}

// ══════════════════════════════════════════════════════════════
// Call 2: The Coder — generates code for each node
// Now receives full architecture context for cross-references
// ══════════════════════════════════════════════════════════════
export async function codeNode(
  node: ArchNode,
  contextSummary: string,
  allNodes: { id: string; data: { label: string; layer: string; description: string } }[],
  techStack: string[]
): Promise<NodeCode> {

  // Build cross-reference map so AI knows about sibling nodes
  const siblingsList = allNodes
    .filter((n) => n.id !== node.id)
    .map((n) => `- ${n.data.label} [${n.data.layer}]: ${n.data.description}`)
    .join("\n");

  const systemMessage = `You are a senior full-stack engineer writing production-quality code.

CRITICAL RULES:
1. Return ONLY valid JSON — no markdown, no explanation.
2. files: generate 3-8 key files for this component with REAL, working code in 'content'.
3. content: raw code string. Write complete, functional code — not stubs or pseudocode.
4. Imports MUST reference real files from sibling components when needed.
5. explain: write 2-4 paragraphs in Markdown describing architecture decisions, data flow, and integration.
6. Match the tech stack: ${techStack.join(", ") || "modern TypeScript stack"}.
7. File paths must be consistent: use src/ prefix, proper directory structure.
8. Include error handling, types, and proper exports in all files.`;

  const userMessage = `Component: ${node.data.label}
Layer: ${node.data.layer}
Description: ${node.data.description}
Project Context: ${contextSummary}
Tech Stack: ${techStack.join(", ") || "TypeScript, Node.js"}

Other components in this architecture (reference these in imports where needed):
${siblingsList || "None"}

Return this JSON:
{
  "files": [
    {
      "path": "src/path/to/file.ts",
      "content": "// Full working code here\\nimport { something } from '../other/module';\\n..."
    }
  ],
  "explain": "## ${node.data.label}\\n\\nDetailed markdown explanation..."
}`;

  return withRetry(async (model) => {
    const timeout = createTimeout(45000);
    try {
      const completion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: systemMessage },
          { role: "user", content: userMessage },
        ],
        model,
        temperature: 0.1,
        max_tokens: 4096,
        response_format: { type: "json_object" },
      });

      const text = completion.choices[0]?.message?.content || "{}";
      let parsed: unknown;
      try {
        parsed = JSON.parse(text);
      } catch {
        return { files: [], explain: `## ${node.data.label}\n\n${node.data.description}` };
      }

      const validated = NodeCodeSchema.safeParse(parsed);
      if (!validated.success) {
        return { files: [], explain: `## ${node.data.label}\n\n${node.data.description}` };
      }

      return validated.data;
    } finally {
      timeout.clear();
    }
  });
}
