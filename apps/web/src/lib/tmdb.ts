// TMDB API Client for Horror Central
import { MediaItem } from "@/components/ui/MediaCard"

const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY
const HORROR_GENRE_ID = 27
const HORROR_TV_GENRE_IDS = [10765, 9648] // Sci-Fi & Fantasy, Mystery (closest to horror for TV) // Horror genre ID in TMDB

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

export interface TMDBMovieDetails extends TMDBMovie {
  runtime: number | null
  genres: TMDBGenre[]
  production_companies: Array<{
    id: number
    name: string
    logo_path: string | null
  }>
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
      'primary_release_date.gte': twoMonthsAgo.toISOString().split('T')[0],
      'primary_release_date.lte': today.toISOString().split('T')[0],
      sort_by: 'release_date.desc',
      with_original_language: 'en',
      'with_runtime.gte': 60,
      include_adult: false
    })
  }

  // Get top-rated horror movies
  async getTopRatedHorrorMovies(page: number = 1): Promise<TMDBResponse<TMDBMovie>> {
    return this.request<TMDBResponse<TMDBMovie>>('/discover/movie', {
      page,
      with_genres: HORROR_GENRE_ID,
      sort_by: 'vote_average.desc',
      'vote_count.gte': 100, // Minimum vote count for reliability
      include_adult: false,
      with_original_language: 'en',
      'with_runtime.gte': 60 // Exclude short films (minimum 60 minutes)
    })
  }

  // Get popular horror movies
  async getPopularHorrorMovies(page: number = 1): Promise<TMDBResponse<TMDBMovie>> {
    return this.request<TMDBResponse<TMDBMovie>>('/discover/movie', {
      page,
      with_genres: HORROR_GENRE_ID,
      sort_by: 'popularity.desc',
      include_adult: false,
      with_original_language: 'en',
      'with_runtime.gte': 60 // Exclude short films (minimum 60 minutes)
    })
  }

  // Get top-rated horror TV shows
  async getTopRatedHorrorTVShows(page: number = 1): Promise<TMDBResponse<TMDBTVShow>> {
    // Since TMDB doesn't have a horror genre for TV, we'll search for popular horror TV shows
    // and filter by keywords or use a curated list approach
    const response = await this.request<TMDBResponse<TMDBTVShow>>('/discover/tv', {
      with_genres: HORROR_TV_GENRE_IDS.join(','), // Sci-Fi & Fantasy, Mystery
      sort_by: 'vote_average.desc',
      'vote_count.gte': 50, // Lower threshold for TV shows
      with_keywords: '158718|210024|9715', // Horror, supernatural, thriller keywords
      with_original_language: 'en',
      page
    })
    
    // Filter results to prioritize shows with horror-related keywords in overview
    const horrorKeywords = ['horror', 'supernatural', 'ghost', 'demon', 'vampire', 'zombie', 'witch', 'haunted', 'scary', 'terror', 'evil', 'dark', 'sinister']
    const filteredResults = response.results.filter(show => {
      const overview = show.overview.toLowerCase()
      const name = show.name.toLowerCase()
      return horrorKeywords.some(keyword => overview.includes(keyword) || name.includes(keyword))
    })
    
    return {
      ...response,
      results: filteredResults.length > 0 ? filteredResults : response.results
    }
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
      sort_by: 'release_date.desc',
      'primary_release_date.gte': today,
      'primary_release_date.lte': oneYearFromNow,
      include_adult: false,
      with_original_language: 'en',
      'with_runtime.gte': 60 // Exclude short films (minimum 60 minutes)
    })
  }

  // Get featured horror movie for hero section
  async getFeaturedHorrorMovie(): Promise<TMDBMovie> {
    const response = await this.getTopRatedHorrorMovies(1)
    // Get a random movie from the top results for variety
    const randomIndex = Math.floor(Math.random() * Math.min(response.results.length, 5))
    return response.results[randomIndex]
  }

  // Get multiple featured horror movies for hero rotation
  async getFeaturedHorrorMovies(count: number = 10): Promise<TMDBMovie[]> {
    const response = await this.getTopRatedHorrorMovies(1)
    // Return up to the requested count of movies
    return response.results.slice(0, Math.min(count, response.results.length))
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
    duration: undefined // Will be filled when getting detailed info
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
    seasons: undefined // Will be filled when getting detailed info
  }
}

// Export singleton instance
export const tmdbClient = new TMDBClient()
