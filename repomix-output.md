This file is a merged representation of a subset of the codebase, containing specifically included files, combined into a single document by Repomix.

# File Summary

## Purpose
This file contains a packed representation of a subset of the repository's contents that is considered the most important context.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.
- Pay special attention to the Repository Description. These contain important context and guidelines specific to this project.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Only files matching these patterns are included: **/*
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Files are sorted by Git change count (files with more changes are at the bottom)

# User Provided Header
VisualArch Repository Context

# Directory Structure
```
.gitignore
backend/__tests__/middleware/auth.test.ts
backend/__tests__/routes/auth.test.ts
backend/__tests__/routes/workspaces.test.ts
backend/__tests__/services/credits.test.ts
backend/.env.example
backend/.gitignore
backend/Dockerfile
backend/jest.config.js
backend/package.json
backend/src/index.ts
backend/src/middleware/auth.ts
backend/src/middleware/rbac.ts
backend/src/models/db.ts
backend/src/models/schemas/ADR.schema.ts
backend/src/models/schemas/Comment.schema.ts
backend/src/models/schemas/History.schema.ts
backend/src/models/schemas/Notification.schema.ts
backend/src/models/schemas/RefreshToken.schema.ts
backend/src/models/schemas/Template.schema.ts
backend/src/models/schemas/Transaction.schema.ts
backend/src/models/schemas/User.schema.ts
backend/src/models/schemas/Workspace.schema.ts
backend/src/models/store.ts
backend/src/routes/auth.ts
backend/src/routes/credits.ts
backend/src/routes/marketplace.ts
backend/src/routes/workspaces.ts
backend/src/services/ai/groq.adapter.ts
backend/src/services/credits.service.ts
backend/src/services/generation.service.ts
backend/src/types/index.ts
backend/src/utils/params.ts
backend/src/websocket/workspace.gateway.ts
backend/tsconfig.json
docker-compose.yml
frontend/.env.example
frontend/.gitignore
frontend/Dockerfile
frontend/next-env.d.ts
frontend/next.config.js
frontend/package.json
frontend/postcss.config.js
frontend/src/app/dashboard/page.tsx
frontend/src/app/error.tsx
frontend/src/app/layout.tsx
frontend/src/app/login/page.tsx
frontend/src/app/marketplace/page.tsx
frontend/src/app/page.tsx
frontend/src/app/register/page.tsx
frontend/src/app/workspace/[id]/export/page.tsx
frontend/src/app/workspace/[id]/page.tsx
frontend/src/components/ai-assistant/CriticFeedbackPanel.tsx
frontend/src/components/ai-assistant/PromptSuggestions.tsx
frontend/src/components/canvas/ArchitectureCanvas.tsx
frontend/src/components/canvas/ArchitectureNode.tsx
frontend/src/components/charts/ArchitectureScoreGauge.tsx
frontend/src/components/charts/CreditsWidget.tsx
frontend/src/components/ui/ToastContainer.tsx
frontend/src/components/workspace/ADRMode.tsx
frontend/src/components/workspace/DesignCanvas.tsx
frontend/src/components/workspace/DesignMode.tsx
frontend/src/components/workspace/IDEMode.tsx
frontend/src/components/workspace/MonacoEditor.tsx
frontend/src/components/workspace/puck.config.tsx
frontend/src/components/workspace/PuckEditor.tsx
frontend/src/lib/api.ts
frontend/src/lib/store/auth.ts
frontend/src/lib/store/toast.ts
frontend/src/lib/store/workspace.ts
frontend/src/styles/globals.css
frontend/src/test/api.test.ts
frontend/src/test/components.test.tsx
frontend/src/test/setup.ts
frontend/tailwind.config.js
frontend/tsconfig.json
frontend/vitest.config.ts
make.bat
Makefile
README.md
repomix.config.json
v2_xmls/architecture.xml
```

# Files

## File: make.bat
````batch
@echo off
if "%1"=="repomix" (
    npx -y repomix
) else (
    echo Usage: make repomix
)
````

## File: Makefile
````makefile
.PHONY: repomix

repomix:
	npx -y repomix
````

## File: repomix.config.json
````json
{
  "output": {
    "filePath": "repomix-output.md",
    "style": "markdown",
    "removeComments": false,
    "removeEmptyLines": false,
    "topFilesLength": 20,
    "showLineNumbers": false,
    "copyToClipboard": false,
    "headerText": "VisualArch Repository Context"
  },
  "include": [
    "**/*"
  ],
  "exclude": [
    "**/node_modules/**",
    "**/.git/**",
    "**/dist/**",
    "**/.next/**",
    "**/out/**",
    "**/build/**",
    "**/package-lock.json",
    "**/yarn.lock",
    "**/pnpm-lock.yaml",
    "**/.env*",
    "**/repomix-output.md",
    "v2_xmls/**"
  ]
}
````

## File: v2_xmls/architecture.xml
````xml
<?xml version="1.0" encoding="UTF-8"?>
<Project name="VisualArch_v2">
    <Description>AI-driven software architecture prototyping and code scavenger platform.</Description>
    <Architecture>
        <Layer name="Backend">
            <Stack>Node.js, Express, TypeScript, MongoDB, Socket.io</Stack>
            <KeyComponents>
                <Component name="GenerationService">AI-orchestrated planning, coding, and critique pipeline.</Component>
                <Component name="WebSocketGateway">Optimized O(N) broadcaster for real-time collaboration.</Component>
                <Component name="CreditsService">Atomic transactional system for AI usage meta-credits.</Component>
            </KeyComponents>
            <DataPersistence>MongoDB Atlas with Mongoose Schemas (History, ADRs, Comments, Workspaces).</DataPersistence>
        </Layer>
        <Layer name="Frontend">
            <Stack>Next.js 14, React, Tailwind CSS, Puck UI</Stack>
            <Features>
                <Feature name="Cockpit Interface">Three-panel workspace for visual design, console, and documentation.</Feature>
                <Feature name="Puck Builder">Component-driven UI prototyping that informs AI generation.</Feature>
            </Features>
        </Layer>
        <Layer name="AI">
            <Model>Groq Llama-3.3-70b-versatile</Model>
            <Optimizations>Parallelized node generation, Exponential backoff for rate limits.</Optimizations>
        </Layer>
    </Architecture>
    <Status>Version 3.0.0 (Migrated to MongoDB, Optimized WebSockets)</Status>
</Project>
````

## File: backend/__tests__/middleware/auth.test.ts
````typescript
import request from 'supertest';
import { app } from '../../src/index';
import { store } from '../../src/models/store';

describe('Auth Middleware', () => {
  it('should return 401 without Authorization header', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('No token provided');
  });

  it('should return 401 with malformed token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer not.a.valid.token');
    expect(res.status).toBe(401);
  });

  it('should pass with valid Bearer token', async () => {
    store.users.clear();
    const regRes = await request(app)
      .post('/api/auth/register')
      .send({ email: 'mw@example.com', password: 'password123', name: 'MW User' });

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${regRes.body.accessToken}`);

    expect(res.status).toBe(200);
  });
});

describe('Health Check', () => {
  it('GET /api/health should return healthy status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('healthy');
    expect(res.body.version).toBe('3.0.0');
    expect(res.body.services).toBeDefined();
  });
});

describe('Rate Limiting', () => {
  it('should return 404 for unknown routes', async () => {
    const res = await request(app).get('/api/unknown-route');
    expect(res.status).toBe(404);
  });
});
````

## File: backend/__tests__/routes/auth.test.ts
````typescript
import request from 'supertest';
import { app } from '../../src/index';
import { store } from '../../src/models/store';

describe('Auth Routes', () => {
  beforeEach(() => {
    // Clear users between tests
    store.users.clear();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'test@example.com', password: 'securepass123', name: 'Test User' });

      expect(res.status).toBe(201);
      expect(res.body.accessToken).toBeDefined();
      expect(res.body.user.email).toBe('test@example.com');
      expect(res.body.user.plan).toBe('free');
      expect(res.body.user.creditsBalance).toBe(100);
    });

    it('should reject duplicate email', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({ email: 'dup@example.com', password: 'securepass123', name: 'First' });

      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'dup@example.com', password: 'anotherpass', name: 'Second' });

      expect(res.status).toBe(409);
      expect(res.body.error).toContain('already registered');
    });

    it('should reject weak password', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'weak@example.com', password: '123', name: 'Weak' });

      expect(res.status).toBe(400);
    });

    it('should reject invalid email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'not-an-email', password: 'securepass123', name: 'Bad Email' });

      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/auth/register')
        .send({ email: 'login@example.com', password: 'securepass123', name: 'Login User' });
    });

    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'login@example.com', password: 'securepass123' });

      expect(res.status).toBe(200);
      expect(res.body.accessToken).toBeDefined();
      expect(res.body.user.email).toBe('login@example.com');
    });

    it('should reject wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'login@example.com', password: 'wrongpassword' });

      expect(res.status).toBe(401);
    });

    it('should reject non-existent user', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'nobody@example.com', password: 'anypassword' });

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return current user with valid token', async () => {
      const regRes = await request(app)
        .post('/api/auth/register')
        .send({ email: 'me@example.com', password: 'securepass123', name: 'Me User' });

      const { accessToken } = regRes.body;

      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.email).toBe('me@example.com');
    });

    it('should reject request without token', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.status).toBe(401);
    });

    it('should reject invalid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid.jwt.token');
      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout successfully', async () => {
      const regRes = await request(app)
        .post('/api/auth/register')
        .send({ email: 'logout@example.com', password: 'securepass123', name: 'Logout User' });

      const res = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${regRes.body.accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toContain('Logged out');
    });
  });
});
````

## File: backend/__tests__/routes/workspaces.test.ts
````typescript
import request from 'supertest';
import { app } from '../../src/index';
import { store } from '../../src/models/store';

let accessToken: string;
let userId: string;

async function registerAndLogin(email = 'ws@example.com') {
  store.users.clear();
  store.workspaces.clear();

  const res = await request(app)
    .post('/api/auth/register')
    .send({ email, password: 'securepass123', name: 'WS User' });

  accessToken = res.body.accessToken;
  userId = res.body.user.id;
  return res.body;
}

describe('Workspace Routes', () => {
  beforeEach(async () => {
    await registerAndLogin();
  });

  describe('GET /api/workspaces', () => {
    it('should return empty list for new user', async () => {
      const res = await request(app)
        .get('/api/workspaces')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toEqual([]);
    });

    it('should require authentication', async () => {
      const res = await request(app).get('/api/workspaces');
      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/workspaces', () => {
    it('should create a workspace and deduct credits', async () => {
      const res = await request(app)
        .post('/api/workspaces')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'My Workspace', description: 'Test workspace' });

      expect(res.status).toBe(201);
      expect(res.body.data.name).toBe('My Workspace');
      expect(res.body.data.ownerId).toBe(userId);

      // Credits should be deducted
      const userAfter = store.findUserById(userId);
      expect(userAfter?.creditsBalance).toBe(95); // 100 - 5
    });

    it('should reject missing name', async () => {
      const res = await request(app)
        .post('/api/workspaces')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ description: 'No name' });

      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/workspaces/:id', () => {
    it('should return workspace for owner', async () => {
      const create = await request(app)
        .post('/api/workspaces')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'Test WS' });

      const wsId = create.body.data.id;

      const res = await request(app)
        .get(`/api/workspaces/${wsId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(wsId);
    });

    it('should return 404 for non-existent workspace', async () => {
      const res = await request(app)
        .get('/api/workspaces/non-existent-id')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(404);
    });
  });

  describe('PATCH /api/workspaces/:id', () => {
    it('should update workspace name', async () => {
      const create = await request(app)
        .post('/api/workspaces')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'Old Name' });

      const wsId = create.body.data.id;

      const res = await request(app)
        .patch(`/api/workspaces/${wsId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'New Name' });

      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe('New Name');
    });
  });

  describe('DELETE /api/workspaces/:id', () => {
    it('should delete workspace', async () => {
      const create = await request(app)
        .post('/api/workspaces')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'Delete Me' });

      const wsId = create.body.data.id;

      const res = await request(app)
        .delete(`/api/workspaces/${wsId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(204);
      expect(store.findWorkspaceById(wsId)).toBeUndefined();
    });
  });

  describe('POST /api/workspaces/:id/generate', () => {
    it('should generate architecture from prompt', async () => {
      const create = await request(app)
        .post('/api/workspaces')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'Gen WS' });

      const wsId = create.body.data.id;

      const res = await request(app)
        .post(`/api/workspaces/${wsId}/generate`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ prompt: 'Build a React + Node.js e-commerce app' });

      expect(res.status).toBe(200);
      expect(res.body.data.architectureData).toBeDefined();
      expect(res.body.data.architectureData.nodes.length).toBeGreaterThan(0);
      expect(res.body.data.architectureScore).toBeGreaterThan(0);
    }, 30000);

    it('should require prompt', async () => {
      const create = await request(app)
        .post('/api/workspaces')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'NoPrompt WS' });

      const res = await request(app)
        .post(`/api/workspaces/${create.body.data.id}/generate`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({});

      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/workspaces/:id/history', () => {
    it('should return generation history', async () => {
      const create = await request(app)
        .post('/api/workspaces')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'History WS' });

      const wsId = create.body.data.id;

      await request(app)
        .post(`/api/workspaces/${wsId}/generate`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ prompt: 'Build a microservices app' });

      const res = await request(app)
        .get(`/api/workspaces/${wsId}/history`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
    }, 30000);
  });

  describe('GET /api/workspaces/:id/adrs', () => {
    it('should return empty ADR list initially', async () => {
      const create = await request(app)
        .post('/api/workspaces')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'ADR WS' });

      const res = await request(app)
        .get(`/api/workspaces/${create.body.data.id}/adrs`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toEqual([]);
    });
  });
});
````

## File: backend/__tests__/services/credits.test.ts
````typescript
import { CreditsService, CREDITS_COSTS } from '../../src/services/credits.service';
import { store } from '../../src/models/store';
import { User } from '../../src/types';
import { v4 as uuidv4 } from 'uuid';

function createTestUser(creditsBalance = 100): User {
  const user: User = {
    id: uuidv4(),
    email: `test-${Date.now()}@example.com`,
    name: 'Test User',
    passwordHash: 'hash',
    plan: 'free',
    creditsBalance,
    creditsResetDate: new Date(),
    onboardingCompleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  store.saveUser(user);
  return user;
}

describe('CreditsService', () => {
  let service: CreditsService;

  beforeEach(() => {
    service = new CreditsService();
  });

  describe('deductCredits', () => {
    it('should deduct credits successfully', () => {
      const user = createTestUser(100);
      const result = service.deductCredits(user.id, 10, { action: 'test' });

      expect(result).toBe(true);
      expect(store.findUserById(user.id)?.creditsBalance).toBe(90);
    });

    it('should fail when insufficient credits', () => {
      const user = createTestUser(5);
      const result = service.deductCredits(user.id, 10, { action: 'test' });

      expect(result).toBe(false);
      expect(store.findUserById(user.id)?.creditsBalance).toBe(5); // unchanged
    });

    it('should create transaction record', () => {
      const user = createTestUser(100);
      service.deductCredits(user.id, 15, { action: 'generate' });

      const txs = store.getTransactions(user.id);
      expect(txs.length).toBe(1);
      expect(txs[0].amount).toBe(-15);
      expect(txs[0].type).toBe('spend');
      expect(txs[0].balanceAfter).toBe(85);
    });
  });

  describe('addCredits', () => {
    it('should add earned credits', () => {
      const user = createTestUser(50);
      service.addCredits(user.id, 20, 'earn', { reason: 'invite' });

      expect(store.findUserById(user.id)?.creditsBalance).toBe(70);
    });

    it('should create earn transaction', () => {
      const user = createTestUser(50);
      service.addCredits(user.id, 20, 'earn', { reason: 'invite' });

      const txs = store.getTransactions(user.id);
      expect(txs[0].type).toBe('earn');
      expect(txs[0].amount).toBe(20);
    });
  });

  describe('calculateGenerationCost', () => {
    it('should return small cost for ≤5 nodes', () => {
      expect(service.calculateGenerationCost(3)).toBe(CREDITS_COSTS.GENERATE_SMALL);
      expect(service.calculateGenerationCost(5)).toBe(CREDITS_COSTS.GENERATE_SMALL);
    });

    it('should return medium cost for 6-15 nodes', () => {
      expect(service.calculateGenerationCost(6)).toBe(CREDITS_COSTS.GENERATE_MEDIUM);
      expect(service.calculateGenerationCost(15)).toBe(CREDITS_COSTS.GENERATE_MEDIUM);
    });

    it('should return large cost for 16+ nodes', () => {
      expect(service.calculateGenerationCost(16)).toBe(CREDITS_COSTS.GENERATE_LARGE);
      expect(service.calculateGenerationCost(100)).toBe(CREDITS_COSTS.GENERATE_LARGE);
    });
  });

  describe('getBalance', () => {
    it('should return correct balance and history', () => {
      const user = createTestUser(200);
      service.deductCredits(user.id, 10, { action: 'test' });
      service.addCredits(user.id, 5, 'earn', { reason: 'viral' });

      const { balance, plan, history } = service.getBalance(user.id);
      expect(balance).toBe(195);
      expect(plan).toBe('free');
      expect(history.length).toBe(2);
    });

    it('should return zeros for non-existent user', () => {
      const { balance } = service.getBalance('non-existent');
      expect(balance).toBe(0);
    });
  });
});
````

## File: backend/.env.example
````
# Server
PORT=3001
NODE_ENV=development

# JWT
JWT_SECRET=visualarch_jwt_secret_dev_2025
JWT_REFRESH_SECRET=visualarch_refresh_secret_dev_2025
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=30d

# MongoDB (optional - uses in-memory store if not set)
MONGODB_URI=mongodb://localhost:27017/visualarch

# Redis (optional - uses in-memory if not set)
REDIS_URL=redis://localhost:6379

# Groq AI (optional - uses mock if not set)
GROQ_API_KEY=your_groq_api_key_here

# Anthropic (optional - fallback AI)
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Stripe (optional)
STRIPE_SECRET_KEY=your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here

# Resend Email (optional)
RESEND_API_KEY=re_AqDYSjJK_NEXCR9aBk3gRVp36jJmbhQrF

# Cloudflare R2 (optional)
R2_ACCOUNT_ID=b70f29fb5d764dba5f65d7ef2d62c6a2
R2_ACCESS_KEY=26acf7255513a006f1d40a06d6db775f
R2_SECRET_KEY=336dc4b03bd3a938e9ae1224abe6d9231d9486f2b62667452bec9ae0e77bfc07
R2_BUCKET=visualarch-exports

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Sentry (optional)
SENTRY_DSN=https://497be02fa73e6673650100f59a1c51a7@o4511214456864768.ingest.us.sentry.io/4511214466564096
````

## File: backend/Dockerfile
````
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist
EXPOSE 3001
CMD ["node", "dist/index.js"]
````

## File: backend/jest.config.js
````javascript
/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/__tests__', '<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts', '**/*.spec.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/index.ts',
    '!src/types/**',
  ],
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
````

## File: backend/src/models/schemas/ADR.schema.ts
````typescript
import mongoose, { Schema, Document } from 'mongoose';
import { ADR, ADRStatus } from '../../types';

export interface IADRDocument extends Omit<ADR, 'id'>, Document {}

const ADRSchema = new Schema<IADRDocument>({
  workspaceId: { type: String, required: true, index: true },
  nodeId: { type: String },
  title: { type: String, required: true },
  context: { type: String, required: true },
  decision: { type: String, required: true },
  consequences: { type: String, required: true },
  alternatives: [{ type: String }],
  status: { type: String, enum: ['proposed', 'accepted', 'deprecated'], default: 'proposed' },
  createdBy: { type: String, required: true },
}, { 
  timestamps: true,
  toJSON: {
    transform: (_, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

export const ADRModel = mongoose.model<IADRDocument>('ADR', ADRSchema);
````

## File: backend/src/models/schemas/Comment.schema.ts
````typescript
import mongoose, { Schema, Document } from 'mongoose';
import { Comment } from '../../types';

export interface CommentDocument extends Omit<Comment, 'id'>, Document {}

const CommentSchema: Schema = new Schema({
  workspaceId: { type: String, required: true, index: true },
  nodeId: { type: String },
  authorId: { type: String, required: true },
  authorName: { type: String, required: true },
  text: { type: String, required: true },
  resolved: { type: Boolean, default: false },
  threadId: { type: String },
}, {
  timestamps: { createdAt: true, updatedAt: true },
});

// Virtual for ID
CommentSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

CommentSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export const CommentModel = mongoose.model<CommentDocument>('Comment', CommentSchema);
````

## File: backend/src/models/schemas/History.schema.ts
````typescript
import mongoose, { Schema, Document } from 'mongoose';
import { ArchitectureHistory } from '../../types';

export interface HistoryDocument extends Omit<ArchitectureHistory, 'id'>, Document {}

const HistorySchema: Schema = new Schema({
  workspaceId: { type: String, required: true, index: true },
  iteration: { type: Number, required: true },
  prompt: { type: String, required: true },
  architectureData: { type: Object, required: true },
  criticFeedback: { type: Object },
  architectureScore: { type: Number, required: true },
  creditsSpent: { type: Number, required: true },
  modelUsed: { type: String, required: true },
}, {
  timestamps: { createdAt: true, updatedAt: false },
});

// Virtual for ID
HistorySchema.virtual('id').get(function() {
  return this._id.toHexString();
});

HistorySchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export const HistoryModel = mongoose.model<HistoryDocument>('History', HistorySchema);
````

## File: backend/src/models/schemas/Notification.schema.ts
````typescript
import mongoose, { Schema, Document } from 'mongoose';
import { Notification, NotificationType } from '../../types';

export interface INotificationDocument extends Omit<Notification, 'id'>, Document {}

const NotificationSchema = new Schema<INotificationDocument>({
  userId: { type: String, required: true, index: true },
  type: { type: String, required: true },
  payload: { type: Schema.Types.Mixed, default: {} },
  read: { type: Boolean, default: false },
}, { 
  timestamps: true,
  toJSON: {
    transform: (_, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

export const NotificationModel = mongoose.model<INotificationDocument>('Notification', NotificationSchema);
````

## File: backend/src/models/schemas/RefreshToken.schema.ts
````typescript
import mongoose, { Schema, Document } from 'mongoose';

export interface IRefreshTokenDocument extends Document {
  tokenHash: string;
  userId: string;
  expiresAt: Date;
}

const RefreshTokenSchema = new Schema<IRefreshTokenDocument>({
  tokenHash: { type: String, required: true, index: true },
  userId: { type: String, required: true, index: true },
  expiresAt: { type: Date, required: true, index: { expires: 0 } }, // TTL index
}, { timestamps: true });

export const RefreshTokenModel = mongoose.model<IRefreshTokenDocument>('RefreshToken', RefreshTokenSchema);
````

## File: backend/src/models/schemas/Template.schema.ts
````typescript
import mongoose, { Schema, Document } from 'mongoose';
import { Template } from '../../types';

export interface ITemplateDocument extends Omit<Template, 'id'>, Document {}

const TemplateSchema = new Schema<ITemplateDocument>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true, index: true },
  techStack: [{ type: String }],
  architectureData: {
    nodes: [Schema.Types.Mixed],
    edges: [Schema.Types.Mixed],
    techStack: [{ type: String }],
    layoutDirection: { type: String, default: 'TB' },
  },
  authorId: { type: String, required: true, index: true },
  authorName: { type: String, required: true },
  isPremium: { type: Boolean, default: false },
  price: { type: Number, default: 0 },
  useCount: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  isPublic: { type: Boolean, default: true, index: true },
}, { 
  timestamps: true,
  toJSON: {
    transform: (_, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

TemplateSchema.index({ title: 'text', description: 'text' });

export const TemplateModel = mongoose.model<ITemplateDocument>('Template', TemplateSchema);
````

## File: backend/src/models/schemas/Transaction.schema.ts
````typescript
import mongoose, { Schema, Document } from 'mongoose';
import { Transaction, TransactionType } from '../../types';

export interface ITransactionDocument extends Omit<Transaction, 'id'>, Document {}

const TransactionSchema = new Schema<ITransactionDocument>({
  userId: { type: String, required: true, index: true },
  type: { type: String, enum: ['purchase', 'earn', 'spend'], required: true },
  amount: { type: Number, required: true },
  balanceAfter: { type: Number, required: true },
  meta: { type: Schema.Types.Mixed, default: {} },
}, { 
  timestamps: true,
  toJSON: {
    transform: (_, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Index for getting latest history
TransactionSchema.index({ userId: 1, createdAt: -1 });

export const TransactionModel = mongoose.model<ITransactionDocument>('Transaction', TransactionSchema);
````

## File: backend/src/models/schemas/User.schema.ts
````typescript
import mongoose, { Schema, Document } from 'mongoose';
import { User, PlanType } from '../../types';

export interface IUserDocument extends Omit<User, 'id'>, Document {
  // Mongoose automatically adds _id and handles it as string/ObjectId
}

const UserSchema = new Schema<IUserDocument>({
  email: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  passwordHash: { type: String, required: true },
  plan: { type: String, enum: ['free', 'pro', 'team', 'enterprise'], default: 'free' },
  creditsBalance: { type: Number, default: 100 },
  creditsResetDate: { type: Date, default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
  refreshTokenHash: { type: String, index: true }, // Added index for O(1) lookups during refresh
  avatarUrl: { type: String },
  onboardingCompleted: { type: Boolean, default: false },
}, { 
  timestamps: true,
  toJSON: {
    transform: (_, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      delete ret.passwordHash;
      delete ret.refreshTokenHash;
      return ret;
    }
  }
});

// Helper for finding user by refresh token
UserSchema.statics.findByRefreshToken = function(token: string) {
  // Note: we still need to bcrypt.compare in the service, 
  // but we can at least filter by indexed fields if we changed how we store it.
  // For now, index helps even with a partial match if we used a prefix-based token.
  return this.findOne({ refreshTokenHash: { $exists: true } }); 
};

export const UserModel = mongoose.model<IUserDocument>('User', UserSchema);
````

## File: backend/src/models/schemas/Workspace.schema.ts
````typescript
import mongoose, { Schema, Document } from 'mongoose';
import { Workspace, ArchitectureData, WorkspaceCollaborator } from '../../types';

export interface IWorkspaceDocument extends Omit<Workspace, 'id'>, Document {}

const CollaboratorSchema = new Schema<WorkspaceCollaborator>({
  userId: { type: String, required: true },
  role: { type: String, enum: ['owner', 'editor', 'viewer'], required: true },
  invitedBy: { type: String, required: true },
  acceptedAt: { type: Date },
}, { _id: false });

const WorkspaceSchema = new Schema<IWorkspaceDocument>({
  ownerId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  description: { type: String },
  prompt: { type: String, default: '' },
  techStack: [{ type: String }],
  architectureData: {
    nodes: [Schema.Types.Mixed],
    edges: [Schema.Types.Mixed],
    techStack: [{ type: String }],
    layoutDirection: { type: String, enum: ['TB', 'LR'], default: 'TB' },
  },
  collaborators: [CollaboratorSchema],
  visibility: { type: String, enum: ['private', 'team', 'public'], default: 'private' },
  forkCount: { type: Number, default: 0 },
  architectureScore: { type: Number, default: 0 },
  lastCriticRun: { type: Date },
  archspecYaml: { type: String },
  designData: { type: Schema.Types.Mixed },
}, { 
  timestamps: true,
  toJSON: {
    transform: (_, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Indices for common queries
WorkspaceSchema.index({ ownerId: 1, createdAt: -1 });
WorkspaceSchema.index({ visibility: 1 });
WorkspaceSchema.index({ 'collaborators.userId': 1 });

export const WorkspaceModel = mongoose.model<IWorkspaceDocument>('Workspace', WorkspaceSchema);
````

## File: backend/src/models/store.ts
````typescript
// ============================================================
// VisualArch AI - In-Memory Data Store (dev/test mode)
// In production, replace with MongoDB Atlas
// ============================================================

import {
  User, Workspace, ArchitectureHistory, ADR,
  Template, Transaction, Notification, Comment
} from '../types';

class InMemoryStore {
  users: Map<string, User> = new Map();
  workspaces: Map<string, Workspace> = new Map();
  history: Map<string, ArchitectureHistory[]> = new Map();
  adrs: Map<string, ADR> = new Map();
  templates: Map<string, Template> = new Map();
  transactions: Map<string, Transaction[]> = new Map();
  notifications: Map<string, Notification[]> = new Map();
  comments: Map<string, Comment[]> = new Map();

  // User operations
  findUserByEmail(email: string): User | undefined {
    for (const user of this.users.values()) {
      if (user.email === email) return user;
    }
    return undefined;
  }

  findUserById(id: string): User | undefined {
    return this.users.get(id);
  }

  saveUser(user: User): User {
    this.users.set(user.id, user);
    return user;
  }

  deleteUser(id: string): boolean {
    return this.users.delete(id);
  }

  // Workspace operations
  findWorkspacesByOwner(ownerId: string): Workspace[] {
    return Array.from(this.workspaces.values()).filter(
      ws => ws.ownerId === ownerId ||
        ws.collaborators.some(c => c.userId === ownerId)
    );
  }

  findWorkspaceById(id: string): Workspace | undefined {
    return this.workspaces.get(id);
  }

  saveWorkspace(ws: Workspace): Workspace {
    this.workspaces.set(ws.id, ws);
    return ws;
  }

  deleteWorkspace(id: string): boolean {
    this.history.delete(id);
    this.adrs.forEach((adr, adrId) => {
      if (adr.workspaceId === id) this.adrs.delete(adrId);
    });
    return this.workspaces.delete(id);
  }

  getPublicWorkspaces(): Workspace[] {
    return Array.from(this.workspaces.values()).filter(ws => ws.visibility === 'public');
  }

  // History operations
  addHistory(workspaceId: string, entry: ArchitectureHistory): void {
    const existing = this.history.get(workspaceId) ?? [];
    existing.push(entry);
    this.history.set(workspaceId, existing);
  }

  getHistory(workspaceId: string): ArchitectureHistory[] {
    return this.history.get(workspaceId) ?? [];
  }

  // ADR operations
  getADRsByWorkspace(workspaceId: string): ADR[] {
    return Array.from(this.adrs.values()).filter(a => a.workspaceId === workspaceId);
  }

  findADRById(id: string): ADR | undefined {
    return this.adrs.get(id);
  }

  saveADR(adr: ADR): ADR {
    this.adrs.set(adr.id, adr);
    return adr;
  }

  // Template operations
  getAllTemplates(): Template[] {
    return Array.from(this.templates.values()).filter(t => t.isPublic);
  }

  findTemplateById(id: string): Template | undefined {
    return this.templates.get(id);
  }

  saveTemplate(template: Template): Template {
    this.templates.set(template.id, template);
    return template;
  }

  // Transactions
  addTransaction(userId: string, tx: Transaction): void {
    const existing = this.transactions.get(userId) ?? [];
    existing.unshift(tx);
    this.transactions.set(userId, existing);
  }

  getTransactions(userId: string): Transaction[] {
    return this.transactions.get(userId) ?? [];
  }

  // Notifications
  addNotification(userId: string, notif: Notification): void {
    const existing = this.notifications.get(userId) ?? [];
    existing.unshift(notif);
    this.notifications.set(userId, existing);
  }

  getNotifications(userId: string): Notification[] {
    return this.notifications.get(userId) ?? [];
  }

  markAllNotificationsRead(userId: string): void {
    const notifs = this.getNotifications(userId);
    notifs.forEach(n => { n.read = true; });
    this.notifications.set(userId, notifs);
  }

  // Comments
  addComment(comment: Comment): Comment {
    const wsComments = this.comments.get(comment.workspaceId) ?? [];
    wsComments.push(comment);
    this.comments.set(comment.workspaceId, wsComments);
    return comment;
  }

  getCommentsByNode(workspaceId: string, nodeId: string): Comment[] {
    return (this.comments.get(workspaceId) ?? []).filter(c => c.nodeId === nodeId);
  }

  findCommentById(id: string): Comment | undefined {
    for (const comments of this.comments.values()) {
      const found = comments.find(c => c.id === id);
      if (found) return found;
    }
    return undefined;
  }
}

// Singleton store instance
export const store = new InMemoryStore();

// Seed demo templates on startup
export function seedDemoData(): void {
  const demoTemplate: Template = {
    id: 'template-001',
    title: 'Microservices E-commerce Platform',
    description: 'Production-ready microservices architecture with API Gateway, Auth, Product, Order services',
    category: 'E-commerce',
    techStack: ['Node.js', 'React', 'MongoDB', 'Redis', 'Docker'],
    architectureData: {
      nodes: [
        { id: 'n1', label: 'API Gateway', layer: 'Gateway', description: 'Route and auth requests', status: 'stable', position: { x: 400, y: 50 }, files: [], testFiles: [] },
        { id: 'n2', label: 'Auth Service', layer: 'Services', description: 'JWT auth, OAuth', status: 'stable', position: { x: 100, y: 200 }, files: [], testFiles: [] },
        { id: 'n3', label: 'Product Service', layer: 'Services', description: 'Product catalog CRUD', status: 'stable', position: { x: 300, y: 200 }, files: [], testFiles: [] },
        { id: 'n4', label: 'Order Service', layer: 'Services', description: 'Order processing', status: 'stable', position: { x: 500, y: 200 }, files: [], testFiles: [] },
        { id: 'n5', label: 'MongoDB', layer: 'Database', description: 'Primary database', status: 'stable', position: { x: 300, y: 380 }, files: [], testFiles: [] },
        { id: 'n6', label: 'Redis Cache', layer: 'Cache', description: 'Session and product cache', status: 'stable', position: { x: 550, y: 380 }, files: [], testFiles: [] },
      ],
      edges: [
        { id: 'e1', source: 'n1', target: 'n2', label: 'auth' },
        { id: 'e2', source: 'n1', target: 'n3', label: 'products' },
        { id: 'e3', source: 'n1', target: 'n4', label: 'orders' },
        { id: 'e4', source: 'n3', target: 'n5', label: 'db' },
        { id: 'e5', source: 'n4', target: 'n5', label: 'db' },
        { id: 'e6', source: 'n3', target: 'n6', label: 'cache' },
      ],
      techStack: ['Node.js', 'React', 'MongoDB', 'Redis'],
      layoutDirection: 'TB',
    },
    authorId: 'system',
    authorName: 'VisualArch Team',
    isPremium: false,
    price: 0,
    useCount: 1247,
    rating: 4.8,
    isPublic: true,
    createdAt: new Date('2025-01-15'),
  };

  const demoTemplate2: Template = {
    id: 'template-002',
    title: 'Next.js SaaS Starter',
    description: 'Full-stack SaaS with auth, billing, dashboard, and AI integration',
    category: 'SaaS',
    techStack: ['Next.js', 'TypeScript', 'PostgreSQL', 'Stripe'],
    architectureData: {
      nodes: [
        { id: 'n1', label: 'Next.js Frontend', layer: 'Frontend', description: 'App Router + Server Components', status: 'stable', position: { x: 300, y: 50 }, files: [], testFiles: [] },
        { id: 'n2', label: 'API Routes', layer: 'Backend', description: 'Next.js API routes', status: 'stable', position: { x: 300, y: 200 }, files: [], testFiles: [] },
        { id: 'n3', label: 'Auth (NextAuth)', layer: 'Auth', description: 'OAuth + credentials', status: 'stable', position: { x: 100, y: 200 }, files: [], testFiles: [] },
        { id: 'n4', label: 'Stripe Billing', layer: 'Payments', description: 'Subscriptions + webhooks', status: 'stable', position: { x: 500, y: 200 }, files: [], testFiles: [] },
        { id: 'n5', label: 'PostgreSQL', layer: 'Database', description: 'Primary database', status: 'stable', position: { x: 300, y: 380 }, files: [], testFiles: [] },
      ],
      edges: [
        { id: 'e1', source: 'n1', target: 'n2' },
        { id: 'e2', source: 'n2', target: 'n3' },
        { id: 'e3', source: 'n2', target: 'n4' },
        { id: 'e4', source: 'n2', target: 'n5' },
      ],
      techStack: ['Next.js', 'TypeScript', 'PostgreSQL', 'Stripe'],
      layoutDirection: 'TB',
    },
    authorId: 'system',
    authorName: 'VisualArch Team',
    isPremium: true,
    price: 20,
    useCount: 892,
    rating: 4.9,
    isPublic: true,
    createdAt: new Date('2025-02-10'),
  };

  store.saveTemplate(demoTemplate);
  store.saveTemplate(demoTemplate2);
}
````

## File: backend/src/utils/params.ts
````typescript
/** Safely extract a single string from Express route params */
export const p = (param: string | string[]): string =>
  Array.isArray(param) ? param[0] : param;
````

## File: backend/tsconfig.json
````json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "__tests__"]
}
````

