// Core Media Types
export interface MediaItem {
  id: string
  title: string
  posterUrl?: string
  coverUrl?: string
  rating: number
  year: number
  duration?: string
  description: string
  genre: string[]
  awards?: string[]
  criticsScore?: number
  audienceScore?: number
  slug: string
  // Movie specific
  // TV Show specific
  seasons?: number
  episodes?: number
  // Game specific
  platform?: string | string[]
  // Book specific
  author?: string
  pages?: number
  publisher?: string
  isbn?: string
}

export type MediaType = 'movie' | 'tv' | 'game' | 'book'

export interface MediaCardProps {
  item: MediaItem
  type: MediaType
}

// TMDB API Types
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

// IGDB API Types
export interface GameItem {
  id: string
  title: string
  posterUrl: string
  rating: number
  year: number
  platform: string[]
  description: string
  genre: string[]
  developer?: string
  slug: string
}

export interface GamesApiResponse {
  games: GameItem[]
}

// News & Articles Types
export interface NewsArticle {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  publishedAt: string
  imageUrl?: string
  slug: string
  category: string
  tags: string[]
  readTime?: number
}

// Review Types
export interface Review {
  id: string
  title: string
  content: string
  rating: number
  author: string
  publishedAt: string
  mediaId: string
  mediaType: MediaType
  mediaTitle: string
  mediaPosterUrl?: string
  likes?: number
  dislikes?: number
  verified?: boolean
}

// User & Auth Types
export interface User {
  id: string
  email: string
  username: string
  firstName?: string
  lastName?: string
  avatar?: string
  createdAt: string
  preferences?: UserPreferences
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  notifications: boolean
  newsletter: boolean
  favoriteGenres: string[]
  watchlist: string[]
  reviewsPublic: boolean
}

// Search & Filter Types
export interface SearchFilters {
  genre?: string[]
  year?: number | { min?: number; max?: number }
  rating?: { min?: number; max?: number }
  mediaType?: MediaType[]
  sortBy?: 'title' | 'year' | 'rating' | 'popularity'
  sortOrder?: 'asc' | 'desc'
}

export interface SearchResults {
  items: MediaItem[]
  total: number
  page: number
  totalPages: number
  filters: SearchFilters
}

// Component Props Types
export interface HeroSectionProps {
  movie?: MediaItem
  movies?: MediaItem[]
  // Optional props for manual override
  title?: string
  description?: string
  backgroundImage?: string
  trailerUrl?: string
  moreInfoUrl?: string
}

export interface SectionProps {
  movies?: MediaItem[]
  shows?: MediaItem[]
  games?: GameItem[]
  books?: MediaItem[]
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Coming Soon Page Types
export interface ComingSoonMovie extends MediaItem {
  anticipationScore: number
  daysUntilRelease: number
  director: string
  studio: string
  trailerUrl?: string
}

export interface FilterOptions {
  genres: string[]
  years: number[]
  ratings: string[]
}

export interface SortOption {
  value: string
  label: string
}
