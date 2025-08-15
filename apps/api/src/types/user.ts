import { z } from 'zod'

export const UserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2).optional(),
})

export type User = z.infer<typeof UserSchema>
