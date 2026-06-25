import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { createMiddleware } from 'hono/factory'
import { authMiddleware } from './middlewares/auth'
import { AppContext } from './types'
import { createPrismaClient } from './lib/prisma'
import { brainRouter } from './routes/brain'
import { userRouter } from './routes/user'

const app = new Hono<AppContext>()

app.use('*', cors({
  origin: (origin, c) => {
    const ctx = c;
    return ctx.env?.ACCESS_ORIGIN || origin
  },
  credentials: true,
}))

app.use('*', createMiddleware<AppContext>(async (c, next) => {
  const prisma = createPrismaClient(c.env.DATABASE_URL)
  c.set("prisma", prisma)
  await next()
  await prisma.$disconnect()
}))

app.use(logger())

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.get("/test-embedding", async (c) => {
  const response = await c.env.AI.run(
    "@cf/baai/bge-base-en-v1.5",
    { text: ["hello world"] }
  )
  return c.json(response)
})

app.use("/api/v1/brain/*", authMiddleware)
app.route("/api/v1/brain", brainRouter)
app.route("/api/v1/user", userRouter)

export default app