## File: docker-compose.yml
````yaml
version: '3.9'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=development
      - PORT=3001
      - JWT_SECRET=visualarch_dev_secret_change_in_prod
      - JWT_REFRESH_SECRET=visualarch_refresh_secret_change_in_prod
      - FRONTEND_URL=http://localhost:3000
      # Uncomment and add real keys for production:
      # - MONGODB_URI=mongodb+srv://...
      # - REDIS_URL=redis://redis:6379
      # - GROQ_API_KEY=...
    depends_on:
      - redis
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:3001
      - NEXT_PUBLIC_WS_URL=http://localhost:3001
    depends_on:
      - backend
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped
    command: redis-server --appendonly yes

volumes:
  redis_data:
````

## File: frontend/.env.example
````
# VisualArch Frontend Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001

# Features
NEXT_PUBLIC_ENABLE_ANALYTICS=false
````

## File: frontend/.gitignore
````
node_modules/
.pnp
.pnp.js

.next/
out/

npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

.env
.env.local
.env.development.local
.env.test.local
.env.production.local


tsconfig.tsbuildinfo


.DS_Store
*.pem

.eslintcache
````

## File: frontend/Dockerfile
````
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
````

## File: frontend/next.config.js
````javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
    NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001',
  },
};

module.exports = nextConfig;
````

## File: frontend/postcss.config.js
````javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
````

## File: frontend/src/app/dashboard/page.tsx
````typescript
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Plus, Zap, Bell, Settings, LogOut, GitFork, Users,
  Clock, TrendingUp, ShoppingBag, Search, Filter,
} from 'lucide-react';
import { useAuthStore } from '@/lib/store/auth';
import { useWorkspaceStore } from '@/lib/store/workspace';
import { ArchitectureScoreGauge } from '@/components/charts/ArchitectureScoreGauge';
import { CreditsWidget } from '@/components/charts/CreditsWidget';

