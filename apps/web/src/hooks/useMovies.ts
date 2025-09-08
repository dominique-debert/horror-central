import { useQuery } from '@tanstack/react-query';
import { tmdbClient } from '@/lib/tmdb';
import { TMDBMovie, TMDBResponse, TMDBMovieDetails, TMDBWatchProvidersResponse } from '@/lib/tmdb';

export const useNowPlayingHorrorMovies = (page: number = 1) => {
  return useQuery<TMDBResponse<TMDBMovie>, Error>({
    queryKey: ['now-playing-horror-movies', page],
    queryFn: () => tmdbClient.getNowPlayingHorrorMovies(page),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useTopRatedHorrorMovies = (page: number = 1) => {
  return useQuery<TMDBResponse<TMDBMovie>, Error>({
    queryKey: ['top-rated-horror-movies', page],
    queryFn: () => tmdbClient.getTopRatedHorrorMovies(page),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useAllTimeTopRatedHorrorMovies = (params?: {
  page?: number;
  minYear?: number;
  maxYear?: number;
  genreIds?: number[];
  sortBy?: 'vote_average.desc' | 'primary_release_date.desc' | 'title.asc';
}) => {
  return useQuery<TMDBResponse<TMDBMovie>, Error>({
    queryKey: ['all-time-top-rated-horror-movies', params],
    queryFn: () => tmdbClient.getAllTimeTopRatedHorrorMovies(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useMovieDetails = (movieId: number) => {
  return useQuery<TMDBMovieDetails, Error>({
    queryKey: ['movie-details', movieId],
    queryFn: () => tmdbClient.getMovieDetailsWithCredits(movieId),
    enabled: !!movieId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useMovieWatchProviders = (movieId: number) => {
  return useQuery<TMDBWatchProvidersResponse, Error>({
    queryKey: ['movie-watch-providers', movieId],
    queryFn: () => tmdbClient.getMovieWatchProviders(movieId),
    enabled: !!movieId,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
  });
};
