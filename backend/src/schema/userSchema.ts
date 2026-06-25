import z from "zod";

const signinSchema = z.object({
    email: z.email().min(3).max(50),
    password: z.string().min(4).max(100),
})

const signupSchema = signinSchema;

export type Signin = z.infer<typeof signinSchema>; 
export type Signup = z.infer<typeof signupSchema>; 

export {
    signupSchema,
    signinSchema
}