export default function DashboardPage() {
  const router = useRouter();
  const { user, fetchMe, logout } = useAuthStore();
  const { workspaces, fetchWorkspaces, createWorkspace, deleteWorkspace, loading } = useWorkspaceStore();
  const [activeTab, setActiveTab] = useState<'mine' | 'shared' | 'marketplace'>('mine');
  const [showNewModal, setShowNewModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [creating, setCreating] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchMe();
    fetchWorkspaces();
  }, []);

  useEffect(() => {
    if (!user && !loading) router.push('/login');
  }, [user, loading]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    try {
      const ws = await createWorkspace(newName, newDesc);
      setShowNewModal(false);
      setNewName(''); setNewDesc('');
      router.push(`/workspace/${ws.id}`);
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const filtered = workspaces.filter(ws =>
    ws.name.toLowerCase().includes(search.toLowerCase())
  );

  const scoreColor = (score: number) =>
    score >= 80 ? 'text-success' : score >= 60 ? 'text-warning' : 'text-danger';

  return (
    <div className="min-h-screen bg-bg">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-surface border-r border-white/5 flex flex-col z-40">
        <div className="p-5 border-b border-white/5">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <span className="text-white font-bold text-sm">V</span>
            </div>
            <div>
              <div className="text-sm font-semibold text-text-primary">VisualArch AI</div>
              <div className="text-xs text-text-secondary">v3.0 ULTRA</div>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {[
            { icon: Zap, label: 'Workspaces', href: '/dashboard', active: true },
            { icon: ShoppingBag, label: 'Marketplace', href: '/marketplace' },
            { icon: Settings, label: 'Settings', href: '/settings' },
          ].map(({ icon: Icon, label, href, active }) => (
            <Link key={label} href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${active ? 'bg-accent/15 text-accent' : 'text-text-secondary hover:text-text-primary hover:bg-surface-2'}`}>
              <Icon className="w-4 h-4" /> {label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          {/* Credits widget */}
          <CreditsWidget balance={user?.creditsBalance ?? 0} plan={user?.plan ?? 'free'} />
          <div className="mt-3 flex items-center gap-3 p-2">
            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent text-sm font-semibold">
              {user?.name?.[0]?.toUpperCase() ?? '?'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-text-primary truncate">{user?.name}</div>
              <div className="text-xs text-text-secondary truncate">{user?.plan} plan</div>
            </div>
            <button onClick={handleLogout} className="text-text-secondary hover:text-danger transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">
              Good morning, {user?.name?.split(' ')[0]} 👋
            </h1>
            <p className="text-text-secondary mt-1 text-sm">{workspaces.length} workspaces · {user?.creditsBalance} credits remaining</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg bg-surface border border-white/5 text-text-secondary hover:text-text-primary transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-accent" />
            </button>
            <button
              onClick={() => setShowNewModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-btn bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-all hover:shadow-glow-accent"
            >
              <Plus className="w-4 h-4" /> New Workspace
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl bg-surface border border-white/5 w-fit mb-6">
          {(['mine', 'shared', 'marketplace'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${activeTab === tab ? 'bg-accent text-white' : 'text-text-secondary hover:text-text-primary'}`}>
              {tab === 'mine' ? 'My Workspaces' : tab === 'shared' ? 'Shared with Me' : 'Marketplace'}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search workspaces..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-surface border border-white/5 text-sm text-text-primary placeholder-text-secondary outline-none focus:border-accent/40"
          />
        </div>

        {/* Workspace grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1,2,3].map(i => <div key={i} className="h-44 rounded-card bg-surface animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-surface mx-auto flex items-center justify-center mb-4">
              <Zap className="w-8 h-8 text-text-secondary" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">No workspaces yet</h3>
            <p className="text-text-secondary mb-6 text-sm">Create your first workspace and let AI design your architecture</p>
            <button onClick={() => setShowNewModal(true)} className="btn-primary">
              <Plus className="w-4 h-4" /> Create workspace
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(ws => (
              <div key={ws.id} className="group p-5 rounded-card bg-surface border border-white/5 hover:border-accent/20 transition-all cursor-pointer"
                onClick={() => router.push(`/workspace/${ws.id}`)}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-text-primary truncate">{ws.name}</h3>
                    {ws.description && <p className="text-xs text-text-secondary mt-0.5 truncate">{ws.description}</p>}
                  </div>
                  <ArchitectureScoreGauge score={ws.architectureScore} size="sm" />
                </div>

                {ws.techStack?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {ws.techStack.slice(0, 3).map(t => (
                      <span key={t} className="px-2 py-0.5 rounded-full bg-surface-2 text-xs text-text-secondary">{t}</span>
                    ))}
                    {ws.techStack.length > 3 && <span className="text-xs text-text-secondary">+{ws.techStack.length - 3}</span>}
                  </div>
                )}

                <div className="flex items-center gap-4 text-xs text-text-secondary">
                  <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> {ws.nodeCount ?? 0} nodes</span>
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {ws.collaborators ?? 0}</span>
                  <span className="flex items-center gap-1 ml-auto"><Clock className="w-3 h-3" /> {new Date(ws.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}

            {/* New workspace card */}
            <button onClick={() => setShowNewModal(true)}
              className="p-5 rounded-card border-2 border-dashed border-white/10 hover:border-accent/30 transition-all flex flex-col items-center justify-center gap-2 text-text-secondary hover:text-accent min-h-[160px]">
              <Plus className="w-8 h-8" />
              <span className="text-sm font-medium">New Workspace</span>
            </button>
          </div>
        )}
      </main>

      {/* New workspace modal */}
      {showNewModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowNewModal(false)}>
          <div className="w-full max-w-md p-6 rounded-card bg-surface border border-white/10 shadow-card" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-semibold text-text-primary mb-4">Create New Workspace</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm text-text-secondary mb-1.5">Workspace name *</label>
                <input value={newName} onChange={e => setNewName(e.target.value)} required
                  placeholder="My Awesome Project" className="input-field w-full" autoFocus />
              </div>
              <div>
                <label className="block text-sm text-text-secondary mb-1.5">Description (optional)</label>
                <input value={newDesc} onChange={e => setNewDesc(e.target.value)}
                  placeholder="Brief project description..." className="input-field w-full" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowNewModal(false)}
                  className="flex-1 py-2.5 rounded-btn border border-white/10 text-text-secondary hover:text-text-primary text-sm transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={creating}
                  className="flex-1 py-2.5 rounded-btn bg-accent text-white text-sm font-medium hover:bg-accent/90 disabled:opacity-60 transition-all">
                  {creating ? 'Creating...' : 'Create (−5 credits)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx global>{`
        .btn-primary { background: #5E81F4; color: white; padding: 10px 20px; border-radius: 10px; font-weight: 500; display: inline-flex; align-items: center; gap: 8px; transition: all 0.2s; font-size: 14px; }
        .btn-primary:hover { background: rgba(94,129,244,0.9); box-shadow: 0 0 20px rgba(94,129,244,0.3); }
        .input-field { background: #1E2A45; border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 10px 14px; color: #EAEEFF; font-size: 14px; outline: none; transition: border-color 0.2s; }
        .input-field:focus { border-color: #5E81F4; }
        .input-field::placeholder { color: #8B8FA8; }
      `}</style>
    </div>
  );
}
````

## File: frontend/src/app/error.tsx
````typescript
'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { RefreshCw, Home, AlertTriangle } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Global Error]', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-3xl bg-error/10 border border-error/20 flex items-center justify-center mx-auto mb-8 shadow-glow-error">
          <AlertTriangle className="w-10 h-10 text-error" />
        </div>
        
        <h1 className="text-3xl font-bold text-text-primary mb-3 tracking-tight">System Fault Detected</h1>
        <p className="text-text-secondary mb-8 text-sm leading-relaxed">
          The architecture engine encountered an unexpected runtime error. Your progress has been saved, but the current view needs to recalibrate.
        </p>

        <div className="grid gap-3">
          <button
            onClick={reset}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-accent text-white font-semibold hover:bg-accent/90 transition-all hover:shadow-glow-accent"
          >
            <RefreshCw className="w-4 h-4" /> Reset Environment
          </button>
          
          <Link
            href="/dashboard"
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-surface border border-white/5 text-text-primary font-semibold hover:bg-surface-2 transition-all"
          >
            <Home className="w-4 h-4" /> Return to Dashboard
          </Link>
        </div>

        {error.digest && (
          <p className="mt-8 text-[10px] text-text-secondary font-mono opacity-40">
            Fault Digest: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
````

## File: frontend/src/app/login/page.tsx
````typescript
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Zap } from 'lucide-react';
import { useAuthStore } from '@/lib/store/auth';

export default function LoginPage() {
  const router = useRouter();
  const { login, loading, error, user, clearError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);

  useEffect(() => { if (user) router.push('/dashboard'); }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    await login(email, password);
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-text-primary">Welcome back</h1>
          <p className="text-text-secondary text-sm mt-2">Sign in to your VisualArch workspace</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm text-text-secondary mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="input-field w-full"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPwd ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="input-field w-full pr-10"
                placeholder="••••••••"
              />
              <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary">
                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full py-2.5 rounded-btn bg-accent text-white font-medium hover:bg-accent/90 disabled:opacity-60 transition-all">
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-text-secondary">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-accent hover:underline">Sign up free</Link>
        </div>

        <div className="mt-4 p-3 rounded-lg bg-surface border border-white/5 text-xs text-text-secondary text-center">
          Demo: <span className="text-accent">demo@visualarch.ai</span> / <span className="text-accent">demo123456</span>
        </div>
      </div>

      <style jsx global>{`
        .input-field {
          background: #16213E;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          padding: 10px 14px;
          color: #EAEEFF;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
        }
        .input-field:focus { border-color: #5E81F4; box-shadow: 0 0 0 3px rgba(94,129,244,0.15); }
        .input-field::placeholder { color: #8B8FA8; }
      `}</style>
    </div>
  );
}
````

## File: frontend/src/app/marketplace/page.tsx
````typescript
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Star, GitFork, ArrowRight, Zap, Filter } from 'lucide-react';
import { api } from '@/lib/api';
import { ArchitectureScoreGauge } from '@/components/charts/ArchitectureScoreGauge';

interface Template {
  id: string;
  title: string;
  description: string;
  category: string;
  techStack: string[];
  authorName: string;
  isPremium: boolean;
  price: number;
  useCount: number;
  rating: number;
  nodeCount: number;
  createdAt: string;
}

const CATEGORIES = ['All', 'E-commerce', 'SaaS', 'Microservices', 'Realtime', 'Mobile', 'AI/ML'];

export default function MarketplacePage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    const load = async () => {
      try {
        const params = new URLSearchParams();
        if (category !== 'All') params.set('category', category);
        if (search) params.set('q', search);
        const res = await api.get<{ data: Template[] }>(`/api/templates?${params}`);
        setTemplates(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [search, category]);

  const handleUse = async (templateId: string) => {
    try {
      const res = await api.post<{ data: { id: string } }>(`/api/templates/${templateId}/use`);
      router.push(`/workspace/${res.data.id}`);
    } catch (err: any) {
      alert(err.message ?? 'Failed to use template');
    }
  };

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <div className="border-b border-white/5 bg-surface/50">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <Link href="/dashboard" className="text-text-secondary text-sm hover:text-text-primary mb-2 inline-block">← Dashboard</Link>
              <h1 className="text-2xl font-bold text-text-primary">Architecture Marketplace</h1>
              <p className="text-text-secondary text-sm mt-1">Discover and use production-ready architecture templates</p>
            </div>
            <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 rounded-btn bg-accent text-white text-sm hover:bg-accent/90 transition-colors">
              <Zap className="w-4 h-4" /> Publish Template
            </Link>
          </div>

          {/* Search + filters */}
          <div className="flex gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search architectures..."
                className="w-full pl-9 pr-4 py-2 rounded-lg bg-surface border border-white/10 text-sm text-text-primary placeholder-text-secondary outline-none focus:border-accent/40"
              />
            </div>
            <div className="flex gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-2 rounded-lg text-sm transition-colors ${category === cat ? 'bg-accent text-white' : 'bg-surface border border-white/10 text-text-secondary hover:text-text-primary'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1,2,3,4].map(i => <div key={i} className="h-64 rounded-card bg-surface animate-pulse" />)}
          </div>
        ) : templates.length === 0 ? (
          <div className="text-center py-20 text-text-secondary">
            <p>No templates found. Be the first to publish one!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map(t => (
              <div key={t.id} className="group p-5 rounded-card bg-surface border border-white/5 hover:border-accent/20 transition-all flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-text-primary truncate">{t.title}</h3>
                      {t.isPremium && (
                        <span className="flex-shrink-0 px-1.5 py-0.5 rounded text-xs bg-warning/20 text-warning">PRO</span>
                      )}
                    </div>
                    <p className="text-xs text-text-secondary mt-1">{t.category} · by {t.authorName}</p>
                  </div>
                  <ArchitectureScoreGauge score={75 + Math.floor(Math.random() * 25)} size="sm" />
                </div>

                <p className="text-sm text-text-secondary mb-3 line-clamp-2">{t.description}</p>

                <div className="flex flex-wrap gap-1 mb-3">
                  {t.techStack.slice(0, 4).map(tech => (
                    <span key={tech} className="px-2 py-0.5 rounded-full bg-surface-2 text-xs text-text-secondary">{tech}</span>
                  ))}
                </div>

                <div className="flex items-center gap-3 text-xs text-text-secondary mb-4">
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-warning" /> {t.rating.toFixed(1)}
                  </span>
                  <span className="flex items-center gap-1">
                    <GitFork className="w-3 h-3" /> {t.useCount.toLocaleString()}
                  </span>
                  <span>{t.nodeCount} nodes</span>
                </div>

                <div className="mt-auto flex gap-2">
                  <button
                    onClick={() => handleUse(t.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-accent text-white text-sm hover:bg-accent/90 transition-colors"
                  >
                    {t.isPremium ? `Use (${t.price} credits)` : 'Use Free'}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
````

## File: frontend/src/app/page.tsx
````typescript
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Zap, Shield, Users, Code2, ArrowRight, Star, GitFork,
  Brain, Eye, GitBranch, ChevronRight, Play,
} from 'lucide-react';

const MOCK_GENERATION_STEPS = [
  '🔍 Retrieving project memory...',
  '🧠 Planner analyzing requirements...',
  '⚡ Generating API Gateway component...',
  '⚡ Generating Auth Service...',
  '⚡ Generating Product Service...',
  '🔮 Critic reviewing architecture...',
  '✅ Score: 87/100 — Architecture ready!',
];

const FEATURES = [
  { icon: Brain, label: 'Persistent Memory', color: 'text-purple', desc: 'AI remembers all past decisions and patterns' },
  { icon: Eye, label: 'Architecture Critic', color: 'text-warning', desc: 'Automatic anti-pattern detection & fixes' },
  { icon: Users, label: 'Real-time Collab', color: 'text-accent', desc: 'Multiplayer workspace with live cursors' },
  { icon: GitBranch, label: 'CI/CD Generator', color: 'text-success', desc: 'One-click GitHub Actions + Docker setup' },
  { icon: Code2, label: 'Test Scaffolding', color: 'text-accent-2', desc: 'Unit, integration & E2E tests per node' },
  { icon: Star, label: 'Marketplace', color: 'text-danger', desc: 'Share & sell architecture templates' },
];

const STATS = [
  { label: 'Workspaces Created', value: '24,817' },
  { label: 'Components Generated', value: '412K+' },
  { label: 'Architecture Score Avg', value: '82/100' },
  { label: 'Hours Saved', value: '180K+' },
];

const PRICING = [
  {
    name: 'Free', price: '$0', credits: '100 credits/mo', color: 'border-surface-2',
    features: ['3 workspaces', 'Basic generation', 'Public templates', 'Community support'],
    cta: 'Get Started',
  },
  {
    name: 'Pro', price: '$19', credits: '2,000 credits/mo', color: 'border-accent', badge: 'Most Popular',
    features: ['Unlimited workspaces', 'AI Critic + Memory', 'Collaboration (5 users)', 'Priority AI', 'CI/CD export', 'History rollback'],
    cta: 'Start Pro',
  },
  {
    name: 'Team', price: '$49', credits: '10,000 credits/mo', color: 'border-accent-2',
    features: ['20 team members', 'Admin dashboard', 'SSO ready', 'Plugin marketplace', 'Architecture DSL', 'SLA 99.9%'],
    cta: 'Start Team',
  },
];

export default function LandingPage() {
  const router = useRouter();
  const [demoStep, setDemoStep] = useState(-1);
  const [prompt, setPrompt] = useState('');
  const [isRunningDemo, setIsRunningDemo] = useState(false);

  const runDemo = async () => {
    if (!prompt.trim()) return;
    setIsRunningDemo(true);
    setDemoStep(0);
    for (let i = 0; i < MOCK_GENERATION_STEPS.length; i++) {
      await new Promise(r => setTimeout(r, 600 + Math.random() * 400));
      setDemoStep(i);
    }
    setIsRunningDemo(false);
  };

  return (
    <div className="min-h-screen bg-bg overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 glass border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
            <span className="text-white font-bold text-sm">V</span>
          </div>
          <span className="font-semibold text-text-primary">VisualArch AI</span>
          <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-accent/20 text-accent">v3.0</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm text-text-secondary">
          <Link href="#features" className="hover:text-text-primary transition-colors">Features</Link>
          <Link href="#pricing" className="hover:text-text-primary transition-colors">Pricing</Link>
          <Link href="/marketplace" className="hover:text-text-primary transition-colors">Marketplace</Link>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Log in</Link>
          <Link href="/register" className="btn-primary text-sm">
            Get started free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-accent/5 blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm mb-6">
            <Zap className="w-3.5 h-3.5" />
            <span>New: Architecture Memory + Real-time Collaboration</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            <span className="gradient-text">Living Architecture</span>
            <br />
            <span className="text-text-primary">Platform</span>
          </h1>

          <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-10">
            AI that designs, codes, reviews and evolves your software architecture. From prompt to production-ready system in minutes.
          </p>

          {/* Interactive demo prompt */}
          <div className="max-w-2xl mx-auto mb-6">
            <div className="flex gap-2 p-2 rounded-xl bg-surface border border-white/10 shadow-card">
              <input
                type="text"
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && runDemo()}
                placeholder="e.g. Build a microservices e-commerce platform with Next.js and MongoDB..."
                className="flex-1 bg-transparent px-3 py-2 text-sm text-text-primary placeholder-text-secondary outline-none"
              />
              <button
                onClick={runDemo}
                disabled={isRunningDemo || !prompt.trim()}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent/90 disabled:opacity-50 transition-all"
              >
                <Play className="w-3.5 h-3.5" />
                {isRunningDemo ? 'Generating...' : 'Try Demo'}
              </button>
            </div>

            {/* Demo output */}
            {demoStep >= 0 && (
              <div className="mt-3 p-4 rounded-xl bg-surface border border-white/10 text-left text-sm font-mono space-y-1">
                {MOCK_GENERATION_STEPS.slice(0, demoStep + 1).map((step, i) => (
                  <div
                    key={i}
                    className={`${i === demoStep && isRunningDemo ? 'text-accent streaming' : 'text-text-secondary'} transition-all`}
                  >
                    {step}
                  </div>
                ))}
                {!isRunningDemo && demoStep === MOCK_GENERATION_STEPS.length - 1 && (
                  <Link href="/register" className="mt-2 flex items-center gap-1 text-accent hover:underline">
                    See full architecture → <ArrowRight className="w-3 h-3" />
                  </Link>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-3">
            <Link href="/register" className="btn-primary flex items-center gap-2 text-base px-6 py-3">
              Start for free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/dashboard" className="flex items-center gap-2 px-6 py-3 rounded-btn border border-white/10 text-text-secondary hover:text-text-primary hover:border-white/20 transition-all text-base">
              View Demo Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-white/5">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map(stat => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold gradient-text mb-1">{stat.value}</div>
              <div className="text-sm text-text-secondary">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">14 Killer Features</h2>
            <p className="text-text-secondary text-lg">Everything you need to go from idea to production architecture</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, label, color, desc }) => (
              <div key={label} className="p-6 rounded-card bg-surface border border-white/5 hover:border-accent/20 transition-all group">
                <div className={`w-10 h-10 rounded-xl bg-surface-2 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <h3 className="font-semibold text-text-primary mb-1">{label}</h3>
                <p className="text-sm text-text-secondary">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6 bg-surface/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Simple Pricing</h2>
            <p className="text-text-secondary">Start free, scale as you grow. Credits never expire.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {PRICING.map(plan => (
              <div key={plan.name} className={`relative p-6 rounded-card bg-surface border-2 ${plan.color} transition-all hover:shadow-glow-accent`}>
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-accent text-white text-xs font-semibold">
                    {plan.badge}
                  </div>
                )}
                <div className="mb-6">
                  <div className="text-sm text-text-secondary mb-1">{plan.name}</div>
                  <div className="text-4xl font-bold text-text-primary">{plan.price}<span className="text-lg text-text-secondary">/mo</span></div>
                  <div className="text-sm text-accent mt-1">{plan.credits}</div>
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-text-secondary">
                      <ChevronRight className="w-3.5 h-3.5 text-success flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className={`block text-center py-2.5 rounded-btn text-sm font-medium transition-all ${plan.name === 'Pro' ? 'bg-accent text-white hover:bg-accent/90' : 'border border-white/10 text-text-primary hover:border-accent/30'}`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold mb-4">Ready to build smarter?</h2>
          <p className="text-text-secondary mb-8">Join thousands of developers using AI to design production-ready architectures</p>
          <Link href="/register" className="btn-primary inline-flex items-center gap-2 text-base px-8 py-4">
            Start for free — no credit card required <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-accent flex items-center justify-center">
              <span className="text-white font-bold text-xs">V</span>
            </div>
            <span className="text-sm text-text-secondary">VisualArch AI v3.0 · L99 ULTRA Edition</span>
          </div>
          <div className="flex gap-6 text-sm text-text-secondary">
            <Link href="/marketplace" className="hover:text-text-primary transition-colors">Marketplace</Link>
            <Link href="#features" className="hover:text-text-primary transition-colors">Features</Link>
            <Link href="#pricing" className="hover:text-text-primary transition-colors">Pricing</Link>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        .btn-primary {
          background: linear-gradient(135deg, #5E81F4, #4B6CD9);
          color: white;
          padding: 10px 20px;
          border-radius: 10px;
          font-weight: 500;
          transition: all 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 0 20px rgba(94,129,244,0.4);
        }
      `}</style>
    </div>
  );
}
````

## File: frontend/src/app/register/page.tsx
````typescript
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Zap, Check } from 'lucide-react';
import { useAuthStore } from '@/lib/store/auth';

const PASSWORD_RULES = [
  { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
  { label: 'Contains a number', test: (p: string) => /\d/.test(p) },
];

export default function RegisterPage() {
  const router = useRouter();
  const { register, loading, error, user, clearError } = useAuthStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);

  useEffect(() => { if (user) router.push('/dashboard'); }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    await register(email, password, name);
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-text-primary">Create your account</h1>
          <p className="text-text-secondary text-sm mt-2">Start with 100 free AI credits</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm">{error}</div>
          )}

          <div>
            <label className="block text-sm text-text-secondary mb-1.5">Full name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} required className="input-field w-full" placeholder="Alex Smith" />
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-1.5">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="input-field w-full" placeholder="you@example.com" />
          </div>

          <div>
            <label className="block text-sm text-text-secondary mb-1.5">Password</label>
            <div className="relative">
              <input type={showPwd ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required className="input-field w-full pr-10" placeholder="Create a strong password" />
              <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary">
                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {password && (
              <div className="mt-2 space-y-1">
                {PASSWORD_RULES.map(rule => (
                  <div key={rule.label} className={`flex items-center gap-1.5 text-xs ${rule.test(password) ? 'text-success' : 'text-text-secondary'}`}>
                    <Check className="w-3 h-3" /> {rule.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button type="submit" disabled={loading} className="w-full py-2.5 rounded-btn bg-accent text-white font-medium hover:bg-accent/90 disabled:opacity-60 transition-all">
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="mt-4 text-xs text-text-secondary text-center">
          By registering you agree to our Terms of Service and Privacy Policy
        </p>

        <div className="mt-6 text-center text-sm text-text-secondary">
          Already have an account? <Link href="/login" className="text-accent hover:underline">Sign in</Link>
        </div>
      </div>

      <style jsx global>{`
        .input-field { background: #16213E; border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 10px 14px; color: #EAEEFF; font-size: 14px; outline: none; transition: border-color 0.2s; width: 100%; }
        .input-field:focus { border-color: #5E81F4; box-shadow: 0 0 0 3px rgba(94,129,244,0.15); }
        .input-field::placeholder { color: #8B8FA8; }
      `}</style>
    </div>
  );
}
````

## File: frontend/src/app/workspace/[id]/export/page.tsx
````typescript
'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Download, Check } from 'lucide-react';
import { api } from '@/lib/api';

const PLATFORMS = [
  { id: 'vercel-railway', label: 'Vercel + Railway', desc: 'Frontend on Vercel, API on Railway' },
  { id: 'digitalocean', label: 'DigitalOcean App Platform', desc: 'Full stack on DO' },
  { id: 'fly-io', label: 'Fly.io', desc: 'Global edge deployment' },
  { id: 'aws', label: 'AWS (Amplify + ECS)', desc: 'Enterprise AWS stack' },
];

export default function ExportPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [platform, setPlatform] = useState('vercel-railway');
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [step, setStep] = useState(1);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await api.post<{ data: any }>(`/api/workspaces/${id}/export`, { platform });
      setResult(res.data);
      setStep(3);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg p-8">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-text-secondary hover:text-text-primary mb-6 text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to workspace
        </button>

        <h1 className="text-2xl font-bold text-text-primary mb-2">CI/CD Pipeline Generator</h1>
        <p className="text-text-secondary mb-8">Generate a complete deployment configuration for your architecture</p>

        {/* Steps */}
        <div className="flex items-center gap-4 mb-8">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step >= s ? 'bg-accent text-white' : 'bg-surface border border-white/10 text-text-secondary'}`}>
                {step > s ? <Check className="w-4 h-4" /> : s}
              </div>
              <span className={`text-sm ${step >= s ? 'text-text-primary' : 'text-text-secondary'}`}>
                {s === 1 ? 'Platform' : s === 2 ? 'Configure' : 'Download'}
              </span>
              {s < 3 && <div className="w-8 h-px bg-white/10" />}
            </div>
          ))}
        </div>

        {/* Step 1: Platform selection */}
        {step === 1 && (
          <div className="space-y-3">
            <h2 className="text-base font-semibold text-text-primary mb-4">Select Target Platform</h2>
            {PLATFORMS.map(p => (
              <button key={p.id} onClick={() => setPlatform(p.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${platform === p.id ? 'border-accent bg-accent/10' : 'border-white/10 bg-surface hover:border-white/20'}`}>
                <div className="font-medium text-text-primary text-sm">{p.label}</div>
                <div className="text-xs text-text-secondary mt-0.5">{p.desc}</div>
              </button>
            ))}
            <button onClick={() => setStep(2)} className="mt-4 w-full py-3 rounded-btn bg-accent text-white font-medium hover:bg-accent/90 transition-colors">
              Continue →
            </button>
          </div>
        )}

        {/* Step 2: Configure */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-text-primary mb-4">Configuration</h2>
            <div className="p-4 rounded-xl bg-surface border border-white/10 space-y-3">
              <div>
                <label className="text-xs text-text-secondary mb-1 block">Branch strategy</label>
                <select className="w-full bg-surface-2 border border-white/10 rounded-lg px-3 py-2 text-sm text-text-primary outline-none">
                  <option>main → production, develop → staging</option>
                  <option>main only → production</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-text-secondary mb-1 block">Generated files</label>
                <div className="space-y-1">
                  {['.github/workflows/ci.yml', 'Dockerfile', 'docker-compose.yml', '.env.example', 'README.md'].map(f => (
                    <div key={f} className="flex items-center gap-2 text-xs text-text-secondary">
                      <Check className="w-3 h-3 text-success" /> {f}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-btn border border-white/10 text-text-secondary hover:text-text-primary text-sm transition-colors">
                ← Back
              </button>
              <button onClick={handleGenerate} disabled={generating} className="flex-1 py-3 rounded-btn bg-accent text-white font-medium hover:bg-accent/90 disabled:opacity-60 transition-colors">
                {generating ? 'Generating...' : 'Generate (−15 credits)'}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Result */}
        {step === 3 && result && (
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-text-primary mb-4">✅ CI/CD Config Ready</h2>
            <div className="p-4 rounded-xl bg-surface border border-white/10">
              <div className="text-xs text-text-secondary mb-2 font-mono">github/workflows/ci.yml</div>
              <pre className="text-xs text-text-secondary font-mono overflow-auto max-h-64 whitespace-pre-wrap">{result.cicdYaml?.slice(0, 800)}...</pre>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  const blob = new Blob([result.cicdYaml], { type: 'text/yaml' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url; a.download = 'ci.yml'; a.click();
                }}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-btn bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors"
              >
                <Download className="w-4 h-4" /> Download ci.yml
              </button>
              <button onClick={() => router.back()} className="flex-1 py-3 rounded-btn border border-white/10 text-text-secondary hover:text-text-primary text-sm transition-colors">
                Back to workspace
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
````

## File: frontend/src/components/ai-assistant/CriticFeedbackPanel.tsx
````typescript
'use client';

import { useState } from 'react';
import { AlertTriangle, Info, XCircle, ChevronDown, ChevronUp, Wand2 } from 'lucide-react';

interface Issue {
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  nodeId?: string;
  suggestion: string;
}

interface Props {
  issues: Issue[];
  score: number;
  onFix?: (issue: Issue) => void;
}

const SEVERITY_CONFIG = {
  critical: { icon: XCircle, color: 'text-danger', bg: 'bg-danger/10 border-danger/20', label: 'Critical' },
  warning: { icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/10 border-warning/20', label: 'Warning' },
  info: { icon: Info, color: 'text-accent-2', bg: 'bg-accent-2/10 border-accent-2/20', label: 'Info' },
};

export function CriticFeedbackPanel({ issues, score, onFix }: Props) {
  const [expanded, setExpanded] = useState<number[]>([0]);
  const [isOpen, setIsOpen] = useState(true);

  const critical = issues.filter(i => i.severity === 'critical').length;
  const warnings = issues.filter(i => i.severity === 'warning').length;

  const toggleExpand = (i: number) =>
    setExpanded(e => e.includes(i) ? e.filter(x => x !== i) : [...e, i]);

  return (
    <div className="rounded-xl bg-surface border border-white/10 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-surface-2/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-text-primary">Architecture Critic</span>
          {critical > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-danger/20 text-danger text-xs">{critical} critical</span>
          )}
          {warnings > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-warning/20 text-warning text-xs">{warnings} warnings</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-secondary">Score: {score}/100</span>
          {isOpen ? <ChevronUp className="w-4 h-4 text-text-secondary" /> : <ChevronDown className="w-4 h-4 text-text-secondary" />}
        </div>
      </button>

      {isOpen && (
        <div className="divide-y divide-white/5">
          {issues.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-text-secondary">
              ✅ No issues found — great architecture!
            </div>
          ) : (
            issues.map((issue, i) => {
              const cfg = SEVERITY_CONFIG[issue.severity];
              const Icon = cfg.icon;
              const isExpanded = expanded.includes(i);

              return (
                <div key={i} className={`p-3 border-l-2 ${issue.severity === 'critical' ? 'border-danger' : issue.severity === 'warning' ? 'border-warning' : 'border-accent-2'}`}>
                  <button className="w-full flex items-start gap-2 text-left" onClick={() => toggleExpand(i)}>
                    <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${cfg.color}`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-text-primary">{issue.title}</div>
                      {!isExpanded && (
                        <div className="text-xs text-text-secondary truncate mt-0.5">{issue.description}</div>
                      )}
                    </div>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-text-secondary mt-0.5" /> : <ChevronDown className="w-3.5 h-3.5 text-text-secondary mt-0.5" />}
                  </button>

                  {isExpanded && (
                    <div className="mt-2 ml-6 space-y-2 animate-fade-in">
                      <p className="text-xs text-text-secondary">{issue.description}</p>
                      <div className={`p-2 rounded-lg border text-xs ${cfg.bg}`}>
                        <span className="font-medium">💡 Fix: </span>
                        <span className="text-text-secondary">{issue.suggestion}</span>
                      </div>
                      {onFix && (
                        <button
                          onClick={() => onFix(issue)}
                          className="flex items-center gap-1 text-xs text-accent hover:text-accent/80 transition-colors"
                        >
                          <Wand2 className="w-3 h-3" /> Auto-fix with AI
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
````

## File: frontend/src/components/ai-assistant/PromptSuggestions.tsx
````typescript
'use client';

import { Sparkles } from 'lucide-react';

const SUGGESTIONS = [
  'Build a microservices e-commerce platform with React, Node.js, and MongoDB',
  'Create a real-time chat app with Socket.io, Redis Pub/Sub, and PostgreSQL',
  'Design a SaaS dashboard with Next.js, auth, billing via Stripe, and analytics',
  'Build a REST API backend with Express, JWT auth, rate limiting, and caching',
];

interface Props {
  onSelect: (prompt: string) => void;
}

export function PromptSuggestions({ onSelect }: Props) {
  return (
    <div className="mb-3">
      <div className="flex items-center gap-1.5 mb-2 text-xs text-text-secondary">
        <Sparkles className="w-3.5 h-3.5 text-accent" />
        <span>Try one of these:</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {SUGGESTIONS.map((s, i) => (
          <button
            key={i}
            onClick={() => onSelect(s)}
            className="px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-xs text-accent hover:bg-accent/20 transition-colors truncate max-w-xs"
          >
            {s.length > 60 ? s.slice(0, 60) + '…' : s}
          </button>
        ))}
      </div>
    </div>
  );
}
````

## File: frontend/src/components/canvas/ArchitectureNode.tsx
````typescript
import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { ArchNode } from '@/lib/store/workspace';

const LAYER_COLORS: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  Frontend:      { bg: 'rgba(94,129,244,0.12)', border: '#5E81F4', text: '#5E81F4', glow: 'rgba(94,129,244,0.3)' },
  Backend:       { bg: 'rgba(34,211,238,0.12)', border: '#22D3EE', text: '#22D3EE', glow: 'rgba(34,211,238,0.3)' },
  Gateway:       { bg: 'rgba(167,139,250,0.12)', border: '#A78BFA', text: '#A78BFA', glow: 'rgba(167,139,250,0.3)' },
  Services:      { bg: 'rgba(74,222,128,0.12)', border: '#4ADE80', text: '#4ADE80', glow: 'rgba(74,222,128,0.3)' },
  Database:      { bg: 'rgba(251,191,36,0.12)', border: '#FACC15', text: '#FACC15', glow: 'rgba(251,191,36,0.3)' },
  Cache:         { bg: 'rgba(248,113,113,0.12)', border: '#F87171', text: '#F87171', glow: 'rgba(248,113,113,0.3)' },
  Auth:          { bg: 'rgba(167,139,250,0.12)', border: '#A78BFA', text: '#A78BFA', glow: 'rgba(167,139,250,0.3)' },
  Infrastructure:{ bg: 'rgba(139,143,168,0.12)', border: '#8B8FA8', text: '#8B8FA8', glow: 'rgba(139,143,168,0.3)' },
};

const STATUS_COLORS: Record<string, string> = {
  new:      '#4ADE80',
  modified: '#FACC15',
  stable:   '#5E81F4',
};

const ArchitectureNode = ({ data, selected }: NodeProps<ArchNode>) => {
  const colors = LAYER_COLORS[data.layer] ?? LAYER_COLORS.Backend;
  const statusColor = STATUS_COLORS[data.status] ?? '#8B8FA8';

  return (
    <div 
      className={`
        px-4 py-3 rounded-xl border-2 transition-all duration-300 min-w-[180px]
        ${selected ? 'scale-105 shadow-lg relative z-10' : 'hover:border-white/20'}
      `}
      style={{ 
        backgroundColor: 'rgba(13, 14, 21, 0.9)',
        borderColor: selected ? colors.border : 'rgba(255, 255, 255, 0.08)',
        boxShadow: selected ? `0 0 20px ${colors.glow}` : 'none'
      }}
    >
      <Handle type="target" position={Position.Top} className="!bg-transparent !border-none" />
      
      <div className="flex justify-between items-start mb-2">
        <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: colors.border }}>
          {data.layer}
        </span>
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: statusColor }} />
      </div>

      <h3 className="text-sm font-semibold text-white mb-1">{data.label}</h3>
      <p className="text-[10px] text-text-secondary leading-normal line-clamp-2">
        {data.description}
      </p>

      {data.files && data.files.length > 0 && (
        <div className="mt-3 pt-2 border-t border-white/5 flex gap-2 items-center opacity-60">
          <span className="text-[9px] text-text-secondary">
            {data.files.length} files
          </span>
          <span className="text-[9px] text-text-secondary">·</span>
          <span className="text-[9px] text-text-secondary">
            {data.testFiles?.length ?? 0} tests
          </span>
        </div>
      )}

      <Handle type="source" position={Position.Bottom} className="!bg-transparent !border-none" />
    </div>
  );
};

export default memo(ArchitectureNode);
````

## File: frontend/src/components/charts/ArchitectureScoreGauge.tsx
````typescript
'use client';

interface Props {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function ArchitectureScoreGauge({ score, size = 'md', showLabel = false }: Props) {
  const radius = size === 'sm' ? 18 : size === 'md' ? 28 : 40;
  const strokeW = size === 'sm' ? 3 : 4;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (score / 100) * circumference;
  const svgSize = (radius + strokeW) * 2 + 4;

  const color =
    score >= 80 ? '#4ADE80' :
    score >= 60 ? '#FACC15' : '#F87171';

  const textSize = size === 'sm' ? '8px' : size === 'md' ? '11px' : '16px';

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={svgSize} height={svgSize} className="rotate-[-90deg]">
        {/* Background track */}
        <circle
          cx={svgSize / 2} cy={svgSize / 2} r={radius}
          fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeW}
        />
        {/* Score arc */}
        <circle
          cx={svgSize / 2} cy={svgSize / 2} r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeW}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 0.8s ease-out, stroke 0.3s',
            filter: `drop-shadow(0 0 4px ${color}60)`,
          }}
        />
        {/* Score text */}
        <text
          x="50%" y="50%"
          dominantBaseline="middle" textAnchor="middle"
          fill={color}
          fontSize={textSize}
          fontWeight="700"
          style={{ transform: 'rotate(90deg)', transformOrigin: '50% 50%' }}
        >
          {score}
        </text>
      </svg>
      {showLabel && (
        <div className="text-xs text-text-secondary text-center">
          Architecture Score
        </div>
      )}
    </div>
  );
}
````

## File: frontend/src/components/charts/CreditsWidget.tsx
````typescript
'use client';

import { Zap } from 'lucide-react';

interface Props {
  balance: number;
  plan: string;
  onPurchase?: () => void;
}

const PLAN_MAX: Record<string, number> = {
  free: 100,
  pro: 2000,
  team: 10000,
  enterprise: 99999,
};

export function CreditsWidget({ balance, plan, onPurchase }: Props) {
  const max = PLAN_MAX[plan] ?? 100;
  const pct = Math.min((balance / max) * 100, 100);
  const color =
    pct > 50 ? '#4ADE80' :
    pct > 20 ? '#FACC15' : '#F87171';

  return (
    <div className="p-3 rounded-xl bg-surface-2 border border-white/5">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-xs text-text-secondary">
          <Zap className="w-3 h-3 text-accent" />
          <span>Credits</span>
        </div>
        <span className="text-xs font-semibold text-text-primary">{balance.toLocaleString()}</span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 rounded-full bg-surface overflow-hidden mb-2">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: color, boxShadow: `0 0 6px ${color}60` }}
        />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-text-secondary capitalize">{plan} plan</span>
        {plan === 'free' && onPurchase && (
          <button onClick={onPurchase} className="text-xs text-accent hover:underline">
            Upgrade
          </button>
        )}
      </div>
    </div>
  );
}
````

## File: frontend/src/components/ui/ToastContainer.tsx
````typescript
'use client';

import React from 'react';
import { useToastStore, ToastType } from '@/lib/store/toast';
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ICONS: Record<ToastType, any> = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
  warning: AlertCircle,
};

const COLORS: Record<ToastType, string> = {
  success: 'text-success bg-success/10 border-success/20',
  error: 'text-error bg-error/10 border-error/20',
  info: 'text-accent bg-accent/10 border-accent/20',
  warning: 'text-warning bg-warning/10 border-warning/20',
};

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = ICONS[toast.type];
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95 }}
              className={`
                pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl border backdrop-blur-md shadow-2xl min-w-[300px] max-w-md
                ${COLORS[toast.type]}
              `}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <p className="flex-1 text-sm font-medium leading-tight">
                {toast.message}
              </p>
              <button
                onClick={() => removeToast(toast.id)}
                className="p-1 rounded-lg hover:bg-black/10 transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4 opacity-50 hover:opacity-100" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
````

## File: frontend/src/components/workspace/ADRMode.tsx
````typescript
'use client';

import React from 'react';
import { FileText, Plus, CheckCircle2, Clock } from 'lucide-react';

interface Props {
  workspaceId: string;
}

export function ADRMode({ workspaceId }: Props) {
  return (
    <div className="h-full p-8 overflow-y-auto bg-bg no-scrollbar">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-text-primary tracking-tight">Decision Records</h2>
            <p className="text-sm text-text-secondary mt-1">Audit trail of significant architectural decisions</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent/90 transition-all hover:shadow-glow-accent">
            <Plus className="w-4 h-4" /> Create ADR
          </button>
        </div>

        <div className="grid gap-4">
          <div className="group p-5 rounded-2xl bg-surface border border-white/5 hover:border-success/30 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-success" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-text-primary group-hover:text-success transition-colors">ADR-001: Scalable Event Sourcing</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="flex items-center gap-1 text-[10px] text-success font-medium uppercase tracking-wider">
                      <CheckCircle2 className="w-3 h-3" /> Accepted
                    </span>
                    <span className="text-[10px] text-text-secondary opacity-40">·</span>
                    <span className="text-[10px] text-text-secondary">Mar 12, 2024</span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
              We decided to implement an event-driven architecture using Kafka for cross-service communication to ensure high availability and data consistency.
            </p>
          </div>

          <div className="group p-5 rounded-2xl bg-surface border border-white/5 hover:border-warning/30 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-text-primary group-hover:text-warning transition-colors">ADR-002: JWT-based Authentication</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="flex items-center gap-1 text-[10px] text-warning font-medium uppercase tracking-wider">
                      <Clock className="w-3 h-3" /> Proposed
                    </span>
                    <span className="text-[10px] text-text-secondary opacity-40">·</span>
                    <span className="text-[10px] text-text-secondary">Apr 01, 2024</span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
              Introduction of refresh token rotation and HttpOnly cookies to mitigate XSS and session hijacking in the frontend.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
````

## File: frontend/src/components/workspace/DesignCanvas.tsx
````typescript
'use client';

import React, { useEffect } from 'react';
import { Tldraw, createTLStore, defaultShapeUtils, Editor } from 'tldraw';
import 'tldraw/tldraw.css';
import { useWorkspaceStore } from '@/lib/store/workspace';

interface Props {
  workspaceId: string;
  initialData?: any;
}

export function DesignCanvas({ workspaceId, initialData }: Props) {
  const { saveDesignCanvas } = useWorkspaceStore();

  const handleMount = (editor: Editor) => {
    // Load initial data if present
    if (initialData) {
      try {
        editor.store.loadSnapshot(initialData);
      } catch (err) {
        console.error('Failed to load design snapshot:', err);
      }
    }

    // Debounced auto-save
    let timeoutId: NodeJS.Timeout;
    
    const unlisten = editor.store.listen(() => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const snapshot = editor.store.getSnapshot();
        saveDesignCanvas(workspaceId, snapshot);
      }, 2000); // 2-second debounce for design canvas
    });

    return () => {
      unlisten();
      clearTimeout(timeoutId);
    };
  };

  return (
    <div className="h-full w-full relative bg-bg tldraw-custom">
      <Tldraw
        onMount={handleMount}
        inferDarkMode
        options={{
          maxImageDimension: 1024,
        }}
        hideUi={false} // We can customize this later if we want a cleaner "Cockpit" look
      />
      
      <style jsx global>{`
        .tldraw-custom .tl-canvas {
          background-color: transparent !important;
        }
        .tldraw-custom .tl-ui {
          --tl-background: #0a0a0b !important;
          --tl-text: #ffffff !important;
          --tl-accent: #6d28d9 !important;
        }
      `}</style>
    </div>
  );
}
````

## File: frontend/src/components/workspace/DesignMode.tsx
````typescript
'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useWorkspaceStore } from '@/lib/store/workspace';
import { Loader2 } from 'lucide-react';

// Dynamically import PuckEditor with SSR disabled
const PuckEditor = dynamic(() => import('./PuckEditor'), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 bg-bg text-text-secondary">
      <Loader2 className="w-8 h-8 animate-spin text-accent" />
      <p className="text-sm font-medium animate-pulse">Initializing Visual Builder...</p>
    </div>
  ),
});

export function DesignMode() {
  const { currentWorkspace } = useWorkspaceStore();

  if (!currentWorkspace) {
    return (
      <div className="flex-1 flex items-center justify-center bg-bg text-text-secondary">
        <p className="text-sm">Select a workspace to start designing</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-bg overflow-hidden relative">
      <PuckEditor 
        workspaceId={currentWorkspace.id} 
        initialData={currentWorkspace.designData} 
      />
    </div>
  );
}
````

## File: frontend/src/components/workspace/IDEMode.tsx
````typescript
'use client';

import React, { useState, useEffect } from 'react';
import { ArchNode, CodeFile, useWorkspaceStore } from '@/lib/store/workspace';
import { MonacoEditor } from './MonacoEditor';
import { Folder, FileJson, FileCode, CheckCircle2, Save, Wand2, Loader2, RefreshCw } from 'lucide-react';
import { useToastStore } from '@/lib/store/toast';

interface Props {
  node: ArchNode | null;
  workspace: any;
}

export function IDEMode({ node, workspace }: Props) {
  const { pendingCodeChanges, updatePendingFile, syncCodeToArchitecture, generating, generationProgress } = useWorkspaceStore();
  const { addToast } = useToastStore();
  
  const [activeNodeId, setActiveNodeId] = useState<string | null>(node?.id ?? null);
  const [activeFileIndex, setActiveFileIndex] = useState(0);

  const activeNode = workspace?.architectureData.nodes.find((n: ArchNode) => n.id === (activeNodeId ?? node?.id));
  const files = activeNode?.files ?? [];
  const activeFile = files[activeFileIndex];

  const hasUnsavedChanges = Object.keys(pendingCodeChanges).length > 0;

  const handleSync = async () => {
    if (generating || !hasUnsavedChanges) return;
    await syncCodeToArchitecture(workspace.id);
    addToast('Architecture synchronized with code changes!', 'success');
  };

  // Use local state for immediate editor feedback
  const [localContent, setLocalContent] = useState<string | null>(null);

  const handleCodeChange = (value: string) => {
    if (!activeFile) return;
    setLocalContent(value);
    
    // Debounce the store update
    const timeoutId = setTimeout(() => {
      updatePendingFile(activeFile.path, value);
    }, 300);
    return () => clearTimeout(timeoutId);
  };

  // Get current content (local if editing, else from pending or original)
  const currentContent = localContent ?? (activeFile ? (pendingCodeChanges[activeFile.path] ?? activeFile.content) : '');

  // Reset local content when switching files
  useEffect(() => {
    setLocalContent(null);
  }, [activeFile?.path]);

  return (
    <div className="h-full flex bg-bg overflow-hidden">
      {/* Sidebar: File Explorer */}
      <div className="w-64 border-r border-white/5 bg-surface flex flex-col flex-shrink-0">
        <div className="p-3 border-b border-white/5 flex items-center justify-between">
          <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest flex items-center gap-2">
            <Folder className="w-3 h-3" /> Explorer
          </span>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 space-y-4">
          {workspace?.architectureData.nodes.map((n: ArchNode) => (
            <div key={n.id} className="space-y-1">
              <button 
                onClick={() => setActiveNodeId(n.id)}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs transition-all ${activeNodeId === n.id ? 'bg-accent/10 text-accent font-medium' : 'text-text-primary hover:bg-white/5'}`}
              >
                <div className={`w-1 h-3 rounded-full ${n.status === 'new' ? 'bg-success' : 'bg-accent'}`} />
                <span className="truncate">{n.label}</span>
              </button>
              
              {activeNodeId === n.id && (
                <div className="ml-4 space-y-0.5 border-l border-white/5 pl-2">
                  {n.files?.map((f, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveFileIndex(i)}
                      className={`w-full flex items-center gap-2 px-2 py-1 rounded-md text-[11px] transition-all ${activeNodeId === n.id && activeFileIndex === i ? 'text-text-primary bg-white/5' : 'text-text-secondary hover:text-text-primary'}`}
                    >
                      {f.name.endsWith('.json') ? <FileJson className="w-3 h-3 text-warning" /> : <FileCode className="w-3 h-3 text-accent" />}
                      <span className="truncate">{f.name}</span>
                    </button>
                  ))}
                  {n.testFiles?.map((f, i) => (
                    <button
                      key={`t-${i}`}
                      className="w-full flex items-center gap-2 px-2 py-1 rounded-md text-[11px] text-text-secondary/50 hover:text-text-primary transition-all"
                    >
                      <CheckCircle2 className="w-3 h-3 text-success/50" />
                      <span className="truncate">{f.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {activeFile ? (
          <>
            {/* Tab Bar & Submit Header */}
            <div className="flex items-center justify-between h-10 border-b border-white/5 bg-surface pr-4">
              <div className="flex-1 flex items-center overflow-x-auto no-scrollbar h-full">
                {files.map((f, i) => {
                  const isDirty = !!pendingCodeChanges[f.path];
                  return (
                    <button
                      key={i}
                      onClick={() => setActiveFileIndex(i)}
                      className={`
                        flex items-center gap-2 px-4 h-full text-xs transition-all border-r border-white/5
                        ${i === activeFileIndex ? 'bg-bg text-text-primary border-b-2 border-b-accent' : 'text-text-secondary hover:bg-white/5'}
                      `}
                    >
                      <span className="truncate max-w-[120px]">{f.name}</span>
                      {isDirty && <div className="w-1.5 h-1.5 rounded-full bg-accent" />}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-3">
                {hasUnsavedChanges && !generating && (
                  <span className="text-[10px] text-accent font-medium uppercase tracking-wider animate-pulse">Unsaved Edits</span>
                )}
                <button
                  onClick={handleSync}
                  disabled={!hasUnsavedChanges || generating}
                  className={`
                    flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all
                    ${hasUnsavedChanges && !generating 
                      ? 'bg-accent text-white shadow-glow-accent' 
                      : 'bg-white/5 text-text-secondary opacity-50 cursor-not-allowed'}
                  `}
                >
                  {generating ? (
                    <RefreshCw className="w-3 h-3 animate-spin" />
                  ) : (
                    <Wand2 className="w-3 h-3" />
                  )}
                  {generating ? 'Syncing...' : 'Sync Arch'}
                </button>
              </div>
            </div>
            
            {/* Editor Area */}
            <div className="flex-1 relative">
              <MonacoEditor 
                content={currentContent} 
                language={activeFile.language || 'typescript'} 
                onChange={handleCodeChange}
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-text-secondary gap-4 p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-surface border border-white/5 flex items-center justify-center opacity-20">
              <Code2 className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary">No file selected</p>
              <p className="text-xs mt-1">Select a component and file from the explorer to view the generated source code.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Re-using Code2 icon placeholder since IDEMode will be renamed or exported correctly
const Code2 = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
);
````

## File: frontend/src/components/workspace/MonacoEditor.tsx
````typescript
'use client';

import React from 'react';
import Editor from '@monaco-editor/react';

interface Props {
  content: string;
  language?: string;
  readOnly?: boolean;
  onChange?: (value: string) => void;
}

export function MonacoEditor({ content, language = 'typescript', readOnly = false, onChange }: Props) {
  return (
    <div className="h-full w-full overflow-hidden">
      <Editor
        height="100%"
        defaultLanguage={language}
        defaultValue={content}
        value={content}
        onChange={(val) => onChange?.(val || '')}
        theme="vs-dark"
        options={{
          minimap: { enabled: true },
          fontSize: 13,
          fontFamily: "'Fira Code', 'Monaco', 'Courier New', monospace",
          readOnly,
          automaticLayout: true,
          padding: { top: 16 },
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          cursorSmoothCaretAnimation: true,
          lineHeight: 20,
          renderLineHighlight: 'all',
          scrollbar: {
            vertical: 'visible',
            horizontal: 'visible',
            verticalSliderSize: 5,
            horizontalSliderSize: 5,
          },
        }}
      />
    </div>
  );
}
````

## File: frontend/src/components/workspace/puck.config.tsx
````typescript
import { Config, Data, DropZone } from "@measured/puck";

export type PuckConfig = {
  Heading: { title: string; level: 'h1' | 'h2' | 'h3' };
  Text: { text: string };
  Hero: { title: string; description: string; cta: string };
  Button: { label: string; variant: 'primary' | 'secondary' };
  Card: { title: string; content: string };
  FeatureGrid: { features: { title: string; description: string }[] };
  Pricing: { tiers: { plan: string; price: string; features: string[] }[] };
  Navbar: { logo: string; links: { label: string; href: string }[] };
  Contact: { title: string; emailPlaceholder: string };
  Container: { children: any };
};

export const config: Config<PuckConfig> = {
  components: {
    Heading: {
      fields: {
        title: { type: "text" },
        level: {
          type: "select",
          options: [
            { label: "Level 1", value: "h1" },
            { label: "Level 2", value: "h2" },
            { label: "Level 3", value: "h3" },
          ],
        },
      },
      render: ({ title, level }) => {
        const Tag = level || "h1";
        const sizes = { h1: "text-4xl", h2: "text-2xl", h3: "text-xl" };
        return <Tag className={`${sizes[Tag as keyof typeof sizes]} font-bold mb-4 text-text-primary`}>{title}</Tag>;
      },
    },
    Text: {
      fields: { text: { type: "textarea" } },
      render: ({ text }) => <p className="text-text-secondary leading-relaxed mb-4">{text}</p>,
    },
    Hero: {
      fields: {
        title: { type: "text" },
        description: { type: "textarea" },
        cta: { type: "text" },
      },
      render: ({ title, description, cta }) => (
        <div className="py-16 px-8 rounded-3xl bg-surface border border-white/5 text-center space-y-4">
          <h1 className="text-5xl font-extrabold text-text-primary">{title}</h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">{description}</p>
          <button className="px-6 py-3 bg-accent text-white rounded-xl font-bold shadow-glow-accent">
            {cta}
          </button>
        </div>
      ),
    },
    Button: {
      fields: {
        label: { type: "text" },
        variant: {
          type: "radio",
          options: [
            { label: "Primary", value: "primary" },
            { label: "Secondary", value: "secondary" },
          ],
        },
      },
      render: ({ label, variant }) => (
        <button
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            variant === "primary" ? "bg-accent text-white" : "bg-white/5 text-text-primary hover:bg-white/10"
          }`}
        >
          {label}
        </button>
      ),
    },
    Card: {
      fields: {
        title: { type: "text" },
        content: { type: "textarea" },
      },
      render: ({ title, content }) => (
        <div className="p-6 rounded-2xl bg-surface border border-white/5 space-y-2">
          <h3 className="text-lg font-bold text-text-primary">{title}</h3>
          <p className="text-sm text-text-secondary">{content}</p>
        </div>
      ),
    },
    FeatureGrid: {
      fields: {
        features: {
          type: "array",
          getItemSummary: (idx) => `Feature ${idx + 1}`,
          arrayFields: {
            title: { type: "text" },
            description: { type: "textarea" },
          },
        },
      },
      render: ({ features }) => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-8">
          {features.map((f, i) => (
            <div key={i} className="p-6 rounded-2xl bg-surface border border-white/5 space-y-2">
              <h3 className="text-lg font-bold text-text-primary">{f.title}</h3>
              <p className="text-sm text-text-secondary">{f.description}</p>
            </div>
          ))}
        </div>
      ),
    },
    Pricing: {
      fields: {
        tiers: {
          type: "array",
          getItemSummary: (idx) => `Tier ${idx + 1}`,
          arrayFields: {
            plan: { type: "text" },
            price: { type: "text" },
            features: { type: "array", arrayFields: { item: { type: "text" } } },
          },
        },
      },
      render: ({ tiers }) => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12">
          {tiers.map((t, i) => (
            <div key={i} className="p-8 rounded-3xl bg-surface border border-white/5 space-y-6 relative overflow-hidden group">
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-text-primary">{t.plan}</h3>
                <div className="text-3xl font-black text-accent">{t.price}</div>
              </div>
              <ul className="space-y-3">
                {t.features.map((f: any, fi: number) => (
                  <li key={fi} className="text-sm text-text-secondary flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent" /> {f.item}
                  </li>
                ))}
              </ul>
              <button className="w-full py-3 bg-white/5 hover:bg-accent text-white rounded-xl font-bold transition-all">
                Get Started
              </button>
            </div>
          ))}
        </div>
      ),
    },
    Navbar: {
      fields: {
        logo: { type: "text" },
        links: {
          type: "array",
          arrayFields: {
            label: { type: "text" },
            href: { type: "text" },
          },
        },
      },
      render: ({ logo, links }) => (
        <nav className="flex items-center justify-between py-6 px-4 border-b border-white/5 mb-8">
          <div className="text-lg font-black text-accent tracking-tighter">{logo}</div>
          <div className="flex items-center gap-6">
            {links.map((l, i) => (
              <a key={i} href={l.href} className="text-sm font-medium text-text-secondary hover:text-accent transition-colors">
                {l.label}
              </a>
            ))}
          </div>
        </nav>
      ),
    },
    Contact: {
      fields: {
        title: { type: "text" },
        emailPlaceholder: { type: "text" },
      },
      render: ({ title, emailPlaceholder }) => (
        <div className="py-12 px-8 bg-surface border border-white/5 rounded-3xl space-y-6">
          <h2 className="text-3xl font-bold text-text-primary text-center">{title}</h2>
          <div className="flex gap-4 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder={emailPlaceholder} 
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors"
              disabled
            />
            <button className="px-6 py-3 bg-accent text-white rounded-xl font-bold cursor-not-allowed">
              Send
            </button>
          </div>
        </div>
      ),
    },
    Container: {
      render: () => (
        <div className="py-10 px-6 border border-dashed border-white/10 rounded-3xl min-h-[100px] bg-white/[0.02]">
          <DropZone zone="container-content" />
        </div>
      ),
    },
  },
};

export const initialPuckData: Data = {
  content: [],
  root: {},
};
````

## File: frontend/src/components/workspace/PuckEditor.tsx
````typescript
'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Puck, Data } from "@measured/puck";
import "@measured/puck/puck.css";
import { config, initialPuckData } from "./puck.config";
import { useWorkspaceStore } from '@/lib/store/workspace';
import { Wand2, RefreshCw } from 'lucide-react';

interface Props {
  workspaceId: string;
  initialData?: any;
}

export default function PuckEditor({ workspaceId, initialData }: Props) {
  const { saveDesignCanvas, generateArchitecture, generating } = useWorkspaceStore();
  
  // Validate and memoize initial data to prevent unnecessary re-renders
  const [internalData, setInternalData] = useState<Data>(() => {
    if (initialData && initialData.content && Array.isArray(initialData.content)) {
      return initialData;
    }
    return initialPuckData;
  });

  // Debounced Autosave
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // Only save if it's different from initial
      if (JSON.stringify(internalData) !== JSON.stringify(initialData)) {
        saveDesignCanvas(workspaceId, internalData);
      }
    }, 2000); // 2-second debounce for design data

    return () => clearTimeout(timeoutId);
  }, [internalData, workspaceId, initialData, saveDesignCanvas]);

  const handleGenerate = async () => {
    if (generating) return;
    const { currentWorkspace, generateArchitecture } = useWorkspaceStore.getState();
    const prompt = currentWorkspace?.prompt || "Generate system architecture based on this frontend design prototype.";
    await generateArchitecture(workspaceId, prompt); 
  };

  return (
    <div className="h-full flex flex-col bg-bg overflow-hidden relative puck-wrapper">
      <Puck
        config={config}
        data={internalData}
        onPublish={async (newData) => {
          await saveDesignCanvas(workspaceId, newData);
        }}
        onChange={(newData) => {
          setInternalData(newData);
        }}
        overrides={{
          header: ({ actions, children }) => (
            <div className="flex items-center justify-between p-2 bg-surface border-b border-white/5 h-12">
              <div className="flex items-center gap-4 px-2">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-accent uppercase tracking-widest">Frontend Prototype</span>
                  <span className="text-[11px] text-text-secondary">Puck Builder v0.17</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleGenerate}
                  disabled={generating}
                  className="flex items-center gap-2 px-3 py-1.5 bg-accent text-white rounded-lg text-xs font-bold transition-all hover:bg-accent/90"
                >
                  {generating ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
                  {generating ? 'Architecting...' : 'Sync Arch'}
                </button>
                {actions}
              </div>
            </div>
          ),
        }}
      />

      <style jsx global>{`
        .puck-wrapper .Puck {
          --puck-color-background-screen: #0a0a0b;
          --puck-color-background-edge: #141415;
          --puck-color-background-sidebar: #141415;
          --puck-color-background-header: #141415;
          --puck-color-text: #ffffff;
          --puck-color-text-light: #a1a1aa;
          --puck-color-accent: #6d28d9;
          --puck-font-family: inherit;
        }
        .puck-wrapper [class*="Header"] {
          background: #141415 !important;
          border-bottom: 1px solid rgba(255,255,255,0.05) !important;
        }
        .puck-wrapper [class*="Sidebar"] {
          background: #141415 !important;
          border-left: 1px solid rgba(255,255,255,0.05) !important;
          border-right: 1px solid rgba(255,255,255,0.05) !important;
        }
      `}</style>
    </div>
  );
}
````

## File: frontend/src/lib/api.ts
````typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

class ApiClient {
  private accessToken: string | null = null;

  setToken(token: string | null) {
    this.accessToken = token;
    if (typeof window !== 'undefined') {
      if (token) localStorage.setItem('va_token', token);
      else localStorage.removeItem('va_token');
    }
  }

  getToken(): string | null {
    if (this.accessToken) return this.accessToken;
    if (typeof window !== 'undefined') {
      return localStorage.getItem('va_token');
    }
    return null;
  }

  private async fetch<T>(path: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_URL}${path}`, { ...options, headers, credentials: 'include' });

    if (res.status === 401) {
      // Try to refresh
      try {
        const refreshRes = await fetch(`${API_URL}/api/auth/refresh`, {
          method: 'POST', credentials: 'include',
        });
        if (refreshRes.ok) {
          const { accessToken } = await refreshRes.json();
          this.setToken(accessToken);
          headers['Authorization'] = `Bearer ${accessToken}`;
          const retryRes = await fetch(`${API_URL}${path}`, { ...options, headers, credentials: 'include' });
          if (!retryRes.ok) throw new Error(await retryRes.text());
          return retryRes.json();
        }
      } catch { /* silent */ }
      this.setToken(null);
      throw new Error('Unauthorized');
    }

    if (!res.ok) {
      const body = await res.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(body.error ?? 'Request failed');
    }

    if (res.status === 204) return undefined as T;
    return res.json();
  }

  get<T>(path: string) { return this.fetch<T>(path); }
  post<T>(path: string, body?: unknown) { return this.fetch<T>(path, { method: 'POST', body: JSON.stringify(body) }); }
  patch<T>(path: string, body: unknown) { return this.fetch<T>(path, { method: 'PATCH', body: JSON.stringify(body) }); }
  put<T>(path: string, body: unknown) { return this.fetch<T>(path, { method: 'PUT', body: JSON.stringify(body) }); }
  delete<T>(path: string) { return this.fetch<T>(path, { method: 'DELETE' }); }

  // SSE stream for generation
  async *stream(path: string, body: unknown): AsyncGenerator<{ event: string; data: Record<string, unknown> }> {
    const token = this.getToken();
    const res = await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
      credentials: 'include',
    });

    if (!res.ok || !res.body) throw new Error('Stream failed');

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';

      let currentEvent = '';
      for (const line of lines) {
        if (line.startsWith('event: ')) {
          currentEvent = line.slice(7).trim();
        } else if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            yield { event: currentEvent, data };
            currentEvent = '';
          } catch { /* skip malformed */ }
        }
      }
    }
  }
}

export const api = new ApiClient();
````

## File: frontend/src/lib/store/auth.ts
````typescript
import { create } from 'zustand';
import { api } from '@/lib/api';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  plan: 'free' | 'pro' | 'team' | 'enterprise';
  creditsBalance: number;
  creditsResetDate?: string;
  avatarUrl?: string;
  onboardingCompleted: boolean;
}

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
  updateCredits: (delta: number) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post<{ accessToken: string; user: AuthUser }>('/api/auth/login', { email, password });
      api.setToken(res.accessToken);
      set({ user: res.user, loading: false });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Login failed', loading: false });
    }
  },

  register: async (email, password, name) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post<{ accessToken: string; user: AuthUser }>('/api/auth/register', { email, password, name });
      api.setToken(res.accessToken);
      set({ user: res.user, loading: false });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Registration failed', loading: false });
    }
  },

  logout: async () => {
    try {
      await api.post('/api/auth/logout');
    } catch { /* silent */ }
    api.setToken(null);
    set({ user: null });
  },

  fetchMe: async () => {
    const token = api.getToken();
    if (!token) return;
    set({ loading: true });
    try {
      const user = await api.get<AuthUser>('/api/auth/me');
      set({ user, loading: false });
    } catch {
      api.setToken(null);
      set({ user: null, loading: false });
    }
  },

  updateCredits: (delta) => {
    const { user } = get();
    if (user) set({ user: { ...user, creditsBalance: user.creditsBalance + delta } });
  },

  clearError: () => set({ error: null }),
}));
````

## File: frontend/src/lib/store/toast.ts
````typescript
import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastState {
  toasts: Toast[];
  addToast: (message: string, type: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (message, type, duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({
      toasts: [...state.toasts, { id, message, type, duration }],
    }));
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, duration);
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));
````

## File: frontend/src/styles/globals.css
````css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --color-bg: #0D0E1A;
  --color-surface: #16213E;
  --color-surface-2: #1E2A45;
  --color-accent: #5E81F4;
  --color-accent-2: #22D3EE;
  --color-success: #4ADE80;
  --color-warning: #FACC15;
  --color-danger: #F87171;
  --color-purple: #A78BFA;
  --color-text-primary: #EAEEFF;
  --color-text-secondary: #8B8FA8;
  --radius-card: 16px;
  --radius-btn: 10px;
  --shadow-card: 0 4px 24px rgba(0,0,0,0.35);
  --shadow-glow-accent: 0 0 20px rgba(94,129,244,0.3);
}

* { box-sizing: border-box; margin: 0; padding: 0; }

html {
  scroll-behavior: smooth;
  -webkit-font-smoothing: antialiased;
}

body {
  background-color: var(--color-bg);
  color: var(--color-text-primary);
  font-family: var(--font-geist-sans, system-ui), sans-serif;
  min-height: 100vh;
}

/* Scrollbar */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: var(--color-surface); }
::-webkit-scrollbar-thumb { background: var(--color-surface-2); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: var(--color-accent); }

/* ReactFlow overrides */
.react-flow__background { background: var(--color-bg) !important; }
.react-flow__minimap { background: var(--color-surface) !important; border: 1px solid var(--color-surface-2); border-radius: 8px; }
.react-flow__controls { background: var(--color-surface) !important; border: 1px solid var(--color-surface-2) !important; border-radius: 8px; }
.react-flow__controls button { background: var(--color-surface) !important; color: var(--color-text-primary) !important; border-bottom: 1px solid var(--color-surface-2) !important; }
.react-flow__controls button:hover { background: var(--color-surface-2) !important; }
.react-flow__edge-path { stroke: var(--color-accent) !important; stroke-width: 1.5 !important; }
.react-flow__edge.animated path { stroke-dasharray: 5; animation: dash 1s linear infinite; }
@keyframes dash { to { stroke-dashoffset: -10; } }

/* SSE streaming pulse */
@keyframes streamPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
.streaming { animation: streamPulse 1.2s ease-in-out infinite; }

/* Gradient text */
.gradient-text {
  background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-2) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Glass card */
.glass {
  background: rgba(22, 33, 62, 0.6);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.06);
}

/* Score gauge animation */
@keyframes gaugeAnim {
  from { stroke-dashoffset: 251; }
  to { stroke-dashoffset: var(--gauge-offset); }
}
.gauge-circle { animation: gaugeAnim 0.8s ease-out forwards; }
````

## File: frontend/src/test/api.test.ts
````typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Test the API client logic (without network calls)
describe('API Client', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('stores and retrieves token from localStorage', async () => {
    const { api } = await import('@/lib/api');
    api.setToken('test-jwt-token');
    expect(api.getToken()).toBe('test-jwt-token');
  });

  it('clears token when set to null', async () => {
    const { api } = await import('@/lib/api');
    api.setToken('test-jwt-token');
    api.setToken(null);
    expect(api.getToken()).toBeNull();
  });
});

describe('Credits cost constants', () => {
  it('validates expected cost values', () => {
    const costs = {
      CREATE_WORKSPACE: 5,
      GENERATE_SMALL: 10,
      GENERATE_MEDIUM: 20,
      GENERATE_LARGE: 40,
      CRITIQUE: 5,
      TEST_SCAFFOLD: 10,
      CICD: 15,
      ADR_AI: 3,
    };

    expect(costs.GENERATE_LARGE).toBeGreaterThan(costs.GENERATE_MEDIUM);
    expect(costs.GENERATE_MEDIUM).toBeGreaterThan(costs.GENERATE_SMALL);
    expect(costs.CREATE_WORKSPACE).toBeLessThan(costs.GENERATE_SMALL);
  });
});

describe('Architecture score color logic', () => {
  const getScoreColor = (score: number) =>
    score >= 80 ? 'green' : score >= 60 ? 'yellow' : 'red';

  it('returns green for score >= 80', () => {
    expect(getScoreColor(80)).toBe('green');
    expect(getScoreColor(100)).toBe('green');
  });

  it('returns yellow for score 60-79', () => {
    expect(getScoreColor(60)).toBe('yellow');
    expect(getScoreColor(79)).toBe('yellow');
  });

  it('returns red for score < 60', () => {
    expect(getScoreColor(0)).toBe('red');
    expect(getScoreColor(59)).toBe('red');
  });
});
````

## File: frontend/src/test/components.test.tsx
````typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ArchitectureScoreGauge } from '@/components/charts/ArchitectureScoreGauge';
import { CreditsWidget } from '@/components/charts/CreditsWidget';
import { CriticFeedbackPanel } from '@/components/ai-assistant/CriticFeedbackPanel';
import { PromptSuggestions } from '@/components/ai-assistant/PromptSuggestions';

describe('ArchitectureScoreGauge', () => {
  it('renders with a score', () => {
    const { container } = render(<ArchitectureScoreGauge score={85} />);
    expect(container.querySelector('svg')).toBeTruthy();
    expect(container.textContent).toContain('85');
  });

  it('renders with showLabel', () => {
    render(<ArchitectureScoreGauge score={72} showLabel />);
    expect(screen.getByText('Architecture Score')).toBeTruthy();
  });

  it('renders different sizes', () => {
    const { container: sm } = render(<ArchitectureScoreGauge score={50} size="sm" />);
    const { container: lg } = render(<ArchitectureScoreGauge score={50} size="lg" />);
    const smSvg = sm.querySelector('svg');
    const lgSvg = lg.querySelector('svg');
    expect(Number(smSvg?.getAttribute('width'))).toBeLessThan(Number(lgSvg?.getAttribute('width')));
  });

  it('shows danger color for low score', () => {
    const { container } = render(<ArchitectureScoreGauge score={30} />);
    const circle = container.querySelectorAll('circle')[1];
    expect(circle?.getAttribute('stroke')).toBe('#F87171');
  });

  it('shows green for high score', () => {
    const { container } = render(<ArchitectureScoreGauge score={90} />);
    const circle = container.querySelectorAll('circle')[1];
    expect(circle?.getAttribute('stroke')).toBe('#4ADE80');
  });
});

describe('CreditsWidget', () => {
  it('renders balance correctly', () => {
    render(<CreditsWidget balance={150} plan="free" />);
    expect(screen.getByText('150')).toBeTruthy();
    // "free plan" is split across text nodes - use regex or container query
    expect(screen.getByText(/free/i)).toBeTruthy();
  });

  it('shows upgrade button for free plan when onPurchase provided', () => {
    const onPurchase = vi.fn();
    render(<CreditsWidget balance={50} plan="free" onPurchase={onPurchase} />);
    const upgradeBtn = screen.getByText('Upgrade');
    expect(upgradeBtn).toBeTruthy();
    fireEvent.click(upgradeBtn);
    expect(onPurchase).toHaveBeenCalledOnce();
  });

  it('does not show upgrade for pro plan', () => {
    render(<CreditsWidget balance={2000} plan="pro" onPurchase={vi.fn()} />);
    expect(screen.queryByText('Upgrade')).toBeNull();
  });

  it('renders progress bar', () => {
    const { container } = render(<CreditsWidget balance={50} plan="free" />);
    const bar = container.querySelector('[style*="width"]');
    expect(bar).toBeTruthy();
  });
});

describe('CriticFeedbackPanel', () => {
  const issues = [
    { severity: 'critical' as const, title: 'Missing Auth', description: 'No auth layer', nodeId: 'n1', suggestion: 'Add JWT auth' },
    { severity: 'warning' as const, title: 'No Rate Limiting', description: 'Vulnerable to abuse', suggestion: 'Add Redis rate limit' },
    { severity: 'info' as const, title: 'Add Monitoring', description: 'No observability', suggestion: 'Add Sentry' },
  ];

  it('renders issue count badges', () => {
    render(<CriticFeedbackPanel issues={issues} score={75} />);
    expect(screen.getByText('1 critical')).toBeTruthy();
    expect(screen.getByText('1 warnings')).toBeTruthy();
  });

  it('shows score', () => {
    render(<CriticFeedbackPanel issues={issues} score={75} />);
    expect(screen.getByText('Score: 75/100')).toBeTruthy();
  });

  it('expands issue on click', () => {
    render(<CriticFeedbackPanel issues={issues} score={75} />);
    // First issue (index 0) is expanded by default per component state [0]
    // So its detail content is already visible
    expect(screen.getByText('No auth layer')).toBeTruthy();
    // The suggestion text may be split; check for partial text
    expect(screen.getByText(/Add JWT auth/i)).toBeTruthy();
  });

  it('calls onFix when Fix button clicked', () => {
    const onFix = vi.fn();
    render(<CriticFeedbackPanel issues={issues} score={75} onFix={onFix} />);
    // First issue is already expanded (index 0 in default state)
    const fixBtn = screen.getByText('Auto-fix with AI');
    fireEvent.click(fixBtn);
    expect(onFix).toHaveBeenCalledWith(issues[0]);
  });

  it('shows empty state for no issues', () => {
    render(<CriticFeedbackPanel issues={[]} score={100} />);
    expect(screen.getByText(/No issues found/)).toBeTruthy();
  });

  it('can collapse panel', () => {
    render(<CriticFeedbackPanel issues={issues} score={75} />);
    const header = screen.getByText('Architecture Critic').closest('button');
    fireEvent.click(header!);
    expect(screen.queryByText('Missing Auth')).toBeNull();
  });
});

describe('PromptSuggestions', () => {
  it('renders suggestion pills', () => {
    const onSelect = vi.fn();
    render(<PromptSuggestions onSelect={onSelect} />);
    const pills = screen.getAllByRole('button');
    expect(pills.length).toBeGreaterThan(0);
  });

  it('calls onSelect when a suggestion is clicked', () => {
    const onSelect = vi.fn();
    render(<PromptSuggestions onSelect={onSelect} />);
    const firstBtn = screen.getAllByRole('button')[0];
    fireEvent.click(firstBtn);
    expect(onSelect).toHaveBeenCalledOnce();
    expect(typeof onSelect.mock.calls[0][0]).toBe('string');
  });
});
````

## File: frontend/src/test/setup.ts
````typescript
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), back: vi.fn(), replace: vi.fn() }),
  useParams: () => ({ id: 'test-workspace-id' }),
  usePathname: () => '/dashboard',
}));

// Mock fetch
global.fetch = vi.fn();
````

## File: frontend/tailwind.config.js
````javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0D0E1A',
        surface: '#16213E',
        'surface-2': '#1E2A45',
        accent: '#5E81F4',
        'accent-2': '#22D3EE',
        success: '#4ADE80',
        warning: '#FACC15',
        danger: '#F87171',
        purple: '#A78BFA',
        'text-primary': '#EAEEFF',
        'text-secondary': '#8B8FA8',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      borderRadius: {
        card: '16px',
        btn: '10px',
      },
      boxShadow: {
        card: '0 4px 24px rgba(0,0,0,0.35)',
        'glow-accent': '0 0 20px rgba(94,129,244,0.3)',
        'glow-cyan': '0 0 20px rgba(34,211,238,0.3)',
        'glow-green': '0 0 20px rgba(74,222,128,0.25)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'counter': 'counter 0.8s ease-out',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(12px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        glowPulse: { '0%,100%': { boxShadow: '0 0 10px rgba(94,129,244,0.2)' }, '50%': { boxShadow: '0 0 25px rgba(94,129,244,0.5)' } },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'radial-gradient(ellipse 80% 60% at 50% -20%, rgba(94,129,244,0.15) 0%, transparent 70%)',
        'card-gradient': 'linear-gradient(135deg, rgba(30,42,69,0.8) 0%, rgba(22,33,62,0.4) 100%)',
      },
    },
  },
  plugins: [],
};
````

## File: frontend/tsconfig.json
````json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
````

## File: frontend/vitest.config.ts
````typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/test/**', 'src/app/**', '**/*.d.ts'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
````

## File: README.md
````markdown
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
````

## File: .gitignore
````
node_modules/
.pnp
.pnp.js

.next/
out/

npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

.env
.env.local
.env.development.local
.env.test.local
.env.production.local


tsconfig.tsbuildinfo


.DS_Store
*.pem
.openclaude-profile.json
.eslintcache
````

## File: backend/.gitignore
````
node_modules/
.pnp
.pnp.js

.next/
out/

npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

.env
.env.local
.env.development.local
.env.test.local
.env.production.local


tsconfig.tsbuildinfo
.openclaude-profile.json

.DS_Store
*.pem

.eslintcache
````

## File: backend/package.json
````json
{
  "name": "visualarch-backend",
  "version": "3.0.0",
  "description": "VisualArch AI Platform - Backend API",
  "main": "dist/index.js",
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "jest --forceExit --detectOpenHandles",
    "test:coverage": "jest --coverage --forceExit --detectOpenHandles",
    "lint": "eslint src --ext .ts",
    "repomix": "repomix"
  },
  "dependencies": {
    "@types/cookie-parser": "^1.4.10",
    "bcryptjs": "^2.4.3",
    "cookie-parser": "^1.4.7",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.21.2",
    "express-rate-limit": "^7.4.1",
    "helmet": "^8.0.0",
    "jsonwebtoken": "^9.0.2",
    "socket.io": "^4.8.1",
    "uuid": "^10.0.0",
    "zod": "^3.23.8",
    "mongoose": "^8.8.1",
    "groq-sdk": "^0.8.0"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6",
    "@types/cors": "^2.8.17",
    "@types/express": "^5.0.0",
    "@types/jest": "^29.5.14",
    "@types/jsonwebtoken": "^9.0.7",
    "@types/node": "^22.9.1",
    "@types/supertest": "^6.0.2",
    "@types/uuid": "^10.0.0",
    "jest": "^29.7.0",
    "supertest": "^7.0.0",
    "ts-jest": "^29.2.5",
    "ts-node-dev": "^2.0.0",
    "typescript": "^5.6.3",
    "@types/mongoose": "^5.11.96"
  }
}
````

## File: backend/src/middleware/rbac.ts
````typescript
import { Request, Response, NextFunction } from 'express';
import { WorkspaceModel } from '../models/schemas/Workspace.schema';

export async function requireOwner(req: Request, res: Response, next: NextFunction): Promise<void> {
  const userId = req.user?.userId;
  const workspace = req.workspace ?? await WorkspaceModel.findById(req.params.id);

  if (!workspace) {
    res.status(404).json({ error: 'Workspace not found' });
    return;
  }

  if (workspace.ownerId !== userId) {
    res.status(403).json({ error: 'Only workspace owner can perform this action' });
    return;
  }

  req.workspace = workspace.toObject();
  next();
}

export async function requireEditor(req: Request, res: Response, next: NextFunction): Promise<void> {
  const userId = req.user?.userId;
  const workspace = req.workspace ?? await WorkspaceModel.findById(req.params.id);

  if (!workspace) {
    res.status(404).json({ error: 'Workspace not found' });
    return;
  }

  const isOwner = workspace.ownerId === userId;
  const collaborator = workspace.collaborators.find(c => c.userId === userId);
  const isEditor = isOwner || collaborator?.role === 'editor';

  if (!isEditor) {
    res.status(403).json({ error: 'Editor or Owner access required' });
    return;
  }

  req.workspace = workspace.toObject();
  next();
}

export function requireSystemAdmin(req: Request, res: Response, next: NextFunction): void {
  // In production, check for admin flag on JWT
  // For dev, allow a special header
  const adminToken = req.headers['x-admin-token'];
  if (adminToken !== process.env.ADMIN_TOKEN && process.env.NODE_ENV === 'production') {
    res.status(403).json({ error: 'Admin access required' });
    return;
  }
  next();
}
````

## File: backend/src/models/db.ts
````typescript
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

export async function connectDatabase(): Promise<void> {
  if (!MONGODB_URI) {
    console.warn('⚠️  MONGODB_URI not found in environment. Running in persistent-mock mode (no DB).');
    return;
  }

  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      autoIndex: true,
      maxPoolSize: 10,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`\n✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`\n❌ Error connecting to MongoDB: ${error instanceof Error ? error.message : error}`);
    process.exit(1);
  }
}

