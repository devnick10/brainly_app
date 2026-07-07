import type { Context } from 'hono';
import type { ContentfulStatusCode } from 'hono/utils/http-status';

export function success(
  c: Context,
  data: Record<string, unknown> = {},
  status: ContentfulStatusCode = 200,
) {
  return c.json({ success: true, ...data }, status);
}

export function error(
  c: Context,
  message: string,
  status: ContentfulStatusCode = 500,
  cause?: unknown,
) {
  const body: Record<string, unknown> = { success: false, message };
  if (cause !== undefined) body.cause = cause;
  return c.json(body, status);
}
