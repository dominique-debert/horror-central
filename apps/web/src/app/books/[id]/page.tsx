'use client'

import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'

interface BookDetails {
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

const fetchBookDetails = async (slug: string): Promise<BookDetails> => {
  const response = await fetch(`/api/books/${slug}`)
  if (!response.ok) {
    throw new Error('Failed to fetch book details')
  }
  return response.json()
}

export default function BookDetailsPage() {
  const params = useParams()
  const slug = params.id as string

  const { data: book, isLoading, error } = useQuery({
    queryKey: ['book', slug],
    queryFn: () => fetchBookDetails(slug),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading book details...</p>
        </div>
      </div>
    )
  }

  if (error || !book) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold mb-4">Book Not Found</h1>
          <p className="text-gray-600 mb-4">
            The book you&apos;re looking for doesn&apos;t exist or couldn&apos;t be loaded.
          </p>
          <Button onClick={() => window.history.back()}>
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Book Cover */}
          <div className="md:col-span-1">
            <div className="aspect-[2/3] relative rounded-lg overflow-hidden shadow-lg">
              <Image
                src={book.posterUrl || '/images/book-placeholder.jpg'}
                alt={book.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
          </div>

          {/* Book Details */}
          <div className="md:col-span-2">
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold mb-2">{book.title}</h1>
                <p className="text-xl text-gray-600">by {book.author}</p>
              </div>

              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-500">⭐</span>
                  <span className="font-semibold">{book.rating.toFixed(1)}</span>
                </div>
                <Badge variant="secondary">{book.year}</Badge>
                {book.pages > 0 && (
                  <Badge variant="outline">{book.pages} pages</Badge>
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {book.genre.map((g) => (
                    <Badge key={g} variant="default">
                      {g}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-700 leading-relaxed">
                  {book.description}
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <Button onClick={() => window.history.back()} variant="outline">
                  ← Back to Books
                </Button>
                <Button 
                  onClick={() => window.open(`https://openlibrary.org${book.id}`, '_blank')}
                >
                  View on OpenLibrary
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}