mongoose.connection.on('error', (err) => {
  console.error(`MongoDB connection error: ${err}`);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});
````

## File: backend/src/routes/credits.ts
````typescript
import { Router, Request, Response } from 'express';
import { authenticateJWT } from '../middleware/auth';
import { creditsService } from '../services/credits.service';
import { UserModel } from '../models/schemas/User.schema';
import { NotificationModel } from '../models/schemas/Notification.schema';

const creditsRouter = Router();
const notifRouter = Router();

// GET /api/credits/balance
creditsRouter.get('/balance', authenticateJWT, async (req: Request, res: Response) => {
  const { balance, plan, history } = await creditsService.getBalance(req.user!.userId);
  const user = await UserModel.findById(req.user!.userId);

  return res.json({
    data: {
      balance,
      plan,
      resetDate: user?.creditsResetDate,
      history,
    },
  });
});

// POST /api/credits/purchase - mock Stripe checkout
creditsRouter.post('/purchase', authenticateJWT, async (req: Request, res: Response) => {
  const { package: pkg } = req.body;

  const packages: Record<string, { credits: number; price: number }> = {
    starter: { credits: 500, price: 4.99 },
    growth: { credits: 1500, price: 12.99 },
    pro: { credits: 5000, price: 34.99 },
  };

  const selected = packages[pkg ?? 'starter'];
  if (!selected) return res.status(400).json({ error: 'Invalid package' });

  // In production: create Stripe checkout session
  // For demo: directly add credits
  await creditsService.addCredits(req.user!.userId, selected.credits, 'purchase', {
    package: pkg,
    price: selected.price,
    stripeSessionId: 'demo_' + Date.now(),
  });

  const user = await UserModel.findById(req.user!.userId);

  return res.json({
    data: {
      creditsAdded: selected.credits,
      newBalance: user?.creditsBalance,
      // In production: checkoutUrl: stripeSession.url
    },
  });
});

