import { ITMDBVideosResponse } from './ITMDBVideosResponse'

export interface ITMDBMovieDetailsRoute {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  runtime: number | null
  vote_average: number
  vote_count: number
  genres: Array<{ id: number; name: string }>
  production_companies: Array<{ id: number; name: string }>
  production_countries: Array<{ iso_3166_1: string; name: string }>
  spoken_languages: Array<{ iso_639_1: string; name: string }>
  budget: number
  revenue: number
  status: string
  tagline: string
  original_language: string
  original_title: string
  videos: ITMDBVideosResponse
}