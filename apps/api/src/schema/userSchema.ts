import z from 'zod';

const signinSchema = z.object({
  email: z.email().min(3).max(50),
  password: z.string().min(4).max(100),
});

const signupSchema = signinSchema;

const googleSchema = z.object({
  credential: z.string().min(1),
});

export type Signin = z.infer<typeof signinSchema>;
export type Signup = z.infer<typeof signupSchema>;
export type GoogleAuth = z.infer<typeof googleSchema>;

export { signupSchema, signinSchema, googleSchema };