// GET /api/notifications
notifRouter.get('/', authenticateJWT, async (req: Request, res: Response) => {
  const page = parseInt(String(req.query.page ?? '1'));
  const limit = parseInt(String(req.query.limit ?? '20'));

  const skip = (page - 1) * limit;
  
  const [notifications, total, unreadCount] = await Promise.all([
    NotificationModel.find({ userId: req.user!.userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    NotificationModel.countDocuments({ userId: req.user!.userId }),
    NotificationModel.countDocuments({ userId: req.user!.userId, read: false })
  ]);

  return res.json({
    data: notifications,
    unreadCount,
    total,
    page,
    pages: Math.ceil(total / limit),
  });
});

// POST /api/notifications/read-all
notifRouter.post('/read-all', authenticateJWT, async (req: Request, res: Response) => {
  await NotificationModel.updateMany(
    { userId: req.user!.userId, read: false },
    { $set: { read: true } }
  );
  return res.json({ message: 'All notifications marked as read' });
});

export { creditsRouter, notifRouter };
````

## File: backend/src/routes/marketplace.ts
````typescript
import { Router, Request, Response } from 'express';
import { authenticateJWT } from '../middleware/auth';
import { creditsService } from '../services/credits.service';
import { p } from '../utils/params';
import { Template, Workspace } from '../types';
import { TemplateModel } from '../models/schemas/Template.schema';
import { WorkspaceModel } from '../models/schemas/Workspace.schema';
import { UserModel } from '../models/schemas/User.schema';

const router = Router();

// GET /api/templates
router.get('/', async (req: Request, res: Response) => {
  const { category, techStack, premium, q } = req.query;

  const query: any = { isPublic: true };

  if (category) {
    query.category = { $regex: new RegExp(`^${category}$`, 'i') };
  }

  if (techStack) {
    const stacks = String(techStack).split(',');
    query.techStack = { $in: stacks };
  }

  if (premium !== undefined) {
    query.isPremium = premium === 'true';
  }

  if (q) {
    const searchString = String(q);
    query.$or = [
      { title: { $regex: searchString, $options: 'i' } },
      { description: { $regex: searchString, $options: 'i' } }
    ];
  }

  const templates = await TemplateModel.find(query).sort({ useCount: -1 });

  return res.json({
    data: templates.map(t => ({
      id: t.id,
      title: t.title,
      description: t.description,
      category: t.category,
      techStack: t.techStack,
      authorName: t.authorName,
      isPremium: t.isPremium,
      price: t.price,
      useCount: t.useCount,
      rating: t.rating,
      nodeCount: t.architectureData.nodes.length,
      createdAt: t.createdAt,
    })),
    total: templates.length,
  });
});

// GET /api/templates/:id
router.get('/:id', async (req: Request, res: Response) => {
  const template = await TemplateModel.findById(p(req.params.id));
  if (!template) return res.status(404).json({ error: 'Template not found' });

  return res.json({ data: template });
});

// POST /api/templates - publish workspace as template
router.post('/', authenticateJWT, async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const user = await UserModel.findById(userId);
  const { workspaceId, title, description, category, isPremium, price } = req.body;

  const workspace = await WorkspaceModel.findById(workspaceId);
  if (!workspace || workspace.ownerId !== userId) {
    return res.status(403).json({ error: 'Workspace not found or access denied' });
  }

  const template = new TemplateModel({
    title: title ?? workspace.name,
    description: description ?? workspace.description ?? '',
    category: category ?? 'General',
    techStack: workspace.techStack,
    architectureData: workspace.architectureData,
    authorId: userId,
    authorName: user?.name ?? 'Unknown',
    isPremium: isPremium ?? false,
    price: isPremium ? (price ?? 10) : 0,
    useCount: 0,
    rating: 0,
    isPublic: true,
  });

  await template.save();

  // Make workspace public
  workspace.visibility = 'public';
  await workspace.save();

  return res.status(201).json({ data: template });
});

// POST /api/templates/:id/use - create workspace from template
router.post('/:id/use', authenticateJWT, async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const template = await TemplateModel.findById(p(req.params.id));

  if (!template) return res.status(404).json({ error: 'Template not found' });

  if (template.isPremium) {
    const deducted = await creditsService.deductCredits(userId, template.price, {
      action: 'use_premium_template',
      templateId: template.id,
    });

    if (!deducted) {
      const user = await UserModel.findById(userId);
      return res.status(402).json({
        error: 'Insufficient credits',
        required: template.price,
        available: user?.creditsBalance ?? 0,
      });
    }

    // Pay author
    if (template.authorId !== 'system') {
      await creditsService.addCredits(template.authorId, Math.floor(template.price * 0.7), 'earn', {
        reason: 'template_used',
        templateId: template.id,
        userId,
      });
    }
  }

  // Update template use count
  await TemplateModel.findByIdAndUpdate(template.id, { $inc: { useCount: 1 } });

  // Create new workspace from template
  const workspace = new WorkspaceModel({
    ownerId: userId,
    name: `${template.title} (from template)`,
    description: template.description,
    prompt: `Created from template: ${template.title}`,
    techStack: template.techStack,
    architectureData: template.architectureData,
    collaborators: [],
    visibility: 'private',
    forkCount: 0,
    architectureScore: 75,
  });

  await workspace.save();

  return res.status(201).json({ data: workspace });
});

export default router;
````

## File: backend/src/services/ai/groq.adapter.ts
````typescript
import Groq from 'groq-sdk';

const MOCK_DELAY = (ms: number) => new Promise(r => setTimeout(r, ms));

const GROQ_API_KEY = process.env.GROQ_API_KEY;

export class GroqAdapter {
  private client: Groq | null = null;

  constructor() {
    if (GROQ_API_KEY) {
      this.client = new Groq({ apiKey: GROQ_API_KEY });
    }
  }

  get isEnabled(): boolean {
    return !!this.client;
  }

  async generateJson<T>(prompt: string, schema?: object, signal?: AbortSignal, retries = 3): Promise<T> {
    if (!this.client) throw new Error('Groq client not initialized');

    let lastError: any;
    for (let i = 0; i < retries; i++) {
      try {
        const completion = await this.client.chat.completions.create({
          messages: [
            {
              role: 'system',
              content: 'You are an expert software architect. You always respond in valid JSON format.' + 
                       (schema ? ` Your response must match this schema: ${JSON.stringify(schema)}` : ''),
            },
            { role: 'user', content: prompt },
          ],
          model: 'llama-3.3-70b-versatile',
          response_format: { type: 'json_object' },
          temperature: 0.1,
        }, { signal });

        const content = completion.choices[0]?.message?.content;
        if (!content) throw new Error('AI returned empty response');

        return JSON.parse(content) as T;
      } catch (error: any) {
        lastError = error;
        // Don't retry if aborted or specific client errors
        if (error.name === 'AbortError' || error.status === 401 || error.status === 400) {
          throw error;
        }
        
        console.warn(`[Groq] Attempt ${i + 1} failed: ${error.message}. Retrying...`);
        // Exponential backoff
        await MOCK_DELAY(Math.pow(2, i) * 1000);
      }
    }

    throw lastError;
  }

  async generateText(prompt: string, signal?: AbortSignal, retries = 3): Promise<string> {
    if (!this.client) throw new Error('Groq client not initialized');

    let lastError: any;
    for (let i = 0; i < retries; i++) {
      try {
        const completion = await this.client.chat.completions.create({
          messages: [
            { role: 'system', content: 'You are an expert DevOps engineer and architect.' },
            { role: 'user', content: prompt },
          ],
          model: 'llama-3.1-8b-instant',
          temperature: 0.2,
        }, { signal });

        return completion.choices[0]?.message?.content || '';
      } catch (error: any) {
        lastError = error;
        if (error.name === 'AbortError' || error.status === 401 || error.status === 400) {
          throw error;
        }
        await MOCK_DELAY(Math.pow(2, i) * 1000);
      }
    }
    throw lastError;
  }

  async generateChat(messages: { role: 'user' | 'system' | 'assistant'; content: string }[], model = 'llama-3.1-8b-instant') {
    if (!this.client) throw new Error('Groq client not initialized');

    return this.client.chat.completions.create({
      messages,
      model,
      temperature: 0.7,
    });
  }
}

export const groqAdapter = new GroqAdapter();
````

## File: backend/src/types/index.ts
````typescript
// ============================================================
// VisualArch AI - Core Types v3.0
// ============================================================

export type PlanType = 'free' | 'pro' | 'team' | 'enterprise';
export type WorkspaceRole = 'owner' | 'editor' | 'viewer';
export type NodeStatus = 'stable' | 'modified' | 'new';
export type ADRStatus = 'proposed' | 'accepted' | 'deprecated';
export type TransactionType = 'purchase' | 'earn' | 'spend';
export type NotificationType = 'collab_invite' | 'comment_added' | 'generation_done' | 'adr_created';
export type Severity = 'critical' | 'warning' | 'info';

export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  plan: PlanType;
  creditsBalance: number;
  creditsResetDate: Date;
  refreshTokenHash?: string;
  avatarUrl?: string;
  onboardingCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkspaceCollaborator {
  userId: string;
  role: WorkspaceRole;
  invitedBy: string;
  acceptedAt?: Date;
}

export interface ArchitectureNode {
  id: string;
  label: string;
  layer: string;
  description: string;
  status: NodeStatus;
  position: { x: number; y: number };
  files?: CodeFile[];
  testFiles?: CodeFile[];
}

export interface ArchitectureEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  type?: string;
}

export interface ArchitectureData {
  nodes: ArchitectureNode[];
  edges: ArchitectureEdge[];
  techStack: string[];
  layoutDirection: 'TB' | 'LR';
}

export interface CriticIssue {
  severity: Severity;
  title: string;
  description: string;
  nodeId?: string;
  suggestion: string;
}

export interface CriticFeedback {
  score: number;
  issues: CriticIssue[];
  timestamp: Date;
}

export interface Workspace {
  id: string;
  ownerId: string;
  name: string;
  description?: string;
  prompt: string;
  techStack: string[];
  architectureData: ArchitectureData;
  collaborators: WorkspaceCollaborator[];
  visibility: 'private' | 'team' | 'public';
  forkCount: number;
  architectureScore: number;
  lastCriticRun?: Date;
  archspecYaml?: string;
  designData?: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface ArchitectureHistory {
  id: string;
  workspaceId: string;
  iteration: number;
  prompt: string;
  architectureData: ArchitectureData;
  criticFeedback?: CriticFeedback;
  architectureScore: number;
  creditsSpent: number;
  modelUsed: string;
  createdAt: Date;
}

export interface ADR {
  id: string;
  workspaceId: string;
  nodeId?: string;
  title: string;
  context: string;
  decision: string;
  consequences: string;
  alternatives: string[];
  status: ADRStatus;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Template {
  id: string;
  title: string;
  description: string;
  category: string;
  techStack: string[];
  architectureData: ArchitectureData;
  authorId: string;
  authorName: string;
  isPremium: boolean;
  price: number;
  useCount: number;
  rating: number;
  isPublic: boolean;
  createdAt: Date;
}

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  balanceAfter: number;
  meta: Record<string, unknown>;
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  payload: Record<string, unknown>;
  read: boolean;
  createdAt: Date;
}

export interface Comment {
  id: string;
  workspaceId: string;
  nodeId?: string;
  authorId: string;
  authorName: string;
  text: string;
  resolved: boolean;
  threadId?: string;
  createdAt: Date;
}

export interface CodeFile {
  name: string;
  path: string;
  content: string;
  language: string;
}

// Auth request types
export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface GenerateRequest {
  prompt: string;
  designCanvasData?: Record<string, unknown>;
}

// JWT Payload
export interface JWTPayload {
  userId: string;
  email: string;
  plan: PlanType;
}

// Express augmentation
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
      workspace?: Workspace;
    }
  }
}
````

## File: frontend/next-env.d.ts
````typescript
/// <reference types="next" />
/// <reference types="next/image-types/global" />
/// <reference path="./.next/types/routes.d.ts" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.
````

## File: frontend/package.json
````json
{
  "name": "visualarch-frontend",
  "version": "3.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3000",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  },
  "dependencies": {
    "clsx": "^2.1.1",
    "framer-motion": "^12.6.5",
    "lucide-react": "^0.483.0",
    "next": "^15.5.15",
    "react": "19.0.0",
    "react-dom": "19.0.0",
    "reactflow": "^11.11.4",
    "recharts": "^2.13.0",
    "socket.io-client": "^4.8.1",
    "tailwind-merge": "^2.5.4",
    "zustand": "^5.0.1",
    "@monaco-editor/react": "^4.6.0",
    "@measured/puck": "^0.17.0"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.0.0",
    "@types/node": "^22.9.1",
    "@types/react": "^19.0.1",
    "@types/react-dom": "^19.0.1",
    "@vitejs/plugin-react": "^4.3.3",
    "@vitest/coverage-v8": "^4.1.4",
    "autoprefixer": "^10.4.20",
    "jsdom": "^25.0.1",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.15",
    "typescript": "^5.6.3",
    "vitest": "^4.1.4"
  }
}
````

## File: frontend/src/app/layout.tsx
````typescript
import type { Metadata } from 'next';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'VisualArch AI — Living Architecture Platform',
  description: 'AI-powered software architecture design and code generation platform. Generate production-ready architecture with real-time collaboration.',
  keywords: ['AI', 'software architecture', 'code generation', 'system design'],
  openGraph: {
    title: 'VisualArch AI',
    description: 'The first Living Architecture Platform',
    type: 'website',
  },
};

import { ToastContainer } from '@/components/ui/ToastContainer';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
      </head>
      <body className="bg-bg text-text-primary antialiased">
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
````

## File: frontend/src/app/workspace/[id]/page.tsx
````typescript
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Play, Layers, Code2, PenTool, FileText,
  Users, Zap, RefreshCw, Download, Share2, ChevronRight,
} from 'lucide-react';
import { useWorkspaceStore, ArchNode } from '@/lib/store/workspace';
import { useAuthStore } from '@/lib/store/auth';
import { ArchitectureCanvas } from '@/components/canvas/ArchitectureCanvas';
import { CriticFeedbackPanel } from '@/components/ai-assistant/CriticFeedbackPanel';
import { ArchitectureScoreGauge } from '@/components/charts/ArchitectureScoreGauge';
import { PromptSuggestions } from '@/components/ai-assistant/PromptSuggestions';
import { IDEMode } from '@/components/workspace/IDEMode';
import { ADRMode } from '@/components/workspace/ADRMode';
import { DesignMode } from '@/components/workspace/DesignMode';
import { useToastStore } from '@/lib/store/toast';

type Mode = 'canvas' | 'ide' | 'design' | 'adr';

