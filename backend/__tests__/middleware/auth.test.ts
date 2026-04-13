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
