export interface IUser {
  id: string;
  name?: string;
  email?: string;
  // Add other user properties as needed
}

export interface IAuthState {
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading?: boolean;
  error?: string | null;
}

export type Theme = 'light' | 'dark' | 'system';
