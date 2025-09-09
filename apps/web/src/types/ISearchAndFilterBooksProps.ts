export interface ISearchAndFilterBooksProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  selectedDecade: string
  onDecadeChange: (value: string) => void
  selectedAuthor: string
  onAuthorChange: (value: string) => void
  availableDecades: string[]
  availableAuthors: string[]
  isLoadingAuthors?: boolean
  className?: string
}