import { compare, hash } from 'bcryptjs';
import { HTTPException } from 'hono/http-exception';
import { jwtVerify } from 'jose';
import { generateTokenPair } from '../lib/generate-tokens';
import { sha256 } from '../lib/sha256';
import type { ExtendedPrismaClient } from '@brainly/db';
import type { AppContext } from '../types';

export async function signup(
  prisma: ExtendedPrismaClient,
  email: string,
  password: string,
): Promise<{ userId: string }> {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new HTTPException(409, { message: 'User already signed up' });
  }

  const hashedPassword = await hash(password, 10);

  const user = await prisma.user.create({
    data: { email, password: hashedPassword },
  });

  return { userId: user.id };
}

export async function signin(
  prisma: ExtendedPrismaClient,
  email: string,
  password: string,
): Promise<{ userId: string }> {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new HTTPException(401, { message: 'Incorrect credentials' });
  }

  const isValid = await compare(password, user.password);
  if (!isValid) {
    throw new HTTPException(401, { message: 'Incorrect credentials' });
  }

  return { userId: user.id };
}

export async function googleAuth(
  prisma: ExtendedPrismaClient,
  credential: string,
): Promise<{ userId: string; isExisting: boolean }> {
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
  };

  if (!userInfo.email) {
    throw new HTTPException(400, { message: 'Email required from Google' });
  }

  const existingUser = await prisma.user.findFirst({
    where: { OR: [{ googleId: userInfo.sub }, { email: userInfo.email }] },
  });

  let userId: string;
  let isExisting = true;

  if (existingUser) {
    userId = existingUser.id;
    if (!existingUser.googleId) {
      await prisma.user.update({
        where: { id: existingUser.id },
        data: { googleId: userInfo.sub },
      });
    }
  } else {
    isExisting = false;
    const user = await prisma.user.create({
      data: {
        email: userInfo.email,
        password: crypto.randomUUID(),
        googleId: userInfo.sub,
      },
    });
    userId = user.id;
  }

  return { userId, isExisting };
}

export async function resetPassword(
  prisma: ExtendedPrismaClient,
  email: string,
  password: string,
): Promise<void> {
  const user = await prisma.user.update({
    where: { email },
    data: { password: await hash(password, 10) },
  });

  if (!user) {
    throw new HTTPException(404, { message: 'Invalid credentials' });
  }
}

export async function logout(
  prisma: ExtendedPrismaClient,
  sessionId?: string,
): Promise<void> {
  if (sessionId) {
    await prisma.session.update({
      where: { id: sessionId },
      data: { revokedAt: new Date() },
    });
  }
}

export async function refreshSession(
  prisma: ExtendedPrismaClient,
  env: AppContext['Bindings'],
  incomingRefreshToken: string,
): Promise<{ accessToken: string; refreshToken: string }> {
  const { payload } = await jwtVerify(
    incomingRefreshToken,
    new TextEncoder().encode(env.REFRESH_TOKEN_SECRET),
  );

  if (!payload.sub || !payload.sid) {
    throw new HTTPException(401);
  }

  const session = await prisma.session.findUnique({
    where: { id: payload.sid as string },
  });

  if (!session) {
    throw new HTTPException(401, { message: 'Invalid refresh token' });
  }

  if (session.revokedAt) {
    throw new HTTPException(401);
  }

  if (session.expiresAt < new Date()) {
    throw new HTTPException(401);
  }

  const incomingHash = await sha256(incomingRefreshToken);
  if (incomingHash !== session.refreshTokenHash) {
    throw new HTTPException(401, { message: 'Invalid refresh token' });
  }

  const tokens = await generateTokenPair({
    env,
    sessionId: session.id,
    userId: session.userId,
  });

  await prisma.session.update({
    where: { id: session.id },
    data: { refreshTokenHash: await sha256(tokens.refreshToken) },
  });

  return tokens;
}
