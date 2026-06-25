import { createMiddleware } from 'hono/factory'
import { jwtVerify } from 'jose'
import { AppContext } from '../types'

export const authMiddleware = createMiddleware<AppContext>(async (c, next) => {
  const authHeader = c.req.header('Authorization')

  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7)
    try {
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(c.env.JWT_SECRET)
      )
      c.set("userId", payload.id as string)
    } catch {
      // invalid token - continue without userId
    }
  }

  await next()
})
