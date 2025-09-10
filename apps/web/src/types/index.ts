// Core Types
export * from './core/IMediaItem';
export * from './core/IMediaType';
export * from './core/IFilterOptions';
export * from './core/ISearchFilters';
export * from './core/ISearchResults';

// API Types
export * from './api/ITMDBMovie';
export * from './api/ITMDBTVShow';
export * from './api/ITMDBGenre';
export * from './api/ITMDBMovieDetails';
export * from './api/ITMDBTVDetails';
export * from './api/ITMDBResponse';
export * from './api/ITMDBWatchProviders';

// Component Props
export * from './components/IMediaCardProps';
export * from './components/IHeroSectionProps';
export * from './components/INewsArticle';
export * from './components/ILanguageBadgeProps';

// Book-related interfaces
export type { IBookItem } from './IBookItem'
export type { IBookDetails } from './IBookDetails'
export type { IBookCardProps } from './IBookCardProps'

// Movie-related interfaces
export type { IMovieItem } from './IMovieItem'
export type { IMovieCardProps } from './IMovieCardProps'

// TV Show-related interfaces
export type { ITVShowItem } from './ITVShowItem'

// Game-related interfaces
export type { IGameItem } from './IGameItem'

// Media-related interfaces
export type { IMediaCardProps, MediaType } from './IMediaCardProps'

// OpenLibrary API interfaces
export type { IOpenLibrarySearchDoc } from './IOpenLibrarySearchDoc'
export type { IOpenLibrarySearchResponse } from './IOpenLibrarySearchResponse'
export type { IOpenLibraryWork } from './IOpenLibraryWork'
export type { IOpenLibraryAuthor } from './IOpenLibraryAuthor'
export type { IOpenLibraryEdition } from './IOpenLibraryEdition'

// Component prop interfaces
export type { ISearchAndFilterBooksProps } from './ISearchAndFilterBooksProps'
export type { IHeroSectionProps } from './IHeroSectionProps'

// Export new TMDB route interfaces
export * from './ITMDBVideo'
export * from './ITMDBVideosResponse'
export * from './ITMDBMovieDetailsRoute'
export * from './ITMDBCredits'
export * from './ITMDBWatchProviders'
export * from './IWatchProvider'
