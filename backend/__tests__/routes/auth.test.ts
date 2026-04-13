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
