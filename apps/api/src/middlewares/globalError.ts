import type { ErrorHandler } from 'hono';
import { HTTPException } from 'hono/http-exception';

export const onError: ErrorHandler = (err, c) => {
  const isProd = (c.env?.NODE_ENV || 'production') === 'production';

  if (!isProd) {
    console.error('[Error Handler]:', err);
  }

  if (err instanceof HTTPException) {
    return c.json(
      {
        success: false,
        message: err.message,
        cause: err.cause,
      },
      err.status,
    );
  }

  const errorMessage = err instanceof Error ? err.message : 'Unknown Error';
  return isProd
    ? c.json({ success: false, message: errorMessage }, 500)
    : c.json(
        {
          success: false,
          message: errorMessage,
          debug: err instanceof Error ? err.message : String(err),
          stack: err instanceof Error ? err.stack : undefined,
        },
        500,
      );
};
