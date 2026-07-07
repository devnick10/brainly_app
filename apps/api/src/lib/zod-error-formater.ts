import { z } from 'zod';

export function formatZodError(error: z.ZodError): {
  message: string;
  errors: Record<string, string>;
} {
  return {
    message: 'Validation failed',
    // Maps field names directly to their error messages
    errors: error?.issues.reduce(
      (acc, issue) => {
        const path = issue.path.join('.');
        acc[path] = issue.message;
        return acc;
      },
      {} as Record<string, string>,
    ),
  };
}
