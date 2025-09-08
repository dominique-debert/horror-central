import { MediaItem } from '@/types/media';
import { getPopularHorrorMovies } from '../tmdb/movies';
import { getTopRatedHorrorTVShows } from '../tmdb/tv';

// Genre IDs that we consider as horror or horror-adjacent
const HORROR_GENRE_IDS = [
  27,   // Horror
  53,   // Thriller
  80,   // Crime
  9648, // Mystery
  10759, // Action & Adventure (often contains horror elements)
  10765, // Sci-Fi & Fantasy (often contains horror elements)
  99,    // Documentary (for horror documentaries)
  10768   // War & Politics (for war horror)
];

export function isHorrorContent(item: MediaItem): boolean {
  // If it's explicitly marked as horror, accept it
  if (item.genre_ids?.includes(27)) {
    return true;
  }
  
  // For TV shows, be more lenient with genres
  if (item.media_type === 'tv' || item.type === 'tv') {
    // If it has any of our horror-adjacent genres and a decent rating, include it
    const hasHorrorAdjacent = item.genre_ids?.some(id => HORROR_GENRE_IDS.includes(id)) ?? false;
    const hasGoodRating = (item.vote_average ?? 0) >= 5.0;
  
    if (hasHorrorAdjacent && hasGoodRating) {
      return true;
    }
  }
  
  // For movies, be a bit more strict
  const hasAnyGenre = item.genre_ids && item.genre_ids.length > 0;
  const hasHorrorGenre = item.genre_ids?.includes(27) ?? false;
  
  if (!hasHorrorGenre && hasAnyGenre) {
    return false;
  }
  
  return hasHorrorGenre;
}

export function filterAndCombineContent(
  movies: MediaItem[],
  tvShows: MediaItem[],
  movieLimit: number = 10,
  tvShowLimit: number = 10
): MediaItem[] {
  
  // Filter and take top movies - be more strict with movies
  const filteredMovies = movies
    .filter(movie => {
      const isHorror = isHorrorContent(movie);
      const hasRating = (movie.vote_average ?? 0) >= 5.0;
      const hasEnoughVotes = (movie.vote_count ?? 0) >= 10;
      
      if (!isHorror) {
        return false;
      }
      if (!hasRating) {
        return false;
      }
      if (!hasEnoughVotes) {
        return false;
      }
      return true;
    })
    .slice(0, movieLimit);

  // Filter and take top TV shows - be more lenient with TV shows
  const filteredTVShows = tvShows
    .filter(tv => {
      // For TV shows, be more lenient with the horror check
      const isHorror = isHorrorContent(tv);
      const hasRating = (tv.vote_average ?? 0) >= 4.5; // Even lower threshold for TV shows
      const hasEnoughVotes = (tv.vote_count ?? 0) >= 5; // Fewer votes required
      
      if (!isHorror) {
        return false;
      }
      if (!hasRating) {
        return false;
      }
      if (!hasEnoughVotes) {
        return false;
      }
      return true;
    })
    .slice(0, tvShowLimit);

  // Combine and shuffle the results
  const combined = [...filteredMovies, ...filteredTVShows];
  const shuffled = shuffleArray(combined);
  return shuffled;
}

// Helper function to shuffle array (Fisher-Yates algorithm)
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export async function fetchHeroContent() {
  try {
    
    // First, fetch movies and TV shows in parallel
    const [moviesPage1, moviesPage2, tvShowsPage1, tvShowsPage2] = await Promise.all([
      getPopularHorrorMovies(1),
      getPopularHorrorMovies(2),
      getTopRatedHorrorTVShows(1),
      getTopRatedHorrorTVShows(2)
    ]);

    // Combine results from all pages with null checks and ensure proper types
    const allMovies = [
      ...(moviesPage1?.results?.map(m => ({
        ...m,
        media_type: 'movie' as const,
        type: 'movie' as const
      })) || []),
      ...(moviesPage2?.results?.map(m => ({
        ...m,
        media_type: 'movie' as const,
        type: 'movie' as const
      })) || [])
    ];
    
    const allTVShows = [
      ...(tvShowsPage1?.results?.map(tv => ({
        ...tv,
        media_type: 'tv' as const,
        type: 'tv' as const,
        // Ensure genre_ids is always an array
        genre_ids: Array.isArray(tv.genre_ids) ? tv.genre_ids : []
      })) || []),
      ...(tvShowsPage2?.results?.map(tv => ({
        ...tv,
        media_type: 'tv' as const,
        type: 'tv' as const,
        // Ensure genre_ids is always an array
        genre_ids: Array.isArray(tv.genre_ids) ? tv.genre_ids : []
      })) || [])
    ];

    if (allTVShows.length === 0) {
      console.warn('WARNING: No TV shows were fetched. This might indicate an issue with the TV show API endpoint or filters.');
    }
    
    if (allMovies.length === 0 && allTVShows.length === 0) {
      console.warn('No content fetched from API');
      return [];
    }
    
    // Get more items to ensure we have enough content
    const combined = filterAndCombineContent(allMovies, allTVShows, 20, 10);
    
    return combined;
  } catch (error) {
    console.error('Error in fetchHeroContent:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      });
    }
    return [];
  }
}
