"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.planArchitecture = planArchitecture;
exports.codeNode = codeNode;
const groq_sdk_1 = __importDefault(require("groq-sdk"));
const architecture_schema_1 = require("../schemas/architecture.schema");
const groq = new groq_sdk_1.default({
    apiKey: process.env.GROQ_API_KEY,
});
const PRIMARY_MODEL = "llama-3.3-70b-versatile";
const FALLBACK_MODEL = "llama-3.1-8b-instant";
// ── Timeout helper ──────────────────────────────────────────
function createTimeout(ms) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), ms);
    return {
        signal: controller.signal,
        clear: () => clearTimeout(timer),
    };
}
// ── Retry with exponential backoff ──────────────────────────
async function withRetry(fn, maxRetries = 3) {
    let lastError = null;
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn(PRIMARY_MODEL);
        }
        catch (err) {
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
    }
    catch (err) {
        throw lastError || new Error("All AI attempts failed");
    }
}
// ── Sanitize user input ─────────────────────────────────────
function sanitizePrompt(input) {
    return input
        .replace(/ignore\s+(all\s+)?(previous|above|prior)\s+(instructions?|prompts?|rules?)/gi, "[filtered]")
        .replace(/system\s*:/gi, "[filtered]")
        .replace(/```/g, "")
        .slice(0, 5000);
}
// ══════════════════════════════════════════════════════════════
// Call 1: The Planner — generates architecture graph
// ══════════════════════════════════════════════════════════════
async function planArchitecture(userPrompt, contextTheme, iteration = 1, previousArchitecture) {
    const sanitizedPrompt = sanitizePrompt(userPrompt);
    const previousContext = previousArchitecture
        ? `\n\nPrevious architecture (iteration ${iteration - 1}):\nNodes: ${previousArchitecture.nodes.map((n) => `${n.id}: ${n.data.label} [${n.data.layer}]`).join(", ")}\nEdges: ${previousArchitecture.edges.map((e) => `${e.source} → ${e.target}`).join(", ")}\n\nBuild upon, refine, and improve this architecture based on the new request. Keep working components and add/modify as needed.`
        : "";
    const systemMessage = `You are an ELITE software architect creating production-grade system designs.

CRITICAL RULES:
1. Return ONLY valid JSON — no markdown, no explanation, no text outside JSON.
2. Layer names are DYNAMIC — analyze the user's prompt and create meaningful domain-specific layers.
   Examples:
   - E-commerce prompt → layers: "storefront", "cart", "payment", "inventory", "admin-panel"
   - Chat app → layers: "messaging", "auth", "presence", "notifications", "media-storage"
   - Analytics platform → layers: "data-ingestion", "processing", "visualization", "alerting", "export"
   - SaaS → layers: "dashboard", "billing", "user-management", "api-gateway", "background-jobs"
   Layer names should be lowercase, kebab-case, and domain-specific. Do NOT use generic "frontend/backend" unless truly appropriate.
3. Generate between 4 and 16 nodes based on project complexity.
4. Each node position: x between 0–1100, y between 0–700. Keep 180px minimum gap between nodes.
5. tech_stack: list the actual frameworks/libraries/databases the architecture would use.
6. file_tree: list ALL file paths across ALL nodes — this forms the project's complete file structure.
7. Edges should show data flow, API calls, event subscriptions — label them descriptively.
8. full_context_summary: 3-4 sentences summarizing the entire architecture for future iterations.
9. Make architectures PRODUCTION-REALISTIC — include error handling, caching, queues, logging where appropriate.`;
    const userMessage = `Project Context: ${contextTheme || "General software project"}
User Request: ${sanitizedPrompt}
Iteration: ${iteration}${previousContext}

Return this exact JSON shape:
{
  "nodes": [
    {
      "id": "node-1",
      "type": "taskNode",
      "position": { "x": 100, "y": 50 },
      "data": {
        "label": "Component Name",
        "description": "What this component does — 1 sentence",
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
      "animated": true
    }
  ],
  "tech_stack": ["Next.js 14", "PostgreSQL", "Redis", "Docker"],
  "file_tree": ["src/app/page.tsx", "src/lib/db.ts", "src/api/routes/users.ts"],
  "full_context_summary": "Detailed summary of the architecture...",
  "iteration": ${iteration}
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
            let parsed;
            try {
                parsed = JSON.parse(text);
            }
            catch {
                throw new Error(`Groq Call 1 returned invalid JSON: ${text.slice(0, 200)}`);
            }
            const validated = architecture_schema_1.ArchitectureSchema.parse(parsed);
            return validated;
        }
        finally {
            timeout.clear();
        }
    });
}
// ══════════════════════════════════════════════════════════════
// Call 2: The Coder — generates code for each node
// Now receives full architecture context for cross-references
// ══════════════════════════════════════════════════════════════
async function codeNode(node, contextSummary, allNodes, techStack) {
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
            let parsed;
            try {
                parsed = JSON.parse(text);
            }
            catch {
                return { files: [], explain: `## ${node.data.label}\n\n${node.data.description}` };
            }
            const validated = architecture_schema_1.NodeCodeSchema.safeParse(parsed);
            if (!validated.success) {
                return { files: [], explain: `## ${node.data.label}\n\n${node.data.description}` };
            }
            return validated.data;
        }
        finally {
            timeout.clear();
        }
    });
}
