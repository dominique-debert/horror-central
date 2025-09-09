export type MediaType = 'movie' | 'tv' | 'game'

export interface IMediaCardProps {
  id: string
  title: string
  imageUrl: string
  rating: number
  year: number
  href: string
  type: MediaType
}