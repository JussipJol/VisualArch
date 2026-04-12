import { Router, Response } from "express";
import crypto from "crypto";
import { getDB } from "../config/db";
import { requireAuth, AuthRequest } from "../middleware/auth";
import {
  ProjectCreateSchema,
  PaginationSchema,
} from "../schemas/architecture.schema";

const router = Router();

function generateId(prefix: string): string {
  return `${prefix}_${crypto.randomBytes(10).toString("hex")}`;
}

// ── POST /api/projects ───────────────────────────────────────
router.post("/", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const parsed = ProjectCreateSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        error: "Ошибка валидации",
        details: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const { workspace_id, name } = parsed.data;

    const db = getDB();

    // Verify workspace ownership
    const workspace = await db.collection("workspaces").findOne({
      workspace_id,
      owner_id: req.user!.userId,
    });

    if (!workspace) {
      res.status(404).json({ error: "Воркспейс не найден" });
      return;
    }

    const project = {
      project_id: generateId("prj"),
      workspace_id,
      name: name.trim(),
      frontend_data: {
        layout_id: null,
        last_prompt: "",
        status: "idle",
      },
      backend_data: {
        arch_id: null,
        last_prompt: "",
        status: "idle",
      },
      created_at: new Date().toISOString(),
    };

    await db.collection("projects").insertOne(project);

    const { _id, ...safe } = project as Record<string, unknown>;
    res.status(201).json({ project: safe });
  } catch (err) {
    console.error("Create project error:", err);
    res.status(500).json({ error: "Ошибка при создании проекта" });
  }
});

// ── GET /api/projects?workspace_id=xxx ───────────────────────
router.get("/", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { workspace_id } = req.query;

    const pagination = PaginationSchema.safeParse(req.query);
    const { page, limit } = pagination.success
      ? pagination.data
      : { page: 1, limit: 20 };

    const skip = (page - 1) * limit;

    const db = getDB();

    if (workspace_id) {
      // Verify workspace ownership
      const workspace = await db.collection("workspaces").findOne({
        workspace_id: String(workspace_id),
        owner_id: req.user!.userId,
      });

      if (!workspace) {
        res.status(404).json({ error: "Воркспейс не найден" });
        return;
      }

      const [list, total] = await Promise.all([
        db
          .collection("projects")
          .find({ workspace_id: String(workspace_id) })
          .sort({ created_at: -1 })
          .skip(skip)
          .limit(limit)
          .toArray(),
        db
          .collection("projects")
          .countDocuments({ workspace_id: String(workspace_id) }),
      ]);

      const safe = list.map(({ _id, ...rest }) => rest);
      res.json({
        projects: safe,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      });
    } else {
      // Get all projects for user's workspaces
      const workspaces = await db
        .collection("workspaces")
        .find({ owner_id: req.user!.userId })
        .toArray();

      const wsIds = workspaces.map((ws) => ws.workspace_id);

      if (wsIds.length === 0) {
        res.json({
          projects: [],
          pagination: { page, limit, total: 0, pages: 0 },
        });
        return;
      }

      const [list, total] = await Promise.all([
        db
          .collection("projects")
          .find({ workspace_id: { $in: wsIds } })
          .sort({ created_at: -1 })
          .skip(skip)
          .limit(limit)
          .toArray(),
        db
          .collection("projects")
          .countDocuments({ workspace_id: { $in: wsIds } }),
      ]);

      const safe = list.map(({ _id, ...rest }) => rest);
      res.json({
        projects: safe,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      });
    }
  } catch (err) {
    console.error("Get projects error:", err);
    res.status(500).json({ error: "Ошибка при получении проектов" });
  }
});

// ── GET /api/projects/:id ────────────────────────────────────
router.get("/:id", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const db = getDB();
    const project = await db
      .collection("projects")
      .findOne({ project_id: req.params.id });

    if (!project) {
      res.status(404).json({ error: "Проект не найден" });
      return;
    }

    // Verify ownership through workspace
    const workspace = await db.collection("workspaces").findOne({
      workspace_id: project.workspace_id,
      owner_id: req.user!.userId,
    });

    if (!workspace) {
      res.status(403).json({ error: "Нет доступа к этому проекту" });
      return;
    }

    const { _id, ...safe } = project as Record<string, unknown>;
    res.json({ project: safe });
  } catch (err) {
    console.error("Get project error:", err);
    res.status(500).json({ error: "Ошибка при получении проекта" });
  }
});

// ── DELETE /api/projects/:id ─────────────────────────────────
router.delete("/:id", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const db = getDB();
    const project = await db
      .collection("projects")
      .findOne({ project_id: req.params.id });

    if (!project) {
      res.status(404).json({ error: "Проект не найден" });
      return;
    }

    // Verify ownership through workspace
    const workspace = await db.collection("workspaces").findOne({
      workspace_id: project.workspace_id,
      owner_id: req.user!.userId,
    });

    if (!workspace) {
      res.status(403).json({ error: "Нет доступа к этому проекту" });
      return;
    }

    await db.collection("projects").deleteOne({ project_id: req.params.id });
    res.json({ success: true });
  } catch (err) {
    console.error("Delete project error:", err);
    res.status(500).json({ error: "Ошибка при удалении проекта" });
  }
});

export default router;
