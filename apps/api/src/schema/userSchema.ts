import z from 'zod';

const signinSchema = z.object({
  email: z.email().min(3).max(50),
  password: z
    .string()
    .min(10)
    .max(100)
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(
      /[^A-Za-z0-9]/,
      'Password must contain at least one special character',
    ),
});

const signupSchema = signinSchema;

const googleSchema = z.object({
  credential: z.string().min(1),
});

export type Signin = z.infer<typeof signinSchema>;
export type Signup = z.infer<typeof signupSchema>;
export type GoogleAuth = z.infer<typeof googleSchema>;

export { signupSchema, signinSchema, googleSchema };
