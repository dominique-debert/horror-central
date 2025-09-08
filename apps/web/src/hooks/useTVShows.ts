import { useQuery } from '@tanstack/react-query';
import { tmdbClient } from '@/lib/tmdb';
import { TMDBTVShow, TMDBResponse, TMDBTVDetails, TMDBWatchProvidersResponse } from '@/lib/tmdb';

export const useTopRatedHorrorTVShows = (page: number = 1) => {
  return useQuery<TMDBResponse<TMDBTVShow>, Error>({
    queryKey: ['top-rated-horror-tv', page],
    queryFn: () => tmdbClient.getTopRatedHorrorTVShows(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useAllTimeTopRatedHorrorTVShows = (params?: {
  page?: number;
  minYear?: number;
  maxYear?: number;
  genreIds?: number[];
  sortBy?: 'vote_average.desc' | 'first_air_date.desc' | 'name.asc';
}) => {
  return useQuery<TMDBResponse<TMDBTVShow>, Error>({
    queryKey: ['all-time-top-rated-horror-tv', params],
    queryFn: () => tmdbClient.getAllTimeTopRatedHorrorTVShows(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useTVDetails = (tvId: number) => {
  return useQuery<TMDBTVDetails, Error>({
    queryKey: ['tv-details', tvId],
    queryFn: () => tmdbClient.getTVDetails(tvId),
    enabled: !!tvId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useTVWatchProviders = (tvId: number) => {
  return useQuery<TMDBWatchProvidersResponse, Error>({
    queryKey: ['tv-watch-providers', tvId],
    queryFn: () => tmdbClient.getTVWatchProviders(tvId),
    enabled: !!tvId,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
  });
};

export const usePopularHorrorTVShows = (page: number = 1) => {
  return useQuery<TMDBResponse<TMDBTVShow>, Error>({
    queryKey: ['popular-horror-tv', page],
    queryFn: () => tmdbClient.getPopularHorrorTVShows(page),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
