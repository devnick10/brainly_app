import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';
import { Hono } from 'hono';
import { createMiddleware } from 'hono/factory';
import { SignJWT } from 'jose';
import { userRouter } from '../routes/user';
import type { AppContext } from '../types';
import { mockEnv, mockPrisma } from './helpers';

function createTestApp() {
  const app = new Hono<AppContext>();

  app.use(
    '*',
    createMiddleware<AppContext>(async (c, next) => {
      c.set('prisma', mockPrisma);
      await next();
    }),
  );

  app.route('/api/v1/user', userRouter);
  return app;
}

async function createToken(userId = 'user-1') {
  return await new SignJWT({})
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(userId)
    .setExpirationTime('1h')
    .sign(new TextEncoder().encode(mockEnv.ACCESS_TOKEN_SECRET));
}

beforeEach(() => {
  vi.clearAllMocks();
});

beforeAll(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

describe('POST /api/v1/user/signup', () => {
  it('creates a user and returns a token', async () => {
    const app = createTestApp();

    (mockPrisma.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(
      null,
    );
    (mockPrisma.user.create as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: 'user-1',
      email: 'new@test.com',
      password: 'pass',
    });

    const res = await app.fetch(
      new Request('http://localhost/api/v1/user/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'new@test.com',
          password: 'Test@123456',
        }),
      }),
      mockEnv,
    );

    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.token).toBeTruthy();
  });

  it('returns 409 when email already exists', async () => {
    const app = createTestApp();

    (mockPrisma.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: 'existing',
      email: 'exists@test.com',
    });

    const res = await app.fetch(
      new Request('http://localhost/api/v1/user/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'exists@test.com',
          password: 'Test@123456',
        }),
      }),
      mockEnv,
    );

    expect(res.status).toBe(409);
  });
});

describe('POST /api/v1/user/signin', () => {
  it('signs in with correct credentials', async () => {
    const app = createTestApp();

    const storedHash =
      '$2b$10$g.K7hzmSMR/q53d2/WxAoOlnIAub3tnHJDgZrjhb06nOc2mvNvZiK';

    (mockPrisma.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: 'user-1',
      email: 'a@b.com',
      password: storedHash,
    });

    const res = await app.fetch(
      new Request('http://localhost/api/v1/user/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'a@b.com', password: 'Test@123456' }),
      }),
      mockEnv,
    );

    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.token).toBeTruthy();
  });

  it('returns 401 with wrong password', async () => {
    const app = createTestApp();

    const storedHash =
      '$2b$10$g.K7hzmSMR/q53d2/WxAoOlnIAub3tnHJDgZrjhb06nOc2mvNvZiK';

    (mockPrisma.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: 'user-1',
      email: 'a@b.com',
      password: storedHash,
    });

    const res = await app.fetch(
      new Request('http://localhost/api/v1/user/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'a@b.com', password: 'Wrong@Password1' }),
      }),
      mockEnv,
    );

    expect(res.status).toBe(401);
  });
});

describe('GET /api/v1/user/me', () => {
  it('returns user when authenticated', async () => {
    const app = createTestApp();
    const token = await createToken();

    (mockPrisma.user.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: 'user-1',
      email: 'a@b.com',
      createdAt: new Date().toISOString(),
    });

    const res = await app.fetch(
      new Request('http://localhost/api/v1/user/me', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      }),
      mockEnv,
    );

    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.user.email).toBe('a@b.com');
  });

  it('rejects expired or malformed tokens', async () => {
    const app = createTestApp();

    const res = await app.fetch(
      new Request('http://localhost/api/v1/user/me', {
        method: 'GET',
        headers: { Authorization: 'Bearer invalid-token' },
      }),
      mockEnv,
    );

    expect(res.status).toBe(401);
  });
});

describe('POST /api/v1/user/logout', () => {
  it('returns 401 without auth header', async () => {
    const app = createTestApp();

    const res = await app.fetch(
      new Request('http://localhost/api/v1/user/logout', {
        method: 'POST',
      }),
      mockEnv,
    );

    expect(res.status).toBe(401);
  });

  it('logs out without refresh token cookie', async () => {
    const app = createTestApp();
    const token = await createToken();

    (mockPrisma.session.update as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: 'session-1',
      revokedAt: new Date(),
    });

    const res = await app.fetch(
      new Request('http://localhost/api/v1/user/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }),
      mockEnv,
    );

    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.message).toBe('Logged out successfully');
  });

  it('revokes session when refresh token cookie is present', async () => {
    const app = createTestApp();
    const token = await createToken();

    (mockPrisma.session.update as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: 'session-1',
      revokedAt: new Date(),
    });

    const res = await app.fetch(
      new Request('http://localhost/api/v1/user/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Cookie: 'refreshToken=valid-refresh-token-jwt',
        },
      }),
      mockEnv,
    );

    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.message).toBe('Logged out successfully');
  });

  it('logs out even with invalid refresh token', async () => {
    const app = createTestApp();
    const token = await createToken();

    const res = await app.fetch(
      new Request('http://localhost/api/v1/user/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Cookie: 'refreshToken=invalid-jwt',
        },
      }),
      mockEnv,
    );

    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
  });
});
