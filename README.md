# VisualArch AI Platform — v3.0 L99 ULTRA

> The first **Living Architecture Platform** — AI designs, codes, reviews, and evolves your software architecture in real-time.

---

## 🚀 Quick Start (5 minutes)

### Prerequisites
- Node.js 20+
- npm 9+

### Run locally (in-memory mode — no DB or API keys needed)

```bash
# 1. Backend
cd backend
npm install
cp .env.example .env
npm run dev
# API available at http://localhost:3001

# 2. Frontend (new terminal)
cd frontend
npm install
npm run dev
# App available at http://localhost:3000
```

### Run with Docker

```bash
docker-compose up --build
```

---

## 🏗️ Architecture

```
visualarch/
├── backend/                   # Express + TypeScript API
│   ├── src/
│   │   ├── routes/            # REST endpoints
│   │   │   ├── auth.ts        # Registration, login, JWT refresh
│   │   │   ├── workspaces.ts  # CRUD, generation, ADR, collab
│   │   │   ├── marketplace.ts # Templates CRUD
│   │   │   └── credits.ts     # Credits ledger + notifications
│   │   ├── services/
│   │   │   ├── generation.service.ts  # 4-stage AI pipeline
│   │   │   └── credits.service.ts     # Credits economy
│   │   ├── middleware/
│   │   │   ├── auth.ts        # JWT + workspace member checks
│   │   │   └── rbac.ts        # Role-based access
│   │   ├── websocket/
│   │   │   └── workspace.gateway.ts   # Socket.io real-time collab
│   │   └── models/
│   │       └── store.ts       # In-memory store (replace with MongoDB)
│   └── __tests__/             # Jest test suites
│
├── frontend/                  # Next.js 15 + TypeScript
│   ├── src/
│   │   ├── app/               # App Router pages
│   │   │   ├── page.tsx       # Landing page
│   │   │   ├── dashboard/     # Workspace management
│   │   │   ├── workspace/[id] # Editor (Canvas/IDE/Design/ADR)
│   │   │   └── marketplace/   # Template marketplace
│   │   ├── components/
│   │   │   ├── canvas/        # ArchitectureCanvas (SVG)
│   │   │   ├── ai-assistant/  # CriticFeedbackPanel, PromptSuggestions
│   │   │   └── charts/        # ScoreGauge, CreditsWidget
│   │   ├── lib/
│   │   │   ├── api.ts         # HTTP + SSE client
│   │   │   └── store/         # Zustand (auth, workspace)
│   │   └── test/              # Vitest component tests
│
└── docker-compose.yml
```

---

## 🤖 AI Pipeline (4-Stage)

```
1. Memory Retrieval  → Atlas Vector Search (top-5 past decisions)
2. Planner           → llama-3.3-70b (architecture design)
3. Coder × N         → deepseek-r1 (parallel code gen per node)
4. Critic            → llama-3.1-8b (anti-pattern review)
```

In **demo/mock mode** (no API keys), the pipeline runs with realistic timing and outputs.

---

## 🔑 Environment Variables

### Backend (`.env`)
| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | 3001 | Server port |
| `JWT_SECRET` | **Yes** | dev value | JWT signing secret |
| `MONGODB_URI` | No | in-memory | MongoDB connection string |
| `REDIS_URL` | No | in-memory | Redis connection |
| `GROQ_API_KEY` | No | mock mode | Groq AI API key |
| `ANTHROPIC_API_KEY` | No | — | Anthropic fallback AI |
| `STRIPE_SECRET_KEY` | No | — | Stripe payments |
| `RESEND_API_KEY` | No | — | Email notifications |

---

## 📡 API Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login → tokens |
| POST | `/api/auth/refresh` | Refresh access token |
| GET | `/api/auth/me` | Current user + plan |
| POST | `/api/auth/logout` | Invalidate tokens |

### Workspaces
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/workspaces` | List workspaces |
| POST | `/api/workspaces` | Create (−5 credits) |
| POST | `/api/workspaces/:id/generate` | Generate architecture |
| POST | `/api/workspaces/:id/generate/stream` | SSE streaming generation |
| GET | `/api/workspaces/:id/history` | Iteration history |
| POST | `/api/workspaces/:id/rollback/:snapshotId` | Roll back |
| POST | `/api/workspaces/:id/collaborators` | Invite collaborator |
| GET | `/api/workspaces/:id/adrs` | List ADRs |
| POST | `/api/workspaces/:id/adrs` | Create ADR |
| POST | `/api/workspaces/:id/export` | Generate CI/CD config |

### Marketplace & Credits
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/templates` | Browse templates |
| POST | `/api/templates/:id/use` | Use template |
| GET | `/api/credits/balance` | Credits balance + history |
| POST | `/api/credits/purchase` | Buy credits |
| GET | `/api/notifications` | User notifications |

---

## ⚡ Credits Economy

| Action | Cost |
|--------|------|
| Create workspace | −5 |
| Generate (≤5 nodes) | −10 |
| Generate (6–15 nodes) | −20 |
| Generate (16+ nodes) | −40 |
| Run Critic | −5 |
| Generate tests | −10 |
| Export CI/CD | −15 |
| AI-generated ADR | −3 |
| Invite collaborator | **+20** 🎉 |
| Template used by others | **+10–50** 🎉 |

---

## 🧪 Testing

```bash
# Backend (Jest)
cd backend
npm test
npm run test:coverage

# Frontend (Vitest)
cd frontend
npm test
npm run test:coverage
```

---

## 🔌 WebSocket Events

### Client → Server
- `join_workspace` — join collab session
- `cursor_move` — broadcast cursor position
- `node_editing` — lock a node for editing
- `generation_started` / `generation_complete` — sync generation state

### Server → All
- `user_joined` / `user_left`
- `cursors_update` — batched cursor positions
- `node_lock_changed`
- `generation_complete`
- `comment_added` / `adr_created`

---

## 🛣️ Roadmap

- **Phase 1** (Done): Core API, auth, generation, credits
- **Phase 2**: Real MongoDB/Redis integration, Groq live AI
- **Phase 3**: Stripe billing, real-time WebSocket collab with Yjs CRDT
- **Phase 4**: Plugin marketplace, mobile PWA, VS Code extension

---

## 📄 License

Proprietary — VisualArch AI v3.0 L99 ULTRA Edition · 2025
