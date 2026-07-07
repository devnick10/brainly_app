import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { getCookie, setCookie } from 'hono/cookie';
import { JOSEError, JWTExpired } from 'jose/errors';
import { createSession } from '../lib/session';
import { authMiddleware } from '../middlewares/auth';
import { zValidator } from '../middlewares/validator';
import { googleSchema, signinSchema, signupSchema } from '../schema/userSchema';
import { AppContext } from '../types';
import { success } from '../lib/response';
import { onError } from '../middlewares/globalError';
import * as authService from '../services/auth.service';
import * as userService from '../services/user.service';

const userRouter = new Hono<AppContext>();

userRouter.onError(onError);

userRouter.post('/signup', zValidator('json', signupSchema), async (c) => {
  try {
    const { email, password } = c.req.valid('json');
    const prisma = c.get('prisma');

    const { userId } = await authService.signup(prisma, email, password);
    const { accessToken } = await createSession(c, userId);

    return success(c, { message: 'Signup successfully.', token: accessToken });
  } catch (error) {
    if (error instanceof HTTPException) throw error;
    console.error(error);
    throw new HTTPException(500, { message: 'Internal server error' });
  }
});

userRouter.post('/signin', zValidator('json', signinSchema), async (c) => {
  try {
    const { email, password } = c.req.valid('json');
    const prisma = c.get('prisma');

    const { userId } = await authService.signin(prisma, email, password);
    const { accessToken } = await createSession(c, userId);

    return success(c, { message: 'Signin successfully', token: accessToken });
  } catch (error) {
    if (error instanceof HTTPException) throw error;
    console.error(error);
    throw new HTTPException(500, { message: 'Internal server error' });
  }
});

userRouter.post('/google', zValidator('json', googleSchema), async (c) => {
  try {
    const { credential } = c.req.valid('json');
    const prisma = c.get('prisma');

    const { userId, isExisting } = await authService.googleAuth(
      prisma,
      credential,
    );
    const { accessToken } = await createSession(c, userId);

    return success(c, {
      message: isExisting
        ? 'Signed in with Google successfully'
        : 'Signed up with Google successfully',
      token: accessToken,
    });
  } catch (error) {
    console.error(error);
    throw new HTTPException(500, { message: 'Google authentication failed' });
  }
});

userRouter.post('/reset', zValidator('json', signinSchema), async (c) => {
  try {
    const { email, password } = c.req.valid('json');
    const prisma = c.get('prisma');

    await authService.resetPassword(prisma, email, password);

    return success(c, { message: 'Password updated successfully' });
  } catch (error) {
    if (error instanceof HTTPException) throw error;
    throw new HTTPException(500, { message: 'Internal server error' });
  }
});

userRouter.get('/me', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const prisma = c.get('prisma');

    const user = await userService.getUserById(prisma, userId);

    return success(c, { user });
  } catch (error) {
    if (error instanceof HTTPException) throw error;
    console.error(error);
    throw new HTTPException(500, { message: 'Internal server error' });
  }
});

userRouter.post('/refresh', async (c) => {
  const prisma = c.get('prisma');
  const incomingRefreshToken = getCookie(c, 'refreshToken');

  if (!incomingRefreshToken) {
    throw new HTTPException(401, { message: 'Refresh token missing' });
  }

  try {
    const { accessToken, refreshToken } = await authService.refreshSession(
      prisma,
      c.env,
      incomingRefreshToken,
    );

    const isProduction = c.env.NODE_ENV === 'production';
    setCookie(c, 'refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'None' : 'Lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 10,
    });

    return success(c, {
      message: 'Token refresh successfully',
      token: accessToken,
    });
  } catch (error) {
    if (
      error instanceof HTTPException ||
      error instanceof JWTExpired ||
      error instanceof JOSEError
    ) {
      throw new HTTPException(401, { message: 'Invalid refresh token' });
    }
    console.error(error);
    throw new HTTPException(500, {
      message: 'Failed to refresh access token.',
    });
  }
});

export { userRouter };
