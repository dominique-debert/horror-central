export interface ITopRatedMovie {
  id: number
  title: string
  description: string
  posterUrl: string
  rating: number
  year: number
  duration: string
  director: string
  genre: string[]
  genreIds: number[]
  awards?: string[]
  criticsScore?: number
  audienceScore?: number
  slug: string
  originalLanguage: string
}