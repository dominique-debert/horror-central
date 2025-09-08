import { useQuery } from '@tanstack/react-query';
import { tmdbClient, TMDBTVShow, tmdbTVToMediaItem } from '@/lib/tmdb';
import { MediaItem } from '@/components/ui/MediaCard';

export const useTopRatedTVShows = () => {
  return useQuery<MediaItem[], Error>({
    queryKey: ['top-rated-tv-shows'],
    queryFn: async () => {
      try {
        // Fetch multiple pages to get more content
        const [page1, page2] = await Promise.all([
          tmdbClient.getAllTimeTopRatedHorrorTVShows({ page: 1 }),
          tmdbClient.getAllTimeTopRatedHorrorTVShows({ page: 2 })
        ]);

        // Combine and process results
        const allShows = [...(page1?.results || []), ...(page2?.results || [])]
          .filter((show): show is TMDBTVShow => Boolean(show))
          .filter((show, index, self) => 
            index === self.findIndex(s => s.id === show.id)
          )
          .filter(show => 
            show.poster_path && 
            show.overview && 
            show.vote_average >= 7.0 &&
            show.vote_count >= 100
          )
          .slice(0, 8) // Limit to 8 shows for the homepage
          .map(show => {
            // Convert TMDB TV show to our MediaItem format
            return tmdbTVToMediaItem(show);
          });

        return allShows;
      } catch (error) {
        console.error('Error fetching top rated TV shows:', error);
        throw error;
      }
    },
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 6 * 60 * 60 * 1000, // 6 hours
  });
};
