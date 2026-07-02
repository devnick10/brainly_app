import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Hono } from 'hono';
import { createMiddleware } from 'hono/factory';
import { SignJWT } from 'jose';
import { brainRouter } from '../routes/brain';
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
  app.route('/api/v1/brain', brainRouter);
  return app;
}

async function createToken(userId = 'user-1') {
  return await new SignJWT({ id: userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('1h')
    .sign(new TextEncoder().encode(mockEnv.JWT_SECRET));
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('GET /api/v1/brain', () => {
  it('returns content list', async () => {
    const app = createTestApp();
    const token = await createToken();

    (mockPrisma.content.findMany as ReturnType<typeof vi.fn>).mockResolvedValue(
      [
        {
          id: 'c1',
          title: 'Test Video',
          link: 'https://youtube.com/watch?v=abc',
          type: 'YOUTUBE',
          tags: [],
        },
      ],
    );

    const res = await app.fetch(
      new Request('http://localhost/api/v1/brain', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      }),
      mockEnv,
    );

    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.content).toHaveLength(1);
  });

  it('rejects expired or malformed token', async () => {
    const app = createTestApp();

    const res = await app.fetch(
      new Request('http://localhost/api/v1/brain', {
        method: 'GET',
        headers: { Authorization: 'Bearer bad-token' },
      }),
      mockEnv,
    );

    expect(res.status).toBe(401);
  });
});

describe('POST /api/v1/brain', () => {
  it('creates content with valid payload', async () => {
    const app = createTestApp();
    const token = await createToken();

    (mockPrisma.content.create as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: 'c1',
      title: 'Test Video',
      link: 'https://youtube.com/watch?v=abc',
      type: 'YOUTUBE',
    });

    const res = await app.fetch(
      new Request('http://localhost/api/v1/brain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          link: 'https://youtube.com/watch?v=abc',
          title: 'Test Video',
          type: 'YOUTUBE',
        }),
      }),
      mockEnv,
    );

    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.message).toBe('Content created successfully');
  });

  it('rejects invalid content type', async () => {
    const app = createTestApp();
    const token = await createToken();

    const res = await app.fetch(
      new Request('http://localhost/api/v1/brain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          link: 'https://example.com',
          title: 'Test',
          type: 'INVALID',
        }),
      }),
      mockEnv,
    );

    expect(res.status).toBe(400);
  });

  it('rejects expired or malformed token', async () => {
    const app = createTestApp();

    const res = await app.fetch(
      new Request('http://localhost/api/v1/brain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer bad-token',
        },
        body: JSON.stringify({
          link: 'https://example.com',
          title: 'Test',
          type: 'ARTICLE',
        }),
      }),
      mockEnv,
    );

    expect(res.status).toBe(401);
  });
});
