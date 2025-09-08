"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MediaCard } from "@/components/ui/MediaCard"
import { useTopRatedBooks } from "@/hooks/useBooks"

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

interface TopRatedBooksProps {
  initialBooks?: BookItem[]
}

export default function TopRatedBooks({ initialBooks = [] }: TopRatedBooksProps) {
  const { data, isLoading, isError, refetch } = useTopRatedBooks(12)
  
  // Use initial data if provided, otherwise use data from the query
  const books = initialBooks.length > 0 ? initialBooks : data || []

  if (isError) {
    return (
      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold text-white mb-4">Top Rated Horror Books</h2>
              <p className="text-red-400">Failed to load books. Please try again later.</p>
            </div>
            <Button 
              onClick={() => refetch()}
              variant="outline" 
              className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
            >
              Retry
            </Button>
          </div>
        </div>
      </section>
    )
  }

  if (isLoading) {
    return (
      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold text-white mb-4">Top Rated Horror Books</h2>
              <p className="text-gray-400 text-lg">
                Discover the most influential and terrifying horror literature that has shaped the genre for generations
              </p>
            </div>
            <Button asChild variant="outline" className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white">
              <Link href="/books">
                View All
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="bg-gray-800 rounded-lg aspect-[2/3] animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (books.length === 0) {
    return (
      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white mb-4">No Books Found</h2>
            <p className="text-gray-400">We couldn't find any top rated books at the moment.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl font-bold text-white mb-4">Top Rated Horror Books</h2>
            <p className="text-gray-400 text-lg">
              Discover the most influential and terrifying horror literature that has shaped the genre for generations
            </p>
          </div>
          <Button asChild variant="outline" className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white">
            <Link href="/books">
              View All
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {books.slice(0, 8).map((book) => (
            <MediaCard
              key={book.id}
              item={{
                id: book.id,
                title: book.title,
                posterUrl: book.posterUrl,
                rating: book.rating,
                year: book.year,
                pages: book.pages,
                author: book.author,
                description: book.description,
                genre: book.genre,
                slug: book.slug
              }}
              type="book"
            />
          ))}
        </div>

      </div>
    </section>
  )
}
