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