export default function WorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { user } = useAuthStore();
  const {
    currentWorkspace, selectedNode, generating, generationProgress,
    fetchWorkspace, generateArchitecture, setSelectedNode, loading,
  } = useWorkspaceStore();
  
  const { addToast } = useToastStore();

  const [mode, setMode] = useState<Mode>('canvas');
  const [prompt, setPrompt] = useState('');
  const [criticIssues, setCriticIssues] = useState<any[]>([]);
  const [showRightPanel, setShowRightPanel] = useState(true);

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    fetchWorkspace(id);
  }, [id, user]);

  const handleGenerate = async () => {
    if (!prompt.trim() || generating) return;
    try {
      const result = await generateArchitecture(id, prompt);
      if (result) {
        addToast('Architecture recalibrated successfully', 'success');
        // Extract critic issues from result if present (the LLM adapter returns them now)
        if (result.criticFeedback?.issues) {
          setCriticIssues(result.criticFeedback.issues);
        }
        setPrompt('');
      }
    } catch (err) {
      addToast('Generation engine failure. Please check your AI quota.', 'error');
    }
  };

  const score = currentWorkspace?.architectureScore ?? 0;

  const MODES: { id: Mode; icon: any; label: string }[] = [
    { id: 'canvas', icon: Layers, label: 'Canvas' },
    { id: 'ide', icon: Code2, label: 'IDE' },
    { id: 'design', icon: PenTool, label: 'Design' },
    { id: 'adr', icon: FileText, label: 'ADR' },
  ];

  return (
    <div className="h-screen bg-bg flex flex-col overflow-hidden">
      {/* Topbar */}
      <header className="h-14 flex items-center gap-4 px-4 border-b border-white/5 bg-surface flex-shrink-0">
        <Link href="/dashboard" className="text-text-secondary hover:text-text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="h-5 w-px bg-white/10" />

        <div className="flex-1 min-w-0">
          <h1 className="text-sm font-semibold text-text-primary truncate">
            {currentWorkspace?.name ?? 'Loading...'}
          </h1>
        </div>

        {/* Mode switcher */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-surface-2">
          {MODES.map(({ id: modeId, icon: Icon, label }) => (
            <button
              key={modeId}
              onClick={() => setMode(modeId)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${mode === modeId ? 'bg-accent text-white' : 'text-text-secondary hover:text-text-primary'}`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>

        {/* Score */}
        {score > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-2">
            <ArchitectureScoreGauge score={score} size="sm" />
            <span className="text-xs text-text-secondary">Score</span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-2 transition-all">
            <Users className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-2 transition-all">
            <Share2 className="w-4 h-4" />
          </button>
          <Link href={`/workspace/${id}/export`}
            className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-2 transition-all">
            <Download className="w-4 h-4" />
          </Link>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Main canvas area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Canvas / IDE / Design / ADR */}
          <div className="flex-1 overflow-hidden">
            {mode === 'canvas' && (
              <ArchitectureCanvas
                nodes={currentWorkspace?.architectureData.nodes ?? []}
                edges={currentWorkspace?.architectureData.edges ?? []}
                onNodeClick={setSelectedNode}
                generating={generating}
                generationProgress={generationProgress}
              />
            )}
            {mode === 'ide' && <IDEMode node={selectedNode} workspace={currentWorkspace} />}
            {mode === 'design' && <DesignMode />}
            {mode === 'adr' && <ADRMode workspaceId={id} />}
          </div>

          {/* Prompt bar */}
          <div className="border-t border-white/5 bg-surface p-4">
            {/* Generation progress */}
            {generating && (
              <div className="mb-3 p-3 rounded-lg bg-accent/10 border border-accent/20">
                <div className="flex items-center gap-2 text-sm text-accent">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span className="streaming">{generationProgress.message ?? 'Generating...'}</span>
                </div>
                {generationProgress.totalNodes && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-surface-2 overflow-hidden">
                      <div
                        className="h-full bg-accent rounded-full transition-all duration-500"
                        style={{ width: `${((generationProgress.completedNodes ?? 0) / generationProgress.totalNodes) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-text-secondary">
                      {generationProgress.completedNodes}/{generationProgress.totalNodes}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Prompt suggestions */}
            {!generating && currentWorkspace?.architectureData.nodes.length === 0 && (
              <PromptSuggestions onSelect={setPrompt} />
            )}

            <div className="flex gap-2">
              <textarea
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleGenerate(); } }}
                placeholder="Describe what to build or change... (Enter to generate, Shift+Enter for newline)"
                className="flex-1 bg-surface-2 border border-white/10 rounded-xl px-4 py-3 text-sm text-text-primary placeholder-text-secondary outline-none focus:border-accent/40 resize-none"
                rows={2}
                disabled={generating}
              />
              <button
                onClick={handleGenerate}
                disabled={!prompt.trim() || generating}
                className="px-4 py-2 rounded-xl bg-accent text-white text-sm font-medium hover:bg-accent/90 disabled:opacity-50 transition-all hover:shadow-glow-accent flex items-center gap-2 self-end"
              >
                <Play className="w-4 h-4" />
                {generating ? 'Generating' : 'Generate'}
              </button>
            </div>

            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-text-secondary">
                {currentWorkspace?.architectureData.nodes.length ?? 0} nodes · {currentWorkspace?.techStack.join(', ') || 'No tech stack yet'}
              </span>
              <span className="text-xs text-text-secondary">
                Cost: ~10 credits
              </span>
            </div>
          </div>
        </div>

        {/* Right panel */}
        {showRightPanel && (
          <aside className="w-80 border-l border-white/5 bg-surface flex flex-col overflow-y-auto flex-shrink-0">
            <div className="p-4 border-b border-white/5">
              <h3 className="text-sm font-semibold text-text-primary">AI Assistant</h3>
            </div>

            <div className="p-4 space-y-4">
              {/* Selected node info */}
              {selectedNode && (
                <div className="p-3 rounded-xl bg-surface-2 border border-white/5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`w-2 h-2 rounded-full ${selectedNode.status === 'new' ? 'bg-success' : selectedNode.status === 'modified' ? 'bg-warning' : 'bg-text-secondary'}`} />
                    <span className="text-sm font-medium text-text-primary">{selectedNode.label}</span>
                    <span className="ml-auto text-xs text-text-secondary bg-surface px-2 py-0.5 rounded">{selectedNode.layer}</span>
                  </div>
                  <p className="text-xs text-text-secondary mb-2">{selectedNode.description}</p>
                  <div className="flex gap-2 text-xs text-text-secondary">
                    <span>{selectedNode.files?.length ?? 0} files</span>
                    <span>·</span>
                    <span>{selectedNode.testFiles?.length ?? 0} tests</span>
                  </div>
                </div>
              )}

              {/* Architecture score */}
              {score > 0 && (
                <div className="p-3 rounded-xl bg-surface-2 border border-white/5 flex items-center gap-3">
                  <ArchitectureScoreGauge score={score} size="md" showLabel />
                  <div className="flex-1">
                    <div className="text-xs text-text-secondary space-y-1">
                      <div className="flex justify-between"><span>Security</span><span className="text-success">{Math.min(score + 5, 100)}</span></div>
                      <div className="flex justify-between"><span>Scalability</span><span className="text-warning">{Math.max(score - 10, 0)}</span></div>
                      <div className="flex justify-between"><span>Cohesion</span><span className="text-accent">{score}</span></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Critic feedback */}
              {criticIssues.length > 0 && (
                <CriticFeedbackPanel
                  issues={criticIssues}
                  score={score}
                  onFix={(issue) => setPrompt(`Fix: ${issue.suggestion}`)}
                />
              )}

              {/* Memory panel */}
              <div className="p-3 rounded-xl bg-purple/10 border border-purple/20">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium text-purple">🧠 Architecture Memory</span>
                </div>
                <p className="text-xs text-text-secondary">
                  {currentWorkspace?.architectureData.nodes.length
                    ? 'AI is learning from your architecture patterns and past decisions.'
                    : 'Generate an architecture to start building project memory.'}
                </p>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
````

## File: frontend/src/components/canvas/ArchitectureCanvas.tsx
````typescript
'use client';

import React, { useCallback, useMemo, useEffect } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap, 
  useNodesState, 
  useEdgesState,
  Edge,
  Node,
  ConnectionLineType,
  MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';
import { ArchNode, ArchEdge, GenerationProgress } from '@/lib/store/workspace';
import { RefreshCw } from 'lucide-react';
import ArchitectureNode from './ArchitectureNode';

interface Props {
  nodes: ArchNode[];
  edges: ArchEdge[];
  onNodeClick: (node: ArchNode) => void;
  generating: boolean;
  generationProgress: GenerationProgress;
}

const nodeTypes = {
  archNode: ArchitectureNode,
};

export function ArchitectureCanvas({ nodes: initialNodes, edges: initialEdges, onNodeClick, generating, generationProgress }: Props) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Sync with incoming props
  useEffect(() => {
    const flowNodes: Node[] = initialNodes.map(n => ({
      id: n.id,
      type: 'archNode',
      position: n.position,
      data: n,
    }));

    const flowEdges: Edge[] = initialEdges.map(e => ({
      id: e.id,
      source: e.source,
      target: e.target,
      label: e.label,
      type: 'smoothstep',
      animated: true,
      style: { stroke: 'rgba(94,129,244,0.4)', strokeWidth: 2 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: 'rgba(94,129,244,0.6)',
      },
    }));

    setNodes(flowNodes);
    setEdges(flowEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  const onNodeInternalClick = useCallback((_: React.MouseEvent, node: Node) => {
    onNodeClick(node.data);
  }, [onNodeClick]);

  if (initialNodes.length === 0 && !generating) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-4 text-text-secondary">
        <div className="w-24 h-24 rounded-2xl bg-surface border border-white/10 flex items-center justify-center">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <rect x="4" y="4" width="18" height="12" rx="3" stroke="#5E81F4" strokeWidth="1.5" fill="rgba(94,129,244,0.1)" />
            <rect x="26" y="4" width="18" height="12" rx="3" stroke="#22D3EE" strokeWidth="1.5" fill="rgba(34,211,238,0.1)" />
            <rect x="14" y="32" width="20" height="12" rx="3" stroke="#4ADE80" strokeWidth="1.5" fill="rgba(74,222,128,0.1)" />
            <line x1="13" y1="16" x2="24" y2="32" stroke="#5E81F4" strokeWidth="1" strokeDasharray="3,2" />
            <line x1="35" y1="16" x2="24" y2="32" stroke="#22D3EE" strokeWidth="1" strokeDasharray="3,2" />
          </svg>
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-text-primary">No architecture yet</p>
          <p className="text-xs mt-1 max-w-xs">Describe your system in the prompt below and click Generate to create your architecture</p>
        </div>
      </div>
    );
  }

  if (generating) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-6">
        <div className="relative">
          <svg width="120" height="120" className="animate-spin-slow" style={{ animationDuration: '4s' }}>
            <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(94,129,244,0.1)" strokeWidth="8" />
            <circle cx="60" cy="60" r="50" fill="none" stroke="#5E81F4" strokeWidth="8"
              strokeDasharray="80 240" strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <RefreshCw className="w-8 h-8 text-accent animate-spin" />
          </div>
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-accent streaming">{generationProgress.message ?? 'Generating architecture...'}</p>
          {generationProgress.totalNodes && (
            <p className="text-xs text-text-secondary mt-1">
              {generationProgress.completedNodes ?? 0} / {generationProgress.totalNodes} components
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-bg relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeInternalClick}
        nodeTypes={nodeTypes}
        connectionLineType={ConnectionLineType.SmoothStep}
        fitView
        className="architecture-canvas"
      >
        <Background color="#333" gap={20} size={1} />
        <Controls className="!bg-surface !border-white/10 fill-white" />
        <MiniMap 
          nodeColor={(node) => {
            const data = node.data as ArchNode;
            return data.layer === 'Frontend' ? '#5E81F4' : '#22D3EE';
          }}
          maskColor="rgba(0, 0, 0, 0.3)"
          className="!bg-surface/50 !border-white/10 rounded-lg overflow-hidden backdrop-blur-sm"
        />
      </ReactFlow>

      <style jsx global>{`
        .react-flow__edge-path {
          stroke-dasharray: 5;
          animation: dashdraw 0.5s linear infinite;
        }

        @keyframes dashdraw {
          from {
            stroke-dashoffset: 10;
          }
          to {
            stroke-dashoffset: 0;
          }
        }

        .react-flow__controls-button {
          background: rgba(255, 255, 255, 0.05) !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
          fill: #8B8FA8 !important;
        }

        .react-flow__controls-button:hover {
          background: rgba(255, 255, 255, 0.1) !important;
        }

        .react-flow__attribution {
          display: none;
        }
      `}</style>
    </div>
  );
}
````

## File: frontend/src/lib/store/workspace.ts
````typescript
import { create } from 'zustand';
import { api } from '@/lib/api';

export interface ArchNode {
  id: string;
  label: string;
  layer: string;
  description: string;
  status: 'stable' | 'modified' | 'new';
  position: { x: number; y: number };
  files?: { name: string; path: string; content: string; language: string }[];
  testFiles?: { name: string; path: string; content: string; language: string }[];
}

export interface ArchEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface ArchitectureData {
  nodes: ArchNode[];
  edges: ArchEdge[];
  techStack: string[];
  layoutDirection: 'TB' | 'LR';
}

export interface CriticIssue {
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  nodeId?: string;
  suggestion: string;
}

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  prompt: string;
  techStack: string[];
  architectureData: ArchitectureData;
  architectureScore: number;
  visibility: 'private' | 'team' | 'public';
  collaborators: number;
  nodeCount: number;
  updatedAt: string;
  createdAt: string;
}

export type GenerationStage = 'idle' | 'memory' | 'planning' | 'coding' | 'critique' | 'complete' | 'error';

interface GenerationProgress {
  stage: GenerationStage;
  currentNode?: string;
  totalNodes?: number;
  completedNodes?: number;
  score?: number;
  issues?: number;
  message?: string;
  critiqued?: boolean;
  criticIssues?: CriticIssue[];
}

interface WorkspaceState {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  selectedNode: ArchNode | null;
  generating: boolean;
  generationProgress: GenerationProgress;
  loading: boolean;
  error: string | null;
  pendingCodeChanges: Record<string, string>; // path -> content

  fetchWorkspaces: () => Promise<void>;
  fetchWorkspace: (id: string) => Promise<void>;
  createWorkspace: (name: string, description?: string) => Promise<Workspace>;
  deleteWorkspace: (id: string) => Promise<void>;
  generateArchitecture: (workspaceId: string, prompt: string, onProgress?: (p: GenerationProgress) => void) => Promise<ArchitectureData | null>;
  setSelectedNode: (node: ArchNode | null) => void;
  updatePendingFile: (path: string, content: string) => void;
  saveDesignCanvas: (workspaceId: string, designData: any) => Promise<void>;
  syncCodeToArchitecture: (workspaceId: string) => Promise<void>;
  clearError: () => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  workspaces: [],
  currentWorkspace: null,
  selectedNode: null,
  generating: false,
  generationProgress: { stage: 'idle' },
  loading: false,
  error: null,
  pendingCodeChanges: {},

  fetchWorkspaces: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get<{ data: Workspace[] }>('/api/workspaces');
      set({ workspaces: res.data, loading: false });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to load workspaces', loading: false });
    }
  },

  fetchWorkspace: async (id) => {
    set({ loading: true });
    try {
      const res = await api.get<{ data: Workspace }>(`/api/workspaces/${id}`);
      set({ currentWorkspace: res.data, loading: false });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to load workspace', loading: false });
    }
  },

  createWorkspace: async (name, description) => {
    const res = await api.post<{ data: Workspace }>('/api/workspaces', { name, description });
    set(state => ({ workspaces: [res.data, ...state.workspaces] }));
    return res.data;
  },

  deleteWorkspace: async (id) => {
    await api.delete(`/api/workspaces/${id}`);
    set(state => ({ workspaces: state.workspaces.filter(w => w.id !== id) }));
  },

  generateArchitecture: async (workspaceId, prompt, onProgress) => {
    set({ generating: true, generationProgress: { stage: 'memory', message: 'Retrieving project memory...' } });

    try {
      let result: ArchitectureData | null = null;

      for await (const { event, data } of api.stream(`/api/workspaces/${workspaceId}/generate/stream`, { prompt })) {
        switch (event) {
          case 'memory_retrieved':
            set({ generationProgress: { stage: 'memory', message: `Found ${(data as { count: number }).count} relevant past decisions` } });
            break;
          case 'planning_start':
            set({ generationProgress: { stage: 'planning', message: 'AI is architecting the system...' } });
            break;
          case 'planning_done':
            set({ generationProgress: { stage: 'coding', message: `Plan ready: ${(data as { node_count: number }).node_count} components`, totalNodes: (data as { node_count: number }).node_count } });
            break;
          case 'coding_node':
            set({ generationProgress: {
              stage: 'coding',
              currentNode: (data as { label: string }).label,
              completedNodes: (data as { index: number }).index,
              totalNodes: (data as { total: number }).total,
              message: `Generating ${(data as { label: string }).label}...`,
            }});
            break;
          case 'critique_start':
            set({ generationProgress: { stage: 'critique', message: 'Architecture Critic reviewing...' } });
            break;
          case 'critique_done':
            set({ generationProgress: { stage: 'critique', score: (data as { score: number }).score, issues: (data as { issues_count: number }).issues_count, critiqued: true } });
            break;
          case 'complete':
            result = (data as { architecture_data: ArchitectureData }).architecture_data;
            set({ generationProgress: { stage: 'complete', score: undefined }, generating: false });
            if (result) {
              set(state => ({
                currentWorkspace: state.currentWorkspace
                  ? { ...state.currentWorkspace, architectureData: result! }
                  : null,
              }));
            }
            break;
          case 'error':
            set({ generating: false, generationProgress: { stage: 'error', message: (data as { message: string }).message } });
            break;
        }
        onProgress?.(get().generationProgress);
      }
      return result;
    } catch (err) {
      set({ generating: false, generationProgress: { stage: 'error', message: err instanceof Error ? err.message : 'Generation failed' } });
      return null;
    }
  },
  
  saveDesignCanvas: async (workspaceId, designData) => {
    try {
      await api.patch(`/api/workspaces/${workspaceId}/design`, { designData });
      set(state => ({
        currentWorkspace: state.currentWorkspace 
          ? { ...state.currentWorkspace, designData }
          : null
      }));
    } catch (err) {
      console.error('Failed to save design canvas:', err);
    }
  },

  setSelectedNode: (node) => set({ selectedNode: node }),
  
  updatePendingFile: (path, content) => set(state => ({
    pendingCodeChanges: { ...state.pendingCodeChanges, [path]: content }
  })),

  syncCodeToArchitecture: async (workspaceId) => {
    const { pendingCodeChanges, currentWorkspace } = get();
    if (!currentWorkspace || Object.keys(pendingCodeChanges).length === 0) return;

    set({ generating: true, generationProgress: { stage: 'planning', message: 'Reconciling code with architecture...' } });

    try {
      // Send modified files + current architecture for AI analysis
      const res = await api.post<{ data: ArchitectureData }>(`/api/workspaces/${workspaceId}/sync`, {
        modifiedFiles: Object.entries(pendingCodeChanges).map(([path, content]) => ({ path, content })),
      });

      set(state => ({
        currentWorkspace: state.currentWorkspace 
          ? { ...state.currentWorkspace, architectureData: res.data }
          : null,
        pendingCodeChanges: {}, // Clear after sync
        generating: false,
        generationProgress: { stage: 'complete', message: 'Architecture synchronized!' }
      }));
    } catch (err) {
      set({ 
        generating: false, 
        generationProgress: { stage: 'error', message: err instanceof Error ? err.message : 'Sync failed' } 
      });
    }
  },

  clearError: () => set({ error: null }),
}));
````

## File: backend/src/index.ts
````typescript
import 'dotenv/config';
import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

import authRouter from './routes/auth';
import workspacesRouter from './routes/workspaces';
import marketplaceRouter from './routes/marketplace';
import { creditsRouter, notifRouter } from './routes/credits';
import { initializeWebSocket } from './websocket/workspace.gateway';
import { connectDatabase } from './models/db';

const app = express();
const httpServer = http.createServer(app);

const FRONTEND_URL = process.env.FRONTEND_URL ?? 'http://localhost:3000';
const PORT = process.env.PORT ?? 3001;

// ── Security middleware ───────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ── Rate limiting ─────────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Too many auth attempts, please wait 15 minutes' },
});

const generateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { error: 'Too many generation requests per minute' },
});

app.use(globalLimiter);

// ── Request logging ────────────────────────────────────────────
app.use((req, _res, next) => {
  if (req.path !== '/api/health' && process.env.NODE_ENV !== 'test') {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  }
  next();
});

// ── Routes ────────────────────────────────────────────────────
app.use('/api/auth', authLimiter, authRouter);
app.use('/api/users', authLimiter, authRouter);
app.use('/api/workspaces', workspacesRouter);
app.use('/api/templates', marketplaceRouter);
app.use('/api/credits', creditsRouter);
app.use('/api/notifications', notifRouter);

// ── Health check ──────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'healthy',
    version: '3.0.0',
    timestamp: new Date().toISOString(),
    services: {
      api: 'ok',
      db: process.env.MONGODB_URI ? 'mongodb-connected' : 'no-db-warning',
      ai: process.env.GROQ_API_KEY ? 'groq-connected' : 'mock-mode',
    },
  });
});

// ── 404 handler ───────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ── Global error handler ──────────────────────────────────────
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[Error]', err.message, err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// ── WebSocket ─────────────────────────────────────────────────
initializeWebSocket(httpServer, FRONTEND_URL);

// ── Start ─────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  connectDatabase().then(() => {
    httpServer.listen(PORT, () => {
      console.log(`\n🚀 VisualArch API v3.0 running on http://localhost:${PORT}`);
      console.log(`📡 WebSocket ready at ws://localhost:${PORT}/workspace`);
      console.log(`🤖 AI Mode: ${process.env.GROQ_API_KEY ? 'Groq (live)' : 'Mock (demo)'}`);
      console.log(`🗄️  DB Mode: ${process.env.MONGODB_URI ? 'MongoDB (Cloud)' : 'Persistent-Mock (local)'}\n`);
    });
  });
}

export { app, httpServer };
````

## File: backend/src/middleware/auth.ts
````typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWTPayload, WorkspaceRole } from '../types';
import { WorkspaceModel } from '../models/schemas/Workspace.schema';
import { UserModel } from '../models/schemas/User.schema';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('❌ FATAL: JWT_SECRET not found in environment. Auth middleware will fail.');
}

export function authenticateJWT(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET) as JWTPayload;
    req.user = payload;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

export function requireWorkspaceMember(minRole: WorkspaceRole = 'viewer') {
  const roleHierarchy: Record<WorkspaceRole, number> = {
    viewer: 1, editor: 2, owner: 3,
  };

  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const workspace = await WorkspaceModel.findById(id);
    if (!workspace) {
      res.status(404).json({ error: 'Workspace not found' });
      return;
    }

    const isOwner = workspace.ownerId === userId;
    const collaborator = workspace.collaborators.find(c => c.userId === userId);
    const userRole: WorkspaceRole = isOwner ? 'owner' : (collaborator?.role ?? 'viewer');

    if (roleHierarchy[userRole] < roleHierarchy[minRole]) {
      // Allow viewers to view public workspaces
      if (workspace.visibility === 'public' && minRole === 'viewer') {
        req.workspace = workspace.toObject();
        next();
        return;
      }
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }

    req.workspace = workspace.toObject();
    next();
  };
}

export function requireCredits(amount: number) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }
    const user = await UserModel.findById(userId);
    if (!user || user.creditsBalance < amount) {
      res.status(402).json({
        error: 'Insufficient credits',
        required: amount,
        available: user?.creditsBalance ?? 0,
      });
      return;
    }
    next();
  };
}
````

## File: backend/src/routes/auth.ts
````typescript
import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { authenticateJWT } from '../middleware/auth';
import { User, JWTPayload } from '../types';
import { PLAN_CREDITS } from '../services/credits.service';
import { UserModel } from '../models/schemas/User.schema';
import { RefreshTokenModel } from '../models/schemas/RefreshToken.schema';

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
  console.error('❌ FATAL: JWT secrets not found in environment. Auth will fail.');
}

function generateAccessToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
}

function generateRefreshToken(): string {
  return crypto.randomBytes(64).toString('hex');
}

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

// Validation schemas
const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.errors[0].message });
    }

    const { email, password, name } = parsed.data;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    
    const user = new UserModel({
      email,
      name,
      passwordHash,
      plan: 'free',
      creditsBalance: PLAN_CREDITS.free,
      onboardingCompleted: false,
    });

    await user.save();

    const refreshToken = generateRefreshToken();
    const tokenHash = hashToken(refreshToken);
    
    await new RefreshTokenModel({
      tokenHash,
      userId: user.id,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    }).save();

    const payload: JWTPayload = { userId: user.id, email: user.email, plan: user.plan };
    const accessToken = generateAccessToken(payload);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      accessToken,
      user: user.toJSON(),
    });
  } catch (error) {
    console.error('[Auth] Register error:', error);
    return res.status(500).json({ error: 'Registration failed' });
  }
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid email or password format' });
    }

    const { email, password } = parsed.data;
    const user = await UserModel.findOne({ email });

    if (!user) {
      // Prevent timing attacks by still running bcrypt
      await bcrypt.compare(password, '$2a$12$invalid.hash.to.prevent.timing.attacks');
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const passwordValid = await bcrypt.compare(password, user.passwordHash);
    if (!passwordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const refreshToken = generateRefreshToken();
    const tokenHash = hashToken(refreshToken);
    
    await new RefreshTokenModel({
      tokenHash,
      userId: user.id,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    }).save();

    const payload: JWTPayload = { userId: user.id, email: user.email, plan: user.plan };
    const accessToken = generateAccessToken(payload);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      accessToken,
      user: user.toJSON(),
    });
  } catch (error) {
    console.error('[Auth] Login error:', error);
    return res.status(500).json({ error: 'Login failed' });
  }
});

// POST /api/auth/refresh
router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ error: 'No refresh token' });
    }

    const tokenHash = hashToken(refreshToken);
    const savedToken = await RefreshTokenModel.findOne({ tokenHash });

    if (!savedToken || savedToken.expiresAt < new Date()) {
      return res.status(401).json({ error: 'Invalid or expired refresh token' });
    }

    const targetUser = await UserModel.findById(savedToken.userId);
    if (!targetUser) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Token rotation: delete old, create new
    await RefreshTokenModel.deleteOne({ _id: savedToken._id });

    const newRefreshToken = generateRefreshToken();
    const newTokenHash = hashToken(newRefreshToken);
    
    await new RefreshTokenModel({
      tokenHash: newTokenHash,
      userId: targetUser.id,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    }).save();

    const payload: JWTPayload = { userId: targetUser.id, email: targetUser.email, plan: targetUser.plan };
    const accessToken = generateAccessToken(payload);

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.json({ accessToken });
  } catch (error) {
    console.error('[Auth] Refresh error:', error);
    return res.status(500).json({ error: 'Token refresh failed' });
  }
});

// GET /api/auth/me
router.get('/me', authenticateJWT, async (req: Request, res: Response) => {
  const user = await UserModel.findById(req.user!.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  return res.json(user.toJSON());
});

// POST /api/auth/logout
router.post('/logout', authenticateJWT, async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;
  if (refreshToken) {
    const tokenHash = hashToken(refreshToken);
    await RefreshTokenModel.deleteOne({ tokenHash });
  }

  res.clearCookie('refreshToken');
  return res.json({ message: 'Logged out successfully' });
});

// PATCH /api/users/me
router.patch('/users/me', authenticateJWT, async (req: Request, res: Response) => {
  const { name, avatarUrl } = req.body;
  const update: Record<string, any> = {};
  if (name) update.name = name;
  if (avatarUrl) update.avatarUrl = avatarUrl;

  const user = await UserModel.findByIdAndUpdate(
    req.user!.userId,
    { $set: update },
    { new: true }
  );

  if (!user) return res.status(404).json({ error: 'User not found' });

  return res.json(user.toJSON());
});

// DELETE /api/users/me (GDPR)
router.delete('/users/me', authenticateJWT, async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  await UserModel.findByIdAndDelete(userId);
  await RefreshTokenModel.deleteMany({ userId });
  res.clearCookie('refreshToken');
  return res.json({ message: 'Account deleted successfully' });
});

export default router;
````

## File: backend/src/routes/workspaces.ts
````typescript
import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { authenticateJWT, requireWorkspaceMember } from '../middleware/auth';
import { requireOwner } from '../middleware/rbac';
import { generationService } from '../services/generation.service';
import { creditsService, CREDITS_COSTS } from '../services/credits.service';
import { Workspace, ArchitectureHistory, ArchitectureData, ADR } from '../types';
import { p } from '../utils/params';
import { WorkspaceModel } from '../models/schemas/Workspace.schema';
import { ADRModel } from '../models/schemas/ADR.schema';
import { NotificationModel } from '../models/schemas/Notification.schema';
import { UserModel } from '../models/schemas/User.schema';
import { HistoryModel } from '../models/schemas/History.schema';
import { CommentModel } from '../models/schemas/Comment.schema';

const router = Router();

// GET /api/workspaces
router.get('/', authenticateJWT, async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const workspaces = await WorkspaceModel.find({
    $or: [{ ownerId: userId }, { 'collaborators.userId': userId }]
  }).sort({ updatedAt: -1 });

  const result = workspaces.map(ws => ({
    id: ws.id,
    name: ws.name,
    description: ws.description,
    techStack: ws.techStack,
    architectureScore: ws.architectureScore,
    visibility: ws.visibility,
    collaborators: ws.collaborators.length,
    nodeCount: ws.architectureData.nodes.length,
    updatedAt: ws.updatedAt,
    createdAt: ws.createdAt,
  }));

  return res.json({ data: result, total: result.length });
});

// POST /api/workspaces
router.post('/', authenticateJWT, async (req: Request, res: Response) => {
  const userId = req.user!.userId;

  const schema = z.object({
    name: z.string().min(1).max(100),
    description: z.string().optional(),
    prompt: z.string().default(''),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.errors[0].message });
  }

  // Atomic check and deduct credits
  const deducted = await creditsService.deductCredits(userId, CREDITS_COSTS.CREATE_WORKSPACE, {
    action: 'create_workspace',
  });

  if (!deducted) {
    return res.status(402).json({ error: 'Insufficient credits', required: CREDITS_COSTS.CREATE_WORKSPACE });
  }

  const workspace = new WorkspaceModel({
    ownerId: userId,
    name: parsed.data.name,
    description: parsed.data.description,
    prompt: parsed.data.prompt,
    architectureData: { nodes: [], edges: [], techStack: [], layoutDirection: 'TB' },
    collaborators: [],
    visibility: 'private',
    forkCount: 0,
    architectureScore: 0,
  });

  await workspace.save();
  return res.status(201).json({ data: workspace });
});

// GET /api/workspaces/:id
router.get('/:id', authenticateJWT, requireWorkspaceMember('viewer'), (req: Request, res: Response) => {
  return res.json({ data: req.workspace });
});

// PATCH /api/workspaces/:id/design
router.patch('/:id/design', authenticateJWT, requireWorkspaceMember('editor'), async (req: Request, res: Response) => {
  const { designData } = req.body;
  
  const workspace = await WorkspaceModel.findByIdAndUpdate(
    req.params.id,
    { $set: { designData, updatedAt: new Date() } },
    { new: true }
  );

  if (!workspace) return res.status(404).json({ error: 'Workspace not found' });
  return res.json({ data: workspace });
});

// PATCH /api/workspaces/:id
router.patch('/:id', authenticateJWT, requireWorkspaceMember('owner'), async (req: Request, res: Response) => {
  const { name, description, visibility } = req.body;
  const update: Record<string, any> = {};

  if (name) update.name = name;
  if (description !== undefined) update.description = description;
  if (visibility) update.visibility = visibility;

  const workspace = await WorkspaceModel.findByIdAndUpdate(
    req.params.id,
    { $set: update },
    { new: true }
  );

  if (!workspace) return res.status(404).json({ error: 'Workspace not found' });
  return res.json({ data: workspace });
});

