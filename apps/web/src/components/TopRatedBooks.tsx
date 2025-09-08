"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MediaCard } from "@/components/ui/MediaCard"

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

export default function TopRatedBooks() {
  const [books, setBooks] = useState<BookItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setIsLoading(true)
        // Use the same endpoint as the books page
        const response = await fetch('/api/books?type=all-time-top-rated&page=1&sortBy=rating.desc&limit=8')
        if (!response.ok) {
          throw new Error('Failed to fetch books')
        }
        const data = await response.json()
        // Ensure we only show 8 books
        setBooks((data.books || []).slice(0, 8))
        setError(null)
      } catch (err) {
        console.error('Error fetching books:', err)
        // Fallback to the simpler endpoint if the first one fails
        try {
          const fallbackResponse = await fetch('/api/books?type=top-rated&limit=8')
          if (fallbackResponse.ok) {
            const fallbackData = await fallbackResponse.json()
            // Ensure we only show 8 books in fallback as well
            setBooks((fallbackData.books || []).slice(0, 8))
            setError(null)
            return
          }
        } catch (fallbackErr) {
          console.error('Fallback fetch failed:', fallbackErr)
        }
        setError('Failed to load books. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchBooks()
  }, [])

  if (isLoading) {
    return (
      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold text-white mb-4">Top Rated Horror Books</h2>
              <p className="text-gray-400">Discover the most terrifying reads</p>
            </div>
            <Button asChild variant="outline" className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white">
              <Link href="/books">View All</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="h-64 w-full bg-gray-800 rounded-lg animate-pulse" />
                <div className="h-6 w-3/4 bg-gray-800 rounded animate-pulse" />
                <div className="h-4 w-1/2 bg-gray-800 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold text-white mb-4">Top Rated Horror Books</h2>
              <p className="text-red-400">{error}</p>
            </div>
            <Button 
              onClick={() => window.location.reload()}
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

  if (books.length === 0) {
    return (
      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold text-white mb-4">Top Rated Horror Books</h2>
              <p className="text-gray-400">No books found. Please try again later.</p>
            </div>
            <Button asChild variant="outline" className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white">
              <Link href="/books">View All</Link>
            </Button>
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
            <p className="text-gray-400">Discover the most terrifying reads</p>
          </div>
          <Button asChild variant="outline" className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white">
            <Link href="/books">View All</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => (
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
                genre: book.genre?.length ? book.genre : ['Horror'],
                slug: book.slug || book.id
              }}
              type="book"
            />
          ))}
        </div>
      </div>
    </section>
  )
}
