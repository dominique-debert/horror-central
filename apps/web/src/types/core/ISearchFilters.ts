export interface ISearchFilters {
  genre?: string[]
  year?: number | { min?: number; max?: number }
  rating?: { min?: number; max?: number }
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}
