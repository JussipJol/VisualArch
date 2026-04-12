import { z } from "zod";

// ── Reusable sanitizer: strip MongoDB operators from strings ──
function noMongoOps(val: string) {
  return val.replace(/\$[a-zA-Z]+/g, "");
}
const safeString = z.string().transform(noMongoOps);

// ── Node ─────────────────────────────────────────────────────
export const FileCodeSchema = z.object({
  path: z.string(),
  content: z.string().default(""),
});

export const NodeDataSchema = z.object({
  label: z.string().min(1),
  description: z.string().default(""),
  layer: z.string().min(1).max(40),           // Dynamic — AI decides layers from prompt
  files: z.array(FileCodeSchema).optional().default([]),
  explain: z.string().optional().default(""),
});

export const NodeSchema = z.object({
  id: z.string().min(1),
  type: z.literal("taskNode"),
  position: z.object({
    x: z.number().default(0),
    y: z.number().default(0),
  }).optional().default({ x: 0, y: 0 }),
  data: NodeDataSchema,
});

// ── Edge ─────────────────────────────────────────────────────
export const EdgeSchema = z.object({
  id: z.string().min(1),
  source: z.string().min(1),
  target: z.string().min(1),
  label: z.string().optional().default(""),
  type: z.enum(["sync", "async", "streaming", "db", "default"]).optional().default("default"),
  animated: z.boolean().optional().default(false),
});

// ── Full architecture output from Call 1 ─────────────────────
export const ArchitectureSchema = z.object({
  nodes: z.array(NodeSchema).min(1).max(60),
  edges: z.array(EdgeSchema),
  full_context_summary: z.string().min(10),
  iteration: z.number().int().positive(),
  layout_direction: z.enum(["TB", "LR", "Planetary"]).optional().default("LR"),
  tech_stack: z.array(z.string()).optional().default([]),
  file_tree: z.array(z.string()).optional().default([]),
});

// ── Per-node code output from Call 2 ─────────────────────────
export const NodeCodeSchema = z.object({
  files: z.array(FileCodeSchema).default([]),
  explain: z.string().default(""),
});

// ── Input validation schemas ─────────────────────────────────

export const RegisterInputSchema = z.object({
  email: z.string().email().max(255).transform((v) => v.toLowerCase().trim()),
  username: safeString.pipe(z.string().min(3).max(30)),
  password: z.string().min(8).max(128),
  type: z.enum(["individual", "company"]).optional().default("individual"),
  company_details: z.object({
    name: z.string().max(100).optional().default(""),
    website: z.string().max(255).optional().default(""),
  }).optional().nullable(),
});

export const LoginInputSchema = z.object({
  email: z.string().email().max(255).transform((v) => v.toLowerCase().trim()),
  password: z.string().min(1).max(128),
});

export const OAuthInputSchema = z.object({
  email: z.string().email().max(255).transform((v) => v.toLowerCase().trim()),
  name: z.string().max(100).optional(),
  provider: z.string().min(1).max(50),
  provider_id: z.string().max(255).optional(),
});

export const WorkspaceCreateSchema = z.object({
  name: safeString.pipe(z.string().min(1).max(100)),
  context_theme: z.string().max(1000).optional().default(""),
  settings: z.object({
    primary_color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional().default("#5E81F4"),
    framework: z.string().max(50).optional().default("Next.js"),
  }).optional(),
});

export const WorkspaceUpdateSchema = z.object({
  name: safeString.pipe(z.string().min(1).max(100)).optional(),
  context_theme: z.string().max(1000).optional(),
  settings: z.object({
    primary_color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
    framework: z.string().max(50).optional(),
  }).optional(),
});

export const ProjectCreateSchema = z.object({
  workspace_id: safeString.pipe(z.string().min(1).max(100)),
  name: safeString.pipe(z.string().min(1).max(100)),
});

export const GenerateInputSchema = z.object({
  user_prompt: z.string().min(1).max(5000).transform((v) => v.trim()),
});

export const PaginationSchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
});

// ── Type exports ─────────────────────────────────────────────
export type Architecture = z.infer<typeof ArchitectureSchema>;
export type ArchNode = z.infer<typeof NodeSchema>;
export type ArchEdge = z.infer<typeof EdgeSchema>;
export type NodeCode = z.infer<typeof NodeCodeSchema>;
