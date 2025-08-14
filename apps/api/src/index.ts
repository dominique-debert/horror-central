import { Hono } from 'hono'
import Joi from 'joi'

const app = new Hono()

// Custom Joi middleware
const validate = (schema: Joi.ObjectSchema) => {
  return async (c: any, next: any) => {
    let dataToValidate: any
    if (c.req.method === 'GET') {
      dataToValidate = c.req.query()
    } else {
      try {
        dataToValidate = await c.req.json()
      } catch {
        return c.json({ error: 'Invalid JSON' }, 400)
      }
    }

    const { error, value } = schema.validate(dataToValidate, {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: true
    })

    if (error) {
      return c.json({
        error: 'Validation failed',
        details: error.details.map(d => ({
          message: d.message,
          path: d.path,
          type: d.type
        }))
      }, 422)
    }

    c.req.validatedData = value
    await next()
  }
}

// Example route with Joi validation
app.post(
  '/movies',
  validate(Joi.object({
    title: Joi.string().required(),
    releaseYear: Joi.number().integer().min(1900).max(2100).required(),
    rating: Joi.number().min(0).max(10).optional()
  })),
  (c) => {
    const data = c.req.validatedData
    return c.json({ 
      message: 'Movie created successfully',
      data
    })
  }
)

// Basic route
app.get('/', (c) => {
  return c.json({ message: 'Hello Horror Central API with Joi!' })
})

// Add this at the end of the file, replacing the current export
const port = 3001;
console.log(`Server is running on http://localhost:${port}`);

// Start the server
const server = {
  port,
  fetch: app.fetch
};

export default server;

// For development with tsx
if (process.env.NODE_ENV !== 'test') {
  const { serve } = require('@hono/node-server');
  serve(server);
}