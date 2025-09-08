import { useEffect, useState } from 'react';

export function useServerState<T>(
  key: string,
  fetchFn: () => Promise<T>,
  initialData?: T
) {
  const [data, setData] = useState<T | undefined>(initialData);
  const [isLoading, setIsLoading] = useState(!initialData);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Only fetch if we don't have initial data
    if (!initialData) {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          const result = await fetchFn();
          setData(result);
          
          // Store in session storage for page navigation
          if (typeof window !== 'undefined') {
            sessionStorage.setItem(key, JSON.stringify(result));
          }
        } catch (err) {
          setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
          setIsLoading(false);
        }
      };

      // Check session storage first
      if (typeof window !== 'undefined') {
        const cached = sessionStorage.getItem(key);
        if (cached) {
          setData(JSON.parse(cached));
          setIsLoading(false);
          return;
        }
      }

      fetchData();
    }
  }, [key, fetchFn, initialData]);

  return { data, isLoading, error };
}

// Server-side helper to get data for a specific route
export async function getServerState<T>(
  key: string,
  fetchFn: () => Promise<T>,
  context: any = {}
): Promise<{ [key: string]: T }> {
  try {
    const data = await fetchFn();
    return { [key]: data };
  } catch (error) {
    console.error(`Failed to fetch server state for ${key}:`, error);
    return {};
  }
}
