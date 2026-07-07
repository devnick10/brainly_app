import { HTTPException } from 'hono/http-exception';
import type { ExtendedPrismaClient } from '@brainly/db';

export async function getUserById(
  prisma: ExtendedPrismaClient,
  userId: string,
) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    omit: { password: true },
  });

  if (!user) {
    throw new HTTPException(404, { message: 'User not found' });
  }

  return user;
}
