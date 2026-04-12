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
// ── POST /api/workspaces ─────────────────────────────────────
router.post("/", auth_1.requireAuth, async (req, res) => {
    try {
        const parsed = architecture_schema_1.WorkspaceCreateSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({
                error: "Ошибка валидации",
                details: parsed.error.flatten().fieldErrors,
            });
            return;
        }
        const { name, context_theme, settings } = parsed.data;
        const db = (0, db_1.getDB)();
        const workspaces = db.collection("workspaces");
        const users = db.collection("users");
        const workspace = {
            workspace_id: generateId("ws"),
            owner_id: req.user.userId,
            name: name.trim(),
            context_theme: context_theme?.trim() || "",
            settings: {
                primary_color: settings?.primary_color || "#5E81F4",
                framework: settings?.framework || "Next.js",
            },
            created_at: new Date().toISOString(),
        };
        await workspaces.insertOne(workspace);
        // Mark user as having a workspace
        await users.updateOne({ user_id: req.user.userId }, { $set: { has_workspace: true } });
        const { _id, ...safe } = workspace;
        res.status(201).json({ workspace: safe });
    }
    catch (err) {
        console.error("Create workspace error:", err);
        res.status(500).json({ error: "Ошибка при создании воркспейса" });
    }
});
// ── GET /api/workspaces ──────────────────────────────────────
router.get("/", auth_1.requireAuth, async (req, res) => {
    try {
        const pagination = architecture_schema_1.PaginationSchema.safeParse(req.query);
        const { page, limit } = pagination.success
            ? pagination.data
            : { page: 1, limit: 20 };
        const skip = (page - 1) * limit;
        const db = (0, db_1.getDB)();
        const workspaces = db.collection("workspaces");
        const [list, total] = await Promise.all([
            workspaces
                .find({ owner_id: req.user.userId })
                .sort({ created_at: -1 })
                .skip(skip)
                .limit(limit)
                .toArray(),
            workspaces.countDocuments({ owner_id: req.user.userId }),
        ]);
        const safe = list.map(({ _id, ...rest }) => rest);
        res.json({
            workspaces: safe,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        });
    }
    catch (err) {
        console.error("Get workspaces error:", err);
        res.status(500).json({ error: "Ошибка при получении воркспейсов" });
    }
});
// ── GET /api/workspaces/:id ──────────────────────────────────
router.get("/:id", auth_1.requireAuth, async (req, res) => {
    try {
        const db = (0, db_1.getDB)();
        const workspaces = db.collection("workspaces");
        const workspace = await workspaces.findOne({
            workspace_id: req.params.id,
            owner_id: req.user.userId,
        });
        if (!workspace) {
            res.status(404).json({ error: "Воркспейс не найден" });
            return;
        }
        const { _id, ...safe } = workspace;
        res.json({ workspace: safe });
    }
    catch (err) {
        console.error("Get workspace error:", err);
        res.status(500).json({ error: "Ошибка при получении воркспейса" });
    }
});
// ── PATCH /api/workspaces/:id ────────────────────────────────
router.patch("/:id", auth_1.requireAuth, async (req, res) => {
    try {
        const parsed = architecture_schema_1.WorkspaceUpdateSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({
                error: "Ошибка валидации",
                details: parsed.error.flatten().fieldErrors,
            });
            return;
        }
        const { name, context_theme, settings } = parsed.data;
        const db = (0, db_1.getDB)();
        const workspaces = db.collection("workspaces");
        const updates = {};
        if (name)
            updates.name = name.trim();
        if (context_theme !== undefined)
            updates.context_theme = context_theme.trim();
        if (settings) {
            if (settings.primary_color)
                updates["settings.primary_color"] = settings.primary_color;
            if (settings.framework)
                updates["settings.framework"] = settings.framework;
        }
        if (Object.keys(updates).length === 0) {
            res.status(400).json({ error: "Нет данных для обновления" });
            return;
        }
        const result = await workspaces.updateOne({ workspace_id: req.params.id, owner_id: req.user.userId }, { $set: updates });
        if (result.matchedCount === 0) {
            res.status(404).json({ error: "Воркспейс не найден" });
            return;
        }
        res.json({ success: true });
    }
    catch (err) {
        console.error("Update workspace error:", err);
        res.status(500).json({ error: "Ошибка при обновлении воркспейса" });
    }
});
// ── DELETE /api/workspaces/:id ───────────────────────────────
router.delete("/:id", auth_1.requireAuth, async (req, res) => {
    try {
        const db = (0, db_1.getDB)();
        const workspaces = db.collection("workspaces");
        const projects = db.collection("projects");
        const users = db.collection("users");
        const result = await workspaces.deleteOne({
            workspace_id: req.params.id,
            owner_id: req.user.userId,
        });
        if (result.deletedCount === 0) {
            res.status(404).json({ error: "Воркспейс не найден" });
            return;
        }
        // Delete all projects in this workspace
        await projects.deleteMany({ workspace_id: req.params.id });
        // Check if user still has any workspaces — update has_workspace flag
        const remainingCount = await workspaces.countDocuments({
            owner_id: req.user.userId,
        });
        if (remainingCount === 0) {
            await users.updateOne({ user_id: req.user.userId }, { $set: { has_workspace: false } });
        }
        res.json({ success: true });
    }
    catch (err) {
        console.error("Delete workspace error:", err);
        res.status(500).json({ error: "Ошибка при удалении воркспейса" });
    }
});
exports.default = router;
