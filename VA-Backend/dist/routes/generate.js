"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../config/db");
const auth_1 = require("../middleware/auth");
const ai_service_1 = require("../services/ai.service");
const architecture_schema_1 = require("../schemas/architecture.schema");
const router = (0, express_1.Router)();
// ── POST /api/workspaces/:id/generate ────────────────────────
router.post("/:id/generate", auth_1.requireAuth, async (req, res) => {
    try {
        const workspaceId = req.params.id;
        if (!workspaceId || workspaceId.length < 3) {
            res.status(400).json({ error: "Invalid workspace ID" });
            return;
        }
        const parsed = architecture_schema_1.GenerateInputSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({ error: "user_prompt is required (max 5000 chars)" });
            return;
        }
        const { user_prompt } = parsed.data;
        const db = (0, db_1.getDB)();
        const workspaces = db.collection("workspaces");
        const workspace = await workspaces.findOne({
            workspace_id: workspaceId,
            owner_id: req.user.userId,
        });
        if (!workspace) {
            res.status(404).json({ error: "Воркспейс не найден" });
            return;
        }
        const currentIteration = (workspace.architecture_data?.iteration ?? 0) + 1;
        const existingSummary = workspace.architecture_data?.full_context_summary ?? "";
        // Build previous architecture context
        const previousArchitecture = workspace.architecture_data?.nodes?.length > 0
            ? {
                nodes: workspace.architecture_data.nodes.map((n) => ({
                    id: n.id,
                    data: { label: n.data.label, layer: n.data.layer },
                })),
                edges: workspace.architecture_data.edges?.map((e) => ({
                    source: e.source,
                    target: e.target,
                })) || [],
            }
            : undefined;
        // ── Call 1: Plan architecture ───────────────────────────
        console.log(`[generate] Call 1 — Planning (iteration ${currentIteration})`);
        const architecture = await (0, ai_service_1.planArchitecture)(user_prompt, workspace.context_theme || existingSummary, currentIteration, previousArchitecture);
        // ── Call 2: Code each node with full context ────────────
        console.log(`[generate] Call 2 — Coding ${architecture.nodes.length} nodes`);
        // Prepare sibling context for cross-references
        const allNodesContext = architecture.nodes.map((n) => ({
            id: n.id,
            data: { label: n.data.label, layer: n.data.layer, description: n.data.description },
        }));
        const enrichedNodes = [];
        const batchSize = 3;
        for (let i = 0; i < architecture.nodes.length; i += batchSize) {
            const batch = architecture.nodes.slice(i, i + batchSize);
            const results = await Promise.allSettled(batch.map(async (node) => {
                const code = await (0, ai_service_1.codeNode)(node, architecture.full_context_summary, allNodesContext, architecture.tech_stack || []);
                return {
                    ...node,
                    data: {
                        ...node.data,
                        files: code.files,
                        explain: code.explain,
                    },
                };
            }));
            for (let j = 0; j < results.length; j++) {
                const result = results[j];
                if (result.status === "fulfilled") {
                    enrichedNodes.push(result.value);
                }
                else {
                    const failedNode = batch[j];
                    console.warn(`[generate] Node "${failedNode.data.label}" failed:`, result.reason);
                    enrichedNodes.push({
                        ...failedNode,
                        data: {
                            ...failedNode.data,
                            files: [],
                            explain: `## ${failedNode.data.label}\n\n${failedNode.data.description}\n\n_Code generation failed._`,
                        },
                    });
                }
            }
        }
        // ── Build file_tree from all generated files ────────────
        const generatedFileTree = enrichedNodes.flatMap((n) => (n.data.files || []).map((f) => f.path));
        // Merge AI-suggested file_tree with generated
        const fileTree = [...new Set([...(architecture.file_tree || []), ...generatedFileTree])].sort();
        // ── Assemble final data ─────────────────────────────────
        const architectureData = {
            nodes: enrichedNodes,
            edges: architecture.edges,
            iteration: currentIteration,
            full_context_summary: architecture.full_context_summary,
            tech_stack: architecture.tech_stack || [],
            file_tree: fileTree,
            last_prompt: user_prompt,
            generated_at: new Date().toISOString(),
        };
        await workspaces.updateOne({ workspace_id: workspaceId }, { $set: { architecture_data: architectureData } });
        console.log(`[generate] Done — iteration ${currentIteration}, ${enrichedNodes.length} nodes, ${fileTree.length} files`);
        res.json({ architecture_data: architectureData });
    }
    catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        console.error("[generate] Error:", message);
        res.status(500).json({ error: `Generation failed: ${message}` });
    }
});
exports.default = router;
