import * as jwt from 'jsonwebtoken'
import type { SignOptions } from 'jsonwebtoken'
import { Context } from 'hono'
import { IJwtPayload, IAuthConfig } from '../../types'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here'

// Convert time strings to seconds for JWT
const A_DAY = 24 * 60 * 60; // seconds

const authConfig: IAuthConfig = {
  jwtSecret: JWT_SECRET,
  jwtExpiresIn: '7d',
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || 'your-refresh-secret',
  refreshTokenExpiresIn: '30d',
  passwordResetTokenExpiry: 24 // in hours
}

// Convert time string to seconds
const getExpiresInSeconds = (timeString: string): number => {
  const value = parseInt(timeString);
  if (timeString.endsWith('d')) return value * A_DAY;
  if (timeString.endsWith('h')) return value * 60 * 60;
  if (timeString.endsWith('m')) return value * 60;
  return value; // assume seconds if no unit specified
};

export const generateToken = (userId: string, role: string = 'USER'): string => {
  const payload: IJwtPayload = { 
    userId, 
    role: role as 'USER' | 'ADMIN' 
  }
  
  const options: SignOptions = {
    expiresIn: getExpiresInSeconds(authConfig.jwtExpiresIn),
    algorithm: 'HS256'
  }
  
  return jwt.sign(payload as object, authConfig.jwtSecret, options)
}

export const verifyToken = (token: string): IJwtPayload | null => {
  try {
    return jwt.verify(token, authConfig.jwtSecret) as IJwtPayload
  } catch (error) {
    console.error('Token verification failed:', error)
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
  if (!decoded || !decoded.userId) {
    return c.json({ error: 'Invalid or expired token' }, 401)
  }

  // Set user context for downstream handlers
  c.set('userId', decoded.userId)
  c.set('role', decoded.role || 'USER')
  await next()
}
