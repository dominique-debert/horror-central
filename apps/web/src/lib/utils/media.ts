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
      console.log(`Including TV show (${item.name}): Has horror-adjacent genres:`, 
        item.genre_ids?.filter(id => HORROR_GENRE_IDS.includes(id)));
      return true;
    }
  }
  
  // For movies, be a bit more strict
  const hasAnyGenre = item.genre_ids && item.genre_ids.length > 0;
  const hasHorrorGenre = item.genre_ids?.includes(27) ?? false;
  
  if (!hasHorrorGenre && hasAnyGenre) {
    console.log(`Filtering out (${item.title || item.name}): Not a horror genre. Genres:`, item.genre_ids);
  }
  
  return hasHorrorGenre;
}

export function filterAndCombineContent(
  movies: MediaItem[],
  tvShows: MediaItem[],
  movieLimit: number = 10,
  tvShowLimit: number = 10
): MediaItem[] {
  console.log(`Filtering and combining content. Received ${movies.length} movies and ${tvShows.length} TV shows`);
  
  // Filter and take top movies - be more strict with movies
  const filteredMovies = movies
    .filter(movie => {
      const isHorror = isHorrorContent(movie);
      const hasRating = (movie.vote_average ?? 0) >= 5.0;
      const hasEnoughVotes = (movie.vote_count ?? 0) >= 10;
      
      if (!isHorror) {
        console.log(`Movie filtered out - Not horror: ${movie.title || movie.name} (ID: ${movie.id})`);
        return false;
      }
      if (!hasRating) {
        console.log(`Movie filtered out - Low rating (${movie.vote_average}): ${movie.title || movie.name} (ID: ${movie.id})`);
        return false;
      }
      if (!hasEnoughVotes) {
        console.log(`Movie filtered out - Not enough votes (${movie.vote_count}): ${movie.title || movie.name} (ID: ${movie.id})`);
        return false;
      }
      return true;
    })
    .slice(0, movieLimit);

  console.log(`Filtered to ${filteredMovies.length} movies`);

  // Filter and take top TV shows - be more lenient with TV shows
  const filteredTVShows = tvShows
    .filter(tv => {
      // For TV shows, be more lenient with the horror check
      const isHorror = isHorrorContent(tv);
      const hasRating = (tv.vote_average ?? 0) >= 4.5; // Even lower threshold for TV shows
      const hasEnoughVotes = (tv.vote_count ?? 0) >= 5; // Fewer votes required
      
      if (!isHorror) {
        console.log(`TV show filtered out - Not horror: ${tv.name || tv.title} (ID: ${tv.id}) Genres:`, tv.genre_ids);
        return false;
      }
      if (!hasRating) {
        console.log(`TV show filtered out - Low rating (${tv.vote_average}): ${tv.name || tv.title} (ID: ${tv.id})`);
        return false;
      }
      if (!hasEnoughVotes) {
        console.log(`TV show filtered out - Not enough votes (${tv.vote_count}): ${tv.name || tv.title} (ID: ${tv.id})`);
        return false;
      }
      
      console.log(`Including TV show: ${tv.name || tv.title} (ID: ${tv.id}) - Rating: ${tv.vote_average}, Votes: ${tv.vote_count}`);
      return true;
    })
    .slice(0, tvShowLimit);

  console.log(`Filtered to ${filteredTVShows.length} TV shows`);

  // Log first few items of each type for debugging
  console.log('Sample movies:', filteredMovies.slice(0, 3).map(m => ({ id: m.id, title: m.title || m.name, type: m.type || 'unknown' })));
  console.log('Sample TV shows:', filteredTVShows.slice(0, 3).map(tv => ({ id: tv.id, title: tv.name || tv.title, type: tv.type || 'unknown' })));

  // Combine and shuffle the results
  const combined = [...filteredMovies, ...filteredTVShows];
  console.log(`Combined ${combined.length} items (${filteredMovies.length} movies + ${filteredTVShows.length} TV shows)`);
  
  const shuffled = shuffleArray(combined);
  console.log('Shuffled result types:', shuffled.map(item => item.type || 'unknown').join(', '));
  
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
    console.log('Starting to fetch hero content...');
    
    // First, fetch movies and TV shows in parallel
    console.log('Fetching movies and TV shows...');
    const [moviesPage1, moviesPage2, tvShowsPage1, tvShowsPage2] = await Promise.all([
      getPopularHorrorMovies(1),
      getPopularHorrorMovies(2),
      getTopRatedHorrorTVShows(1),
      getTopRatedHorrorTVShows(2)
    ]);

    // Log raw API responses for debugging
    console.log('=== Raw API Results ===');
    console.log('Movies Page 1 results:', moviesPage1.results?.length || 0);
    console.log('Movies Page 2 results:', moviesPage2.results?.length || 0);
    console.log('TV Shows Page 1 results:', tvShowsPage1.results?.length || 0);
    console.log('TV Shows Page 2 results:', tvShowsPage2.results?.length || 0);
    
    // Log sample of TV shows to check their data
    if (tvShowsPage1.results?.length > 0) {
      console.log('Sample TV show from page 1:', {
        id: tvShowsPage1.results[0].id,
        name: tvShowsPage1.results[0].name,
        genre_ids: tvShowsPage1.results[0].genre_ids,
        vote_average: tvShowsPage1.results[0].vote_average,
        vote_count: tvShowsPage1.results[0].vote_count,
        media_type: tvShowsPage1.results[0].media_type,
        type: tvShowsPage1.results[0].type
      });
    }

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

    console.log(`=== Combined Results ===`);
    console.log(`Fetched ${allMovies.length} movies and ${allTVShows.length} TV shows`);
    
    if (allTVShows.length === 0) {
      console.warn('WARNING: No TV shows were fetched. This might indicate an issue with the TV show API endpoint or filters.');
    }
    
    if (allMovies.length === 0 && allTVShows.length === 0) {
      console.warn('No content fetched from API');
      return [];
    }
    
    // Get more items to ensure we have enough content
    console.log('Filtering and combining content...');
    const combined = filterAndCombineContent(allMovies, allTVShows, 20, 10);
    
    console.log(`=== Final Results ===`);
    console.log(`Combined ${combined.length} items for hero section (${allMovies.length} movies + ${allTVShows.length} TV shows)`);
    
    if (combined.length === 0) {
      console.warn('No content after filtering. Check filter conditions.');
    } else {
      // Log the types of items in the final result
      const movieCount = combined.filter(item => item.media_type === 'movie').length;
      const tvCount = combined.filter(item => item.media_type === 'tv').length;
      console.log(`Final hero section: ${movieCount} movies and ${tvCount} TV shows`);
      
      // Log first few items to verify
      console.log('Sample of final items:', combined.slice(0, 3).map(item => ({
        id: item.id,
        title: item.title || item.name,
        type: item.media_type,
        genres: item.genre_ids,
        rating: item.vote_average,
        votes: item.vote_count
      })));
    }
    
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
