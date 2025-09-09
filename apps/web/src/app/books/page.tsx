'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { PageHeader } from '@/components/PageHeader'
import { SearchAndFilterBooks } from '@/components/SearchAndFilterBooks'
import { MediaCard } from '@/components/ui/MediaCard'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious, PaginationButton, PaginationEllipsis } from '@/components/ui/pagination'
import { useAllTimeTopRatedBooks } from '@/hooks/useBooks'

// Types
type SortOption = 'rating.desc' | 'first_publish_year.desc' | 'title.asc' | 'author.asc'
type FormatOption = 'all' | 'hardcover' | 'paperback' | 'ebook' | 'audiobook'

interface BookItem {
  id: string
  title: string
  posterUrl: string
  rating: number
  year: number
  author: string
  pages: number
  description: string
  genre: string[]
  slug?: string
  format?: FormatOption[]
}

export default function BooksPage() {
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDecade, setSelectedDecade] = useState('all')
  const [selectedAuthor, setSelectedAuthor] = useState('all')
  const [selectedFormat, setSelectedFormat] = useState<FormatOption>('all')
  const [sortBy, setSortBy] = useState<SortOption>('rating.desc')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  // Available decades from 1970s to current decade
  const currentYear = new Date().getFullYear()
  const currentDecade = Math.floor(currentYear / 10) * 10
  const decades = Array.from(
    { length: (currentDecade - 1970) / 10 + 1 },
    (_, i) => `${currentDecade - i * 10}s`
  )

  // Sample authors - in a real app, these would come from your API
  const authors = [
    'Stephen King',
    'H.P. Lovecraft',
    'Shirley Jackson',
    'Clive Barker',
    'Anne Rice',
    'Dean Koontz',
    'Peter Straub',
    'Joe Hill',
    'Paul Tremblay',
    'Grady Hendrix'
  ]

  // Fetch books using the useAllTimeTopRatedBooks hook
  const { data, isLoading, error } = useAllTimeTopRatedBooks({
    page: currentPage,
    minYear: selectedDecade ? parseInt(selectedDecade) : undefined,
    author: selectedAuthor !== 'all' ? selectedAuthor : undefined,
    sortBy: sortBy,
    limit: itemsPerPage,
  })

  // Filter books by search term and format
  const filteredBooks = useCallback(() => {
    if (!data?.books) return []
    
    return data.books.filter(book => {
      // Filter by search term (title or author)
      const matchesSearch = !searchTerm || 
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
      
      // Filter by format if specified
      const matchesFormat = selectedFormat === 'all' || 
        (book.format && book.format.includes(selectedFormat))
      
      return matchesSearch && matchesFormat
    })
  }, [data, searchTerm, selectedFormat])

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedDecade, selectedAuthor, selectedFormat, sortBy])

  // Handle search params from URL
  useEffect(() => {
    const search = searchParams.get('search')
    const decade = searchParams.get('decade')
    const author = searchParams.get('author')
    const format = searchParams.get('format')
    const sort = searchParams.get('sort')
    
    if (search) setSearchTerm(search)
    if (decade) setSelectedDecade(decade)
    if (author) setSelectedAuthor(author)
    if (format && ['all', 'hardcover', 'paperback', 'ebook', 'audiobook'].includes(format)) {
      setSelectedFormat(format as FormatOption)
    }
    if (sort && ['rating.desc', 'first_publish_year.desc', 'title.asc', 'author.asc'].includes(sort)) {
      setSortBy(sort as SortOption)
    }
  }, [searchParams])

  // Update URL with current filters
  useEffect(() => {
    const params = new URLSearchParams()
    if (searchTerm) params.set('search', searchTerm)
    if (selectedDecade !== 'all') params.set('decade', selectedDecade)
    if (selectedAuthor !== 'all') params.set('author', selectedAuthor)
    if (selectedFormat !== 'all') params.set('format', selectedFormat)
    if (sortBy !== 'rating.desc') params.set('sort', sortBy)
    
    const url = `${window.location.pathname}?${params.toString()}`
    window.history.replaceState({}, '', url)
  }, [searchTerm, selectedDecade, selectedAuthor, selectedFormat, sortBy])

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <PageHeader title="Horror Books" description="Browse our collection of horror books" />
        <div className="text-red-500">Error loading books. Please try again later.</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <PageHeader 
        title="Horror Books" 
        description="Discover the most terrifying books in the horror genre"
      />
      
      <SearchAndFilterBooks
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedDecade={selectedDecade}
        onDecadeChange={setSelectedDecade}
        selectedAuthor={selectedAuthor}
        onAuthorChange={setSelectedAuthor}
        selectedFormat={selectedFormat}
        onFormatChange={setSelectedFormat}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        availableDecades={decades}
        availableAuthors={authors}
        className="mb-8"
      />

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-3 animate-pulse">
              <div className="h-64 w-full bg-muted rounded-lg" />
              <div className="h-5 w-4/5 bg-muted rounded" />
              <div className="h-4 w-1/3 bg-muted rounded" />
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks()
              .filter(book => book && book.posterUrl) // Filter out any undefined books or books without posterUrl
              .map((book) => ({
                ...book,
                // Ensure all required fields for MediaCard are present
                coverUrl: book.coverUrl || book.posterUrl || '/images/book-placeholder.jpg',
                description: book.description || 'No description available',
                genre: Array.isArray(book.genre) ? book.genre : ['Horror'],
                slug: book.slug || book.id,
              }))
              .map((book) => (
                <MediaCard
                  key={book.id}
                  item={{
                    id: book.id,
                    title: book.title,
                    posterUrl: book.posterUrl || '/images/book-placeholder.jpg',
                    coverUrl: book.coverUrl || book.posterUrl || '/images/book-placeholder.jpg',
                    rating: book.rating || 0,
                    year: book.year,
                    author: book.author || 'Unknown Author',
                    pages: book.pages || 0,
                    description: book.description || 'No description available',
                    genre: Array.isArray(book.genre) ? book.genre : ['Horror'],
                    slug: book.slug || book.id,
                  }}
                  type="book"
                />
              ))}
          </div>

          {data && data.totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        if (currentPage > 1) setCurrentPage(currentPage - 1)
                      }}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: Math.min(5, data.totalPages) }, (_, i) => {
                    let pageNum = i + 1
                    if (currentPage > 3) {
                      pageNum = currentPage - 2 + i
                    }
                    if (pageNum > data.totalPages) return null
                    
                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationButton
                          href="#"
                          isActive={currentPage === pageNum}
                          onClick={(e) => {
                            e.preventDefault()
                            setCurrentPage(pageNum)
                          }}
                        >
                          {pageNum}
                        </PaginationButton>
                      </PaginationItem>
                    )
                  })}
                  
                  <PaginationItem>
                    <PaginationNext 
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        if (currentPage < data.totalPages) setCurrentPage(currentPage + 1)
                      }}
                      className={currentPage === data.totalPages ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
    </div>
  )
}
