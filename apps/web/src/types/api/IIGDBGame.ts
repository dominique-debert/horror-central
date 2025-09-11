
export interface IIGDBGame {
  id: number
  name: string
  summary?: string
  cover?: {
    id: number
    url: string
  }
  first_release_date?: number
  rating?: number
  rating_count?: number
  genres?: Array<{ id: number; name: string }>
  platforms?: Array<{ id: number; name: string }>
  involved_companies?: Array<{
    id: number
    company: { id: number; name: string }
    developer: boolean
    publisher: boolean
  }>
  game_modes?: Array<{ id: number; name: string }>
  themes?: Array<{ id: number; name: string }>
  keywords?: Array<{ id: number; name: string }>
  storyline?: string
  url?: string
}