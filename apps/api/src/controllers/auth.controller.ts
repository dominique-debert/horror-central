import { Context } from 'hono'
import { UserSchema } from '../types/user'
import { hashPassword, verifyPassword } from '../lib/auth/password'
import { generateToken } from '../lib/auth/jwt'
import { prisma } from '../lib/prisma-client'

export const register = async (c: Context) => {
  try {
    const { email, password, name } = await c.req.json()

    // Validate input
    const validatedData = UserSchema.parse({ email, password, name })

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    })

    if (existingUser) {
      return c.json({ error: 'Email already in use' }, 400)
    }

    // Hash password
    const hashedPassword = await hashPassword(validatedData.password)

    // Create user
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
        name: validatedData.name,
      },
    })

    // Generate JWT
    const token = generateToken(user.id)

    return c.json({ token, user: { id: user.id, email: user.email, name: user.name } })
  } catch (error) {
    console.error('Registration error:', error)
    return c.json({ error: 'Registration failed' }, 500)
  }
}

export const login = async (c: Context) => {
  try {
    const { email, password } = await c.req.json()

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return c.json({ error: 'Invalid credentials' }, 401)
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password)
    if (!isValid) {
      return c.json({ error: 'Invalid credentials' }, 401)
    }

    // Generate JWT
    const token = generateToken(user.id)

    return c.json({ token, user: { id: user.id, email: user.email, name: user.name } })
  } catch (error) {
    console.error('Login error:', error)
    return c.json({ error: 'Login failed' }, 500)
  }
}

export const getMe = async (c: Context) => {
  try {
    const userId = c.get('userId')

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, role: true }
    })

    if (!user) {
      return c.json({ error: 'User not found' }, 404)
    }

    return c.json({ user })
  } catch (error) {
    console.error('Get me error:', error)
    return c.json({ error: 'Failed to fetch user' }, 500)
  }
}
