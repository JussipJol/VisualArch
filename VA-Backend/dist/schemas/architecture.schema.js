"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationSchema = exports.GenerateInputSchema = exports.ProjectCreateSchema = exports.WorkspaceUpdateSchema = exports.WorkspaceCreateSchema = exports.OAuthInputSchema = exports.LoginInputSchema = exports.RegisterInputSchema = exports.NodeCodeSchema = exports.ArchitectureSchema = exports.EdgeSchema = exports.NodeSchema = exports.NodeDataSchema = exports.FileCodeSchema = void 0;
const zod_1 = require("zod");
// ── Reusable sanitizer: strip MongoDB operators from strings ──
function noMongoOps(val) {
    return val.replace(/\$[a-zA-Z]+/g, "");
}
const safeString = zod_1.z.string().transform(noMongoOps);
// ── Node ─────────────────────────────────────────────────────
exports.FileCodeSchema = zod_1.z.object({
    path: zod_1.z.string(),
    content: zod_1.z.string().default(""),
});
exports.NodeDataSchema = zod_1.z.object({
    label: zod_1.z.string().min(1),
    description: zod_1.z.string().default(""),
    layer: zod_1.z.string().min(1).max(40), // Dynamic — AI decides layers from prompt
    files: zod_1.z.array(exports.FileCodeSchema).optional().default([]),
    explain: zod_1.z.string().optional().default(""),
});
exports.NodeSchema = zod_1.z.object({
    id: zod_1.z.string().min(1),
    type: zod_1.z.literal("taskNode"),
    position: zod_1.z.object({
        x: zod_1.z.number(),
        y: zod_1.z.number(),
    }),
    data: exports.NodeDataSchema,
});
// ── Edge ─────────────────────────────────────────────────────
exports.EdgeSchema = zod_1.z.object({
    id: zod_1.z.string().min(1),
    source: zod_1.z.string().min(1),
    target: zod_1.z.string().min(1),
    label: zod_1.z.string().optional().default(""),
    animated: zod_1.z.boolean().optional().default(false),
});
// ── Full architecture output from Call 1 ─────────────────────
exports.ArchitectureSchema = zod_1.z.object({
    nodes: zod_1.z.array(exports.NodeSchema).min(1).max(16),
    edges: zod_1.z.array(exports.EdgeSchema),
    full_context_summary: zod_1.z.string().min(10),
    iteration: zod_1.z.number().int().positive(),
    tech_stack: zod_1.z.array(zod_1.z.string()).optional().default([]),
    file_tree: zod_1.z.array(zod_1.z.string()).optional().default([]),
});
// ── Per-node code output from Call 2 ─────────────────────────
exports.NodeCodeSchema = zod_1.z.object({
    files: zod_1.z.array(exports.FileCodeSchema).default([]),
    explain: zod_1.z.string().default(""),
});
// ── Input validation schemas ─────────────────────────────────
exports.RegisterInputSchema = zod_1.z.object({
    email: zod_1.z.string().email().max(255).transform((v) => v.toLowerCase().trim()),
    username: safeString.pipe(zod_1.z.string().min(3).max(30)),
    password: zod_1.z.string().min(8).max(128),
    type: zod_1.z.enum(["individual", "company"]).optional().default("individual"),
    company_details: zod_1.z.object({
        name: zod_1.z.string().max(100).optional().default(""),
        website: zod_1.z.string().max(255).optional().default(""),
    }).optional().nullable(),
});
exports.LoginInputSchema = zod_1.z.object({
    email: zod_1.z.string().email().max(255).transform((v) => v.toLowerCase().trim()),
    password: zod_1.z.string().min(1).max(128),
});
exports.OAuthInputSchema = zod_1.z.object({
    email: zod_1.z.string().email().max(255).transform((v) => v.toLowerCase().trim()),
    name: zod_1.z.string().max(100).optional(),
    provider: zod_1.z.string().min(1).max(50),
    provider_id: zod_1.z.string().max(255).optional(),
});
exports.WorkspaceCreateSchema = zod_1.z.object({
    name: safeString.pipe(zod_1.z.string().min(1).max(100)),
    context_theme: zod_1.z.string().max(1000).optional().default(""),
    settings: zod_1.z.object({
        primary_color: zod_1.z.string().regex(/^#[0-9a-fA-F]{6}$/).optional().default("#5E81F4"),
        framework: zod_1.z.string().max(50).optional().default("Next.js"),
    }).optional(),
});
exports.WorkspaceUpdateSchema = zod_1.z.object({
    name: safeString.pipe(zod_1.z.string().min(1).max(100)).optional(),
    context_theme: zod_1.z.string().max(1000).optional(),
    settings: zod_1.z.object({
        primary_color: zod_1.z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
        framework: zod_1.z.string().max(50).optional(),
    }).optional(),
});
exports.ProjectCreateSchema = zod_1.z.object({
    workspace_id: safeString.pipe(zod_1.z.string().min(1).max(100)),
    name: safeString.pipe(zod_1.z.string().min(1).max(100)),
});
exports.GenerateInputSchema = zod_1.z.object({
    user_prompt: zod_1.z.string().min(1).max(5000).transform((v) => v.trim()),
});
exports.PaginationSchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().min(1).optional().default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).optional().default(20),
});
