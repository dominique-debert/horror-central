import { fetchFromTMDB } from './client';
import { IMediaItem, IPaginatedResponse } from '@/types/IMedia';

type TVListType = 'popular' | 'airing_today' | 'on_the_air' | 'top_rated' | 'airing-today' | 'on-the-air' | 'top-rated';

/**
 * Get TV shows by list type
 * @param listType - Can be either with underscores (airing_today) or hyphens (airing-today)
 */
export async function getTVShows(
  listType: string,
  page: number = 1
): Promise<IPaginatedResponse<IMediaItem>> {
  try {
    // Convert hyphens to underscores for the API endpoint
    const normalizedListType = listType.replace(/-/g, '_') as TVListType;
    const endpoint = `/tv/${normalizedListType}`;
    
    const response = await fetchFromTMDB<IPaginatedResponse<IMediaItem>>(endpoint, {
      page,
      region: 'US',
    });

    if (!response.results || response.results.length === 0) {
      return {
        page: 1,
        results: [],
        total_pages: 0,
        total_results: 0
      };
    }

    // Transform the API response to match our MediaItem type
    const resultsWithType: IMediaItem[] = response.results.map(item => ({
      id: item.id,
      title: item.name || item.original_name || 'Unknown Title',
      name: item.name || item.original_name || 'Unknown Title',
      poster_path: item.poster_path,
      backdrop_path: item.backdrop_path,
      overview: item.overview || 'No overview available',
      vote_average: item.vote_average || 0,
      vote_count: item.vote_count || 0,
      release_date: item.first_air_date || item.release_date,
      first_air_date: item.first_air_date,
      media_type: 'tv',
      type: 'tv',
      original_title: item.original_name,
      original_name: item.original_name,
      genre_ids: item.genre_ids || [],
      original_language: item.original_language || 'en|ko|es|de|sv|da',
      popularity: item.popularity || 0,
      adult: item.adult || false,
      video: false
    }));

    return {
      page: response.page || 1,
      results: resultsWithType,
      total_pages: response.total_pages || 1,
      total_results: response.total_results || 0
    };
  } catch (error) {
    console.error('Error in getTVShows:', error);
    return {
      page: 1,
      results: [],
      total_pages: 0,
      total_results: 0
    };
  }
}

export async function getTVShowDetails(id: string | number) {
  const endpoint = `/tv/${id}`;
  return fetchFromTMDB<IMediaItem>(endpoint, {
    append_to_response: 'videos,credits,recommendations,similar,content_ratings',
  });
}

export async function searchTVShows(query: string, page: number = 1) {
  return fetchFromTMDB<IPaginatedResponse<IMediaItem>>('/search/tv', {
    query,
    page,
    include_adult: false, 
    with_genres: '27' // Filter for horror genre
  });
}

// Get top rated horror TV shows with horror genre filter
export async function getTopRatedHorrorTVShows(page: number = 1) {
  
  try {
    // First try the direct horror TV shows endpoint
    let response = await fetchFromTMDB<IPaginatedResponse<IMediaItem>>('/discover/tv', {
      with_genres: '27', // Horror genre
      sort_by: 'popularity.desc',
      'vote_average.gte': '5.0',
      'vote_count.gte': '10',
      with_original_language: 'en|ko|es|de|sv|da',
      page,
      'first_air_date.gte': '2010-01-01' // Last 14 years
    });

    
    // If no results, try with broader criteria
    if (response.results.length === 0) {
      response = await fetchFromTMDB<IPaginatedResponse<IMediaItem>>('/discover/tv', {
        sort_by: 'popularity.desc',
        with_keywords: 'horror,thriller,supernatural',
        'vote_average.gte': '4.5',
        with_original_language: 'en|ko|es|de|sv|da',
        page,
        'first_air_date.gte': '2010-01-01'
      });
    }
    
    // If still no results, try getting popular TV shows
    if (response.results.length === 0) {
      response = await fetchFromTMDB<IPaginatedResponse<IMediaItem>>('/tv/popular', {
        page,
        region: 'US',
        with_original_language: 'en|ko|es|de|sv|da'
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

  } catch (error) {
    console.error('Error fetching top rated horror TV shows:', error);
    return { page: 1, results: [], total_pages: 0, total_results: 0 };
  }
}