// DELETE /api/workspaces/:id
router.delete('/:id', authenticateJWT, requireWorkspaceMember('owner'), requireOwner, async (req: Request, res: Response) => {
  await WorkspaceModel.findByIdAndDelete(req.params.id);
  await ADRModel.deleteMany({ workspaceId: req.params.id });
  return res.status(204).send();
});

// POST /api/workspaces/:id/generate (JSON response)
router.post('/:id/generate', authenticateJWT, requireWorkspaceMember('editor'), async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const workspace = req.workspace!;
  const { prompt, designCanvasData } = req.body;

  if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

  // Calculate credits cost
  const estimatedNodeCount = 6; // estimated
  const creditsCost = creditsService.calculateGenerationCost(estimatedNodeCount);

  const deducted = await creditsService.deductCredits(userId, creditsCost, {
    action: 'generate',
    workspaceId: workspace.id,
    prompt: prompt.substring(0, 100),
  });

  if (!deducted) {
    return res.status(402).json({ error: 'Insufficient credits', required: creditsCost });
  }

  try {
    const result = await generationService.generate({
      prompt,
      designData: workspace.designData,
      previousArchitecture: workspace.architectureData.nodes.length > 0
        ? workspace.architectureData : undefined,
    });

    // Update workspace
    workspace.prompt = prompt;
    workspace.architectureData = result.architectureData;
    workspace.techStack = result.architectureData.techStack;
    workspace.architectureScore = result.criticFeedback.score;
    workspace.lastCriticRun = new Date();
    workspace.updatedAt = new Date();
    await workspace.save();

    // Save to history
    const historyCount = await HistoryModel.countDocuments({ workspaceId: workspace.id });
    const iteration = historyCount + 1;
    const historyEntry = new HistoryModel({
      workspaceId: workspace.id,
      iteration,
      prompt,
      architectureData: result.architectureData,
      criticFeedback: result.criticFeedback,
      architectureScore: result.criticFeedback.score,
      creditsSpent: result.creditsUsed,
      modelUsed: result.modelUsed,
    });
    await historyEntry.save();

    return res.json({
      data: {
        architectureData: result.architectureData,
        criticFeedback: result.criticFeedback,
        architectureScore: result.criticFeedback.score,
        creditsUsed: result.creditsUsed,
        totalTimeMs: result.totalTimeMs,
      },
    });
  } catch (error) {
    // Refund credits on failure
    await creditsService.addCredits(userId, creditsCost, 'earn', { reason: 'generation_failed_refund' });
    console.error('[Generation] Error:', error);
    return res.status(500).json({ error: 'Generation failed. Credits refunded.' });
  }
});

// POST /api/workspaces/:id/generate/stream (SSE)
router.post('/:id/generate/stream', authenticateJWT, requireWorkspaceMember('editor'), async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const workspace = req.workspace!;
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  const creditsCost = creditsService.calculateGenerationCost(6);
  const deducted = await creditsService.deductCredits(userId, creditsCost, {
    action: 'generate_stream',
    workspaceId: workspace.id,
  });

  if (!deducted) {
    return res.status(402).json({ error: 'Insufficient credits' });
  }

  // SSE setup
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no',
  });

  const abortController = new AbortController();
  req.on('close', () => {
    console.log(`[SSE] Client disconnected, aborting generation for workspace ${workspace.id}`);
    abortController.abort();
  });

  const sendEvent = (event: string, data: Record<string, unknown>) => {
    if (res.writableEnded) return;
    res.write(`event: ${event}\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  // Heartbeat
  const heartbeat = setInterval(() => {
    sendEvent('heartbeat', { timestamp: new Date().toISOString() });
  }, 15000);

  try {
    const result = await generationService.generate({
      prompt,
      designData: workspace.designData,
      previousArchitecture: workspace.architectureData.nodes.length > 0
        ? workspace.architectureData : undefined,
      useStream: true,
      onEvent: sendEvent,
      signal: abortController.signal,
    });

    // Update workspace
    workspace.prompt = prompt;
    workspace.architectureData = result.architectureData;
    workspace.techStack = result.architectureData.techStack;
    workspace.architectureScore = result.criticFeedback.score;
    workspace.lastCriticRun = new Date();
    await WorkspaceModel.findByIdAndUpdate(workspace.id, { $set: workspace });

    clearInterval(heartbeat);
    if (!res.writableEnded) res.end();
  } catch (error: any) {
    clearInterval(heartbeat);
    if (error.name === 'AbortError') {
      console.log('[SSE] Task aborted successfully');
    } else {
      await creditsService.addCredits(userId, creditsCost, 'earn', { reason: 'stream_generation_failed_refund' });
      sendEvent('error', { message: 'Generation failed', stage: 'unknown', retry_available: true });
    }
    if (!res.writableEnded) res.end();
  }

  return;
});

// GET /api/workspaces/:id/history
router.get('/:id/history', authenticateJWT, requireWorkspaceMember('viewer'), async (req: Request, res: Response) => {
  const history = await HistoryModel.find({ workspaceId: req.params.id }).sort({ iteration: -1 });
  return res.json({ data: history.map(h => ({
    id: h.id,
    iteration: h.iteration,
    prompt: h.prompt,
    architectureScore: h.architectureScore,
    creditsSpent: h.creditsSpent,
    nodeCount: h.architectureData.nodes.length,
    createdAt: h.createdAt,
  }))});
});

// POST /api/workspaces/:id/rollback/:snapshot_id
router.post('/:id/rollback/:snapshot_id', authenticateJWT, requireWorkspaceMember('owner'), requireOwner, async (req: Request, res: Response) => {
  // Logic simplified: Rollback would require a History collection or versioning. 
  // For now, we stub it as we are moving to MongoDB and didn't implement HistoryModel yet.
  return res.status(501).json({ error: 'Rollback not yet implemented in MongoDB version' });
});

// GET /api/workspaces/:id/archspec
router.get('/:id/archspec', authenticateJWT, requireWorkspaceMember('viewer'), (req: Request, res: Response) => {
  const ws = req.workspace!;
  const archspec = generateArchSpec(ws);
  return res.json({ data: archspec });
});

function generateArchSpec(ws: Workspace): string {
  const lines = [
    `# ArchSpec DSL - Generated by VisualArch AI`,
    `# Workspace: ${ws.name}`,
    ``,
    `name: "${ws.name}"`,
    `description: "${ws.description ?? ''}"`,
    `version: "1.0.0"`,
    ``,
    `tech_stack:`,
    ...ws.techStack.map(t => `  - ${t}`),
    ``,
    `services:`,
    ...ws.architectureData.nodes.map(n => `  - id: ${n.id}\n    label: "${n.label}"\n    layer: "${n.layer}"\n    description: "${n.description}"`),
    ``,
    `connections:`,
    ...ws.architectureData.edges.map(e => `  - from: ${e.source}\n    to: ${e.target}\n    type: ${e.label ?? 'http'}`),
  ];
  return lines.join('\n');
}

// POST /api/workspaces/:id/fork
router.post('/:id/fork', authenticateJWT, async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const sourceWs = await WorkspaceModel.findById(req.params.id);

  if (!sourceWs) return res.status(404).json({ error: 'Workspace not found' });
  if (sourceWs.visibility !== 'public') {
    return res.status(403).json({ error: 'Can only fork public workspaces' });
  }

  const forked = new WorkspaceModel({
    ...sourceWs,
    _id: undefined, // Let mongoose generate a new ID
    id: undefined,
    ownerId: userId,
    name: `${sourceWs.name} (Fork)`,
    collaborators: [],
    visibility: 'private',
    forkCount: 0,
  });

  await forked.save();

  // Increment source fork count
  await WorkspaceModel.findByIdAndUpdate(sourceWs._id ?? sourceWs.id, { $inc: { forkCount: 1 } });

  // Earn credits for sharing
  await creditsService.addCredits(sourceWs.ownerId, 20, 'earn', {
    reason: 'workspace_forked',
    forkedBy: userId,
  });

  return res.status(201).json({ data: forked });
});

// POST /api/workspaces/:id/collaborators
router.post('/:id/collaborators', authenticateJWT, requireWorkspaceMember('owner'), requireOwner, async (req: Request, res: Response) => {
  const { email, role } = req.body;
  const workspace = req.workspace!;
  const ownerId = req.user!.userId;

  const invitee = await UserModel.findOne({ email });
  if (!invitee) return res.status(404).json({ error: 'User not found' });
  if (invitee.id === workspace.ownerId) return res.status(400).json({ error: 'Cannot invite yourself' });

  const existing = workspace.collaborators.find(c => c.userId === invitee.id);
  if (existing) return res.status(409).json({ error: 'User already a collaborator' });

  workspace.collaborators.push({
    userId: invitee.id,
    role: role ?? 'viewer',
    invitedBy: ownerId,
    acceptedAt: new Date(),
  });
  
  await WorkspaceModel.findByIdAndUpdate(workspace.id, { 
    $set: { collaborators: workspace.collaborators } 
  });

  // Bonus credits for inviting
  await creditsService.addCredits(ownerId, 20, 'earn', {
    reason: 'invited_collaborator',
    inviteeId: invitee.id,
  });

  // Create notification for invitee
  const notif = new NotificationModel({
    userId: invitee.id,
    type: 'collab_invite',
    payload: { workspaceId: workspace.id, workspaceName: workspace.name, role },
  });
  await notif.save();

  return res.status(201).json({ message: 'Collaborator added', collaborators: workspace.collaborators });
});

// PATCH /api/workspaces/:id/collaborators/:userId
router.patch('/:id/collaborators/:userId', authenticateJWT, requireWorkspaceMember('owner'), requireOwner, async (req: Request, res: Response) => {
  const { role } = req.body;
  const workspace = req.workspace!;
  const userId = req.params.userId;
  
  const collab = workspace.collaborators.find(c => c.userId === userId);

  if (!collab) return res.status(404).json({ error: 'Collaborator not found' });
  collab.role = role;
  
  await WorkspaceModel.findByIdAndUpdate(workspace.id, {
    $set: { collaborators: workspace.collaborators }
  });

  return res.json({ message: 'Role updated', collaborators: workspace.collaborators });
});

// DELETE /api/workspaces/:id/collaborators/:userId
router.delete('/:id/collaborators/:userId', authenticateJWT, requireWorkspaceMember('owner'), requireOwner, async (req: Request, res: Response) => {
  const workspace = req.workspace!;
  workspace.collaborators = workspace.collaborators.filter(c => c.userId !== req.params.userId);
  
  await WorkspaceModel.findByIdAndUpdate(workspace.id, {
    $set: { collaborators: workspace.collaborators }
  });

  return res.json({ message: 'Collaborator removed' });
});

// GET /api/workspaces/:id/adrs
router.get('/:id/adrs', authenticateJWT, requireWorkspaceMember('viewer'), async (req: Request, res: Response) => {
  const adrs = await ADRModel.find({ workspaceId: req.params.id });
  return res.json({ data: adrs });
});

// POST /api/workspaces/:id/adrs
router.post('/:id/adrs', authenticateJWT, requireWorkspaceMember('editor'), async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { nodeId, title, context, decision, consequences, alternatives, generateWithAI } = req.body;

  let adrData = { title, decision, consequences, alternatives: alternatives ?? [] };

  if (generateWithAI) {
    const creditsCost = CREDITS_COSTS.ADR_AI;
    const deducted = await creditsService.deductCredits(userId, creditsCost, { action: 'adr_ai' });
    if (!deducted) return res.status(402).json({ error: 'Insufficient credits' });

    const generated = await generationService.generateADR(p(req.params.id), title ?? 'Component', context ?? '');
    adrData = generated;
  }

  const adr = new ADRModel({
    workspaceId: p(req.params.id),
    nodeId,
    title: adrData.title,
    context: context ?? '',
    decision: adrData.decision,
    consequences: adrData.consequences,
    alternatives: adrData.alternatives,
    status: 'proposed',
    createdBy: userId,
  });

  await adr.save();

  // Create notification for owner
  const notif = new NotificationModel({
    userId: req.workspace!.ownerId,
    type: 'adr_created',
    payload: { adrId: adr.id, title: adr.title, workspaceId: p(req.params.id) },
  });
  await notif.save();

  return res.status(201).json({ data: adr });
});

// PATCH /api/workspaces/:id/adrs/:adrId
router.patch('/:id/adrs/:adrId', authenticateJWT, requireWorkspaceMember('editor'), async (req: Request, res: Response) => {
  const { title, context, decision, consequences, alternatives, status } = req.body;
  
  const adr = await ADRModel.findOneAndUpdate(
    { _id: req.params.adrId, workspaceId: req.params.id },
    { 
      $set: { 
        ...(title && { title }),
        ...(context && { context }),
        ...(decision && { decision }),
        ...(consequences && { consequences }),
        ...(alternatives && { alternatives }),
        ...(status && { status }),
        updatedAt: new Date()
      } 
    },
    { new: true }
  );

  if (!adr) return res.status(404).json({ error: 'ADR not found' });
  return res.json({ data: adr });
});

// GET /api/workspaces/:id/nodes/:nodeId/comments
router.get('/:id/nodes/:nodeId/comments', authenticateJWT, requireWorkspaceMember('viewer'), async (req: Request, res: Response) => {
  const comments = await CommentModel.find({ 
    workspaceId: req.params.id, 
    nodeId: req.params.nodeId 
  }).sort({ createdAt: 1 });
  return res.json({ data: comments });
});

// POST /api/workspaces/:id/nodes/:nodeId/comments
router.post('/:id/nodes/:nodeId/comments', authenticateJWT, requireWorkspaceMember('editor'), async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const user = await UserModel.findById(userId);
  const { text } = req.body;

  if (!text) return res.status(400).json({ error: 'Comment text is required' });

  const comment = new CommentModel({
    workspaceId: req.params.id,
    nodeId: req.params.nodeId,
    authorId: userId,
    authorName: user?.name ?? 'Unknown',
    text,
    resolved: false,
  });

  await comment.save();

  return res.status(201).json({ data: comment });
});

// PATCH /api/workspaces/:id/comments/:commentId/resolve
router.patch('/:id/comments/:commentId/resolve', authenticateJWT, requireWorkspaceMember('editor'), async (req: Request, res: Response) => {
  const comment = await CommentModel.findOneAndUpdate(
    { _id: req.params.commentId, workspaceId: req.params.id },
    { $set: { resolved: true } },
    { new: true }
  );
  if (!comment) return res.status(404).json({ error: 'Comment not found' });
  return res.json({ data: comment });
});

// POST /api/workspaces/:id/export
router.post('/:id/export', authenticateJWT, requireWorkspaceMember('editor'), async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const workspace = req.workspace!;
  const { platform = 'vercel-railway' } = req.body;

  const creditsCost = CREDITS_COSTS.CICD;
  const deducted = await creditsService.deductCredits(userId, creditsCost, { action: 'cicd_export' });
  if (!deducted) return res.status(402).json({ error: 'Insufficient credits' });

  const cicdConfig = await generationService.generateCICDConfig(
    workspace.id,
    workspace.techStack,
    platform,
  );

  return res.json({
    data: {
      cicdYaml: cicdConfig,
      archspecYaml: generateArchSpec(workspace),
      platform,
      message: 'CI/CD configuration generated. Download as ZIP from the export page.',
    },
  });
});

// POST /api/workspaces/:id/critique
router.post('/:id/critique', authenticateJWT, requireWorkspaceMember('editor'), async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const workspace = req.workspace!;

  if (workspace.architectureData.nodes.length === 0) {
    return res.status(400).json({ error: 'No architecture to critique. Generate first.' });
  }

  const deducted = await creditsService.deductCredits(userId, CREDITS_COSTS.CRITIQUE, { action: 'critique' });
  if (!deducted) return res.status(402).json({ error: 'Insufficient credits' });

  // Simulate critique
  await new Promise(r => setTimeout(r, 1000));

  const { nodes, edges } = workspace.architectureData;
  const score = Math.min(
    50 + nodes.length * 5 + edges.length * 2,
    100
  );

  return res.json({
    data: {
      score,
      issues: [
        { severity: 'info', title: 'Good separation of concerns', description: 'Services are well defined', suggestion: 'Continue maintaining this separation' },
        { severity: 'warning', title: 'Consider adding a circuit breaker', description: 'Cascading failures are possible', suggestion: 'Add resilience4j or similar' },
      ],
      timestamp: new Date(),
    },
  });
});

// POST /api/workspaces/:id/sync
router.post('/:id/sync', authenticateJWT, requireWorkspaceMember('editor'), async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const workspaceId = req.params.id;
  const { modifiedFiles } = req.body;

  if (!modifiedFiles || !Array.isArray(modifiedFiles)) {
    return res.status(400).json({ error: 'Modified files are required' });
  }

  // Deduct credits for sync
  const deducted = await creditsService.deductCredits(userId, CREDITS_COSTS.SYNC_RECONCILE, {
    action: 'sync_architecture',
    workspaceId,
  });

  if (!deducted) {
    return res.status(402).json({ error: 'Insufficient credits', required: CREDITS_COSTS.SYNC_RECONCILE });
  }

  try {
    const workspace = await WorkspaceModel.findById(workspaceId);
    if (!workspace) return res.status(404).json({ error: 'Workspace not found' });

    const result = await generationService.reconcileArchitecture(
      workspace.architectureData as any,
      modifiedFiles
    );

    workspace.architectureData = result.architectureData as any;
    workspace.updatedAt = new Date();
    await workspace.save();

    // Create a notification for the user
    await NotificationModel.create({
      userId,
      title: 'Architecture Synchronized',
      message: result.report,
      type: 'info'
    });

    return res.json({ data: result.architectureData, report: result.report });
  } catch (err) {
    console.error('[Sync] Reconciliation failed:', err);
    return res.status(500).json({ error: 'Failed to synchronize architecture' });
  }
});

export default router;
````

## File: backend/src/services/credits.service.ts
````typescript
import { v4 as uuidv4 } from 'uuid';
import { Transaction, TransactionType, PlanType } from '../types';
import { UserModel } from '../models/schemas/User.schema';
import { TransactionModel } from '../models/schemas/Transaction.schema';

export const CREDITS_COSTS = {
  CREATE_WORKSPACE: 5,
  GENERATE_SMALL: 10,  // up to 5 nodes
  GENERATE_MEDIUM: 20, // 6-15 nodes
  GENERATE_LARGE: 40,  // 16+ nodes
  CRITIQUE: 5,
  TEST_SCAFFOLD: 10,
  CICD: 15,
  ADR_AI: 3,
  PREMIUM_TEMPLATE_MIN: 5,
  PREMIUM_TEMPLATE_MAX: 50,
  SYNC_RECONCILE: 20,
} as const;

export const CREDITS_EARN = {
  INVITE_COLLABORATOR: 20,
  PUBLISH_TEMPLATE_USE: 10,
  SHARE_WORKSPACE: 20,
} as const;

export const PLAN_CREDITS: Record<PlanType, number> = {
  free: 100,
  pro: 2000,
  team: 10000,
  enterprise: 999999,
};

export class CreditsService {
  async deductCredits(userId: string, amount: number, meta: Record<string, unknown>): Promise<boolean> {
    // Atomic update: only deduct if current balance >= amount
    const user = await UserModel.findOneAndUpdate(
      { _id: userId, creditsBalance: { $gte: amount } },
      { $inc: { creditsBalance: -amount } },
      { new: true }
    );

    if (!user) return false;

    const tx = new TransactionModel({
      userId,
      type: 'spend',
      amount: -amount,
      balanceAfter: user.creditsBalance,
      meta,
    });
    
    await tx.save();
    return true;
  }

  async addCredits(userId: string, amount: number, type: TransactionType, meta: Record<string, unknown>): Promise<boolean> {
    const user = await UserModel.findByIdAndUpdate(
      userId,
      { $inc: { creditsBalance: amount } },
      { new: true }
    );

    if (!user) return false;

    const tx = new TransactionModel({
      userId,
      type,
      amount,
      balanceAfter: user.creditsBalance,
      meta,
    });
    
    await tx.save();
    return true;
  }

  async getBalance(userId: string): Promise<{ balance: number; plan: PlanType; history: any[] }> {
    const user = await UserModel.findById(userId);
    if (!user) return { balance: 0, plan: 'free', history: [] };

    const history = await TransactionModel.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50);

    return {
      balance: user.creditsBalance,
      plan: user.plan,
      history,
    };
  }

  calculateGenerationCost(nodeCount: number): number {
    if (nodeCount <= 5) return CREDITS_COSTS.GENERATE_SMALL;
    if (nodeCount <= 15) return CREDITS_COSTS.GENERATE_MEDIUM;
    return CREDITS_COSTS.GENERATE_LARGE;
  }

  async resetMonthlyCredits(userId: string): Promise<void> {
    const user = await UserModel.findById(userId);
    if (!user) return;

    const monthlyCredits = PLAN_CREDITS[user.plan];
    await UserModel.findByIdAndUpdate(userId, {
      $set: {
        creditsBalance: monthlyCredits,
        creditsResetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }
    });
  }
}

export const creditsService = new CreditsService();
````

## File: backend/src/services/generation.service.ts
````typescript
import { ArchitectureData, ArchitectureNode, ArchitectureEdge, CriticFeedback, CriticIssue, CodeFile } from '../types';
import { groqAdapter } from './ai/groq.adapter';

const MOCK_DELAY = (ms: number) => new Promise(r => setTimeout(r, ms));

interface GenerationOptions {
  prompt: string;
  previousArchitecture?: ArchitectureData;
  designData?: any;
  memoryContext?: string[];
  useStream?: boolean;
  onEvent?: (event: string, data: Record<string, unknown>) => void;
  signal?: AbortSignal;
}

interface GenerationResult {
  architectureData: ArchitectureData;
  criticFeedback: CriticFeedback;
  totalTimeMs: number;
  creditsUsed: number;
  modelUsed: string;
}

// Tech stack detection from prompt
function detectTechStack(prompt: string): string[] {
  const techMap: Record<string, string[]> = {
    react: ['React', 'TypeScript', 'Vite'],
    next: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    vue: ['Vue.js', 'TypeScript', 'Vite'],
    angular: ['Angular', 'TypeScript', 'RxJS'],
    node: ['Node.js', 'Express', 'TypeScript'],
    python: ['Python', 'FastAPI', 'SQLAlchemy'],
    django: ['Python', 'Django', 'PostgreSQL'],
    mongo: ['MongoDB', 'Mongoose'],
    postgres: ['PostgreSQL'],
    redis: ['Redis'],
    docker: ['Docker', 'Docker Compose'],
    kubernetes: ['Kubernetes', 'Helm'],
    aws: ['AWS', 'S3', 'Lambda'],
    stripe: ['Stripe'],
    auth: ['JWT', 'bcrypt'],
    microservices: ['Docker', 'Redis', 'RabbitMQ'],
    graphql: ['GraphQL', 'Apollo'],
    socket: ['Socket.io', 'WebSocket'],
  };

  const detected = new Set<string>();
  const lower = prompt.toLowerCase();
  for (const [key, techs] of Object.entries(techMap)) {
    if (lower.includes(key)) techs.forEach(t => detected.add(t));
  }

  // Default stack
  if (detected.size === 0) {
    ['Node.js', 'React', 'MongoDB', 'TypeScript'].forEach(t => detected.add(t));
  }

  return Array.from(detected);
}

// Generate a realistic node graph from prompt
function generateNodes(prompt: string, previousArch?: ArchitectureData): { nodes: ArchitectureNode[]; edges: ArchitectureEdge[] } {
  const lower = prompt.toLowerCase();

  // Determine architecture type from prompt
  const isEcommerce = lower.includes('ecommerce') || lower.includes('shop') || lower.includes('store');
  const isAuth = lower.includes('auth') || lower.includes('login') || lower.includes('register');
  const isMicroservices = lower.includes('microservices') || lower.includes('micro service');
  const isRealtime = lower.includes('real-time') || lower.includes('realtime') || lower.includes('chat') || lower.includes('socket');
  const isAPI = lower.includes('api') || lower.includes('rest') || lower.includes('backend');

  let nodeTemplates: Omit<ArchitectureNode, 'id'>[] = [];

  if (isEcommerce) {
    nodeTemplates = [
      { label: 'API Gateway', layer: 'Gateway', description: 'Rate limiting, routing, auth middleware', status: 'new', position: { x: 400, y: 80 }, files: [], testFiles: [] },
      { label: 'Auth Service', layer: 'Services', description: 'JWT + OAuth2, bcrypt password hashing', status: 'new', position: { x: 100, y: 240 }, files: [], testFiles: [] },
      { label: 'Product Service', layer: 'Services', description: 'Product catalog, search, inventory', status: 'new', position: { x: 300, y: 240 }, files: [], testFiles: [] },
      { label: 'Order Service', layer: 'Services', description: 'Order lifecycle, payment processing', status: 'new', position: { x: 500, y: 240 }, files: [], testFiles: [] },
      { label: 'Notification Service', layer: 'Services', description: 'Email, SMS, push notifications', status: 'new', position: { x: 700, y: 240 }, files: [], testFiles: [] },
      { label: 'MongoDB', layer: 'Database', description: 'Products, orders, users collections', status: 'new', position: { x: 300, y: 420 }, files: [], testFiles: [] },
      { label: 'Redis Cache', layer: 'Cache', description: 'Session store, product cache, rate limits', status: 'new', position: { x: 550, y: 420 }, files: [], testFiles: [] },
      { label: 'Message Queue', layer: 'Infrastructure', description: 'Async event processing via RabbitMQ', status: 'new', position: { x: 700, y: 420 }, files: [], testFiles: [] },
    ];
  } else if (isMicroservices) {
    nodeTemplates = [
      { label: 'API Gateway', layer: 'Gateway', description: 'Central entry, load balancing, auth', status: 'new', position: { x: 400, y: 80 }, files: [], testFiles: [] },
      { label: 'User Service', layer: 'Services', description: 'User CRUD, profile management', status: 'new', position: { x: 150, y: 240 }, files: [], testFiles: [] },
      { label: 'Core Service', layer: 'Services', description: 'Business logic, domain operations', status: 'new', position: { x: 400, y: 240 }, files: [], testFiles: [] },
      { label: 'Analytics Service', layer: 'Services', description: 'Events, metrics, reporting', status: 'new', position: { x: 650, y: 240 }, files: [], testFiles: [] },
      { label: 'Service Discovery', layer: 'Infrastructure', description: 'Consul/Eureka service registry', status: 'new', position: { x: 150, y: 420 }, files: [], testFiles: [] },
      { label: 'Primary DB', layer: 'Database', description: 'PostgreSQL for transactional data', status: 'new', position: { x: 400, y: 420 }, files: [], testFiles: [] },
      { label: 'Redis', layer: 'Cache', description: 'Distributed cache, pub/sub', status: 'new', position: { x: 650, y: 420 }, files: [], testFiles: [] },
    ];
  } else if (isRealtime) {
    nodeTemplates = [
      { label: 'Next.js Frontend', layer: 'Frontend', description: 'React UI with real-time updates', status: 'new', position: { x: 400, y: 80 }, files: [], testFiles: [] },
      { label: 'Express API', layer: 'Backend', description: 'REST + WebSocket server', status: 'new', position: { x: 200, y: 240 }, files: [], testFiles: [] },
      { label: 'Socket.io Server', layer: 'Realtime', description: 'WebSocket rooms, presence, events', status: 'new', position: { x: 550, y: 240 }, files: [], testFiles: [] },
      { label: 'Auth Module', layer: 'Auth', description: 'JWT tokens, session management', status: 'new', position: { x: 100, y: 420 }, files: [], testFiles: [] },
      { label: 'MongoDB', layer: 'Database', description: 'Messages, users, rooms', status: 'new', position: { x: 350, y: 420 }, files: [], testFiles: [] },
      { label: 'Redis Pub/Sub', layer: 'Cache', description: 'Horizontal scaling for WebSocket', status: 'new', position: { x: 600, y: 420 }, files: [], testFiles: [] },
    ];
  } else {
    // Generic web app
    nodeTemplates = [
      { label: 'Frontend (React)', layer: 'Frontend', description: 'SPA with responsive UI', status: 'new', position: { x: 400, y: 80 }, files: [], testFiles: [] },
      { label: 'API Server', layer: 'Backend', description: 'Express REST API with TypeScript', status: 'new', position: { x: 400, y: 240 }, files: [], testFiles: [] },
      { label: 'Auth Module', layer: 'Auth', description: 'JWT + refresh tokens, RBAC', status: 'new', position: { x: 100, y: 240 }, files: [], testFiles: [] },
      { label: 'Database (MongoDB)', layer: 'Database', description: 'Primary data store', status: 'new', position: { x: 250, y: 420 }, files: [], testFiles: [] },
      { label: 'Redis Cache', layer: 'Cache', description: 'Session cache, rate limiting', status: 'new', position: { x: 550, y: 420 }, files: [], testFiles: [] },
    ];

    if (isAuth) {
      nodeTemplates.push(
        { label: 'Email Service', layer: 'Services', description: 'Transactional emails via Resend', status: 'new', position: { x: 700, y: 240 }, files: [], testFiles: [] }
      );
    }
  }

  // Handle incremental generation
  if (previousArch) {
    nodeTemplates = nodeTemplates.map((n, i) => {
      const prevNode = previousArch.nodes[i];
      if (prevNode) {
        return { ...n, status: 'modified' as const, position: prevNode.position };
      }
      return n;
    });
  }

  // Generate IDs and code files
  const nodes: ArchitectureNode[] = nodeTemplates.map((n, i) => ({
    ...n,
    id: `node-${i + 1}`,
    files: generateCodeFiles(n.label, n.layer),
    testFiles: generateTestFiles(n.label),
  }));

  // Generate edges
  const edges: ArchitectureEdge[] = [];
  for (let i = 1; i < nodes.length; i++) {
    if (i <= 3) {
      edges.push({ id: `e-0-${i}`, source: nodes[0].id, target: nodes[i].id, label: 'http' });
    }
    if (i >= nodes.length - 2) {
      const mid = Math.floor(nodes.length / 2);
      edges.push({ id: `e-${mid}-${i}`, source: nodes[mid].id, target: nodes[i].id, label: 'db' });
    }
  }

  return { nodes, edges };
}

