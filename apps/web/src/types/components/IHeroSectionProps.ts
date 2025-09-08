import { IMediaItem } from '../core/IMediaItem';

export interface IHeroSectionProps {
  movie?: IMediaItem
  movies?: IMediaItem[]
  title?: string
  description?: string
  ctaText?: string
  moreInfoUrl?: string
}
