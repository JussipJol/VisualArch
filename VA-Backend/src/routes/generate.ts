import { Router, Response } from "express";
import { getDB } from "../config/db";
import { requireAuth, AuthRequest } from "../middleware/auth";
import { planArchitecture, codeNode } from "../services/ai.service";
import { GenerateInputSchema } from "../schemas/architecture.schema";
import { createSSEStream } from "../services/stream.service";

const router = Router();

// ── Shared: build architecture from workspace ─────────────────
async function buildArchitectureData(
  workspaceId: string,
  userId: string,
  user_prompt: string,
  onProgress?: (event: string, data: Record<string, unknown>) => void
) {
  const db = getDB();
  const workspaces = db.collection("workspaces");

  const workspace = await workspaces.findOne({
    workspace_id: workspaceId,
    owner_id: userId,
  });

  if (!workspace) throw Object.assign(new Error("Воркспейс не найден"), { status: 404 });

  const currentIteration = (workspace.architecture_data?.iteration ?? 0) + 1;
  const existingSummary = workspace.architecture_data?.full_context_summary ?? "";

  const previousArchitecture =
    workspace.architecture_data?.nodes?.length > 0
      ? {
          nodes: workspace.architecture_data.nodes.map(
            (n: { id: string; data: { label: string; layer: string } }) => ({
              id: n.id,
              data: { label: n.data.label, layer: n.data.layer },
            })
          ),
          edges: workspace.architecture_data.edges?.map(
            (e: { source: string; target: string }) => ({
              source: e.source,
              target: e.target,
            })
          ) || [],
        }
      : undefined;

  // ── Call 1: Plan ──────────────────────────────────────────
  onProgress?.("planning_start", { iteration: currentIteration });
  console.log(`[generate] Call 1 — Planning (iteration ${currentIteration})`);

  const architecture = await planArchitecture(
    user_prompt,
    workspace.context_theme || existingSummary,
    currentIteration,
    previousArchitecture
  );

  onProgress?.("planning_done", {
    node_count: architecture.nodes.length,
    tech_stack: architecture.tech_stack,
    layout_direction: architecture.layout_direction,
  });

  // ── Call 2: Code each node ────────────────────────────────
  console.log(`[generate] Call 2 — Coding ${architecture.nodes.length} nodes`);
  onProgress?.("coding_start", { total: architecture.nodes.length });

  const allNodesContext = architecture.nodes.map((n) => ({
    id: n.id,
    data: { label: n.data.label, layer: n.data.layer, description: n.data.description },
  }));

  const enrichedNodes = [];
  const batchSize = 3;

  for (let i = 0; i < architecture.nodes.length; i += batchSize) {
    const batch = architecture.nodes.slice(i, i + batchSize);
    const results = await Promise.allSettled(
      batch.map(async (node) => {
        onProgress?.("coding_node", {
          id: node.id,
          label: node.data.label,
          layer: node.data.layer,
          index: i + batch.indexOf(node),
          total: architecture.nodes.length,
        });

        const code = await codeNode(
          node,
          architecture.full_context_summary,
          allNodesContext,
          architecture.tech_stack || []
        );

        onProgress?.("node_done", {
          id: node.id,
          label: node.data.label,
          file_count: code.files.length,
        });

        return {
          ...node,
          data: { ...node.data, files: code.files, explain: code.explain },
        };
      })
    );

    for (let j = 0; j < results.length; j++) {
      const result = results[j];
      if (result.status === "fulfilled") {
        enrichedNodes.push(result.value);
      } else {
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

  // ── Build file_tree ───────────────────────────────────────
  const generatedFileTree = enrichedNodes.flatMap((n) =>
    (n.data.files || []).map((f: { path: string }) => f.path)
  );
  const fileTree = [...new Set([...(architecture.file_tree || []), ...generatedFileTree])].sort();

  // ── Assemble ──────────────────────────────────────────────
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

  // ── Persist to workspace ──────────────────────────────────
  await workspaces.updateOne(
    { workspace_id: workspaceId },
    { $set: { architecture_data: architectureData } }
  );

  // ── Save history snapshot ─────────────────────────────────
  try {
    const history = db.collection("architecture_history");
    await history.insertOne({
      snapshot_id: `${workspaceId}-${currentIteration}-${Date.now()}`,
      workspace_id: workspaceId,
      owner_id: userId,
      prompt: user_prompt,
      iteration: currentIteration,
      node_count: enrichedNodes.length,
      tech_stack: architecture.tech_stack || [],
      summary: architecture.full_context_summary,
      created_at: new Date().toISOString(),
    });
  } catch (e) {
    console.warn("[generate] Failed to write history snapshot:", e);
  }

  console.log(
    `[generate] Done — iteration ${currentIteration}, ${enrichedNodes.length} nodes, ${fileTree.length} files`
  );

  return architectureData;
}

// ── POST /api/workspaces/:id/generate (classic JSON) ─────────
router.post("/:id/generate", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const workspaceId = String(req.params.id);
    if (!workspaceId || workspaceId.length < 3) {
      res.status(400).json({ error: "Invalid workspace ID" });
      return;
    }

    const parsed = GenerateInputSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "user_prompt is required (max 5000 chars)" });
      return;
    }

    const architectureData = await buildArchitectureData(
      workspaceId,
      req.user!.userId,
      parsed.data.user_prompt
    );

    res.json({ architecture_data: architectureData });
  } catch (err) {
    const status = (err as { status?: number }).status ?? 500;
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[generate] Error:", message);
    res.status(status).json({ error: `Generation failed: ${message}` });
  }
});

// ── POST /api/workspaces/:id/generate/stream (SSE) ───────────
router.post("/:id/generate/stream", requireAuth, async (req: AuthRequest, res: Response) => {
  const { send, close } = createSSEStream(res);

  try {
    const workspaceId = String(req.params.id);
    if (!workspaceId || workspaceId.length < 3) {
      send("error", { message: "Invalid workspace ID" });
      close();
      return;
    }

    const parsed = GenerateInputSchema.safeParse(req.body);
    if (!parsed.success) {
      send("error", { message: "user_prompt is required (max 5000 chars)" });
      close();
      return;
    }

    const architectureData = await buildArchitectureData(
      workspaceId,
      req.user!.userId,
      parsed.data.user_prompt,
      (event, data) => send(event as Parameters<typeof send>[0], data)
    );

    send("complete", { architecture_data: architectureData });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[generate/stream] Error:", message);
    send("error", { message: `Generation failed: ${message}` });
  } finally {
    close();
  }
});

// ── GET /api/workspaces/:id/history ──────────────────────────
router.get("/:id/history", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const workspaceId = String(req.params.id);
    const db = getDB();

    const workspace = await db.collection("workspaces").findOne({
      workspace_id: workspaceId,
      owner_id: req.user!.userId,
    });

    if (!workspace) {
      res.status(404).json({ error: "Воркспейс не найден" });
      return;
    }

    const history = await db
      .collection("architecture_history")
      .find({ workspace_id: workspaceId, owner_id: req.user!.userId })
      .sort({ created_at: -1 })
      .limit(50)
      .toArray();

    const sanitized = history.map(({ _id, ...rest }) => rest);
    res.json({ history: sanitized });
  } catch (err) {
    console.error("[history] Error:", err);
    res.status(500).json({ error: "Failed to load history" });
  }
});

export default router;
