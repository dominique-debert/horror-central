'use client';

import { useEffect } from 'react';
import { useUserStore } from '@/stores/useUserStore';

interface StoreHydrationProps {
  userState?: Partial<ReturnType<typeof useUserStore.getState>>;
  children: React.ReactNode;
}

export function StoreHydration({ userState, children }: StoreHydrationProps) {
  // Hydrate user store if server state is provided
  useEffect(() => {
    if (userState) {
      useUserStore.setState((state) => ({
        ...state,
        ...userState,
        _hasHydrated: true,
      }));
    }
  }, [userState]);

  return <>{children}</>;
}
