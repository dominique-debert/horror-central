import { User, Prisma, PrismaClient } from '@prisma/client';

// Use a different name to avoid conflict with IUser from IUser.ts
export interface IPrismaUser extends User {}

export type IUserCreateInput = Prisma.UserCreateInput;

export type IUserUpdateInput = Prisma.UserUpdateInput;

export type IUserWhereUniqueInput = Prisma.UserWhereUniqueInput;

export type IUserWhereInput = Prisma.UserWhereInput;

export type IUserSelect = Prisma.UserSelect;

export type IUserInclude = Prisma.UserInclude;

// Add other Prisma model types as needed
export interface IPrismaDelegate {
  user: {
    findUnique: (args: { where: IUserWhereUniqueInput; include?: IUserInclude; select?: IUserSelect }) => Promise<IPrismaUser | null>;
    findMany: (args?: { where?: IUserWhereInput; include?: IUserInclude; select?: IUserSelect }) => Promise<IPrismaUser[]>;
    create: (args: { data: IUserCreateInput; select?: IUserSelect }) => Promise<IPrismaUser>;
    update: (args: { where: IUserWhereUniqueInput; data: IUserUpdateInput; select?: IUserSelect }) => Promise<IPrismaUser>;
    delete: (args: { where: IUserWhereUniqueInput }) => Promise<IPrismaUser>;
  };
  // Add other models as needed
}

export interface IPrismaTransactionClient extends Omit<PrismaClient, '$transaction'> {
  $transaction<T>(fn: (prisma: Omit<PrismaClient, '$transaction'>) => Promise<T>): Promise<T>;
}

export interface IPrismaService {
  user: {
    findById: (id: string) => Promise<IPrismaUser | null>;
    findByEmail: (email: string) => Promise<IPrismaUser | null>;
    create: (data: IUserCreateInput) => Promise<IPrismaUser>;
    update: (id: string, data: IUserUpdateInput) => Promise<IPrismaUser>;
    delete: (id: string) => Promise<IPrismaUser>;
  };
  // Add other model services as needed
}

// Re-export Prisma types for convenience
export { Prisma } from '@prisma/client';
