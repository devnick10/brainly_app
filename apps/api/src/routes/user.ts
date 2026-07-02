import { Hono } from 'hono';
import { SignJWT } from 'jose';
import { HTTPException } from 'hono/http-exception';
import { AppContext } from '../types';
import { signinSchema, signupSchema, googleSchema } from '../schema/userSchema';
import { zValidator } from '../middlewares/validator';
import { authMiddleware } from '../middlewares/auth';

const userRouter = new Hono<AppContext>();

userRouter.post('/signup', zValidator('json', signupSchema), async (c) => {
  try {
    const { email, password } = c.req.valid('json');
    const prisma = c.get('prisma');

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new HTTPException(409, { message: 'User already signed up' });
    }

    const user = await prisma.user.create({
      data: { email, password },
    });

    const token = await new SignJWT({ id: user.id })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('12h')
      .sign(new TextEncoder().encode(c.env.JWT_SECRET));

    return c.json({
      success: true,
      message: 'Signup successfully.',
      token,
    });
  } catch (error) {
    console.error(error);
    throw new HTTPException(500, { message: 'Internal server error' });
  }
});

userRouter.post('/signin', zValidator('json', signinSchema), async (c) => {
  const { email, password } = c.req.valid('json');
  const prisma = c.get('prisma');
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || user.password !== password) {
      throw new HTTPException(401, { message: 'Incorrect credentials' });
    }

    const token = await new SignJWT({ id: user.id })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('1h')
      .sign(new TextEncoder().encode(c.env.JWT_SECRET));

    return c.json({
      success: true,
      message: 'Signin successfully',
      token,
    });
  } catch (error) {
    console.error(error);
    throw new HTTPException(500, { message: 'Internal server error' });
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

    const token = await new SignJWT({ id: user.id })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('12h')
      .sign(new TextEncoder().encode(c.env.JWT_SECRET));

    return c.json({
      success: true,
      message: existingUser
        ? 'Signed in with Google successfully'
        : 'Signed up with Google successfully',
      token,
    });
  } catch (error) {
    console.error(error);
    throw new HTTPException(500, { message: 'Google authentication failed' });
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

export { userRouter };
