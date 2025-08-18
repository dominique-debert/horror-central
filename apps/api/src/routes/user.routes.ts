import { Hono } from 'hono'
import { authMiddleware } from '../lib/auth/jwt'
import { updateProfile, getProfile } from '../controllers/user.controller'

const userRoutes = new Hono()

// Apply auth middleware to all user routes
userRoutes.use('*', authMiddleware)

// Get current user profile
userRoutes.get('/me', getProfile)

// Update user profile
userRoutes.patch('/me', updateProfile)

export { userRoutes }
