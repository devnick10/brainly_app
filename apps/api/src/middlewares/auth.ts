import { createMiddleware } from 'hono/factory';
import { jwtVerify } from 'jose';
import { AppContext } from '../types';
import { HTTPException } from 'hono/http-exception';

export const authMiddleware = createMiddleware<AppContext>(async (c, next) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader) {
    throw new HTTPException(401, { message: 'Unauthorized' });
  }

  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(c.env.ACCESS_TOKEN_SECRET),
      );
      if (!payload.sub) {
        throw new HTTPException(401, { message: 'Unauthorized' });
      }
      c.set('userId', payload.sub as string);
    } catch (error) {
      if (error instanceof Error && error.name === 'JWTExpired') {
        throw new HTTPException(401, {
          message: 'Token expired',
          cause: 'AUTH_TOKEN_EXPIRED',
        });
      }
      throw new HTTPException(401, { message: 'Unauthorized' });
    }
  }

  await next();
});
