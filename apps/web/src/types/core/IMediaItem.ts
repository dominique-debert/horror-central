export interface IMediaItem {
  id: string
  title: string
  posterUrl?: string
  rating: number
  year: number
  description: string
  genre: string[]
  seasons?: number
  episodes?: number
  releaseDate?: string
  slug: string
  criticsScore?: number
  originalLanguage?: string
  duration?: number // Duration in minutes
}
