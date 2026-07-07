import { compare, hash } from 'bcryptjs';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { jwtVerify } from 'jose';
import { createSession } from '../lib/session';
import { authMiddleware } from '../middlewares/auth';
import errorMiddleware from '../middlewares/globalError';
import { zValidator } from '../middlewares/validator';
import { googleSchema, signinSchema, signupSchema } from '../schema/userSchema';
import { AppContext } from '../types';
import { getCookie, setCookie } from 'hono/cookie';
import { sha256 } from '../lib/sha256';
import { generateTokenPair } from '../lib/generate-tokens';
import { JOSEError, JWTExpired } from 'jose/errors';

const userRouter = new Hono<AppContext>();

// GLOBAL ERROR HANDLER
userRouter.use('*', errorMiddleware());

userRouter.post('/signup', zValidator('json', signupSchema), async (c) => {
  try {
    const { email, password } = c.req.valid('json');
    const prisma = c.get('prisma');

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new HTTPException(409, { message: 'User already signed up' });
    }

    const hashedPassword = await hash(password, 10);

    const user = await prisma.user.create({
      data: { email, password: hashedPassword },
    });

    const { accessToken } = await createSession(c, user.id);

    return c.json({
      success: true,
      message: 'Signup successfully.',
      token: accessToken,
    });
  } catch (error) {
    if (error instanceof HTTPException) {
      throw error;
    }

    console.error(error);
    throw new HTTPException(500, {
      message: 'Internal server error',
    });
  }
});

userRouter.post('/signin', zValidator('json', signinSchema), async (c) => {
  const { email, password } = c.req.valid('json');
  const prisma = c.get('prisma');
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new HTTPException(401, { message: 'Incorrect credentials' });
    }

    const isValid = await compare(password, user.password);
    if (!isValid) {
      throw new HTTPException(401, { message: 'Incorrect credentials' });
    }

    const { accessToken } = await createSession(c, user.id);

    return c.json({
      success: true,
      message: 'Signin successfully',
      token: accessToken,
    });
  } catch (error) {
    if (error instanceof HTTPException) {
      throw error;
    }

    console.error(error);
    throw new HTTPException(500, {
      message: 'Internal server error',
    });
  }
});

userRouter.post('/google', zValidator('json', googleSchema), async (c) => {
  try {
    const { credential } = c.req.valid('json');
    const prisma = c.get('prisma');

    const userInfoRes = await fetch(
      'https://www.googleapis.com/oauth2/v3/userinfo',
      {
        headers: { Authorization: `Bearer ${credential}` },
      },
    );

    if (!userInfoRes.ok) {
      throw new HTTPException(401, { message: 'Invalid Google token' });
    }

    const userInfo = (await userInfoRes.json()) as {
      sub: string;
      email: string;
      name?: string;
      picture?: string;
    };

    if (!userInfo.email) {
      throw new HTTPException(400, { message: 'Email required from Google' });
    }

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ googleId: userInfo.sub }, { email: userInfo.email }] },
    });

    let user;
    if (existingUser) {
      if (!existingUser.googleId) {
        user = await prisma.user.update({
          where: { id: existingUser.id },
          data: { googleId: userInfo.sub },
        });
      } else {
        user = existingUser;
      }
    } else {
      user = await prisma.user.create({
        data: {
          email: userInfo.email,
          password: crypto.randomUUID(),
          googleId: userInfo.sub,
        },
      });
    }

    const { accessToken } = await createSession(c, user.id);

    return c.json({
      success: true,
      message: existingUser
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
  const { email, password } = await c.req.json();
  const prisma = c.get('prisma');
  try {
    const hashedPassword = await hash(password, 10);
    const user = await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    if (!user) {
      throw new HTTPException(404, { message: 'Invalid credentials' });
    }

    return c.json({ message: 'Password updated successfully' }, 200);
  } catch {
    throw new HTTPException(500, { message: 'Internal server error' });
  }
});

userRouter.get('/me', authMiddleware, async (c) => {
  const userId = c.get('userId');
  const prisma = c.get('prisma');
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      omit: {
        password: true,
      },
    });

    if (!user) {
      throw new HTTPException(404, { message: 'user not found' });
    }

    return c.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(error);
    throw new HTTPException(500, { message: 'Internal server error' });
  }
});

userRouter.post('/refresh', async (c) => {
  const prisma = c.get('prisma');
  const incomingRefreshToken = getCookie(c, 'refreshToken');

  if (!incomingRefreshToken) {
    throw new HTTPException(401, {
      message: 'Refresh token missing',
    });
  }

  try {
    // Verify JWT
    const { payload } = await jwtVerify(
      incomingRefreshToken,
      new TextEncoder().encode(c.env.REFRESH_TOKEN_SECRET),
    );

    if (!payload.sub || !payload.sid) {
      throw new HTTPException(401);
    }

    const session = await prisma.session.findUnique({
      where: {
        id: payload.sid as string,
      },
    });

    if (!session) {
      throw new HTTPException(401, {
        message: 'Invalid refresh token',
      });
    }

    // Check revocation
    if (session.revokedAt) {
      throw new HTTPException(401);
    }

    // Check expiration
    if (session.expiresAt < new Date()) {
      throw new HTTPException(401);
    }

    // compare refreshtoken
    const incomingHash = await sha256(incomingRefreshToken);
    if (incomingHash !== session.refreshTokenHash) {
      throw new HTTPException(401, {
        message: 'Invalid refresh token',
      });
    }

    // Rotate
    const { accessToken, refreshToken } = await generateTokenPair({
      env: c.env,
      sessionId: session.id,
      userId: session.userId,
    });

    // Update session, Avoid unessary new rows
    await prisma.session.update({
      where: {
        id: session.id,
      },
      data: {
        refreshTokenHash: await sha256(refreshToken),
      },
    });

    const isProduction = c.env.NODE_ENV === 'production';
    setCookie(c, 'refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'None' : 'Lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 10, // 10 days
    });

    return c.json(
      {
        message: 'Token refresh sucessfully',
        token: accessToken,
      },
      200,
    );
  } catch (error) {
    if (
      error instanceof HTTPException ||
      error instanceof JWTExpired ||
      error instanceof JOSEError
    ) {
      throw new HTTPException(401, {
        message: 'Invalid refresh token',
      });
    }

    console.error(error);
    throw new HTTPException(500, {
      message: 'Failed to refresh access token.',
    });
  }
});

export { userRouter };
