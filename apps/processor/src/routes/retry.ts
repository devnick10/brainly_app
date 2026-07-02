import { Hono } from 'hono';
import { AppContext } from '../types';

const retryRouter = new Hono<AppContext>();

retryRouter.post('/:contentId', async (c) => {
  const contentId = c.req.param('contentId');
  const prisma = c.get('prisma');

  try {
    const result = await prisma.content.updateMany({
      where: { id: contentId, status: 'FAILED' },
      data: { status: 'PROCESSING' },
    });

    if (result.count === 0) {
      return c.json({ message: 'Already processing or not found' }, 409);
    }

    await c.env.CONTENT_QUEUE.send({ contentId });

    return c.text(`Retry route is working for content ID: ${contentId}`);
  } catch (error) {
    return c.text('Internal server error', 500);
  }
});

export { retryRouter };
