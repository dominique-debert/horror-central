import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { cors } from 'hono/cors'
import { authMiddleware } from './lib/auth/jwt'
import { register, login, getMe } from './controllers/auth.controller'
import { userRoutes } from './routes/user.routes'

const app = new Hono()

// Middleware
app.options('*', (c) => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': 'http://localhost:3000',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
    }
  });
});

app.use(
  '*',
  cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    allowMethods: ['POST', 'GET', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    exposeHeaders: ['Content-Length', 'X-Request-Id'],
    maxAge: 86400,
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

// Auth routes
protectedRoutes.get('/api/auth/me', getMe)

// User routes
protectedRoutes.route('/api/users', userRoutes)

app.route('/', protectedRoutes)

// Start server
const port = process.env.PORT ? parseInt(process.env.PORT) : 3001
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port,
})
