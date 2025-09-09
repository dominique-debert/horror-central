export interface ITVShowItem {
  id: string
  title: string
  posterUrl: string
  rating: number
  year: number
  genre: string[]
  description: string
  seasons?: number
  episodes?: number
  status?: string
  slug: string
}