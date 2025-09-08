'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';

interface StoreProviderProps {
  children: React.ReactNode;
  authState?: {
    user: any | null;
    isAuthenticated: boolean;
  };
}

export function StoreProvider({ children, authState }: StoreProviderProps) {
  // Hydrate auth store with server state
  useEffect(() => {
    if (authState) {
      useAuthStore.setState({
        user: authState.user,
        isAuthenticated: authState.isAuthenticated,
        isLoading: false,
        error: null,
      });
    }
  }, [authState]);

  return <>{children}</>;
}
