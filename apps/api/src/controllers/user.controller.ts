import { Context } from 'hono'
import { prisma } from '../lib/prisma-client'
import { generateToken } from '../lib/auth/jwt'
import { UserSchema } from '../types/user'

export const updateProfile = async (c: Context) => {
  try {
    const userId = c.get('userId')
    const updates = await c.req.json()

    // Validate input
    const validatedData = UserSchema.partial().parse(updates)

    // Update user
    const user = await prisma.user.update({
      where: { id: userId },
      data: validatedData,
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        role: true,
      },
    })

    // Generate new token with updated user data
    const token = generateToken(user.id)

    return c.json({ user, token })
  } catch (error) {
    console.error('Profile update error:', error)
    return c.json({ error: 'Failed to update profile' }, 500)
  }
}

export const getProfile = async (c: Context) => {
  try {
    const userId = c.get('userId')

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!user) {
      return c.json({ error: 'User not found' }, 404)
    }

    return c.json({ user })
  } catch (error) {
    console.error('Get profile error:', error)
    return c.json({ error: 'Failed to fetch profile' }, 500)
  }
}
