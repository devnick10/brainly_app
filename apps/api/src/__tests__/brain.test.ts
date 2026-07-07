import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Hono } from 'hono';
import { createMiddleware } from 'hono/factory';
import { SignJWT } from 'jose';
import { brainRouter } from '../routes/brain';
import { userRouter } from '../routes/user';
import type { AppContext } from '../types';
import { mockEnv, mockPrisma } from './helpers';

vi.mock('@brainly/ai');
import { generateEmbedding } from '@brainly/ai';

const mockedGenerateEmbedding = vi.mocked(generateEmbedding);

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

describe('GET /api/v1/brain/search', () => {
  beforeEach(() => {
    mockedGenerateEmbedding.mockResolvedValue([0.1, 0.2, 0.3]);
  });

  it('returns empty array when query is too short', async () => {
    const app = createTestApp();
    const token = await createToken();

    const res = await app.fetch(
      new Request('http://localhost/api/v1/brain/search?q=a', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      }),
      mockEnv,
    );

    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.content).toEqual([]);
  });

  it('returns search results for valid query', async () => {
    const app = createTestApp();
    const token = await createToken();

    (mockPrisma.$queryRaw as ReturnType<typeof vi.fn>).mockResolvedValue([
      {
        id: 'c1',
        title: 'Test Result',
        distance: 0.15,
      },
    ]);

    const res = await app.fetch(
      new Request('http://localhost/api/v1/brain/search?q=test+query', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      }),
      mockEnv,
    );

    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.content).toHaveLength(1);
    expect(data.content[0].title).toBe('Test Result');
  });

  it('sanitizes non-printable characters from query', async () => {
    const app = createTestApp();
    const token = await createToken();

    (mockPrisma.$queryRaw as ReturnType<typeof vi.fn>).mockResolvedValue([]);

    const res = await app.fetch(
      new Request(
        'http://localhost/api/v1/brain/search?q=hello%00world%01test',
        {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        },
      ),
      mockEnv,
    );

    expect(res.status).toBe(200);

    const sanitizedQuery = mockedGenerateEmbedding.mock.calls[0][0];
    expect(sanitizedQuery).toBe('helloworldtest');
    expect(sanitizedQuery).not.toContain('\x00');
    expect(sanitizedQuery).not.toContain('\x01');
  });

  it('returns 401 without auth header', async () => {
    const app = createTestApp();

    const res = await app.fetch(
      new Request('http://localhost/api/v1/brain/search?q=test', {
        method: 'GET',
      }),
      mockEnv,
    );

    expect(res.status).toBe(401);
  });
});
