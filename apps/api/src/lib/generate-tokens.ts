import { HTTPException } from 'hono/http-exception';
import { SignJWT } from 'jose';
import { Bindings } from '../types';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

type GenerateTokenPairPayload = {
  env: Pick<
    Bindings,
    | 'ACCESS_TOKEN_SECRET'
    | 'REFRESH_TOKEN_SECRET'
    | 'ACCESS_TOKEN_EXPIRY'
    | 'REFRESH_TOKEN_EXPIRY'
  >;
  userId: string;
  sessionId: string;
};

const ISSUER = 'brainly-api';
const AUDIENCE = 'brainly-client';

export async function generateAccessToken(
  userId: string,
  accessTokenSecret: string,
  accessTokenExpiry: string,
): Promise<string> {
  try {
    return await new SignJWT({})
      .setProtectedHeader({ alg: 'HS256' })
      .setSubject(userId)
      .setIssuer(ISSUER)
      .setAudience(AUDIENCE)
      .setIssuedAt()
      .setExpirationTime(accessTokenExpiry)
      .sign(new TextEncoder().encode(accessTokenSecret));
  } catch (error) {
    console.error(error);
    throw new HTTPException(500, {
      message: 'Failed to generate access token',
    });
  }
}

export async function generateRefreshToken(
  userId: string,
  sessionId: string,
  refreshTokenSecret: string,
  refreshTokenExpiry: string,
): Promise<string> {
  try {
    return await new SignJWT({
      sid: sessionId,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setSubject(userId)
      .setIssuer(ISSUER)
      .setAudience(AUDIENCE)
      .setIssuedAt()
      .setExpirationTime(refreshTokenExpiry)
      .sign(new TextEncoder().encode(refreshTokenSecret));
  } catch (error) {
    console.error(error);
    throw new HTTPException(500, {
      message: 'Failed to generate refresh token',
    });
  }
}

export async function generateTokenPair({
  env,
  sessionId,
  userId,
}: GenerateTokenPairPayload): Promise<TokenPair> {
  const [accessToken, refreshToken] = await Promise.all([
    generateAccessToken(
      userId,
      env.ACCESS_TOKEN_SECRET,
      env.ACCESS_TOKEN_EXPIRY,
    ),
    generateRefreshToken(
      userId,
      sessionId,
      env.REFRESH_TOKEN_SECRET,
      env.REFRESH_TOKEN_EXPIRY,
    ),
  ]);

  return {
    accessToken,
    refreshToken,
  };
}
