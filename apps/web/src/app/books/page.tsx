'use client'

import { useState, useEffect, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { PageHeader } from '@/components/PageHeader'
import { SearchAndFilterBooks } from '@/components/SearchAndFilterBooks'
import { MediaCard } from '@/components/ui/MediaCard'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

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

// Pagination components
const Pagination = ({ children }: { children: React.ReactNode }) => (
  <nav className="flex items-center justify-center">
    <ul className="flex items-center space-x-1">
      {children}
    </ul>
  </nav>
)

const PaginationContent = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
)

const PaginationItem = ({ children }: { children: React.ReactNode }) => (
  <li>{children}</li>
)

const PaginationButton = ({ 
  isActive, 
  onClick, 
  children,
  disabled = false,
  className = ''
}: { 
  isActive?: boolean
  onClick: () => void
  children: React.ReactNode
  disabled?: boolean
  className?: string
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-3 py-1 rounded-md ${isActive ? 'bg-red-600 text-white' : 'text-gray-300 hover:bg-gray-800'} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
  >
    {children}
  </button>
)

const PaginationPrevious = ({ 
  onClick, 
  disabled = false,
  className = ''
}: { 
  onClick: () => void
  disabled?: boolean
  className?: string
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-3 py-1 rounded-md text-gray-300 hover:bg-gray-800 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
  >
    Previous
  </button>
)

const PaginationNext = ({ 
  onClick, 
  disabled = false,
  className = ''
}: { 
  onClick: () => void
  disabled?: boolean
  className?: string
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-3 py-1 rounded-md text-gray-300 hover:bg-gray-800 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
  >
    Next
  </button>
)

const PaginationEllipsis = () => (
  <span className="px-3 py-1 text-gray-500">...</span>
)

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

export default function BooksPage() {
  const router = useRouter()
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
  const [sortBy, setSortBy] = useState('rating_desc')
  
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
    { value: 'dean-koontz', label: 'Dean Koontz' },
  ]
  
  // Fetch books from API
  const fetchBooks = async (page: number, isFilterChange = false) => {
    try {
      setLoading(true)
      
      // Build query params
      const params = new URLSearchParams()
      params.set('page', page.toString())
      params.set('limit', itemsPerPage.toString())
      
      if (searchTerm) params.set('search', searchTerm)
      if (selectedDecade !== 'all') params.set('decade', selectedDecade)
      if (selectedAuthor !== 'all') params.set('author', selectedAuthor)
      if (sortBy) params.set('sort', sortBy)
      
      const response = await fetch(`/api/books?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch books')
      }
      
      const data = await response.json()
      
      setBooks(data.books || [])
      setTotalPages(Math.ceil((data.total || 0) / itemsPerPage))
      
      // Update URL without triggering a page reload
      const newParams = new URLSearchParams(searchParams.toString())
      newParams.set('page', page.toString())
      router.push(`?${newParams.toString()}`, { scroll: false })
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Error fetching books:', err)
    } finally {
      setLoading(false)
    }
  }
  
  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return
    
    setCurrentPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    fetchBooks(newPage)
  }
  
  // Handle filter changes
  const handleSearch = () => {
    setCurrentPage(1)
    fetchBooks(1, true)
  }
  
  // Initialize page
  useEffect(() => {
    // Get initial page from URL or default to 1
    const page = parseInt(searchParams.get('page') || '1', 10)
    setCurrentPage(isNaN(page) ? 1 : page)
    
    // Initial data fetch
    fetchBooks(isNaN(page) ? 1 : page)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  
  // Generate pagination items
  const paginationItems = useMemo(() => {
    if (totalPages <= 1) return null
    
    const items = []
    const maxVisiblePages = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }
    
    // Previous button
    items.push(
      <PaginationItem key="prev">
        <PaginationPrevious 
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        />
      </PaginationItem>
    )
    
    // First page
    if (startPage > 1) {
      items.push(
        <PaginationItem key={1}>
          <PaginationButton 
            isActive={1 === currentPage}
            onClick={() => handlePageChange(1)}
          >
            1
          </PaginationButton>
        </PaginationItem>
      )
      
      if (startPage > 2) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        )
      }
    }
    
    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationButton
            isActive={i === currentPage}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </PaginationButton>
        </PaginationItem>
      )
    }
    
    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        )
      }
      
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationButton
            isActive={totalPages === currentPage}
            onClick={() => handlePageChange(totalPages)}
          >
            {totalPages}
          </PaginationButton>
        </PaginationItem>
      )
    }
    
    // Next button
    items.push(
      <PaginationItem key="next">
        <PaginationNext 
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        />
      </PaginationItem>
    )
    
    return items
  }, [currentPage, totalPages])
  
  // Render skeleton loading states
  const renderSkeletons = (count: number) => {
    return Array(count).fill(0).map((_, i) => <SkeletonCard key={`skeleton-${i}`} />)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <PageHeader 
          title="Top Rated Horror Books"
          description="Discover the most acclaimed horror literature of all time, from classic gothic novels to modern psychological thrillers."
        />

        {/* Search and Filters */}
        <div className="mb-8">
          <SearchAndFilterBooks
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedDecade={selectedDecade}
            onDecadeChange={setSelectedDecade}
            selectedAuthor={selectedAuthor}
            onAuthorChange={setSelectedAuthor}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            availableDecades={decades}
            availableAuthors={authors}
            onSearch={handleSearch}
          />
        </div>

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => fetchBooks(currentPage, true)}>Retry</Button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && books.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No books found. Try adjusting your search filters.</p>
          </div>
        )}

        {/* Books Grid */}
        {!error && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {loading && books.length === 0 ? (
                // Initial loading state
                renderSkeletons(8)
              ) : (
                // Show actual book cards
                books.map((book) => (
                  <MediaCard
                    key={book.id}
                    item={{
                      id: book.id,
                      title: book.title,
                      posterUrl: book.posterUrl,
                      rating: book.rating,
                      year: book.year,
                      description: book.description,
                      genre: book.genre,
                      slug: book.slug || book.id,
                      pages: book.pages
                    }}
                    type="book"
                  />
                ))
              )}
            </div>

            {/* Loading more indicator */}
            {loading && books.length > 0 && (
              <div className="flex justify-center pt-4">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && !loading && (
              <div className="mt-8">
                <Pagination>
                  <PaginationContent>
                    {paginationItems}
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
