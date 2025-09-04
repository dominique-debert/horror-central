import { cookies } from 'next/headers';
import { apiMe, type MeResponse } from './api';

export type User = {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  role?: string | null;
};

export type Session = {
  user: User;
  token: string;
} | null;

/**
 * Get the current session from cookies (server-side)
 */
export async function auth(): Promise<Session> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;
    
    if (!token) {
      return null;
    }

    // Verify token with API
    const response: MeResponse = await apiMe(token);
    
    return {
      user: response.user,
      token
    };
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
}

/**
 * Get the current session from localStorage (client-side)
 */
export function getClientSession(): Session {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const token = localStorage.getItem('auth-token');
    const userStr = localStorage.getItem('auth-user');
    
    if (!token || !userStr) {
      return null;
    }

    const user = JSON.parse(userStr);
    return { user, token };
  } catch (error) {
    console.error('Client session error:', error);
    return null;
  }
}

/**
 * Set session data (client-side)
 */
export function setClientSession(user: User, token: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem('auth-token', token);
  localStorage.setItem('auth-user', JSON.stringify(user));
  
  // Also set as cookie for server-side access
  document.cookie = `auth-token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; samesite=strict`;
}

/**
 * Clear session data (client-side)
 */
export function clearClientSession(): void {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.removeItem('auth-token');
  localStorage.removeItem('auth-user');
  
  // Clear cookie
  document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
}

/**
 * Check if user is authenticated (client-side)
 */
export function isAuthenticated(): boolean {
  return getClientSession() !== null;
}
