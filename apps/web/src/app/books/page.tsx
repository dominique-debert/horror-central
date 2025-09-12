'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { SearchAndFilterBooks } from '@/components/SearchAndFilterBooks'
import { BookCard } from '@/components/BookCard'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// Types
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

// API functions for TanStack Query
const fetchBooks = async ({ 
  page = 1, 
  minYear, 
  maxYear, 
  author, 
  limit = 20 
}: {
  page?: number;
  minYear?: number;
  maxYear?: number;
  author?: string;
  limit?: number;
}) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  })

  if (minYear) params.append('minYear', minYear.toString())
  if (maxYear) params.append('maxYear', maxYear.toString())
  if (author && author !== 'all') params.append('author', author)

  const response = await fetch(`/api/books?${params.toString()}`)
  if (!response.ok) {
    throw new Error('Failed to fetch books')
  }
  return response.json()
}

const fetchAuthors = async ({ minYear }: { minYear?: number }) => {
  const params = new URLSearchParams({
    type: 'unique-authors',
    limit: '1000',
  })

  if (minYear) params.append('minYear', minYear.toString())

  const response = await fetch(`/api/books?${params.toString()}`)
  if (!response.ok) {
    throw new Error('Failed to fetch authors')
  }
  const data = await response.json()
  return data.authors || []
}

export default function BooksPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // State for filters and pagination
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDecade, setSelectedDecade] = useState('all')
  const [selectedAuthor, setSelectedAuthor] = useState('all')
  const [currentPage, setCurrentPage] = useState(() => {
    const page = searchParams.get('page')
    return page ? parseInt(page) : 1
  })

  const itemsPerPage = 20

  // Available decades for filter
  const availableDecades = [
    '2020s', '2010s', '2000s', '1990s', '1980s', '1970s', '1960s', '1950s', '1940s', '1930s', '1920s', '1910s', '1900s'
  ]

  // Fetch books using TanStack Query
  const { data: booksData, isLoading, error } = useQuery({
    queryKey: ['books', currentPage, selectedDecade, selectedAuthor],
    queryFn: () => fetchBooks({
      page: currentPage,
      minYear: selectedDecade && selectedDecade !== 'all' ? parseInt(selectedDecade) : undefined,
      author: selectedAuthor !== 'all' ? selectedAuthor : undefined,
      limit: itemsPerPage,
    }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })

  // Fetch authors using TanStack Query
  const { data: authorsData, isLoading: isLoadingAuthors } = useQuery({
    queryKey: ['authors', selectedDecade],
    queryFn: () => fetchAuthors({
      minYear: selectedDecade && selectedDecade !== 'all' ? parseInt(selectedDecade) : undefined,
    }),
    staleTime: 15 * 60 * 1000, // 15 minutes
  })

  const authors = authorsData || []
  const data = booksData

  // Filter books based on search term (client-side filtering)
  const filteredBooks = data?.books ? data.books.filter((book: BookItem) => {
    if (!searchTerm) return true
    return book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           book.author.toLowerCase().includes(searchTerm.toLowerCase())
  }) : []

  // Handle URL parameter updates
  useEffect(() => {
    const params = new URLSearchParams()
    if (currentPage > 1) params.set('page', currentPage.toString())
    if (selectedDecade !== 'all') params.set('decade', selectedDecade)
    if (selectedAuthor !== 'all') params.set('author', selectedAuthor)
    
    const newUrl = params.toString() ? `/books?${params.toString()}` : '/books'
    router.replace(newUrl, { scroll: false })
  }, [currentPage, selectedDecade, selectedAuthor, router])

  // Handle filter changes - reset to page 1
  const handleDecadeChange = (decade: string) => {
    setSelectedDecade(decade)
    setCurrentPage(1)
  }

  const handleAuthorChange = (author: string) => {
    setSelectedAuthor(author)
    setCurrentPage(1)
  }

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Error Loading Books</h1>
          <p className="text-gray-600 mb-4">
            We encountered an error while loading the books. Please try again later.
          </p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Horror Books</h1>
        <p className="text-xl text-gray-600">
          Discover spine-chilling tales and terrifying stories from the world of horror literature
        </p>
      </div>

      <SearchAndFilterBooks
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedDecade={selectedDecade}
        onDecadeChange={handleDecadeChange}
        selectedAuthor={selectedAuthor}
        onAuthorChange={handleAuthorChange}
        availableDecades={availableDecades}
        availableAuthors={authors}
        isLoadingAuthors={isLoadingAuthors}
        className="mb-8"
      />

      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading books...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-8">
            {filteredBooks
              .map((book: BookItem) => ({
                id: book.id,
                title: book.title,
                image: book.posterUrl && book.posterUrl !== '/images/book-placeholder.jpg' 
                  ? book.posterUrl 
                  : '/images/book-placeholder.jpg',
                rating: book.rating,
                year: book.year,
                author: book.author,
                pages: book.pages,
                href: `/books/${book.slug}`
              }))
              .map((book: { id: string; title: string; image: string; rating: number; year: number; author: string; pages: number; href: string }) => (
                <BookCard
                  key={book.id}
                  id={book.id}
                  title={book.title}
                  imageUrl={book.image}
                  rating={book.rating}
                  year={book.year}
                  author={book.author}
                  pages={book.pages}
                  href={book.href}
                />
              ))}
          </div>

          {data && data.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2">
              <Button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
              >
                <ChevronLeft className="mr-1" />
              </Button>

              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, data.totalPages) }, (_, i) => {
                  const pageNum = currentPage <= 3 
                    ? i + 1 
                    : Math.max(1, Math.min(currentPage - 2 + i, data.totalPages - 4 + i))
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? 'default' : 'outline'}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  )
                })}
              </div>

              <Button
                onClick={() => handlePageChange(Math.min(data.totalPages, currentPage + 1))}
                className={currentPage === data.totalPages ? 'pointer-events-none opacity-50' : ''}
              >
                <ChevronRight className="ml-1" />
              </Button>
            </div>
          )}

          {data && (
            <div className="text-center mt-4 text-gray-600">
              Page {currentPage} of {data.totalPages}
            </div>
          )}
        </>
      )}
    </div>
  )
}