import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { createMiddleware } from 'hono/factory'
import { logger } from 'hono/logger'
import { createPrismaClient } from './lib/prisma'
import { brainRouter } from './routes/brain'
import { userRouter } from './routes/user'
import { AppContext } from './types'

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

app.route("/api/v1/brain", brainRouter)
app.route("/api/v1/user", userRouter)

export default app
