import { Context } from 'hono';
import { z } from 'zod';
import { prisma } from '../lib/prisma-client';
import { hashPassword, verifyPassword } from '../lib/auth/password';
import { IUserResponse, IPrismaUser, IUserUpdateInput, IUserWhereUniqueInput } from '../types';

export const updateProfile = async (c: Context) => {
  try {
    const userId = c.get('userId');
    const { name, email, currentPassword, newPassword } = await c.req.json();

    // Validate input
    const updateSchema = z.object({
      name: z.string().min(2).max(50).optional(),
      email: z.string().email().optional(),
      currentPassword: z.string().optional(),
      newPassword: z.string().min(8).optional(),
    }).refine(data => !(data.newPassword && !data.currentPassword), {
      message: 'Current password is required to set a new password',
      path: ['currentPassword'],
    });

    const validatedData = updateSchema.parse({
      name,
      email,
      currentPassword,
      newPassword,
    });

    // Get the current user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    }) as IPrismaUser | null;

    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    // If changing password, verify current password
    if (validatedData.newPassword && validatedData.currentPassword) {
      const isPasswordValid = await verifyPassword(validatedData.currentPassword, user.password);
      if (!isPasswordValid) {
        return c.json({ error: 'Current password is incorrect' }, 400);
      }
    }

    // Prepare update data with proper typing
    const updateData: IUserUpdateInput = {};
    if (validatedData.name) updateData.name = validatedData.name;
    if (validatedData.email) updateData.email = validatedData.email;
    if (validatedData.newPassword) {
      updateData.password = await hashPassword(validatedData.newPassword);
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId } as IUserWhereUniqueInput,
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    }) as IPrismaUser;

    const response: IUserResponse = {
      id: updatedUser.id,
      name: updatedUser.name || undefined,
      email: updatedUser.email,
      image: updatedUser.image || undefined,
      role: updatedUser.role,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };

    return c.json({ user: response });
  } catch (error) {
    console.error('Update profile error:', error);
    if (error instanceof z.ZodError) {
      return c.json({ error: 'Validation error', details: error.errors }, 400);
    }
    return c.json({ error: 'Failed to update profile' }, 500);
  }
};

export const getProfile = async (c: Context) => {
  try {
    const userId = c.get('userId');

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
    });

    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    const response: IUserResponse = {
      id: user.id,
      email: user.email,
      name: user.name || undefined,
      image: user.image || undefined,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return c.json({ user: response });
  } catch (error) {
    console.error('Get profile error:', error);
    return c.json({ error: 'Failed to fetch profile' }, 500);
  }
};
