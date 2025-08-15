import { hash, verify } from '@node-rs/argon2'

export const hashPassword = async (password: string): Promise<string> => {
  return await hash(password, {
    // Recommended minimum parameters
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    saltLength: 16,
  })
}

export const verifyPassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return await verify(hashedPassword, password)
}
