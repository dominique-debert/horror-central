'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { PageHeader } from '@/components/PageHeader'
import { SearchAndFilter } from '@/components/SearchAndFilter'
import { MediaCard } from '@/components/ui/MediaCard'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious, PaginationButton, PaginationEllipsis } from '@/components/ui/pagination'

// Types
type SortOption = 'rating.desc' | 'first_publish_year.desc' | 'title.asc'
type UISortOption = 'rating.desc' | 'first_publish_year.desc' | 'title.asc'

interface BookItem {
  id: string
  title: string
  posterUrl: string
  rating: number
  year: number
  author: string
  pages: number
  description: string
  genre: string
  slug?: string
}

// Skeleton component for loading states
const SkeletonCard = () => (
  <div className="space-y-3">
    <div className="h-64 w-full bg-gray-800 rounded-lg animate-pulse" />
    <div className="h-5 w-4/5 bg-gray-800 rounded animate-pulse" />
    <div className="h-4 w-1/3 bg-gray-800 rounded animate-pulse" />
    <div className="flex justify-between items-center">
      <div className="h-4 w-16 bg-gray-800 rounded animate-pulse" />
      <div className="h-4 w-16 bg-gray-800 rounded animate-pulse" />
    </div>
  </div>
)

export default function BooksPage() {
  const searchParams = useSearchParams()
  
  // State for books data and loading
  const [books, setBooks] = useState<BookItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(1)
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDecade, setSelectedDecade] = useState('all')
  const [selectedAuthor, setSelectedAuthor] = useState('all')
  const [sortBy, setSortBy] = useState<UISortOption>('rating.desc')
  
  // Available filters
  const decades = [
    { value: 'all', label: 'All Decades' },
    { value: '2020s', label: '2020s' },
    { value: '2010s', label: '2010s' },
    { value: '2000s', label: '2000s' },
    { value: '1990s', label: '1990s' },
    { value: '1980s', label: '1980s' },
    { value: '1970s', label: '1970s' },
  ]
  
  const authors = [
    { value: 'all', label: 'All Authors' },
    { value: 'stephen-king', label: 'Stephen King' },
    { value: 'h-p-lovecraft', label: 'H.P. Lovecraft' },
    { value: 'clive-barker', label: 'Clive Barker' },
    { value: 'shirley-jackson', label: 'Shirley Jackson' },
  ]
  
  const sortOptions = [
    { value: 'rating.desc' as const, label: 'Highest Rated' },
    { value: 'first_publish_year.desc' as const, label: 'Newest First' },
    { value: 'title.asc' as const, label: 'Title A-Z' },
  ]
  
  // Map UI sort values to API sort values
  const mapSortToApi = (sort: UISortOption): SortOption => {
    switch (sort) {
      case 'rating.desc': return 'rating.desc'
      case 'first_publish_year.desc': return 'first_publish_year.desc'
      case 'title.asc': return 'title.asc'
      default: return 'rating.desc'
    }
  }
  
  // Fetch books from API
  const fetchBooks = useCallback(async (page: number) => {
    try {
      setLoading(true)
      setError(null)
      
      const params = new URLSearchParams()
      params.set('type', 'all-time-top-rated')
      params.set('page', page.toString())
      params.set('limit', itemsPerPage.toString())
      
      // Add filters
      if (selectedDecade !== 'all') {
        params.set('decade', selectedDecade)
      }
      
      if (selectedAuthor !== 'all') {
        params.set('author', selectedAuthor)
      }
      
      // Add sorting
      params.set('sortBy', mapSortToApi(sortBy))
      
      // Handle search
      const endpoint = searchTerm 
        ? `/api/books?type=search&q=${encodeURIComponent(searchTerm)}&limit=${itemsPerPage}`
        : `/api/books?${params.toString()}`
      
      const response = await fetch(endpoint)
      
      if (!response.ok) {
        throw new Error('Failed to fetch books')
      }
      
      const data = await response.json()
      const books = data.books || data || []
      const total = data.total || books.length
      
      setBooks(books)
      setTotalPages(Math.ceil(total / itemsPerPage))
      
      // Update URL without page reload
      const url = new URL(window.location.href)
      url.searchParams.set('page', page.toString())
      if (searchTerm) url.searchParams.set('q', searchTerm)
      if (selectedDecade !== 'all') url.searchParams.set('decade', selectedDecade)
      if (selectedAuthor !== 'all') url.searchParams.set('author', selectedAuthor)
      url.searchParams.set('sort', sortBy)
      
      window.history.pushState({}, '', url.toString())
    } catch (err) {
      console.error('Error fetching books:', err)
      setError('Failed to load books. Please try again later.')
      setBooks([])
    } finally {
      setLoading(false)
    }
  }, [searchTerm, selectedDecade, selectedAuthor, sortBy])
  
  // Handle page change
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
    fetchBooks(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  
  // Handle sort change
  const handleSortChange = (value: UISortOption) => {
    setSortBy(value)
    setCurrentPage(1)
    fetchBooks(1) // Reset to first page when changing sort
  }
  
  // Initialize from URL params
  useEffect(() => {
    const page = parseInt(searchParams.get('page') || '1')
    const search = searchParams.get('q') || ''
    const decade = searchParams.get('decade') || 'all'
    const author = searchParams.get('author') || 'all'
    const sort = (searchParams.get('sort') as UISortOption) || 'rating.desc'
    
    setCurrentPage(page)
    setSearchTerm(search)
    setSelectedDecade(decade)
    setSelectedAuthor(author)
    setSortBy(sort)
  }, [searchParams])
  
  // Fetch books when filters change
  useEffect(() => {
    fetchBooks(currentPage)
  }, [fetchBooks, currentPage])
  
  // Render skeleton loaders
  const renderSkeletons = (count: number) => {
    return Array(count).fill(0).map((_, i) => (
      <div key={i} className="col-span-1">
        <SkeletonCard />
      </div>
    ))
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader 
        title="Horror Books"
        description="Discover the most terrifying and thrilling horror books of all time"
      />
      
      {/* Search and Filters */}
      <div className="mb-8">
        <SearchAndFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedDecade={selectedDecade}
          onDecadeChange={setSelectedDecade}
          selectedAuthor={selectedAuthor}
          onAuthorChange={setSelectedAuthor}
          sortBy={sortBy}
          onSortChange={handleSortChange}
          decades={decades}
          authors={authors}
          sortOptions={sortOptions}
        />
      </div>
      
      {/* Loading and Error States */}
      {loading && currentPage === 1 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {renderSkeletons(8)}
        </div>
      )}
      
      {error && (
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">{error}</p>
          <Button 
            onClick={() => fetchBooks(currentPage)}
            variant="outline"
            className="flex items-center gap-2 mx-auto"
          >
            <Loader2 className="h-4 w-4 animate-spin" />
            Retry
          </Button>
        </div>
      )}
      
      {/* Books Grid */}
      {!loading && books.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
            {books.map((book) => (book && (
              <MediaCard
                key={book.id}
                type="book"
                item={{
                  id: book.id,
                  title: book.title,
                  posterUrl: book.posterUrl || '/images/book-placeholder.jpg',
                  coverUrl: book.posterUrl || '/images/book-placeholder.jpg',
                  rating: book.rating || 0,
                  year: book.year,
                  description: book.description || '',
                  genre: book.genre ? [book.genre] : ['Horror'],
                  author: book.author || 'Unknown Author',
                  pages: book.pages,
                  slug: book.slug || book.id,
                }}
              />
            )))}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum: number | 'ellipsis' = i + 1;
                    
                    // Handle ellipsis for large number of pages
                    if (totalPages > 5) {
                      if (currentPage > 3 && currentPage < totalPages - 2) {
                        if (i === 0) return <PaginationItem key="first"><PaginationButton onClick={() => handlePageChange(1)}>1</PaginationButton></PaginationItem>;
                        if (i === 1) return <PaginationItem key="ellipsis-start"><PaginationEllipsis /></PaginationItem>;
                        pageNum = currentPage + i - 2;
                        if (i === 3) return <PaginationItem key="ellipsis-end"><PaginationEllipsis /></PaginationItem>;
                        if (i === 4) return <PaginationItem key="last"><PaginationButton onClick={() => handlePageChange(totalPages)}>{totalPages}</PaginationButton></PaginationItem>;
                      } else if (currentPage <= 3) {
                        if (i === 4) return <PaginationItem key="ellipsis"><PaginationEllipsis /></PaginationItem>;
                      } else {
                        if (i === 0) return <PaginationItem key="ellipsis"><PaginationEllipsis /></PaginationItem>;
                        pageNum = totalPages - 4 + i;
                      }
                    }
                    
                    return (
                      <PaginationItem key={pageNum}>
                        {pageNum === 'ellipsis' ? (
                          <PaginationEllipsis />
                        ) : (
                          <PaginationButton
                            isActive={currentPage === pageNum}
                            onClick={() => handlePageChange(pageNum as number)}
                          >
                            {pageNum}
                          </PaginationButton>
                        )}
                      </PaginationItem>
                    );
                  })}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage >= totalPages}
                      className={currentPage >= totalPages ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
      
      {/* No Results */}
      {!loading && books.length === 0 && !error && (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">No books found</h3>
          <p className="text-gray-400">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  )
}
