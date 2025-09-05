// TMDB API Client for Horror Central
import { MediaItem } from "@/components/ui/MediaCard"

const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY
const HORROR_GENRE_ID = 27
const ANIMATION_GENRE_ID = 16
const CRIME_GENRE_ID = 80
const COMEDY_GENRE_ID = 35
const DRAMA_GENRE_ID = 18
const HORROR_TV_GENRE_IDS = [10765, 9648] // Sci-Fi & Fantasy, Mystery (closest to horror for TV)

// TMDB API Response Types
export interface TMDBMovie {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  vote_count: number
  genre_ids: number[]
  adult: boolean
  original_language: string
  popularity: number
}

export interface TMDBTVShow {
  id: number
  name: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  first_air_date: string
  vote_average: number
  vote_count: number
  genre_ids: number[]
  origin_country: string[]
  original_language: string
  popularity: number
}

export interface TMDBGenre {
  id: number
  name: string
}

export interface TMDBMovieCredits {
  cast: Array<{
    id: number
    name: string
    character: string
    profile_path: string | null
  }>
  crew: Array<{
    id: number
    name: string
    job: string
    department: string
    profile_path: string | null
  }>
}

export interface TMDBMovieDetails extends TMDBMovie {
  runtime: number
  genres: TMDBGenre[]
  production_companies: Array<{
    id: number
    name: string
    logo_path: string | null
  }>
  credits?: TMDBMovieCredits
  budget: number
  revenue: number
  tagline: string | null
}

export interface TMDBTVDetails extends TMDBTVShow {
  number_of_seasons: number
  number_of_episodes: number
  genres: TMDBGenre[]
  created_by: Array<{
    id: number
    name: string
  }>
  networks: Array<{
    id: number
    name: string
    logo_path: string | null
  }>
  status: string
}

export interface TMDBWatchProvider {
  display_priority: number
  logo_path: string
  provider_id: number
  provider_name: string
}

export interface TMDBWatchProviderRegion {
  link?: string
  flatrate?: TMDBWatchProvider[]
  rent?: TMDBWatchProvider[]
  buy?: TMDBWatchProvider[]
  ads?: TMDBWatchProvider[]
}

export interface TMDBWatchProvidersResponse {
  id: number
  results: Record<string, TMDBWatchProviderRegion>
}

export interface TMDBResponse<T> {
  page: number
  results: T[]
  total_pages: number
  total_results: number
}

// API Client Class
class TMDBClient {
  private apiKey: string
  private baseUrl: string

  constructor() {
    this.apiKey = TMDB_API_KEY || ''
    this.baseUrl = TMDB_BASE_URL
    
    // Don't throw error during initialization - handle it in API calls instead
    if (!this.apiKey) {
      console.warn('TMDB API key not found. API calls will fail gracefully.')
    }
  }

