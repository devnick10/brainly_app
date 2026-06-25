import { Hono } from "hono"
import { SignJWT } from 'jose'
import { HTTPException } from 'hono/http-exception'
import { AppContext } from "../types"
import { signinSchema, signupSchema } from "../schema/userSchema"
import { zValidator } from "../middlewares/validator"

const userRouter = new Hono<AppContext>()

userRouter.post("/signup", zValidator('json', signupSchema), async (c) => {
  const { email, password } = c.req.valid('json')
  const prisma = c.get("prisma")

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    throw new HTTPException(409, { message: "User already signed up" })
  }

  const user = await prisma.user.create({
    data: { email, password }
  })

  const token = await new SignJWT({ id: user.id })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('12h')
    .sign(new TextEncoder().encode(c.env.JWT_SECRET))

  return c.json({
    success: true,
    message: "Signup successfully.",
    token
  })
})

userRouter.post("/signin", zValidator('json', signinSchema), async (c) => {
  const { email, password } = c.req.valid('json')
  const prisma = c.get("prisma")

  const user = await prisma.user.findUnique({
    where: { email }
  })

  if (!user || user.password !== password) {
    throw new HTTPException(401, { message: "Incorrect credentials" })
  }

  const token = await new SignJWT({ id: user.id })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('1h')
    .sign(new TextEncoder().encode(c.env.JWT_SECRET))

  return c.json({
    success: true,
    message: "Signin successfully",
    token
  })
})

export { userRouter };
