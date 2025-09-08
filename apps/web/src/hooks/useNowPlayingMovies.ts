import { useQuery } from '@tanstack/react-query';
import { tmdbClient, tmdbMovieToMediaItem } from '@/lib/tmdb';
import { MediaItem } from '@/components/ui/MediaCard';

export const useNowPlayingMovies = (initialMovies: MediaItem[] = []) => {
  return useQuery<MediaItem[], Error>({
    queryKey: ['now-playing-movies'],
    queryFn: async () => {
      // Fetch both movies and genres in parallel
      const [moviesResponse, genresResponse] = await Promise.all([
        tmdbClient.getNowPlayingHorrorMovies(1),
        tmdbClient.getMovieGenres()
      ]);

      // Filter and convert TMDB movies to MediaItem format
      const horrorMovies = moviesResponse.results.filter(movie => 
        movie.genre_ids.includes(27) && // Ensure horror genre ID 27
        !movie.genre_ids.includes(16) // Exclude animation genre ID 16
      );
      
      return horrorMovies
        .slice(0, 8) // Limit to 8 movies
        .map(movie => tmdbMovieToMediaItem(movie, genresResponse.genres));
    },
    initialData: initialMovies.length > 0 ? initialMovies : undefined,
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    retry: 2,
  });
};
