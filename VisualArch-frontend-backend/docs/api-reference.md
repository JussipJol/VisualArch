# 🔌 API Reference - Flactuation quantumv1.0

This guide provides a technical overview of the **Flactuation** REST and SSE API surfaces.

---

## 🔐 1. Authentication

All requests (except registration/login) require a valid **JWT Token** in the `Authorization` header.

- **POST `/api/auth/register`**: Register a new user.
- **POST `/api/auth/login`**: Authenticate and receive a JWT.
- **GET `/api/auth/me`**: Get current user session data.

---

## 📁 2. Project Management

- **GET `/api/projects`**: List all projects for the authenticated user.
- **POST `/api/projects`**: Create a new project (Name, Description).
- **GET `/api/projects/:id`**: Get detailed project state (Blueprint, Design, Metadata).
- **PATCH `/api/projects/:id`**: Update project metadata or design system tokens.
- **DELETE `/api/projects/:id`**: Permanently delete a project and its associated data.

---

## 🎨 3. Canvas & AI Architecture

Flactuation uses a specialized set of routes for AI-driven blueprints.

- **GET `/api/projects/:id/canvas`**: Get the latest architectural iteration.
- **PUT `/api/projects/:id/canvas`**: Save manual architectural changes.
- **POST `/api/projects/:id/canvas/generate` (SSE)**: Trigger AI architectural generation.
    - **Query Params**: `prompt`, `mode` (standard|tree|spider).
    - **Streaming Events**: `status`, `done`, `error`.

---

## 🖥️ 4. Code Generation & IDE

- **POST `/api/projects/:id/code/generate` (SSE)**: Trigger full-stack codebase generation.
    - **Body**: `{ prompt: string, designSystem: object }`.
    - **Streaming Events**: `status`, `progress`, `done`, `error`.
- **GET `/api/projects/:id/code`**: Get the latest generated files (returned as a map).
- **GET `/api/projects/:id/code/history`**: List previous codebase iterations.

---

## 🧬 5. Core Data Models (schemas)

### Project Model
| Field | Type | Description |
| :--- | :--- | :--- |
| `name` | String | Project display name. |
| `currentStage` | Enum | `canvas`, `design`, `preview`, `ide`. |
| `designSystem` | Object | atomic design tokens and wireframe screens. |

### CanvasIteration Model
| Field | Type | Description |
| :--- | :--- | :--- |
| `nodes` | Array | UI/UX elements or architectural nodes. |
| `edges` | Array | Relationships and communication paths. |

### ProjectMemory
| Field | Type | Description |
| :--- | :--- | :--- |
| `summary` | String | High-level summary of the architectural logic. |
| `decisions` | Array | Log of specific architectural choices and rationales. |

---
*Back to [Root README](../README.md)*
