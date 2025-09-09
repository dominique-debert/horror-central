export interface IMovieCardProps {
  title: string
  poster: string
  rating: number
  year: number
  duration?: string
  description: string
  genre?: string
  onClick?: () => void
}