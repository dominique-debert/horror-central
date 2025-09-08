import { ITMDBMovie } from './ITMDBMovie';
import { ITMDBGenre } from './ITMDBGenre';

export interface ITMDBMovieDetails extends ITMDBMovie {
  runtime: number | null
  genres: ITMDBGenre[]
  production_companies: Array<{
    id: number
    name: string
    logo_path: string | null
  }>
  tagline: string | null
  credits?: ITMDBMovieCredits
  budget: number
  revenue: number
}

export interface ITMDBMovieCredits {
  cast: Array<{
    id: number
    name: string
    character: string
    profile_path: string | null
  }>
  crew: Array<{
    id: number
    name: string
    job: string
    department: string
    profile_path: string | null
  }>
}
