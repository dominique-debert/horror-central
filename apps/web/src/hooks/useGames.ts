import { useQuery } from '@tanstack/react-query';
import { igdbClient } from '@/lib/igdb';
import { GameItem } from '@/lib/igdb';

export const useTopRatedHorrorGames = (limit: number = 8) => {
  return useQuery<GameItem[], Error>({
    queryKey: ['top-rated-horror-games', limit],
    queryFn: () => igdbClient.getTopRatedHorrorGames(limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useHorrorGames = (limit: number = 20) => {
  return useQuery<GameItem[], Error>({
    queryKey: ['horror-games', limit],
    queryFn: () => igdbClient.getHorrorGames(limit),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useSearchGames = (query: string, limit: number = 20) => {
  return useQuery<GameItem[], Error>({
    queryKey: ['search-games', query, limit],
    queryFn: () => igdbClient.searchGames(query, limit),
    enabled: !!query.trim(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