  private async request<T>(endpoint: string, params: Record<string, string | number | boolean> = {}): Promise<T> {
    if (!this.apiKey) {
      throw new Error('TMDB API key not configured')
    }
    
    const url = new URL(`${this.baseUrl}${endpoint}`)
    url.searchParams.append('api_key', this.apiKey)
    
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value.toString())
    })

    const response = await fetch(url.toString())
    
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  // Get now playing horror movies
  async getNowPlayingHorrorMovies(page: number = 1): Promise<TMDBResponse<TMDBMovie>> {
    // Use discover endpoint to properly filter by horror genre
    const today = new Date()
    const twoMonthsAgo = new Date()
    twoMonthsAgo.setMonth(today.getMonth() - 2)
    
    return this.request<TMDBResponse<TMDBMovie>>('/discover/movie', {
      page,
      with_genres: HORROR_GENRE_ID,
      without_genres: ANIMATION_GENRE_ID,
      'primary_release_date.gte': twoMonthsAgo.toISOString().split('T')[0],
      'primary_release_date.lte': today.toISOString().split('T')[0],
      sort_by: 'release_date.desc',
      with_original_language: 'en|ko|es|de|sv|da',
      'with_runtime.gte': 60,
      include_adult: false
    })
  }

  // Get top-rated horror movies
  async getTopRatedHorrorMovies(page: number = 1): Promise<TMDBResponse<TMDBMovie>> {
    const currentYear = new Date().getFullYear()
    const startYear = currentYear - 1
    
    return this.request<TMDBResponse<TMDBMovie>>('/discover/movie', {
      page,
      with_genres: HORROR_GENRE_ID,
      without_genres: ANIMATION_GENRE_ID,
      sort_by: 'primary_release_date.desc',
      'vote_count.gte': 100, // Minimum vote count for reliability
      'primary_release_date.gte': `${startYear}-01-01`,
      'primary_release_date.lte': `${currentYear}-12-31`,
      include_adult: false,
      with_original_language: 'en|ko|es|de|sv|da',
      'with_runtime.gte': 60 // Exclude short films (minimum 60 minutes)
    })
  }

  // Get all-time top-rated horror movies with flexible filtering
  async getAllTimeTopRatedHorrorMovies(params?: {
    page?: number
    minYear?: number
    maxYear?: number
    genreIds?: number[]
    sortBy?: 'vote_average.desc' | 'primary_release_date.desc' | 'title.asc'
  }): Promise<TMDBResponse<TMDBMovie>> {
    const {
      page = 1,
      minYear,
      maxYear,
      genreIds,
      sortBy = 'vote_average.desc'
    } = params || {}

    const requestParams: Record<string, string | number | boolean> = {
      page,
      with_genres: genreIds ? genreIds.join(',') : HORROR_GENRE_ID,
      without_genres: ANIMATION_GENRE_ID,
      sort_by: sortBy,
      'vote_count.gte': 50, // Lower threshold for more results
      include_adult: false,
      with_original_language: 'en|ko|es|de|sv|da',
      'with_runtime.gte': 60
    }

    if (minYear) {
      requestParams['primary_release_date.gte'] = `${minYear}-01-01`
    }
    if (maxYear) {
      requestParams['primary_release_date.lte'] = `${maxYear}-12-31`
    }

    return this.request<TMDBResponse<TMDBMovie>>('/discover/movie', requestParams)
  }

  // Get movie details including runtime and director
  async getMovieDetailsWithCredits(movieId: number): Promise<TMDBMovieDetails> {
    return this.request<TMDBMovieDetails>(`/movie/${movieId}`, {
      append_to_response: 'credits'
    })
  }

  // Get popular horror movies
  async getPopularHorrorMovies(page: number = 1): Promise<TMDBResponse<TMDBMovie>> {
    return this.request<TMDBResponse<TMDBMovie>>('/discover/movie', {
      page,
      with_genres: HORROR_GENRE_ID,
      without_genres: ANIMATION_GENRE_ID,
      sort_by: 'popularity.desc',
      include_adult: false,
      with_original_language: 'en|ko|es|de|sv|da',
      'with_runtime.gte': 60 // Exclude short films (minimum 60 minutes)
    })
  }

  // Get all-time top-rated horror TV shows with flexible filtering
  async getAllTimeTopRatedHorrorTVShows(params?: {
    page?: number
    minYear?: number
    maxYear?: number
    genreIds?: number[]
    sortBy?: 'vote_average.desc' | 'first_air_date.desc' | 'name.asc'
  }): Promise<TMDBResponse<TMDBTVShow>> {
    const {
      page = 1,
      minYear,
      maxYear,
      genreIds,
      sortBy = 'vote_average.desc'
    } = params || {}

    // Use multiple strategies to get comprehensive horror TV results
    const allShows: TMDBTVShow[] = []
    
    // Strategy 1: Discover with Sci-Fi & Fantasy + Mystery genres
    for (let discoverPage = 1; discoverPage <= 5; discoverPage++) {
      try {
        const requestParams: Record<string, string | number | boolean> = {
          page: discoverPage,
          with_genres: genreIds ? genreIds.join(',') : HORROR_TV_GENRE_IDS.join(','),
          without_genres: `${ANIMATION_GENRE_ID},${COMEDY_GENRE_ID}`,
          sort_by: sortBy,
          'vote_count.gte': 5,
          with_keywords: '158718|210024|9715|9951|12339|9882|180547|14544|162846|9663|9717|4565|9672|4344|9840',
          'with_original_language': 'en|ko|es|de|sv|da',
          include_adult: false
        }

        if (minYear) {
          requestParams['first_air_date.gte'] = `${minYear}-01-01`
        }
        if (maxYear) {
          requestParams['first_air_date.lte'] = `${maxYear}-12-31`
        }

        const response = await this.request<TMDBResponse<TMDBTVShow>>('/discover/tv', requestParams)
        allShows.push(...response.results)
        
        if (response.results.length === 0) break
      } catch (error) {
        console.error(`Discover page ${discoverPage} failed:`, error)
        break
      }
    }

    // Strategy 2: Search for specific horror shows by name
    const horrorShowSearches = [
      'american horror story', 'walking dead', 'stranger things', 'supernatural',
      'haunting hill house', 'penny dreadful', 'true blood', 'vampire diaries',
      'buffy vampire slayer', 'grimm', 'sleepy hollow', 'bates motel', 'hannibal',
      'dexter', 'twin peaks', 'x-files', 'tales from the crypt', 'twilight zone',
      'black mirror', 'evil', 'lovecraft country', 'castle rock', 'channel zero',
      'ash vs evil dead', 'preacher', 'outcast', 'fear the walking dead',
      'van helsing', 'z nation', 'hemlock grove', 'salem', 'american gothic',
      'harper island', 'the strain', 'midnight mass', 'marianne', 'dark',
      'the witcher', 'chilling adventures sabrina', 'locke key', 'the umbrella academy'
    ]

    for (const searchTerm of horrorShowSearches) {
      try {
        const searchResponse = await this.request<TMDBResponse<TMDBTVShow>>('/search/tv', {
          query: searchTerm,
          page: 1
        })
        
        // Add top 2 results if they have good ratings
        const goodResults = searchResponse.results
          .slice(0, 2)
          .filter(show => show.vote_average >= 6.0 && show.vote_count >= 20)
        
        allShows.push(...goodResults)
      } catch (error) {
        console.error(`Search for "${searchTerm}" failed:`, error)
      }
    }

    // Strategy 3: Additional discover calls with different parameters
    try {
      const additionalResponse = await this.request<TMDBResponse<TMDBTVShow>>('/discover/tv', {
        page: 1,
        with_genres: '18,80', // Drama, Crime (often have horror elements)
        with_keywords: '158718|9715|12339|9882|180547|14544|162846|9663|9717|4565|9672|4344|9840',
        'vote_average.gte': 7.0,
        'vote_count.gte': 100,
        'with_original_language': 'en|ko|es|de|sv|da',
        sort_by: 'vote_average.desc'
      })
      allShows.push(...additionalResponse.results)
    } catch (error) {
      console.error('Additional discover failed:', error)
    }
    
    // Remove duplicates
    const uniqueShows = allShows.reduce((acc, show) => {
      if (!acc.find(existing => existing.id === show.id)) {
        acc.push(show)
      }
      return acc
    }, [] as TMDBTVShow[])

    // Filter results to prioritize shows with horror-related content
    const horrorKeywords = [
      'horror', 'supernatural', 'ghost', 'demon', 'vampire', 'zombie', 'witch', 
      'haunted', 'terror', 'evil', 'dark', 'sinister', 'slayer', 'undead', 'occult', 
      'paranormal', 'thriller', 'mystery', 'murder', 'killer', 'death', 'blood',
      'nightmare', 'fear', 'scary', 'creepy', 'monster', 'beast', 'creature',
      'apocalypse', 'survival', 'infection', 'virus', 'pandemic', 'outbreak'
    ]
    
    const filteredResults = uniqueShows.filter(show => {
      const overview = (show.overview || '').toLowerCase()
      const name = show.name.toLowerCase()
      
      // Check for horror keywords
      const hasHorrorKeywords = horrorKeywords.some(keyword => 
        overview.includes(keyword) || name.includes(keyword)
      )
      
      // Include shows with horror keywords or high ratings
      return hasHorrorKeywords || show.vote_average >= 7.8
    })
    
    // Apply additional filtering based on parameters
    let finalResults = filteredResults
    
    if (minYear || maxYear) {
      finalResults = finalResults.filter(show => {
        const year = new Date(show.first_air_date || '1900-01-01').getFullYear()
        if (minYear && year < minYear) return false
        if (maxYear && year > maxYear) return false
        return true
      })
    }
    
    // Sort results
    finalResults.sort((a, b) => {
      if (sortBy === 'vote_average.desc') return b.vote_average - a.vote_average
      if (sortBy === 'first_air_date.desc') {
        const dateA = new Date(a.first_air_date || '1900-01-01').getTime()
        const dateB = new Date(b.first_air_date || '1900-01-01').getTime()
        return dateB - dateA
      }
      if (sortBy === 'name.asc') return a.name.localeCompare(b.name)
      return 0
    })
    
    // Implement pagination
    const startIndex = (page - 1) * 20
    const endIndex = startIndex + 20
    const paginatedResults = finalResults.slice(startIndex, endIndex)
    
    return {
      page,
      results: paginatedResults,
      total_pages: Math.ceil(finalResults.length / 20),
      total_results: finalResults.length
    }
  }

  // Legacy method for backward compatibility
  async getTopRatedHorrorTVShows(): Promise<TMDBResponse<TMDBTVShow>> {
    return this.getAllTimeTopRatedHorrorTVShows({ page: 1, sortBy: 'vote_average.desc' })
  }

  // Get upcoming horror movies
  async getUpcomingHorrorMovies(page: number = 1): Promise<TMDBResponse<TMDBMovie>> {
    const today = new Date().toISOString().split('T')[0]
    const futureDate = new Date()
    futureDate.setFullYear(futureDate.getFullYear() + 1)
    const oneYearFromNow = futureDate.toISOString().split('T')[0]
    
    return this.request<TMDBResponse<TMDBMovie>>('/discover/movie', {
      page,
      with_genres: HORROR_GENRE_ID,
      without_genres: ANIMATION_GENRE_ID,
      sort_by: 'release_date.desc',
      'primary_release_date.gte': today,
      'primary_release_date.lte': oneYearFromNow,
      include_adult: false,
      with_original_language: 'en|ko|es|de|sv|da',
      'with_runtime.gte': 60
    })
  }

  // Get featured horror movies
  async getFeaturedHorrorMovies(count: number = 10): Promise<TMDBMovie[]> {
    const response = await this.getTopRatedHorrorMovies(1)
    // Return up to the requested count of movies
    return response.results.slice(0, Math.min(count, response.results.length))
  }

  // Get upcoming horror TV shows
  async getUpcomingHorrorTVShows(page: number = 1): Promise<TMDBResponse<TMDBTVShow>> {
    const today = new Date()
    const futureDate = new Date()
    futureDate.setFullYear(futureDate.getFullYear() + 1)
    
    return this.request<TMDBResponse<TMDBTVShow>>('/discover/tv', {
      page,
      with_genres: HORROR_TV_GENRE_IDS.join(','), // Sci-Fi & Fantasy, Mystery
      'first_air_date.gte': today.toISOString().split('T')[0],
      'first_air_date.lte': futureDate.toISOString().split('T')[0],
      sort_by: 'first_air_date.asc',
      with_original_language: 'en|ko|es|de|sv|da',
      with_keywords: '158718|210024|9715' // Horror, supernatural, thriller keywords
    })
  }

  // Get popular horror TV shows
  async getPopularHorrorTVShows(page: number = 1): Promise<TMDBResponse<TMDBTVShow>> {
    return this.request<TMDBResponse<TMDBTVShow>>('/discover/tv', {
      page,
      with_genres: HORROR_GENRE_ID,
      sort_by: 'popularity.desc'
    })
  }

  // Get movie details
  async getMovieDetails(movieId: number): Promise<TMDBMovieDetails> {
    return this.request<TMDBMovieDetails>(`/movie/${movieId}`)
  }

  // Get TV show details
  async getTVDetails(tvId: number): Promise<TMDBTVDetails> {
    return this.request<TMDBTVDetails>(`/tv/${tvId}`)
  }

  // Get movie watch providers
  async getMovieWatchProviders(movieId: number): Promise<TMDBWatchProvidersResponse> {
    return this.request<TMDBWatchProvidersResponse>(`/movie/${movieId}/watch/providers`)
  }

  // Get TV show watch providers
  async getTVWatchProviders(tvId: number): Promise<TMDBWatchProvidersResponse> {
    return this.request<TMDBWatchProvidersResponse>(`/tv/${tvId}/watch/providers`)
  }

  // Get available watch provider regions
  async getWatchProviderRegions(): Promise<{ results: Array<{ iso_3166_1: string, english_name: string, native_name: string }> }> {
    return this.request<{ results: Array<{ iso_3166_1: string, english_name: string, native_name: string }> }>('/watch/providers/regions')
  }

  // Get all available movie watch providers
  async getMovieWatchProvidersList(region?: string): Promise<{ results: TMDBWatchProvider[] }> {
    const params: Record<string, string> = {}
    if (region) {
      params.watch_region = region
    }
    return this.request<{ results: TMDBWatchProvider[] }>('/watch/providers/movie', params)
  }

  // Get all available TV watch providers
  async getTVWatchProvidersList(region?: string): Promise<{ results: TMDBWatchProvider[] }> {
    const params: Record<string, string> = {}
    if (region) {
      params.watch_region = region
    }
    return this.request<{ results: TMDBWatchProvider[] }>('/watch/providers/tv', params)
  }

  // Search for horror movies
  async searchHorrorMovies(query: string, page: number = 1): Promise<TMDBResponse<TMDBMovie>> {
    const response = await this.request<TMDBResponse<TMDBMovie>>('/search/movie', {
      query,
      page,
      include_adult: false
    })

    // Filter results to only include horror movies
    const horrorResults = response.results.filter(movie => 
      movie.genre_ids.includes(HORROR_GENRE_ID)
    )

    return {
      ...response,
      results: horrorResults
    }
  }

  // Search for horror TV shows
  async searchHorrorTVShows(query: string, page: number = 1): Promise<TMDBResponse<TMDBTVShow>> {
    const response = await this.request<TMDBResponse<TMDBTVShow>>('/search/tv', {
      query,
      page
    })

    // Filter results to only include horror TV shows
    const horrorResults = response.results.filter(show => 
      show.genre_ids.includes(HORROR_GENRE_ID)
    )

    return {
      ...response,
      results: horrorResults
    }
  }

  // Get genre list
  async getMovieGenres(): Promise<{ genres: TMDBGenre[] }> {
    return this.request<{ genres: TMDBGenre[] }>('/genre/movie/list')
  }

  async getTVGenres(): Promise<{ genres: TMDBGenre[] }> {
    return this.request<{ genres: TMDBGenre[] }>('/genre/tv/list')
  }
}

