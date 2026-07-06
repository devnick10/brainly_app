import { z } from 'zod';

export function formatZodError(error: z.ZodError): {
  message: string;
  errors: Record<string, string>;
} {
  return {
    message: 'Validation failed',
    // Maps field names directly to their error messages
    // @ts-expect-error error is of type ZodError, which has a property 'errors' that is an array of ZodIssue objects. Each ZodIssue object has a 'path' property that is an array of strings representing the path to the field that caused the error, and a 'message' property that is a string describing the error.
    errors: error?.errors.reduce(
      (acc, issue) => {
        const path = issue.path.join('.');
        acc[path] = issue.message;
        return acc;
      },
      {} as Record<string, string>,
    ),
  };
}
