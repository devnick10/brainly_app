import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { publisher } from '../lib/publisher';
import { authMiddleware } from '../middlewares/auth';
import { zValidator } from '../middlewares/validator';
import { CreateContentSchema, ShareLinkSchema } from '../schema/brainSchema';
import { AppContext, SearchResult } from '../types';
import { generateEmbedding } from '@brainly/ai';

const brainRouter = new Hono<AppContext>();

brainRouter.get('/search', authMiddleware, async (c) => {
  const prisma = c.get('prisma');
  const userId = c.get('userId');

  const query = c.req.query('q')?.trim();
  if (!query || query.length < 2) {
    return c.json({ success: true, content: [] });
  }

  try {
    const embedding = await generateEmbedding(query, c.env.AI);
    const embeddingStr = `[${embedding.join(',')}]`;

    const results = await prisma.$queryRaw<SearchResult>`
      SELECT
        id,
        title,
        description,
        link,
        type,
        "searchableText",
        "imageUrl",
        "userId",
        "createdAt",
        embedding <-> ${embeddingStr}::vector AS distance
      FROM "Content"
      WHERE "userId" = ${userId}
        AND status = 'COMPLETED'
      ORDER BY distance
      LIMIT 10;
    `;

    return c.json({ success: true, content: results });
  } catch (error) {
    console.error(error);
    throw new HTTPException(500, { message: 'Failed to search content.' });
  }
});

brainRouter.get('/', authMiddleware, async (c) => {
  try {
    const userId = c.get('userId');
    const prisma = c.get('prisma');

    const content = await prisma.content.findMany({
      where: { userId },
      include: { tags: true },
      orderBy: { createdAt: 'desc' },
      omit: {
        searchableText: true,
      },
    });

    return c.json({ success: true, content });
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
    const userId = c.get('userId');
    const { link, title, description, type, tags } = c.req.valid('json');
    const prisma = c.get('prisma');

    try {
      // Create the content entry in the database
      const newContent = await prisma.content.create({
        data: {
          link,
          title,
          description,
          type,
          userId,
          ...(tags?.length && {
            tags: {
              connectOrCreate: tags.map((tag) => ({
                where: { title: tag },
                create: { title: tag },
              })),
            },
          }),
        },
      });
      // Pushlish to queue
      await publisher(c.env.CONTENT_QUEUE, { contentId: newContent.id });

      return c.json({
        message: 'Content created successfully',
      });
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

    const result = await prisma.content.deleteMany({
      where: { id: contentId, userId },
    });

    if (result.count === 0) {
      throw new HTTPException(404, {
        message: 'Content not found or not authorized',
      });
    }

    return c.json({
      success: true,
      message: 'content deleted',
    });
  } catch (error) {
    console.error(error);
    throw new HTTPException(500, { message: 'Failed to delete content.' });
  }
});

brainRouter.post('/share', authMiddleware, async (c) => {
  const userId = c.get('userId');
  const prisma = c.get('prisma');
  let share: boolean;
  try {
    const body = await c.req.json();
    share = body.share;
  } catch {
    throw new HTTPException(400, { message: 'Invalid request body' });
  }

  try {
    if (share) {
      const linkExist = await prisma.link.findFirst({ where: { userId } });

      if (linkExist) {
        return c.json({ success: true, hash: linkExist.hash });
      }

      const hash = crypto.randomUUID().replace(/-/g, '');

      await prisma.link.create({
        data: { hash, userId },
      });

      return c.json({ success: true, hash });
    } else {
      await prisma.link.deleteMany({ where: { userId } });

      return c.json({ success: true, message: 'Remove link' });
    }
  } catch (error) {
    console.error(error);
    throw new HTTPException(500, { message: 'Failed to delete content.' });
  }
});

brainRouter.get(
  '/:sharelink',
  zValidator('json', ShareLinkSchema),
  async (c) => {
    //TODO: verify  schema ans impelemtation with ai ;
    const isValidId = /^[a-fA-F0-9]{32}$/.test(c.req.valid('json'));
    if (!isValidId) {
      return c.json({ success: false, message: 'Invalid share link' });
    }

    try {
      const prisma = c.get('prisma');
      const hash = c.req.param('sharelink');

      const link = await prisma.link.findFirst({ where: { hash } });

      if (!link) {
        return c.json({ success: false, message: 'sorry incorrect inputs' });
      }

      const content = await prisma.content.findMany({
        where: { userId: link.userId },
        omit: {
          searchableText: true,
        },
      });

      return c.json({ success: true, content });
    } catch (error) {
      console.error(error);
      throw new HTTPException(500, { message: 'Failed to get brain.' });
    }
  },
);

export { brainRouter };
