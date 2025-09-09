export interface IGameItem {
  id: string
  title: string
  posterUrl: string
  rating: number
  year: number
  genre: string[]
  description: string
  platforms?: string[]
  developer?: string
  publisher?: string
  slug: string
}