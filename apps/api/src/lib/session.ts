import cuid from 'cuid';
import { Context } from 'hono';
import { setCookie } from 'hono/cookie';
import { HTTPException } from 'hono/http-exception';
import { AppContext } from '../types';
import { generateTokenPair } from './generate-tokens';
import { sha256 } from './sha256';

export async function createSession(
  c: Context<AppContext>,
  userId: string,
): Promise<{ accessToken: string }> {
  try {
    const prisma = c.get('prisma');
    const sessionId = cuid(); // prisma id generator

    const { accessToken, refreshToken } = await generateTokenPair({
      env: c.env,
      sessionId,
      userId,
    });

    // hash refresh token
    const refreshTokenHash = await sha256(refreshToken);
    // Set expiration to 30 days from now
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 10);
    await prisma.session.create({
      data: {
        id: sessionId,
        refreshTokenHash,
        expiresAt: expiryDate,
        userId: userId,
      },
    });

    // Set Refresh Token in cookie
    const isProduction = c.env.NODE_ENV === 'production';
    setCookie(c, 'refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'None' : 'Lax',
      path: '/api/v1/user',
      maxAge: 60 * 60 * 24 * 10, // 10days
    });
    return { accessToken };
  } catch (error) {
    console.error(error);

    if (error instanceof HTTPException) {
      throw error;
    }

    throw new HTTPException(500, {
      message: 'Failed to create session',
    });
  }
}
