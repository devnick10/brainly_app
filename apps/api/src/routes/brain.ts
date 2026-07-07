import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { authMiddleware } from '../middlewares/auth';
import { zValidator } from '../middlewares/validator';
import { CreateContentSchema, ShareLinkSchema } from '../schema/brainSchema';
import { AppContext } from '../types';
import { success, error } from '../lib/response';
import { onError } from '../middlewares/globalError';
import * as contentService from '../services/content.service';

const brainRouter = new Hono<AppContext>();

brainRouter.onError(onError);

brainRouter.get('/search', authMiddleware, async (c) => {
  const rawQuery = c.req.query('q')?.trim();
  if (!rawQuery || rawQuery.length < 2) {
    return success(c, { content: [] });
  }

  const query = rawQuery.replace(/[^\x20-\x7E\s]/g, '');

  try {
    const prisma = c.get('prisma');
    const userId = c.get('userId');

    const results = await contentService.searchContent(
      prisma,
      userId,
      query,
      c.env.AI,
    );

    return success(c, { content: results });
  } catch (error) {
    console.error(error);
    throw new HTTPException(500, { message: 'Failed to search content.' });
  }
});

brainRouter.get('/', authMiddleware, async (c) => {
  try {
    const prisma = c.get('prisma');
    const userId = c.get('userId');

    const content = await contentService.getUserContent(prisma, userId);

    return success(c, { content });
  } catch (error) {
    console.error(error);
    throw new HTTPException(500, { message: 'Failed to get content.' });
  }
});

brainRouter.post(
  '/',
  zValidator('json', CreateContentSchema),
  authMiddleware,
  async (c) => {
    try {
      const userId = c.get('userId');
      const prisma = c.get('prisma');
      const data = c.req.valid('json');

      await contentService.createContent(
        prisma,
        userId,
        data,
        c.env.CONTENT_QUEUE,
      );

      return success(c, { message: 'Content created successfully' });
    } catch (error) {
      console.error('Error creating content:', error);
      throw new HTTPException(500, { message: 'Failed to create content' });
    }
  },
);

brainRouter.delete('/:contentId', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const prisma = c.get('prisma');
    const contentId = c.req.param('contentId');

    await contentService.deleteContent(prisma, userId, contentId);

    return success(c, { message: 'content deleted' });
  } catch (error) {
    if (error instanceof HTTPException) throw error;
    console.error(error);
    throw new HTTPException(500, { message: 'Failed to delete content.' });
  }
});

brainRouter.post('/share', authMiddleware, async (c) => {
  let share: boolean;
  try {
    const body = await c.req.json();
    share = body.share;
  } catch {
    throw new HTTPException(400, { message: 'Invalid request body' });
  }

  try {
    const prisma = c.get('prisma');
    const userId = c.get('userId');

    if (share) {
      const existing = await contentService.getShareLink(prisma, userId);
      if (existing) {
        return success(c, { hash: existing.hash });
      }

      const hash = await contentService.createShareLink(prisma, userId);
      return success(c, { hash });
    } else {
      await contentService.removeShareLink(prisma, userId);
      return success(c, { message: 'Remove link' });
    }
  } catch (error) {
    console.error(error);
    throw new HTTPException(500, { message: 'Failed to update share link.' });
  }
});

brainRouter.get(
  '/:sharelink',
  zValidator('json', ShareLinkSchema),
  async (c) => {
    const isValidId = /^[a-fA-F0-9]{32}$/.test(c.req.valid('json'));
    if (!isValidId) {
      return error(c, 'Invalid share link', 400);
    }

    try {
      const prisma = c.get('prisma');
      const hash = c.req.param('sharelink');

      const content = await contentService.getSharedContent(prisma, hash);

      return success(c, { content });
    } catch (error) {
      if (error instanceof HTTPException) throw error;
      console.error(error);
      throw new HTTPException(500, { message: 'Failed to get brain.' });
    }
  },
);

export { brainRouter };
