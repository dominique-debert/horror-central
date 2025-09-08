import { useQuery } from '@tanstack/react-query';
import { tmdbClient } from '@/lib/tmdb';

export interface HeroMedia {
  id: number;
  title: string;
  overview: string;
  backdrop_path: string | null;
  genre_ids: number[];
  original_language: string;
  type: 'movie' | 'tv';
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  vote_count: number;
}

export const useHeroContent = () => {
  return useQuery<HeroMedia[], Error>({
    queryKey: ['hero-content'],
    queryFn: async () => {
      // Fetch multiple pages to get more content
      const [popularMovies1, popularMovies2, topRatedTVShows1, topRatedTVShows2] = await Promise.all([
        tmdbClient.getPopularHorrorMovies(1),
        tmdbClient.getPopularHorrorMovies(2),
        tmdbClient.getAllTimeTopRatedHorrorTVShows({ page: 1 }),
        tmdbClient.getAllTimeTopRatedHorrorTVShows({ page: 2 })
      ]);

      // Convert movies to HeroMedia format and limit to 10 movies
      const movieMedia: HeroMedia[] = [
        ...popularMovies1.results, 
        ...popularMovies2.results
      ]
        .filter((movie, index, self) => 
          index === self.findIndex(m => m.id === movie.id)
        )
        .filter(movie => 
          movie.backdrop_path && 
          movie.overview && 
          movie.vote_average >= 6.0 &&
          movie.vote_count >= 100
        )
        .slice(0, 10) // Limit to 10 movies
        .map(movie => ({
          ...movie,
          title: movie.title,
          type: 'movie' as const,
          release_date: movie.release_date
        }));

      // Convert TV shows to HeroMedia format and limit to 10 shows
      const tvMedia: HeroMedia[] = [
        ...topRatedTVShows1.results,
        ...topRatedTVShows2.results
      ]
        .filter((show, index, self) => 
          index === self.findIndex(s => s.id === show.id)
        )
        .filter(show => 
          show.backdrop_path && 
          show.overview && 
          show.vote_average >= 7.0 &&
          show.vote_count >= 100
        )
        .slice(0, 10) // Limit to 10 TV shows
        .map(show => ({
          ...show,
          title: show.name,
          type: 'tv' as const,
          first_air_date: show.first_air_date
        }));

      // Combine and shuffle the content
      const combined = [...movieMedia, ...tvMedia];
      return combined.sort(() => Math.random() - 0.5);
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  });
};