// Utility functions for image URLs
export const getImageUrl = (path: string | null, size: 'w200' | 'w300' | 'w400' | 'w500' | 'w780' | 'original' = 'w500'): string => {
  if (!path) return '/placeholder-movie-poster.jpg' // You'll need to add a placeholder image
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`
}

export const getBackdropUrl = (path: string | null, size: 'w300' | 'w780' | 'w1280' | 'original' = 'w1280'): string => {
  if (!path) return '/placeholder-backdrop.jpg'
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`
}

// Convert TMDB movie to our MediaItem format
export const tmdbMovieToMediaItem = (movie: TMDBMovie, genres: TMDBGenre[] = []): MediaItem => {
  const movieGenres = genres.filter(genre => movie.genre_ids.includes(genre.id)).map(g => g.name)
  
  return {
    id: movie.id.toString(),
    title: movie.title,
    posterUrl: getImageUrl(movie.poster_path),
    rating: movie.vote_average,
    year: new Date(movie.release_date || '').getFullYear() || 0,
    description: movie.overview,
    genre: movieGenres.length > 0 ? movieGenres : ['Horror'],
    slug: movie.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, ''),
    duration: undefined, // Will be filled when getting detailed info
    originalLanguage: movie.original_language
  }
}

// Convert TMDB TV show to our MediaItem format
export const tmdbTVToMediaItem = (show: TMDBTVShow, genres: TMDBGenre[] = []): MediaItem => {
  const showGenres = genres.filter(genre => show.genre_ids.includes(genre.id)).map(g => g.name)
  
  return {
    id: show.id.toString(),
    title: show.name,
    posterUrl: getImageUrl(show.poster_path),
    rating: show.vote_average,
    year: new Date(show.first_air_date || '').getFullYear() || 0,
    description: show.overview,
    genre: showGenres.length > 0 ? showGenres : ['Horror'],
    slug: show.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, ''),
    seasons: undefined, // Will be filled when getting detailed info
    originalLanguage: show.original_language
  }
}

// Export singleton instance
export const tmdbClient = new TMDBClient()
