'use client'

import { QueryClient, QueryClientProvider as ReactQueryProvider } from '@tanstack/react-query'
import { ReactNode, useState } from 'react'

export function QueryClientProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  }))

  return (
    <ReactQueryProvider client={queryClient}>
      {children}
    </ReactQueryProvider>
  )
}
