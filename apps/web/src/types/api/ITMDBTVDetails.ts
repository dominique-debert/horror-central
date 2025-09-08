import { ITMDBTVShow } from './ITMDBTVShow';
import { ITMDBGenre } from './ITMDBGenre';

export interface ITMDBTVDetails extends ITMDBTVShow {
  number_of_seasons: number
  number_of_episodes: number
  genres: ITMDBGenre[]
  created_by: Array<{
    id: number
    name: string
  }>
  networks: Array<{
    id: number
    name: string
    logo_path: string | null
  }>
  status: string
}
