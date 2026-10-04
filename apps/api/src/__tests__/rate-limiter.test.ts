import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Hono } from 'hono';
import { createRateLimit } from '../middlewares/rate-limiter';
import { evaluate, type Buckets } from '../lib/sliding-window';
import { mockEnv, mockRateLimiter } from './helpers';

const LIMIT = 5;
const WINDOW = 60;

const at = (second: number) => second * 1000;

const run = (buckets: Buckets, nowSecond: number, limit = LIMIT) =>
  evaluate({ buckets, now: at(nowSecond), limit, window: WINDOW });

/** Feeds `count` requests into the same second and returns the final result. */
const burst = (
  buckets: Buckets,
  nowSecond: number,
  count: number,
  limit = LIMIT,
) => {
  let result = run(buckets, nowSecond, limit);

  for (let i = 1; i < count; i++) {
    result = run(result.buckets, nowSecond, limit);
  }

  return result;
};

describe('evaluate', () => {
  it('allows requests while under the limit', () => {
    const result = run({}, 1000);

    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(LIMIT - 1);
    expect(result.buckets).toEqual({ '1000': 1 });
  });

  it('counts every request inside a single second', () => {
    const result = burst({}, 1000, LIMIT);

    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(0);
  });

  it('rejects once the limit is exceeded and does not record rejects', () => {
    const result = burst({}, 1000, LIMIT + 1);

    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
    expect(result.buckets).toEqual({ '1000': LIMIT });
  });

  it('keeps rejecting while the window stays full', () => {
    const full = burst({}, 1000, LIMIT).buckets;

    expect(run(full, 1030).allowed).toBe(false);
    expect(run(full, 1059).allowed).toBe(false);
  });

  it('frees capacity one second after the oldest request leaves the window', () => {
    const full = burst({}, 1000, LIMIT).buckets;

    expect(run(full, 1060).allowed).toBe(true);
  });

  it('does not allow a 2x burst across a window boundary', () => {
    // The failure mode of a fixed window: spend the whole budget just before
    // the boundary, then spend it again just after.
    const spent = burst({}, 1000, LIMIT).buckets;
    const boundary = burst(spent, 1000, 1).buckets;

    const afterBoundary = burst(boundary, 1001, LIMIT);

    expect(afterBoundary.allowed).toBe(false);
  });

  it('prunes buckets that fell out of the window', () => {
    const full = burst({}, 1000, LIMIT).buckets;

    const result = run(full, 1200);

    expect(Object.keys(result.buckets)).toEqual(['1200']);
  });

  it('ignores future buckets', () => {
    const result = run({ '1000': 3, '1100': 99 }, 1000);

    expect(result.buckets).toEqual({ '1000': 4 });
  });

  it('reports reset from the oldest request, not the newest', () => {
    // Second 950 is inside the window (940 < 950 <= 1000); if reset were
    // derived from the newest request it would be 1060, not 1010.
    const result = burst({ '950': 2 }, 1000, 1);

    expect(result.reset).toBe(at(1010));
  });

  it('reports retryAfter only when rejecting', () => {
    const full = burst({}, 1000, LIMIT + 1);

    expect(full.retryAfter).toBe(60);
    expect(burst({}, 1000, 1).retryAfter).toBe(0);
  });

  it('honours a per-route limit against the same shared buckets', () => {
    const full = burst({}, 1000, LIMIT).buckets;

    // 3/min route reading buckets written by the 5/min route.
    expect(run(full, 1000, 3).allowed).toBe(false);
  });

  it('handles a window smaller than one second of traffic', () => {
    const result = burst({}, 1000, 3, 2);

    expect(result.allowed).toBe(false);
    expect(result.buckets).toEqual({ '1000': 2 });
  });
});

const stub = (response: Response) => {
  const fetchMock = vi.fn().mockResolvedValue(response);

  vi.spyOn(mockRateLimiter, 'get').mockReturnValue({ fetch: fetchMock });

  return fetchMock;
};

function createTestApp() {
  const app = new Hono();

  app.use('*', createRateLimit(5, 60));
  app.get('/', (c) => c.text('ok'));

  return app;
}

const request = (app: Hono) =>
  app.fetch(
    new Request('http://localhost/', {
      headers: { 'CF-Connecting-IP': '1.2.3.4' },
    }),
    mockEnv,
  );

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('createRateLimit', () => {
  it('keys the Durable Object by client IP', async () => {
    stub(new Response('OK'));

    await request(createTestApp());

    expect(mockRateLimiter.idFromName).toHaveBeenCalledWith('1.2.3.4');
  });

  it('passes the route limit and window to the Durable Object', async () => {
    const fetchMock = stub(new Response('OK'));

    await request(createTestApp());

    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({
      limit: 5,
      window: 60,
    });
  });

  it('forwards the rate limit headers to the client', async () => {
    stub(
      new Response('OK', {
        headers: {
          'X-RateLimit-Limit': '5',
          'X-RateLimit-Remaining': '4',
          'X-RateLimit-Reset': '1060',
        },
      }),
    );

    const res = await request(createTestApp());

    expect(res.status).toBe(200);
    expect(res.headers.get('X-RateLimit-Limit')).toBe('5');
    expect(res.headers.get('X-RateLimit-Remaining')).toBe('4');
    expect(res.headers.get('X-RateLimit-Reset')).toBe('1060');
    expect(res.headers.get('Retry-After')).toBeNull();
  });

  it('returns 429 with Retry-After when the Durable Object rejects', async () => {
    stub(
      new Response('Too Many Requests', {
        status: 429,
        headers: { 'X-RateLimit-Remaining': '0', 'Retry-After': '60' },
      }),
    );

    const res = await request(createTestApp());

    expect(res.status).toBe(429);
    expect(res.headers.get('Retry-After')).toBe('60');
    expect(await res.json()).toEqual({ message: 'Too many requests' });
  });

  it('does not set headers the Durable Object omitted', async () => {
    stub(new Response('OK'));

    const res = await request(createTestApp());

    expect(res.headers.get('X-RateLimit-Limit')).toBeNull();
  });
});
