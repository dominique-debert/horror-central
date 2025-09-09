'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { PageHeader } from '@/components/PageHeader'
import { SearchAndFilterBooks } from '@/components/SearchAndFilterBooks'
import { MediaCard } from '@/components/ui/MediaCard'
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious, PaginationButton, PaginationEllipsis } from '@/components/ui/pagination'
import { useAllTimeTopRatedBooks, useBookAuthors } from '@/hooks/useBooks'

// Types
type SortOption = 'rating.desc' | 'first_publish_year.desc' | 'title.asc' | 'author.asc'
type FormatOption = 'all' | 'hardcover' | 'paperback' | 'ebook' | 'audiobook'

export default function BooksPage() {
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDecade, setSelectedDecade] = useState('all')
  const [selectedAuthor, setSelectedAuthor] = useState('all')
  const [selectedFormat, setSelectedFormat] = useState<FormatOption>('all')
  const [sortBy, setSortBy] = useState<SortOption>('rating.desc')
  const [currentPage, setCurrentPage] = useState(() => {
    // Get page from URL search params, default to 1
    const page = searchParams.get('page')
    return page ? Math.max(1, parseInt(page, 10)) : 1
  })
  const itemsPerPage = 12

  // Available decades from 1970s to current decade
  const currentYear = new Date().getFullYear()
  const currentDecade = Math.floor(currentYear / 10) * 10
  const decades = Array.from(
    { length: (currentDecade - 1970) / 10 + 1 },
    (_, i) => `${currentDecade - i * 10}s`
  )

  // Fetch authors using the useBookAuthors hook
  const { data: authors = [], isLoading: isLoadingAuthors } = useBookAuthors()

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

  // Update URL when page changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    if (currentPage > 1) {
      params.set('page', currentPage.toString())
    } else {
      params.delete('page')
    }
    const url = `${window.location.pathname}?${params.toString()}`
    window.history.replaceState({}, '', url)
  }, [currentPage, searchParams])

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

  const getPaginationItems = () => {
    if (!data) return [];
    
    const totalPages = data.totalPages;
    const current = currentPage;
    const items = [];
    
    // Always show first page button
    items.push(1);
    
    // Calculate range of pages to show around current page
    let startPage = Math.max(2, current - 1);
    let endPage = Math.min(totalPages - 1, current + 1);
    
    // Adjust if we're near the start or end
    if (current <= 3) {
      endPage = Math.min(4, totalPages - 1);
    } else if (current >= totalPages - 2) {
      startPage = Math.max(2, totalPages - 3);
    }
    
    // Add ellipsis if needed after first page
    if (startPage > 2) {
      items.push('ellipsis-start');
    }
    
    // Add page numbers in range
    for (let i = startPage; i <= endPage; i++) {
      if (i > 1 && i < totalPages) { // Skip if it's the first or last page (we'll add those separately)
        items.push(i);
      }
    }
    
    // Add ellipsis before last page if needed
    if (endPage < totalPages - 1) {
      items.push('ellipsis-end');
    }
    
    // Always show last page if there is one
    if (totalPages > 1) {
      items.push(totalPages);
    }
    
    return items;
  };

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
        isLoadingAuthors={isLoadingAuthors}
        className="mb-8"
      />

      {isLoading || isLoadingAuthors ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6">
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
                  
                  {getPaginationItems().map((item, index) => {
                    if (item === 'ellipsis-start' || item === 'ellipsis-end') {
                      return (
                        <PaginationItem key={`ellipsis-${index}`}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    }
                    
                    const pageNum = item as number;
                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationButton
                          href="#"
                          isActive={currentPage === pageNum}
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(pageNum);
                          }}
                        >
                          {pageNum}
                        </PaginationButton>
                      </PaginationItem>
                    );
                  })}
                  
                  <PaginationItem>
                    <PaginationNext 
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < data.totalPages) setCurrentPage(currentPage + 1);
                      }}
                      className={currentPage === data.totalPages ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
              
              {/* Optional: Show page info */}
              <div className="ml-4 flex items-center text-sm text-muted-foreground">
                Page {currentPage} of {data.totalPages}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
