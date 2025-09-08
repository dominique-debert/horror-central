import { useQuery } from '@tanstack/react-query';
import { tmdbClient, tmdbMovieToMediaItem } from '@/lib/tmdb';
import { MediaItem } from '@/components/ui/MediaCard';

export const useTopRatedMovies = (initialMovies: MediaItem[] = []) => {
  return useQuery<MediaItem[], Error>({
    queryKey: ['top-rated-movies'],
    queryFn: async () => {
      // Fetch both movies and genres in parallel
      const [moviesResponse, genresResponse] = await Promise.all([
        tmdbClient.getTopRatedHorrorMovies(1),
        tmdbClient.getMovieGenres()
      ]);

      // Convert TMDB movies to MediaItem format
      return moviesResponse.results
        .slice(0, 8) // Limit to 8 movies
        .map(movie => tmdbMovieToMediaItem(movie, genresResponse.genres));
    },
    initialData: initialMovies.length > 0 ? initialMovies : undefined,
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 3 * 60 * 60 * 1000, // 3 hours
    retry: 2,
  });
};
