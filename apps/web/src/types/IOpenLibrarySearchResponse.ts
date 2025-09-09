import type { IOpenLibrarySearchDoc } from './IOpenLibrarySearchDoc'

export interface IOpenLibrarySearchResponse {
  numFound: number
  start: number
  docs: IOpenLibrarySearchDoc[]
}

// Re-export for convenience
export type { IOpenLibrarySearchDoc } from './IOpenLibrarySearchDoc'