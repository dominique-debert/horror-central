import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import { getServerAuthState } from '@/stores/useAuthStore';
import { getServerTheme } from '@/stores/useThemeStore';

export type ServerState = {
  auth: Awaited<ReturnType<typeof getServerAuthState>>;
  theme: ReturnType<typeof getServerTheme>;
};

export async function getServerState(cookies: ReadonlyRequestCookies): Promise<ServerState> {
  const themeCookie = cookies.get('theme')?.value || 'system';
  const [auth, theme] = await Promise.all([
    getServerAuthState(),
    getServerTheme({ theme: themeCookie }),
  ]);

  return { auth, theme };
}

// Helper to get cookies in server components
export function getCookie(cookies: ReadonlyRequestCookies, key: string): string | undefined {
  return cookies.get(key)?.value;
}

// Helper to set cookies in server actions
export function setCookie(
  headers: Headers,
  key: string,
  value: string,
  options: { maxAge?: number; path?: string } = {}
) {
  const cookieOptions = [
    `Max-Age=${options.maxAge || 60 * 60 * 24 * 7}`,
    `Path=${options.path || '/'}`,
    'SameSite=Lax',
    'HttpOnly',
    'Secure',
  ];

  headers.append('Set-Cookie', `${key}=${value}; ${cookieOptions.join('; ')}`);
}
