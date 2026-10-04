/**
 * Sliding window rate limiting.
 *
 * Kept free of any Workers/Durable Object imports so the algorithm can be unit
 * tested directly, and so the decision logic stays separate from the transport
 * that carries it.
 */

/**
 * The "Request Store" from the sliding window design: a map of epoch second ->
 * number of requests served during that second. Keys are strings because this
 * has to survive a JSON round trip through Durable Object storage.
 */
export type Buckets = Record<string, number>;

export type RateLimitResult = {
  /** Whether the request is allowed through. */
  allowed: boolean;
  /** How many requests the client may still make inside the current window. */
  remaining: number;
  /** Epoch ms at which the oldest in-window request expires and capacity frees up. */
  reset: number;
  /** Whole seconds the client should wait before retrying (0 when allowed). */
  retryAfter: number;
  /** State to persist: pruned buckets, with this request registered if allowed. */
  buckets: Buckets;
};

/**
 * The whole algorithm as one pure function: sum the buckets that fall inside
 * the window, register the request if there is room, and report the result.
 *
 * A bucket is inside the window when `epochSecond > nowSecond - window`, which
 * means the window slides forward by one second on every request instead of
 * resetting on a fixed boundary. That is the entire difference from a fixed
 * window counter, and it removes the 2x burst a client could previously squeeze
 * out either side of a window boundary.
 *
 * @param buckets Current state, i.e. every request seen so far this window.
 * @param now Current time in epoch milliseconds.
 * @param limit Requests allowed per window.
 * @param window Window length in seconds.
 */
export function evaluate({
  buckets,
  now,
  limit,
  window,
}: {
  buckets: Buckets;
  now: number;
  limit: number;
  window: number;
}): RateLimitResult {
  const nowSecond = Math.floor(now / 1000);

  // Buckets older than this fall out of the window and can never be counted
  // again, so drop them in the same pass we sum in. Pruning lazily keeps
  // storage bounded to `window` entries without needing a background sweeper.
  const windowStart = nowSecond - window + 1;

  const next: Buckets = {};
  let total = 0;
  let oldestSecond = nowSecond;

  for (const [key, count] of Object.entries(buckets)) {
    const second = Number(key);

    if (second < windowStart || second > nowSecond) continue;

    next[key] = count;
    total += count;

    if (second < oldestSecond) oldestSecond = second;
  }

  // Register the request only if it fits. Rejected requests are never counted,
  // otherwise a client stuck in a retry loop would keep its own window full.
  const allowed = total < limit;

  if (allowed) {
    const current = String(nowSecond);

    next[current] = (next[current] ?? 0) + 1;
    total += 1;
  }

  // Capacity frees up one second after the oldest bucket in the window rolls
  // out, not one second after the newest request.
  const reset = (oldestSecond + window) * 1000;

  return {
    allowed,
    remaining: Math.max(0, limit - total),
    reset,
    retryAfter: allowed ? 0 : Math.max(1, Math.ceil((reset - now) / 1000)),
    buckets: next,
  };
}
