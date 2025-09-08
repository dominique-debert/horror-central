import { fetchFromTMDB } from './client';
import { MediaItem, PaginatedResponse } from '@/types/media';

type MovieListType = 'popular' | 'now_playing' | 'top_rated' | 'upcoming';

export async function getMovies(
  listType: MovieListType | string,
  page: number = 1
): Promise<PaginatedResponse<MediaItem>> {
  // Map URL-friendly category to TMDB endpoint
  const endpointMap: Record<string, string> = {
    'popular': '/movie/popular',
    'now-playing': '/movie/now_playing',
    'top-rated': '/movie/top_rated',
    'upcoming': '/movie/upcoming',
  };

  const endpoint = endpointMap[listType] || '/discover/movie';
  
  // Common params for all movie lists
  const params: Record<string, string | number> = {
    page,
    region: 'US',
    with_genres: '27', // Horror genre
    'vote_average.gte': '5', // Minimum 5.0 rating
    'vote_count.gte': '50', // Minimum 50 votes
    with_original_language: 'en|ko|es|de|sv|da',
    'with_runtime.gte': '60' // At least 60 minutes
  };

  // Special handling for discover endpoint
  if (endpoint === '/discover/movie') {
    params.sort_by = 'popularity.desc';
  }

  const response = await fetchFromTMDB<PaginatedResponse<MediaItem>>(endpoint, params);
  
  // Add media_type to each item in the response
  const resultsWithType = response.results.map(item => ({
    ...item,
    media_type: 'movie' as const,
    type: 'movie' as const
  }));

  return {
    ...response,
    results: resultsWithType
  };
}

export async function getMovieDetails(id: string | number) {
  const endpoint = `/movie/${id}`;
  return fetchFromTMDB<MediaItem>(endpoint, {
    append_to_response: 'videos,credits,recommendations,similar',
  });
}

export async function searchMovies(query: string, page: number = 1) {
  return fetchFromTMDB<PaginatedResponse<MediaItem>>('/search/movie', {
    query,
    page,
    include_adult: false,
    with_genres: '27' // Filter for horror genre
  });
}

// Get popular horror movies with horror genre filter
export async function getPopularHorrorMovies(page: number = 1) {
  console.log(`Fetching popular horror movies page ${page}...`);
  
  // Get date 2 years ago for more results
  const twoYearsAgo = new Date();
  twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
  
  const response = await fetchFromTMDB<PaginatedResponse<MediaItem>>('/discover/movie', {
    sort_by: 'popularity.desc',
    with_genres: '27', // Horror genre ID
    'vote_count.gte': '30', // Lowered minimum votes to get more results
    'vote_average.gte': '5.5', // Slightly lower rating threshold
    with_original_language: 'en|ko|es|de|sv|da',
    page,
    'primary_release_date.gte': twoYearsAgo.toISOString().split('T')[0], // Last 2 years
    'with_runtime.gte': '60' // At least 60 minutes
  });

  console.log(`Found ${response.results.length} movies on page ${page}`);
  if (response.results.length > 0) {
    console.log('First movie:', {
      id: response.results[0].id,
      title: response.results[0].title,
      type: response.results[0].type,
      media_type: response.results[0].media_type,
      genre_ids: response.results[0].genre_ids
    });
  }

  // Add media_type to each item in the response
  const resultsWithType = response.results.map(item => ({
    ...item,
    media_type: 'movie' as const,
    type: 'movie' as const
  }));

  return {
    ...response,
    results: resultsWithType
  };
}
