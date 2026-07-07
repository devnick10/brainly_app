import { MiddlewareHandler } from 'hono';
import { HTTPException } from 'hono/http-exception';

const errorMiddleware = (): MiddlewareHandler => {
  return async (c, next) => {
    try {
      await next();
    } catch (err) {
      const isProd = (c.env?.NODE_ENV || 'production') === 'production';

      if (!isProd) {
        console.error('[Middleware Catch]:', err);
      }

      // 1. Manually intercept HTTPException instead of relying on err.getResponse()
      if (err instanceof HTTPException) {
        return c.json(
          {
            message: err.message,
            cause: err.cause,
          },
          err.status,
        );
      }

      // 2. Generic fallback errors (500)
      const errorMessage = err instanceof Error ? err.message : 'Unknown Error';
      const errorBody = isProd
        ? { message: errorMessage }
        : {
            message: errorMessage,
            debug: err instanceof Error ? err.message : String(err),
            stack: err instanceof Error ? err.stack : undefined,
          };
      return c.json(errorBody, 500);
    }
  };
};

export default errorMiddleware;
