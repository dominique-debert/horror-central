import { useQuery } from '@tanstack/react-query';
import { openLibraryClient } from '@/lib/openlibrary';

export const useTopRatedBooks = (limit = 12) => {
  return useQuery({
    queryKey: ['top-rated-books', limit],
    queryFn: () => openLibraryClient.getTopRatedBooks(limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useAllTimeTopRatedBooks = (params?: {
  page?: number;
  minYear?: number;
  maxYear?: number;
  author?: string;
  sortBy?: 'rating.desc' | 'first_publish_year.desc' | 'title.asc';
}) => {
  return useQuery({
    queryKey: ['all-time-top-rated-books', params],
    queryFn: () => openLibraryClient.getAllTimeTopRatedHorrorBooks(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
