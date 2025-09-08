import { IUser } from './IUser';

export interface IJwtPayload {
  userId: string;
  role: IUser['role'];
  iat?: number;
  exp?: number;
}

export interface IAuthTokenResponse {
  token: string;
  expiresIn: number;
}

export interface ILoginCredentials {
  email: string;
  password: string;
}

export interface IRegisterInput extends ILoginCredentials {
  name?: string;
  image?: string;
}

export interface IAuthResponse {
  user: IUser;
  token: string;
}

export interface IPasswordResetRequest {
  email: string;
}

export interface IPasswordResetConfirm {
  token: string;
  newPassword: string;
}

export interface IAuthConfig {
  jwtSecret: string;
  jwtExpiresIn: string;
  refreshTokenSecret: string;
  refreshTokenExpiresIn: string;
  passwordResetTokenExpiry: number; // in hours
}
