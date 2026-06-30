import { HTTPException } from 'hono/http-exception';
import { ContentProcessingJob } from '../types';

export const publisher = async (
  queue: Queue,
  message: ContentProcessingJob,
): Promise<void> => {
  try {
    await queue.send(message);
  } catch (error) {
    console.error('Failed to publish queue message:', error);

    throw new HTTPException(500, {
      message: 'Failed to enqueue content for processing',
    });
  }
};
