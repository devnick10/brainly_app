import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { authMiddleware } from './middlewares/auth'
import { AppContext } from './types'


const app = new Hono<AppContext>()

/**
 * TODO
 * 1. add DB with schema -- with vector  
 * 2. implement brain routes 
 * 3. Symantic search,
 * 4. add auth, 
 */

// cors 
app.use('*', async (c, next) => {
  const middleware = cors({
    origin: c.env.ACCESS_ORIGIN,
  })
  return middleware(c, next)
})

// middleware

app.use(authMiddleware)
app.use(logger())

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

export default app
