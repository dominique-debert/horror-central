import { IMediaItem } from './IMediaItem';

export interface ISearchResults<T = IMediaItem> {
  items: T[]
  total: number
  page: number
  totalPages: number
}
