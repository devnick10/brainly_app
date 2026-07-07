import { zValidator as zv } from '@hono/zod-validator';
import type { ValidationTargets } from 'hono';
import * as z from 'zod';
import { formatZodError } from '../lib/zod-error-formater';

export const zValidator = <
  T extends z.ZodSchema,
  Target extends keyof ValidationTargets,
>(
  target: Target,
  schema: T,
) =>
  zv(target, schema, (result, c) => {
    if (!result.success) {
      const formattedError = formatZodError(
        result.error as unknown as z.ZodError,
      );
      return c.json(
        {
          success: false,
          message: formattedError.message,
          cause: formattedError.errors,
        },
        400,
      );
    }
  });
