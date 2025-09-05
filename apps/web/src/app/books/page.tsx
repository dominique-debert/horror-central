'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Star, Calendar, User, BookOpen, Loader2 } from 'lucide-react'
// Removed openLibraryClient import - using API route instead

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
  slug: string
}

interface BooksResponse {
  books: BookItem[]
  total: number
  page: number
  totalPages: number
}

export default function BooksPage() {
  const [books, setBooks] = useState<BookItem[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  // Filter states
  const [selectedDecade, setSelectedDecade] = useState<string>('All')
  const [selectedAuthor, setSelectedAuthor] = useState<string>('All')
  const [sortBy, setSortBy] = useState<'rating.desc' | 'first_publish_year.desc' | 'title.asc'>('rating.desc')

  // Available filter options
  const decades = ['All', '1970s', '1980s', '1990s', '2000s', '2010s', '2020s']
  const authors = ['All', 'Stephen King', 'H.P. Lovecraft', 'Edgar Allan Poe', 'Clive Barker', 'Anne Rice', 'Bram Stoker']
  const sortOptions = [
    { value: 'rating.desc' as const, label: 'Highest Rated' },
    { value: 'first_publish_year.desc' as const, label: 'Newest First' },
    { value: 'title.asc' as const, label: 'Title A-Z' }
  ]

  const fetchBooks = async (page: number = 1, reset: boolean = false) => {
    try {
      if (page === 1) {
        setLoading(true)
        setError(null)
      } else {
        setLoadingMore(true)
      }

      // Build URL parameters
      const searchParams = new URLSearchParams({
        type: 'all-time-top-rated',
        page: page.toString(),
        sortBy
      })

      // Add decade filter
      if (selectedDecade !== 'All') {
        const decade = parseInt(selectedDecade.replace('s', ''))
        searchParams.set('minYear', decade.toString())
        searchParams.set('maxYear', (decade + 9).toString())
      }

      // Add author filter
      if (selectedAuthor !== 'All') {
        searchParams.set('author', selectedAuthor)
      }

      const response = await fetch(`/api/books?${searchParams.toString()}`)
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`)
      }

      const data: BooksResponse = await response.json()
      
      if (reset || page === 1) {
        setBooks(data.books)
      } else {
        setBooks(prev => [...prev, ...data.books])
      }
      
      setCurrentPage(data.page)
      setTotalPages(data.totalPages)
      setHasMore(data.page < data.totalPages)
      
    } catch (err) {
      console.error('Error fetching books:', err)
      setError('Failed to load books. Please try again.')
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  // Initial load
  useEffect(() => {
    fetchBooks(1, true)
  }, [selectedDecade, selectedAuthor, sortBy])

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchBooks(currentPage + 1, false)
    }
  }

  const handleRetry = () => {
    setError(null)
    fetchBooks(1, true)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Top Rated Horror Books</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Discover the most acclaimed horror literature of all time, from classic gothic novels to modern psychological thrillers.
          </p>
        </div>

        {/* Loading Skeletons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 20 }).map((_, index) => (
            <Card key={index} className="bg-gray-800 border-gray-700 animate-pulse">
              <div className="aspect-[2/3] bg-gray-700 rounded-t-lg"></div>
              <CardContent className="p-4">
                <div className="h-4 bg-gray-700 rounded mb-2"></div>
                <div className="h-3 bg-gray-700 rounded mb-2 w-3/4"></div>
                <div className="h-3 bg-gray-700 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Top Rated Horror Books</h1>
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-6 max-w-md mx-auto">
            <p className="text-red-400 mb-4">{error}</p>
            <Button onClick={handleRetry} variant="outline" className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-4">Top Rated Horror Books</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Discover the most acclaimed horror literature of all time, from classic gothic novels to modern psychological thrillers.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 space-y-4">
        {/* Decade Filter */}
        <div>
          <h3 className="text-white font-semibold mb-2">Publication Decade</h3>
          <div className="flex flex-wrap gap-2">
            {decades.map((decade) => (
              <Button
                key={decade}
                variant={selectedDecade === decade ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedDecade(decade)}
                className={selectedDecade === decade 
                  ? "bg-red-600 hover:bg-red-700 text-white" 
                  : "border-gray-600 text-gray-300 hover:bg-gray-700"
                }
              >
                {decade}
              </Button>
            ))}
          </div>
        </div>

        {/* Author Filter */}
        <div>
          <h3 className="text-white font-semibold mb-2">Author</h3>
          <div className="flex flex-wrap gap-2">
            {authors.map((author) => (
              <Button
                key={author}
                variant={selectedAuthor === author ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedAuthor(author)}
                className={selectedAuthor === author 
                  ? "bg-red-600 hover:bg-red-700 text-white" 
                  : "border-gray-600 text-gray-300 hover:bg-gray-700"
                }
              >
                {author}
              </Button>
            ))}
          </div>
        </div>

        {/* Sort Options */}
        <div>
          <h3 className="text-white font-semibold mb-2">Sort By</h3>
          <div className="flex flex-wrap gap-2">
            {sortOptions.map((option) => (
              <Button
                key={option.value}
                variant={sortBy === option.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy(option.value)}
                className={sortBy === option.value 
                  ? "bg-red-600 hover:bg-red-700 text-white" 
                  : "border-gray-600 text-gray-300 hover:bg-gray-700"
                }
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-400">
          Showing {books.length} books
          {selectedDecade !== 'All' && ` from the ${selectedDecade}`}
          {selectedAuthor !== 'All' && ` by ${selectedAuthor}`}
        </p>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {books.map((book, index) => (
          <Card key={`${book.id}-${index}`} className="bg-gray-800 border-gray-700 hover:border-red-500 transition-colors group">
            <div className="relative">
              <img
                src={book.posterUrl}
                alt={book.title}
                className="w-full aspect-[2/3] object-cover rounded-t-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = '/placeholder-book-cover.jpg'
                }}
              />
              <div className="absolute top-2 right-2">
                <Badge variant="secondary" className="bg-black/70 text-white flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  {book.rating.toFixed(1)}
                </Badge>
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-white mb-2 line-clamp-2 group-hover:text-red-400 transition-colors">
                {book.title}
              </h3>
              <div className="space-y-1 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  <span>{book.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{book.year}</span>
                </div>
                {book.pages > 0 && (
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-3 h-3" />
                    <span>{book.pages} pages</span>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {book.genre.slice(0, 2).map((g) => (
                  <Badge key={g} variant="outline" className="text-xs border-gray-600 text-gray-300">
                    {g}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center">
          <Button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-2"
          >
            {loadingMore ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading More Books...
              </>
            ) : (
              'View More Books'
            )}
          </Button>
        </div>
      )}

      {/* No More Results */}
      {!hasMore && books.length > 0 && (
        <div className="text-center text-gray-400">
          <p>You've reached the end of the results.</p>
        </div>
      )}

      {/* No Results */}
      {books.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg mb-4">No books found matching your criteria.</p>
          <Button
            onClick={() => {
              setSelectedDecade('All')
              setSelectedAuthor('All')
              setSortBy('rating.desc')
            }}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
}
