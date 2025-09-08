import { z } from 'zod';

export const UserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2).optional(),
  image: z.string().optional(),
  role: z.enum(['USER', 'ADMIN']).default('USER'),
});

export interface IUser extends z.infer<typeof UserSchema> {
  id: string;
  email: string;
  name?: string;
  image?: string;
  role: 'USER' | 'ADMIN';
  createdAt: Date;
  updatedAt: Date;
}

export interface IUpdateUserInput {
  email?: string;
  name?: string;
  image?: string;
  password?: string;
}

export interface IUserResponse {
  id: string;
  email: string;
  name?: string;
  image?: string;
  role: 'USER' | 'ADMIN';
  createdAt: Date;
  updatedAt: Date;
}

export interface ILoginResponse {
  user: IUserResponse;
  token: string;
}

export interface IAuthContext {
  userId: string;
  role: 'USER' | 'ADMIN';
}
