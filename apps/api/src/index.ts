import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { cors } from 'hono/cors'
import { authMiddleware } from './lib/auth/jwt'
import { register, login, getMe } from './controllers/auth.controller'

const app = new Hono()

// Middleware
app.use(
  '*',
  cors({
    origin: ['http://localhost:3000'],
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['POST', 'GET', 'OPTIONS'],
    exposeHeaders: ['Content-Length'],
    maxAge: 600,
    credentials: true,
  })
)

// Health check
app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Auth routes
app.post('/api/auth/register', register)
app.post('/api/auth/login', login)

// Protected routes
const protectedRoutes = new Hono()
protectedRoutes.use('*', authMiddleware)
protectedRoutes.get('/api/auth/me', getMe)

app.route('/', protectedRoutes)

// Start server
const port = parseInt(process.env.PORT || '3001')
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port,
})