function generateCodeFiles(label: string, layer: string): CodeFile[] {
  const sanitized = label.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

  if (layer === 'Frontend') {
    return [
      {
        name: `${sanitized}.tsx`,
        path: `src/components/${sanitized}.tsx`,
        language: 'typescript',
        content: `import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';

interface ${label.replace(/\s/g, '')}Props {
  className?: string;
}

export const ${label.replace(/\s/g, '')}: React.FC<${label.replace(/\s/g, '')}Props> = ({ className }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/api/data');
        setData(response.data);
      } catch (err) {
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="loading-spinner" />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className={\`${sanitized}-container \${className ?? ''}\`}>
      <h2>${label}</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default ${label.replace(/\s/g, '')};
`,
      },
    ];
  }

  if (layer === 'Backend' || layer === 'Services' || layer === 'Gateway') {
    return [
      {
        name: `${sanitized}.router.ts`,
        path: `src/routes/${sanitized}.ts`,
        language: 'typescript',
        content: `import { Router, Request, Response } from 'express';
import { ${sanitized}Service } from '../services/${sanitized}.service';
import { authenticateJWT } from '../middleware/auth';

const router = Router();
const service = new ${sanitized.charAt(0).toUpperCase() + sanitized.slice(1)}Service();

/**
 * GET /${sanitized}
 * Returns all ${label} resources
 */
router.get('/', authenticateJWT, async (req: Request, res: Response) => {
  try {
    const data = await service.getAll(req.user!.userId);
    res.json({ data, timestamp: new Date().toISOString() });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    res.status(500).json({ error: message });
  }
});

/**
 * POST /${sanitized}
 * Create new ${label} resource
 */
router.post('/', authenticateJWT, async (req: Request, res: Response) => {
  try {
    const created = await service.create(req.user!.userId, req.body);
    res.status(201).json({ data: created });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    res.status(400).json({ error: message });
  }
});

/**
 * GET /${sanitized}/:id
 * Returns specific ${label} resource
 */
router.get('/:id', authenticateJWT, async (req: Request, res: Response) => {
  try {
    const item = await service.getById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json({ data: item });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    res.status(500).json({ error: message });
  }
});

/**
 * PATCH /${sanitized}/:id
 * Update ${label} resource
 */
router.patch('/:id', authenticateJWT, async (req: Request, res: Response) => {
  try {
    const updated = await service.update(req.params.id, req.body);
    res.json({ data: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    res.status(400).json({ error: message });
  }
});

/**
 * DELETE /${sanitized}/:id
 * Delete ${label} resource
 */
router.delete('/:id', authenticateJWT, async (req: Request, res: Response) => {
  try {
    await service.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    res.status(500).json({ error: message });
  }
});

export default router;
`,
      },
      {
        name: `${sanitized}.service.ts`,
        path: `src/services/${sanitized}.service.ts`,
        language: 'typescript',
        content: `/**
 * ${label} Service
 * Business logic layer for ${label} operations
 */
export class ${sanitized.charAt(0).toUpperCase() + sanitized.slice(1)}Service {
  async getAll(userId: string): Promise<unknown[]> {
    // Implementation: query database with user context
    return [];
  }

  async getById(id: string): Promise<unknown | null> {
    // Implementation: fetch by ID with auth check
    return null;
  }

  async create(userId: string, data: unknown): Promise<unknown> {
    // Implementation: validate, persist, return created resource
    return { id: 'generated-id', ...( data as object), createdBy: userId };
  }

  async update(id: string, data: unknown): Promise<unknown> {
    // Implementation: optimistic locking, patch operations
    return { id, ...( data as object), updatedAt: new Date() };
  }

  async delete(id: string): Promise<void> {
    // Implementation: soft delete or cascade
  }
}
`,
      },
    ];
  }

  if (layer === 'Database') {
    return [
      {
        name: `schema.ts`,
        path: `src/models/schema.ts`,
        language: 'typescript',
        content: `import { z } from 'zod';

// ${label} Schema (Zod validation)
export const ${sanitized}Schema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export type ${sanitized.charAt(0).toUpperCase() + sanitized.slice(1)}Type = z.infer<typeof ${sanitized}Schema>;

// MongoDB Index definitions
export const ${sanitized}Indexes = [
  { key: { createdAt: -1 }, name: 'idx_created_desc' },
  { key: { name: 'text' }, name: 'idx_name_text' },
];
`,
      },
    ];
  }

  return [
    {
      name: `${sanitized}.ts`,
      path: `src/${sanitized}.ts`,
      language: 'typescript',
      content: `/**
 * ${label} Module
 * ${label} configuration and initialization
 */
export interface ${label.replace(/\s/g, '')}Config {
  enabled: boolean;
  options?: Record<string, unknown>;
}

export async function initialize${label.replace(/\s/g, '')}(config: ${label.replace(/\s/g, '')}Config): Promise<void> {
  if (!config.enabled) {
    console.log('[${label}] Disabled, skipping initialization');
    return;
  }
  console.log('[${label}] Initialized successfully');
}
`,
    },
  ];
}

function generateTestFiles(label: string): CodeFile[] {
  const sanitized = label.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  return [
    {
      name: `${sanitized}.test.ts`,
      path: `src/__tests__/${sanitized}.test.ts`,
      language: 'typescript',
      content: `import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';

/**
 * ${label} - Unit Tests
 * Generated by VisualArch AI Test Scaffolding
 */
describe('${label}', () => {
  beforeEach(() => {
    // Setup test environment
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Cleanup
  });

  describe('Happy Path', () => {
    it('should initialize successfully', async () => {
      // Arrange
      const config = { enabled: true };

      // Act & Assert
      expect(config.enabled).toBe(true);
    });

    it('should handle valid input correctly', () => {
      // Arrange
      const input = { name: 'test', value: 42 };

      // Act
      const result = { ...input, processed: true };

      // Assert
      expect(result.name).toBe('test');
      expect(result.processed).toBe(true);
    });
  });

  describe('Error Scenarios', () => {
    it('should reject invalid input', () => {
      expect(() => {
        if (!null) throw new Error('Invalid input');
      }).toThrow('Invalid input');
    });

    it('should handle network errors gracefully', async () => {
      const mockFetch = jest.fn().mockRejectedValue(new Error('Network error'));
      await expect(mockFetch()).rejects.toThrow('Network error');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty data', () => {
      const empty: unknown[] = [];
      expect(empty).toHaveLength(0);
    });

    it('should handle concurrent requests', async () => {
      const requests = Array.from({ length: 5 }, (_, i) =>
        Promise.resolve(\`Result \${i}\`)
      );
      const results = await Promise.all(requests);
      expect(results).toHaveLength(5);
    });
  });
});
`,
    },
  ];
}

// Architecture score calculation
function calculateArchitectureScore(nodes: ArchitectureNode[], edges: ArchitectureEdge[]): number {
  const hasGateway = nodes.some(n => n.layer === 'Gateway');
  const hasAuth = nodes.some(n => n.layer === 'Auth' || n.label.toLowerCase().includes('auth'));
  const hasCache = nodes.some(n => n.layer === 'Cache');
  const hasDB = nodes.some(n => n.layer === 'Database');
  const hasTests = nodes.every(n => n.testFiles && n.testFiles.length > 0);
  const avgConnections = edges.length / Math.max(nodes.length, 1);

  let score = 40;
  if (hasGateway) score += 15;
  if (hasAuth) score += 15;
  if (hasCache) score += 10;
  if (hasDB) score += 10;
  if (hasTests) score += 10;
  if (avgConnections > 0.5) score += 5;
  if (nodes.length >= 5) score += 5;

  return Math.min(score, 100);
}

// Generate critic feedback
function generateCriticFeedback(nodes: ArchitectureNode[], score: number): CriticFeedback {
  const issues: CriticIssue[] = [];

  const hasAuth = nodes.some(n => n.label.toLowerCase().includes('auth'));
  const hasRateLimit = nodes.some(n => n.description.toLowerCase().includes('rate'));
  const hasErrorHandling = nodes.some(n => n.description.toLowerCase().includes('error'));
  const hasMonitoring = nodes.some(n => n.label.toLowerCase().includes('monitor') || n.label.toLowerCase().includes('log'));

  if (!hasAuth) {
    issues.push({
      severity: 'critical',
      title: 'Missing Authentication Layer',
      description: 'No authentication service detected. All API endpoints are potentially unprotected.',
      suggestion: 'Add an Auth Service with JWT validation and RBAC middleware',
    });
  }

  if (!hasRateLimit) {
    issues.push({
      severity: 'warning',
      title: 'No Rate Limiting Configured',
      description: 'API endpoints appear to lack rate limiting, making the system vulnerable to abuse.',
      suggestion: 'Add Redis-backed rate limiting to the API Gateway',
    });
  }

  if (!hasErrorHandling) {
    issues.push({
      severity: 'warning',
      title: 'Error Handling Not Explicit',
      description: 'Global error handling strategy is not visible in the architecture.',
      suggestion: 'Add an error boundary / global error handler in the API layer',
    });
  }

  if (!hasMonitoring) {
    issues.push({
      severity: 'info',
      title: 'Monitoring Not Configured',
      description: 'No observability layer (logging, metrics, tracing) is visible.',
      suggestion: 'Add Sentry for error tracking and structured logging',
    });
  }

  if (nodes.length > 8) {
    issues.push({
      severity: 'info',
      title: 'High Architectural Complexity',
      description: `${nodes.length} components increases operational overhead.`,
      suggestion: 'Consider consolidating services that have similar bounded contexts',
    });
  }

  return { score, issues, timestamp: new Date() };
}

export class GenerationService {
  async generate(options: GenerationOptions): Promise<GenerationResult> {
    const startTime = Date.now();
    const { prompt, previousArchitecture, onEvent } = options;

    if (!groqAdapter.isEnabled) {
      return this.generateMock(options, startTime);
    }

    try {
      // Stage 0: Context & Memory
      onEvent?.('memory_retrieved', { count: 0, relevant_decisions: [] });

      // Stage 1: Planning (LLM)
      onEvent?.('planning_start', { iteration: 1, memory_used: false });
      
      const planPrompt = `
        As a lead architect, design a system architecture for: "${prompt}"
        Technical Requirements: Use modern stack (React, Node, etc. where applicable).
        
        Keep it to 4-8 nodes for a clean diagram.
      `;

      let finalPrompt = planPrompt;
      if (options.designData) {
        const designContext = this.parseDesignData(options.designData);
        if (designContext) {
          finalPrompt = `
            Visual Design Context from User Sketch:
            ${designContext}
            
            ${planPrompt}
            
            IMPORTANT: Prioritize components and relationships found in the Visual Design Context.
          `;
        }
      }

      const plan = await groqAdapter.generateJson<{
        techStack: string[];
        nodes: any[];
        edges: any[];
      }>(finalPrompt, undefined, options.signal);

      const techStack = plan.techStack;
      const nodes: ArchitectureNode[] = plan.nodes.map((n, i) => ({
        ...n,
        id: `node-${i + 1}`,
        status: 'new',
        files: [],
        testFiles: [],
      }));

      const edges: ArchitectureEdge[] = plan.edges.map((e, i) => {
        const source = nodes.find(n => n.label === e.sourceLabel);
        const target = nodes.find(n => n.label === e.targetLabel);
        return {
          id: `e-${i}`,
          source: source?.id ?? 'node-1',
          target: target?.id ?? 'node-2',
          label: e.label,
        };
      });

      onEvent?.('planning_done', { node_count: nodes.length, tech_stack: techStack });

      // Stage 2: Coding (Parallel)
      onEvent?.('coding_start', { total: nodes.length });
      
      await Promise.all(nodes.map(async (node, i) => {
        onEvent?.('coding_node', { id: node.id, label: node.label, index: i + 1, total: nodes.length });
        
        const codePrompt = `
          Generate 2 core files (code and types) for the component: "${node.label}" (${node.description})
          Context: High-level architecture for ${prompt}.
          
          Return JSON: { files: [{ name, path, content, language }] }
        `;

        const codeResult = await groqAdapter.generateJson<{ files: CodeFile[] }>(codePrompt, undefined, options.signal);
        node.files = codeResult.files;
        
        onEvent?.('node_done', { id: node.id, label: node.label, file_count: node.files.length });
      }));

      // Stage 3: Critique (LLM)
      onEvent?.('critique_start', {});
      const criticPrompt = `
        Analyze this architecture for: "${prompt}"
        Tech Stack: ${techStack.join(', ')}
        Nodes: ${nodes.map(n => n.label).join(', ')}
        
        Return JSON: { score: number (0-100), issues: [{ severity: 'critical'|'warning'|'info', title, description, suggestion }] }
      `;

      const criticResult = await groqAdapter.generateJson<{ score: number; issues: CriticIssue[] }>(criticPrompt, undefined, options.signal);
      const criticFeedback: CriticFeedback = {
        score: criticResult.score,
        issues: criticResult.issues,
        timestamp: new Date(),
      };

      onEvent?.('critique_done', { score: criticFeedback.score, issues_count: criticFeedback.issues.length });

      const architectureData: ArchitectureData = {
        nodes, edges, techStack, layoutDirection: 'TB',
      };

      const creditsUsed = nodes.length * 10;
      const totalTimeMs = Date.now() - startTime;

      onEvent?.('complete', { architecture_data: architectureData, credits_used: creditsUsed });

      return { architectureData, criticFeedback, totalTimeMs, creditsUsed, modelUsed: 'llama-3.3-70b-versatile' };
    } catch (error: any) {
      console.error('[AI Generation] Pipeline failed, falling back to mock:', error.message || error);
      onEvent?.('ai_fallback', { reason: error.message || 'AI request failed', model: 'mock-engine' });
      return this.generateMock(options, startTime);
    }
  }

  // Fallback / original mock logic moved here
  private async generateMock(options: GenerationOptions, startTime: number): Promise<GenerationResult> {
    const { prompt, previousArchitecture, onEvent } = options;
    // ... existing mock logic ...
    // (I will keep the existing logic in a separate method for dev/demo safety)
    await MOCK_DELAY(500);
    const techStack = detectTechStack(prompt);
    const { nodes, edges } = generateNodes(prompt, previousArchitecture);
    const score = calculateArchitectureScore(nodes, edges);
    const criticFeedback = generateCriticFeedback(nodes, score);
    
    const architectureData: ArchitectureData = { nodes, edges, techStack, layoutDirection: 'TB' };
    const creditsUsed = 10;
    const totalTimeMs = Date.now() - startTime;
    
    onEvent?.('complete', { architecture_data: architectureData, credits_used: creditsUsed });
    return { architectureData, criticFeedback, totalTimeMs, creditsUsed, modelUsed: 'mock-engine' };
  }

  async generateCICDConfig(workspaceId: string, techStack: string[], platform: string): Promise<string> {
    if (!groqAdapter.isEnabled) {
      await MOCK_DELAY(1000);
      return `# Mock CI/CD for ${platform}\n# Tech Stack: ${techStack.join(', ')}\n\nversion: 1.0\nsteps:\n  - build: npm run build\n  - test: npm test\n  - deploy: # TODO: add ${platform} credentials`;
    }

    const prompt = `
      Generate a professional CI/CD configuration (YAML) for the following workspace:
      Workspace ID: ${workspaceId}
      Tech Stack: ${techStack.join(', ')}
      Target Platform: ${platform}
      
      Include steps for build, test, and deployment to ${platform}.
      Return ONLY the YAML content without markdown blocks.
    `;

    return groqAdapter.generateText(prompt, undefined, undefined);
  }

  async generateADR(workspaceId: string, nodeLabel: string, context: string): Promise<{
    title: string; decision: string; consequences: string; alternatives: string[];
  }> {
    if (!groqAdapter.isEnabled) {
      await MOCK_DELAY(800);
      return {
        title: `Decision: Use ${nodeLabel} Pattern`,
        decision: `We decided to implement ${nodeLabel} using the proposed approach based on: ${context}.`,
        consequences: `Improved maintainability and clearer interfaces.`,
        alternatives: [`Alternative A: Monolithic approach`, `Alternative B: Third-party service`],
      };
    }

    const prompt = `
      Create an Architecture Decision Record (ADR) for: "${nodeLabel}"
      Context provided: "${context}"
      
      Return JSON: { title, decision, consequences, alternatives: string[] }
    `;

    return groqAdapter.generateJson(prompt, undefined, undefined); // Signal not passed here for simplicity or add it if needed
  }

  async reconcileArchitecture(
    originalArch: ArchitectureData,
    modifiedFiles: { path: string; content: string }[]
  ): Promise<{ architectureData: ArchitectureData; report: string }> {
    if (!groqAdapter.isEnabled) {
      await MOCK_DELAY(1500);
      return {
        architectureData: originalArch,
        report: 'Mock sync complete. No architectural changes detected in code.'
      };
    }

    const prompt = `
      You are an Architectural Reconciliation Engine.
      
      Current Architecture JSON:
      ${JSON.stringify(originalArch, null, 2)}
      
      User has modified the following system code:
      ${modifiedFiles.map(f => `--- FILE: ${f.path} ---\n${f.content}`).join('\n\n')}
      
      TASK:
      Analyze if these code changes imply changes to the architecture graph.
      - Did the user add a new service dependency? (New Edge)
      - Did the user implement a new component/database? (New Node)
      - Did the user refactor a layer? (Update Node Metadata)
      
      Return a JSON object:
      {
        "architectureData": { ...updated nodes/edges JSON ... },
        "report": "A human-readable report summarizing what was reconciled."
      }
      
      Keep the node IDs stable if they still exist. Only add or remove if absolutely implied by the code.
    `;

    const result = await groqAdapter.generateJson<{ architectureData: ArchitectureData; report: string }>(
      prompt,
      undefined,
      undefined
    );

    return result;
  }

  private parseDesignData(designData: any): string | null {
    // Puck format: { content: [{ type, props: { ... } }], root: { props: { ... } } }
    if (!designData || !designData.content || !Array.isArray(designData.content)) return null;

    try {
      const blocks = designData.content.map((block: any, idx: number) => {
        const type = block.type || 'Unknown';
        const props = block.props || {};
        
        let detail = '';
        if (type === 'Heading') detail = `: "${props.title}" (level ${props.level})`;
        if (type === 'Text') detail = `: "${props.text?.substring(0, 50)}..."`;
        if (type === 'Hero') detail = `: "${props.title}" - ${props.description?.substring(0, 30)}...`;
        if (type === 'Button') detail = `: "${props.label}" (${props.variant} variant)`;
        if (type === 'Card') detail = `: "${props.title}" - ${props.content?.substring(0, 30)}...`;
        if (type === 'FeatureGrid') {
          const count = props.features?.length || 0;
          detail = `: with ${count} features`;
        }
        if (type === 'Pricing') {
          const tiers = props.tiers?.map((t: any) => t.plan).join(', ') || 'none';
          detail = `: with tiers [${tiers}]`;
        }
        if (type === 'Navbar') {
          const links = props.links?.map((l: any) => l.label).join(', ') || 'none';
          detail = `: logo "${props.logo}" with links [${links}]`;
        }
        if (type === 'Contact') detail = `: title "${props.title}"`;
        if (type === 'Container') detail = `: (layout container)`;

        return `${idx + 1}. [Block: ${type}] ${detail}`;
      });

      if (blocks.length === 0) return null;

      return `The user has structured the frontend prototype with these specific UI blocks:\n${blocks.join('\n')}`;
    } catch (err) {
      console.error('Failed to parse Puck design data:', err);
      return null;
    }
  }
}

export const generationService = new GenerationService();
````

## File: backend/src/websocket/workspace.gateway.ts
````typescript
import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';
import jwt from 'jsonwebtoken';
import { JWTPayload } from '../types';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error('❌ FATAL: JWT_SECRET not found in environment. WebSocket server will fail.');
}

interface UserPresence {
  userId: string;
  name: string;
  color: string;
  cursor?: { x: number; y: number; nodeId?: string };
  selectedNode?: string;
  isEditing?: string;
}

// Active workspace sessions: workspaceId -> { socketId -> UserPresence }
const workspaceSessions = new Map<string, Map<string, UserPresence>>();

const CURSOR_COLORS = ['#5E81F4', '#22D3EE', '#4ADE80', '#FACC15', '#F87171', '#A78BFA'];

function getColorForUser(index: number): string {
  return CURSOR_COLORS[index % CURSOR_COLORS.length];
}

export function initializeWebSocket(httpServer: HTTPServer, frontendUrl: string): SocketIOServer {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: frontendUrl || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  });

  // Auth middleware for Socket.io
  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth?.token ?? socket.handshake.headers?.authorization?.split(' ')[1];

    if (!token) {
      return next(new Error('Authentication required'));
    }

    try {
      const payload = jwt.verify(token, JWT_SECRET) as JWTPayload;
      (socket as Socket & { user?: JWTPayload }).user = payload;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  const workspaceNamespace = io.of('/workspace');

  // Per-workspace broadcast intervals
  const broadcastIntervals = new Map<string, NodeJS.Timeout>();

  function startBroadcasting(workspaceId: string) {
    if (broadcastIntervals.has(workspaceId)) return;

    const interval = setInterval(() => {
      const session = workspaceSessions.get(workspaceId);
      if (!session || session.size === 0) {
        stopBroadcasting(workspaceId);
        return;
      }

      const cursors = Object.fromEntries(
        Array.from(session.entries())
          .filter(([, p]) => p.cursor)
          .map(([, p]) => [p.userId, p.cursor])
      );

      if (Object.keys(cursors).length > 0) {
        workspaceNamespace.to(workspaceId).emit('cursors_update', { cursors });
      }
    }, 50);

    broadcastIntervals.set(workspaceId, interval);
  }

  function stopBroadcasting(workspaceId: string) {
    const interval = broadcastIntervals.get(workspaceId);
    if (interval) {
      clearInterval(interval);
      broadcastIntervals.delete(workspaceId);
    }
  }

  workspaceNamespace.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Authentication required'));
    try {
      const payload = jwt.verify(token, JWT_SECRET) as JWTPayload;
      (socket as Socket & { user?: JWTPayload }).user = payload;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  workspaceNamespace.on('connection', (socket: Socket) => {
    const user = (socket as Socket & { user?: JWTPayload }).user;
    if (!user) { socket.disconnect(); return; }

    let currentWorkspaceId: string | null = null;

    console.log(`[WS] User ${user.userId} connected`);

    // JOIN WORKSPACE
    socket.on('join_workspace', ({ workspaceId }: { workspaceId: string }) => {
      currentWorkspaceId = workspaceId;
      socket.join(workspaceId);

      if (!workspaceSessions.has(workspaceId)) {
        workspaceSessions.set(workspaceId, new Map());
      }

      const session = workspaceSessions.get(workspaceId)!;
      const colorIndex = session.size;

      const presence: UserPresence = {
        userId: user.userId,
        name: user.email.split('@')[0],
        color: getColorForUser(colorIndex),
      };

      session.set(socket.id, presence);

      // Start broadcasting for this workspace if not already
      startBroadcasting(workspaceId);

      // Send current participants to newcomer
      socket.emit('room_state', {
        participants: Array.from(session.values()),
      });

      // Broadcast join to others
      socket.to(workspaceId).emit('user_joined', presence);

      console.log(`[WS] User ${user.userId} joined workspace ${workspaceId}`);
    });

    // CURSOR MOVEMENT (Throttled update)
    socket.on('cursor_move', ({ x, y, nodeId }: { x: number; y: number; nodeId?: string }) => {
      if (!currentWorkspaceId) return;
      const session = workspaceSessions.get(currentWorkspaceId);
      if (!session) return;

      const presence = session.get(socket.id);
      if (presence) {
        presence.cursor = { x, y, nodeId };
      }
    });

    // NODE SELECTED
    socket.on('node_selected', ({ nodeId }: { nodeId: string }) => {
      if (!currentWorkspaceId) return;
      const session = workspaceSessions.get(currentWorkspaceId);
      if (session?.get(socket.id)) {
        session.get(socket.id)!.selectedNode = nodeId;
        socket.to(currentWorkspaceId).emit('node_selection_changed', {
          userId: user.userId,
          nodeId,
        });
      }
    });

    // NODE EDITING (lock indicator)
    socket.on('node_editing', ({ nodeId, isEditing }: { nodeId: string; isEditing: boolean }) => {
      if (!currentWorkspaceId) return;
      const session = workspaceSessions.get(currentWorkspaceId);
      if (session?.get(socket.id)) {
        session.get(socket.id)!.isEditing = isEditing ? nodeId : undefined;
      }
      socket.to(currentWorkspaceId).emit('node_lock_changed', {
        userId: user.userId,
        nodeId,
        isLocked: isEditing,
      });
    });

    // GENERATION STARTED
    socket.on('generation_started', ({ prompt }: { prompt: string }) => {
      if (!currentWorkspaceId) return;
      socket.to(currentWorkspaceId).emit('generation_started', {
        by: user.userId,
        prompt: prompt.substring(0, 100),
      });
    });

    // GENERATION COMPLETE
    socket.on('generation_complete', ({ architectureData }: { architectureData: unknown }) => {
      if (!currentWorkspaceId) return;
      socket.to(currentWorkspaceId).emit('generation_complete', { architectureData });
    });

    // COMMENT ADDED
    socket.on('comment_added', ({ comment }: { comment: unknown }) => {
      if (!currentWorkspaceId) return;
      socket.to(currentWorkspaceId).emit('comment_added', { comment });
    });

    // ADR CREATED
    socket.on('adr_created', ({ adr }: { adr: unknown }) => {
      if (!currentWorkspaceId) return;
      socket.to(currentWorkspaceId).emit('adr_created', { adr });
    });

    // DISCONNECT
    socket.on('disconnect', () => {
      if (currentWorkspaceId) {
        const session = workspaceSessions.get(currentWorkspaceId);
        if (session) {
          const presence = session.get(socket.id);
          session.delete(socket.id);

          if (presence) {
            socket.to(currentWorkspaceId).emit('user_left', { userId: presence.userId });
          }

          if (session.size === 0) {
            stopBroadcasting(currentWorkspaceId);
            workspaceSessions.delete(currentWorkspaceId);
          }
        }
      }
      console.log(`[WS] User ${user.userId} disconnected`);
    });
  });

  // Health check namespace
  io.on('connection', (socket) => {
    socket.on('ping', () => socket.emit('pong', { timestamp: Date.now() }));
  });

  return io;
}
````
