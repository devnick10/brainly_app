import { createMiddleware } from 'hono/factory'
import { jwtVerify } from 'jose'
import { AppContext } from '../types'
import { HTTPException } from 'hono/http-exception'

export const authMiddleware = createMiddleware<AppContext>(async (c, next) => {
  const authHeader = c.req.header('Authorization')

  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1]
    try {
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(c.env.JWT_SECRET)
      )
      c.set("userId", payload.id as string)
    } catch {
      throw new HTTPException(401, { message: "Unauthorized" })
    }
  }

  await next()
})
