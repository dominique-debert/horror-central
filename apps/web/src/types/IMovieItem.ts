export interface IMovieItem {
  id: string
  title: string
  posterUrl: string
  rating: number
  year: number
  genre: string[]
  description: string
  duration?: string
  slug: string
}