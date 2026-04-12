"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const crypto_1 = __importDefault(require("crypto"));
const db_1 = require("../config/db");
const auth_1 = require("../middleware/auth");
const architecture_schema_1 = require("../schemas/architecture.schema");
const router = (0, express_1.Router)();
function generateId(prefix) {
    return `${prefix}_${crypto_1.default.randomBytes(10).toString("hex")}`;
}
// ── POST /api/projects ───────────────────────────────────────
router.post("/", auth_1.requireAuth, async (req, res) => {
    try {
        const parsed = architecture_schema_1.ProjectCreateSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({
                error: "Ошибка валидации",
                details: parsed.error.flatten().fieldErrors,
            });
            return;
        }
        const { workspace_id, name } = parsed.data;
        const db = (0, db_1.getDB)();
        // Verify workspace ownership
        const workspace = await db.collection("workspaces").findOne({
            workspace_id,
            owner_id: req.user.userId,
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
        const { _id, ...safe } = project;
        res.status(201).json({ project: safe });
    }
    catch (err) {
        console.error("Create project error:", err);
        res.status(500).json({ error: "Ошибка при создании проекта" });
    }
});
// ── GET /api/projects?workspace_id=xxx ───────────────────────
router.get("/", auth_1.requireAuth, async (req, res) => {
    try {
        const { workspace_id } = req.query;
        const pagination = architecture_schema_1.PaginationSchema.safeParse(req.query);
        const { page, limit } = pagination.success
            ? pagination.data
            : { page: 1, limit: 20 };
        const skip = (page - 1) * limit;
        const db = (0, db_1.getDB)();
        if (workspace_id) {
            // Verify workspace ownership
            const workspace = await db.collection("workspaces").findOne({
                workspace_id: String(workspace_id),
                owner_id: req.user.userId,
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
        }
        else {
            // Get all projects for user's workspaces
            const workspaces = await db
                .collection("workspaces")
                .find({ owner_id: req.user.userId })
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
    }
    catch (err) {
        console.error("Get projects error:", err);
        res.status(500).json({ error: "Ошибка при получении проектов" });
    }
});
// ── GET /api/projects/:id ────────────────────────────────────
router.get("/:id", auth_1.requireAuth, async (req, res) => {
    try {
        const db = (0, db_1.getDB)();
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
            owner_id: req.user.userId,
        });
        if (!workspace) {
            res.status(403).json({ error: "Нет доступа к этому проекту" });
            return;
        }
        const { _id, ...safe } = project;
        res.json({ project: safe });
    }
    catch (err) {
        console.error("Get project error:", err);
        res.status(500).json({ error: "Ошибка при получении проекта" });
    }
});
// ── DELETE /api/projects/:id ─────────────────────────────────
router.delete("/:id", auth_1.requireAuth, async (req, res) => {
    try {
        const db = (0, db_1.getDB)();
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
            owner_id: req.user.userId,
        });
        if (!workspace) {
            res.status(403).json({ error: "Нет доступа к этому проекту" });
            return;
        }
        await db.collection("projects").deleteOne({ project_id: req.params.id });
        res.json({ success: true });
    }
    catch (err) {
        console.error("Delete project error:", err);
        res.status(500).json({ error: "Ошибка при удалении проекта" });
    }
});
exports.default = router;
