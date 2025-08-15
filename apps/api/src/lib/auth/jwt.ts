import jwt from 'jsonwebtoken'
import { Context } from 'hono'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here'

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: '7d', // Token expires in 7 days
  })
}

export const verifyToken = (token: string): { userId: string } | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string }
  } catch (error) {
    return null
  }
}

export const authMiddleware = async (c: Context, next: () => Promise<void>) => {
  const authHeader = c.req.header('Authorization')
  const token = authHeader?.split(' ')[1]

  if (!token) {
    return c.json({ error: 'No token provided' }, 401)
  }

  const decoded = verifyToken(token)
  if (!decoded) {
    return c.json({ error: 'Invalid token' }, 401)
  }

  c.set('userId', decoded.userId)
  await next()
}
