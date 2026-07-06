import { zValidator as zv } from '@hono/zod-validator';
import type { ValidationTargets } from 'hono';
import { HTTPException } from 'hono/http-exception';
import * as z from 'zod';
import { formatZodError } from '../lib/zod-error-formater';

export const zValidator = <
  T extends z.ZodSchema,
  Target extends keyof ValidationTargets,
>(
  target: Target,
  schema: T,
) =>
  // eslint-disable-next-line
  zv(target, schema, (result, c) => {
    if (!result.success) {
      throw new HTTPException(
        400,
        formatZodError(result.error as unknown as z.ZodError),
      );
    }
  });
