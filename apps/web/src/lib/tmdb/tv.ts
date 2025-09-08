import { fetchFromTMDB } from './client';
import { MediaItem, PaginatedResponse } from '@/types/media';

type TVListType = 'popular' | 'airing_today' | 'on_the_air' | 'top_rated';

export async function getTVShows(
  listType: TVListType,
  page: number = 1
): Promise<PaginatedResponse<MediaItem>> {
  const endpoint = `/tv/${listType}`;
  const response = await fetchFromTMDB<PaginatedResponse<MediaItem>>(endpoint, {
    page,
    region: 'US',
  });

  // Add media_type to each item in the response
  const resultsWithType = response.results.map(item => ({
    ...item,
    media_type: 'tv' as const,
    type: 'tv' as const
  }));

  return {
    ...response,
    results: resultsWithType
  };
}

export async function getTVShowDetails(id: string | number) {
  const endpoint = `/tv/${id}`;
  return fetchFromTMDB<MediaItem>(endpoint, {
    append_to_response: 'videos,credits,recommendations,similar,content_ratings',
  });
}

export async function searchTVShows(query: string, page: number = 1) {
  return fetchFromTMDB<PaginatedResponse<MediaItem>>('/search/tv', {
    query,
    page,
    include_adult: false,
    with_genres: '27' // Filter for horror genre
  });
}

// Get top rated horror TV shows with horror genre filter
export async function getTopRatedHorrorTVShows(page: number = 1) {
  console.log(`Fetching top rated horror TV shows page ${page}...`);
  
  try {
    // First try the direct horror TV shows endpoint
    let response = await fetchFromTMDB<PaginatedResponse<MediaItem>>('/discover/tv', {
      with_genres: '27', // Horror genre
      sort_by: 'popularity.desc',
      'vote_average.gte': '5.0',
      'vote_count.gte': '10',
      with_original_language: 'en',
      page,
      'first_air_date.gte': '2010-01-01' // Last 14 years
    });

    console.log(`Found ${response.results.length} horror TV shows on page ${page}`);
    
    // If no results, try with broader criteria
    if (response.results.length === 0) {
      console.log('No results with horror genre, trying broader search...');
      response = await fetchFromTMDB<PaginatedResponse<MediaItem>>('/discover/tv', {
        sort_by: 'popularity.desc',
        with_keywords: 'horror,thriller,supernatural',
        'vote_average.gte': '4.5',
        with_original_language: 'en',
        page,
        'first_air_date.gte': '2010-01-01'
      });
      console.log(`Found ${response.results.length} shows with broader search`);
    }
    
    // If still no results, try getting popular TV shows
    if (response.results.length === 0) {
      console.warn('No horror TV shows found, falling back to popular TV shows...');
      response = await fetchFromTMDB<PaginatedResponse<MediaItem>>('/tv/popular', {
        page,
        region: 'US',
        with_original_language: 'en'
      });
      console.log(`Found ${response.results.length} popular TV shows`);
    }
    
    // Log first 5 shows for better debugging
    if (response.results.length > 0) {
      response.results.slice(0, 5).forEach((show, index) => {
        console.log(`TV Show ${index + 1}:`, {
          id: show.id,
          name: show.name,
          type: show.type || 'tv',
          media_type: show.media_type || 'tv',
          genre_ids: show.genre_ids || [],
          vote_average: show.vote_average,
          vote_count: show.vote_count,
          first_air_date: show.first_air_date,
          overview: show.overview?.substring(0, 50) + '...' // First 50 chars of overview
        });
      });
    }
    
    // Add media_type and type to each item in the response
    const resultsWithType = response.results.map(item => ({
      ...item,
      media_type: 'tv' as const,
      type: 'tv' as const,
      // Ensure genre_ids is always an array
      genre_ids: Array.isArray(item.genre_ids) ? item.genre_ids : []
    }));

    return {
      ...response,
      results: resultsWithType
    };

    return {
      ...response,
      results: resultsWithType
    };
  } catch (error) {
    console.error('Error fetching top rated horror TV shows:', error);
    return { page: 1, results: [], total_pages: 0, total_results: 0 };
  }
}
