import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { prisma } from './lib/prisma-client'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Horror Central API is running!')
})

// Health check endpoint
app.get('/health', async (c) => {
  try {
    await prisma.$queryRaw`SELECT 1`
    return c.json({ status: 'ok', database: 'connected' })
  } catch (error) {
    return c.json({ status: 'error', database: 'disconnected' }, 500)
  }
})

const port = 3001
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})