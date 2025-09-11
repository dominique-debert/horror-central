export interface IMediaItem {
  id: number;
  title: string;
  name?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  vote_average: number;
  vote_count: number;
  release_date?: string;
  first_air_date?: string;
  media_type: 'movie' | 'tv';
  type?: 'movie' | 'tv'; // For backward compatibility
  original_title?: string;
  original_name?: string;
  genre_ids: number[];
  original_language: string;
  popularity: number;
  video?: boolean;
  adult: boolean;
}

export interface IPaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}
